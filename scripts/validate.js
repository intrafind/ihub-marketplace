#!/usr/bin/env node
// Checks catalog.json and the integration definitions before they are
// published. Fails (exit 1) when:
//
//   - catalog.json is not valid JSON, or a relative source points at a
//     missing file;
//   - an integration item's folder is missing, or its integration.json does
//     not parse;
//   - a definition's `compatibility.ihub` is not a semver range;
//   - a definition's `version` is not the newest entry of `releases`
//     (`releases[0].version`), or the history is not newest first — so a
//     version bump without release notes is caught;
//   - a release-note path (`releases[].notes.*`) does not exist in the
//     folder, is not a Markdown file, or leaves the folder;
//   - the catalog item is out of sync with the folder (version,
//     compatibility, releases, companions, integrity): run
//     `node scripts/sync-integrations.js`.
//
// It also compares with the folder on `origin/main` (or `main`) when git has
// it: a changed folder whose version did not change is an error, since the
// catalog would then offer different files under the same version.
//
// Usage: node scripts/validate.js
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const CATALOG = path.join(ROOT, 'catalog.json');
const INTEGRATIONS_DIR = path.join(ROOT, 'integrations');
const NOTE_CATEGORIES = new Set(['features', 'fixes', 'breaking']);

/**
 * The git binary by absolute path (javascript:S4036): a bare `git` would be
 * looked up through PATH, which a writeable directory could hijack. Git is
 * optional here: without it the comparison with the main branch is skipped.
 */
const GIT =
  process.platform === 'win32'
    ? 'git'
    : ['/usr/bin/git', '/usr/local/bin/git', '/opt/homebrew/bin/git'].find(candidate =>
        fs.existsSync(candidate)
      ) || null;

/** Run git with fixed arguments; null when git is unavailable or the command fails. */
function git(args) {
  if (!GIT) return null;
  try {
    return execFileSync(GIT, args, {
      cwd: ROOT,
      shell: false,
      stdio: ['ignore', 'pipe', 'ignore']
    }).toString('utf8');
  } catch {
    return null;
  }
}

const errors = [];
const fail = message => errors.push(message);

// ---------------------------------------------------------------------------
// semver helpers (no dependencies: the repository has no package.json)

const VERSION = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/;
const PARTIAL = String.raw`v?(\d+|x|X|\*)(\.(\d+|x|X|\*))?(\.(\d+|x|X|\*))?(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?`;
const COMPARATOR = new RegExp(String.raw`^(\^|~|>=|<=|>|<|=)?${PARTIAL}$`);
const HYPHEN = new RegExp(String.raw`^${PARTIAL}\s+-\s+${PARTIAL}$`);

/** Whether `range` is a semver range as `semver.validRange` would accept it (the common grammar). */
function isValidRange(range) {
  if (typeof range !== 'string' || !range.trim()) return false;
  return range
    .split('||')
    .map(part => part.trim())
    .every(part => {
      if (part === '' || part === '*') return true;
      if (HYPHEN.test(part)) return true;
      return part.split(/\s+/).every(token => COMPARATOR.test(token));
    });
}

function compareVersions(a, b) {
  const pa = a.split('-')[0].split('.').map(Number);
  const pb = b.split('-')[0].split('.').map(Number);
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  const preA = a.includes('-');
  const preB = b.includes('-');
  if (preA && !preB) return -1;
  if (!preA && preB) return 1;
  return a.localeCompare(b);
}

// ---------------------------------------------------------------------------
// catalog.json

let catalog;
try {
  catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
} catch (error) {
  console.error(`catalog.json is not valid JSON: ${error.message}`);
  process.exit(1);
}

const items = Array.isArray(catalog.items) ? catalog.items : [];
for (const item of items) {
  if (item.source?.type === 'relative' && !fs.existsSync(path.join(ROOT, item.source.path))) {
    fail(`${item.type}/${item.name}: source file is missing: ${item.source.path}`);
  }
  if (item.minVersion !== undefined && !VERSION.test(String(item.minVersion)) && !/^\d+(\.\d+)?$/.test(String(item.minVersion))) {
    fail(`${item.type}/${item.name}: minVersion "${item.minVersion}" is not a version`);
  }
  if (item.compatibility?.ihub !== undefined && !isValidRange(item.compatibility.ihub)) {
    fail(`${item.type}/${item.name}: compatibility.ihub "${item.compatibility.ihub}" is not a semver range`);
  }
}

// ---------------------------------------------------------------------------
// integration definitions

function gitShow(ref, file) {
  return git(['show', `${ref}:${file}`]);
}

function gitRef() {
  return ['origin/main', 'main'].find(ref => git(['rev-parse', '--verify', '--quiet', ref]) !== null) || null;
}

function folderChangedSince(ref, folder) {
  const changed = git(['diff', '--name-only', ref, '--', `integrations/${folder}`]);
  const untracked = git(['ls-files', '--others', '--exclude-standard', '--', `integrations/${folder}`]);
  return Boolean((changed || '').trim() || (untracked || '').trim());
}

const baseRef = gitRef();
const folders = fs.existsSync(INTEGRATIONS_DIR)
  ? fs
      .readdirSync(INTEGRATIONS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'))
      .map(d => d.name)
  : [];

for (const folder of folders) {
  const dir = path.join(INTEGRATIONS_DIR, folder);
  const label = `integrations/${folder}`;
  let definition;
  try {
    definition = JSON.parse(fs.readFileSync(path.join(dir, 'integration.json'), 'utf8'));
  } catch (error) {
    fail(`${label}: integration.json does not parse: ${error.message}`);
    continue;
  }
  if (definition.id && definition.id.replace('/', '__') !== folder) {
    fail(`${label}: folder name does not match the id ${definition.id}`);
  }
  if (!VERSION.test(String(definition.version))) {
    fail(`${label}: version "${definition.version}" is not semantic`);
  }
  const range = definition.compatibility?.ihub;
  if (range !== undefined && !isValidRange(range)) {
    fail(`${label}: compatibility.ihub "${range}" is not a semver range`);
  }
  const schema = definition.compatibility?.schema;
  if (schema !== undefined && schema !== 1) {
    fail(`${label}: compatibility.schema ${schema} is not a revision iHub knows (1)`);
  }

  const releases = definition.releases;
  if (releases !== undefined) {
    if (!Array.isArray(releases) || releases.length === 0) {
      fail(`${label}: releases must list at least the current version`);
    } else {
      if (releases[0].version !== definition.version) {
        fail(
          `${label}: version is ${definition.version} but the newest release is ${releases[0].version}; add a releases[0] entry for ${definition.version}`
        );
      }
      releases.forEach((release, i) => {
        const where = `${label}: releases[${i}]`;
        if (!VERSION.test(String(release.version))) fail(`${where}: version "${release.version}" is not semantic`);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(release.date))) fail(`${where}: date must be YYYY-MM-DD`);
        if (!release.summary) fail(`${where}: summary is missing`);
        if (i > 0 && compareVersions(releases[i - 1].version, release.version) <= 0) {
          fail(`${where}: releases are listed newest first, each version once`);
        }
        for (const [category, rel] of Object.entries(release.notes || {})) {
          if (!NOTE_CATEGORIES.has(category)) fail(`${where}: unknown note category "${category}"`);
          if (typeof rel !== 'string' || !/\.md$/i.test(rel) || rel.startsWith('/') || rel.split('/').includes('..')) {
            fail(`${where}: notes.${category} must be a relative Markdown path inside the folder: ${rel}`);
            continue;
          }
          if (!fs.existsSync(path.join(dir, rel))) fail(`${where}: notes.${category} file is missing: ${rel}`);
        }
      });
    }
  }

  // A changed folder needs a new version (and, with it, a releases entry).
  if (baseRef) {
    const previous = gitShow(baseRef, `integrations/${folder}/integration.json`);
    if (previous) {
      let previousVersion;
      try {
        previousVersion = JSON.parse(previous).version;
      } catch {
        previousVersion = null;
      }
      if (previousVersion && folderChangedSince(baseRef, folder)) {
        if (previousVersion === definition.version) {
          fail(`${label}: the folder changed since ${baseRef} but version is still ${previousVersion}; bump it and add a releases entry`);
        } else if (compareVersions(definition.version, previousVersion) <= 0) {
          fail(`${label}: version ${definition.version} is not newer than ${previousVersion} on ${baseRef}`);
        } else if (releases !== undefined && !releases.some(r => r.version === definition.version)) {
          fail(`${label}: version changed to ${definition.version} without a releases entry`);
        }
      }
    }
  }
}

// catalog.json in sync with the folders
try {
  execFileSync(process.execPath, [path.join(__dirname, 'sync-integrations.js'), '--check'], {
    cwd: ROOT,
    shell: false,
    stdio: ['ignore', 'pipe', 'pipe']
  });
} catch (error) {
  fail(String(error.stderr || error.stdout || error.message).trim());
}

if (errors.length) {
  console.error(`validate: ${errors.length} problem(s)\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`validate: ${items.length} catalog items and ${folders.length} integration folder(s) are fine`);
