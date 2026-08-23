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

// Muestreo sistemático con arranque rotativo.
//
// Hasta el 02-ago-2026 este script inspeccionaba siempre las 25 primeras URLs
// del sitemap, así que su "21/25 indexadas" describía esas 25 URLs y no el
// sitio. Ahora la muestra se reparte por todo el sitemap (paso k = N/limit) y
// el arranque avanza en cada ejecución, guardado en `gsc-indexation-cursor.json`.
// Dos consecuencias: cada informe suelto ya es representativo del conjunto, y
// la unión de informes sucesivos cubre el sitemap sin repetir.
function systematicSample(urls, limit, start) {
  const total = urls.length;
  if (total <= limit) return urls;

  const step = total / limit;
  const offset = ((start % total) + total) % total;
  const picked = [];
  const seen = new Set();

  for (let i = 0; i < limit; i += 1) {
    let index = Math.floor(offset + i * step) % total;
    // Si el redondeo colisiona, se toma la siguiente URL libre.
    while (seen.has(index)) index = (index + 1) % total;
    seen.add(index);
    picked.push(urls[index]);
  }

  return picked;
}

// Intervalo de Wilson al 95%. Con n=25 sobre ~690 URLs el margen ronda los
// ±16 puntos: publicar la proporción sin él invita a leer ruido como tendencia.
function wilsonInterval(successes, total) {
  if (total === 0) return [0, 0];
  const z = 1.96;
  const p = successes / total;
  const denominator = 1 + (z * z) / total;
  const center = (p + (z * z) / (2 * total)) / denominator;
  const spread =
    (z * Math.sqrt((p * (1 - p)) / total + (z * z) / (4 * total * total))) /
    denominator;
  return [
    Math.max(0, (center - spread) * 100),
    Math.min(100, (center + spread) * 100),
  ];
}

const CURSOR_PATH = path.join(DATA_DIR, 'gsc-indexation-cursor.json');

function readCursor() {
  if (!existsSync(CURSOR_PATH)) return { start: 0, runs: 0, inspected: [] };
  try {
    const parsed = JSON.parse(readFileSync(CURSOR_PATH, 'utf8'));
    return {
      start: Number.isFinite(parsed.start) ? parsed.start : 0,
      runs: Number.isFinite(parsed.runs) ? parsed.runs : 0,
      inspected: Array.isArray(parsed.inspected) ? parsed.inspected : [],
    };
  } catch {
    return { start: 0, runs: 0, inspected: [] };
  }
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
  const matchPattern = args.match ?? process.env.GSC_INSPECTION_MATCH ?? '';

  const allUrls = await loadSitemapUrls(siteUrl);
  const filteredUrls = matchPattern
    ? allUrls.filter((url) => url.includes(matchPattern))
    : allUrls;

  const cursor = readCursor();
  // `--offset` sigue disponible para reproducir un informe concreto; sin él, la
  // muestra rota sola a partir del cursor guardado.
  const explicitOffset = args.offset ?? process.env.GSC_INSPECTION_OFFSET;
  const start = explicitOffset
    ? asPositiveInt(explicitOffset, 1) - 1
    : cursor.start;

  const urls = systematicSample(filteredUrls, limit, start);

  if (!urls.length) {
    throw new Error('No sitemap URLs matched the requested filters');
  }

  console.log(`Inspecting ${urls.length} URLs in Search Console`);
  console.log(`Property: ${resolvedSiteUrl}`);
  console.log(
    `Muestra sistematica sobre ${filteredUrls.length} URLs del sitemap (arranque ${start}, paso ${(filteredUrls.length / limit).toFixed(1)})`,
  );

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

  const decided = indexed.length + notIndexed.length;
  const [ciLow, ciHigh] = wilsonInterval(indexed.length, decided);
  const indexedRate = decided ? (indexed.length / decided) * 100 : 0;

  // Solo cuenta como cubierta la URL de la que Google devolvio un veredicto: una
  // inspeccion fallida no aporta informacion, asi que inflar `coveredCount` con
  // ella estrecharia el IC sin base. Y si la ejecucion entera fallo (token sin
  // permiso, propiedad sin verificar, corte de red), el cursor NO avanza: de lo
  // contrario cada ejecucion rota quemaria un tramo del sitemap en silencio.
  const decidedUrls = results
    .filter((result) => !result.error)
    .map((result) => result.url);
  const coveredSet = new Set([...cursor.inspected, ...decidedUrls]);
  const allFailed = decided === 0;

  if (allFailed) {
    console.error(
      `\nAVISO: las ${results.length} inspecciones fallaron. El cursor se deja en ${start} ` +
        'y la cobertura acumulada no se toca. Revisa el permiso sobre la propiedad antes de reintentar.',
    );
  }

  const nextStart = allFailed
    ? start
    : (start + limit) % Math.max(1, filteredUrls.length);
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(
    CURSOR_PATH,
    `${JSON.stringify(
      {
        start: nextStart,
        runs: allFailed ? cursor.runs : cursor.runs + 1,
        sitemapSize: filteredUrls.length,
        coveredCount: coveredSet.size,
        updatedAt: generatedAt,
        inspected: [...coveredSet].sort(),
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  const report = {
    generatedAt,
    siteUrl: resolvedSiteUrl,
    requestedSiteUrl: siteUrl,
    usedFallbackProperty: siteResolution.usedFallback,
    sampling: {
      method: 'systematic-rotating',
      sitemapSize: filteredUrls.length,
      start,
      nextStart,
      run: allFailed ? cursor.runs : cursor.runs + 1,
      cumulativeCoverage: coveredSet.size,
    },
    indexedRatePercent: Number(indexedRate.toFixed(1)),
    indexedRateCI95: [Number(ciLow.toFixed(1)), Number(ciHigh.toFixed(1))],
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
    '## Muestreo',
    '',
    `- Metodo: sistematico con arranque rotativo sobre las ${filteredUrls.length} URLs del sitemap`,
    `- Arranque de esta ejecucion: ${start} (la siguiente empezara en ${nextStart})`,
    `- Ejecucion numero ${allFailed ? cursor.runs : cursor.runs + 1}; cobertura acumulada: ${coveredSet.size}/${filteredUrls.length} URLs distintas`,
    `- **Tasa de indexacion estimada del sitio: ${indexedRate.toFixed(1)}%** (IC 95%: ${ciLow.toFixed(1)}% - ${ciHigh.toFixed(1)}%, n=${decided})`,
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
