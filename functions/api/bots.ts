/**
 * GEO: lectura de los contadores de rastreadores de IA que agrega _middleware.ts.
 *
 * GET /api/bots?days=28  ->  { days, totals: {bot: hits}, daily: {fecha: {bot: hits}}, topPaths }
 *
 * Devuelve solo agregados de tráfico de bots: no hay datos personales ni de
 * visitantes. Es público a propósito, para que el informe semanal pueda leerlo
 * sin credenciales de Cloudflare. Lleva noindex para no acabar en buscadores.
 */

interface Env {
  CS_KV?: KVNamespace;
}

const MAX_DAYS = 90;
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

  const url = new URL(context.request.url);
  const requested = Number.parseInt(url.searchParams.get("days") || "", 10);
  const days = Number.isFinite(requested)
    ? Math.min(Math.max(requested, 1), MAX_DAYS)
    : DEFAULT_DAYS;

  const wanted = new Set<string>();
  for (let i = 0; i < days; i += 1) wanted.add(isoDate(i));

  const totals: Record<string, number> = {};
  const daily: Record<string, Record<string, number>> = {};
  const paths: Record<string, number> = {};

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

        let entry: { hits?: number; paths?: Record<string, number> };
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
      }
    } while (cursor);
  }

  const topPaths = Object.entries(paths)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([path, hits]) => ({ path, hits }));

  return new Response(
    JSON.stringify({
      ok: true,
      days,
      generatedAt: new Date().toISOString(),
      totalHits: Object.values(totals).reduce((s, n) => s + n, 0),
      totals,
      daily,
      topPaths,
    }),
    { headers },
  );
};
