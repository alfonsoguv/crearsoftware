import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

export function loadLocalEnv(options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const files = options.files ?? ['.dev.vars', '.env.local', '.env'];
  const loadedFiles = [];

  for (const file of files) {
    const filePath = path.join(cwd, file);
    if (!existsSync(filePath)) continue;

    const raw = readFileSync(filePath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const match = line.match(
        /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/,
      );
      if (!match) continue;

      const [, key, rawValue] = match;
      if (Object.prototype.hasOwnProperty.call(process.env, key)) continue;

      process.env[key] = stripWrappingQuotes(rawValue.trim());
    }

    loadedFiles.push(filePath);
  }

  return loadedFiles;
}
