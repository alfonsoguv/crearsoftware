import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { loadLocalEnv } from './lib/load-local-env.mjs';
import {
  GSC_FULL_SCOPE,
  GSC_READONLY_SCOPE,
  getGSCSiteUrl,
  runGSCDesktopOAuthFlow,
} from './lib/google-search-console.mjs';

loadLocalEnv();

const clientId = process.env.GSC_CLIENT_ID?.trim();
const clientSecret = process.env.GSC_CLIENT_SECRET?.trim();
const requestedScope =
  process.env.GSC_OAUTH_SCOPE?.trim() ||
  GSC_FULL_SCOPE ||
  GSC_READONLY_SCOPE;

if (!clientId) {
  throw new Error(
    'Missing GSC_CLIENT_ID. Add it to .dev.vars, .env.local or the shell before running this script.',
  );
}

const result = await runGSCDesktopOAuthFlow({
  clientId,
  clientSecret,
  scope: requestedScope,
});

console.log('');
console.log('Google Search Console connection established for:');
console.log(`- site: ${getGSCSiteUrl()}`);
console.log(`- redirect_uri: ${result.redirectUri}`);
console.log(`- scope: ${result.scope}`);
// Persistir el refresh token en .dev.vars. Antes solo se imprimía y el paso
// manual de copiar/pegar se perdía con facilidad, dejando el token caducado
// en el fichero y toda la medición SEO bloqueada.
const envPath = path.join(process.cwd(), '.dev.vars');

function upsertEnvVar(contents, key, value) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^\\s*${key}\\s*=.*$`, 'm');
  if (pattern.test(contents)) return contents.replace(pattern, line);
  return `${contents.replace(/\s*$/, '')}\n${line}\n`;
}

if (!result.refreshToken) {
  console.warn('');
  console.warn('Google no devolvió refresh_token. Repite el flujo asegurando');
  console.warn('access_type=offline y prompt=consent, o revoca el acceso previo en');
  console.warn('https://myaccount.google.com/permissions y vuelve a autorizar.');
} else if (existsSync(envPath)) {
  const original = readFileSync(envPath, 'utf8');
  const updated = upsertEnvVar(original, 'GSC_REFRESH_TOKEN', result.refreshToken);

  if (updated === original) {
    console.log('');
    console.log('El refresh token ya estaba actualizado en .dev.vars.');
  } else {
    writeFileSync(`${envPath}.bak`, original, { mode: 0o600 });
    writeFileSync(envPath, updated, { mode: 0o600 });
    console.log('');
    console.log('GSC_REFRESH_TOKEN guardado en .dev.vars (copia previa en .dev.vars.bak).');
  }

  console.log('Comprueba la conexión con: npm run seo:gsc');
} else {
  console.log('');
  console.log('No existe .dev.vars. Créalo con estos valores:');
  console.log(`GSC_CLIENT_ID=${clientId}`);
  if (clientSecret) console.log('GSC_CLIENT_SECRET=<tu valor>');
  console.log(`GSC_REFRESH_TOKEN=${result.refreshToken}`);
}
