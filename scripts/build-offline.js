#!/usr/bin/env node
// Builds the offline bundle of the marketplace: the website, catalog.json and
// every file the catalog points at, as a static folder (and a .tar.gz of it)
// that an iHub without internet access can use as a registry.
//
// It starts from the site that scripts/build-site.sh built (_site/) and makes
// it self-contained:
//
//   - Skills the catalog links to on another host (`source.type: "url"`, for
//     example the Google skills on raw.githubusercontent.com) are downloaded
//     from their pinned commit into skills/<name>/ and listed as `relative`
//     sources with their companion files, so iHub installs them from the
//     registry's own host. The license text of each upstream repository is
//     copied to third-party/<owner>/<repo>/<commit>/LICENSE.txt.
//   - The website is switched to offline mode (assets/config.js): no GitHub
//     links, the registry URL it shows is the address it is served from.
//   - offline-manifest.json lists every downloaded file with its SHA-256.
//
// Nothing is dropped: the build fails when an item cannot be made
// self-contained, when a download fails, or when the result has fewer items
// than the catalog it started from.
//
// Usage: scripts/build-offline.sh        (builds _site/ first, then runs this)
//        node scripts/build-offline.js [--version <version>] [--no-archive] [--concurrency <n>]
//
// --version is the release version of the bundle (the release workflow passes
// the UTC build time, yyyymmddhhmm): it is recorded in offline-manifest.json
// and names the archive. Without it the archive carries the catalog version
// and the commit.
//
// Output: _offline/ihub-marketplace-offline/            the bundle (static files)
//         _offline/ihub-marketplace-offline-<version>.tar.gz
//         _offline/ihub-marketplace-offline-<version>.tar.gz.sha256
//
// The downloads need outbound HTTPS to the hosts of the `url` sources (behind
// a proxy: NODE_USE_ENV_PROXY=1 and HTTPS_PROXY, and NODE_EXTRA_CA_CERTS for a
// private CA). Node.js 20+, no dependencies.
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const BUNDLE_NAME = 'ihub-marketplace-offline';
/** This repository, as the website knows it: its license is the bundle's own LICENSE.txt. */
const SELF_REPO = 'intrafind/ihub-marketplace';
const SKILL_NAME = /^[a-z0-9][a-z0-9-]{0,63}$/;
/** A release version ends up in a file name: letters, digits, `.`, `_` and `-` only. */
const RELEASE_VERSION = /^[0-9A-Za-z][0-9A-Za-z._-]{0,63}$/;

/** A problem with the catalog or a download; the message says what to fix. */
class OfflineBuildError extends Error {}

// ---------- Small helpers ----------

/** `sha256-<base64>`, the notation iHub uses for `source.integrity`. */
function integrityOf(bytes) {
  return `sha256-${crypto.createHash('sha256').update(bytes).digest('base64')}`;
}

/**
 * A companion path as the catalog lists it: relative to the folder of the
 * SKILL.md, POSIX separators, no way out of the folder.
 *
 * @param {string} value
 * @returns {string} the normalized path
 * @throws {OfflineBuildError}
 */
function companionPath(value) {
  if (
    typeof value !== 'string' ||
    value === '' ||
    value.includes('\\') ||
    value.includes('\0') ||
    value.startsWith('/') ||
    value.split('/').some(segment => segment === '' || segment === '.' || segment === '..')
  ) {
    throw new OfflineBuildError(`unsafe companion path ${JSON.stringify(value)}`);
  }
  return value;
}

/** The `name` of a SKILL.md's front matter, or null. */
function frontMatterName(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  if (lines[0].trimEnd() !== '---') return null;
  for (let index = 1; index < lines.length && lines[index].trimEnd() !== '---'; index++) {
    if (!lines[index].startsWith('name:')) continue;
    const value = lines[index].slice('name:'.length).trim().replace(/^(["'])(.*)\1$/, '$2');
    return value || null;
  }
  return null;
}

/** The folder of a path: everything up to and including the last `/`. */
function folderOf(file) {
  return file.slice(0, file.lastIndexOf('/') + 1);
}

/**
 * A system binary from a fixed directory, never from a PATH that a project
 * or the environment could have changed. Windows has no such directories and
 * resolves the name as usual.
 *
 * @param {string} name
 * @returns {string|null} null when it is not installed
 */
function findBinary(name) {
  if (process.platform === 'win32') return name;
  const directories = ['/usr/bin', '/bin', '/usr/local/bin', '/opt/homebrew/bin'];
  return directories.map(dir => path.join(dir, name)).find(file => fs.existsSync(file)) || null;
}

/**
 * Where the license a GitHub `licenseUrl` names lives in the bundle, and where
 * to download it from. Only `https://github.com/<owner>/<repo>/blob/<ref>/LICENSE`
 * is understood; the website derives the same path (assets/app.js).
 *
 * @param {string|undefined} licenseUrl
 * @returns {{ rawUrl: string, bundlePath: string }|null}
 */
function licenseTarget(licenseUrl) {
  const match =
    /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/LICENSE$/.exec(licenseUrl || '');
  if (!match) return null;
  const [, owner, repo, ref] = match;
  return {
    rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/LICENSE`,
    bundlePath: `third-party/${owner}/${repo}/${ref}/LICENSE.txt`
  };
}

/** Runs `fn` over `items` with at most `limit` in flight; results keep the order of `items`. */
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

/**
 * Downloads a file. Retries network errors, 429 and 5xx; a 4xx is final.
 *
 * @param {string} url - https only
 * @returns {Promise<Buffer>}
 */
async function downloadBytes(url, { attempts = 4, timeoutMs = 30000 } = {}) {
  if (!/^https:\/\//i.test(url)) throw new Error(`not an https URL: ${url}`);
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    let retryable = true;
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
      if (response.ok) return Buffer.from(await response.arrayBuffer());
      lastError = new Error(`HTTP ${response.status} for ${url}`);
      retryable = response.status >= 500 || response.status === 429;
    } catch (error) {
      lastError = error; // network error or timeout
    }
    if (!retryable || attempt === attempts) break;
    await new Promise(resolve => setTimeout(resolve, 500 * 2 ** attempt));
  }
  throw lastError;
}

// ---------- Making the catalog self-contained ----------

/**
 * What it takes to copy the `url` skills into the bundle: for each one the
 * files to download, checked before anything is fetched.
 *
 * @param {object} catalog
 * @param {string} bundleDir
 * @returns {{ plan: object[], errors: string[] }}
 */
function planVendoring(catalog, bundleDir) {
  const plan = [];
  const errors = [];
  const taken = new Set();

  for (const item of catalog.items) {
    const source = item.source || {};
    const label = `${item.type}:${item.name}`;
    if (source.type === 'relative') {
      if ('rawBase' in source) errors.push(`${label}: source.rawBase points away from the bundle`);
      continue;
    }
    if (source.type !== 'url') {
      errors.push(`${label}: source type ${JSON.stringify(source.type)} cannot be made offline`);
      continue;
    }
    if (item.type !== 'skill') {
      errors.push(`${label}: only skills may use a url source in an offline bundle`);
      continue;
    }
    if (!SKILL_NAME.test(item.name)) {
      errors.push(`${label}: the name is not a valid skill folder name`);
      continue;
    }
    if (!/^https:\/\/.+\/SKILL\.md$/.test(source.url || '')) {
      errors.push(`${label}: the url ${JSON.stringify(source.url)} is not an https URL of a SKILL.md`);
      continue;
    }
    const folder = `skills/${item.name}`;
    if (taken.has(folder) || fs.existsSync(path.join(bundleDir, folder))) {
      errors.push(`${label}: ${folder}/ already exists in the bundle`);
      continue;
    }
    taken.add(folder);

    let companions;
    try {
      companions = (source.companions || []).map(companionPath);
    } catch (error) {
      errors.push(`${label}: ${error.message}`);
      continue;
    }
    if (new Set(companions).size !== companions.length || companions.includes('SKILL.md')) {
      errors.push(`${label}: the companions list a file twice or SKILL.md itself`);
      continue;
    }

    const base = source.url.replace(/\/SKILL\.md$/, '');
    plan.push({
      item,
      folder,
      upstream: source.url,
      companions,
      files: [
        { rel: 'SKILL.md', url: source.url },
        ...companions.map(rel => ({ rel, url: `${base}/${rel}` }))
      ],
      license: licenseTarget(item.licenseUrl)
    });
  }
  return { plan, errors };
}

/**
 * Downloads the `url` skills (and their licenses) into the bundle and turns
 * their catalog entries into `relative` ones.
 *
 * @returns {Promise<{ vendored: object[], licenses: object[] }>} what the manifest lists
 * @throws {OfflineBuildError} listing every problem; nothing is written then
 */
async function vendorUrlSkills(catalog, bundleDir, { fetchBytes, concurrency, log }) {
  const { plan, errors } = planVendoring(catalog, bundleDir);

  const licenseTargets = new Map();
  for (const entry of plan) {
    if (entry.license) licenseTargets.set(entry.license.rawUrl, entry.license);
    else
      errors.push(
        `skill:${entry.item.name}: licenseUrl ${JSON.stringify(entry.item.licenseUrl)} is not ` +
          'a github.com .../blob/<commit>/LICENSE link, so its license text cannot be bundled'
      );
  }
  if (errors.length) throw new OfflineBuildError(errors.join('\n'));

  const downloads = [
    ...plan.flatMap(entry => entry.files.map(file => ({ ...file, entry }))),
    ...[...licenseTargets.values()].map(license => ({ url: license.rawUrl, license }))
  ];
  log(`Downloading ${downloads.length} files for ${plan.length} skills…`);
  const failures = [];
  const bytes = await mapLimit(downloads, concurrency, async download => {
    try {
      return await fetchBytes(download.url);
    } catch (error) {
      failures.push(`${download.url}: ${error.message}`);
      return null;
    }
  });
  if (failures.length) {
    throw new OfflineBuildError(`${failures.length} download(s) failed:\n${failures.join('\n')}`);
  }

  const byUrl = new Map(downloads.map((download, index) => [download.url, bytes[index]]));
  for (const entry of plan) {
    const name = frontMatterName(byUrl.get(entry.upstream).toString('utf8'));
    if (name !== entry.item.name) {
      errors.push(
        `skill:${entry.item.name}: its SKILL.md names itself ${JSON.stringify(name)}; iHub ` +
          'installs a skill only when both are the same'
      );
    }
  }
  if (errors.length) throw new OfflineBuildError(errors.join('\n'));

  const vendored = [];
  for (const entry of plan) {
    const files = [];
    for (const file of entry.files) {
      const content = byUrl.get(file.url);
      const destination = path.join(bundleDir, entry.folder, ...file.rel.split('/'));
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, content);
      files.push({ path: `${entry.folder}/${file.rel}`, integrity: integrityOf(content) });
    }
    entry.item.source = {
      type: 'relative',
      path: `${entry.folder}/SKILL.md`,
      ...(entry.companions.length ? { companions: entry.companions } : {})
    };
    vendored.push({ type: 'skill', name: entry.item.name, upstream: entry.upstream, files });
  }

  const licenses = [];
  for (const license of licenseTargets.values()) {
    const content = byUrl.get(license.rawUrl);
    const destination = path.join(bundleDir, ...license.bundlePath.split('/'));
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content);
    licenses.push({
      path: license.bundlePath,
      upstream: license.rawUrl,
      integrity: integrityOf(content)
    });
  }
  return { vendored, licenses };
}

/**
 * The bundle must not need anything outside itself: every item is a relative
 * source whose files, companions and version descriptors exist, and nothing
 * was lost.
 *
 * @throws {OfflineBuildError}
 */
function assertSelfContained(catalog, bundleDir, expectedItems) {
  const problems = [];
  if (catalog.items.length !== expectedItems) {
    problems.push(`the catalog has ${catalog.items.length} items, it started with ${expectedItems}`);
  }
  const exists = rel => fs.existsSync(path.join(bundleDir, ...rel.split('/')));
  for (const item of catalog.items) {
    const label = `${item.type}:${item.name}`;
    const source = item.source || {};
    if (source.type !== 'relative') {
      problems.push(`${label}: source is ${JSON.stringify(source.type)}, not relative`);
      continue;
    }
    if (!exists(source.path)) problems.push(`${label}: ${source.path} is missing`);
    const folder = folderOf(source.path);
    for (const companion of source.companions || []) {
      if (!exists(folder + companion)) problems.push(`${label}: ${folder}${companion} is missing`);
    }
    for (const listed of item.versions || []) {
      if (listed.ref && (/^[a-z][a-z0-9+.-]*:/i.test(listed.ref) || !exists(listed.ref))) {
        problems.push(`${label}@${listed.version}: version descriptor ${listed.ref} is not in the bundle`);
      }
    }
  }
  if (problems.length) {
    throw new OfflineBuildError(`the bundle is not self-contained:\n${problems.join('\n')}`);
  }
}

// ---------- The bundle ----------

function gitCommit(root) {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  const git = findBinary('git');
  if (!git) return null;
  const result = spawnSync(git, ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

/** Packs the bundle folder into <name>.tar.gz next to it and writes the .sha256 file. */
function createArchive(outDir, archiveName) {
  const archive = path.join(outDir, archiveName);
  const tar = findBinary('tar');
  if (!tar) throw new OfflineBuildError('tar is not installed, so no archive can be written');
  const isGnu = /GNU tar/.test(spawnSync(tar, ['--version'], { encoding: 'utf8' }).stdout || '');
  const result = spawnSync(
    tar,
    [
      ...(isGnu ? ['--sort=name', '--owner=0', '--group=0', '--numeric-owner'] : []),
      '-czf',
      archive,
      '-C',
      outDir,
      BUNDLE_NAME
    ],
    { encoding: 'utf8' }
  );
  if (result.status !== 0) {
    throw new OfflineBuildError(`tar failed: ${result.stderr || result.error || result.status}`);
  }
  const hex = crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
  fs.writeFileSync(`${archive}.sha256`, `${hex}  ${archiveName}\n`);
  return { archive, sha256: hex };
}

/**
 * Builds the offline bundle from the built site (`<root>/_site`).
 *
 * @param {object} [options]
 * @param {string} [options.root] - the repository
 * @param {(url: string) => Promise<Buffer>} [options.fetchBytes] - downloads one file
 * @param {boolean} [options.archive] - also write the .tar.gz (default true)
 * @param {number} [options.concurrency] - parallel downloads (default 8)
 * @param {string|null} [options.version] - the release version, e.g. `202611032031`
 * @param {(message: string) => void} [options.log]
 * @returns {Promise<{ bundleDir: string, archive: string|null, items: number, vendored: number }>}
 */
async function buildOffline({
  root = ROOT,
  fetchBytes = downloadBytes,
  archive = true,
  concurrency = 8,
  version = null,
  log = console.log
} = {}) {
  if (version !== null && !RELEASE_VERSION.test(version)) {
    throw new OfflineBuildError(
      `the version ${JSON.stringify(version)} may contain only letters, digits, ".", "_" and "-"`
    );
  }
  const siteDir = path.join(root, '_site');
  if (!fs.existsSync(path.join(siteDir, 'catalog.json'))) {
    throw new OfflineBuildError(
      `${siteDir}/catalog.json not found: build the site first (scripts/build-site.sh), or run scripts/build-offline.sh`
    );
  }

  const outDir = path.join(root, '_offline');
  const bundleDir = path.join(outDir, BUNDLE_NAME);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.cpSync(siteDir, bundleDir, { recursive: true });

  const catalog = JSON.parse(fs.readFileSync(path.join(bundleDir, 'catalog.json'), 'utf8'));
  if (!Array.isArray(catalog.items)) throw new OfflineBuildError('catalog.json has no items array');
  const expectedItems = catalog.items.length;

  const { vendored, licenses } = await vendorUrlSkills(catalog, bundleDir, {
    fetchBytes,
    concurrency,
    log
  });
  assertSelfContained(catalog, bundleDir, expectedItems);

  fs.writeFileSync(path.join(bundleDir, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);
  fs.writeFileSync(
    path.join(bundleDir, 'assets', 'config.js'),
    '// Written by scripts/build-offline.js: this is the offline bundle.\n' +
      'window.MARKETPLACE_CONFIG = { offline: true };\n' +
      "if (window.MARKETPLACE_CONFIG.offline) document.documentElement.classList.add('offline');\n"
  );
  // Served as plain text by every web server; the site links to it as the license of this repository's items
  fs.copyFileSync(path.join(root, 'LICENSE'), path.join(bundleDir, 'LICENSE.txt'));
  const guide = path.join(root, 'docs', 'offline.md');
  if (fs.existsSync(guide)) fs.copyFileSync(guide, path.join(bundleDir, 'OFFLINE.md'));

  const commit = gitCommit(root);
  fs.writeFileSync(
    path.join(bundleDir, 'offline-manifest.json'),
    `${JSON.stringify(
      {
        bundle: BUNDLE_NAME,
        version,
        catalogVersion: catalog.version || null,
        commit,
        items: catalog.items.length,
        copiedFromUpstream: vendored,
        licenses
      },
      null,
      2
    )}\n`
  );

  let archivePath = null;
  if (archive) {
    const name =
      version ||
      `${String(catalog.version || '0').replace(/[^A-Za-z0-9._-]/g, '_')}${
        commit ? `-${commit.slice(0, 7)}` : ''
      }`;
    ({ archive: archivePath } = createArchive(outDir, `${BUNDLE_NAME}-${name}.tar.gz`));
  }

  log(
    `Built offline bundle with ${catalog.items.length} items into ${bundleDir} ` +
      `(${vendored.length} skills copied from upstream)` +
      (archivePath ? `\nArchive: ${archivePath}` : '')
  );
  return { bundleDir, archive: archivePath, items: catalog.items.length, vendored: vendored.length };
}

module.exports = {
  BUNDLE_NAME,
  OfflineBuildError,
  buildOffline,
  companionPath,
  downloadBytes,
  frontMatterName,
  licenseTarget
};

if (require.main === module) {
  const args = process.argv.slice(2);
  const concurrencyAt = args.indexOf('--concurrency');
  const concurrency = concurrencyAt >= 0 ? Number(args[concurrencyAt + 1]) : 8;
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    console.error('build-offline: --concurrency needs a positive integer');
    process.exit(2);
  }
  const versionAt = args.indexOf('--version');
  const version = versionAt >= 0 ? args[versionAt + 1] : null;
  if (versionAt >= 0 && !version) {
    console.error('build-offline: --version needs a value');
    process.exit(2);
  }
  buildOffline({ archive: !args.includes('--no-archive'), concurrency, version }).catch(error => {
    console.error(
      error instanceof OfflineBuildError
        ? `build-offline: ${error.message}`
        : error.stack || error.message
    );
    process.exit(1);
  });
}
