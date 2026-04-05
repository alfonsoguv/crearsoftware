import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { parseStringPromise } from 'xml2js';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');

const scans = [
  {
    label: 'Legacy domain links',
    targets: ['blog-posts', 'dist'],
    regex: /https?:\/\/(?:www\.)?alfonsogu\.com/gi,
  },
  {
    label: 'YouTube shortcode',
    targets: ['blog-posts', 'dist'],
    regex: /\\?\[youtube=[^\]]+\]/gi,
  },
  {
    label: 'WordPress video shortcode',
    targets: ['blog-posts', 'dist'],
    regex: /\\?\[wpvideo [^\]]+\]/gi,
  },
  {
    label: 'Broken image markdown',
    targets: ['blog-posts', 'dist'],
    regex: /\[\![^\]]*\]\([^)]+\)/g,
  },
  {
    label: 'Unresolved placeholders',
    targets: ['dist'],
    regex: /\{\{[^}]+\}\}/g,
  },
];

const textExtensions = new Set(['.md', '.html', '.xml', '.txt']);
const findings = [];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
      continue;
    }
    if (textExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function firstLine(content, index) {
  const start = content.lastIndexOf('\n', index) + 1;
  const end = content.indexOf('\n', index);
  return content.slice(start, end === -1 ? content.length : end).trim();
}

async function scanPattern(label, regex, files) {
  const hits = [];
  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const matches = [...content.matchAll(regex)];
    if (!matches.length) continue;

    hits.push({
      file: path.relative(ROOT, file),
      count: matches.length,
      sample: firstLine(content, matches[0].index || 0),
    });
  }

  if (hits.length) findings.push({ label, hits });
}

function collectAssetReferences(content) {
  const regex = /(?:https?:\/\/[^"'()\s]+)?\/?(wp-content\/uploads\/[^\s"'()<>]+|files\/[^\s"'()<>]+)/gi;
  const refs = [];
  for (const match of content.matchAll(regex)) {
    const assetPath = match[1]
      .replace(/[?#].*$/, '')
      .replace(/&amp;/g, '&');
    refs.push(assetPath);
  }
  return refs;
}

async function auditMirroredAssets() {
  const contentFiles = await walk(path.join(ROOT, 'blog-posts'));
  const refs = new Set();
  for (const file of contentFiles) {
    const content = await readFile(file, 'utf8');
    for (const ref of collectAssetReferences(content)) refs.add(ref);
  }

  const missing = [];
  for (const ref of refs) {
    if (!await exists(path.join(ROOT, ref))) {
      missing.push(ref);
    }
  }

  return { total: refs.size, missing };
}

async function auditNoindexVsSitemap() {
  const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
  if (!await exists(sitemapPath)) {
    return { ok: false, reason: 'dist/sitemap.xml no existe', mismatches: [] };
  }

  const sitemapXml = await readFile(sitemapPath, 'utf8');
  const parsed = await parseStringPromise(sitemapXml);
  const locs = new Set((parsed.urlset?.url || []).map((entry) => entry.loc?.[0]).filter(Boolean));

  const htmlFiles = await walk(DIST_DIR);
  const noindexPages = [];
  for (const file of htmlFiles.filter((candidate) => candidate.endsWith('.html'))) {
    const html = await readFile(file, 'utf8');
    if (!/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) continue;

    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || null;
    noindexPages.push({
      file: path.relative(ROOT, file),
      canonical,
    });
  }

  const mismatches = noindexPages.filter((page) => page.canonical && locs.has(page.canonical));
  return { ok: mismatches.length === 0, total: noindexPages.length, mismatches };
}

async function main() {
  const root404 = await exists(path.join(ROOT, '404.html'));
  const dist404 = await exists(path.join(DIST_DIR, '404.html'));

  for (const scan of scans) {
    const files = [];
    for (const target of scan.targets) {
      const dir = path.join(ROOT, target);
      if (await exists(dir)) files.push(...await walk(dir));
    }
    await scanPattern(scan.label, scan.regex, files);
  }

  const mirroredAssets = await auditMirroredAssets();
  const noindexAudit = await auditNoindexVsSitemap();

  console.log('=== AUDIT SUMMARY ===');
  console.log(`404.html en raiz: ${root404 ? 'OK' : 'MISSING'}`);
  console.log(`404.html en dist: ${dist404 ? 'OK' : 'MISSING'}`);
  console.log(`Assets heredados referenciados: ${mirroredAssets.total}`);
  console.log(`Assets heredados faltantes: ${mirroredAssets.missing.length}`);
  console.log(`Paginas noindex detectadas en dist: ${noindexAudit.total ?? 0}`);
  console.log(`Noindex presentes en sitemap: ${noindexAudit.mismatches?.length ?? 0}`);

  if (findings.length) {
    console.log('\n=== FINDINGS ===');
    for (const finding of findings) {
      const total = finding.hits.reduce((sum, hit) => sum + hit.count, 0);
      console.log(`- ${finding.label}: ${total} coincidencias en ${finding.hits.length} archivos`);
      for (const hit of finding.hits.slice(0, 10)) {
        console.log(`  ${hit.file} (${hit.count}) -> ${hit.sample}`);
      }
      if (finding.hits.length > 10) {
        console.log(`  ... y ${finding.hits.length - 10} archivos mas`);
      }
    }
  }

  if (mirroredAssets.missing.length) {
    console.log('\n=== MISSING ASSETS ===');
    for (const missing of mirroredAssets.missing.slice(0, 20)) {
      console.log(`- ${missing}`);
    }
    if (mirroredAssets.missing.length > 20) {
      console.log(`- ... y ${mirroredAssets.missing.length - 20} mas`);
    }
  }

  if (!noindexAudit.ok) {
    console.log('\n=== NOINDEX MISMATCHES ===');
    for (const page of noindexAudit.mismatches.slice(0, 20)) {
      console.log(`- ${page.file} -> ${page.canonical}`);
    }
  }

  const failed =
    !root404 ||
    !dist404 ||
    findings.length > 0 ||
    mirroredAssets.missing.length > 0 ||
    !noindexAudit.ok;

  if (failed) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
