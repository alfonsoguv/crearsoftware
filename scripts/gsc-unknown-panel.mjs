// Panel fijo de URLs que Search Console devolvio alguna vez como «Google no
// reconoce esta URL». La muestra rotativa de `seo:gsc:indexation` ve cada URL
// una sola vez por vuelta al sitemap, asi que nunca dice si ese estado es
// permanente o transitorio. Este script reinspecciona SIEMPRE las mismas URLs y
// acumula su historia en `data/gsc-unknown-panel.json` (versionado).
//
// El panel se alimenta solo: cada ejecucion añade las URLs nuevas que aparezcan
// con ese estado en cualquier `data/gsc-indexation-audit-*.json`. Una URL no sale
// del panel aunque se indexe: la transicion es justo el dato que se busca.
//
// Coste: una llamada a la API de inspeccion por URL (cupo de 2000/dia).
//
// Lo que ya se sabe (04-oct-2026): para URLs que Google no ha rastreado, la API
// NO es determinista. La misma URL alterna entre «Google no reconoce esta URL»
// (0 referentes, 0 sitemaps) y «Descubierta: actualmente sin indexar» (3-4
// referentes, 1 sitemap) entre dos llamadas separadas 30 segundos. Las indexadas
// son estables (30 de 30 lecturas repetidas). Por eso aqui se mira la tendencia
// hacia «Rastreada» o «indexada», no el paso de «no reconoce» a «Descubierta».

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadLocalEnv } from './lib/load-local-env.mjs';
import {
  getGSCSiteUrl,
  inspectUrl,
  requireGSCAccessToken,
  resolveGSCSiteUrl,
} from './lib/google-search-console.mjs';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const PANEL_PATH = path.join(DATA_DIR, 'gsc-unknown-panel.json');
const UNKNOWN = 'Google no reconoce esta URL';

loadLocalEnv();

function readPanel() {
  if (!existsSync(PANEL_PATH)) return { note: '', urls: {} };
  return JSON.parse(readFileSync(PANEL_PATH, 'utf8'));
}

// Recorre los informes de indexacion en orden y apunta la primera vez que cada
// URL salio como no reconocida.
function discoverFromAudits() {
  const found = {};
  const files = readdirSync(DATA_DIR)
    .filter((name) => /^gsc-indexation-audit-\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort();

  for (const name of files) {
    const date = name.slice('gsc-indexation-audit-'.length, -'.json'.length);
    const report = JSON.parse(readFileSync(path.join(DATA_DIR, name), 'utf8'));
    for (const result of report.notIndexed ?? []) {
      if (result.coverageState === UNKNOWN && !found[result.url]) {
        found[result.url] = date;
      }
    }
  }

  return found;
}

async function main() {
  const panel = readPanel();
  panel.note =
    'Panel fijo de URLs que salieron alguna vez como «Google no reconoce esta URL». ' +
    'Se reinspeccionan todas en cada ejecucion (npm run seo:gsc:unknown).';

  for (const [url, firstSeen] of Object.entries(discoverFromAudits())) {
    panel.urls[url] ??= { firstSeen, history: [] };
  }

  const urls = Object.keys(panel.urls).sort();
  if (!urls.length) {
    console.log('Panel vacio: ningun informe de indexacion tiene URLs no reconocidas.');
    return;
  }

  const accessToken = await requireGSCAccessToken();
  const { resolvedSiteUrl } = await resolveGSCSiteUrl({
    siteUrl: getGSCSiteUrl(),
    accessToken,
  });
  const date = new Date().toISOString().slice(0, 10);

  console.log(`Reinspeccionando ${urls.length} URLs del panel (${date})\n`);

  const transitions = [];
  for (const url of urls) {
    const result = await inspectUrl({ url, siteUrl: resolvedSiteUrl, accessToken });
    const entry = result.error
      ? { date, error: String(result.error.status) }
      : {
          date,
          coverageState: result.coverageState,
          verdict: result.verdict,
          lastCrawlTime: result.lastCrawlTime,
          referringUrls: result.referringUrls.length,
          sitemaps: result.sitemaps.length,
        };

    const history = panel.urls[url].history.filter((item) => item.date !== date);
    const previous = [...history].reverse().find((item) => !item.error);
    history.push(entry);
    panel.urls[url].history = history;

    const state = entry.error ? `ERROR ${entry.error}` : entry.coverageState;
    if (previous && !entry.error && previous.coverageState !== entry.coverageState) {
      transitions.push(`${url}: ${previous.coverageState} -> ${entry.coverageState}`);
    }
    console.log(
      `${state.padEnd(40)} ref=${entry.referringUrls ?? '-'} sitemap=${entry.sitemaps ?? '-'}  ${url}`,
    );
  }

  await writeFile(PANEL_PATH, `${JSON.stringify(panel, null, 2)}\n`, 'utf8');

  const tally = {};
  for (const url of urls) {
    const last = panel.urls[url].history.at(-1);
    const key = last.error ? 'error de la API' : last.coverageState;
    tally[key] = (tally[key] ?? 0) + 1;
  }
  console.log(`\nEstado actual de las ${urls.length} URLs del panel:`);
  for (const [state, count] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(3)}  ${state}`);
  }
  console.log(
    transitions.length
      ? `Cambios desde la ejecucion anterior:\n- ${transitions.join('\n- ')}`
      : 'Sin cambios de estado desde la ejecucion anterior.',
  );
  console.log(`\nHistorico: ${path.relative(ROOT, PANEL_PATH)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
