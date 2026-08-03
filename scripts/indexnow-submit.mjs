/**
 * IndexNow: avisa a Bing (y a los demás buscadores del protocolo) de las URLs
 * nuevas o modificadas, sin esperar a que las descubra rastreando.
 *
 * Por qué importa aquí: Bing alimenta a ChatGPT, así que el tiempo que tarda
 * una página en entrar en su índice es tiempo que tarda en poder ser citada.
 * Con despliegue automático en cada push, avisar es gratis.
 *
 * Uso:
 *   npm run seo:indexnow -- --since=7      # URLs modificadas en los últimos 7 días (por defecto)
 *   npm run seo:indexnow -- --url=/blog/x/ # una URL concreta (repetible)
 *   npm run seo:indexnow -- --all          # todo el sitemap; usar con criterio
 *   npm run seo:indexnow -- --dry-run      # muestra qué enviaría y no envía nada
 *
 * El protocolo pide no enviar URLs que no han cambiado: un envío masivo y
 * repetido es la forma de que te ignoren. Por eso el modo por defecto es
 * incremental y `--all` hay que pedirlo a mano.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const HOST = 'crearsoftware.com';
const KEY = '13c316e3e7b509aa70e737a790113afe';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS = 10_000; // límite del protocolo por petición

function parseArgs(argv) {
  const options = {};
  const urls = [];
  for (const raw of argv) {
    if (!raw.startsWith('--')) continue;
    const [key, value] = raw.slice(2).split('=');
    if (key === 'url') urls.push(value);
    else options[key] = value ?? 'true';
  }
  return { options, urls };
}

function readSitemap() {
  const sitemapPath = path.join(ROOT, 'dist', 'sitemap.xml');
  if (!existsSync(sitemapPath)) {
    throw new Error('Falta dist/sitemap.xml. Ejecuta `bash build.sh` antes.');
  }
  const xml = readFileSync(sitemapPath, 'utf8');
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => {
    const block = match[1];
    return {
      loc: block.match(/<loc>(.*?)<\/loc>/)?.[1] ?? '',
      lastmod: block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1] ?? '',
    };
  }).filter((entry) => entry.loc);
}

async function main() {
  const { options, urls: explicitUrls } = parseArgs(process.argv.slice(2));
  let urlList;
  let reason;

  if (explicitUrls.length) {
    urlList = explicitUrls.map((u) => (u.startsWith('http') ? u : `https://${HOST}${u}`));
    reason = `${urlList.length} URL(s) indicadas a mano`;
  } else if (options.all) {
    urlList = readSitemap().map((entry) => entry.loc);
    reason = `sitemap completo (${urlList.length} URLs)`;
  } else {
    const days = Number.parseInt(options.since ?? '7', 10);
    const cutoff = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
    urlList = readSitemap()
      .filter((entry) => entry.lastmod && entry.lastmod.slice(0, 10) >= cutoff)
      .map((entry) => entry.loc);
    reason = `modificadas desde ${cutoff} (${urlList.length} URLs)`;
  }

  if (!urlList.length) {
    console.log('No hay URLs que enviar. Nada que hacer.');
    return;
  }

  if (urlList.length > MAX_URLS) {
    console.log(`Recortando de ${urlList.length} a ${MAX_URLS} URLs (límite del protocolo).`);
    urlList = urlList.slice(0, MAX_URLS);
  }

  console.log(`IndexNow -> ${HOST}: ${reason}`);
  for (const url of urlList.slice(0, 20)) console.log(`  ${url}`);
  if (urlList.length > 20) console.log(`  ... y ${urlList.length - 20} más`);

  if (options['dry-run']) {
    console.log('\n--dry-run: no se ha enviado nada.');
    return;
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList,
    }),
  });

  const body = await response.text();
  console.log(`\nRespuesta: HTTP ${response.status}${body ? ` — ${body.slice(0, 200)}` : ''}`);

  // 200 = aceptado; 202 = aceptado, clave pendiente de validar. Ambos son éxito.
  if (response.status === 200 || response.status === 202) {
    console.log('Enviado correctamente.');
  } else {
    process.exitCode = 1;
    console.log('El envío ha fallado. 403 suele ser la clave no accesible en la raíz del sitio.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
