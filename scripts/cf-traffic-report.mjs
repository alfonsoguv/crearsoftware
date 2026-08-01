/**
 * Informe de tráfico real desde la API GraphQL de Cloudflare.
 *
 * Complementa a los otros dos informes y corrige sus puntos ciegos:
 * - Search Console solo ve el tráfico que llega desde Google.
 * - scripts/geo-agents-report.mjs cuenta rastreadores de IA en KV, pero de forma
 *   aproximada y solo hacia delante (no tiene histórico).
 *
 * Cloudflare ve TODAS las peticiones que llegan al borde, con su user-agent y su
 * código de respuesta, y guarda histórico. Es la fuente exacta para responder a
 * "¿los agentes de IA leen el blog?" y a "¿alguien recibe errores?".
 *
 * Requiere en .dev.vars un CLOUDFLARE_API_TOKEN con permiso de lectura de zona y
 * de analíticas de zona.
 *
 * Uso:
 *   node scripts/cf-traffic-report.mjs [--days=7] [--zone=crearsoftware.com]
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadLocalEnv } from './lib/load-local-env.mjs';

loadLocalEnv();

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const API = 'https://api.cloudflare.com/client/v4';
const DEFAULT_DAYS = 7;
const DEFAULT_ZONE = 'crearsoftware.com';

// La API limita httpRequestsAdaptiveGroups a ventanas de un día en el plan Free,
// así que se consulta día a día y se agrega aquí.
const MAX_DAYS = 30;

const AGENTES = [
  ['OAI-SearchBot', /OAI-SearchBot/i, 'Búsqueda generativa'],
  ['ChatGPT-User', /ChatGPT-User/i, 'Agentes en vivo'],
  ['GPTBot', /GPTBot/i, 'Entrenamiento'],
  ['Claude-SearchBot', /Claude-SearchBot/i, 'Búsqueda generativa'],
  ['Claude-User', /Claude-User/i, 'Agentes en vivo'],
  ['ClaudeBot', /ClaudeBot|anthropic-ai/i, 'Entrenamiento'],
  ['Perplexity-User', /Perplexity-User/i, 'Agentes en vivo'],
  ['PerplexityBot', /PerplexityBot/i, 'Búsqueda generativa'],
  ['MistralAI-User', /MistralAI/i, 'Agentes en vivo'],
  ['cohere-ai', /cohere-ai/i, 'Entrenamiento'],
  ['CCBot', /CCBot/i, 'Entrenamiento'],
  ['Bytespider', /Bytespider/i, 'Entrenamiento'],
  ['Amazonbot', /Amazonbot/i, 'Entrenamiento'],
  ['Applebot', /Applebot/i, 'Entrenamiento'],
  ['Meta-ExternalAgent', /Meta-ExternalAgent|facebookexternalhit/i, 'Entrenamiento'],
  ['Googlebot', /Googlebot/i, 'Buscador clásico'],
  ['Bingbot', /bingbot/i, 'Buscador clásico'],
];

function parseArgs(argv) {
  const options = {};
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [key, value] = arg.slice(2).split('=');
    options[key] = value ?? 'true';
  }
  return options;
}

function isoDate(offsetDays) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

function identifica(userAgent) {
  return AGENTES.find(([, re]) => re.test(userAgent || '')) || null;
}

async function graphql(token, query) {
  const response = await fetch(`${API}/graphql`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const body = await response.json();
  if (body.errors?.length) {
    throw new Error(`GraphQL: ${body.errors.map((e) => e.message).join(' | ')}`);
  }
  return body.data;
}

async function resolveZone(token, name) {
  const response = await fetch(`${API}/zones?name=${encodeURIComponent(name)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await response.json();
  if (!body.success) {
    throw new Error(`No se pudo listar zonas: ${JSON.stringify(body.errors).slice(0, 200)}`);
  }
  if (!body.result?.length) {
    throw new Error(
      `El token no ve la zona ${name}. Necesita permiso Zone:Read sobre la cuenta correcta.`,
    );
  }
  return body.result[0].id;
}

async function fetchDay(token, zoneId, date) {
  const data = await graphql(
    token,
    `query { viewer { zones(filter: { zoneTag: "${zoneId}" }) {
      httpRequestsAdaptiveGroups(
        limit: 5000
        filter: { datetime_geq: "${date}T00:00:00Z", datetime_leq: "${date}T23:59:59Z" }
        orderBy: [count_DESC]
      ) { count dimensions { userAgent edgeResponseStatus } }
    } } }`,
  );
  return data.viewer.zones[0]?.httpRequestsAdaptiveGroups ?? [];
}

function renderMarkdown(resumen) {
  const { dias, desde, hasta, totalPeticiones, porAgente, porFamilia, porDia, estados, errores5xx } = resumen;
  const lines = [];

  lines.push('# Trafico real en el borde (Cloudflare)');
  lines.push('');
  lines.push(`Generado: ${new Date().toISOString()}`);
  lines.push(`Ventana: ${desde} -> ${hasta} (${dias} dias)`);
  lines.push(`Peticiones totales: ${totalPeticiones}`);
  lines.push('');
  lines.push('Fuente exacta: Cloudflare ve todas las peticiones al borde, no solo las que');
  lines.push('llegan desde Google. Complementa a gsc-seo-report (solo Google) y a');
  lines.push('geo-agents-report (aproximado y sin historico).');
  lines.push('');

  lines.push('## Rastreadores por familia');
  lines.push('');
  lines.push('| Familia | Peticiones | Por que importa |');
  lines.push('| --- | ---: | --- |');
  const why = {
    'Búsqueda generativa': 'Indexan para que el modelo te cite al responder',
    'Agentes en vivo': 'Visitan porque alguien pregunta ahora: generan la cita',
    'Entrenamiento': 'Alimentan el conocimiento base del modelo',
    'Buscador clásico': 'SEO tradicional, referencia de comparacion',
  };
  for (const [familia, n] of Object.entries(porFamilia).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${familia} | ${n} | ${why[familia] || '-'} |`);
  }
  lines.push('');

  lines.push('## Rastreadores por agente');
  lines.push('');
  lines.push('| Agente | Familia | Peticiones | Errores |');
  lines.push('| --- | --- | ---: | ---: |');
  for (const [nombre, info] of Object.entries(porAgente).sort((a, b) => b[1].total - a[1].total)) {
    lines.push(`| ${nombre} | ${info.familia} | ${info.total} | ${info.errores} |`);
  }
  lines.push('');

  lines.push('## Evolucion diaria de agentes de IA');
  lines.push('');
  lines.push('| Fecha | Peticiones de IA |');
  lines.push('| --- | ---: |');
  for (const [fecha, n] of Object.entries(porDia).sort()) lines.push(`| ${fecha} | ${n} |`);
  lines.push('');

  lines.push('## Codigos de respuesta');
  lines.push('');
  lines.push('| Codigo | Peticiones | % |');
  lines.push('| --- | ---: | ---: |');
  for (const [codigo, n] of Object.entries(estados).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    lines.push(`| ${codigo} | ${n} | ${((n / totalPeticiones) * 100).toFixed(1)}% |`);
  }
  lines.push('');

  if (errores5xx.length) {
    lines.push('## Errores 5xx: quien los recibe');
    lines.push('');
    lines.push('Solo importan si los sufre un buscador o un agente. Si el user-agent es un');
    lines.push('escaner, es ruido.');
    lines.push('');
    lines.push('| User-agent | Peticiones | Es buscador/agente |');
    lines.push('| --- | ---: | --- |');
    for (const e of errores5xx.slice(0, 10)) {
      lines.push(`| ${e.userAgent.slice(0, 60)} | ${e.count} | ${e.esBot ? '**SI**' : 'no'} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) throw new Error('Falta CLOUDFLARE_API_TOKEN en .dev.vars');

  const dias = Math.min(Number.parseInt(args.days ?? '', 10) || DEFAULT_DAYS, MAX_DAYS);
  const zoneName = args.zone || DEFAULT_ZONE;
  const zoneId = await resolveZone(token, zoneName);

  console.log(`Zona ${zoneName} (${zoneId}), ultimos ${dias} dias`);

  const porAgente = {};
  const porFamilia = {};
  const porDia = {};
  const estados = {};
  const cinco = {};
  let totalPeticiones = 0;

  for (let i = 1; i <= dias; i += 1) {
    const date = isoDate(i);
    let rows;
    try {
      rows = await fetchDay(token, zoneId, date);
    } catch (error) {
      console.warn(`  ${date}: ${error.message}`);
      continue;
    }

    porDia[date] = 0;
    for (const row of rows) {
      const ua = row.dimensions.userAgent || '';
      const status = Number(row.dimensions.edgeResponseStatus);
      const n = row.count;

      totalPeticiones += n;
      estados[status] = (estados[status] || 0) + n;

      if (status >= 500) cinco[ua] = (cinco[ua] || 0) + n;

      const match = identifica(ua);
      if (!match) continue;
      const [nombre, , familia] = match;

      porAgente[nombre] = porAgente[nombre] || { familia, total: 0, errores: 0 };
      porAgente[nombre].total += n;
      if (status >= 400) porAgente[nombre].errores += n;

      porFamilia[familia] = (porFamilia[familia] || 0) + n;
      if (familia !== 'Buscador clásico') porDia[date] += n;
    }
    console.log(`  ${date}: ${rows.reduce((s, r) => s + r.count, 0)} peticiones`);
  }

  const errores5xx = Object.entries(cinco)
    .map(([userAgent, count]) => ({ userAgent, count, esBot: Boolean(identifica(userAgent)) }))
    .sort((a, b) => b.count - a.count);

  const resumen = {
    generadoEn: new Date().toISOString(),
    zona: zoneName,
    dias,
    desde: isoDate(dias),
    hasta: isoDate(1),
    totalPeticiones,
    porFamilia,
    porAgente,
    porDia,
    estados,
    errores5xx,
  };

  const today = new Date().toISOString().slice(0, 10);
  await mkdir(DATA_DIR, { recursive: true });
  const markdown = renderMarkdown(resumen);
  const targets = [
    [`cf-traffic-${today}.json`, JSON.stringify(resumen, null, 2)],
    ['cf-traffic-latest.json', JSON.stringify(resumen, null, 2)],
    [`cf-traffic-${today}.md`, markdown],
    ['cf-traffic-latest.md', markdown],
  ];
  for (const [name, contents] of targets) {
    await writeFile(path.join(DATA_DIR, name), contents, 'utf8');
  }

  const ia = Object.entries(porFamilia)
    .filter(([f]) => f !== 'Buscador clásico')
    .reduce((s, [, n]) => s + n, 0);
  console.log('');
  console.log(`Peticiones de rastreadores de IA en ${dias} dias: ${ia}`);
  console.log('');
  console.log('Generated files:');
  for (const [name] of targets) console.log(`- data/${name}`);
}

await main();
