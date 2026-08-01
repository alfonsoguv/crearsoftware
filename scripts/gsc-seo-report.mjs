import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadLocalEnv } from './lib/load-local-env.mjs';
import {
  describeGSCAuthMode,
  getGSCSiteUrl,
  listSearchConsoleSites,
  listSearchConsoleSitemaps,
  querySearchConsole,
  requireGSCAccessToken,
  resolveGSCSiteUrl,
} from './lib/google-search-console.mjs';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const DEFAULT_LOOKBACK_DAYS = 28;
const GSC_LATENCY_DAYS = 3;
const DEFAULT_PAGE_LIMIT = 250;
const DEFAULT_QUERY_LIMIT = 250;
const DEFAULT_PAGE_QUERY_LIMIT = 500;

loadLocalEnv();

function parseArgs(argv) {
  const options = {};

  for (const rawArg of argv) {
    if (!rawArg.startsWith('--')) continue;
    const [rawKey, rawValue] = rawArg.slice(2).split('=');
    options[rawKey] = rawValue ?? 'true';
  }

  return options;
}

function asPositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function dateToIso(date) {
  return date.toISOString().slice(0, 10);
}

function shiftDays(date, delta) {
  const shifted = new Date(date);
  shifted.setUTCDate(shifted.getUTCDate() + delta);
  return shifted;
}

function toPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function toFixed(value, digits = 1) {
  return Number.isFinite(value) ? value.toFixed(digits) : '0.0';
}

// Desde junio de 2026 GSC devuelve los enlaces de fragmento (#seccion) como URLs
// independientes en la dimensión "page". Sumar esas filas duplica las impresiones
// de la página que las contiene: en julio inflaba el total un 17% (4.209
// impresiones fantasma con 0 clics), lo que hundía el CTR y falseaba la posición
// media. Se excluyen del resumen; siguen apareciendo en el detalle por página.
function isAnchorRow(row) {
  return String(row?.keys?.[0] ?? '').includes('#');
}

function summarizeRows(allRows) {
  const rows = allRows.filter((row) => !isAnchorRow(row));
  const totalClicks = rows.reduce((sum, row) => sum + (row.clicks ?? 0), 0);
  const totalImpressions = rows.reduce(
    (sum, row) => sum + (row.impressions ?? 0),
    0,
  );
  const weightedPosition = rows.reduce(
    (sum, row) => sum + (row.position ?? 0) * (row.impressions ?? 0),
    0,
  );

  return {
    totalClicks,
    totalImpressions,
    avgCtr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
    avgPosition:
      totalImpressions > 0 ? weightedPosition / totalImpressions : 0,
  };
}

function shortenUrl(value) {
  return value
    .replace(/^https?:\/\/(www\.)?crearsoftware\.com\/?/, '/')
    .replace(/\/$/, '/') || value;
}

function formatTable(headers, rows) {
  const safeRows = rows.length ? rows : [['-', '-', '-', '-', '-']];
  const divider = headers.map(() => '---');
  return [
    `| ${headers.join(' | ')} |`,
    `| ${divider.join(' | ')} |`,
    ...safeRows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const siteUrl = getGSCSiteUrl();
  const authMode = describeGSCAuthMode();
  const lookbackDays = asPositiveInt(
    args.days ?? process.env.GSC_LOOKBACK_DAYS,
    DEFAULT_LOOKBACK_DAYS,
  );
  const pageLimit = asPositiveInt(
    args.pageLimit ?? process.env.GSC_PAGE_LIMIT,
    DEFAULT_PAGE_LIMIT,
  );
  const queryLimit = asPositiveInt(
    args.queryLimit ?? process.env.GSC_QUERY_LIMIT,
    DEFAULT_QUERY_LIMIT,
  );
  const pageQueryLimit = asPositiveInt(
    args.pageQueryLimit ?? process.env.GSC_PAGE_QUERY_LIMIT,
    DEFAULT_PAGE_QUERY_LIMIT,
  );

  // GSC consolida los datos con 2-3 días de retraso. Si la ventana termina ayer,
  // los últimos días vienen vacíos y el informe compara ventanas de 26-27 días
  // contra otras de 28, lo que produce deltas falsos entre snapshots consecutivos.
  const lastSettledDay = shiftDays(new Date(), -GSC_LATENCY_DAYS);
  const endDate = args.endDate ?? process.env.GSC_END_DATE ?? dateToIso(lastSettledDay);
  const startDate =
    args.startDate ??
    process.env.GSC_START_DATE ??
    dateToIso(shiftDays(new Date(`${endDate}T00:00:00.000Z`), -(lookbackDays - 1)));

  console.log(`Fetching Google Search Console data for ${siteUrl}`);
  console.log(`Period: ${startDate} -> ${endDate}`);
  console.log(`Auth mode: ${authMode}`);

  const accessToken = await requireGSCAccessToken();
  const accessibleSites = await listSearchConsoleSites(accessToken);
  const siteResolution = await resolveGSCSiteUrl({
    siteUrl,
    accessToken,
    sites: accessibleSites,
  });
  const resolvedSiteUrl = siteResolution.resolvedSiteUrl;

  if (siteResolution.usedFallback) {
    console.log(`Resolved property: ${resolvedSiteUrl}`);
  }

  const [sites, sitemaps, pageRows, queryRows, pageQueryRows] =
    await Promise.all([
      Promise.resolve(accessibleSites),
      listSearchConsoleSitemaps({ siteUrl: resolvedSiteUrl, accessToken }),
      querySearchConsole({
        siteUrl: resolvedSiteUrl,
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: pageLimit,
        accessToken,
      }),
      querySearchConsole({
        siteUrl: resolvedSiteUrl,
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: queryLimit,
        accessToken,
      }),
      querySearchConsole({
        siteUrl: resolvedSiteUrl,
        startDate,
        endDate,
        dimensions: ['page', 'query'],
        rowLimit: pageQueryLimit,
        accessToken,
      }),
    ]);

  const pageSummary = summarizeRows(pageRows);
  const querySummary = summarizeRows(queryRows);
  const normalizedSites = new Set(sites.map((entry) => entry.siteUrl));
  const siteIsAccessible = normalizedSites.has(resolvedSiteUrl);

  const pagesWithLowCtr = pageRows
    .filter((row) => (row.impressions ?? 0) >= 100 && (row.ctr ?? 0) < 0.03)
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .slice(0, 12);

  const strikingDistanceQueries = pageQueryRows
    .filter(
      (row) =>
        (row.impressions ?? 0) >= 40 &&
        (row.position ?? 0) >= 4 &&
        (row.position ?? 0) <= 15,
    )
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .slice(0, 15);

  const topPages = pageRows.slice(0, 10);
  const topQueries = queryRows.slice(0, 10);
  const generatedAt = new Date().toISOString();
  const dateStamp = generatedAt.slice(0, 10);

  const reportJson = {
    generatedAt,
    siteUrl: resolvedSiteUrl,
    requestedSiteUrl: siteUrl,
    authMode,
    usedFallbackProperty: siteResolution.usedFallback,
    period: { startDate, endDate, lookbackDays },
    siteIsAccessible,
    sitemaps,
    summary: {
      pages: pageSummary,
      queries: querySummary,
    },
    topPages,
    topQueries,
    pagesWithLowCtr,
    strikingDistanceQueries,
  };

  const reportMd = [
    '# Google Search Console SEO report',
    '',
    `Fecha de generacion: ${generatedAt}`,
    `Propiedad configurada: ${siteUrl}`,
    `Propiedad usada: ${resolvedSiteUrl}`,
    `Periodo: ${startDate} -> ${endDate}`,
    `Autenticacion: ${authMode}`,
    '',
    '## Resumen',
    '',
    `- Propiedad accesible con estas credenciales: ${siteIsAccessible ? 'si' : 'no'}`,
    `- Sitemaps detectados en Search Console: ${sitemaps.length}`,
    `- Clicks totales: ${pageSummary.totalClicks}`,
    `- Impresiones totales: ${pageSummary.totalImpressions}`,
    `- CTR medio: ${toPercent(pageSummary.avgCtr)}`,
    `- Posicion media: ${toFixed(pageSummary.avgPosition, 2)}`,
    '',
    '## Sitemaps detectados',
    '',
    ...(sitemaps.length
      ? sitemaps.map((sitemap) => {
          const indexed = sitemap.contents?.[0]?.indexed ?? '-';
          const submitted = sitemap.contents?.[0]?.submitted ?? '-';
          return `- ${sitemap.path ?? '(sin path)'} | indexed: ${indexed} | submitted: ${submitted}`;
        })
      : ['- Ninguno']),
    '',
    '## Top paginas por clics',
    '',
    formatTable(
      ['Pagina', 'Clicks', 'Impresiones', 'CTR', 'Posicion'],
      topPages.map((row) => [
        shortenUrl(row.keys?.[0] ?? '-'),
        String(row.clicks ?? 0),
        String(row.impressions ?? 0),
        toPercent(row.ctr ?? 0),
        toFixed(row.position ?? 0, 2),
      ]),
    ),
    '',
    '## Top queries por clics',
    '',
    formatTable(
      ['Query', 'Clicks', 'Impresiones', 'CTR', 'Posicion'],
      topQueries.map((row) => [
        String(row.keys?.[0] ?? '-').replace(/\|/g, '\\|'),
        String(row.clicks ?? 0),
        String(row.impressions ?? 0),
        toPercent(row.ctr ?? 0),
        toFixed(row.position ?? 0, 2),
      ]),
    ),
    '',
    '## Oportunidades: paginas con impresiones altas y CTR bajo',
    '',
    formatTable(
      ['Pagina', 'Clicks', 'Impresiones', 'CTR', 'Posicion'],
      pagesWithLowCtr.map((row) => [
        shortenUrl(row.keys?.[0] ?? '-'),
        String(row.clicks ?? 0),
        String(row.impressions ?? 0),
        toPercent(row.ctr ?? 0),
        toFixed(row.position ?? 0, 2),
      ]),
    ),
    '',
    '## Oportunidades: queries en striking distance',
    '',
    formatTable(
      ['Query', 'Pagina', 'Impresiones', 'Clicks', 'CTR', 'Posicion'],
      strikingDistanceQueries.map((row) => [
        String(row.keys?.[1] ?? '-').replace(/\|/g, '\\|'),
        shortenUrl(row.keys?.[0] ?? '-'),
        String(row.impressions ?? 0),
        String(row.clicks ?? 0),
        toPercent(row.ctr ?? 0),
        toFixed(row.position ?? 0, 2),
      ]),
    ),
    '',
  ].join('\n');

  await mkdir(DATA_DIR, { recursive: true });

  const jsonPaths = [
    path.join(DATA_DIR, `gsc-seo-report-${dateStamp}.json`),
    path.join(DATA_DIR, 'gsc-seo-report-latest.json'),
  ];
  const mdPaths = [
    path.join(DATA_DIR, `gsc-seo-report-${dateStamp}.md`),
    path.join(DATA_DIR, 'gsc-seo-report-latest.md'),
  ];

  await Promise.all([
    ...jsonPaths.map((filePath) =>
      writeFile(filePath, `${JSON.stringify(reportJson, null, 2)}\n`, 'utf8'),
    ),
    ...mdPaths.map((filePath) => writeFile(filePath, `${reportMd}\n`, 'utf8')),
  ]);

  console.log('');
  console.log('Generated files:');
  for (const filePath of [...mdPaths, ...jsonPaths]) {
    console.log(`- ${path.relative(ROOT, filePath)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
