#!/usr/bin/env bash
# Build script for crearsoftware.com
# Generates blog, copies static assets into dist/
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Building crearsoftware.com..."
echo "=============================="

# Mirror legacy media first so the build can serve assets locally.
if [ -f "scripts/download-wordpress-assets.mjs" ]; then
  echo ""
  echo "Mirroring legacy WordPress assets..."
  node scripts/download-wordpress-assets.mjs
fi

# Clean previous build
rm -rf dist
mkdir -p dist

# Build blog (generates posts, categories, guides, authors, sitemap)
echo ""
echo "Building blog..."
node build-blog.js

# Copy static assets to dist/ (if they exist)
echo ""
echo "Copying static assets..."

# Directories
for dir in fonts images css wp-content files; do
  if [ -d "$dir" ]; then
    cp -r "$dir" dist/
    echo "  copied $dir/"
  fi
done

# Static files
# _redirects lo genera build-blog.js (base del repo + reglas para slugs con "¿"),
# así que no se copia aquí: hacerlo sobrescribiría las reglas generadas.
# BingSiteAuth.xml: fichero de verificación de Bing Webmaster Tools. Solo se
# copia si existe, así que el build no falla mientras no se haya dado de alta.
for file in _headers robots.txt 404.html BingSiteAuth.xml; do
  if [ -f "$file" ]; then
    cp "$file" dist/
    echo "  copied $file"
  fi
done

# Copy index.html if it exists at root
if [ -f "index.html" ]; then
  cp index.html dist/
  echo "  copied index.html"
fi

# Build stats
echo ""
echo "=============================="
echo "Build stats:"
FILE_COUNT=$(find dist -type f | wc -l | tr -d ' ')
echo "  Files generated: $FILE_COUNT"

if command -v du &> /dev/null; then
  TOTAL_SIZE=$(du -sh dist | cut -f1)
  echo "  Total size: $TOTAL_SIZE"
fi

HTML_COUNT=$(find dist -name "*.html" | wc -l | tr -d ' ')
echo "  HTML pages: $HTML_COUNT"

echo ""
echo "Build complete. Output in dist/"
