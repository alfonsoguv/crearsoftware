// Panel fijo de estados de indexacion. La muestra rotativa de
// `seo:gsc:indexation` ve cada URL una sola vez por vuelta al sitemap, asi que
// da la tasa pero nunca dice que le pasa a una URL entre una vuelta y la
// siguiente. Este script reinspecciona SIEMPRE las mismas URLs y acumula su
// historia en `data/gsc-state-panel.json` (versionado).
//
// Cohortes (una URL entra en la primera que le toca y no sale nunca, aunque se
// indexe: la transicion es justo el dato que se busca):
//   - sin-rastrear: salio alguna vez «Google no reconoce esta URL» o
//     «Descubierta». Son la misma poblacion: la API alterna entre los dos
//     estados en llamadas separadas 30 segundos (medido el 04-oct-2026).
//   - rastreada-sin-indexar: salio alguna vez «Rastreada: actualmente sin
//     indexar», la causa dominante de la no indexacion.
//   - control: 40 URLs que solo han salido indexadas, elegidas al azar con
//     semilla fija. Miden el flujo inverso: cuantas indexadas se caen.
// El panel se alimenta solo con lo que aparezca en los
// `data/gsc-indexation-audit-*.json`. Al entrar, cada URL arranca con su
// ultima observacion de la muestra (fuente «muestra»), asi que la primera
// reinspeccion ya dice si ha cambiado.
//
// Lo que motivo el panel (18-oct-2026): de 53 URLs «Rastreada: actualmente sin
// indexar», las 13 que Google habia vuelto a rastrear desde que se observaron
// estaban todas indexadas. El estado no es un veredicto fijo: es la ultima
// lectura de una pagina que Google lleva meses sin visitar. Y a los ~180 dias
// sin rastreo la API olvida el rastreo y la URL pasa a «Descubierta» o «no
// reconoce» (corte limpio entre 20 y 20 URLs ese dia; pendiente de confirmar).
//
// `experiments` (opcional, se edita a mano en el JSON) registra grupos de URLs
// con y sin intervencion; cada ejecucion imprime como va cada grupo.
//
// Coste: una llamada a la API de inspeccion por URL (cupo de 2000/dia).

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
const PANEL_PATH = path.join(DATA_DIR, 'gsc-state-panel.json');
const INDEXED = 'Enviada e indexada';
const CRAWLED_NOT_INDEXED = 'Rastreada: actualmente sin indexar';
const CONTROL_SIZE = 40;
const CONTROL_SEED = 20261018;
const COHORTS = ['sin-rastrear', 'rastreada-sin-indexar', 'control'];
const SITEMAP_URL = 'https://crearsoftware.com/sitemap.xml';

loadLocalEnv();

function cohortOf(coverageState) {
  if (coverageState === CRAWLED_NOT_INDEXED) return 'rastreada-sin-indexar';
  if (coverageState === 'Google no reconoce esta URL' || coverageState?.startsWith('Descubierta')) {
    return 'sin-rastrear';
  }
  return null;
}

function readPanel() {
  if (!existsSync(PANEL_PATH)) return { note: '', urls: {} };
  return JSON.parse(readFileSync(PANEL_PATH, 'utf8'));
}

// Solo entran URLs que siguen publicadas: los informes de abril incluyen
// taxonomias retiradas y slugs renombrados, que saldrian como no indexadas
// para siempre y ensuciarian las cohortes.
async function liveSitemapUrls() {
  const response = await fetch(SITEMAP_URL);
  if (!response.ok) throw new Error(`No se pudo leer ${SITEMAP_URL}: HTTP ${response.status}`);
  const xml = await response.text();
  return new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]));
}

function sampleEntry(date, result) {
  return {
    date,
    source: 'muestra',
    coverageState: result.coverageState,
    lastCrawlTime: result.lastCrawlTime ?? null,
  };
}

// Recorre los informes de la muestra en orden. Devuelve la primera cohorte de
// cada URL no indexada y la ultima observacion de todas.
function readAudits() {
  const firstCohort = {};
  const lastSeen = {};
  const files = readdirSync(DATA_DIR)
    .filter((name) => /^gsc-indexation-audit-\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort();

  for (const name of files) {
    const date = name.slice('gsc-indexation-audit-'.length, -'.json'.length);
    const report = JSON.parse(readFileSync(path.join(DATA_DIR, name), 'utf8'));
    for (const result of [...(report.indexed ?? []), ...(report.notIndexed ?? [])]) {
      lastSeen[result.url] = { date, result };
      const cohort = cohortOf(result.coverageState);
      if (cohort && !firstCohort[result.url]) firstCohort[result.url] = { cohort, date };
    }
  }
  return { firstCohort, lastSeen };
}

// mulberry32: generador con semilla, para que el control sea reproducible.
function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickControl(lastSeen, firstCohort, panel, live) {
  const candidates = Object.keys(lastSeen)
    .filter((url) => live.has(url) && !firstCohort[url] && !panel.urls[url])
    .filter((url) => lastSeen[url].result.coverageState === INDEXED)
    .sort();
  const random = seededRandom(CONTROL_SEED);
  for (let i = candidates.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return candidates.slice(0, CONTROL_SIZE);
}

function crawlDay(entry) {
  return entry?.lastCrawlTime ? entry.lastCrawlTime.slice(0, 10) : '-';
}

async function main() {
  const panel = readPanel();
  panel.note =
    'Panel fijo de estados de indexacion: cohortes sin-rastrear, rastreada-sin-indexar y control. ' +
    'Se reinspeccionan todas en cada ejecucion (npm run seo:gsc:panel). Ver scripts/gsc-state-panel.mjs.';

  const { firstCohort, lastSeen } = readAudits();
  const live = await liveSitemapUrls();
  for (const [url, { cohort, date }] of Object.entries(firstCohort)) {
    if (panel.urls[url] || !live.has(url)) continue;
    panel.urls[url] = {
      cohort,
      firstSeen: date,
      history: [sampleEntry(lastSeen[url].date, lastSeen[url].result)],
    };
  }
  if (!Object.values(panel.urls).some((entry) => entry.cohort === 'control')) {
    for (const url of pickControl(lastSeen, firstCohort, panel, live)) {
      panel.urls[url] = {
        cohort: 'control',
        firstSeen: lastSeen[url].date,
        history: [sampleEntry(lastSeen[url].date, lastSeen[url].result)],
      };
    }
  }

  const urls = Object.keys(panel.urls).sort();
  if (!urls.length) {
    console.log('Panel vacio: no hay informes de indexacion de los que alimentarlo.');
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
  const recrawled = [];
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

    const item = panel.urls[url];
    const history = item.history.filter((h) => h.date !== date || h.source === 'muestra');
    const previous = [...history].reverse().find((h) => !h.error);
    history.push(entry);
    item.history = history;
    if (entry.error || !previous) continue;

    const label = `[${item.cohort}] ${url}`;
    if (previous.coverageState !== entry.coverageState) {
      transitions.push(`${label}: ${previous.coverageState} -> ${entry.coverageState}`);
    }
    if (entry.lastCrawlTime && entry.lastCrawlTime > (previous.lastCrawlTime ?? '')) {
      recrawled.push(
        `${label}: rastreo ${crawlDay(previous)} -> ${crawlDay(entry)}, ` +
          `${previous.coverageState} -> ${entry.coverageState}`,
      );
    }
  }

  await writeFile(PANEL_PATH, `${JSON.stringify(panel, null, 2)}\n`, 'utf8');

  console.log('Estado actual por cohorte:');
  for (const cohort of COHORTS) {
    const members = urls.filter((url) => panel.urls[url].cohort === cohort);
    if (!members.length) continue;
    const tally = {};
    let everRecrawled = 0;
    let recrawledIndexed = 0;
    for (const url of members) {
      const history = panel.urls[url].history.filter((h) => !h.error);
      const last = history.at(-1);
      const key = last ? last.coverageState : 'error de la API';
      tally[key] = (tally[key] ?? 0) + 1;
      // Flujo acumulado: rastreada de nuevo desde que entro en el panel.
      const first = history[0];
      if (last?.lastCrawlTime && last.lastCrawlTime > (first?.lastCrawlTime ?? '')) {
        everRecrawled += 1;
        if (last.coverageState === INDEXED) recrawledIndexed += 1;
      }
    }
    console.log(`\n  ${cohort} (${members.length} URLs)`);
    for (const [state, count] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
      console.log(`    ${String(count).padStart(3)}  ${state}`);
    }
    console.log(
      `    rastreadas de nuevo desde que entraron: ${everRecrawled}, ` +
        `de ellas indexadas ahora: ${recrawledIndexed}`,
    );
  }

  // Experimentos registrados a mano en `experiments` del JSON: dos grupos de
  // URLs del panel, uno con intervencion y otro de control.
  for (const [name, experiment] of Object.entries(panel.experiments ?? {})) {
    console.log(`\nExperimento ${name} (desde ${experiment.start}): ${experiment.description}`);
    for (const [arm, members] of Object.entries(experiment.groups)) {
      let indexed = 0;
      let recrawledSinceStart = 0;
      for (const url of members) {
        const history = panel.urls[url]?.history.filter((h) => !h.error) ?? [];
        const last = history.at(-1);
        const atStart = [...history].reverse().find((h) => h.date <= experiment.start);
        if (last?.coverageState === INDEXED) indexed += 1;
        if (last?.lastCrawlTime && last.lastCrawlTime > (atStart?.lastCrawlTime ?? '')) recrawledSinceStart += 1;
      }
      console.log(
        `  ${arm.padEnd(12)} ${members.length} URLs: ${indexed} indexadas, ` +
          `${recrawledSinceStart} rastreadas de nuevo desde el inicio`,
      );
    }
    if (experiment.prediction) console.log(`  Prediccion: ${experiment.prediction}`);
  }

  console.log(
    recrawled.length
      ? `\nRastreadas de nuevo desde la lectura anterior:\n- ${recrawled.join('\n- ')}`
      : '\nNinguna rastreada de nuevo desde la lectura anterior.',
  );
  console.log(
    transitions.length
      ? `\nCambios de estado desde la lectura anterior:\n- ${transitions.join('\n- ')}`
      : '\nSin cambios de estado desde la lectura anterior.',
  );
  console.log(`\nHistorico: ${path.relative(ROOT, PANEL_PATH)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
