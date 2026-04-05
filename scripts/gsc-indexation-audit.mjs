import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadLocalEnv } from './lib/load-local-env.mjs';
import {
  getGSCSiteUrl,
  requireGSCAccessToken,
  resolveGSCSiteUrl,
} from './lib/google-search-console.mjs';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');

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

function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => match[1]?.trim())
    .filter(Boolean);
}

function publicSiteOrigin(siteUrl) {
  if (siteUrl.startsWith('http://') || siteUrl.startsWith('https://')) {
    return new URL(siteUrl).origin;
  }

  if (siteUrl.startsWith('sc-domain:')) {
    return `https://${siteUrl.slice('sc-domain:'.length)}`;
  }

  return 'https://crearsoftware.com';
}

async function loadSitemapUrls(siteUrl) {
  const distSitemapPath = path.join(ROOT, 'dist', 'sitemap.xml');
  if (existsSync(distSitemapPath)) {
    return parseSitemapUrls(readFileSync(distSitemapPath, 'utf8'));
  }

  const sitemapUrl = `${publicSiteOrigin(siteUrl)}/sitemap.xml`;
  const response = await fetch(sitemapUrl);
  if (!response.ok) {
    throw new Error(`Could not fetch sitemap from ${sitemapUrl}`);
  }

  return parseSitemapUrls(await response.text());
}

async function inspectUrl({ url, siteUrl, accessToken }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch(
      'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inspectionUrl: url,
          siteUrl,
          languageCode: 'es-ES',
        }),
        signal: controller.signal,
      },
    );

    const text = await response.text();
    if (!response.ok) {
      return {
        url,
        error: {
          status: response.status,
          body: text,
        },
      };
    }

    const data = JSON.parse(text);
    const indexStatus = data.inspectionResult?.indexStatusResult ?? {};

    return {
      url,
      verdict: indexStatus.verdict ?? null,
      coverageState: indexStatus.coverageState ?? null,
      indexingState: indexStatus.indexingState ?? null,
      pageFetchState: indexStatus.pageFetchState ?? null,
      robotsTxtState: indexStatus.robotsTxtState ?? null,
      googleCanonical: indexStatus.googleCanonical ?? null,
      userCanonical: indexStatus.userCanonical ?? null,
      lastCrawlTime: indexStatus.lastCrawlTime ?? null,
      referringUrls: indexStatus.referringUrls ?? [],
      sitemaps: indexStatus.sitemap ?? [],
    };
  } catch (error) {
    return {
      url,
      error: {
        status:
          error instanceof Error && error.name === 'AbortError'
            ? 'timeout'
            : 'unknown',
        body: error instanceof Error ? error.message : String(error),
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const siteUrl = getGSCSiteUrl();
  const accessToken = await requireGSCAccessToken();
  const siteResolution = await resolveGSCSiteUrl({ siteUrl, accessToken });
  const resolvedSiteUrl = siteResolution.resolvedSiteUrl;
  const limit = asPositiveInt(
    args.limit ?? process.env.GSC_INSPECTION_LIMIT,
    25,
  );
  const offset = asPositiveInt(
    args.offset ?? process.env.GSC_INSPECTION_OFFSET,
    1,
  ) - 1;
  const matchPattern = args.match ?? process.env.GSC_INSPECTION_MATCH ?? '';

  const allUrls = await loadSitemapUrls(siteUrl);
  const filteredUrls = matchPattern
    ? allUrls.filter((url) => url.includes(matchPattern))
    : allUrls;
  const urls = filteredUrls.slice(offset, offset + limit);

  if (!urls.length) {
    throw new Error('No sitemap URLs matched the requested filters');
  }

  console.log(`Inspecting ${urls.length} URLs in Search Console`);
  console.log(`Property: ${resolvedSiteUrl}`);

  const results = [];
  for (const [index, url] of urls.entries()) {
    console.log(`[${index + 1}/${urls.length}] ${url}`);
    results.push(
      await inspectUrl({ url, siteUrl: resolvedSiteUrl, accessToken }),
    );
  }

  const indexed = results.filter((result) => result.verdict === 'PASS');
  const notIndexed = results.filter(
    (result) => result.verdict !== 'PASS' && !result.error,
  );
  const errors = results.filter((result) => result.error);
  const byCoverageState = {};

  for (const result of notIndexed) {
    const key = result.coverageState ?? 'unknown';
    byCoverageState[key] = (byCoverageState[key] ?? 0) + 1;
  }

  const generatedAt = new Date().toISOString();
  const dateStamp = generatedAt.slice(0, 10);
  const report = {
    generatedAt,
    siteUrl: resolvedSiteUrl,
    requestedSiteUrl: siteUrl,
    usedFallbackProperty: siteResolution.usedFallback,
    inspectedUrlCount: urls.length,
    indexedCount: indexed.length,
    notIndexedCount: notIndexed.length,
    errorCount: errors.length,
    byCoverageState,
    indexed,
    notIndexed,
    errors,
  };

  const markdown = [
    '# Google Search Console indexation audit',
    '',
    `Fecha de generacion: ${generatedAt}`,
    `Propiedad configurada: ${siteUrl}`,
    `Propiedad usada: ${resolvedSiteUrl}`,
    `URLs inspeccionadas: ${urls.length}`,
    `Indexadas: ${indexed.length}`,
    `No indexadas: ${notIndexed.length}`,
    `Errores: ${errors.length}`,
    '',
    '## Estados de cobertura',
    '',
    ...Object.entries(byCoverageState).length
      ? Object.entries(byCoverageState).map(
          ([state, count]) => `- ${state}: ${count}`,
        )
      : ['- Sin incidencias detectadas'],
    '',
    '## URLs no indexadas',
    '',
    ...(notIndexed.length
      ? notIndexed.map(
          (result) =>
            `- ${result.url} | verdict: ${result.verdict ?? '-'} | coverage: ${result.coverageState ?? '-'} | indexing: ${result.indexingState ?? '-'}`,
        )
      : ['- Ninguna']),
    '',
    '## Errores',
    '',
    ...(errors.length
      ? errors.map(
          (result) =>
            `- ${result.url} | status: ${result.error.status} | body: ${String(result.error.body).slice(0, 160)}`,
        )
      : ['- Ninguno']),
    '',
  ].join('\n');

  await mkdir(DATA_DIR, { recursive: true });

  const jsonPaths = [
    path.join(DATA_DIR, `gsc-indexation-audit-${dateStamp}.json`),
    path.join(DATA_DIR, 'gsc-indexation-audit-latest.json'),
  ];
  const mdPaths = [
    path.join(DATA_DIR, `gsc-indexation-audit-${dateStamp}.md`),
    path.join(DATA_DIR, 'gsc-indexation-audit-latest.md'),
  ];

  await Promise.all([
    ...jsonPaths.map((filePath) =>
      writeFile(filePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8'),
    ),
    ...mdPaths.map((filePath) => writeFile(filePath, `${markdown}\n`, 'utf8')),
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
