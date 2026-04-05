#!/usr/bin/env node
import { createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

const ROOT = resolve(process.cwd());
const POSTS_DIR = join(ROOT, 'blog-posts');
const TARGETS = [
  {
    prefix: '/wp-content/uploads/',
    localRoot: join(ROOT, 'wp-content', 'uploads'),
  },
  {
    prefix: '/files/',
    localRoot: join(ROOT, 'files'),
  },
];

const URL_PATTERN = /(?:https?:\/\/|\/\/)[^\s"'<>()[\]]+|\/(?:wp-content\/uploads|files)\/[^\s"'<>()[\]]+/g;
const BASE_URL = 'https://crearsoftware.com';
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl4n7sAAAAASUVORK5CYII=',
  'base64',
);

function normalizeSource(raw) {
  try {
    if (raw.startsWith('//')) return new URL(`https:${raw}`);
    if (raw.startsWith('/')) return new URL(raw, BASE_URL);
    return new URL(raw);
  } catch {
    return null;
  }
}

function getTarget(pathname) {
  return TARGETS.find(target => pathname.startsWith(target.prefix)) || null;
}

function localPathFor(url) {
  const target = getTarget(url.pathname);
  if (!target) return null;
  const relativePath = url.pathname.slice(target.prefix.length);
  return join(target.localRoot, relativePath);
}

function collectAssetRefs() {
  const assets = new Map();
  const files = existsSync(POSTS_DIR)
    ? readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'))
    : [];

  for (const file of files) {
    const raw = readFileSync(join(POSTS_DIR, file), 'utf8');
    const matches = raw.match(URL_PATTERN) || [];

    for (const match of matches) {
      const url = normalizeSource(match);
      if (!url) continue;

      const target = getTarget(url.pathname);
      if (!target) continue;

      const localPath = localPathFor(url);
      if (!localPath) continue;

      if (!assets.has(localPath)) {
        assets.set(localPath, {
          localPath,
          sourceUrl: url.toString(),
          refs: new Set([match]),
        });
        continue;
      }

      assets.get(localPath).refs.add(match);
    }
  }

  return [...assets.values()].sort((a, b) => a.localPath.localeCompare(b.localPath));
}

async function downloadFile(sourceUrl, destination) {
  const response = await fetch(sourceUrl, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Codex WordPress asset mirror)',
      accept: '*/*',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  if (!response.body) {
    throw new Error('Empty response body');
  }

  mkdirSync(dirname(destination), { recursive: true });
  const tempFile = `${destination}.tmp`;

  try {
    await pipeline(Readable.fromWeb(response.body), createWriteStream(tempFile));
    renameSync(tempFile, destination);
  } catch (error) {
    if (existsSync(tempFile)) unlinkSync(tempFile);
    throw error;
  }
}

function writeFallbackImage(destination) {
  const ext = destination.toLowerCase().slice(destination.lastIndexOf('.'));
  if (ext === '.png') {
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, TRANSPARENT_PNG);
    return true;
  }

  if (ext === '.bmp') {
    const bmp = Buffer.alloc(58);
    bmp.write('BM', 0, 2, 'ascii');
    bmp.writeUInt32LE(58, 2);
    bmp.writeUInt32LE(0, 6);
    bmp.writeUInt32LE(54, 10);
    bmp.writeUInt32LE(40, 14);
    bmp.writeInt32LE(1, 18);
    bmp.writeInt32LE(1, 22);
    bmp.writeUInt16LE(1, 26);
    bmp.writeUInt16LE(24, 28);
    bmp.writeUInt32LE(0, 30);
    bmp.writeUInt32LE(4, 34);
    bmp.writeInt32LE(2835, 38);
    bmp.writeInt32LE(2835, 42);
    bmp.writeUInt32LE(0, 46);
    bmp.writeUInt32LE(0, 50);
    bmp.writeUInt32LE(0, 54);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, bmp);
    return true;
  }

  return false;
}

function fileSize(filePath) {
  try {
    return statSync(filePath).size;
  } catch {
    return 0;
  }
}

async function main() {
  const assets = collectAssetRefs();
  let reused = 0;
  let downloaded = 0;
  let placeholders = 0;
  let failed = 0;
  const failures = [];

  console.log(`Found ${assets.length} unique WordPress media assets`);

  for (const asset of assets) {
    const exists = existsSync(asset.localPath) && fileSize(asset.localPath) > 0;
    if (exists) {
      reused += 1;
      continue;
    }

    try {
      await downloadFile(asset.sourceUrl, asset.localPath);
      downloaded += 1;
      console.log(`  [download] ${asset.localPath}`);
    } catch (error) {
      if (writeFallbackImage(asset.localPath)) {
        placeholders += 1;
        console.warn(`  [placeholder] ${asset.localPath} ← ${asset.sourceUrl} (${error.message})`);
        continue;
      }

      failed += 1;
      failures.push({ localPath: asset.localPath, sourceUrl: asset.sourceUrl, error: error.message });
      console.warn(`  [fail] ${asset.localPath} ← ${asset.sourceUrl} (${error.message})`);
    }
  }

  const missing = assets.filter(asset => !(existsSync(asset.localPath) && fileSize(asset.localPath) > 0));

  console.log('');
  console.log('WordPress media mirror');
  console.log(`  Unique assets: ${assets.length}`);
  console.log(`  Reused local files: ${reused}`);
  console.log(`  Downloaded: ${downloaded}`);
  console.log(`  Placeholders: ${placeholders}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Missing after run: ${missing.length}`);

  if (missing.length > 0) {
    console.log('  Missing files:');
    for (const asset of missing.slice(0, 20)) {
      console.log(`    - ${asset.localPath}`);
    }
  }

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
