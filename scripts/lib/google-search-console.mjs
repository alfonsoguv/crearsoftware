import crypto from 'node:crypto';
import http from 'node:http';
import { ensureOk, fetchWithRetry } from './http-client.mjs';

export const GSC_API_BASE_URL = 'https://www.googleapis.com/webmasters/v3';
export const GOOGLE_OAUTH_AUTHORIZE_URL =
  'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const GSC_FULL_SCOPE = 'https://www.googleapis.com/auth/webmasters';
export const GSC_READONLY_SCOPE =
  'https://www.googleapis.com/auth/webmasters.readonly';
export const DEFAULT_GSC_SITE_URL = 'https://crearsoftware.com/';

let cachedAccessToken = null;

function envValue(env, key) {
  const value = env[key]?.trim();
  return value ? value : undefined;
}

export function normalizeGSCSiteUrl(siteUrl) {
  const trimmed = String(siteUrl ?? '').trim();
  if (!trimmed) return DEFAULT_GSC_SITE_URL;
  if (trimmed.startsWith('sc-domain:')) return trimmed;
  if (/^https?:\/\//.test(trimmed) && !trimmed.endsWith('/')) {
    return `${trimmed}/`;
  }
  return trimmed;
}

export function getGSCSiteUrl(env = process.env) {
  return normalizeGSCSiteUrl(
    envValue(env, 'GSC_SITE_URL') ?? DEFAULT_GSC_SITE_URL,
  );
}

export function deriveGSCDomainProperty(siteUrl) {
  const normalized = normalizeGSCSiteUrl(siteUrl);
  if (normalized.startsWith('sc-domain:')) return normalized;
  if (!/^https?:\/\//.test(normalized)) return null;

  const hostname = new URL(normalized).hostname.replace(/^www\./, '');
  return hostname ? `sc-domain:${hostname}` : null;
}

export function getGSCAuthMode(env = process.env) {
  const clientId = envValue(env, 'GSC_CLIENT_ID');
  const refreshToken = envValue(env, 'GSC_REFRESH_TOKEN');
  if (clientId && refreshToken) return 'refresh-token';

  const accessToken = envValue(env, 'GSC_ACCESS_TOKEN');
  if (accessToken) return 'access-token';

  return 'none';
}

export function hasGSCAuthConfigured(env = process.env) {
  return getGSCAuthMode(env) !== 'none';
}

export function describeGSCAuthMode(env = process.env) {
  switch (getGSCAuthMode(env)) {
    case 'refresh-token':
      return 'OAuth refresh token';
    case 'access-token':
      return 'manual access token';
    default:
      return 'not configured';
  }
}

export function resetGSCAccessTokenCache() {
  cachedAccessToken = null;
}

async function refreshGSCAccessToken(env = process.env) {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token;
  }

  const clientId = envValue(env, 'GSC_CLIENT_ID');
  const clientSecret = envValue(env, 'GSC_CLIENT_SECRET');
  const refreshToken = envValue(env, 'GSC_REFRESH_TOKEN');

  if (!clientId || !refreshToken) {
    throw new Error(
      'Missing GSC_CLIENT_ID or GSC_REFRESH_TOKEN for Google OAuth refresh',
    );
  }

  const body = new URLSearchParams({
    client_id: clientId,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  if (clientSecret) {
    body.set('client_secret', clientSecret);
  }

  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  await ensureOk(response, 'Google OAuth token refresh failed');

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Google OAuth token refresh returned no access token');
  }

  const expiresInMs = Math.max((data.expires_in ?? 3600) - 60, 60) * 1000;
  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + expiresInMs,
  };

  return data.access_token;
}

export async function getGSCAccessToken(env = process.env) {
  const mode = getGSCAuthMode(env);

  if (mode === 'refresh-token') {
    return refreshGSCAccessToken(env);
  }

  if (mode === 'access-token') {
    return envValue(env, 'GSC_ACCESS_TOKEN') ?? null;
  }

  return null;
}

export async function requireGSCAccessToken(env = process.env) {
  const token = await getGSCAccessToken(env);
  if (!token) {
    throw new Error(
      'Google Search Console credentials not configured. Use GSC_ACCESS_TOKEN or GSC_CLIENT_ID + GSC_REFRESH_TOKEN.',
    );
  }
  return token;
}

export async function querySearchConsole(params) {
  const accessToken = params.accessToken ?? (await requireGSCAccessToken());
  const siteUrl = normalizeGSCSiteUrl(params.siteUrl);

  const response = await fetchWithRetry(
    `${GSC_API_BASE_URL}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: params.startDate,
        endDate: params.endDate,
        dimensions: params.dimensions,
        rowLimit: params.rowLimit ?? 25,
        startRow: params.startRow ?? 0,
      }),
    },
    { context: 'GSC searchAnalytics.query' },
  );

  await ensureOk(response, 'GSC API error');

  const data = await response.json();
  return data.rows ?? [];
}

export async function listSearchConsoleSites(accessToken) {
  const resolvedAccessToken = accessToken ?? (await requireGSCAccessToken());
  const response = await fetchWithRetry(`${GSC_API_BASE_URL}/sites`, {
    headers: {
      Authorization: `Bearer ${resolvedAccessToken}`,
    },
  });

  await ensureOk(response, 'GSC sites.list failed');
  const data = await response.json();
  return data.siteEntry ?? [];
}

export async function resolveGSCSiteUrl(params = {}) {
  const requestedSiteUrl = normalizeGSCSiteUrl(
    params.siteUrl ?? getGSCSiteUrl(),
  );
  const accessToken = params.accessToken ?? (await requireGSCAccessToken());
  const sites = params.sites ?? (await listSearchConsoleSites(accessToken));
  const availableSiteUrls = new Set(sites.map((entry) => entry.siteUrl));

  if (availableSiteUrls.has(requestedSiteUrl)) {
    return {
      requestedSiteUrl,
      resolvedSiteUrl: requestedSiteUrl,
      usedFallback: false,
      sites,
    };
  }

  const domainProperty = deriveGSCDomainProperty(requestedSiteUrl);
  if (domainProperty && availableSiteUrls.has(domainProperty)) {
    return {
      requestedSiteUrl,
      resolvedSiteUrl: domainProperty,
      usedFallback: true,
      sites,
    };
  }

  return {
    requestedSiteUrl,
    resolvedSiteUrl: requestedSiteUrl,
    usedFallback: false,
    sites,
  };
}

export async function listSearchConsoleSitemaps(params) {
  const accessToken = params.accessToken ?? (await requireGSCAccessToken());
  const siteUrl = normalizeGSCSiteUrl(params.siteUrl);
  const response = await fetchWithRetry(
    `${GSC_API_BASE_URL}/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    { context: 'GSC sitemaps.list' },
  );

  await ensureOk(response, 'GSC sitemaps API error');
  const data = await response.json();
  return data.sitemap ?? [];
}

export async function submitSearchConsoleSitemap(params) {
  const accessToken = params.accessToken ?? (await requireGSCAccessToken());
  const siteUrl = normalizeGSCSiteUrl(params.siteUrl);
  const sitemapUrl = String(params.sitemapUrl ?? '').trim();

  if (!sitemapUrl) {
    throw new Error('Missing sitemapUrl for Search Console submission');
  }

  const response = await fetchWithRetry(
    `${GSC_API_BASE_URL}/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    { context: 'GSC sitemaps.submit' },
  );

  await ensureOk(response, 'GSC sitemap submit failed');
}

function randomBase64Url(bytes) {
  return crypto.randomBytes(bytes).toString('base64url');
}

function sha256Base64Url(value) {
  return crypto.createHash('sha256').update(value).digest('base64url');
}

async function listenForOAuthCode(server) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      server.close(() => undefined);
      reject(new Error('Timed out waiting for Google OAuth callback'));
    }, 5 * 60 * 1000);

    server.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    server.on('request', (req, res) => {
      const origin = `http://${req.headers.host ?? 'localhost'}`;
      const url = new URL(req.url ?? '/', origin);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(
          `<h1>Google Search Console connection failed</h1><p>${error}</p>`,
        );
        clearTimeout(timeout);
        server.close(() => undefined);
        reject(new Error(`Google OAuth error: ${error}`));
        return;
      }

      if (!code || !state) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Missing OAuth parameters</h1>');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        '<h1>Google Search Console connected</h1><p>You can return to the terminal.</p>',
      );

      clearTimeout(timeout);
      server.close(() => undefined);
      resolve({ code, state });
    });
  });
}

export async function runGSCDesktopOAuthFlow(params) {
  const codeVerifier = randomBase64Url(48);
  const codeChallenge = sha256Base64Url(codeVerifier);
  const state = randomBase64Url(24);
  const server = http.createServer();

  await new Promise((resolve, reject) => {
    server.listen(0, 'localhost', () => resolve());
    server.once('error', reject);
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    server.close(() => undefined);
    throw new Error('Could not allocate a loopback port for Google OAuth');
  }

  const redirectUri = `http://localhost:${address.port}`;
  const authorizationUrl = new URL(GOOGLE_OAUTH_AUTHORIZE_URL);
  authorizationUrl.searchParams.set('client_id', params.clientId);
  authorizationUrl.searchParams.set('redirect_uri', redirectUri);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set(
    'scope',
    params.scope ?? GSC_READONLY_SCOPE,
  );
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('code_challenge', codeChallenge);
  authorizationUrl.searchParams.set('code_challenge_method', 'S256');
  authorizationUrl.searchParams.set('access_type', 'offline');
  authorizationUrl.searchParams.set('prompt', 'consent');

  console.log('');
  console.log('Open this URL in your browser to authorize Google Search Console:');
  console.log(authorizationUrl.toString());
  console.log('');
  console.log('Waiting for Google OAuth callback on', redirectUri);

  const callback = await listenForOAuthCode(server);
  if (callback.state !== state) {
    throw new Error('Google OAuth state mismatch');
  }

  const body = new URLSearchParams({
    client_id: params.clientId,
    code: callback.code,
    code_verifier: codeVerifier,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  if (params.clientSecret?.trim()) {
    body.set('client_secret', params.clientSecret.trim());
  }

  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  await ensureOk(response, 'Google OAuth code exchange failed');
  const data = await response.json();

  if (!data.access_token || !data.refresh_token) {
    throw new Error(
      'Google OAuth code exchange did not return both access_token and refresh_token',
    );
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    scope: data.scope ?? params.scope ?? GSC_READONLY_SCOPE,
    redirectUri,
  };
}
