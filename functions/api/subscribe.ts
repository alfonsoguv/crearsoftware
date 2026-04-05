interface Env {
  CS_KV?: KVNamespace;
}

interface SubscribePayload {
  email?: string;
  source?: string;
  utm?: Record<string, string>;
}

const VALID_SOURCES = [
  "homepage-hero", "homepage-final",
  "blog-inline", "blog-post", "blog-index",
  "direct",
];

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

function wantsHtmlResponse(request: Request) {
  return (request.headers.get("Accept") || "").includes("text/html");
}

function jsonResponse(request: Request, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: buildCorsHeaders(request),
  });
}

function redirectBack(request: Request, result: "success" | "error", message = "") {
  const fallbackUrl = new URL("https://crearsoftware.com/");
  const referer = request.headers.get("Referer");

  let target = fallbackUrl;
  try {
    if (referer) {
      target = new URL(referer);
    }
  } catch {
    target = fallbackUrl;
  }

  target.searchParams.set("subscribe", result);
  if (message) {
    target.searchParams.set("subscribe_message", message);
  }

  return Response.redirect(target.toString(), 303);
}

async function parsePayload(request: Request): Promise<SubscribePayload> {
  const contentType = request.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    return await request.json<SubscribePayload>();
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();
    const utm: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
      const raw = formData.get(key);
      if (typeof raw === "string" && raw.trim()) {
        utm[key] = raw.trim();
      }
    }

    return {
      email: typeof formData.get("email") === "string" ? String(formData.get("email")) : "",
      source: typeof formData.get("source") === "string" ? String(formData.get("source")) : "",
      utm,
    };
  }

  return {};
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = buildCorsHeaders(context.request);

  try {
    const body = await parsePayload(context.request);
    const email = body.email?.trim().toLowerCase();
    const rawSource = body.source?.trim() || "direct";

    // Validate source: alphanumeric + hyphens, max 50 chars
    const source = VALID_SOURCES.includes(rawSource)
      ? rawSource
      : /^[a-z0-9-]{1,50}$/i.test(rawSource)
        ? rawSource
        : "direct";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (wantsHtmlResponse(context.request)) {
        return redirectBack(context.request, "error", "email");
      }
      return jsonResponse(context.request, { success: false, error: "Invalid email" }, 400);
    }

    if (!context.env.CS_KV) {
      if (wantsHtmlResponse(context.request)) {
        return redirectBack(context.request, "error", "service-unavailable");
      }
      return jsonResponse(context.request, {
        success: false,
        error: "Subscription service is not configured yet",
      }, 503);
    }

    // Rate limit: 1 signup per IP per hour
    const ip = context.request.headers.get("CF-Connecting-IP") || "unknown";
    const rateKey = `rate:${ip}`;
    const lastSignup = await context.env.CS_KV.get(rateKey);
    if (lastSignup) {
      if (wantsHtmlResponse(context.request)) {
        return redirectBack(context.request, "error", "rate-limit");
      }
      return jsonResponse(context.request, { success: false, error: "Please wait before trying again" }, 429);
    }

    // Parse UTM parameters: prefer body (client-side URL params), fallback to Referer
    const referer = context.request.headers.get("Referer") || "";
    let utm: Record<string, string> = {};

    // First: extract from Referer header
    try {
      if (referer) {
        const refUrl = new URL(referer);
        for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
          const val = refUrl.searchParams.get(key);
          if (val) utm[key] = val;
        }
      }
    } catch {
      // invalid referer URL, ignore
    }

    // Second: merge body UTM params (client-side takes precedence)
    if (body.utm && typeof body.utm === "object") {
      for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
        const val = body.utm[key];
        if (val && typeof val === "string" && val.length <= 100) {
          utm[key] = val.replace(/[^a-zA-Z0-9_-]/g, "");
        }
      }
    }

    // Derive country from Cloudflare headers (non-PII) for geographic insights
    const country = context.request.headers.get("CF-IPCountry") || "unknown";

    // Store email with timestamp, CTA source, and UTM data
    // NOTE: Do NOT store raw IP — it is PII under GDPR.
    // IP is used only for rate limiting (with TTL, see below).
    const data = JSON.stringify({
      email,
      timestamp: new Date().toISOString(),
      source,
      referer: referer || "direct",
      country,
      ...(Object.keys(utm).length > 0 ? { utm } : {}),
    });

    await context.env.CS_KV.put(`email:${email}`, data);
    await context.env.CS_KV.put(rateKey, "1", { expirationTtl: 3600 });

    // Increment subscriber counter (best-effort, race-safe for a vanity counter)
    const prev = parseInt(await context.env.CS_KV.get("meta:count") || "0", 10);
    await context.env.CS_KV.put("meta:count", String(prev + 1));

    if (wantsHtmlResponse(context.request)) {
      return redirectBack(context.request, "success");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("subscribe error", error);

    if (wantsHtmlResponse(context.request)) {
      return redirectBack(context.request, "error", "server");
    }

    return jsonResponse(context.request, { success: false, error: "Server error" }, 500);
  }
};

export const onRequestOptions: PagesFunction = async (context) => {
  return new Response(null, {
    headers: buildCorsHeaders(context.request),
  });
};
