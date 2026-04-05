#!/usr/bin/env node
/**
 * Second-pass: Add H2 headings to posts >300 words with no headings.
 * Creates short, descriptive headings without duplicating paragraph content.
 */

const fs = require('fs');
const path = require('path');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  return { raw: match[1], body: match[2] };
}

function getWordCount(fm) {
  const m = fm.match(/wordCount:\s*(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function hasHeadings(body) {
  return /^##\s/m.test(body);
}

function countWords(text) {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

function cleanText(text) {
  return text
    .replace(/\*\*\*/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/<!--[^>]*-->/g, '')
    .replace(/\[!\]\([^)]+\)/g, '')
    .trim();
}

/**
 * Extract a short heading (3-8 words) that captures the topic of a paragraph.
 */
function extractHeading(paragraphText) {
  const clean = cleanText(paragraphText);
  if (clean.length < 30) return null;

  // Get first sentence
  const sentences = clean.split(/(?<=[.!?])\s+/);
  const firstSentence = sentences[0] || '';

  // Extract key noun phrases by looking for patterns
  const words = firstSentence.split(/\s+/);

  // Strategy: take the first 4-7 meaningful words, avoiding articles and connectors at the end
  const stopWordsEnd = ['y', 'o', 'de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'en', 'que', 'por', 'con', 'su', 'sus', 'al', 'se', 'es', 'no'];

  let headingWords = words.slice(0, 7);

  // Remove trailing stop words
  while (headingWords.length > 3 && stopWordsEnd.includes(headingWords[headingWords.length - 1].toLowerCase())) {
    headingWords.pop();
  }

  // Remove trailing punctuation
  let heading = headingWords.join(' ').replace(/[,;:.]$/, '').trim();

  // If too long, truncate further
  if (heading.length > 60) {
    headingWords = words.slice(0, 5);
    while (headingWords.length > 3 && stopWordsEnd.includes(headingWords[headingWords.length - 1].toLowerCase())) {
      headingWords.pop();
    }
    heading = headingWords.join(' ').replace(/[,;:.]$/, '').trim();
  }

  if (heading.length < 8) return null;

  // Capitalize first letter
  return heading.charAt(0).toUpperCase() + heading.slice(1);
}

function addHeadingsToBody(body, title) {
  const paragraphs = body.split(/\n\n+/);

  // Filter substantial paragraphs (for counting)
  const substantialIndices = [];
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i].trim();
    if (p.length > 50 && !p.startsWith('#') && !p.startsWith('<!--') && !p.startsWith('|') && !p.startsWith('```') && !p.startsWith('[!]')) {
      substantialIndices.push(i);
    }
  }

  if (substantialIndices.length < 4) return body;

  // Determine where to insert headings: every 2-4 substantial paragraphs
  const totalSubstantial = substantialIndices.length;
  const numHeadings = Math.min(4, Math.floor(totalSubstantial / 2));
  const sectionSize = Math.ceil(totalSubstantial / (numHeadings + 1));

  // Determine which indices get headings (skip the first section)
  const headingPositions = new Set();
  for (let h = 1; h <= numHeadings; h++) {
    const targetIdx = h * sectionSize;
    if (targetIdx < totalSubstantial) {
      headingPositions.add(substantialIndices[targetIdx]);
    }
  }

  const result = [];
  for (let i = 0; i < paragraphs.length; i++) {
    if (headingPositions.has(i)) {
      const heading = extractHeading(paragraphs[i]);
      if (heading) {
        result.push(`## ${heading}\n`);
      }
    }
    result.push(paragraphs[i]);
  }

  return result.join('\n\n');
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = parseFrontmatter(content);
  if (!parsed) return false;

  const wordCount = getWordCount(parsed.raw);
  if (wordCount < 300) return false;

  // Check for headings in the body - but ignore headings that start with long sentences (from previous bad run)
  const bodyLines = parsed.body.split('\n');
  let hasGoodHeadings = false;
  let hasBadHeadings = false;

  for (const line of bodyLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      const headingText = trimmed.substring(3).trim();
      if (headingText.length <= 60) {
        hasGoodHeadings = true;
      } else {
        hasBadHeadings = true;
      }
    }
  }

  // Skip if already has good headings and no bad ones
  if (hasGoodHeadings && !hasBadHeadings) return false;

  // If has bad headings from previous run, remove them first
  let cleanedBody = parsed.body;
  if (hasBadHeadings) {
    cleanedBody = cleanedBody.split('\n').filter(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ') && trimmed.length > 63) return false;
      return true;
    }).join('\n');
    // Clean up multiple blank lines
    cleanedBody = cleanedBody.replace(/\n{3,}/g, '\n\n');
  }

  // Skip if after cleanup we find it already has good headings
  if (!hasBadHeadings && hasGoodHeadings) return false;

  const title = (parsed.raw.match(/title:\s*"([^"]+)"/) || [])[1] || '';
  const newBody = addHeadingsToBody(cleanedBody, title);

  if (newBody === cleanedBody && !hasBadHeadings) return false;

  const newContent = `---\n${parsed.raw}\n---\n${newBody}`;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  return true;
}

function main() {
  const batchFile = '/tmp/batch_files.txt';
  const files = fs.readFileSync(batchFile, 'utf-8').trim().split('\n');
  let processed = 0;
  let modified = 0;

  for (const file of files) {
    const filePath = file.trim();
    if (!filePath) continue;

    try {
      if (processFile(filePath)) {
        modified++;
        console.log(`  HEADINGS: ${path.basename(filePath)}`);
      }
      processed++;
    } catch (err) {
      console.error(`  ERROR: ${path.basename(filePath)} - ${err.message}`);
    }
  }

  console.log(`\nDone! Checked: ${processed}, Modified: ${modified}`);
}

main();
