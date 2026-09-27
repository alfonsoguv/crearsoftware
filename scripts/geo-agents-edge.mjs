/**
 * Contador de agentes de IA desde el borde de Cloudflare (GraphQL), en paralelo
 * al contador propio de KV (functions/_middleware.ts + /api/bots).
 *
 * Es el primer paso del issue #35: antes de borrar recordHit, /api/bots y
 * AI_AGENTS hay que correr los dos contadores a la vez 2-3 semanas y ver que
 * cuentan lo mismo. Además tiene una virtud que el de KV no tiene: no se rompe
 * si un despliegue borra un binding (pasó del 20 al 26-sep-2026: seis días sin
 * datos en KV que este script recupera del borde).
 *
 * Aplica EXACTAMENTE los mismos criterios que el middleware, para que las dos
 * series sean comparables:
 * - mismo orden de patrones de user-agent (gana la primera coincidencia);
 * - solo respuestas 200 y 304;
 * - solo páginas: rutas que acaban en "/" o ".html", los ".md" y llms*.txt.
 *
 * Dos límites medidos el 17-ago-2026 que condicionan el diseño:
 * - retención de 8 días: por eso se ACUMULA en data/geo-agents-edge-history.json
 *   (versionado) y cada ejecución solo añade los días que faltan. Si el ciclo
 *   semanal se salta más de una semana, esos días se pierden.
 * - una consulta por día de datos.
 *
 * Caveat: httpRequestsAdaptiveGroups es un dataset con muestreo adaptativo. Con
 * el volumen de este sitio el muestreo es prácticamente 1:1, pero el recuento
 * es una estimación, igual que el de KV (que pierde hits en ráfagas).
 *
 * Uso:
 *   node scripts/geo-agents-edge.mjs            # añade los días que falten
 *   node scripts/geo-agents-edge.mjs --refresh  # reconsulta toda la retención
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadLocalEnv } from './lib/load-local-env.mjs';

loadLocalEnv();

const ROOT = process.cwd();
const HISTORY = path.join(ROOT, 'data', 'geo-agents-edge-history.json');
const API = 'https://api.cloudflare.com/client/v4';
const ZONE = 'crearsoftware.com';
const RETENTION_DAYS = 8;

// Copia de AI_AGENTS en functions/_middleware.ts. Si cambia allí, cambia aquí.
const AI_AGENTS = [
  ['OAI-SearchBot', /OAI-SearchBot/i],
  ['ChatGPT-User', /ChatGPT-User/i],
  ['GPTBot', /GPTBot/i],
  ['Claude-SearchBot', /Claude-SearchBot/i],
  ['Claude-User', /Claude-User/i],
  ['ClaudeBot', /ClaudeBot|anthropic-ai/i],
  ['Perplexity-User', /Perplexity-User/i],
  ['PerplexityBot', /PerplexityBot/i],
  ['Google-Extended', /Google-Extended/i],
  ['Applebot-Extended', /Applebot-Extended/i],
  ['Meta-ExternalAgent', /Meta-ExternalAgent|FacebookBot/i],
  ['Amazonbot', /Amazonbot/i],
  ['MistralAI-User', /MistralAI/i],
  ['cohere-ai', /cohere-ai/i],
  ['CCBot', /CCBot/i],
  ['Bingbot', /bingbot/i],
  ['Googlebot', /Googlebot/i],
];

// Prefiltro en el servidor: sin él, el día trae miles de grupos de navegadores.
// Es más laxo que AI_AGENTS; la clasificación fina se hace aquí.
// OJO: userAgent_like distingue mayúsculas (Meta se anuncia como
// "meta-externalagent" y se perdía entero), así que va también en minúsculas.
const UA_LIKES = [
  ...new Set(
    [
      'OAI-SearchBot', 'ChatGPT', 'GPTBot', 'Claude', 'anthropic', 'Perplexity',
      'Google-Extended', 'Applebot-Extended', 'Meta-ExternalAgent', 'FacebookBot',
      'Amazonbot', 'MistralAI', 'cohere-ai', 'CCBot', 'bingbot', 'Googlebot',
    ].flatMap((s) => [s, s.toLowerCase()]),
  ),
];

function identifyAgent(userAgent) {
  for (const [name, pattern] of AI_AGENTS) {
    if (pattern.test(userAgent || '')) return name;
  }
  return null;
}

function formatOf(pathname) {
  if (pathname.endsWith('.md')) return 'md';
  if (pathname === '/llms.txt' || pathname === '/llms-full.txt') return 'llms';
  if (pathname.endsWith('/') || pathname.endsWith('.html')) return 'html';
  return null;
}

function isoDate(offsetDays) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

async function cf(token, url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  });
  return response.json();
}

async function zoneId(token) {
  const body = await cf(token, `${API}/zones?name=${ZONE}`);
  if (!body.success || !body.result?.length) {
    throw new Error(`El token no ve la zona ${ZONE} (necesita Zone:Read y Analytics:Read).`);
  }
  return body.result[0].id;
}

async function fetchDay(token, zone, date) {
  const or = UA_LIKES.map((s) => `{ userAgent_like: "%${s}%" }`).join(', ');
  const query = `query { viewer { zones(filter: { zoneTag: "${zone}" }) {
    httpRequestsAdaptiveGroups(
      limit: 10000
      filter: { datetime_geq: "${date}T00:00:00Z", datetime_leq: "${date}T23:59:59Z", OR: [${or}] }
    ) { count dimensions { userAgent clientRequestPath edgeResponseStatus } }
  } } }`;
  const body = await cf(token, `${API}/graphql`, { method: 'POST', body: JSON.stringify({ query }) });
  if (body.errors?.length) throw new Error(`GraphQL ${date}: ${body.errors.map((e) => e.message).join(' | ')}`);
  const groups = body.data.viewer.zones[0]?.httpRequestsAdaptiveGroups ?? [];
  if (groups.length >= 10000) throw new Error(`${date}: 10000 grupos, el día está truncado`);

  const agents = {};
  const paths = {};
  let descartadas = 0;
  for (const { count, dimensions: d } of groups) {
    const agent = identifyAgent(d.userAgent);
    const format = formatOf(d.clientRequestPath || '');
    if (!agent) continue;
    if ((d.edgeResponseStatus !== 200 && d.edgeResponseStatus !== 304) || !format) {
      descartadas += count;
      continue;
    }
    const a = (agents[agent] ??= { total: 0, md: 0, llms: 0, html: 0 });
    a.total += count;
    a[format] += count;
    const p = (paths[d.clientRequestPath] ??= {});
    p[agent] = (p[agent] ?? 0) + count;
  }
  return { agents, paths, descartadas };
}

async function main() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) throw new Error('Falta CLOUDFLARE_API_TOKEN en .dev.vars');
  const refresh = process.argv.includes('--refresh');

  let history = { note: '', days: {} };
  try {
    history = JSON.parse(await readFile(HISTORY, 'utf8'));
  } catch {}
  history.note =
    'Peticiones de agentes a páginas (200/304) contadas en el borde de Cloudflare. ' +
    'Generado por scripts/geo-agents-edge.mjs; acumulativo porque la API solo retiene 8 días.';

  const zone = await zoneId(token);
  // Hoy (offset 0) está incompleto: se consulta desde ayer hacia atrás.
  const añadidos = [];
  for (let offset = 1; offset < RETENTION_DAYS; offset += 1) {
    const date = isoDate(offset);
    if (history.days[date] && !refresh) continue;
    history.days[date] = await fetchDay(token, zone, date);
    añadidos.push(date);
  }

  history.days = Object.fromEntries(Object.entries(history.days).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(HISTORY, `${JSON.stringify(history, null, 2)}\n`);

  const fechas = Object.keys(history.days);
  console.log(`Días añadidos: ${añadidos.join(', ') || 'ninguno'}`);
  console.log(`Histórico: ${fechas[0]} -> ${fechas.at(-1)} (${fechas.length} días)`);
  console.log('\nfecha       total  vivo  ChatGPT-User  Claude-User  Perplexity-User');
  const vivos = ['ChatGPT-User', 'Claude-User', 'Perplexity-User'];
  for (const f of fechas) {
    const a = history.days[f].agents;
    const total = Object.values(a).reduce((s, x) => s + x.total, 0);
    const v = vivos.map((n) => a[n]?.total ?? 0);
    console.log(`${f}  ${String(total).padStart(5)}  ${String(v[0] + v[1] + v[2]).padStart(4)}  ${v.map((x) => String(x).padStart(12)).join(' ')}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
