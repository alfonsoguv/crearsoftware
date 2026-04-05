#!/usr/bin/env node
/**
 * SEO Batch Processor for crearsoftware.com blog posts
 * Processes files from "grupo-visual" through "modelos-de-voz" alphabetically
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'blog-posts');

const CATEGORIES = [
  'inteligencia-artificial',
  'desarrollo-software',
  'tecnologia-empresarial',
  'innovacion-digital',
  'productividad-herramientas'
];

// Category keyword mapping - using word-boundary-safe terms
const CATEGORY_KEYWORDS = {
  'inteligencia-artificial': [
    'inteligencia artificial', 'machine learning', 'deep learning', 'chatgpt',
    'openai', 'llm', 'modelo de lenguaje', 'red neuronal', 'redes neuronales',
    'agente ia', 'agentes ia', 'voz a voz', 'generativa', 'prompt',
    'gemini', 'claude', 'copilot', 'protocolo de contexto',
    'speech-to-speech', 'conversacional', 'transformer'
  ],
  'desarrollo-software': [
    'programador', 'programadores', 'software', 'desarrollo de software',
    'velneo', 'programación', 'java', 'oracle', 'base de datos',
    'sql', 'framework', 'open source', 'software libre', 'kernel',
    'saas', 'paas', 'lenguaje de programación', 'código fuente'
  ],
  'tecnologia-empresarial': [
    'empresa tecnológica', 'empresarial', 'crm', 'erp', 'gestión empresarial',
    'recursos humanos', 'rrhh', 'liderazgo', 'telemarketing', 'venta de software',
    'marketing', 'competitividad', 'estrategia empresarial',
    'inbound marketing', 'directivo', 'gerente'
  ],
  'innovacion-digital': [
    'innovación', 'tendencia', 'tendencias', 'transformación digital',
    'gadget', 'app store', 'silicon valley', 'videoconferencia',
    'web 2.0', 'disruptivo'
  ],
  'productividad-herramientas': [
    'productividad', 'rescuetime', 'gestión del tiempo',
    'experiencia de usuario', 'usabilidad', 'presentaciones'
  ]
};

const TAG_NORMALIZE = {
  'bill gates': 'bill gates',
  'steve jobs': 'steve jobs',
  'larry ellison': 'larry ellison',
  'inteligencia artificial': 'inteligencia artificial',
  'ia': 'inteligencia artificial',
  'ai': 'inteligencia artificial',
  'machine learning': 'machine learning',
  'deep learning': 'deep learning',
  'software libre': 'software libre',
  'open source': 'software libre',
  'desarrollo software': 'desarrollo de software',
  'programación': 'programacion',
  'programacion': 'programacion',
  'innovación': 'innovacion',
  'innovacion': 'innovacion',
  'liderazgo': 'liderazgo',
  'gestión': 'gestion',
  'gestion': 'gestion',
  'marketing': 'marketing',
  'seo': 'seo',
  'rrhh': 'recursos humanos',
  'recursos humanos': 'recursos humanos',
  'productividad': 'productividad',
  'emprendimiento': 'emprendimiento',
  'startup': 'startup',
  'startups': 'startup',
  'china': 'china',
  'india': 'india',
  'irlanda': 'irlanda',
  'microsoft': 'microsoft',
  'google': 'google',
  'apple': 'apple',
  'oracle': 'oracle',
  'velneo': 'velneo',
  'linux': 'linux',
  'java': 'java',
  'saas': 'saas',
  'crm': 'crm',
  'blog': 'blog',
  'web 2.0': 'web 2.0',
  'mac': 'mac',
  'diseño': 'diseno',
  'sencillo': 'diseno',
  'sencillez': 'diseno',
  'ellison': 'oracle',
  'gestion de tiempo': 'productividad',
  'rescuetime': 'productividad',
  'mente': 'desarrollo personal',
  'poder de la mente': 'desarrollo personal',
  'winston churchill': 'liderazgo',
};

// Use word-boundary safe matching for tags
function matchesKeyword(text, keyword) {
  // For multi-word keywords, use includes
  if (keyword.includes(' ') || keyword.includes('-')) {
    return text.includes(keyword);
  }
  // For single words, use word boundary regex
  try {
    const regex = new RegExp('(?:^|[\\s,;:.!?()\\[\\]"\'/])' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:$|[\\s,;:.!?()\\[\\]"\'/])', 'i');
    return regex.test(text);
  } catch {
    return text.includes(keyword);
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const fmText = match[1];
  const body = match[2];
  const fm = {};

  const lines = fmText.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.substring(0, colonIdx).trim();
    let value = line.substring(colonIdx + 1).trim();

    if (value.startsWith('[')) {
      let arrayStr = value;
      while (!arrayStr.includes(']') && i + 1 < lines.length) {
        i++;
        arrayStr += lines[i];
      }
      try {
        fm[key] = JSON.parse(arrayStr);
      } catch {
        fm[key] = [];
      }
    } else if (value.startsWith('"') && value.endsWith('"')) {
      fm[key] = value.slice(1, -1);
    } else if (value === 'true') {
      fm[key] = true;
    } else if (value === 'false') {
      fm[key] = false;
    } else if (!isNaN(Number(value)) && value !== '') {
      fm[key] = Number(value);
    } else {
      fm[key] = value;
    }
  }

  return { frontmatter: fm, body };
}

function serializeFrontmatter(fm) {
  const lines = ['---'];
  const order = ['title', 'slug', 'date', 'oldUrl', 'description', 'category', 'tags', 'readingTime', 'author', 'commentCount', 'wordCount', 'image'];

  for (const key of order) {
    if (!(key in fm)) continue;
    const val = fm[key];
    if (Array.isArray(val)) {
      if (val.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}: [${val.map(v => `"${v}"`).join(', ')}]`);
      }
    } else if (typeof val === 'string') {
      lines.push(`${key}: "${val}"`);
    } else if (typeof val === 'number') {
      lines.push(`${key}: ${val}`);
    } else if (typeof val === 'boolean') {
      lines.push(`${key}: ${val}`);
    }
  }

  for (const key of Object.keys(fm)) {
    if (order.includes(key)) continue;
    const val = fm[key];
    if (Array.isArray(val)) {
      if (val.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}: [${val.map(v => `"${v}"`).join(', ')}]`);
      }
    } else if (typeof val === 'string') {
      lines.push(`${key}: "${val}"`);
    } else if (typeof val === 'number') {
      lines.push(`${key}: ${val}`);
    }
  }

  lines.push('---');
  return lines.join('\n');
}

function classifyCategory(title, body, existingCategory) {
  const text = (title + ' ' + body).toLowerCase();

  const scores = {};
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[cat] = 0;
    for (const kw of keywords) {
      if (matchesKeyword(text, kw)) {
        // Multi-word keywords are more specific, give them higher weight
        const weight = kw.includes(' ') ? 3 : 1;
        scores[cat] += weight;
      }
    }
  }

  let maxScore = 0;
  let bestCat = existingCategory || 'desarrollo-software';
  for (const [cat, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCat = cat;
    }
  }

  // If existing is already valid and has a reasonable score, keep it
  if (CATEGORIES.includes(existingCategory) && existingCategory !== 'desarrollo-software') {
    // Keep existing non-default category if it has at least 40% of max score
    if (scores[existingCategory] >= maxScore * 0.4) {
      return existingCategory;
    }
  }

  // If existing is valid and score difference is small, keep it
  if (CATEGORIES.includes(existingCategory) && scores[existingCategory] >= maxScore * 0.7) {
    return existingCategory;
  }

  return bestCat;
}

function generateTags(title, body, existingTags) {
  const titleLower = (title || '').toLowerCase();
  const text = (titleLower + ' ' + body).toLowerCase();
  const tagCandidates = new Map();

  // Tags detected from TITLE get high priority (3 points)
  // Tags from body with multiple keyword matches get 2 points each
  // Tags from body with single match get 1 point

  // tag => { titleKeywords: [], bodyKeywords: [], minMatches: 1 }
  const topicTags = {
    'inteligencia artificial': {
      keywords: ['inteligencia artificial', 'machine learning', 'deep learning',
        'chatgpt', 'openai', 'llm', 'agentes ia', 'prompt engineering',
        'ia generativa', 'modelo de lenguaje', 'redes neuronales'],
      minMatches: 1
    },
    'velneo': {
      keywords: ['velneo'],
      minMatches: 1
    },
    'liderazgo': {
      keywords: ['liderazgo'],
      minMatches: 1
    },
    'innovacion': {
      keywords: ['innovación', 'innovacion', 'innovar'],
      titleOnly: true // Only tag if in title, too generic otherwise
    },
    'emprendimiento': {
      keywords: ['emprendimiento', 'emprendedor', 'emprender'],
      minMatches: 1
    },
    'productividad': {
      keywords: ['productividad', 'rescuetime', 'gestión del tiempo'],
      minMatches: 1
    },
    'marketing': {
      keywords: ['marketing', 'inbound marketing', 'telemarketing'],
      minMatches: 1
    },
    'recursos humanos': {
      keywords: ['rrhh', 'recursos humanos', 'clima laboral', 'mejor empresa para trabajar'],
      minMatches: 1
    },
    'software libre': {
      keywords: ['software libre', 'open source', 'floss'],
      minMatches: 1
    },
    'microsoft': {
      keywords: ['microsoft'],
      titleOnly: true // Only if title mentions it
    },
    'google': {
      keywords: ['google'],
      titleOnly: true
    },
    'apple': {
      keywords: ['steve jobs', 'apple'],
      titleOnly: true
    },
    'oracle': {
      keywords: ['oracle', 'larry ellison'],
      minMatches: 1
    },
    'china': {
      keywords: ['china', 'shangai', 'shanghai', 'shenzhen', 'hong kong'],
      minMatches: 1
    },
    'programacion': {
      keywords: ['programador', 'programadores', 'programación', 'lenguaje de programación'],
      titleOnly: true
    },
    'crm': {
      keywords: ['crm'],
      minMatches: 1
    },
    'saas': {
      keywords: ['saas', 'software as a service'],
      minMatches: 1
    },
    'competitividad': {
      keywords: ['competitividad'],
      titleOnly: true
    },
    'experiencia de usuario': {
      keywords: ['experiencia de usuario', 'usabilidad', 'ux'],
      minMatches: 1
    },
    'java': {
      keywords: ['java', 'jvm'],
      titleOnly: true
    },
    'linux': {
      keywords: ['linux', 'torvalds'],
      minMatches: 1
    },
    'crisis economica': {
      keywords: ['crisis económica', 'crisis financiera', 'recesión'],
      minMatches: 1
    },
    'irlanda': {
      keywords: ['irlanda', 'ireland', 'limerick', 'cork'],
      minMatches: 1
    },
    'india': {
      keywords: ['india'],
      titleOnly: true
    },
    'redes sociales': {
      keywords: ['redes sociales', 'social media'],
      minMatches: 1
    },
    'ia de voz': {
      keywords: ['voz a voz', 's2s', 'speech-to-speech'],
      minMatches: 1
    },
    'mcp': {
      keywords: ['mcp', 'protocolo de contexto', 'model context protocol'],
      minMatches: 1
    },
    'video ia': {
      keywords: ['veo 2', 'generación de video'],
      minMatches: 1
    },
  };

  for (const [tag, config] of Object.entries(topicTags)) {
    let score = 0;
    const { keywords, minMatches, titleOnly } = config;

    // Check title matches (high priority)
    let titleMatch = false;
    for (const kw of keywords) {
      if (titleLower.includes(kw)) {
        titleMatch = true;
        score += 3;
        break;
      }
    }

    // Check body matches
    if (!titleOnly || titleMatch) {
      let bodyMatches = 0;
      for (const kw of keywords) {
        if (matchesKeyword(text, kw)) {
          bodyMatches++;
        }
      }
      if (bodyMatches > 0) {
        score += bodyMatches;
      }

      // For titleOnly tags, only include if actually in title
      if (titleOnly && !titleMatch) {
        score = 0;
      }

      // For non-titleOnly tags, require minimum matches
      if (!titleOnly && !titleMatch && bodyMatches < (minMatches || 1)) {
        score = 0;
      }
    }

    if (score > 0) {
      tagCandidates.set(tag, score);
    }
  }

  // Sort by score and take top 5
  const sorted = [...tagCandidates.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 5).map(([tag]) => tag);
}

function generateDescription(title, body, slug) {
  const lines = body.split('\n').filter(l => {
    const trimmed = l.trim();
    return trimmed.length > 30
      && !trimmed.startsWith('#')
      && !trimmed.startsWith('![')
      && !trimmed.startsWith('[')
      && !trimmed.startsWith('---')
      && !trimmed.startsWith('***')
      && !trimmed.startsWith('> ')
      && !trimmed.startsWith('<!-- ')
      && !trimmed.match(/^\[.*\]\(.*\)$/)
      && !trimmed.match(/^-\s/)
      && !trimmed.match(/^\d+\.\s/)
      && !trimmed.match(/^Post declinado/i);
  });

  let baseText = '';
  if (lines.length > 0) {
    baseText = lines[0]
      .replace(/\*\*\*/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      .replace(/`[^`]+`/g, '')
      .replace(/\\\[.*?\\\]/g, '')
      .replace(/\{[^}]*\}/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  if (!baseText || baseText.length < 20) {
    baseText = title;
  }

  // Truncate to ~150-155 chars at word boundary
  if (baseText.length > 155) {
    let truncated = baseText.substring(0, 152);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 100) {
      truncated = truncated.substring(0, lastSpace);
    }
    truncated = truncated.replace(/[,;:\s]+$/, '');
    baseText = truncated + '...';
  }

  // Very short: build from title
  if (baseText.length < 50 && title.length > 10) {
    const cleanTitle = title.replace(/"/g, '');
    if (cleanTitle.length <= 100) {
      baseText = `Descubre todo sobre ${cleanTitle.toLowerCase()}. Reflexiones y analisis en el blog CrearSoftware.`;
    }
  }

  baseText = baseText.replace(/"/g, '\\"');
  return baseText;
}

function cleanBody(body) {
  let cleaned = body;

  // Remove broken WordPress image refs (keep alt text as comment)
  cleaned = cleaned.replace(/\[\!\[([^\]]*)\]\(http:\/\/crearsoftware\.com\/[^)]+\)\]\(http:\/\/crearsoftware\.com\/[^)]+\)/g, (match, alt) => {
    return alt ? `<!-- Imagen: ${alt} -->` : '';
  });
  cleaned = cleaned.replace(/!\[([^\]]*)\]\(http:\/\/crearsoftware\.com\/wp-content\/uploads\/[^)]+\)/g, (match, alt) => {
    return alt ? `<!-- Imagen: ${alt} -->` : '';
  });
  cleaned = cleaned.replace(/!\[([^\]]*)\]\(http:\/\/crearsoftware\.com\/files\/[^)]+\)/g, (match, alt) => {
    return alt ? `<!-- Imagen: ${alt} -->` : '';
  });

  // Remove WordPress shortcodes
  cleaned = cleaned.replace(/\[googlevideo=[^\]]*\]/g, '<!-- Video eliminado -->');
  cleaned = cleaned.replace(/\[youtube=[^\]]*\]/g, '<!-- Video eliminado -->');
  cleaned = cleaned.replace(/\[caption[^\]]*\](.*?)\[\/caption\]/gs, '$1');
  cleaned = cleaned.replace(/\[\/?embed[^\]]*\]/g, '');

  // Fix multiple blank lines (max 2)
  cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n');

  // Fix trailing whitespace on lines
  cleaned = cleaned.replace(/ +$/gm, '');

  return cleaned;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    console.log(`  SKIP (no frontmatter): ${path.basename(filePath)}`);
    return false;
  }

  const { frontmatter: fm, body } = parsed;
  let changed = false;

  // 1. Always regenerate description from content
  const newDescription = generateDescription(fm.title || '', body, fm.slug || '');
  if (newDescription !== fm.description) {
    fm.description = newDescription;
    changed = true;
  }

  // 2. Classify category
  const newCategory = classifyCategory(fm.title || '', body, fm.category);
  if (newCategory !== fm.category) {
    fm.category = newCategory;
    changed = true;
  }

  // 3. Always regenerate tags from content (ignore existing, since they may be from buggy first run)
  const newTags = generateTags(fm.title || '', body, []);
  if (JSON.stringify(newTags) !== JSON.stringify(fm.tags)) {
    fm.tags = newTags;
    changed = true;
  }

  // 4. Calculate readingTime
  const wordCount = typeof fm.wordCount === 'string' ? parseInt(fm.wordCount, 10) : (fm.wordCount || 0);
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  if (fm.readingTime !== readingTime) {
    fm.readingTime = readingTime;
    changed = true;
  }

  // 5. Clean body content
  const cleanedBody = cleanBody(body);
  const bodyChanged = cleanedBody !== body;

  if (changed || bodyChanged) {
    const newContent = serializeFrontmatter(fm) + '\n' + cleanedBody;
    fs.writeFileSync(filePath, newContent, 'utf-8');
    return true;
  }

  return false;
}

// Main
function main() {
  const batchFile = '/tmp/batch_files.txt';
  if (!fs.existsSync(batchFile)) {
    console.error('Batch file list not found at /tmp/batch_files.txt');
    process.exit(1);
  }

  const files = fs.readFileSync(batchFile, 'utf-8').trim().split('\n');
  console.log(`Processing ${files.length} files...\n`);

  let processed = 0;
  let modified = 0;
  let errors = 0;

  for (const file of files) {
    const filePath = file.trim();
    if (!filePath) continue;

    try {
      const wasModified = processFile(filePath);
      processed++;
      if (wasModified) {
        modified++;
        console.log(`  UPDATED: ${path.basename(filePath)}`);
      } else {
        console.log(`  OK (no changes): ${path.basename(filePath)}`);
      }
    } catch (err) {
      errors++;
      console.error(`  ERROR: ${path.basename(filePath)} - ${err.message}`);
    }
  }

  console.log(`\nDone! Processed: ${processed}, Modified: ${modified}, Errors: ${errors}`);
}

main();
