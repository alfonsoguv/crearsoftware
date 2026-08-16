/**
 * GEO: conteo de rastreadores de IA por user-agent.
 *
 * Los motores generativos no ejecutan JavaScript, así que ninguna analítica de
 * cliente (incluida Cloudflare Web Analytics) los ve. La única forma de saber si
 * GPTBot, ClaudeBot o PerplexityBot leen el sitio es contarlos en el servidor.
 *
 * Agregación: una clave por bot y hora (`bot:YYYY-MM-DD:HH:<bot>`), leída y
 * reescrita con el contador. Es deliberadamente aproximada: durante una ráfaga
 * concurrente varias peticiones leen el mismo valor y el conteo se queda corto.
 * Sirve para detectar tendencia, no para auditar peticiones una a una.
 *
 * OJO con el coste: lo acotado a ~24 por bot y día es el número de CLAVES, no
 * el de escrituras. Las escrituras crecen con el tráfico de rastreadores: el
 * 2026-08-02 fueron 519, el 52% del cupo diario de KV de toda la cuenta, que se
 * comparte con el alta de newsletter. El 2026-08-05 (1026 hits) y el 2026-08-12
 * (1253, de los que 1248 fueron una sola ráfaga de GPTBot) ese cupo se agotó.
 * Por eso los hits ya no se escriben uno a uno: se agregan en memoria del
 * isolate y se vuelcan por lotes (ver `flushBuffer`). Migrar a Analytics Engine
 * sigue siendo lo correcto —Issue #35—, pero requiere el panel de Cloudflare.
 *
 * Nunca bloquea la respuesta: el contador va en waitUntil y cualquier fallo se
 * ignora.
 */

import { SLUG_MAP } from "./_slug-map";

interface Env {
  CS_KV?: KVNamespace;
}

// Familias: entrenamiento, búsqueda y agentes en vivo. El orden importa —
// se usa la primera coincidencia, así que los patrones más específicos van antes.
const AI_AGENTS: Array<[string, RegExp]> = [
  ["OAI-SearchBot", /OAI-SearchBot/i],
  ["ChatGPT-User", /ChatGPT-User/i],
  ["GPTBot", /GPTBot/i],
  ["Claude-SearchBot", /Claude-SearchBot/i],
  ["Claude-User", /Claude-User/i],
  ["ClaudeBot", /ClaudeBot|anthropic-ai/i],
  ["Perplexity-User", /Perplexity-User/i],
  ["PerplexityBot", /PerplexityBot/i],
  ["Google-Extended", /Google-Extended/i],
  ["Applebot-Extended", /Applebot-Extended/i],
  ["Meta-ExternalAgent", /Meta-ExternalAgent|FacebookBot/i],
  ["Amazonbot", /Amazonbot/i],
  ["MistralAI-User", /MistralAI/i],
  ["cohere-ai", /cohere-ai/i],
  ["CCBot", /CCBot/i],
  ["Bingbot", /bingbot/i],
  ["Googlebot", /Googlebot/i],
];

const TTL_SECONDS = 90 * 86400;

function identifyAgent(userAgent: string): string | null {
  for (const [name, pattern] of AI_AGENTS) {
    if (pattern.test(userAgent)) return name;
  }
  return null;
}

// Solo interesan las páginas. Contar cada fuente, imagen y hoja de estilo
// multiplicaría las escrituras sin aportar señal.
function isPageRequest(url: URL): boolean {
  return formatOf(url.pathname) !== null;
}

// Formato servido. Es la pregunta abierta del experimento de los gemelos
// Markdown: no hay evidencia pública de que servir `.md` aumente las citas, así
// que hace falta medir qué proporción de las lecturas de agentes va a Markdown.
// El top de rutas no sirve para eso: está truncado a 25 y deja fuera la cola.
// Este agregado va DENTRO de la entrada que ya se escribe, así que no añade ni
// una clave ni una escritura a KV (ver la nota de cuota en la cabecera).
function formatOf(pathname: string): "md" | "llms" | "html" | null {
  if (pathname.endsWith(".md")) return "md";
  if (pathname === "/llms.txt" || pathname === "/llms-full.txt") return "llms";
  if (pathname.endsWith("/") || pathname.endsWith(".html")) return "html";
  return null;
}

// --- Agregación en memoria ---------------------------------------------------
//
// El coste de KV no es el número de claves sino el de escrituras, y antes se
// hacía un get + un put por CADA hit. Una ráfaga de rastreo —1248 peticiones de
// GPTBot el 2026-08-12— se comía el cupo diario entero de la cuenta y, con él,
// las altas de newsletter, que escriben en el mismo KV.
//
// Los hits se acumulan ahora en memoria del isolate y se vuelcan por lotes. El
// ahorro solo aparece cuando las peticiones se concentran en el tiempo, que es
// justo el caso que agota la cuota: con tráfico disperso cada hit sigue
// costando una escritura, igual que antes, pero nunca más que antes.
//
// Contrapartida asumida: si el isolate muere con el buffer sin volcar, esos
// hits se pierden. El contador ya era aproximado por diseño (durante una ráfaga
// concurrente varias peticiones leen el mismo valor y el conteo se queda corto),
// así que esto degrada una precisión que nunca se ofreció, a cambio de no
// tumbar la newsletter.

const FLUSH_INTERVAL_MS = 60_000;
const FLUSH_MAX_PENDING = 50;

interface Pending {
  hits: number;
  paths: Record<string, number>;
  fmt: Record<string, number>;
}

const buffer = new Map<string, Pending>();
let pendingHits = 0;
let lastFlush = Date.now();
let inFlight: Promise<void> | null = null;

function bufferHit(agent: string, pathname: string): void {
  const now = new Date().toISOString();
  const key = `bot:${now.slice(0, 10)}:${now.slice(11, 13)}:${agent}`;

  let entry = buffer.get(key);
  if (!entry) {
    entry = { hits: 0, paths: {}, fmt: {} };
    buffer.set(key, entry);
  }

  entry.hits += 1;
  // Se guardan solo las rutas más vistas para que el valor no crezca sin control.
  if (Object.keys(entry.paths).length < 50) {
    entry.paths[pathname] = (entry.paths[pathname] || 0) + 1;
  }

  const fmt = formatOf(pathname);
  if (fmt) entry.fmt[fmt] = (entry.fmt[fmt] || 0) + 1;

  pendingHits += 1;
}

// Volcar en cuanto el buffer arrastre claves de una hora ya cerrada: si no, un
// tramo tranquilo al cambiar de hora dejaría esos hits colgados indefinidamente.
function hasStaleHour(currentKey: string): boolean {
  for (const key of buffer.keys()) {
    if (key.slice(0, 17) !== currentKey.slice(0, 17)) return true;
  }
  return false;
}

function shouldFlush(agent: string): boolean {
  if (pendingHits >= FLUSH_MAX_PENDING) return true;
  if (Date.now() - lastFlush >= FLUSH_INTERVAL_MS) return true;
  const now = new Date().toISOString();
  return hasStaleHour(`bot:${now.slice(0, 10)}:${now.slice(11, 13)}:${agent}`);
}

async function writeEntry(kv: KVNamespace, key: string, pend: Pending) {
  const raw = await kv.get(key);
  const entry = raw
    ? JSON.parse(raw)
    : { hits: 0, paths: {} as Record<string, number> };

  entry.hits += pend.hits;
  for (const [path, count] of Object.entries(pend.paths)) {
    if (entry.paths[path] === undefined && Object.keys(entry.paths).length >= 50) continue;
    entry.paths[path] = (entry.paths[path] || 0) + count;
  }

  // La clave ya lleva el bot, así que este contador queda desglosado por agente
  // sin trabajo extra. Las entradas anteriores a la instrumentación no tienen
  // `fmt`: el lector las trata como desconocidas en vez de imputarlas a HTML.
  if (Object.keys(pend.fmt).length > 0) {
    entry.fmt = entry.fmt || {};
    for (const [fmt, count] of Object.entries(pend.fmt)) {
      entry.fmt[fmt] = (entry.fmt[fmt] || 0) + count;
    }
  }

  await kv.put(key, JSON.stringify(entry), { expirationTtl: TTL_SECONDS });
}

async function flushBuffer(kv: KVNamespace): Promise<void> {
  // Un único vuelco en vuelo: dos flushes concurrentes sobre la misma clave se
  // pisarían el get, que es exactamente la pérdida que se intenta acotar.
  if (inFlight) return inFlight;

  const batch = [...buffer.entries()];
  buffer.clear();
  pendingHits = 0;
  lastFlush = Date.now();

  inFlight = (async () => {
    for (const [key, pend] of batch) {
      // Un fallo aislado no debe arrastrar al resto del lote.
      await writeEntry(kv, key, pend).catch(() => undefined);
    }
  })().finally(() => {
    inFlight = null;
  });

  return inFlight;
}

// 218 posts heredan de WordPress un slug que empieza por "¿" (%C2%BF). Esa forma
// es la canónica y responde 200, pero los rastreadores piden también la variante
// sin el signo y se llevan un 404: en los logs de Cloudflare se ve a Googlebot
// haciéndolo. Resolverlo con reglas en _redirects no sirve — Cloudflare Pages
// deja de aplicarlas pasadas ~100 y aquí harían falta 226 — así que se hace aquí,
// solo cuando la respuesta ya es 404 y por tanto no hay nada que perder.
// El signo puede ir al principio del slug o en medio ("oss07-¿a-quien-protege"),
// así que no basta con probar a anteponerlo: se usa el mapa que genera el build.
function canonicaDeVariante(pathname: string): string | null {
  const decoded = decodeURIComponent(pathname);
  const conBarra = decoded.endsWith('/') ? decoded : `${decoded}/`;
  return SLUG_MAP[conBarra] ?? SLUG_MAP[decoded] ?? null;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const response = await context.next();

  if (response.status === 404) {
    try {
      const url = new URL(context.request.url);
      const canonica = canonicaDeVariante(url.pathname);
      if (canonica) {
        return Response.redirect(`${url.origin}${canonica}`, 301);
      }
    } catch {
      // Si falla, se devuelve el 404 original.
    }
  }

  try {
    const kv = context.env.CS_KV;
    if (!kv) return response;

    // Solo se cuentan páginas que existen (200) y sus revalidaciones (304, que
    // es lo que responde un rastreador que ya tiene la página). Contar los 404
    // dejaba la cardinalidad de claves en manos de quien llamara: basta
    // declararse GPTBot y pedir rutas inventadas para crear una clave por ruta.
    // Acota las claves, no las escrituras: cada hit a una página real sigue
    // costando un get + un put (ver cabecera del fichero).
    if (response.status !== 200 && response.status !== 304) return response;

    const agent = identifyAgent(context.request.headers.get("User-Agent") || "");
    if (!agent) return response;

    // El parseo de la URL va detrás de las comprobaciones baratas: así solo se
    // paga para rastreadores identificados, no en cada petición del sitio.
    const url = new URL(context.request.url);
    if (!isPageRequest(url)) return response;

    bufferHit(agent, url.pathname);
    if (shouldFlush(agent)) {
      context.waitUntil(flushBuffer(kv).catch(() => undefined));
    }
  } catch {
    // El conteo nunca debe afectar a la respuesta.
  }

  return response;
};
