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
 * A cambio, el volumen de escrituras en KV queda acotado a ~24 por bot y día,
 * dentro de los límites del plan gratuito. Sirve para detectar tendencia, no
 * para auditar peticiones una a una.
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
  const { pathname } = url;
  if (pathname.endsWith("/") || pathname.endsWith(".html")) return true;
  if (pathname === "/llms.txt" || pathname === "/llms-full.txt") return true;
  // Gemelos Markdown: saber si los agentes los piden es justo el dato que
  // justifica mantenerlos.
  if (pathname.endsWith(".md")) return true;
  return false;
}

async function recordHit(kv: KVNamespace, agent: string, pathname: string) {
  const now = new Date();
  const dateKey = now.toISOString().slice(0, 10);
  const hour = now.toISOString().slice(11, 13);
  const key = `bot:${dateKey}:${hour}:${agent}`;

  const raw = await kv.get(key);
  const entry = raw ? JSON.parse(raw) : { hits: 0, paths: {} as Record<string, number> };

  entry.hits += 1;
  // Se guardan solo las rutas más vistas para que el valor no crezca sin control.
  if (Object.keys(entry.paths).length < 50) {
    entry.paths[pathname] = (entry.paths[pathname] || 0) + 1;
  }

  await kv.put(key, JSON.stringify(entry), { expirationTtl: TTL_SECONDS });
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

    const url = new URL(context.request.url);
    if (!isPageRequest(url)) return response;

    const agent = identifyAgent(context.request.headers.get("User-Agent") || "");
    if (!agent) return response;

    context.waitUntil(recordHit(kv, agent, url.pathname).catch(() => undefined));
  } catch {
    // El conteo nunca debe afectar a la respuesta.
  }

  return response;
};
