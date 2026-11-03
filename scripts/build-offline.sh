#!/usr/bin/env bash
# Builds the offline bundle: the marketplace website with catalog.json and all
# content, made self-contained so an iHub without internet access can use it
# as a registry. See docs/offline.md.
#
# Builds _site/ first (scripts/build-site.sh, which validates the catalog),
# then runs scripts/build-offline.js, which downloads the skills the catalog
# links to on GitHub into the bundle.
#
# Usage: scripts/build-offline.sh [--no-archive] [--concurrency <n>]
# Output: _offline/ihub-marketplace-offline/ and, unless --no-archive, a .tar.gz
#         with its .sha256 next to it.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

"$ROOT/scripts/build-site.sh" _site
node "$ROOT/scripts/build-offline.js" "$@"
