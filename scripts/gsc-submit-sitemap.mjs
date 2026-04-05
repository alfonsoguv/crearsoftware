import { loadLocalEnv } from './lib/load-local-env.mjs';
import {
  getGSCSiteUrl,
  listSearchConsoleSitemaps,
  requireGSCAccessToken,
  resolveGSCSiteUrl,
  submitSearchConsoleSitemap,
} from './lib/google-search-console.mjs';

loadLocalEnv();

function publicSiteOrigin(siteUrl) {
  if (siteUrl.startsWith('http://') || siteUrl.startsWith('https://')) {
    return new URL(siteUrl).origin;
  }

  if (siteUrl.startsWith('sc-domain:')) {
    return `https://${siteUrl.slice('sc-domain:'.length)}`;
  }

  return 'https://crearsoftware.com';
}

async function main() {
  const configuredSiteUrl = getGSCSiteUrl();
  const accessToken = await requireGSCAccessToken();
  const siteResolution = await resolveGSCSiteUrl({
    siteUrl: configuredSiteUrl,
    accessToken,
  });
  const resolvedSiteUrl = siteResolution.resolvedSiteUrl;
  const sitemapUrl =
    process.env.GSC_SITEMAP_URL?.trim() ||
    `${publicSiteOrigin(configuredSiteUrl)}/sitemap.xml`;

  console.log(`Submitting sitemap to Search Console`);
  console.log(`Property: ${resolvedSiteUrl}`);
  console.log(`Sitemap: ${sitemapUrl}`);

  await submitSearchConsoleSitemap({
    siteUrl: resolvedSiteUrl,
    sitemapUrl,
    accessToken,
  });

  const sitemaps = await listSearchConsoleSitemaps({
    siteUrl: resolvedSiteUrl,
    accessToken,
  });

  console.log('');
  console.log(`Sitemaps now visible in Search Console: ${sitemaps.length}`);
  for (const sitemap of sitemaps) {
    console.log(`- ${sitemap.path ?? '(sin path)'}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
