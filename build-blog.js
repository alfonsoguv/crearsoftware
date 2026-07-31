import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, copyFileSync } from 'fs';
import { join, basename } from 'path';
import { marked } from 'marked';

// ---------------------------------------------------------------------------
// Site configuration
// ---------------------------------------------------------------------------
const SITE_URL = 'https://crearsoftware.com';
const SITE_NAME = 'Crear Software';
const SITE_DESCRIPTION = 'Crear software con propósito: desarrollo de software, inteligencia artificial y tecnología empresarial para PYMEs';
const SITE_LANG = 'es';
const SITE_LOCALE = 'es_ES';
const DEFAULT_OG_IMAGE = '/images/og-cover.svg';
const DEFAULT_AUTHOR_IMAGE = '/images/default-author.svg';

const POSTS_DIR = './blog-posts';
const GUIDES_DIR = './guides';
const AUTHORS_DIR = './authors';
const TEMPLATES_DIR = './templates';
const OUTPUT_DIR = './dist';

// ---------------------------------------------------------------------------
// Configure marked for clean HTML
// ---------------------------------------------------------------------------
marked.setOptions({
  gfm: true,
  breaks: false,
});

// ---------------------------------------------------------------------------
// Load templates from templates/ directory
// ---------------------------------------------------------------------------
const templates = {};
const templateFiles = ['blog-post', 'home', 'blog-index', 'category-page', 'guide-page', 'manifest-page'];
for (const name of templateFiles) {
  const filePath = join(TEMPLATES_DIR, `${name}.html`);
  if (existsSync(filePath)) {
    templates[name] = readFileSync(filePath, 'utf-8');
  } else {
    console.warn(`  [warn] Template not found: ${filePath}`);
    templates[name] = '';
  }
}

// ---------------------------------------------------------------------------
// Load internal links data (for related posts in guides)
// ---------------------------------------------------------------------------
let internalLinks = {};
const internalLinksPath = './data/internal-links.json';
if (existsSync(internalLinksPath)) {
  try {
    internalLinks = JSON.parse(readFileSync(internalLinksPath, 'utf-8'));
  } catch (e) {
    console.warn('  [warn] Could not parse internal-links.json');
  }
}

const ABOUT_PAGE_MARKDOWN = `
Crear Software es un blog editorial sobre desarrollo de software, inteligencia artificial y tecnología empresarial. El proyecto nació en 2007 con una idea muy concreta: escribir con perspectiva práctica sobre cómo se construyen productos, empresas y equipos tecnológicos que de verdad aportan valor.

## Qué encontrarás aquí

- Artículos sobre producto, arquitectura, diseño y negocio del software.
- Guías prácticas sobre inteligencia artificial aplicada y transformación digital.
- Reflexiones de largo recorrido nacidas de la experiencia real creando tecnología para empresas.

## Quién escribe

El sitio está editado por Alfonso Gutiérrez, fundador y tecnólogo con trayectoria en software empresarial, ventas consultivas y construcción de equipos.

## Cómo está organizado el contenido

El blog combina artículos históricos del archivo con nuevas piezas centradas en IA, software y operaciones. Para facilitar la navegación, el contenido se agrupa por categorías temáticas y por autor, y todas las páginas principales cuentan con metadatos preparados para indexación y compartición social.
`;

// ---------------------------------------------------------------------------
// Category descriptions map
// ---------------------------------------------------------------------------
const CATEGORY_DESCRIPTIONS = {
  'inteligencia-artificial': 'Artículos sobre inteligencia artificial, machine learning, modelos de lenguaje, chatbots y las últimas tendencias en IA aplicada a empresas y desarrollo.',
  'desarrollo-software': 'Todo sobre desarrollo de software moderno: lenguajes de programación, frameworks, arquitectura de sistemas, buenas prácticas y herramientas para desarrolladores.',
  'tecnologia-empresarial': 'Tecnología para empresas: ERP, CRM, SaaS, soluciones cloud y herramientas que transforman la gestión empresarial.',
  'innovacion-digital': 'Innovación digital, transformación empresarial, startups, tendencias tecnológicas y el futuro de los negocios digitales.',
  'productividad-herramientas': 'Herramientas y metodologías para mejorar la productividad personal y de equipos de desarrollo.',
};

const CATEGORY_LABELS = {
  'inteligencia-artificial': 'Inteligencia Artificial',
  'desarrollo-software': 'Desarrollo de Software',
  'tecnologia-empresarial': 'Tecnología Empresarial',
  'innovacion-digital': 'Innovación Digital',
  'productividad-herramientas': 'Productividad y Herramientas',
};

// ---------------------------------------------------------------------------
// Frontmatter parser (lightweight, no gray-matter dependency needed)
// Parses YAML-like frontmatter between --- delimiters
// ---------------------------------------------------------------------------
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const frontmatter = match[1];
  const content = match[2];
  const data = {};
  let currentKey = null;
  let listMode = false;

  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // List item
    if (trimmed.startsWith('- ') && currentKey && listMode) {
      let val = trimmed.slice(2).trim();
      // Strip quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      data[currentKey].push(val);
      continue;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    if (value === '' || value === '[]') {
      // Could be a list on next lines or empty
      data[key] = [];
      currentKey = key;
      listMode = true;
      continue;
    }

    listMode = false;
    currentKey = key;

    // Strip quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Inline array: [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value.slice(1, -1).split(',').map(v => {
        v = v.trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1);
        }
        return v;
      }).filter(Boolean);
      listMode = false;
      continue;
    }

    // Boolean
    if (value === 'true') { data[key] = true; continue; }
    if (value === 'false') { data[key] = false; continue; }

    // Number
    if (/^-?\d+(\.\d+)?$/.test(value)) { data[key] = Number(value); continue; }

    data[key] = value;
  }

  return { data, content };
}

// ---------------------------------------------------------------------------
// Date formatting (Spanish)
// ---------------------------------------------------------------------------
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Compact date for editorial meta rows, e.g. "14 abr 2025"
function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d
    .toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
    .replace(/\./g, '');
}

// ---------------------------------------------------------------------------
// Slug helper
// ---------------------------------------------------------------------------
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function escapeHtml(value = '') {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(value = '') {
  return escapeHtml(value);
}

function escapeJsString(value = '') {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '')
    .replace(/\n/g, '\\n');
}

function normalizeWhitespace(text = '') {
  return String(text ?? '').replace(/\s+/g, ' ').trim();
}

function stripMarkdown(markdown = '') {
  return String(markdown ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
    .replace(/\|/g, ' ')
    .replace(/<[^>]+>/g, ' ');
}

function truncateText(text, maxLength = 160) {
  const clean = normalizeWhitespace(text);
  if (!clean) return '';
  if (clean.length <= maxLength) return clean;

  const candidate = clean.slice(0, maxLength + 1);
  const cutAt = candidate.lastIndexOf(' ');
  const safeCut = cutAt > Math.floor(maxLength * 0.6) ? cutAt : maxLength;
  return `${candidate.slice(0, safeCut).trim()}...`;
}

function buildExcerpt(markdown, maxLength = 160) {
  return truncateText(stripMarkdown(markdown), maxLength);
}

function looksWeakDescription(description = '') {
  return (
    !description ||
    description.length < 90 ||
    description.length > 170 ||
    description.includes('...') ||
    description.includes('…') ||
    /Resumen ChatGPT/i.test(description) ||
    /\\"|Ã|Â/.test(description)
  );
}

function getMetaDescription(entry) {
  const current = normalizeWhitespace(entry.description || '');
  const excerpt = buildExcerpt(entry.rawContent || entry.content || '', 160);

  if (looksWeakDescription(current) && excerpt) {
    return excerpt;
  }

  return current || excerpt || `${entry.title} en ${SITE_NAME}`;
}

function getEffectiveSlug(entry) {
  const fileSlug = basename(entry.file, '.md');
  return slugify(entry.slug || fileSlug) || fileSlug;
}

function getCategorySlug(category = '') {
  return slugify(category || 'general');
}

function getCategoryLabel(category = '') {
  const categorySlug = getCategorySlug(category);
  return CATEGORY_LABELS[categorySlug] || category || 'General';
}

function normalizeImagePath(imagePath = '') {
  const normalized = imagePath && imagePath.trim() ? imagePath.trim() : '';
  if (!normalized) return '';

  if (normalized.startsWith('//')) {
    return `https:${normalized}`;
  }

  if (/^https?:\/\/(www\.)?crearsoftware\.com\//i.test(normalized)) {
    return normalized
      .replace(/^http:\/\//i, 'https://')
      .replace(/^https:\/\/www\.crearsoftware\.com\//i, 'https://crearsoftware.com/');
  }

  return normalized;
}

function extractFirstImageUrl(markdown = '') {
  const source = String(markdown ?? '');
  const markdownMatch = source.match(/!\[[^\]]*\]\(([^)]+)\)/i);
  const htmlMatch = source.match(/<img[^>]+src=["']([^"']+)["']/i);
  let candidate = markdownMatch ? markdownMatch[1] : (htmlMatch ? htmlMatch[1] : '');

  if (!candidate) return '';

  candidate = candidate.trim().replace(/^<|>$/g, '');
  const titleSeparator = candidate.search(/\s+["']/);
  if (titleSeparator > 0) {
    candidate = candidate.slice(0, titleSeparator);
  }

  return normalizeImagePath(candidate);
}

function isTrustedContentImageUrl(imagePath = '') {
  const normalized = normalizeImagePath(imagePath);
  if (!normalized) return false;
  if (/[?&](sig|token|expires|se)=/i.test(normalized)) return false;
  return normalized.startsWith('/') || /^https:\/\/crearsoftware\.com\//i.test(normalized);
}

function getEntryImage(entry = {}) {
  const configuredImage = normalizeImagePath(entry.image || '');
  if (configuredImage) {
    return configuredImage;
  }

  const extractedImage = extractFirstImageUrl(entry.rawContent || entry.content || '');
  if (isTrustedContentImageUrl(extractedImage)) {
    return extractedImage;
  }

  return DEFAULT_OG_IMAGE;
}

function getAbsoluteImageUrl(imagePath = DEFAULT_OG_IMAGE) {
  const normalized = normalizeImagePath(imagePath) || DEFAULT_OG_IMAGE;
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized;
  }
  return `${SITE_URL}${normalized.startsWith('/') ? normalized : `/${normalized}`}`;
}

function buildSocialMeta({
  title,
  description,
  url,
  type = 'website',
  image = DEFAULT_OG_IMAGE,
  author = '',
  publishedTime = '',
  modifiedTime = '',
  section = '',
  noindex = false,
}) {
  const absoluteImage = getAbsoluteImageUrl(image);
  const robotsMeta = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
  const lines = [
    `<meta name="robots" content="${robotsMeta}">`,
    `<meta property="og:locale" content="${SITE_LOCALE}">`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">`,
    `<meta property="og:type" content="${escapeHtml(type)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:url" content="${escapeHtml(url)}">`,
    `<meta property="og:image" content="${escapeHtml(absoluteImage)}">`,
    `<meta property="og:image:alt" content="${escapeHtml(title)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(absoluteImage)}">`,
  ];

  if (author) {
    lines.push(`<meta name="author" content="${escapeHtml(author)}">`);
  }

  if (type === 'article') {
    if (publishedTime) {
      lines.push(`<meta property="article:published_time" content="${escapeHtml(publishedTime)}">`);
    }
    if (modifiedTime) {
      lines.push(`<meta property="article:modified_time" content="${escapeHtml(modifiedTime)}">`);
    }
    if (section) {
      lines.push(`<meta property="article:section" content="${escapeHtml(section)}">`);
    }
  }

  return lines.join('\n  ');
}

function buildBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// GEO: extrae la sección "## Preguntas frecuentes..." del markdown y la
// convierte en FAQPage JSON-LD. Los motores generativos (AI Overviews,
// ChatGPT Search, Perplexity) citan pares pregunta/respuesta estructurados.
function extractFaqPairs(rawContent) {
  if (!rawContent) return [];

  const lines = rawContent.split('\n');
  const startIndex = lines.findIndex(line => /^##\s+(preguntas frecuentes|faq)\b/i.test(line.trim()));
  if (startIndex === -1) return [];

  const pairs = [];
  let current = null;

  for (const line of lines.slice(startIndex + 1)) {
    // Un nuevo H2 (o superior) cierra la sección de FAQ.
    if (/^#{1,2}\s+/.test(line)) break;

    const questionMatch = line.match(/^###\s+(.+?)\s*$/);
    if (questionMatch) {
      if (current) pairs.push(current);
      current = { question: questionMatch[1].trim(), answer: [] };
      continue;
    }

    if (current && line.trim()) current.answer.push(line.trim());
  }
  if (current) pairs.push(current);

  return pairs
    .map(pair => ({
      question: normalizeWhitespace(stripMarkdown(pair.question)),
      answer: normalizeWhitespace(stripMarkdown(pair.answer.join(' '))),
    }))
    .filter(pair => pair.question && pair.answer);
}

function buildFaqJsonLd(rawContent, pageUrl) {
  const pairs = extractFaqPairs(rawContent);
  if (pairs.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(pageUrl ? { url: pageUrl, mainEntityOfPage: pageUrl } : {}),
    inLanguage: 'es',
    mainEntity: pairs.map(pair => ({
      '@type': 'Question',
      name: pair.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: pair.answer,
      },
    })),
  };
}

function formatRssDate(dateStr) {
  return new Date(dateStr || Date.now()).toUTCString();
}

// ---------------------------------------------------------------------------
// Read time estimation — returns just the number of minutes
// ---------------------------------------------------------------------------
function estimateReadTime(text) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// ---------------------------------------------------------------------------
// Auto-TOC: extract H2/H3 headings and build table of contents
// Returns just <ul>...</ul> without any <nav> wrapper (templates have their own)
// ---------------------------------------------------------------------------
function buildTOC(markdownContent) {
  const headings = [];
  const lines = markdownContent.split('\n');

  for (const line of lines) {
    const m2 = line.match(/^##\s+(.+)$/);
    const m3 = line.match(/^###\s+(.+)$/);
    if (m2) {
      const text = m2[1].replace(/[*_`]/g, '').trim();
      const id = slugify(text);
      headings.push({ level: 2, text, id });
    } else if (m3) {
      const text = m3[1].replace(/[*_`]/g, '').trim();
      const id = slugify(text);
      headings.push({ level: 3, text, id });
    }
  }

  if (headings.length < 2) return '';

  let html = '<ul class="toc-list">\n';

  for (const h of headings) {
    const indent = h.level === 3 ? '    ' : '  ';
    const cls = h.level === 3 ? ' class="toc-sub"' : '';
    html += `${indent}<li${cls}><a href="#${h.id}">${h.text}</a></li>\n`;
  }

  html += '</ul>';
  return html;
}

// ---------------------------------------------------------------------------
// Add IDs to rendered HTML headings (for TOC anchor links)
// ---------------------------------------------------------------------------
function addHeadingIds(html) {
  return html.replace(/<(h[23])>(.*?)<\/\1>/gi, (match, tag, content) => {
    const text = content.replace(/<[^>]+>/g, '').trim();
    const id = slugify(text);
    return `<${tag} id="${id}">${content}</${tag}>`;
  });
}

// ---------------------------------------------------------------------------
// Load authors from authors/*.json
// ---------------------------------------------------------------------------
const authors = {};
if (existsSync(AUTHORS_DIR)) {
  readdirSync(AUTHORS_DIR)
    .filter(f => f.endsWith('.json'))
    .forEach(f => {
      const data = JSON.parse(readFileSync(join(AUTHORS_DIR, f), 'utf-8'));
      authors[data.slug] = data;
    });
}

// Default author fallback
function resolveAuthor(post) {
  const rawAuthor = post.author || 'crear-software';
  const slug = slugify(rawAuthor) || rawAuthor.toLowerCase().replace(/\s+/g, '-');
  return authors[slug] || {
    slug: slug,
    name: rawAuthor,
    role: '',
    bio: '',
    shortBio: '',
    expertise: [],
    experience: '',
    image: DEFAULT_AUTHOR_IMAGE,
    links: {},
  };
}

// ---------------------------------------------------------------------------
// Read and parse all posts
// ---------------------------------------------------------------------------
let posts = [];
if (existsSync(POSTS_DIR)) {
  const files = readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  posts = files.map(file => {
    const raw = readFileSync(join(POSTS_DIR, file), 'utf-8');
    const { data, content } = parseFrontmatter(raw);
    const html = addHeadingIds(marked(content));
    const toc = buildTOC(content);
    // Handle both readTime and readingTime from frontmatter; fallback to estimation
    const readingTime = data.readingTime || data.readTime || estimateReadTime(content);
    const post = { ...data, content: html, toc, readingTime, rawContent: content, file };
    return {
      ...post,
      effectiveSlug: getEffectiveSlug(post),
      categorySlug: post.category ? getCategorySlug(post.category) : '',
      categoryLabel: post.category ? getCategoryLabel(post.category) : '',
      metaDescription: getMetaDescription(post),
      resolvedImage: getEntryImage(post),
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ---------------------------------------------------------------------------
// Read and parse guides
// ---------------------------------------------------------------------------
let guides = [];
if (existsSync(GUIDES_DIR)) {
  const guideFiles = readdirSync(GUIDES_DIR).filter(f => f.endsWith('.md'));
  guides = guideFiles.map(file => {
    const raw = readFileSync(join(GUIDES_DIR, file), 'utf-8');
    const { data, content } = parseFrontmatter(raw);
    const html = addHeadingIds(marked(content));
    const toc = buildTOC(content);
    const readingTime = data.readingTime || data.readTime || estimateReadTime(content);
    const guide = { ...data, content: html, toc, readingTime, rawContent: content, file };
    return {
      ...guide,
      effectiveSlug: getEffectiveSlug(guide),
      metaDescription: getMetaDescription(guide),
      resolvedImage: getEntryImage(guide),
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ---------------------------------------------------------------------------
// Build a slug-to-post lookup for internal links
// ---------------------------------------------------------------------------
const postsBySlug = {};
for (const post of posts) {
  postsBySlug[post.effectiveSlug] = post;
  postsBySlug[basename(post.file, '.md')] = post;
  if (post.slug) {
    postsBySlug[post.slug] = post;
  }
}

// ---------------------------------------------------------------------------
// Collect categories from posts
// ---------------------------------------------------------------------------
const categories = {};
for (const post of posts) {
  const cat = post.categoryLabel || 'General';
  const catSlug = post.categorySlug || slugify(cat);
  if (!categories[catSlug]) {
    categories[catSlug] = { name: cat, slug: catSlug, posts: [] };
  }
  categories[catSlug].posts.push(post);
}

// ---------------------------------------------------------------------------
// Ensure output directories
// ---------------------------------------------------------------------------
mkdirSync(OUTPUT_DIR, { recursive: true });
mkdirSync(join(OUTPUT_DIR, 'blog'), { recursive: true });

console.log(`\nCrear Software - Build\n${'='.repeat(40)}`);

// ---------------------------------------------------------------------------
// Helper: resolve post URL based on oldUrl or default /blog/{slug}/
// ---------------------------------------------------------------------------
function getPostUrl(post) {
  if (post.oldUrl) {
    // Ensure it starts with / and ends with /
    let url = decodeURIComponent(post.oldUrl);
    if (!url.startsWith('/')) url = '/' + url;
    if (!url.endsWith('/')) url = url + '/';
    return url;
  }
  return `/blog/${post.effectiveSlug || getEffectiveSlug(post)}/`;
}

// Percent-encode cada segmento del path para URLs PÚBLICAS (canonical, sitemap, feed),
// para que coincidan con la forma indexada por Google (p.ej. ¿ -> %C2%BF). NO usar para rutas en disco.
function encodeUrlPath(p) {
  return p.split('/').map((seg) => encodeURIComponent(seg)).join('/');
}

// ---------------------------------------------------------------------------
// Helper: get output path for a post
// ---------------------------------------------------------------------------
function getPostOutputPath(post) {
  const url = getPostUrl(post);
  return join(OUTPUT_DIR, url, 'index.html');
}

// ---------------------------------------------------------------------------
// Template rendering helper: replace all occurrences of {{placeholder}}
// ---------------------------------------------------------------------------
function renderTemplate(template, replacements) {
  let html = template;
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, String(value ?? ''));
  }
  return html;
}

// ---------------------------------------------------------------------------
// Helper: build post card HTML (matching .post-card structure for templates)
// ---------------------------------------------------------------------------
function buildPostCard(post) {
  const url = getPostUrl(post);
  const readMins = typeof post.readingTime === 'number' ? post.readingTime : parseInt(post.readingTime) || 5;

  return `
    <div class="post-card">
      <div class="post-card-body">
        ${post.categoryLabel ? `<span class="post-card-category">${escapeHtml(post.categoryLabel)}</span>` : ''}
        <h3 class="post-card-title"><a href="${url}">${escapeHtml(post.title)}</a></h3>
        <p class="post-card-excerpt">${escapeHtml(post.metaDescription || '')}</p>
        <div class="post-card-meta">
          <time datetime="${post.date}">${formatDate(post.date)}</time>
          <span>${readMins} min de lectura</span>
        </div>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Helper: build home entry HTML (matching .entry structure for the home list)
// ---------------------------------------------------------------------------
function buildHomeEntry(post) {
  const url = getPostUrl(post);
  const readMins = typeof post.readingTime === 'number' ? post.readingTime : parseInt(post.readingTime) || 5;

  return `
        <a href="${url}" class="entry">
          <div class="entry-meta">${post.categoryLabel ? `<span class="cat">${escapeHtml(post.categoryLabel)}</span>` : ''}<span><time datetime="${post.date}">${formatDateShort(post.date)}</time></span><span>${readMins} min</span></div>
          <h2>${escapeHtml(post.title)}</h2>
          <p>${escapeHtml(post.metaDescription || '')}</p>
        </a>`;
}

// ---------------------------------------------------------------------------
// Helper: build post item HTML (matching .post-item structure for blog index)
// ---------------------------------------------------------------------------
function buildPostItem(post) {
  const url = getPostUrl(post);
  const readMins = typeof post.readingTime === 'number' ? post.readingTime : parseInt(post.readingTime) || 5;

  return `
    <div class="post-item">
      ${post.categoryLabel ? `<span class="post-item-category">${escapeHtml(post.categoryLabel)}</span>` : ''}
      <h2><a href="${url}">${escapeHtml(post.title)}</a></h2>
      <p class="post-item-excerpt">${escapeHtml(post.metaDescription || '')}</p>
      <div class="post-item-meta">
        <time datetime="${post.date}">${formatDate(post.date)}</time>
        <span>${readMins} min de lectura</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Helper: build related card HTML (matching .related-card structure)
// ---------------------------------------------------------------------------
function buildRelatedCard(post) {
  const url = getPostUrl(post);

  return `
    <div class="related-card">
      <h3><a href="${url}">${escapeHtml(post.title)}</a></h3>
      <p>${escapeHtml(post.metaDescription || '')}</p>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Helper: build related article link HTML (matching .related-article-link for guides)
// ---------------------------------------------------------------------------
function buildRelatedArticleLink(post) {
  const url = getPostUrl(post);
  return `
    <a href="${url}" class="related-article-link">
      <span>${escapeHtml(post.title)}</span>
      <span class="arrow">&rarr;</span>
    </a>
  `;
}

// ---------------------------------------------------------------------------
// Generate individual post pages
// ---------------------------------------------------------------------------
let postCount = 0;
let faqCount = 0;
for (const post of posts) {
  const postUrl = getPostUrl(post);
  const canonicalUrl = `${SITE_URL}${encodeUrlPath(postUrl)}`;
  const metaDescription = post.metaDescription || getMetaDescription(post);
  const socialMeta = buildSocialMeta({
    title: post.title,
    description: metaDescription,
    url: canonicalUrl,
    type: 'article',
    image: post.resolvedImage,
    author: resolveAuthor(post).name,
    publishedTime: post.date,
    modifiedTime: post.dateModified || post.date,
    section: post.category || '',
    noindex: post.noindex,
  });

  // Create output directory
  const outputPath = getPostOutputPath(post);
  mkdirSync(join(outputPath, '..'), { recursive: true });

  // Resolve author
  const author = resolveAuthor(post);

  // Reading time as number
  const readMins = typeof post.readingTime === 'number' ? post.readingTime : parseInt(post.readingTime) || 5;

  // Category info
  const categorySlug = post.categorySlug || '';

  // Breadcrumbs
  const breadcrumbsHTML = `<a href="/">Inicio</a> <span>›</span> ${post.categoryLabel ? `<a href="/categoria/${categorySlug}/">${escapeHtml(post.categoryLabel)}</a> <span>›</span> ` : ''}${escapeHtml(post.title)}`;

  // Find related posts using internal-links.json if available, otherwise tag/category matching
  let related = [];
  const linkData = internalLinks[post.effectiveSlug] || internalLinks[basename(post.file, '.md')] || internalLinks[post.slug];
  if (linkData && linkData.relatedPosts && linkData.relatedPosts.length > 0) {
    related = linkData.relatedPosts
      .map(relSlug => postsBySlug[relSlug])
      .filter(Boolean)
      .slice(0, 3);
  }
  if (related.length === 0) {
    related = posts
      .filter(p => p.effectiveSlug !== post.effectiveSlug)
      .map(p => {
        let score = 0;
        score += (p.tags || []).filter(t => (post.tags || []).includes(t)).length;
        if (p.categorySlug && post.categorySlug && p.categorySlug === post.categorySlug) score += 2;
        return { ...p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  const relatedHTML = related.map(r => buildRelatedCard(r)).join('');

  // Build JSON-LD BlogPosting schema
  const jsonLdObj = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": metaDescription,
    "datePublished": post.date,
    "dateModified": post.dateModified || post.date,
    "author": {
      "@type": "Person",
      "name": author.name,
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": getAbsoluteImageUrl(DEFAULT_OG_IMAGE),
      },
    },
    "url": canonicalUrl,
    "mainEntityOfPage": canonicalUrl,
    "inLanguage": "es",
  };

  jsonLdObj.image = getAbsoluteImageUrl(post.resolvedImage);

  if (author.links && author.links.linkedin) {
    jsonLdObj.author.sameAs = [author.links.linkedin];
  }

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: 'Inicio', url: SITE_URL },
    ...(post.categoryLabel ? [{ name: post.categoryLabel, url: `${SITE_URL}/categoria/${categorySlug}/` }] : []),
    { name: post.title, url: canonicalUrl },
  ]);
  const faqJsonLd = post.noindex ? null : buildFaqJsonLd(post.rawContent, canonicalUrl);
  if (faqJsonLd) faqCount += 1;
  const jsonLd = `<script type="application/ld+json">${JSON.stringify(
    [jsonLdObj, breadcrumbsJsonLd, faqJsonLd].filter(Boolean)
  )}</script>`;

  const html = renderTemplate(templates['blog-post'], {
    headTitle: escapeHtml(post.title),
    title: post.title,
    metaDescription: escapeHtml(metaDescription),
    canonicalUrl: canonicalUrl,
    content: post.content,
    toc: post.toc,
    date: post.date,
    dateFormatted: formatDate(post.date),
    readingTime: readMins,
    category: post.categoryLabel || '',
    categorySlug: categorySlug,
    author: author.name,
    authorSlug: author.slug,
    authorPhoto: author.image || DEFAULT_AUTHOR_IMAGE,
    authorBio: author.shortBio || author.bio || '',
    breadcrumbs: breadcrumbsHTML,
    relatedPosts: relatedHTML,
    jsonLd: jsonLd,
    socialMeta: socialMeta,
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    shareUrl: encodeURIComponent(canonicalUrl),
    shareTitle: encodeURIComponent(post.title),
    shareTitleJs: escapeJsString(post.title),
    shareUrlJs: escapeJsString(canonicalUrl),
  });

  writeFileSync(outputPath, html);
  postCount++;
  console.log(`  [post] ${postUrl}`);
}

// ---------------------------------------------------------------------------
// Generate blog index page at /blog/index.html
// ---------------------------------------------------------------------------
if (posts.length > 0) {
  // Category filter pills
  const categoryFiltersHTML = Object.values(categories)
    .sort((a, b) => b.posts.length - a.posts.length)
    .map(cat => `<li><a href="/categoria/${cat.slug}/" class="category-pill">${cat.name}</a></li>`)
    .join('\n        ');

  // Post items for list view
  const postsHTML = posts.map(post => buildPostItem(post)).join('');

  // Blog index JSON-LD
  const blogIndexJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Blog - ${SITE_NAME}`,
    "description": SITE_DESCRIPTION,
    "url": `${SITE_URL}/blog/`,
    "inLanguage": "es",
    "isPartOf": {
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
  };
  const blogIndexBreadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Inicio', url: SITE_URL },
    { name: 'Blog', url: `${SITE_URL}/blog/` },
  ]);

  const blogIndexHTML = renderTemplate(templates['blog-index'], {
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    metaDescription: escapeHtml(SITE_DESCRIPTION),
    canonicalUrl: `${SITE_URL}/blog/`,
    categoryFilters: categoryFiltersHTML,
    posts: postsHTML,
    pagination: '',
    socialMeta: buildSocialMeta({
      title: `Blog | ${SITE_NAME}`,
      description: SITE_DESCRIPTION,
      url: `${SITE_URL}/blog/`,
      image: DEFAULT_OG_IMAGE,
    }),
    jsonLd: `<script type="application/ld+json">${JSON.stringify([blogIndexJsonLd, blogIndexBreadcrumbs])}</script>`,
  });

  mkdirSync(join(OUTPUT_DIR, 'blog'), { recursive: true });
  writeFileSync(join(OUTPUT_DIR, 'blog', 'index.html'), blogIndexHTML);
  console.log(`  [index] /blog/ (${posts.length} artículos)`);
} else {
  console.log('  [index] /blog/ - sin artículos, omitiendo');
}

// ---------------------------------------------------------------------------
// Generate HOME PAGE at /index.html
// ---------------------------------------------------------------------------
{
  // Latest posts for the home list (editorial "Lo último")
  const featuredPosts = posts.slice(0, 6);
  const featuredPostsHTML = featuredPosts.map(post => buildHomeEntry(post)).join('');

  // Home JSON-LD
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "description": SITE_DESCRIPTION,
    "url": SITE_URL,
    "inLanguage": "es",
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
  };

  const homeHTML = renderTemplate(templates['home'], {
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    metaDescription: escapeHtml(SITE_DESCRIPTION),
    canonicalUrl: SITE_URL,
    featuredPosts: featuredPostsHTML,
    newsletterAction: '/api/subscribe',
    socialMeta: buildSocialMeta({
      title: `${SITE_NAME} — Blog de Desarrollo de Software, IA y Tecnología Empresarial`,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      image: DEFAULT_OG_IMAGE,
    }),
    jsonLd: `<script type="application/ld+json">${JSON.stringify(homeJsonLd)}</script>`,
  });

  writeFileSync(join(OUTPUT_DIR, 'index.html'), homeHTML);
  console.log(`  [home] / (index.html)`);
}

// ---------------------------------------------------------------------------
// Generate about page at /sobre/index.html
// ---------------------------------------------------------------------------
if (templates['manifest-page']) {
  const aboutUrl = `${SITE_URL}/sobre/`;
  const aboutDir = join(OUTPUT_DIR, 'sobre');
  const aboutDescription = 'Quiénes somos en Crear Software: enfoque editorial, temas principales y trayectoria escribiendo sobre software e inteligencia artificial.';
  const aboutContent = addHeadingIds(marked(ABOUT_PAGE_MARKDOWN));
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": `Sobre ${SITE_NAME}`,
    "description": aboutDescription,
    "url": aboutUrl,
    "inLanguage": "es",
    "isPartOf": {
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
  };
  const aboutBreadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Inicio', url: SITE_URL },
    { name: 'Sobre', url: aboutUrl },
  ]);

  mkdirSync(aboutDir, { recursive: true });
  writeFileSync(join(aboutDir, 'index.html'), renderTemplate(templates['manifest-page'], {
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    metaDescription: escapeHtml(aboutDescription),
    canonicalUrl: aboutUrl,
    content: aboutContent,
    socialMeta: buildSocialMeta({
      title: `Sobre | ${SITE_NAME}`,
      description: aboutDescription,
      url: aboutUrl,
      image: DEFAULT_OG_IMAGE,
    }),
    jsonLd: `<script type="application/ld+json">${JSON.stringify([aboutJsonLd, aboutBreadcrumbs])}</script>`,
  }));
  console.log('  [page] /sobre/');
}

// ---------------------------------------------------------------------------
// Generate category pages at /categoria/{slug}/index.html
// ---------------------------------------------------------------------------
for (const cat of Object.values(categories)) {
  const catDir = join(OUTPUT_DIR, 'categoria', cat.slug);
  mkdirSync(catDir, { recursive: true });

  const catUrl = `${SITE_URL}/categoria/${cat.slug}/`;
  const catDescription = CATEGORY_DESCRIPTIONS[cat.slug] || `Artículos sobre ${cat.name} en ${SITE_NAME}`;

  const catPostsHTML = cat.posts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(post => buildPostCard(post))
    .join('');

  // Related categories (all categories except the current one)
  const relatedCategoriesHTML = Object.values(categories)
    .filter(c => c.slug !== cat.slug)
    .sort((a, b) => b.posts.length - a.posts.length)
    .map(c => `<li><a href="/categoria/${c.slug}/">${c.name} <span class="cat-count">${c.posts.length}</span></a></li>`)
    .join('\n          ');

  // JSON-LD CollectionPage for category
  const catJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": cat.name,
    "description": catDescription,
    "url": catUrl,
    "inLanguage": "es",
    "isPartOf": {
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
    "numberOfItems": cat.posts.length,
  };
  const catBreadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Inicio', url: SITE_URL },
    { name: cat.name, url: catUrl },
  ]);

  const catHTML = renderTemplate(templates['category-page'], {
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    headTitle: escapeHtml(cat.name),
    category: cat.name,
    categoryDescription: catDescription,
    metaDescription: escapeHtml(catDescription),
    canonicalUrl: catUrl,
    posts: catPostsHTML,
    postCount: cat.posts.length,
    relatedCategories: relatedCategoriesHTML,
    socialMeta: buildSocialMeta({
      title: `${cat.name} | ${SITE_NAME}`,
      description: catDescription,
      url: catUrl,
      image: DEFAULT_OG_IMAGE,
    }),
    jsonLd: `<script type="application/ld+json">${JSON.stringify([catJsonLd, catBreadcrumbs])}</script>`,
  });

  writeFileSync(join(catDir, 'index.html'), catHTML);
  console.log(`  [categoria] /categoria/${cat.slug}/ (${cat.posts.length} artículos)`);
}

// ---------------------------------------------------------------------------
// Generate guide pages at /guia/{slug}/index.html
// ---------------------------------------------------------------------------
for (const guide of guides) {
  const slug = guide.effectiveSlug || getEffectiveSlug(guide);
  const guideDir = join(OUTPUT_DIR, 'guia', slug);
  mkdirSync(guideDir, { recursive: true });

  const guideUrl = `${SITE_URL}/guia/${slug}/`;
  const readMins = typeof guide.readingTime === 'number' ? guide.readingTime : parseInt(guide.readingTime) || 5;

  // Find related posts for this guide using internal-links.json
  let guideRelatedPosts = [];
  // Look through internal-links for posts that reference this guide as pillarGuide
  for (const [postSlug, linkData] of Object.entries(internalLinks)) {
    if (linkData.pillarGuide === slug && postsBySlug[postSlug]) {
      guideRelatedPosts.push(postsBySlug[postSlug]);
    }
  }
  // Limit to 6 related posts
  guideRelatedPosts = guideRelatedPosts.slice(0, 6);

  const relatedPostsHTML = guideRelatedPosts.map(p => buildRelatedArticleLink(p)).join('');

  // JSON-LD for guide (Article type)
  const guideJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.metaDescription || guide.description || '',
    "datePublished": guide.date,
    "dateModified": guide.dateModified || guide.date,
    "url": guideUrl,
    "inLanguage": "es",
    "author": {
      "@type": "Person",
      "name": "Alfonso Gutiérrez",
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": getAbsoluteImageUrl(DEFAULT_OG_IMAGE),
      },
    },
    "image": getAbsoluteImageUrl(guide.resolvedImage),
  };
  const guideBreadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Inicio', url: SITE_URL },
    { name: guide.title, url: guideUrl },
  ]);

  const guideHTML = renderTemplate(templates['guide-page'], {
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    headTitle: escapeHtml(guide.title),
    title: guide.title,
    description: guide.description || guide.metaDescription || '',
    metaDescription: escapeHtml(guide.metaDescription || guide.description || ''),
    canonicalUrl: guideUrl,
    toc: guide.toc,
    content: guide.content,
    date: guide.date || '',
    dateFormatted: guide.date ? formatDate(guide.date) : '',
    relatedPosts: relatedPostsHTML,
    socialMeta: buildSocialMeta({
      title: guide.title,
      description: guide.metaDescription || guide.description || '',
      url: guideUrl,
      type: 'article',
      image: guide.resolvedImage,
      author: 'Alfonso Gutiérrez',
      publishedTime: guide.date || '',
      modifiedTime: guide.dateModified || guide.date || '',
    }),
    jsonLd: `<script type="application/ld+json">${JSON.stringify(
      [guideJsonLd, guideBreadcrumbs, buildFaqJsonLd(guide.rawContent, guideUrl)].filter(Boolean)
    )}</script>`,
  });

  writeFileSync(join(guideDir, 'index.html'), guideHTML);
  console.log(`  [guia] /guia/${slug}/`);
}

// ---------------------------------------------------------------------------
// Generate sitemap.xml
// ---------------------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);

const sitemapEntries = [
  // Home page
  { loc: '/', lastmod: today, freq: 'weekly', priority: '1.0' },
  // Blog index
  { loc: '/blog/', lastmod: today, freq: 'daily', priority: '0.9' },
  // About page
  { loc: '/sobre/', lastmod: today, freq: 'monthly', priority: '0.6' },
];

// Post entries (using their actual URLs - old or new)
for (const post of posts) {
  if (post.noindex) continue;
  const postUrl = getPostUrl(post);
  sitemapEntries.push({
    loc: encodeUrlPath(postUrl),
    lastmod: post.dateModified || post.date,
    freq: 'monthly',
    priority: post === posts[0] ? '0.9' : '0.8',
  });
}

// Category entries
for (const cat of Object.values(categories)) {
  sitemapEntries.push({
    loc: `/categoria/${cat.slug}/`,
    lastmod: today,
    freq: 'weekly',
    priority: '0.7',
  });
}

// Guide entries
for (const guide of guides) {
  const slug = guide.slug || basename(guide.file, '.md');
  sitemapEntries.push({
    loc: `/guia/${slug}/`,
    lastmod: guide.dateModified || guide.date || today,
    freq: 'monthly',
    priority: '0.8',
  });
}


const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.map(e => `  <url>
    <loc>${escapeXml(`${SITE_URL}${e.loc}`)}</loc>
    <lastmod>${escapeXml(e.lastmod)}</lastmod>
    <changefreq>${e.freq}</changefreq>
    <priority>${e.priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${escapeXml(`${SITE_URL}${e.loc}`)}" />
  </url>`).join('\n')}
</urlset>`;

writeFileSync(join(OUTPUT_DIR, 'sitemap.xml'), sitemapXML);
console.log(`  [sitemap] sitemap.xml (${sitemapEntries.length} URLs)`);

// ---------------------------------------------------------------------------
// Generate feed.xml (RSS)
// ---------------------------------------------------------------------------
const feedItems = posts.slice(0, 100).map(post => {
  const postUrl = `${SITE_URL}${encodeUrlPath(getPostUrl(post))}`;
  const categoriesXml = (post.tags || [])
    .slice(0, 5)
    .map(tag => `    <category>${escapeXml(tag)}</category>`)
    .join('\n');

  return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${escapeXml(postUrl)}</link>
    <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
    <pubDate>${formatRssDate(post.date)}</pubDate>
    <description>${escapeXml(post.metaDescription || '')}</description>
${categoriesXml}
  </item>`;
}).join('\n');

const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${SITE_LANG}</language>
    <lastBuildDate>${formatRssDate(today)}</lastBuildDate>
    <atom:link href="${escapeXml(`${SITE_URL}/feed.xml`)}" rel="self" type="application/rss+xml" />
${feedItems}
  </channel>
</rss>`;

writeFileSync(join(OUTPUT_DIR, 'feed.xml'), feedXml);
console.log('  [feed] feed.xml');

// ---------------------------------------------------------------------------
// GEO: llms.txt y llms-full.txt (llmstxt.org)
//
// llms.txt      -> índice navegable de TODO el contenido indexable, para que un
//                  agente descubra la estructura del sitio en una sola petición.
// llms-full.txt -> texto completo del corpus curado (guías pilar + artículos con
//                  FAQ optimizada), para que el agente cite sin rastrear 500 URLs.
// ---------------------------------------------------------------------------
const indexablePosts = posts.filter(post => !post.noindex);

function llmsLine(title, url, description) {
  const summary = normalizeWhitespace(stripMarkdown(description || '')).slice(0, 200);
  return `- [${title}](${SITE_URL}${encodeUrlPath(url)})${summary ? `: ${summary}` : ''}`;
}

const llmsSections = [];

llmsSections.push(`## Guías pilar\n\n${guides
  .map(guide => llmsLine(
    guide.title,
    `/guia/${guide.slug || basename(guide.file, '.md')}/`,
    guide.metaDescription || guide.description
  ))
  .join('\n')}`);

for (const cat of Object.values(categories)) {
  const catPosts = cat.posts.filter(post => !post.noindex);
  if (catPosts.length === 0) continue;
  llmsSections.push(`## ${cat.name}\n\n${catPosts
    .map(post => llmsLine(post.title, getPostUrl(post), post.metaDescription))
    .join('\n')}`);
}

const llmsTxt = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

Blog en español sobre desarrollo de software, inteligencia artificial, agentes,
protocolo MCP y gestión de empresas tecnológicas. Autor: Alfonso Gutiérrez.
Contenido publicado desde 2007 y revisado de forma continua.

- Sitemap XML: ${SITE_URL}/sitemap.xml
- Feed RSS: ${SITE_URL}/feed.xml
- Contenido completo del corpus curado: ${SITE_URL}/llms-full.txt
- Licencia de uso: contenido citable indicando la fuente y enlazando a la URL original.

${llmsSections.join('\n\n')}

## Opcional

- [Sobre el autor](${SITE_URL}/sobre/): quién escribe el blog y su trayectoria.
- [Índice del blog](${SITE_URL}/blog/): listado cronológico completo.
`;

writeFileSync(join(OUTPUT_DIR, 'llms.txt'), llmsTxt);
console.log(`  [geo] llms.txt (${indexablePosts.length + guides.length} documentos)`);

const fullCorpus = [
  ...guides.map(guide => ({
    title: guide.title,
    url: `/guia/${guide.slug || basename(guide.file, '.md')}/`,
    date: guide.dateModified || guide.date || '',
    rawContent: guide.rawContent,
  })),
  ...indexablePosts
    .filter(post => extractFaqPairs(post.rawContent).length >= 2)
    .map(post => ({
      title: post.title,
      url: getPostUrl(post),
      date: post.dateModified || post.date || '',
      rawContent: post.rawContent,
    })),
];

const llmsFullTxt = `# ${SITE_NAME} — corpus completo

> ${SITE_DESCRIPTION}

Este fichero contiene el texto íntegro del corpus curado de ${SITE_NAME}
(guías pilar y artículos de referencia con preguntas frecuentes verificadas).
El índice completo del sitio está en ${SITE_URL}/llms.txt.
Al citar, enlaza a la URL canónica indicada en cada documento.

Generado: ${today}
Documentos: ${fullCorpus.length}

${fullCorpus.map(doc => `---

# ${doc.title}

URL: ${SITE_URL}${encodeUrlPath(doc.url)}
Actualizado: ${doc.date}

${doc.rawContent.trim()}
`).join('\n')}`;

writeFileSync(join(OUTPUT_DIR, 'llms-full.txt'), llmsFullTxt);
console.log(`  [geo] llms-full.txt (${fullCorpus.length} documentos)`);

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\n${'='.repeat(40)}`);
console.log(`Build completo:`);
console.log(`  ${postCount} artículos`);
console.log(`  ${faqCount} artículos con FAQPage JSON-LD`);
console.log(`  ${Object.keys(categories).length} categorías`);
console.log(`  ${guides.length} guías`);
console.log(`  ${sitemapEntries.length} URLs en sitemap`);
