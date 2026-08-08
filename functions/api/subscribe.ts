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
      // Solo los despliegues de ESTE proyecto. `.pages.dev` a secas autorizaba
      // cualquier proyecto Pages de un tercero a hacer POST de emails cross-origin.
      hostname === "crearsoftware.pages.dev" ||
      /^[a-z0-9-]{1,63}\.crearsoftware\.pages\.dev$/.test(hostname)
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

// Clave derivada de la IP, no la IP en claro. Es pseudonimización, no anonimato:
// el espacio IPv4 es enumerable y la sal está aquí a la vista, así que sigue
// siendo dato personal. Su valor es que la IP no queda legible en la caché, y el
// TTL de una hora la borra sola.
async function ipHash(ip: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`cs-rl:${ip}`));
  return [...new Uint8Array(buf)]
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function jsonResponse(request: Request, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: buildCorsHeaders(request),
  });
}

function redirectBack(request: Request, result: "success" | "error", message = "") {
  const target = new URL("https://crearsoftware.com/");
  const referer = request.headers.get("Referer");

  // Se toma solo la RUTA del Referer y se reancla siempre en el dominio propio:
  // usar la URL del Referer entera convertía este 303 en un open redirect
  // (Referer: https://evil.tld → redirección a evil.tld).
  try {
    if (referer) {
      const { pathname, search } = new URL(referer);
      target.pathname = pathname;
      target.search = search;
    }
  } catch {
    // Referer inválido: se mantiene la home.
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
  try {
    // El cuerpo se parsea aparte: un JSON malformado es un error del cliente
    // (400), no una degradación del servicio, y no debe caer en el catch final.
    let body: SubscribePayload;
    try {
      body = await parsePayload(context.request);
    } catch {
      if (wantsHtmlResponse(context.request)) {
        return redirectBack(context.request, "error", "payload");
      }
      return jsonResponse(context.request, { success: false, error: "Invalid payload" }, 400);
    }

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

    // Rate limit: 1 alta por IP y hora, sobre la Cache API en lugar de KV. Cada
    // alta gastaba una escritura del cupo diario de la cuenta solo para marcar
    // la IP; ese cupo es justo lo que hay que proteger, porque si se agota falla
    // el put del email. La Cache API no consume cuota.
    //
    // A cambio es por centro de datos, no global: quien rote de POP —o de IP—
    // evade el límite. Nunca fue una defensa antiabuso seria; el bloqueo duro
    // va en el WAF (Issue #36). El host de la clave es sintético a propósito:
    // con una URL real de la zona, la entrada sería alcanzable desde fuera y
    // delataría qué IPs se han dado de alta en la última hora.
    const ip = context.request.headers.get("CF-Connecting-IP") || "unknown";
    const cache = caches.default;
    const rateKey = new Request(`https://ratelimit.invalid/subscribe/${await ipHash(ip)}`);
    const lastSignup = await cache.match(rateKey);
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

    // La marca de rate limit se pone ANTES de escribir en KV, no después: si se
    // pusiera al final, una ráfaga simultánea desde la misma IP pasaría entera
    // el cache.match y gastaría una escritura por petición, que es justo el
    // recurso a proteger. El precio es que, si el put falla, esa IP espera una
    // hora para reintentar.
    await cache.put(rateKey, new Response("1", { headers: { "Cache-Control": "max-age=3600" } }));

    // Única escritura en KV de todo el flujo. Antes eran tres (email, rate y
    // meta:count); las otras dos gastaban cupo sin aportar nada que se leyera.
    // Va en su propio try/catch: si KV falla —cupo diario agotado o 5xx
    // transitorio— el alta se responde como servicio degradado, nunca como
    // error del servidor, y queda registrada en los logs para recuperarla.
    try {
      await context.env.CS_KV.put(`email:${email}`, data);
    } catch (kvError) {
      console.error("subscribe: fallo al persistir el alta", { email, source, kvError });
      if (wantsHtmlResponse(context.request)) {
        return redirectBack(context.request, "error", "service-unavailable");
      }
      return jsonResponse(context.request, {
        success: false,
        error: "No hemos podido guardar tu alta ahora mismo. Inténtalo de nuevo en unos minutos.",
      }, 503);
    }

    if (wantsHtmlResponse(context.request)) {
      return redirectBack(context.request, "success");
    }

    return jsonResponse(context.request, { success: true });
  } catch (error) {
    console.error("subscribe error", error);

    if (wantsHtmlResponse(context.request)) {
      return redirectBack(context.request, "error", "server");
    }

    // 503, no 500: el fallo de persistencia ya se captura arriba, así que llegar
    // aquí significa servicio degradado y el cliente puede reintentar.
    return jsonResponse(context.request, {
      success: false,
      error: "Servicio no disponible temporalmente",
    }, 503);
  }
};

export const onRequestOptions: PagesFunction = async (context) => {
  return new Response(null, {
    headers: buildCorsHeaders(context.request),
  });
};
