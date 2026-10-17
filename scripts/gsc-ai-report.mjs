/**
 * Informe «Funciones de IA generativa» de Search Console (AI Overviews + modo IA).
 *
 * Por qué es un script que lee CSV y no una consulta a la API: el informe existe
 * en el panel desde el 3-jun-2026 (para todos los sitios desde el 31-ago), pero la
 * API no lo expone. Verificado el 11-oct-2026: `type` = generativeAi / aiOverview /
 * aiMode da «Invalid value» y `searchAppearance` devuelve 0 filas. La única vía es
 * el botón EXPORTAR del panel, que Alfonso deja en data/gsc-ai/ (ver su README).
 *
 * Qué añade este script a lo que ya se ve en el panel:
 * - el denominador: impresiones Web de la misma ventana, por periodo y por página
 *   (estas sí salen de la API), para saber qué parte de lo que Google enseña de
 *   cada página lo enseña dentro de una respuesta de IA;
 * - para crearsoftware, el cruce con las peticiones de agentes en vivo a contenido
 *   (contador de borde) y con las citas de Bing (export manual de AI Performance).
 *
 * Lo que el informe de Google NO da y no se puede reconstruir: clics, CTR,
 * posición y consultas. Sus impresiones ya están dentro del total «Web», así que
 * el % de IA es una parte de la Web, no algo que se le suma.
 *
 * El formato del CSV no está documentado. El lector reconoce las tablas por la
 * cabecera de la primera columna, en español o en inglés, y si no reconoce algo lo
 * dice en vez de adivinar.
 *
 * Uso:
 *   npm run seo:gsc:ai                                   # última exportación de data/gsc-ai/
 *   npm run seo:gsc:ai -- --export=2026-10-17            # una exportación concreta
 *   npm run seo:gsc:ai -- --dir=../deepdna/data/gsc-ai --site=https://deepdna.ai/
 *
 * Con --dir, el informe se escribe en la carpeta padre de --dir.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { loadLocalEnv } from './lib/load-local-env.mjs';
import { getGSCSiteUrl, querySearchConsole, resolveGSCSiteUrl } from './lib/google-search-console.mjs';

loadLocalEnv();

const ROOT = process.cwd();
const LIVE_AGENTS = ['ChatGPT-User', 'Claude-User', 'Perplexity-User'];

function parseArgs(argv) {
  const options = {};
  for (const raw of argv) {
    if (!raw.startsWith('--')) continue;
    const [key, ...rest] = raw.slice(2).split('=');
    options[key] = rest.length ? rest.join('=') : 'true';
  }
  return options;
}

const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const isoDay = (d) => d.toISOString().slice(0, 10);
const addDays = (iso, n) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return isoDay(d);
};
const fileDay = (file) => isoDay(statSync(file).mtime);
const pct = (a, b) => (b > 0 ? `${((100 * a) / b).toFixed(1).replace('.', ',')} %` : '—');
const fmt = (n) => Number(n).toLocaleString('es-ES');

// ---------------------------------------------------------------------------
// 1. Localizar la exportación: ZIP, CSV sueltos o carpeta por fecha
// ---------------------------------------------------------------------------

function hasCsv(dir) {
  return existsSync(dir) && readdirSync(dir).some((f) => f.toLowerCase().endsWith('.csv'));
}

function tidyInbox(dir) {
  const entries = readdirSync(dir);

  // ZIP descargado del panel → carpeta con la fecha del nombre (o de modificación).
  for (const name of entries.filter((f) => f.toLowerCase().endsWith('.zip'))) {
    const zip = path.join(dir, name);
    const day = name.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? fileDay(zip);
    const dest = path.join(dir, day);
    if (hasCsv(dest)) continue;
    mkdirSync(dest, { recursive: true });
    execFileSync('unzip', ['-o', '-q', '-j', zip, '*.csv', '-d', dest]);
    console.log(`Descomprimido ${name} -> ${path.relative(ROOT, dest)}/`);
  }

  // CSV sueltos en la raíz → carpeta con la fecha del más reciente.
  const loose = entries.filter((f) => f.toLowerCase().endsWith('.csv')).map((f) => path.join(dir, f));
  if (loose.length) {
    const day = loose.map(fileDay).sort().at(-1);
    const dest = path.join(dir, day);
    mkdirSync(dest, { recursive: true });
    for (const file of loose) renameSync(file, path.join(dest, path.basename(file)));
    console.log(`Movidos ${loose.length} CSV sueltos -> ${path.relative(ROOT, dest)}/`);
  }
}

function listExports(dir) {
  return readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}/.test(f) && statSync(path.join(dir, f)).isDirectory() && hasCsv(path.join(dir, f)))
    .sort();
}

// ---------------------------------------------------------------------------
// 2. Leer las tablas
// ---------------------------------------------------------------------------

function parseCsv(text) {
  text = text.replace(/^﻿/, '');
  const firstLine = text.split(/\r?\n/, 1)[0];
  const sep = firstLine.includes(';') && !firstLine.includes(',') ? ';' : firstLine.includes('\t') && !firstLine.includes(',') ? '\t' : ',';
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const endRow = () => {
    row.push(field);
    field = '';
    if (row.some((f) => f.trim() !== '')) rows.push(row);
    row = [];
  };
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i += 1;
      endRow();
    } else field += c;
  }
  if (field !== '' || row.length) endRow();
  return rows;
}

function classify(header) {
  const h = norm(header);
  if (/filtro|filter/.test(h)) return 'filters';
  if (/pagina|page|url/.test(h)) return 'pages';
  if (/pais|countr/.test(h)) return 'countries';
  if (/dispositivo|device/.test(h)) return 'devices';
  if (/fecha|date|semana|week|mes|month|hora|hour|dia|day|periodo|period/.test(h)) return 'series';
  return null;
}

// «~» y «-» son las celdas que el panel no muestra; Google las exporta como 0.
function parseCount(value) {
  const v = String(value ?? '').replace(/[\s ]/g, '');
  if (v === '' || v === '~' || v === '-') return 0;
  if (/^\d{1,3}([.,]\d{3})+$/.test(v)) return Number(v.replace(/[.,]/g, ''));
  const n = Number(v.replace(',', '.'));
  if (!Number.isFinite(n)) throw new Error(`valor no numérico: «${value}»`);
  return n;
}

// Devuelve [inicio, fin] en ISO. Admite ISO, rangos «a – b» y fechas con barras.
// El orden de las barras depende de la fuente: el panel de Google en español usa
// d/m/aa; Bing exporta m/d/aaaa («8/17/2026 12:00:00 AM»). Leerlo al revés
// convertía el 9 de agosto en el 8 de septiembre sin dar error.
function parseDates(cell, order = 'dmy') {
  const iso = String(cell).match(/\d{4}-\d{2}-\d{2}/g);
  if (iso) return [iso[0], iso.at(-1)];
  const slashed = [...String(cell).matchAll(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/g)].map(([, a, b, y]) => {
    const [d, m] = order === 'mdy' ? [b, a] : [a, b];
    if (Number(m) > 12 || Number(d) > 31) throw new Error(`fecha imposible en orden ${order}: «${cell}»`);
    const year = y.length === 2 ? `20${y}` : y;
    return `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  });
  if (slashed.length) return [slashed[0], slashed.at(-1)];
  return null;
}

function readExport(folder) {
  const tables = {};
  const ignored = [];
  for (const name of readdirSync(folder).filter((f) => f.toLowerCase().endsWith('.csv')).sort()) {
    const rows = parseCsv(readFileSync(path.join(folder, name), 'utf8'));
    if (!rows.length) continue;
    const [header, ...body] = rows;
    const kind = classify(header[0]);
    if (!kind) {
      ignored.push(`${name} (cabecera «${header.join(', ')}»)`);
      continue;
    }
    if (kind === 'filters') {
      tables.filters = body.map(([k, ...v]) => [k, v.join(', ')]);
      continue;
    }
    let col = header.findIndex((h) => /impresion|impression/.test(norm(h)));
    if (col < 0 && header.length === 2) col = 1;
    if (col < 0) throw new Error(`${name}: no encuentro la columna de impresiones en «${header.join(', ')}»`);
    tables[kind] = {
      file: name,
      header,
      rows: body.map((r) => {
        try {
          return { key: r[0], impressions: parseCount(r[col]) };
        } catch (error) {
          throw new Error(`${name}: ${error.message} en la fila «${r.join(', ')}»`);
        }
      }),
    };
  }
  return { tables, ignored };
}

// Agrupa la serie y deduce la granularidad. Si el periodo solo trae la fecha de
// inicio, la semana se toma como inicio + 6 días: SUPUESTO, porque Google no
// documenta si la etiqueta es el primer o el último día. Exportar «Cada día» lo evita.
function buildSeries(table) {
  const byStart = new Map();
  for (const { key, impressions } of table.rows) {
    const dates = parseDates(key);
    if (!dates) throw new Error(`${table.file}: no entiendo la fecha «${key}»`);
    const prev = byStart.get(dates[0]) ?? { start: dates[0], end: dates[1], impressions: 0 };
    prev.impressions += impressions;
    byStart.set(dates[0], prev);
  }
  const periods = [...byStart.values()].sort((a, b) => a.start.localeCompare(b.start));
  const gaps = periods.slice(1).map((p, i) => (Date.parse(p.start) - Date.parse(periods[i].start)) / 86_400_000).sort((a, b) => a - b);
  const gap = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 1;
  const granularity = gap <= 1 ? 'día' : gap <= 7 ? 'semana' : 'mes';
  let assumed = false;
  for (const p of periods) {
    if (p.end !== p.start || granularity === 'día') continue;
    assumed = true;
    if (granularity === 'semana') p.end = addDays(p.start, 6);
    else {
      const d = new Date(`${p.start}T00:00:00Z`);
      p.end = isoDay(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)));
    }
  }
  return { periods, granularity, assumed, start: periods[0].start, end: periods.at(-1).end };
}

// ---------------------------------------------------------------------------
// 3. Denominador (API) y cruces
// ---------------------------------------------------------------------------

function urlKey(url) {
  try {
    const u = new URL(url);
    let p = u.pathname;
    try {
      p = decodeURI(p);
    } catch {}
    return `${u.hostname.replace(/^www\./, '').toLowerCase()}${p.toLowerCase()}`;
  } catch {
    return norm(url).replace(/#.*$/, '');
  }
}

async function fetchWeb(siteUrl, start, end) {
  const common = { siteUrl, startDate: start, endDate: end, rowLimit: 25_000, dataState: 'all' };
  const [byDate, byPage] = await Promise.all([
    querySearchConsole({ ...common, dimensions: ['date'] }),
    querySearchConsole({ ...common, dimensions: ['page'] }),
  ]);
  const pages = new Map();
  for (const r of byPage) {
    // Las filas con «#» (anclas, text fragments) son la misma página.
    const k = urlKey(r.keys[0]);
    const prev = pages.get(k) ?? { impressions: 0, clicks: 0 };
    prev.impressions += r.impressions;
    prev.clicks += r.clicks;
    pages.set(k, prev);
  }
  const days = new Map(byDate.map((r) => [r.keys[0], r.impressions]));
  return { pages, days, lastDay: [...days.keys()].sort().at(-1) };
}

function liveAgentHits(start, end) {
  const file = path.join(ROOT, 'data', 'geo-agents-edge-history.json');
  if (!existsSync(file)) return null;
  const { days } = JSON.parse(readFileSync(file, 'utf8'));
  const covered = Object.keys(days).filter((d) => d >= start && d <= end).sort();
  if (!covered.length) return null;
  const hits = new Map();
  for (const d of covered) {
    for (const [p, agents] of Object.entries(days[d].paths)) {
      if (p === '/' || p.endsWith('.md')) continue;
      const n = LIVE_AGENTS.reduce((s, a) => s + (agents[a] ?? 0), 0);
      if (!n) continue;
      const k = urlKey(`https://crearsoftware.com${p}`);
      hits.set(k, (hits.get(k) ?? 0) + n);
    }
  }
  return { hits, from: covered[0], to: covered.at(-1), days: covered.length };
}

function bingCitations(start, end) {
  const dir = path.join(ROOT, 'data', 'bing-ai-performance');
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => /^overview-.*\.csv$/.test(f)).sort();
  if (!files.length) return null;
  const byDay = new Map();
  for (const f of files) {
    const [header, ...rows] = parseCsv(readFileSync(path.join(dir, f), 'utf8'));
    const dc = header.findIndex((h) => /date|fecha/.test(norm(h)));
    const cc = header.findIndex((h) => /citation|cita/.test(norm(h)));
    for (const r of rows) {
      const d = parseDates(r[dc], 'mdy')?.[0];
      if (d) byDay.set(d, parseCount(r[cc]));
    }
  }
  const inWindow = [...byDay].filter(([d]) => d >= start && d <= end);
  const all = [...byDay.keys()].sort();
  return {
    citations: inWindow.reduce((s, [, n]) => s + n, 0),
    days: inWindow.length,
    archiveFrom: all[0],
    archiveTo: all.at(-1),
  };
}

// ---------------------------------------------------------------------------
// 4. Informe
// ---------------------------------------------------------------------------

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const dir = path.resolve(ROOT, options.dir ?? path.join('data', 'gsc-ai'));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  tidyInbox(dir);

  const exportsFound = listExports(dir);
  const chosen = options.export ?? exportsFound.at(-1);
  if (!chosen) {
    console.log(`No hay exportaciones en ${path.relative(ROOT, dir) || dir}/.`);
    console.log('Pendiente de Alfonso: Search Console -> Rendimiento -> IA generativa -> EXPORTAR (ver README).');
    return;
  }
  const folder = path.join(dir, chosen);
  if (!hasCsv(folder)) throw new Error(`La exportación ${chosen} no existe o no tiene CSV.`);

  const { tables, ignored } = readExport(folder);
  if (!tables.series) {
    throw new Error(
      `${chosen}: no encuentro la serie por fechas (pestaña «Fechas»/«Semanas»). ` +
        `Tablas leídas: ${Object.keys(tables).join(', ') || 'ninguna'}. Ignoradas: ${ignored.join('; ') || 'ninguna'}.`,
    );
  }
  const series = buildSeries(tables.series);

  const { resolvedSiteUrl: siteUrl } = await resolveGSCSiteUrl({ siteUrl: options.site ?? getGSCSiteUrl() });
  const web = await fetchWeb(siteUrl, series.start, series.end);
  const isCrearsoftware = /crearsoftware\.com/.test(siteUrl);
  const live = isCrearsoftware ? liveAgentHits(series.start, series.end) : null;
  const bing = isCrearsoftware ? bingCitations(series.start, series.end) : null;

  const totalAi = series.periods.reduce((s, p) => s + p.impressions, 0);
  const periods = series.periods.map((p) => {
    let w = 0;
    for (let d = p.start; d <= p.end; d = addDays(d, 1)) w += web.days.get(d) ?? 0;
    return { ...p, web: w };
  });
  const totalWeb = periods.reduce((s, p) => s + p.web, 0);

  const pages = (tables.pages?.rows ?? []).map(({ key, impressions }) => {
    const k = urlKey(key);
    const w = web.pages.get(k);
    return {
      url: key,
      ai: impressions,
      webImpressions: w?.impressions ?? null,
      webClicks: w?.clicks ?? null,
      liveAgents: live ? live.hits.get(k) ?? 0 : null,
    };
  });
  pages.sort((a, b) => b.ai - a.ai);
  const pagesAi = pages.reduce((s, p) => s + p.ai, 0);
  const overWeb = pages.filter((p) => p.webImpressions !== null && p.ai > p.webImpressions);

  const L = [];
  L.push(`# Funciones de IA generativa de Google — ${siteUrl}`, '');
  L.push(`Fecha de generación: ${new Date().toISOString()}`);
  L.push(`Exportación: \`${path.relative(ROOT, folder) || folder}\` (${tables.series.file}${tables.pages ? `, ${tables.pages.file}` : ''})`);
  L.push(`Ventana: ${series.start} → ${series.end}, agrupada por ${series.granularity}`);
  if (tables.filters?.length) L.push(`Filtros del panel: ${tables.filters.map(([k, v]) => `${k}: ${v}`).join(' · ')}`);
  L.push('');
  L.push('## Resumen', '');
  L.push(`- **Impresiones en funciones de IA:** ${fmt(totalAi)} (suma de la serie).`);
  if (tables.pages) L.push(`- Suma de la tabla de páginas: ${fmt(pagesAi)}. Puede no coincidir: el gráfico cuenta como una sola impresión varias URLs del sitio en la misma búsqueda, la tabla cuenta cada página.`);
  L.push(`- **Impresiones Web en la misma ventana** (API, \`dataState=all\`): ${fmt(totalWeb)}.`);
  L.push(`- **Parte de la Web que Google enseña dentro de una respuesta de IA: ${pct(totalAi, totalWeb)}.** Las impresiones de IA ya están dentro de la Web; no se suman.`);
  if (web.lastDay && web.lastDay < series.end) L.push(`- Ojo: la API solo tiene datos hasta el ${web.lastDay}; los días posteriores de la ventana cuentan 0 en la Web y el % de esos periodos sale inflado.`);
  if (bing) {
    L.push(
      bing.days
        ? `- **Citas de Bing en la misma ventana:** ${fmt(bing.citations)} en ${bing.days} días con dato (archivo manual de AI Performance).`
        : `- Citas de Bing: el archivo manual cubre ${bing.archiveFrom} → ${bing.archiveTo} y no se solapa con esta ventana. Falta exportar AI Performance.`,
    );
  }
  if (live) L.push(`- Agentes en vivo pidiendo contenido (contador de borde, ${live.from} → ${live.to}, ${live.days} días): ${fmt([...live.hits.values()].reduce((s, n) => s + n, 0))} peticiones, sin contar la home.`);
  L.push('');

  L.push('## Serie', '');
  L.push('| Periodo | IA | Web | % IA |', '| --- | --- | --- | --- |');
  for (const p of periods) L.push(`| ${p.start}${p.end !== p.start ? ` → ${p.end}` : ''} | ${fmt(p.impressions)} | ${fmt(p.web)} | ${pct(p.impressions, p.web)} |`);
  if (series.assumed) L.push('', `Supuesto: cada ${series.granularity} empieza en la fecha que da el CSV. Google no lo documenta; exportar con «Cada día» lo evita.`);
  L.push('');

  if (pages.length) {
    L.push('## Páginas', '');
    const head = ['Página', 'IA', 'Web impr.', '% IA', 'Web clics'];
    if (live) head.push('Agentes en vivo');
    L.push(`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`);
    for (const p of pages.slice(0, 40)) {
      const cells = [
        p.url.replace(/^https?:\/\/(www\.)?/, ''),
        fmt(p.ai),
        p.webImpressions === null ? '—' : fmt(p.webImpressions),
        p.webImpressions === null ? '—' : pct(p.ai, p.webImpressions),
        p.webClicks === null ? '—' : fmt(p.webClicks),
      ];
      if (live) cells.push(fmt(p.liveAgents));
      L.push(`| ${cells.join(' | ')} |`);
    }
    if (pages.length > 40) L.push('', `… y ${pages.length - 40} páginas más en el JSON.`);
    if (overWeb.length) L.push('', `Inconsistencia a vigilar: ${overWeb.length} página(s) con más impresiones de IA que Web, que no debería pasar si las de IA están dentro de la Web.`);
    L.push('');
  }

  for (const [kind, title] of [['countries', 'Países'], ['devices', 'Dispositivos']]) {
    if (!tables[kind]) continue;
    const rows = [...tables[kind].rows].sort((a, b) => b.impressions - a.impressions).slice(0, 10);
    L.push(`## ${title}`, '', '| | IA | % |', '| --- | --- | --- |');
    const sum = tables[kind].rows.reduce((s, r) => s + r.impressions, 0);
    for (const r of rows) L.push(`| ${r.key} | ${fmt(r.impressions)} | ${pct(r.impressions, sum)} |`);
    L.push('');
  }

  if (ignored.length) L.push('## CSV no reconocidos', '', ...ignored.map((i) => `- ${i}`), '');

  L.push('## Caveats', '');
  L.push('- El informe de Google solo da impresiones: ni clics, ni CTR, ni posición, ni consultas.');
  L.push('- Una impresión es que un enlace al sitio aparezca en un AI Overview o en el modo IA, no que se lea ni que se cite el texto.');
  L.push('- La API no expone este informe (verificado el 11-oct-2026); depende de exportarlo a mano.');
  L.push('- Los datos más recientes del panel pueden ser provisionales (línea discontinua).');
  L.push('');

  const outDir = path.dirname(dir);
  const md = `${L.join('\n')}\n`;
  const json = `${JSON.stringify({ siteUrl, export: chosen, series: { ...series, periods }, totalAi, totalWeb, pagesAi, pages, countries: tables.countries?.rows ?? null, devices: tables.devices?.rows ?? null, bing, live: live ? { from: live.from, to: live.to, days: live.days } : null, ignored }, null, 2)}\n`;
  for (const suffix of [chosen, 'latest']) {
    writeFileSync(path.join(outDir, `gsc-ai-report-${suffix}.md`), md);
    writeFileSync(path.join(outDir, `gsc-ai-report-${suffix}.json`), json);
  }
  console.log(md);
  console.log(`Informe: ${path.relative(ROOT, path.join(outDir, `gsc-ai-report-${chosen}.md`))}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
