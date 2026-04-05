export class HttpError extends Error {
  constructor(statusCode, responseBody, context) {
    const prefix = context ? `${context}: ` : '';
    super(`${prefix}HTTP ${statusCode}: ${responseBody}`);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function ensureOk(response, context) {
  if (!response.ok) {
    const body = await response.text().catch(() => 'unknown');
    throw new HttpError(response.status, body, context);
  }
}

export async function fetchWithRetry(url, init, options = {}) {
  const retries = options.retries ?? 2;
  const backoffMs = options.backoffMs ?? 1_000;
  const context = options.context ?? 'fetchWithRetry';

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const response = await fetch(url, init);

    if (response.status === 429 && attempt < retries) {
      const waitMs = parseRetryAfter(
        response,
        backoffMs * Math.pow(2, attempt),
      );
      console.warn(
        `[${context}] 429 rate-limited; waiting ${Math.round(waitMs / 1000)}s`,
      );
      await sleep(waitMs);
      continue;
    }

    return response;
  }

  throw new Error(`${context}: exhausted ${retries} retries`);
}

function parseRetryAfter(response, defaultMs) {
  const header =
    response.headers.get('retry-after') ??
    response.headers.get('x-ratelimit-reset');

  if (!header) return defaultMs;

  const seconds = Number.parseInt(header, 10);
  if (!Number.isNaN(seconds) && String(seconds) === header.trim()) {
    return Math.max(seconds * 1000, 1000);
  }

  const resetDate = new Date(header);
  if (!Number.isNaN(resetDate.getTime())) {
    return Math.max(resetDate.getTime() - Date.now(), 1000);
  }

  return defaultMs;
}
