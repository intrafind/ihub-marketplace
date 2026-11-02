// Git tags of integration releases: `integrations/<id>@<version>`, one per
// published version of a definition folder (`integrations/<id with / as __>/`).
// Shared by tag-integrations.js (creates them on release), build-versions.js
// (publishes one descriptor per tag) and validate.js (compares a changed
// folder with the previous release instead of main).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

/**
 * The git binary by absolute path (javascript:S4036): a bare `git` would be
 * looked up through PATH, which a writeable directory could hijack. Git is
 * optional: without it no tag is read or written.
 */
const GIT =
  process.platform === 'win32'
    ? 'git'
    : ['/usr/bin/git', '/usr/local/bin/git', '/opt/homebrew/bin/git'].find(candidate =>
        fs.existsSync(candidate)
      ) || null;

/** A version as a definition writes it: MAJOR.MINOR.PATCH, optionally -prerelease. */
const VERSION = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;

/**
 * Run git with fixed arguments in `cwd`; the output as text (or a Buffer with
 * `{ binary: true }`), null when git is unavailable or the command fails.
 */
function git(cwd, args, { binary = false } = {}) {
  if (!GIT) return null;
  try {
    const out = execFileSync(GIT, args, {
      cwd,
      shell: false,
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 64 * 1024 * 1024
    });
    return binary ? out : out.toString('utf8');
  } catch {
    return null;
  }
}

/** Compare two versions (semver precedence without build metadata; no dependencies). */
function compareVersions(a, b) {
  const [coreA, preA = ''] = a.split('-');
  const [coreB, preB = ''] = b.split('-');
  const pa = coreA.split('.').map(Number);
  const pb = coreB.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  if (preA && !preB) return -1;
  if (!preA && preB) return 1;
  if (!preA && !preB) return 0;
  const partsA = preA.split('.');
  const partsB = preB.split('.');
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i += 1) {
    if (partsA[i] === undefined) return -1;
    if (partsB[i] === undefined) return 1;
    const numA = /^\d+$/.test(partsA[i]);
    const numB = /^\d+$/.test(partsB[i]);
    if (numA && numB && Number(partsA[i]) !== Number(partsB[i])) {
      return Number(partsA[i]) - Number(partsB[i]);
    }
    if (numA !== numB) return numA ? -1 : 1;
    if (partsA[i] !== partsB[i]) return partsA[i] < partsB[i] ? -1 : 1;
  }
  return 0;
}

/** The tag of one release: `integrations/<id>@<version>`. */
function tagName(id, version) {
  return `integrations/${id}@${version}`;
}

/**
 * The release tags of one definition, newest first: `[{ tag, version }]`.
 *
 * @param {string} cwd - the repository
 * @param {string} id - the definition id (`org.ckan/open-data-portal`)
 * @returns {Array<{ tag: string, version: string }>}
 */
function releaseTags(cwd, id) {
  const prefix = `integrations/${id}@`;
  const out = git(cwd, ['tag', '--list', `${prefix}*`]);
  if (!out) return [];
  return out
    .split('\n')
    .map(line => line.trim())
    .filter(tag => tag.startsWith(prefix) && VERSION.test(tag.slice(prefix.length)))
    .map(tag => ({ tag, version: tag.slice(prefix.length) }))
    .sort((a, b) => compareVersions(b.version, a.version));
}

/**
 * The release a changed folder is compared with: the newest tag whose
 * version is not above `version` (the release this change builds on), else
 * the newest tag at all (a version that went down is then reported), or
 * null without tags.
 *
 * @param {string} cwd
 * @param {string} id
 * @param {string} version - the version in the working tree
 * @returns {{ tag: string, version: string }|null}
 */
function previousRelease(cwd, id, version) {
  const tags = releaseTags(cwd, id);
  if (tags.length === 0) return null;
  if (!VERSION.test(String(version))) return tags[0];
  return tags.find(t => compareVersions(t.version, version) <= 0) || tags[0];
}

/** The folder name of a definition id: the one `/` becomes `__`. */
function folderOf(id) {
  return id.replace('/', '__');
}

module.exports = {
  GIT,
  VERSION,
  compareVersions,
  folderOf,
  git,
  previousRelease,
  releaseTags,
  tagName,
  ROOT: path.resolve(__dirname, '..')
};
