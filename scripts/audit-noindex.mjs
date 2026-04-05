import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'blog-posts');
const OUTPUT_JSON = path.join(ROOT, 'data', 'noindex-review.json');
const OUTPUT_MD = path.join(ROOT, 'data', 'noindex-review.md');

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: source };
  }

  const frontmatter = {};
  for (const line of match[1].split('\n')) {
    const index = line.indexOf(':');
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const rawValue = line.slice(index + 1).trim();
    let value = rawValue;
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value === 'true' || value === 'false') {
      value = value === 'true';
    } else if (/^\d+$/.test(value)) {
      value = Number(value);
    }
    frontmatter[key] = value;
  }

  return { frontmatter, body: match[2] };
}

function bodyWordCount(markdown) {
  const normalized = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, ' $1 ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, ' $1 ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[*_>#~\-]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return 0;
  return normalized.split(' ').filter(Boolean).length;
}

function classifyPost(post) {
  if (post.actualWordCount >= 160) return 'candidate_index';
  if (post.actualWordCount >= 80 || post.commentCount >= 5) return 'review';
  return 'keep_noindex';
}

function toMarkdownTable(rows) {
  if (!rows.length) return '_Ninguno._';
  const header = '| Post | Fecha | Palabras reales | Comentarios | Categoria |';
  const divider = '| --- | --- | ---: | ---: | --- |';
  const lines = rows.map((row) => {
    return `| ${row.title} | ${row.date} | ${row.actualWordCount} | ${row.commentCount} | ${row.category} |`;
  });
  return [header, divider, ...lines].join('\n');
}

async function main() {
  const filenames = (await readdir(POSTS_DIR)).filter((name) => name.endsWith('.md'));
  const noindexPosts = [];

  for (const filename of filenames) {
    const fullPath = path.join(POSTS_DIR, filename);
    const source = await readFile(fullPath, 'utf8');
    const { frontmatter, body } = parseFrontmatter(source);
    if (frontmatter.noindex !== true) continue;

    const post = {
      file: path.relative(ROOT, fullPath),
      title: String(frontmatter.title || filename),
      date: String(frontmatter.date || ''),
      slug: String(frontmatter.slug || ''),
      category: String(frontmatter.category || ''),
      commentCount: Number(frontmatter.commentCount || 0),
      frontmatterWordCount: Number(frontmatter.wordCount || 0),
      actualWordCount: bodyWordCount(body),
    };
    post.classification = classifyPost(post);
    noindexPosts.push(post);
  }

  noindexPosts.sort((a, b) => {
    if (a.classification !== b.classification) {
      const order = ['candidate_index', 'review', 'keep_noindex'];
      return order.indexOf(a.classification) - order.indexOf(b.classification);
    }
    return b.actualWordCount - a.actualWordCount;
  });

  const summary = {
    generatedAt: new Date().toISOString(),
    totalNoindex: noindexPosts.length,
    candidateIndex: noindexPosts.filter((post) => post.classification === 'candidate_index'),
    review: noindexPosts.filter((post) => post.classification === 'review'),
    keepNoindex: noindexPosts.filter((post) => post.classification === 'keep_noindex'),
  };

  const markdown = [
    '# Revision de noindex',
    '',
    `Generado: ${summary.generatedAt}`,
    '',
    `- Total de posts con noindex: ${summary.totalNoindex}`,
    `- Candidatos claros a indexar: ${summary.candidateIndex.length}`,
    `- Revisar manualmente: ${summary.review.length}`,
    `- Mantener en noindex: ${summary.keepNoindex.length}`,
    '',
    '## Candidatos claros a indexar',
    '',
    toMarkdownTable(summary.candidateIndex),
    '',
    '## Revisar manualmente',
    '',
    toMarkdownTable(summary.review),
    '',
    '## Mantener en noindex',
    '',
    `Posts con menos de 80 palabras reales y sin senales claras de engagement: ${summary.keepNoindex.length}.`,
  ].join('\n');

  await mkdir(path.dirname(OUTPUT_JSON), { recursive: true });
  await writeFile(OUTPUT_JSON, JSON.stringify(summary, null, 2) + '\n', 'utf8');
  await writeFile(OUTPUT_MD, markdown + '\n', 'utf8');

  console.log(`Written ${path.relative(ROOT, OUTPUT_JSON)}`);
  console.log(`Written ${path.relative(ROOT, OUTPUT_MD)}`);
  console.log(`Total noindex: ${summary.totalNoindex}`);
  console.log(`Candidates: ${summary.candidateIndex.length}`);
  console.log(`Review: ${summary.review.length}`);
  console.log(`Keep: ${summary.keepNoindex.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
