/**
 * GEO: informe de rastreadores de IA.
 *
 * Lee los contadores que agrega functions/_middleware.ts a través del endpoint
 * público /api/bots y genera data/geo-agents-<fecha>.md|json.
 *
 * Es la única métrica fiable de si los agentes leen el sitio: los motores
 * generativos no ejecutan JavaScript, así que ninguna analítica de cliente los ve.
 *
 * Uso:
 *   node scripts/geo-agents-report.mjs [--days=28] [--base=https://crearsoftware.com]
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const DEFAULT_BASE = 'https://crearsoftware.com';
const DEFAULT_DAYS = 28;

// Familias de agentes, para separar quién entrena, quién indexa para búsqueda
// y quién visita en vivo porque un usuario está preguntando ahora mismo.
const FAMILIES = {
  'Búsqueda generativa': ['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot', 'Bingbot'],
  'Agentes en vivo': ['ChatGPT-User', 'Claude-User', 'Perplexity-User', 'MistralAI-User'],
  'Entrenamiento': ['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended', 'Applebot-Extended', 'Meta-ExternalAgent', 'Amazonbot', 'cohere-ai'],
  'Buscador clásico': ['Googlebot'],
};

function parseArgs(argv) {
  const options = {};
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [key, value] = arg.slice(2).split('=');
    options[key] = value ?? 'true';
  }
  return options;
}

function familyOf(agent) {
  for (const [family, members] of Object.entries(FAMILIES)) {
    if (members.includes(agent)) return family;
  }
  return 'Otros';
}

// Formato servido por familia. La pregunta que responde es si los agentes usan
// de verdad los gemelos Markdown: es un experimento, no una practica con
// evidencia publica. Los hits anteriores a la instrumentacion llegan como
// `unknown` y se declaran aparte para no confundirlos con HTML.
function renderFormats(data) {
  const formats = data.formats;
  if (!formats || !Object.keys(formats).length) return [];

  const byFamily = {};
  for (const [agent, counts] of Object.entries(formats)) {
    const family = familyOf(agent);
    byFamily[family] = byFamily[family] || { md: 0, llms: 0, html: 0, unknown: 0 };
    for (const [f, n] of Object.entries(counts)) {
      byFamily[family][f] = (byFamily[family][f] || 0) + n;
    }
  }

  const totalKnown = Object.values(byFamily).reduce(
    (s, c) => s + c.md + c.llms + c.html, 0,
  );
  if (totalKnown === 0) {
    return [
      '## Formato servido (md vs HTML)',
      '',
      'Instrumentacion recien desplegada: todavia no hay ninguna peticion medida.',
      '',
    ];
  }

  const lines = [];
  lines.push('## Formato servido (md vs HTML)');
  lines.push('');
  lines.push('| Familia | Markdown | llms.txt | HTML | % Markdown | Sin medir |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const [family, c] of Object.entries(byFamily)) {
    const known = c.md + c.llms + c.html;
    const pct = known ? ((c.md / known) * 100).toFixed(1) : '-';
    lines.push(`| ${family} | ${c.md} | ${c.llms} | ${c.html} | ${pct}% | ${c.unknown} |`);
  }
  lines.push('');
  lines.push('`Sin medir` son peticiones contabilizadas antes de instrumentar el formato');
  lines.push('(2026-08-09). No se imputan a HTML: se declaran aparte.');
  lines.push('');
  return lines;
}

function renderMarkdown(data, days, base) {
  const lines = [];
  lines.push('# Informe de rastreadores de IA (GEO)');
  lines.push('');
  lines.push(`Fecha de generacion: ${data.generatedAt}`);
  lines.push(`Origen: ${base}`);
  lines.push(`Ventana: ultimos ${days} dias`);
  lines.push(`Peticiones de agentes contabilizadas: ${data.totalHits}`);
  lines.push('');

  if (data.totalHits === 0) {
    lines.push('## Sin datos');
    lines.push('');
    lines.push('Ningun rastreador de IA registrado en la ventana. Causas posibles:');
    lines.push('');
    lines.push('- El binding CS_KV se acaba de enlazar y aun no ha pasado trafico.');
    lines.push('- Los agentes no estan visitando el sitio (problema real de descubrimiento).');
    lines.push('');
    return lines.join('\n');
  }

  const byFamily = {};
  for (const [agent, hits] of Object.entries(data.totals)) {
    const family = familyOf(agent);
    byFamily[family] = byFamily[family] || {};
    byFamily[family][agent] = hits;
  }

  lines.push('## Por familia');
  lines.push('');
  lines.push('| Familia | Peticiones | Por que importa |');
  lines.push('| --- | --- | --- |');
  const why = {
    'Búsqueda generativa': 'Construyen el indice que el modelo consulta al responder',
    'Agentes en vivo': 'Visitan porque un usuario esta preguntando ahora: generan la cita',
    'Entrenamiento': 'Alimentan el conocimiento base del modelo',
    'Buscador clásico': 'SEO tradicional, referencia de comparacion',
    'Otros': '-',
  };
  for (const [family, agents] of Object.entries(byFamily)) {
    const total = Object.values(agents).reduce((s, n) => s + n, 0);
    lines.push(`| ${family} | ${total} | ${why[family] || '-'} |`);
  }
  lines.push('');

  lines.push('## Por agente');
  lines.push('');
  lines.push('| Agente | Familia | Peticiones |');
  lines.push('| --- | --- | --- |');
  for (const [agent, hits] of Object.entries(data.totals).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${agent} | ${familyOf(agent)} | ${hits} |`);
  }
  lines.push('');

  if (data.topPaths?.length) {
    lines.push('## Paginas mas leidas por agentes');
    lines.push('');
    lines.push('| Pagina | Peticiones |');
    lines.push('| --- | --- |');
    for (const { path: p, hits } of data.topPaths.slice(0, 20)) {
      lines.push(`| ${p} | ${hits} |`);
    }
    lines.push('');
  }

  const fmtRows = renderFormats(data);
  if (fmtRows.length) lines.push(...fmtRows);

  lines.push('## Caveats');
  lines.push('');
  lines.push('- El conteo es aproximado por diseno: durante una rafaga concurrente varias');
  lines.push('  peticiones leen el mismo contador y el resultado se queda corto. Sirve para');
  lines.push('  tendencia, no para auditoria exacta.');
  lines.push('- Solo se cuentan peticiones de paginas (HTML, llms.txt), no de assets.');
  lines.push('- El user-agent es declarado por el cliente y se puede falsificar.');
  lines.push('- OJO: comprobar a mano que los agentes no estan bloqueados con');
  lines.push('  `curl -A "ChatGPT-User" https://crearsoftware.com/` INYECTA un hit en la');
  lines.push('  familia "agentes en vivo", que mueve entre 1 y 18 peticiones al dia. Usa');
  lines.push('  `/robots.txt` para ese chequeo: responde igual y no entra en el contador.');
  lines.push('- La ventana de 28 dias solo esta llena si el contador lleva 28 dias activo.');
  lines.push('  Arranco el 2026-08-01: hasta el 2026-08-29 los totales acumulados suben');
  lines.push('  solos y NO son comparables entre semanas. Compara la serie diaria.');
  lines.push('');

  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const base = (args.base || DEFAULT_BASE).replace(/\/$/, '');
  const days = Number.parseInt(args.days ?? '', 10) || DEFAULT_DAYS;
  const endpoint = `${base}/api/bots?days=${days}`;

  console.log(`Leyendo contadores de agentes desde ${endpoint}`);
  const response = await fetch(endpoint);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `El endpoint respondio ${response.status}. ` +
      `Si es 503, falta enlazar el namespace KV 'CS_KV' al proyecto de Pages. Respuesta: ${body.slice(0, 200)}`,
    );
  }

  const data = await response.json();
  if (!data.ok) throw new Error(`Respuesta no valida: ${JSON.stringify(data).slice(0, 200)}`);

  const today = new Date().toISOString().slice(0, 10);
  await mkdir(DATA_DIR, { recursive: true });

  // Se etiqueta con la ventana que aplicó el endpoint, no con la pedida: solo
  // admite 7, 28 y 90, y cualquier otro valor cae en 28. Usar `days` aquí
  // rotularía "ultimos 14 dias" un informe con datos de 28.
  const markdown = renderMarkdown(data, data.days ?? days, base);
  const targets = [
    [`geo-agents-${today}.json`, JSON.stringify(data, null, 2)],
    ['geo-agents-latest.json', JSON.stringify(data, null, 2)],
    [`geo-agents-${today}.md`, markdown],
    ['geo-agents-latest.md', markdown],
  ];

  for (const [name, contents] of targets) {
    await writeFile(path.join(DATA_DIR, name), contents, 'utf8');
  }

  console.log('');
  console.log(`Peticiones de agentes en ${data.days ?? days} dias: ${data.totalHits}`);
  console.log('');
  console.log('Generated files:');
  for (const [name] of targets) console.log(`- data/${name}`);
}

await main();
