/**
 * Bing Webmaster Tools: rendimiento y citación.
 *
 * Por qué está aquí y no basta con Search Console: Bing alimenta a ChatGPT, así
 * que su índice es el canal por el que pasa buena parte de la citación
 * generativa. Search Console, además, no expone nada de AI Overviews para esta
 * propiedad (comprobado el 03-ago-2026: la dimensión `searchAppearance` devuelve
 * 0 filas y no admite filtros de AI).
 *
 * La API es por cuenta, no por sitio: la misma clave sirve para todas las
 * propiedades verificadas.
 *
 * Uso: npm run seo:bing
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadLocalEnv } from './lib/load-local-env.mjs';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const SITE_URL = 'https://crearsoftware.com/';
const API = 'https://ssl.bing.com/webmaster/api.svc/json';

loadLocalEnv();

function requireApiKey() {
  const key = process.env.BING_WEBMASTER_API_KEY?.trim();
  if (!key) {
    throw new Error(
      'Falta BING_WEBMASTER_API_KEY. Añádela a .dev.vars (el fichero está en .gitignore).',
    );
  }
  return key;
}

// Bing serializa las fechas como /Date(1234567890000)/.
function parseMsDate(value) {
  const match = String(value ?? '').match(/\/Date\((-?\d+)\)\//);
  if (!match) return null;
  const date = new Date(Number(match[1]));
  // El valor centinela de "nunca" es una fecha de 1601.
  return date.getUTCFullYear() < 1990 ? null : date;
}

async function call(name, key, params = {}) {
  const url = new URL(`${API}/${name}`);
  url.searchParams.set('apikey', key);
  url.searchParams.set('siteUrl', SITE_URL);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const response = await fetch(url);
  const text = await response.text();
  if (!response.ok) {
    // Nunca devolver el cuerpo sin sanear: la URL con la clave puede venir dentro.
    throw new Error(`${name}: HTTP ${response.status} — ${text.slice(0, 200).replaceAll(key, '<APIKEY>')}`);
  }
  return JSON.parse(text).d ?? [];
}

function table(rows, columns) {
  if (!rows.length) return ['- Sin datos todavía.'];
  return [
    `| ${columns.map((c) => c.label).join(' | ')} |`,
    `| ${columns.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${columns.map((c) => c.value(row)).join(' | ')} |`),
  ];
}

async function main() {
  const key = requireApiKey();
  console.log(`Consultando Bing Webmaster Tools para ${SITE_URL}`);

  const sites = await call('GetUserSites', key).catch(() => []);
  const site = sites.find((s) => s.Url === SITE_URL);
  const verified = site?.IsVerified === true;
  console.log(`Propiedad verificada: ${verified ? 'sí' : 'no'}`);

  const [traffic, queries, feeds] = await Promise.all([
    call('GetRankAndTrafficStats', key).catch(() => []),
    call('GetQueryStats', key).catch(() => []),
    call('GetFeeds', key).catch(() => []),
  ]);

  const totals = traffic.reduce(
    (acc, row) => ({
      clicks: acc.clicks + (row.Clicks ?? 0),
      impressions: acc.impressions + (row.Impressions ?? 0),
    }),
    { clicks: 0, impressions: 0 },
  );
  const ctr = totals.impressions ? (totals.clicks / totals.impressions) * 100 : 0;

  console.log(`Clics: ${totals.clicks} | Impresiones: ${totals.impressions}`);

  const generatedAt = new Date().toISOString();
  const dateStamp = generatedAt.slice(0, 10);

  const topQueries = [...queries]
    .sort((a, b) => (b.Clicks ?? 0) - (a.Clicks ?? 0) || (b.Impressions ?? 0) - (a.Impressions ?? 0))
    .slice(0, 20);

  const markdown = [
    '# Informe de Bing Webmaster Tools',
    '',
    `Fecha de generacion: ${generatedAt}`,
    `Propiedad: ${SITE_URL}`,
    `Verificada: ${verified ? 'si' : 'no'}`,
    '',
    '## Resumen',
    '',
    `- Clics: ${totals.clicks}`,
    `- Impresiones: ${totals.impressions}`,
    `- CTR: ${ctr.toFixed(2)}%`,
    `- Dias con datos: ${traffic.length}`,
    '',
    traffic.length
      ? '## Trafico por dia'
      : '## Trafico por dia\n\n- Sin datos todavia. Una propiedad recien dada de alta tarda hasta 48 horas en reflejar informacion, y el historico se construye desde el alta.',
    '',
    ...(traffic.length
      ? table(traffic.slice(-14), [
          { label: 'Fecha', value: (r) => parseMsDate(r.Date)?.toISOString().slice(0, 10) ?? '-' },
          { label: 'Clics', value: (r) => r.Clicks ?? 0 },
          { label: 'Impresiones', value: (r) => r.Impressions ?? 0 },
        ])
      : []),
    '',
    '## Top queries',
    '',
    ...table(topQueries, [
      { label: 'Query', value: (r) => r.Query ?? '-' },
      { label: 'Clics', value: (r) => r.Clicks ?? 0 },
      { label: 'Impresiones', value: (r) => r.Impressions ?? 0 },
      { label: 'Posicion', value: (r) => r.Position ?? '-' },
    ]),
    '',
    '## Sitemaps',
    '',
    ...(feeds.length
      ? feeds.map(
          (f) =>
            `- ${f.Url} | estado: ${f.Status} | URLs: ${f.UrlCount} | ultimo rastreo: ${parseMsDate(f.LastCrawled)?.toISOString().slice(0, 10) ?? 'nunca'}`,
        )
      : ['- Ninguno enviado.']),
    '',
    '## Nota sobre AI Performance',
    '',
    '- La seccion "AI Performance" del panel esta en beta y no tiene endpoint publico',
    '  documentado en la API. Hay que consultarla a mano en bing.com/webmasters.',
    '- Search Console no cubre este hueco: su dimension `searchAppearance` devuelve 0',
    '  filas para esta propiedad y no admite filtros de AI Overview (verificado 03-ago-2026).',
    '',
  ].join('\n');

  const report = {
    generatedAt,
    siteUrl: SITE_URL,
    verified,
    totals: { ...totals, ctrPercent: Number(ctr.toFixed(2)) },
    daysWithData: traffic.length,
    traffic,
    queries: topQueries,
    feeds,
  };

  await mkdir(DATA_DIR, { recursive: true });
  const files = [
    [path.join(DATA_DIR, `bing-report-${dateStamp}.md`), `${markdown}\n`],
    [path.join(DATA_DIR, 'bing-report-latest.md'), `${markdown}\n`],
    [path.join(DATA_DIR, `bing-report-${dateStamp}.json`), `${JSON.stringify(report, null, 2)}\n`],
    [path.join(DATA_DIR, 'bing-report-latest.json'), `${JSON.stringify(report, null, 2)}\n`],
  ];
  await Promise.all(files.map(([filePath, content]) => writeFile(filePath, content, 'utf8')));

  console.log('\nGenerated files:');
  for (const [filePath] of files) console.log(`- ${path.relative(ROOT, filePath)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
