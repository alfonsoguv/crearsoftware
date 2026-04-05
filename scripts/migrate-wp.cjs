#!/usr/bin/env node
/**
 * WordPress to Cloudflare Pages Migration Script
 * Parses WXR 1.2 XML export and generates:
 * - data/audit.csv
 * - blog-posts/*.md (Bucket A only)
 * - _redirects (Cloudflare Pages format)
 * - data/categories-map.json
 */

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const TurndownService = require('turndown');

// ─── Configuration ───────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');
const XML_FILE = path.join(ROOT, 'crearsoftware.WordPress.2026-03-29.xml');
const OUTPUT_CSV = path.join(ROOT, 'data', 'audit.csv');
const OUTPUT_REDIRECTS = path.join(ROOT, '_redirects');
const OUTPUT_CATEGORIES_MAP = path.join(ROOT, 'data', 'categories-map.json');
const OUTPUT_BLOG_DIR = path.join(ROOT, 'blog-posts');

// ─── Category Mapping ────────────────────────────────────────────────────────

const CATEGORY_KEYWORDS = {
  'inteligencia-artificial': [
    'inteligencia artificial', 'ia', 'ai', 'machine learning', 'deep learning',
    'llm', 'chatbot', 'gpt', 'openai', 'chatgpt', 'claude', 'neural',
    'nlp', 'procesamiento de lenguaje', 'redes neuronales', 'agentes',
    'copilot', 'gemini', 'artificial intelligence'
  ],
  'desarrollo-software': [
    'programación', 'programacion', 'desarrollo', 'software', 'código', 'codigo',
    'framework', 'api', 'javascript', 'python', 'java', 'php', 'html', 'css',
    'web', 'móvil', 'movil', 'app', 'devops', 'git', 'agile', 'scrum',
    'velneo', 'base de datos', 'database', 'sql', 'backend', 'frontend',
    'programming', 'coding', 'developer', 'development'
  ],
  'tecnologia-empresarial': [
    'empresa', 'empresarial', 'erp', 'crm', 'saas', 'cloud', 'nube',
    'negocio', 'gestión', 'gestion', 'factura', 'contabilidad', 'ventas',
    'b2b', 'b2c', 'enterprise', 'corporativo', 'pyme', 'comercio',
    'ecommerce', 'e-commerce', 'tienda online', 'microsoft', 'salesforce'
  ],
  'innovacion-digital': [
    'innovación', 'innovacion', 'digital', 'transformación', 'transformacion',
    'startup', 'emprendimiento', 'emprender', 'fintech', 'blockchain',
    'iot', 'internet de las cosas', 'tendencia', 'futuro', 'disruptivo',
    'tecnología', 'tecnologia', 'tech', 'smart', 'metaverso', 'web3'
  ],
  'productividad-herramientas': [
    'productividad', 'herramienta', 'workflow', 'automatización', 'automatizacion',
    'eficiencia', 'gestión del tiempo', 'gestion del tiempo', 'organización',
    'organizacion', 'notion', 'slack', 'trello', 'asana', 'zapier',
    'no-code', 'low-code', 'integración', 'integracion', 'plugin'
  ]
};

// ─── Turndown Setup ──────────────────────────────────────────────────────────

function createTurndownService() {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
  });

  // Handle WordPress [caption] shortcodes
  turndown.addRule('wpCaption', {
    filter: function (node) {
      // Match divs that contain caption shortcode remnants
      return node.nodeName === 'DIV' && node.className && node.className.includes('wp-caption');
    },
    replacement: function (content, node) {
      const img = node.querySelector('img');
      const caption = node.querySelector('.wp-caption-text');
      if (img) {
        const alt = img.getAttribute('alt') || '';
        const src = img.getAttribute('src') || '';
        const captionText = caption ? caption.textContent : alt;
        return `\n![${captionText}](${src})\n*${captionText}*\n\n`;
      }
      return content;
    }
  });

  // Handle iframes (YouTube, Vimeo embeds)
  turndown.addRule('iframe', {
    filter: 'iframe',
    replacement: function (content, node) {
      const src = node.getAttribute('src') || '';
      if (src.includes('youtube.com') || src.includes('youtu.be')) {
        const videoId = extractYouTubeId(src);
        return videoId
          ? `\n[Video de YouTube](https://www.youtube.com/watch?v=${videoId})\n\n`
          : `\n[Video](${src})\n\n`;
      }
      if (src.includes('vimeo.com')) {
        return `\n[Video de Vimeo](${src})\n\n`;
      }
      return `\n[Contenido embebido](${src})\n\n`;
    }
  });

  // Preserve code blocks
  turndown.addRule('preCode', {
    filter: function (node) {
      return node.nodeName === 'PRE' && node.querySelector('code');
    },
    replacement: function (content, node) {
      const code = node.querySelector('code');
      const lang = '';
      if (code.className) {
        const match = code.className.match(/language-(\w+)/);
        if (match) return `\n\`\`\`${match[1]}\n${code.textContent}\n\`\`\`\n\n`;
      }
      return `\n\`\`\`\n${code.textContent}\n\`\`\`\n\n`;
    }
  });

  return turndown;
}

function extractYouTubeId(url) {
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// ─── HTML Content Cleaning ───────────────────────────────────────────────────

function cleanWordPressContent(html) {
  if (!html) return '';

  let cleaned = html;

  // Strip Gutenberg block comments
  cleaned = cleaned.replace(/<!-- \/?wp:\S+(?:\s+\{[^}]*\})?\s*-->/g, '');

  // Handle [caption] shortcodes
  cleaned = cleaned.replace(
    /\[caption[^\]]*\](.*?)\[\/caption\]/gs,
    (match, inner) => {
      // Try to extract img and caption text
      const imgMatch = inner.match(/<img[^>]+>/);
      const captionMatch = inner.replace(/<img[^>]+>/, '').trim();
      if (imgMatch) {
        return `<figure>${imgMatch[0]}<figcaption>${captionMatch}</figcaption></figure>`;
      }
      return inner;
    }
  );

  // Handle YouTube/Vimeo embed shortcodes
  cleaned = cleaned.replace(
    /\[youtube\s+([^\]]+)\]/gi,
    '<a href="$1">Video de YouTube</a>'
  );
  cleaned = cleaned.replace(
    /\[vimeo\s+([^\]]+)\]/gi,
    '<a href="$1">Video de Vimeo</a>'
  );

  // Handle plain YouTube URLs on their own line (WordPress auto-embed)
  cleaned = cleaned.replace(
    /^(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+[^\s]*)$/gm,
    '<a href="$1">Video de YouTube</a>'
  );

  // Strip WordPress-specific classes from HTML elements
  cleaned = cleaned.replace(/\s+class="[^"]*wp-[^"]*"/g, '');
  cleaned = cleaned.replace(/\s+class=""/g, '');

  return cleaned.trim();
}

// ─── Utility Functions ───────────────────────────────────────────────────────

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(text) {
  const stripped = stripHtml(text);
  if (!stripped) return 0;
  return stripped.split(/\s+/).filter(w => w.length > 0).length;
}

function hasHeadings(html) {
  if (!html) return false;
  return /<h[23][^>]*>/i.test(html);
}

function hasImages(html) {
  if (!html) return false;
  return /<img\s/i.test(html);
}

function extractText(val) {
  if (val === undefined || val === null) return '';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    if (val.length === 0) return '';
    return extractText(val[0]);
  }
  if (typeof val === 'object') {
    if (val._) return val._;
    if (val['_']) return val['_'];
    return '';
  }
  return String(val);
}

function buildOldUrl(dateStr, slug) {
  if (!dateStr || !slug) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return `/${slug}/`;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `/${yyyy}/${mm}/${dd}/${slug}/`;
}

function calculateQualityScore(post) {
  let score = 0;
  if (post.wordCount >= 500) score++;
  if (post.wordCount >= 1000) score++;
  if (post.hasHeadings) score++;
  if (post.hasImages) score++;
  if (post.commentCount >= 3) score++;
  const year = new Date(post.date).getFullYear();
  const dateObj = new Date(post.date);
  if (dateObj >= new Date('2024-01-01')) score++;
  if (dateObj >= new Date('2023-01-01')) score++;
  return score;
}

function classifyBucket(score, dateStr) {
  const dateObj = new Date(dateStr);
  if (score >= 5 || dateObj >= new Date('2024-01-01')) return 'A';
  if (score >= 3) return 'B';
  return 'C';
}

function mapCategory(categories, tags, title, content) {
  // Combine all text for matching
  const allText = [
    ...categories,
    ...tags,
    title || '',
    // Only use first 500 chars of content for performance
    (content || '').substring(0, 500)
  ].join(' ').toLowerCase();

  let bestCategory = 'innovacion-digital'; // default when no keywords match
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (keywordMatches(allText, kw)) score++;
    }
    // Only override default if we actually found matching keywords (score > 0)
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

/**
 * Check if keyword matches as a whole word (not as substring of another word).
 * Short keywords (<=3 chars) use word boundary matching to avoid false positives.
 */
function keywordMatches(text, keyword) {
  if (keyword.length <= 3) {
    // Use word boundary regex for short keywords like "ia", "ai", "erp"
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(text);
  }
  return text.includes(keyword);
}

function escapeCSV(val) {
  const str = String(val || '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function escapeFrontmatterTitle(title) {
  // Escape quotes in YAML frontmatter
  return title.replace(/"/g, '\\"');
}

function sanitizeFilename(slug) {
  return slug
    .replace(/%[0-9a-fA-F]{2}/g, '') // Remove URL-encoded chars
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Reading XML file...');
  const xmlContent = fs.readFileSync(XML_FILE, 'utf-8');
  console.log(`XML file size: ${(xmlContent.length / 1024 / 1024).toFixed(1)}MB`);

  console.log('Parsing XML (this may take a moment for 16MB)...');
  const parser = new xml2js.Parser({
    explicitArray: true,
    explicitCharkey: true,
    trim: true,
    // Handle namespaces
    tagNameProcessors: [xml2js.processors.stripPrefix],
  });

  let result;
  try {
    result = await parser.parseStringPromise(xmlContent);
  } catch (err) {
    console.error('Failed to parse XML:', err.message);
    process.exit(1);
  }

  const channel = result.rss.channel[0];
  const items = channel.item || [];
  console.log(`Total items in XML: ${items.length}`);

  // ─── Extract Published Posts ─────────────────────────────────────────────

  const posts = [];
  let skippedNotPost = 0;
  let skippedNotPublish = 0;

  for (const item of items) {
    const postType = extractText(item.post_type);
    const status = extractText(item.status);

    if (postType !== 'post') {
      skippedNotPost++;
      continue;
    }
    if (status !== 'publish') {
      skippedNotPublish++;
      continue;
    }

    const title = extractText(item.title);
    const slug = decodeURIComponent(extractText(item.post_name));
    const postDate = extractText(item.post_date);
    const contentEncoded = extractText(item.encoded);

    // Extract categories and tags
    const categories = [];
    const tags = [];
    if (item.category) {
      for (const cat of item.category) {
        const domain = cat.$ && cat.$.domain;
        const name = extractText(cat);
        if (domain === 'category' && name) categories.push(name);
        if (domain === 'post_tag' && name) tags.push(name);
      }
    }

    // Count comments
    let commentCount = 0;
    if (item.comment) {
      // Only count approved comments
      for (const comment of item.comment) {
        const approved = extractText(comment.comment_approved);
        if (approved === '1') commentCount++;
      }
    }

    // Word count
    const wordCount = countWords(contentEncoded);

    // Build old URL from link or from date + slug
    let oldUrl = '';
    const link = extractText(item.link);
    if (link && link.includes('crearsoftware.com/') && !link.includes('?p=')) {
      try {
        const urlObj = new URL(link);
        oldUrl = urlObj.pathname;
        // Ensure trailing slash
        if (!oldUrl.endsWith('/')) oldUrl += '/';
      } catch {
        oldUrl = buildOldUrl(postDate, slug);
      }
    } else {
      oldUrl = buildOldUrl(postDate, slug);
    }

    // Format date as YYYY-MM-DD
    let dateFormatted = '';
    if (postDate) {
      const d = new Date(postDate.replace(' ', 'T'));
      if (!isNaN(d.getTime())) {
        dateFormatted = d.toISOString().split('T')[0];
      }
    }

    const post = {
      title,
      slug,
      date: dateFormatted,
      oldUrl,
      content: contentEncoded,
      categories,
      tags,
      commentCount,
      wordCount,
      hasHeadings: hasHeadings(contentEncoded),
      hasImages: hasImages(contentEncoded),
    };

    post.qualityScore = calculateQualityScore(post);
    post.bucket = classifyBucket(post.qualityScore, post.date);
    post.newCategory = mapCategory(categories, tags, title, contentEncoded);

    posts.push(post);
  }

  console.log(`\nExtracted ${posts.length} published posts`);
  console.log(`Skipped: ${skippedNotPost} non-post items, ${skippedNotPublish} non-publish posts`);

  // ─── Sort by date ────────────────────────────────────────────────────────

  posts.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  // ─── Generate audit.csv ──────────────────────────────────────────────────

  console.log('\nGenerating data/audit.csv...');
  const csvHeader = 'title,slug,date,old_url,bucket,quality_score,word_count,comment_count,categories,tags';
  const csvLines = [csvHeader];

  for (const p of posts) {
    csvLines.push([
      escapeCSV(p.title),
      escapeCSV(p.slug),
      escapeCSV(p.date),
      escapeCSV(p.oldUrl),
      escapeCSV(p.bucket),
      escapeCSV(p.qualityScore),
      escapeCSV(p.wordCount),
      escapeCSV(p.commentCount),
      escapeCSV(p.categories.join('; ')),
      escapeCSV(p.tags.join('; ')),
    ].join(','));
  }

  fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
  fs.writeFileSync(OUTPUT_CSV, csvLines.join('\n'), 'utf-8');
  console.log(`  Written ${csvLines.length - 1} rows to audit.csv`);

  // ─── Generate blog-posts/*.md (Bucket A only) ───────────────────────────

  console.log('\nGenerating blog-posts/*.md for ALL posts...');
  fs.mkdirSync(OUTPUT_BLOG_DIR, { recursive: true });

  const turndown = createTurndownService();
  let mdCount = 0;

  for (const p of posts) {

    const cleanedHtml = cleanWordPressContent(p.content);
    let markdown = '';
    try {
      markdown = turndown.turndown(cleanedHtml || '<p></p>');
    } catch (err) {
      console.warn(`  Warning: Turndown failed for "${p.title}": ${err.message}`);
      markdown = stripHtml(cleanedHtml);
    }

    // Build frontmatter
    const frontmatter = [
      '---',
      `title: "${escapeFrontmatterTitle(p.title)}"`,
      `slug: "${p.slug}"`,
      `date: "${p.date}"`,
      `oldUrl: "${p.oldUrl}"`,
      `description: ""`,
      `category: "${p.newCategory}"`,
      `tags: [${p.tags.map(t => `"${t.replace(/"/g, '\\"')}"`).join(', ')}]`,
      `author: "Alfonso Gutiérrez"`,
      `commentCount: ${p.commentCount}`,
      `wordCount: ${p.wordCount}`,
      `image: ""`,
      '---',
    ].join('\n');

    const fileContent = `${frontmatter}\n\n${markdown}\n`;
    const filename = sanitizeFilename(p.slug || p.date) || `post-${mdCount}`;
    const filepath = path.join(OUTPUT_BLOG_DIR, `${filename}.md`);

    fs.writeFileSync(filepath, fileContent, 'utf-8');
    mdCount++;
  }

  console.log(`  Generated ${mdCount} markdown files`);

  // ─── Generate _redirects ────────────────────────────────────────────────

  console.log('\nGenerating _redirects...');
  const redirectLines = [
    '# Cloudflare Pages Redirects',
    '# Generated by migrate-wp.js',
    '#',
    '# Bucket B & C post redirects',
  ];

  let redirectCount = 0;

  // All posts are now migrated - no post redirects needed
  // Only structural redirects below

  // WordPress structural redirects
  redirectLines.push('');
  redirectLines.push('# WordPress category URLs');
  redirectLines.push('/category/* /categoria/software-empresarial/ 301');

  redirectLines.push('');
  redirectLines.push('# WordPress tag URLs');
  redirectLines.push('/tag/* /blog/ 301');

  redirectLines.push('');
  redirectLines.push('# WordPress author/page URLs');
  redirectLines.push('/author/* / 301');
  redirectLines.push('/page/* / 301');

  redirectLines.push('');
  redirectLines.push('# Feed URLs');
  redirectLines.push('/feed/ / 301');
  redirectLines.push('/comments/feed/ / 301');
  redirectLines.push('/*/feed/ / 301');

  // Count structural redirects
  const structuralRedirects = 7; // category, tag, author, page, feed x3
  redirectCount += structuralRedirects;

  fs.writeFileSync(OUTPUT_REDIRECTS, redirectLines.join('\n') + '\n', 'utf-8');
  console.log(`  Generated ${redirectCount} redirects (${redirectCount - structuralRedirects} post redirects + ${structuralRedirects} structural)`);

  // ─── Generate categories-map.json ────────────────────────────────────────

  console.log('\nGenerating data/categories-map.json...');

  // Collect all WordPress categories
  const wpCategorySet = new Set();
  for (const p of posts) {
    for (const cat of p.categories) {
      wpCategorySet.add(cat);
    }
  }

  // Build mapping: each WP category -> new category
  const categoriesMap = {};
  for (const wpCat of [...wpCategorySet].sort()) {
    categoriesMap[wpCat] = mapCategory([wpCat], [], '', '');
  }

  // Also include the target categories definition
  const outputMap = {
    targetCategories: {
      'inteligencia-artificial': {
        name: 'Inteligencia Artificial',
        description: 'AI, machine learning, LLMs, chatbots',
      },
      'desarrollo-software': {
        name: 'Desarrollo de Software',
        description: 'Programming, coding, development, frameworks',
      },
      'tecnologia-empresarial': {
        name: 'Tecnología Empresarial',
        description: 'Enterprise tech, SaaS, ERP, CRM',
      },
      'innovacion-digital': {
        name: 'Innovación Digital',
        description: 'Digital transformation, startups, trends',
      },
      'productividad-herramientas': {
        name: 'Productividad y Herramientas',
        description: 'Tools, productivity, workflows',
      },
    },
    wordpressCategoryMapping: categoriesMap,
  };

  fs.writeFileSync(OUTPUT_CATEGORIES_MAP, JSON.stringify(outputMap, null, 2), 'utf-8');
  console.log(`  Mapped ${Object.keys(categoriesMap).length} WordPress categories to 5 new categories`);

  // ─── Summary Statistics ──────────────────────────────────────────────────

  const bucketA = posts.filter(p => p.bucket === 'A');
  const bucketB = posts.filter(p => p.bucket === 'B');
  const bucketC = posts.filter(p => p.bucket === 'C');

  // Word count distribution
  const wcBuckets = {
    '0-99': 0,
    '100-299': 0,
    '300-499': 0,
    '500-999': 0,
    '1000-1999': 0,
    '2000+': 0,
  };
  for (const p of posts) {
    if (p.wordCount < 100) wcBuckets['0-99']++;
    else if (p.wordCount < 300) wcBuckets['100-299']++;
    else if (p.wordCount < 500) wcBuckets['300-499']++;
    else if (p.wordCount < 1000) wcBuckets['500-999']++;
    else if (p.wordCount < 2000) wcBuckets['1000-1999']++;
    else wcBuckets['2000+']++;
  }

  // Top 10 categories
  const catCounts = {};
  for (const p of posts) {
    for (const cat of p.categories) {
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    }
  }
  const topCategories = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Date range
  const dates = posts.filter(p => p.date).map(p => p.date).sort();
  const dateRange = dates.length
    ? `${dates[0]} to ${dates[dates.length - 1]}`
    : 'N/A';

  // New category distribution
  const newCatCounts = {};
  for (const p of posts) {
    newCatCounts[p.newCategory] = (newCatCounts[p.newCategory] || 0) + 1;
  }

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('                    MIGRATION SUMMARY');
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`  Total published posts found:  ${posts.length}`);
  console.log(`  Date range:                   ${dateRange}`);
  console.log('');
  console.log('  BUCKET CLASSIFICATION:');
  console.log(`    A (migrate to MD):          ${bucketA.length} posts`);
  console.log(`    B (redirect to home):       ${bucketB.length} posts`);
  console.log(`    C (redirect to home):       ${bucketC.length} posts`);
  console.log('');
  console.log('  TOTAL REDIRECTS:              ' + redirectCount);
  console.log('');
  console.log('  WORD COUNT DISTRIBUTION:');
  for (const [range, count] of Object.entries(wcBuckets)) {
    const bar = '█'.repeat(Math.ceil(count / 10));
    console.log(`    ${range.padEnd(12)} ${String(count).padStart(4)} ${bar}`);
  }
  console.log('');
  console.log('  TOP 10 WORDPRESS CATEGORIES:');
  for (const [cat, count] of topCategories) {
    console.log(`    ${cat.padEnd(35)} ${count}`);
  }
  console.log('');
  console.log('  NEW CATEGORY DISTRIBUTION:');
  for (const [cat, count] of Object.entries(newCatCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${cat.padEnd(35)} ${count}`);
  }
  console.log('');
  console.log('  OUTPUT FILES:');
  console.log(`    data/audit.csv              ${csvLines.length - 1} rows`);
  console.log(`    blog-posts/*.md             ${mdCount} files`);
  console.log(`    _redirects                  ${redirectCount} rules`);
  console.log(`    data/categories-map.json    ${Object.keys(categoriesMap).length} mappings`);
  console.log('════════════════════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
