/**
 * GEO: lectura de los contadores de rastreadores de IA que agrega _middleware.ts.
 *
 * GET /api/bots?days=28  ->  { days, totals: {bot: hits}, daily: {fecha: {bot: hits}},
 *                             topPaths, formats: {bot: {md|llms|html|unknown: hits}} }
 *
 * `days` solo admite 7, 28 o 90; cualquier otro valor cae en 28. La ventana
 * aplicada viene en el campo `days` de la respuesta: úsala para etiquetar.
 *
 * Devuelve solo agregados de tráfico de bots: no hay datos personales ni de
 * visitantes. Es público a propósito, para que el informe semanal pueda leerlo
 * sin credenciales de Cloudflare. Lleva noindex para no acabar en buscadores.
 */

interface Env {
  CS_KV?: KVNamespace;
}

const ALLOWED_DAYS = [7, 28, 90];
const DEFAULT_DAYS = 28;

function isoDate(offsetDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "X-Robots-Tag": "noindex",
    "Cache-Control": "public, max-age=600",
  };

  const kv = context.env.CS_KV;
  if (!kv) {
    return new Response(
      JSON.stringify({ ok: false, error: "CS_KV no está enlazado a este proyecto" }),
      { status: 503, headers },
    );
  }

  // Ventanas discretas, no un rango continuo: con `days` libre entre 1 y 90,
  // cada valor generaba una entrada de caché distinta, así que bastaba variar
  // la query para saltarse el max-age y forzar un recorrido completo de KV.
  //
  // Acota el abanico de 90 variantes a 3; no cierra el vector. Un recorrido en
  // frío hace un kv.list por fecha (90 con days=90) contra un cupo de 1.000
  // list al día, y la caché es por centro de datos, así que pedir la misma
  // ventana desde varios POPs sigue provocando recorridos. Rediseñar el
  // agregado para no necesitar un list por fecha: Issue #35.
  const url = new URL(context.request.url);
  const requested = Number.parseInt(url.searchParams.get("days") || "", 10);
  const days = ALLOWED_DAYS.includes(requested) ? requested : DEFAULT_DAYS;

  const cache = caches.default;
  const cacheKey = new Request(`https://crearsoftware.com/api/bots?days=${days}`);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const wanted = new Set<string>();
  for (let i = 0; i < days; i += 1) wanted.add(isoDate(i));

  const totals: Record<string, number> = {};
  const daily: Record<string, Record<string, number>> = {};
  const paths: Record<string, number> = {};
  const formats: Record<string, Record<string, number>> = {};

  // Las claves son bot:<fecha>:<hora>:<bot>; se listan por prefijo de fecha.
  for (const date of wanted) {
    let cursor: string | undefined;
    do {
      const page = await kv.list({ prefix: `bot:${date}:`, cursor, limit: 1000 });
      cursor = page.list_complete ? undefined : page.cursor;

      for (const key of page.keys) {
        const agent = key.name.split(":").slice(3).join(":");
        if (!agent) continue;

        const raw = await kv.get(key.name);
        if (!raw) continue;

        let entry: {
          hits?: number;
          paths?: Record<string, number>;
          fmt?: Record<string, number>;
        };
        try {
          entry = JSON.parse(raw);
        } catch {
          continue;
        }

        const hits = entry.hits || 0;
        totals[agent] = (totals[agent] || 0) + hits;
        if (!daily[date]) daily[date] = {};
        daily[date][agent] = (daily[date][agent] || 0) + hits;

        for (const [p, n] of Object.entries(entry.paths || {})) {
          paths[p] = (paths[p] || 0) + n;
        }

        // Formato servido, por agente. Las entradas escritas antes de que el
        // middleware contara `fmt` no lo traen: esos hits se acumulan como
        // "unknown" en vez de contarse como HTML, para no inflar el
        // denominador del experimento de los gemelos Markdown.
        const fmtEntry = entry.fmt || {};
        const counted = Object.values(fmtEntry).reduce((s, n) => s + n, 0);
        if (!formats[agent]) formats[agent] = {};
        for (const [f, n] of Object.entries(fmtEntry)) {
          formats[agent][f] = (formats[agent][f] || 0) + n;
        }
        if (hits > counted) {
          formats[agent].unknown = (formats[agent].unknown || 0) + (hits - counted);
        }
      }
    } while (cursor);
  }

  const topPaths = Object.entries(paths)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([path, hits]) => ({ path, hits }));

  const response = new Response(
    JSON.stringify({
      ok: true,
      days,
      generatedAt: new Date().toISOString(),
      totalHits: Object.values(totals).reduce((s, n) => s + n, 0),
      totals,
      daily,
      topPaths,
      formats,
    }),
    { headers },
  );

  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
};
