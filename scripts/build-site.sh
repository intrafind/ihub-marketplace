#!/usr/bin/env bash
# Assembles the marketplace website into a static folder for GitHub Pages.
#
# The website (site/) is copied together with catalog.json and the content
# folders, so the browser loads the catalog and item previews from the same
# origin and the published site always matches the deployed commit.
#
# Usage: scripts/build-site.sh [output-dir]   (default: _site)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-_site}"
case "$OUT" in /*) ;; *) OUT="$ROOT/$OUT" ;; esac

rm -rf "$OUT"
mkdir -p "$OUT"

cp -R "$ROOT/site/." "$OUT/"
cp "$ROOT/catalog.json" "$ROOT/LICENSE" "$ROOT/NOTICE" "$OUT/"
for dir in apps models prompts skills workflows; do
  cp -R "$ROOT/$dir" "$OUT/$dir"
done
touch "$OUT/.nojekyll"

# Fail the build when the catalog is not valid JSON or points at a missing file
node - "$OUT" <<'NODE'
const fs = require('fs');
const path = require('path');
const out = process.argv[2];
const catalog = JSON.parse(fs.readFileSync(path.join(out, 'catalog.json'), 'utf8'));
const missing = (catalog.items || [])
  .filter(item => item.source?.type === 'relative')
  .filter(item => !fs.existsSync(path.join(out, item.source.path)))
  .map(item => `${item.type}/${item.name}: ${item.source.path}`);
if (missing.length) {
  console.error(`catalog.json references ${missing.length} missing file(s):\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.log(`Built marketplace website with ${catalog.items.length} items into ${out}`);
NODE
