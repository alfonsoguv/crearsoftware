#!/usr/bin/env node
/**
 * Remove auto-generated headings that duplicate the paragraph content.
 * These were added by previous script runs and are low quality.
 */

const fs = require('fs');
const path = require('path');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  return { raw: match[1], body: match[2] };
}

function cleanBadHeadings(body) {
  const lines = body.split('\n');
  const result = [];
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if this is an H2 heading
    if (line.startsWith('## ')) {
      const headingText = line.substring(3).trim();

      // Look ahead: find the next non-empty line
      let nextContentLine = '';
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine.length > 0 && !nextLine.startsWith('## ')) {
          nextContentLine = nextLine;
          break;
        }
      }

      // Clean the next content line for comparison
      const cleanNext = nextContentLine
        .replace(/\*\*\*/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
        .trim();

      // Check if heading text is a prefix of the next paragraph
      const headingLower = headingText.toLowerCase().replace(/[^a-záéíóúüñ\s]/g, '');
      const nextLower = cleanNext.toLowerCase().replace(/[^a-záéíóúüñ\s]/g, '');

      if (nextLower.startsWith(headingLower) || headingLower.startsWith(nextLower.substring(0, 30))) {
        // This heading duplicates the next paragraph - remove it
        changed = true;
        continue;
      }

      // Also remove headings that are clearly auto-generated (start with articles or pronouns)
      const autoGenPrefixes = ['en estos', 'en este', 'el 13', 'en resumen', 'lo primero', 'lo que', 'por otra', 'yo me'];
      const isAutoGen = autoGenPrefixes.some(prefix => headingLower.startsWith(prefix));
      if (isAutoGen) {
        changed = true;
        continue;
      }
    }

    result.push(lines[i]);
  }

  if (!changed) return null;

  // Clean up multiple blank lines
  let cleaned = result.join('\n');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned;
}

function main() {
  const batchFile = '/tmp/batch_files.txt';
  const files = fs.readFileSync(batchFile, 'utf-8').trim().split('\n');
  let modified = 0;

  for (const file of files) {
    const filePath = file.trim();
    if (!filePath) continue;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = parseFrontmatter(content);
      if (!parsed) continue;

      const cleanedBody = cleanBadHeadings(parsed.body);
      if (cleanedBody === null) continue;

      const newContent = `---\n${parsed.raw}\n---\n${cleanedBody}`;
      fs.writeFileSync(filePath, newContent, 'utf-8');
      modified++;
      console.log(`  CLEANED: ${path.basename(filePath)}`);
    } catch (err) {
      console.error(`  ERROR: ${path.basename(filePath)} - ${err.message}`);
    }
  }

  console.log(`\nDone! Modified: ${modified}`);
}

main();
