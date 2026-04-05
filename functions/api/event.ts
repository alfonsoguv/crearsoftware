/**
 * Lightweight visitor analytics — event ingestion endpoint
 *
 * Receives behavioral events (pageview, scroll, cta_visible, cta_focus, click)
 * and aggregates them in KV by day. No cookies, no PII, GDPR-compliant.
 *
 * POST /api/event  { type, path, meta? }
 *
 * Storage format in KV:
 *   key: "evt:YYYY-MM-DD" → JSON aggregated counters
 */

interface Env {
  CS_KV?: KVNamespace;
}

interface EventPayload {
  type: string;
  path: string;
  meta?: string;
}

interface DayEvents {
  pageviews: Record<string, number>;
  scroll: Record<string, Record<string, number>>; // path → { "25": n, "50": n, ... }
  cta_visible: Record<string, number>;             // source → count
  cta_focus: Record<string, number>;               // source → count
  clicks: Record<string, number>;                  // target → count
  total: number;
}

const VALID_TYPES = ["pageview", "scroll", "cta_visible", "cta_focus", "click"];
const MAX_PATH_LEN = 200;
const MAX_META_LEN = 100;

function getCorsOrigin(request: Request) {
  const origin = request.headers.get("Origin") || "";
  if (!origin) return "https://crearsoftware.com";

  try {
    const { hostname } = new URL(origin);
    if (
      hostname === "crearsoftware.com" ||
      hostname === "www.crearsoftware.com" ||
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".pages.dev")
    ) {
      return origin;
    }
  } catch {
    return "https://crearsoftware.com";
  }

  return "https://crearsoftware.com";
}

function buildCorsHeaders(request: Request) {
  return {
    "Access-Control-Allow-Origin": getCorsOrigin(request),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

function emptyDay(): DayEvents {
  return { pageviews: {}, scroll: {}, cta_visible: {}, cta_focus: {}, clicks: {}, total: 0 };
}

function sanitize(s: string, max: number): string {
  return s.replace(/[^\w/\-.:% ]/g, "").slice(0, max);
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = buildCorsHeaders(context.request);

  try {
    const body = await context.request.json<EventPayload>();
    const type = body.type?.trim();
    const path = sanitize(body.path?.trim() || "/", MAX_PATH_LEN);
    const meta = body.meta ? sanitize(body.meta.trim(), MAX_META_LEN) : undefined;

    if (!type || !VALID_TYPES.includes(type)) {
      return new Response(JSON.stringify({ ok: false }), { status: 400, headers: corsHeaders });
    }

    // Analytics is non-critical. If KV isn't configured yet, accept the event without failing.
    if (!context.env.CS_KV) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        status: 202,
        headers: corsHeaders,
      });
    }

    // Date key for aggregation (UTC)
    const dateKey = new Date().toISOString().split("T")[0];
    const kvKey = `evt:${dateKey}`;

    // Read current day's data (or create new)
    const raw = await context.env.CS_KV.get(kvKey);
    const day: DayEvents = raw ? JSON.parse(raw) : emptyDay();

    // Aggregate by event type
    switch (type) {
      case "pageview":
        day.pageviews[path] = (day.pageviews[path] || 0) + 1;
        break;
      case "scroll":
        if (meta) {
          if (!day.scroll[path]) day.scroll[path] = {};
          day.scroll[path][meta] = (day.scroll[path][meta] || 0) + 1;
        }
        break;
      case "cta_visible": {
        const src = meta || path;
        day.cta_visible[src] = (day.cta_visible[src] || 0) + 1;
        break;
      }
      case "cta_focus": {
        const src = meta || path;
        day.cta_focus[src] = (day.cta_focus[src] || 0) + 1;
        break;
      }
      case "click": {
        const target = meta || path;
        day.clicks[target] = (day.clicks[target] || 0) + 1;
        break;
      }
    }

    day.total += 1;

    // Store with 90-day TTL
    await context.env.CS_KV.put(kvKey, JSON.stringify(day), {
      expirationTtl: 90 * 86400,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 500, headers: corsHeaders });
  }
};

export const onRequestOptions: PagesFunction = async (context) => {
  return new Response(null, {
    headers: buildCorsHeaders(context.request),
  });
};
