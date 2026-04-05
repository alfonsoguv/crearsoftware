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
console.log('');
console.log('Store the following values in your local .dev.vars file:');
console.log(`GSC_CLIENT_ID=${clientId}`);
if (clientSecret) {
  console.log('GSC_CLIENT_SECRET=<existing value>');
}
console.log(`GSC_REFRESH_TOKEN=${result.refreshToken}`);
