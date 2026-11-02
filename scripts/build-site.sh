#!/usr/bin/env bash
# Assembles the marketplace website into a static folder for GitHub Pages.
#
# The website (site/) is copied together with catalog.json and the content
# folders, so the browser loads the catalog and item previews from the same
# origin and the published site always matches the deployed commit.
#
# Usage: scripts/build-site.sh [_site]   (always builds into _site/)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# The site is always _site/ in the repository: build-versions.js publishes the
# release versions into exactly that folder and takes no path from outside.
if [ "${1:-_site}" != "_site" ]; then
  echo "build-site: the site is always built into _site/ (got: $1)" >&2
  exit 2
fi
OUT="$ROOT/_site"

# Fail early when the catalog or an integration definition is not publishable
# (version without release notes, bad compatibility range, missing note file,
# catalog item out of sync with its folder)
node "$ROOT/scripts/validate.js"

rm -rf "$OUT"
mkdir -p "$OUT"

cp -R "$ROOT/site/." "$OUT/"
cp "$ROOT/catalog.json" "$ROOT/LICENSE" "$ROOT/NOTICE" "$OUT/"
for dir in apps models prompts skills workflows integrations; do
  cp -R "$ROOT/$dir" "$OUT/$dir"
done
touch "$OUT/.nojekyll"

# Every released integration version (git tags integrations/<id>@<version>):
# its folder and a descriptor under versions/, and `versions` on the item of
# the published catalog.json, so iHub can install a pinned version and keep the
# definition of every version an update passes. Without git or tags the
# catalog stays as it is.
node "$ROOT/scripts/build-versions.js"

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
for (const item of catalog.items || []) {
  for (const entry of item.versions || []) {
    if (entry.ref && !fs.existsSync(path.join(out, entry.ref))) {
      missing.push(`${item.type}/${item.name}@${entry.version}: ${entry.ref}`);
    }
  }
}
if (missing.length) {
  console.error(`catalog.json references ${missing.length} missing file(s):\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.log(`Built marketplace website with ${catalog.items.length} items into ${out}`);
NODE
