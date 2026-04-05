import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadLocalEnv } from './lib/load-local-env.mjs';
import {
  describeGSCAuthMode,
  getGSCSiteUrl,
  listSearchConsoleSitemaps,
  querySearchConsole,
  requireGSCAccessToken,
  resolveGSCSiteUrl,
} from './lib/google-search-console.mjs';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const DEFAULT_DAYS = 90;

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

function shiftDays(date, delta) {
  const shifted = new Date(date);
  shifted.setUTCDate(shifted.getUTCDate() + delta);
  return shifted;
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function sumRows(rows) {
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
    clicks: totalClicks,
    impressions: totalImpressions,
    ctr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
    position: totalImpressions > 0 ? weightedPosition / totalImpressions : 0,
  };
}

function percent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function signedPercent(value) {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${(value * 100).toFixed(2)}%`;
}

function signedNumber(value, digits = 0) {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(digits)}`;
}

function fixed(value, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : '0.00';
}

function rowKey(row) {
  return (row.keys ?? []).join('||');
}

function compareRows(currentRows, previousRows) {
  const previousByKey = new Map(previousRows.map((row) => [rowKey(row), row]));

  return currentRows.map((row) => {
    const previous = previousByKey.get(rowKey(row)) ?? {
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
    };

    return {
      ...row,
      previous,
      clickDelta: (row.clicks ?? 0) - (previous.clicks ?? 0),
      impressionDelta:
        (row.impressions ?? 0) - (previous.impressions ?? 0),
      ctrDelta: (row.ctr ?? 0) - (previous.ctr ?? 0),
      positionDelta: (row.position ?? 0) - (previous.position ?? 0),
    };
  });
}

function shortenUrl(value) {
  return value
    .replace(/^https?:\/\/(www\.)?crearsoftware\.com\/?/, '/')
    .replace(/\/$/, '/') || value;
}

function escapeTableCell(value) {
  return String(value ?? '-').replace(/\|/g, '\\|');
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
  const days = asPositiveInt(args.days ?? process.env.GSC_ANALYSIS_DAYS, DEFAULT_DAYS);
  const pageLimit = asPositiveInt(args.pageLimit ?? process.env.GSC_PAGE_LIMIT, 1000);
  const queryLimit = asPositiveInt(args.queryLimit ?? process.env.GSC_QUERY_LIMIT, 1000);
  const pageQueryLimit = asPositiveInt(
    args.pageQueryLimit ?? process.env.GSC_PAGE_QUERY_LIMIT,
    3000,
  );

  const configuredSiteUrl = getGSCSiteUrl();
  const authMode = describeGSCAuthMode();
  const accessToken = await requireGSCAccessToken();
  const siteResolution = await resolveGSCSiteUrl({
    siteUrl: configuredSiteUrl,
    accessToken,
  });
  const siteUrl = siteResolution.resolvedSiteUrl;

  const currentEnd = shiftDays(new Date(), -1);
  const currentStart = shiftDays(currentEnd, -(days - 1));
  const previousEnd = shiftDays(currentStart, -1);
  const previousStart = shiftDays(previousEnd, -(days - 1));

  const currentRange = {
    startDate: toIsoDate(currentStart),
    endDate: toIsoDate(currentEnd),
  };
  const previousRange = {
    startDate: toIsoDate(previousStart),
    endDate: toIsoDate(previousEnd),
  };

  console.log(`Running complete GSC analysis for ${siteUrl}`);
  console.log(
    `Current period: ${currentRange.startDate} -> ${currentRange.endDate}`,
  );
  console.log(
    `Previous period: ${previousRange.startDate} -> ${previousRange.endDate}`,
  );

  const [
    sitemaps,
    currentPages,
    previousPages,
    currentQueries,
    previousQueries,
    currentPageQueries,
    countries,
    devices,
  ] = await Promise.all([
    listSearchConsoleSitemaps({ siteUrl, accessToken }),
    querySearchConsole({
      siteUrl,
      ...currentRange,
      dimensions: ['page'],
      rowLimit: pageLimit,
      accessToken,
    }),
    querySearchConsole({
      siteUrl,
      ...previousRange,
      dimensions: ['page'],
      rowLimit: pageLimit,
      accessToken,
    }),
    querySearchConsole({
      siteUrl,
      ...currentRange,
      dimensions: ['query'],
      rowLimit: queryLimit,
      accessToken,
    }),
    querySearchConsole({
      siteUrl,
      ...previousRange,
      dimensions: ['query'],
      rowLimit: queryLimit,
      accessToken,
    }),
    querySearchConsole({
      siteUrl,
      ...currentRange,
      dimensions: ['page', 'query'],
      rowLimit: pageQueryLimit,
      accessToken,
    }),
    querySearchConsole({
      siteUrl,
      ...currentRange,
      dimensions: ['country'],
      rowLimit: 25,
      accessToken,
    }),
    querySearchConsole({
      siteUrl,
      ...currentRange,
      dimensions: ['device'],
      rowLimit: 10,
      accessToken,
    }),
  ]);

  const currentSummary = sumRows(currentPages);
  const previousSummary = sumRows(previousPages);
  const comparedPages = compareRows(currentPages, previousPages);
  const comparedQueries = compareRows(currentQueries, previousQueries);

  const topPages = currentPages.slice(0, 15);
  const topQueries = currentQueries.slice(0, 15);
  const topQueriesByImpressions = [...currentQueries]
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .slice(0, 15);
  const pageWinners = [...comparedPages]
    .filter((row) => (row.impressions ?? 0) >= 30 || (row.previous.impressions ?? 0) >= 30)
    .sort((a, b) => b.clickDelta - a.clickDelta)
    .slice(0, 12);
  const pageLosers = [...comparedPages]
    .filter((row) => (row.impressions ?? 0) >= 30 || (row.previous.impressions ?? 0) >= 30)
    .sort((a, b) => a.clickDelta - b.clickDelta)
    .slice(0, 12);
  const ctrOpportunities = [...comparedPages]
    .filter(
      (row) =>
        (row.impressions ?? 0) >= 150 &&
        (row.position ?? 0) <= 12 &&
        (row.ctr ?? 0) < 0.02,
    )
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .slice(0, 15);
  const queryOpportunities = [...currentPageQueries]
    .filter(
      (row) =>
        (row.impressions ?? 0) >= 40 &&
        (row.position ?? 0) >= 4 &&
        (row.position ?? 0) <= 15,
    )
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .slice(0, 20);
  const risingQueries = [...comparedQueries]
    .filter((row) => (row.impressions ?? 0) >= 30 || (row.previous.impressions ?? 0) >= 30)
    .sort((a, b) => b.clickDelta - a.clickDelta)
    .slice(0, 12);

  const generatedAt = new Date().toISOString();
  const dateStamp = generatedAt.slice(0, 10);

  const reportJson = {
    generatedAt,
    configuredSiteUrl,
    siteUrl,
    authMode,
    currentRange,
    previousRange,
    sitemaps,
    summary: {
      current: currentSummary,
      previous: previousSummary,
      clickDelta: currentSummary.clicks - previousSummary.clicks,
      impressionDelta: currentSummary.impressions - previousSummary.impressions,
      ctrDelta: currentSummary.ctr - previousSummary.ctr,
      positionDelta: currentSummary.position - previousSummary.position,
    },
    topPages,
    topQueries,
    topQueriesByImpressions,
    pageWinners,
    pageLosers,
    ctrOpportunities,
    queryOpportunities,
    risingQueries,
    countries,
    devices,
  };

  const markdown = [
    '# Analisis completo de Google Search Console',
    '',
    `Fecha de generacion: ${generatedAt}`,
    `Propiedad configurada: ${configuredSiteUrl}`,
    `Propiedad usada: ${siteUrl}`,
    `Autenticacion: ${authMode}`,
    `Periodo actual: ${currentRange.startDate} -> ${currentRange.endDate}`,
    `Periodo previo: ${previousRange.startDate} -> ${previousRange.endDate}`,
    '',
    '## Resumen ejecutivo',
    '',
    `- Clicks: ${currentSummary.clicks} (${signedNumber(currentSummary.clicks - previousSummary.clicks)})`,
    `- Impresiones: ${currentSummary.impressions} (${signedNumber(currentSummary.impressions - previousSummary.impressions)})`,
    `- CTR: ${percent(currentSummary.ctr)} (${signedPercent(currentSummary.ctr - previousSummary.ctr)})`,
    `- Posicion media: ${fixed(currentSummary.position)} (${signedNumber(currentSummary.position - previousSummary.position, 2)})`,
    `- Sitemaps enviados en Search Console: ${sitemaps.length}`,
    '',
    '## Paises',
    '',
    formatTable(
      ['Pais', 'Clicks', 'Impresiones', 'CTR', 'Posicion'],
      countries.map((row) => [
        escapeTableCell(row.keys?.[0] ?? '-'),
        String(row.clicks ?? 0),
        String(row.impressions ?? 0),
        percent(row.ctr ?? 0),
        fixed(row.position ?? 0),
      ]),
    ),
    '',
    '## Dispositivos',
    '',
    formatTable(
      ['Dispositivo', 'Clicks', 'Impresiones', 'CTR', 'Posicion'],
      devices.map((row) => [
        escapeTableCell(row.keys?.[0] ?? '-'),
        String(row.clicks ?? 0),
        String(row.impressions ?? 0),
        percent(row.ctr ?? 0),
        fixed(row.position ?? 0),
      ]),
    ),
    '',
    '## Top paginas por clics',
    '',
    formatTable(
      ['Pagina', 'Clicks', 'Impresiones', 'CTR', 'Posicion'],
      topPages.map((row) => [
        shortenUrl(row.keys?.[0] ?? '-'),
        String(row.clicks ?? 0),
        String(row.impressions ?? 0),
        percent(row.ctr ?? 0),
        fixed(row.position ?? 0),
      ]),
    ),
    '',
    '## Top queries por clics',
    '',
    formatTable(
      ['Query', 'Clicks', 'Impresiones', 'CTR', 'Posicion'],
      topQueries.map((row) => [
        escapeTableCell(row.keys?.[0] ?? '-'),
        String(row.clicks ?? 0),
        String(row.impressions ?? 0),
        percent(row.ctr ?? 0),
        fixed(row.position ?? 0),
      ]),
    ),
    '',
    '## Top queries por impresiones',
    '',
    formatTable(
      ['Query', 'Clicks', 'Impresiones', 'CTR', 'Posicion'],
      topQueriesByImpressions.map((row) => [
        escapeTableCell(row.keys?.[0] ?? '-'),
        String(row.clicks ?? 0),
        String(row.impressions ?? 0),
        percent(row.ctr ?? 0),
        fixed(row.position ?? 0),
      ]),
    ),
    '',
    '## Paginas ganadoras vs periodo previo',
    '',
    formatTable(
      ['Pagina', 'Clicks', 'Delta clicks', 'Delta impresiones', 'CTR', 'Posicion'],
      pageWinners.map((row) => [
        shortenUrl(row.keys?.[0] ?? '-'),
        String(row.clicks ?? 0),
        signedNumber(row.clickDelta),
        signedNumber(row.impressionDelta),
        percent(row.ctr ?? 0),
        fixed(row.position ?? 0),
      ]),
    ),
    '',
    '## Paginas con peor evolucion',
    '',
    formatTable(
      ['Pagina', 'Clicks', 'Delta clicks', 'Delta impresiones', 'CTR', 'Posicion'],
      pageLosers.map((row) => [
        shortenUrl(row.keys?.[0] ?? '-'),
        String(row.clicks ?? 0),
        signedNumber(row.clickDelta),
        signedNumber(row.impressionDelta),
        percent(row.ctr ?? 0),
        fixed(row.position ?? 0),
      ]),
    ),
    '',
    '## Oportunidades de CTR',
    '',
    formatTable(
      ['Pagina', 'Clicks', 'Impresiones', 'CTR', 'Posicion'],
      ctrOpportunities.map((row) => [
        shortenUrl(row.keys?.[0] ?? '-'),
        String(row.clicks ?? 0),
        String(row.impressions ?? 0),
        percent(row.ctr ?? 0),
        fixed(row.position ?? 0),
      ]),
    ),
    '',
    '## Oportunidades de posicionamiento por query',
    '',
    formatTable(
      ['Query', 'Pagina', 'Impresiones', 'Clicks', 'CTR', 'Posicion'],
      queryOpportunities.map((row) => [
        escapeTableCell(row.keys?.[1] ?? '-'),
        shortenUrl(row.keys?.[0] ?? '-'),
        String(row.impressions ?? 0),
        String(row.clicks ?? 0),
        percent(row.ctr ?? 0),
        fixed(row.position ?? 0),
      ]),
    ),
    '',
    '## Queries en crecimiento',
    '',
    formatTable(
      ['Query', 'Clicks', 'Delta clicks', 'Impresiones', 'Posicion'],
      risingQueries.map((row) => [
        escapeTableCell(row.keys?.[0] ?? '-'),
        String(row.clicks ?? 0),
        signedNumber(row.clickDelta),
        String(row.impressions ?? 0),
        fixed(row.position ?? 0),
      ]),
    ),
    '',
  ].join('\n');

  await mkdir(DATA_DIR, { recursive: true });

  const jsonPaths = [
    path.join(DATA_DIR, `gsc-domain-analysis-${dateStamp}.json`),
    path.join(DATA_DIR, 'gsc-domain-analysis-latest.json'),
  ];
  const mdPaths = [
    path.join(DATA_DIR, `gsc-domain-analysis-${dateStamp}.md`),
    path.join(DATA_DIR, 'gsc-domain-analysis-latest.md'),
  ];

  await Promise.all([
    ...jsonPaths.map((filePath) =>
      writeFile(filePath, `${JSON.stringify(reportJson, null, 2)}\n`, 'utf8'),
    ),
    ...mdPaths.map((filePath) =>
      writeFile(filePath, `${markdown}\n`, 'utf8'),
    ),
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
