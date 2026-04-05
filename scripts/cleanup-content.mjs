#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.cwd();
const CONTENT_DIRS = ['blog-posts', 'guides'];
const STATIC_DIRS = ['wp-content', 'files', 'images'];
const AUTHORS_DIR = join(ROOT, 'authors');
const DRY_RUN = process.argv.includes('--dry-run');

const SITE_DOMAIN_RE = /^(?:https?:)?\/\/(?:www\.)?(?:crearsoftware\.com|alfonsogu\.com)\b/i;
const BLOG_STYLE_RE = /(^|[^!])\[([^\]]+)\]\((\/blog\/[^)\s]+(?:\/)?(?:\s+["'][^"']*["'])?)\)/g;

const MOJIBAKE_REPLACEMENTS = [
  ['\u00c2\u00a0', ' '],
  ['\u00c3\u00a1', '\u00e1'],
  ['\u00c3\u00a9', '\u00e9'],
  ['\u00c3\u00ad', '\u00ed'],
  ['\u00c3\u00b3', '\u00f3'],
  ['\u00c3\u00ba', '\u00fa'],
  ['\u00c3\u0081', '\u00c1'],
  ['\u00c3\u0089', '\u00c9'],
  ['\u00c3\u008d', '\u00cd'],
  ['\u00c3\u0093', '\u00d3'],
  ['\u00c3\u009a', '\u00da'],
  ['\u00c3\u00b1', '\u00f1'],
  ['\u00c3\u0091', '\u00d1'],
  ['\u00c3\u00bc', '\u00fc'],
  ['\u00c3\u009c', '\u00dc'],
  ['\u00e2\u0080\u0099', '\''],
  ['\u00e2\u0080\u0098', '\''],
  ['\u00e2\u0080\u009c', '"'],
  ['\u00e2\u0080\u009d', '"'],
  ['\u00e2\u0080\u0093', '-'],
  ['\u00e2\u0080\u0094', '-'],
  ['\u00e2\u0080\u00a6', '...'],
  ['\u00c2', ''],
];

const PHRASE_REPAIRS = [
  ['Pa\ufffdses', 'Pa\u00edses'],
  ['L\ufffdngua', 'L\u00edngua'],
  ['El Pa\ufffds', 'El Pa\u00eds'],
  ['legado\ufffd', 'legado'],
  ['Tecnolog\u00c3a', 'Tecnolog\u00eda'],
];

function slugify(text = '') {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function hasFileExtension(pathname = '') {
  return /\/[^/]+\.[a-z0-9]+$/i.test(pathname);
}

function ensureLeadingSlash(pathname = '') {
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

function normalizeSameSitePath(pathname = '') {
  let normalized = ensureLeadingSlash(String(pathname ?? '').trim());
  normalized = normalized.replace(/\/+/g, '/');
  if (!normalized) return '/';
  if (normalized !== '/' && !hasFileExtension(normalized) && !normalized.endsWith('/')) {
    normalized += '/';
  }
  return normalized;
}

function listFilesRecursively(dir, predicate = () => true) {
  if (!existsSync(dir)) return [];

  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursively(fullPath, predicate));
      continue;
    }
    if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const data = {};
  let currentKey = null;
  let listMode = false;

  for (const line of match[1].split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('- ') && currentKey && listMode) {
      let value = trimmed.slice(2).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
        value = value.slice(1, -1);
      }
      data[currentKey].push(value);
      continue;
    }

    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (value === '' || value === '[]') {
      data[key] = [];
      currentKey = key;
      listMode = true;
      continue;
    }

    listMode = false;
    currentKey = key;

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
      value = value.slice(1, -1);
    }

    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => {
          if ((item.startsWith('"') && item.endsWith('"')) || (item.startsWith('\'') && item.endsWith('\''))) {
            return item.slice(1, -1);
          }
          return item;
        });
      continue;
    }

    if (value === 'true') {
      data[key] = true;
      continue;
    }
    if (value === 'false') {
      data[key] = false;
      continue;
    }

    data[key] = value;
  }

  return { data, body: match[2] };
}

function normalizeImageAlt(raw = '') {
  let alt = String(raw ?? '').trim();
  alt = alt.replace(/^["'`]+/, '').replace(/["'`]+$/, '');
  alt = alt.replace(/\s+/g, ' ');
  alt = alt.replace(/[)\].,;:!?]+$/, '');
  alt = alt.replace(/^!+\s*/, '');
  alt = alt.replace(/^\[+|\]+$/g, '');
  return alt || 'Imagen';
}

function countMatches(text, regex) {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function safeDecodePathSegment(segment = '') {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function splitDestinationAndTitle(raw = '') {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) return { destination: '', title: '' };

  const angleMatch = trimmed.match(/^<([^>]+)>(.*)$/);
  if (angleMatch) {
    return {
      destination: angleMatch[1].trim(),
      title: angleMatch[2].trim(),
    };
  }

  const titleIndex = trimmed.search(/\s+["']/);
  if (titleIndex === -1) {
    return { destination: trimmed, title: '' };
  }

  return {
    destination: trimmed.slice(0, titleIndex).trim(),
    title: trimmed.slice(titleIndex).trim(),
  };
}

function normalizeExternalUrl(url = '') {
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  return url;
}

function repairCommonMojibake(text = '') {
  let repaired = String(text ?? '');

  for (const [pattern, replacement] of MOJIBAKE_REPLACEMENTS) {
    repaired = repaired.split(pattern).join(replacement);
  }

  for (const [pattern, replacement] of PHRASE_REPAIRS) {
    repaired = repaired.split(pattern).join(replacement);
  }

  return repaired;
}

function loadSiteMaps() {
  const slugToCanonical = new Map();
  const knownPaths = new Set(['/', '/blog/', '/sobre/', '/feed.xml', '/robots.txt', '/404.html']);
  const assetPaths = new Set();

  const postFiles = listFilesRecursively(join(ROOT, 'blog-posts'), (file) => file.endsWith('.md'));
  for (const filePath of postFiles) {
    const raw = readFileSync(filePath, 'utf8');
    const { data } = parseFrontmatter(raw);
    const fileSlug = filePath.split('/').pop().replace(/\.md$/, '');
    const effectiveSlug = slugify(data.slug || fileSlug) || fileSlug;
    const oldUrl = normalizeSameSitePath(data.oldUrl || `/blog/${effectiveSlug}/`);
    slugToCanonical.set(effectiveSlug, oldUrl);
    knownPaths.add(oldUrl);
    knownPaths.add(normalizeSameSitePath(`/blog/${effectiveSlug}/`));
    if (data.category) {
      knownPaths.add(normalizeSameSitePath(`/categoria/${slugify(data.category)}/`));
    }
  }

  const guideFiles = listFilesRecursively(join(ROOT, 'guides'), (file) => file.endsWith('.md'));
  for (const filePath of guideFiles) {
    const raw = readFileSync(filePath, 'utf8');
    const { data } = parseFrontmatter(raw);
    const fileSlug = filePath.split('/').pop().replace(/\.md$/, '');
    const effectiveSlug = slugify(data.slug || fileSlug) || fileSlug;
    knownPaths.add(normalizeSameSitePath(`/guia/${effectiveSlug}/`));
  }

  if (existsSync(AUTHORS_DIR)) {
    for (const filePath of listFilesRecursively(AUTHORS_DIR, (file) => file.endsWith('.json'))) {
      const author = JSON.parse(readFileSync(filePath, 'utf8'));
      if (author.slug) {
        knownPaths.add(normalizeSameSitePath(`/autor/${author.slug}/`));
      }
    }
  }

  for (const dirName of STATIC_DIRS) {
    const dirPath = join(ROOT, dirName);
    for (const filePath of listFilesRecursively(dirPath)) {
      const relativePath = `/${relative(ROOT, filePath).replace(/\\/g, '/')}`;
      assetPaths.add(relativePath);
      assetPaths.add(normalizeSameSitePath(relativePath));
      knownPaths.add(relativePath);
    }
  }

  return { slugToCanonical, knownPaths, assetPaths };
}

const SITE_MAPS = loadSiteMaps();

function resolveSlugCandidate(pathname = '') {
  const cleanPath = pathname.split('#')[0].split('?')[0];
  const lastSegment = cleanPath
    .replace(/\/+$/, '')
    .split('/')
    .filter(Boolean)
    .pop();

  if (!lastSegment) return null;

  const slugCandidate = slugify(safeDecodePathSegment(lastSegment).replace(/\.[a-z0-9]+$/i, ''));
  if (!slugCandidate) return null;

  if (SITE_MAPS.slugToCanonical.has(slugCandidate)) {
    return SITE_MAPS.slugToCanonical.get(slugCandidate);
  }

  const prefixMatches = [...SITE_MAPS.slugToCanonical.entries()]
    .filter(([slug]) => slug.startsWith(slugCandidate) || slugCandidate.startsWith(slug))
    .map(([, canonical]) => canonical);

  if (prefixMatches.length === 1) {
    return prefixMatches[0];
  }

  return null;
}

function resolveSiteTarget(rawUrl = '', { preserveUnknownInternal = false } = {}) {
  const normalizedExternal = normalizeExternalUrl(rawUrl.trim());

  if (!normalizedExternal) {
    return { url: rawUrl, unresolvedInternal: false };
  }

  if (/^(mailto:|tel:|javascript:|#)/i.test(normalizedExternal)) {
    return { url: normalizedExternal, unresolvedInternal: false };
  }

  if (!SITE_DOMAIN_RE.test(normalizedExternal) && !normalizedExternal.startsWith('/')) {
    return { url: normalizedExternal, unresolvedInternal: false };
  }

  let pathname = normalizedExternal;
  if (SITE_DOMAIN_RE.test(normalizedExternal)) {
    pathname = normalizedExternal.replace(SITE_DOMAIN_RE, '');
    pathname = pathname || '/';
  }

  const normalizedPath = normalizeSameSitePath(pathname);
  const exactPath = hasFileExtension(pathname) ? ensureLeadingSlash(pathname.replace(/\/+/g, '/')) : normalizedPath;

  if (normalizedPath.startsWith('/blog/')) {
    const slugResolved = resolveSlugCandidate(pathname);
    if (slugResolved) {
      return { url: slugResolved, unresolvedInternal: false };
    }
  }

  if (SITE_MAPS.assetPaths.has(exactPath) || SITE_MAPS.knownPaths.has(exactPath) || SITE_MAPS.knownPaths.has(normalizedPath)) {
    return { url: SITE_MAPS.assetPaths.has(exactPath) ? exactPath : normalizedPath, unresolvedInternal: false };
  }

  const slugResolved = resolveSlugCandidate(pathname);
  if (slugResolved) {
    return { url: slugResolved, unresolvedInternal: false };
  }

  if (preserveUnknownInternal) {
    return { url: normalizedPath, unresolvedInternal: false };
  }

  return { url: normalizedPath, unresolvedInternal: true };
}

function cleanupMarkdown(raw) {
  let text = String(raw ?? '');

  text = repairCommonMojibake(text);
  text = text.replace(/https?:\/\/(?:www\.)?alfonsogu\.com/gi, 'https://crearsoftware.com');

  text = text.replace(/\[!\[\s*([^\]]*?)\]\(([^)\n]+)\)\]\(([^)\n]+)\)/g, (_, alt, innerUrl) => {
    const { url } = resolveSiteTarget(innerUrl, { preserveUnknownInternal: true });
    return `![${normalizeImageAlt(alt)}](${url})`;
  });

  text = text.replace(/!\[\[([^\]]*?)\]\(([^)\n]+)\)\]\(([^)\n]+)\)/g, (_, alt, innerUrl) => {
    const { url } = resolveSiteTarget(innerUrl, { preserveUnknownInternal: true });
    return `![${normalizeImageAlt(alt)}](${url})`;
  });

  text = text.replace(/!\[([^\]]*?)\]\(([^)\n]+)\)/g, (_, alt, rawDestination) => {
    const { destination, title } = splitDestinationAndTitle(rawDestination);
    const resolved = resolveSiteTarget(destination, { preserveUnknownInternal: true });
    const suffix = title ? ` ${title}` : '';
    return `![${normalizeImageAlt(alt)}](${resolved.url}${suffix})`;
  });

  text = text.replace(/(^|[^!])\[([^\]]+)\]\(([^)\n]+)\)/g, (_, prefix, label, rawDestination) => {
    const { destination, title } = splitDestinationAndTitle(rawDestination);
    const resolved = resolveSiteTarget(destination);
    if (resolved.unresolvedInternal) {
      return `${prefix}${label}`;
    }
    const suffix = title ? ` ${title}` : '';
    return `${prefix}[${label}](${resolved.url}${suffix})`;
  });

  text = text.replace(/<a\b([^>]*?)href=["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi, (match, beforeHref, href, afterHref, inner) => {
    const resolved = resolveSiteTarget(href);
    if (resolved.unresolvedInternal) {
      return inner;
    }
    return `<a${beforeHref}href="${resolved.url}"${afterHref}>${inner}</a>`;
  });

  text = text.replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi, (_, start, src, end) => {
    const resolved = resolveSiteTarget(src, { preserveUnknownInternal: true });
    return `${start}${resolved.url}${end}`;
  });

  text = text.replace(/\\?\[youtube=([^\]\n]+)\](?:\\)?/gi, (_, url) => {
    const cleanUrl = normalizeExternalUrl(url.trim().replace(/\\+$/, '').replace(/^["']+|["']+$/g, ''));
    return `[Video de YouTube](${cleanUrl})`;
  });

  text = text.replace(/\\?\[wpvideo\s+([^\]\n]+)\](?:\\)?/gi, (_, code) => {
    const cleanCode = code.trim().replace(/\\+$/, '');
    return `[Video de WordPress original](https://wordpress.com/) (wpvideo ${cleanCode})`;
  });

  text = text.replace(/(\]\([^)\n]*?)\\\)/g, '$1)');
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.replace(/[ \t]+$/gm, '');

  return text;
}

function snapshotCounts(text) {
  return {
    oldDomain: countMatches(text, /https?:\/\/(?:www\.)?alfonsogu\.com/gi),
    protocolRelative: countMatches(text, /\]\(\/\/[^)\n]+\)/g),
    selfAbsoluteLinks: countMatches(text, /https?:\/\/(?:www\.)?crearsoftware\.com/gi),
    suspiciousText: countMatches(text, /(?:\u00c3|\u00c2|\ufffd)/g),
    blogStyleLinks: countMatches(text, BLOG_STYLE_RE),
  };
}

const files = CONTENT_DIRS.flatMap((dirName) => listFilesRecursively(join(ROOT, dirName), (file) => file.endsWith('.md')));

const beforeTotals = {
  oldDomain: 0,
  protocolRelative: 0,
  selfAbsoluteLinks: 0,
  suspiciousText: 0,
  blogStyleLinks: 0,
};

const changedFiles = [];

for (const filePath of files) {
  const original = readFileSync(filePath, 'utf8');
  const before = snapshotCounts(original);
  for (const [key, value] of Object.entries(before)) {
    beforeTotals[key] += value;
  }

  const cleaned = cleanupMarkdown(original);
  if (cleaned !== original) {
    changedFiles.push(relative(ROOT, filePath));
    if (!DRY_RUN) {
      writeFileSync(filePath, cleaned);
    }
  }
}

const afterTotals = {
  oldDomain: 0,
  protocolRelative: 0,
  selfAbsoluteLinks: 0,
  suspiciousText: 0,
  blogStyleLinks: 0,
};

for (const filePath of files) {
  const current = readFileSync(filePath, 'utf8');
  const after = snapshotCounts(current);
  for (const [key, value] of Object.entries(after)) {
    afterTotals[key] += value;
  }
}

console.log(JSON.stringify({
  dryRun: DRY_RUN,
  scannedFiles: files.length,
  changedFiles: changedFiles.length,
  countsBefore: beforeTotals,
  countsAfter: afterTotals,
}, null, 2));

if (changedFiles.length > 0) {
  console.log('\nChanged files:');
  for (const filePath of changedFiles) {
    console.log(filePath);
  }
}
