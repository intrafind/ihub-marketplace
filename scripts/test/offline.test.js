// Tests of scripts/build-offline.js: the offline bundle is the built site with
// the skills the catalog links to elsewhere copied in, and the build fails
// instead of dropping anything.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const {
  BUNDLE_NAME,
  OfflineBuildError,
  buildOffline,
  companionPath,
  frontMatterName,
  licenseTarget
} = require('../build-offline.js');

const COMMIT = '1d77046ad3670d62227f50a8f53286f6c6cde08b';
const RAW = `https://raw.githubusercontent.com/google/skills/${COMMIT}/skills/cloud/gke-basics`;
const LICENSE_URL = `https://github.com/google/skills/blob/${COMMIT}/LICENSE`;
const SKILL_MD = '---\nname: gke-basics\ndescription: GKE\n---\n# GKE\n';

/** A skill the catalog links to on GitHub. */
const urlSkill = (overrides = {}) => ({
  type: 'skill',
  name: 'gke-basics',
  displayName: { en: 'GKE Basics' },
  version: '1.0.0',
  license: 'Apache-2.0',
  licenseUrl: LICENSE_URL,
  source: {
    type: 'url',
    url: `${RAW}/SKILL.md`,
    companions: ['references/a.md', 'references/deep/b.md']
  },
  ...overrides
});

/** What the upstream host serves. */
const upstream = () => ({
  [`${RAW}/SKILL.md`]: Buffer.from(SKILL_MD),
  [`${RAW}/references/a.md`]: Buffer.from('# A'),
  [`${RAW}/references/deep/b.md`]: Buffer.from('# B\n'),
  [`https://raw.githubusercontent.com/google/skills/${COMMIT}/LICENSE`]: Buffer.from('Apache License\n')
});

/** A fetchBytes that serves `files` and records every request. */
function fakeFetch(files) {
  const calls = [];
  const fetchBytes = async url => {
    calls.push(url);
    if (!(url in files)) throw new Error(`HTTP 404 for ${url}`);
    return files[url];
  };
  return { fetchBytes, calls };
}

/** A repository folder with the built `_site/` of a small catalog. */
function makeRoot(items, { guide = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ihub-offline-test-'));
  const site = path.join(root, '_site');
  fs.mkdirSync(path.join(site, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(site, 'apps'), { recursive: true });
  fs.mkdirSync(path.join(site, 'skills', 'native-skill'), { recursive: true });
  fs.writeFileSync(path.join(site, 'apps', 'chat.json'), '{"id":"chat"}\n');
  fs.writeFileSync(path.join(site, 'skills', 'native-skill', 'SKILL.md'), '# native\n');
  fs.writeFileSync(path.join(site, 'index.html'), '<html></html>\n');
  fs.writeFileSync(path.join(site, 'assets', 'config.js'), 'window.MARKETPLACE_CONFIG = { offline: false };\n');
  fs.writeFileSync(
    path.join(site, 'catalog.json'),
    JSON.stringify({ name: 'test', version: '2.3.4', items })
  );
  fs.writeFileSync(path.join(root, 'LICENSE'), 'BSD license text\n');
  if (guide) {
    fs.mkdirSync(path.join(root, 'docs'));
    fs.writeFileSync(path.join(root, 'docs', 'offline.md'), '# Offline\n');
  }
  return root;
}

const nativeItems = () => [
  {
    type: 'app',
    name: 'chat',
    version: '1.0.0',
    source: { type: 'relative', path: 'apps/chat.json' }
  },
  {
    type: 'skill',
    name: 'native-skill',
    version: '1.0.0',
    source: { type: 'relative', path: 'skills/native-skill/SKILL.md' }
  }
];

const bundleOf = root => path.join(root, '_offline', BUNDLE_NAME);
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const quiet = () => {};

/** Builds the bundle of a catalog with these items; the error, when it fails. */
async function build(items, { files = upstream(), ...options } = {}) {
  const root = makeRoot(items, options);
  const { fetchBytes, calls } = fakeFetch(files);
  try {
    const result = await buildOffline({ root, fetchBytes, archive: false, log: quiet, ...options });
    return { root, calls, result };
  } catch (error) {
    return { root, calls, error };
  }
}

test('copies a skill the catalog links to into the bundle and lists it as relative', async () => {
  const { root, result, error } = await build([...nativeItems(), urlSkill()]);
  assert.equal(error, undefined);
  const dir = bundleOf(root);

  const catalog = readJson(path.join(dir, 'catalog.json'));
  assert.equal(catalog.items.length, 3);
  const skill = catalog.items.find(item => item.name === 'gke-basics');
  assert.deepEqual(skill.source, {
    type: 'relative',
    path: 'skills/gke-basics/SKILL.md',
    companions: ['references/a.md', 'references/deep/b.md']
  });
  // Nothing but the source changed
  assert.deepEqual({ ...skill, source: null }, { ...urlSkill(), source: null });

  assert.equal(fs.readFileSync(path.join(dir, 'skills/gke-basics/SKILL.md'), 'utf8'), SKILL_MD);
  assert.equal(fs.readFileSync(path.join(dir, 'skills/gke-basics/references/deep/b.md'), 'utf8'), '# B\n');
  assert.equal(result.vendored, 1);
  assert.equal(result.items, 3);
});

test('keeps the license text of the upstream repository and the license of this one', async () => {
  const { root } = await build([...nativeItems(), urlSkill()]);
  const dir = bundleOf(root);

  assert.equal(
    fs.readFileSync(path.join(dir, `third-party/google/skills/${COMMIT}/LICENSE.txt`), 'utf8'),
    'Apache License\n'
  );
  assert.equal(fs.readFileSync(path.join(dir, 'LICENSE.txt'), 'utf8'), 'BSD license text\n');
});

test('records every copied file with its hash in offline-manifest.json', async () => {
  const { root } = await build([...nativeItems(), urlSkill()]);
  const manifest = readJson(path.join(bundleOf(root), 'offline-manifest.json'));

  assert.equal(manifest.catalogVersion, '2.3.4');
  assert.equal(manifest.items, 3);
  const [entry] = manifest.copiedFromUpstream;
  assert.equal(entry.name, 'gke-basics');
  assert.equal(entry.upstream, `${RAW}/SKILL.md`);
  assert.deepEqual(
    entry.files.map(file => file.path),
    ['skills/gke-basics/SKILL.md', 'skills/gke-basics/references/a.md', 'skills/gke-basics/references/deep/b.md']
  );
  assert.equal(
    entry.files[0].integrity,
    `sha256-${crypto.createHash('sha256').update(SKILL_MD).digest('base64')}`
  );
  assert.equal(manifest.licenses.length, 1);
});

test('switches the website to offline mode and ships the guide', async () => {
  const { root } = await build(nativeItems());
  const dir = bundleOf(root);

  assert.match(fs.readFileSync(path.join(dir, 'assets/config.js'), 'utf8'), /offline: true/);
  assert.equal(fs.readFileSync(path.join(dir, 'OFFLINE.md'), 'utf8'), '# Offline\n');
  // The built site it started from is not touched
  assert.match(fs.readFileSync(path.join(root, '_site/assets/config.js'), 'utf8'), /offline: false/);
});

test('--version names the archive, and the manifest records it', { skip: !spawnSync('tar', ['--version']).stdout }, async () => {
  const root = makeRoot([...nativeItems(), urlSkill()]);
  const { fetchBytes } = fakeFetch(upstream());
  const { archive } = await buildOffline({ root, fetchBytes, version: '202611032031', log: quiet });

  assert.equal(path.basename(archive), 'ihub-marketplace-offline-202611032031.tar.gz');
  assert.ok(fs.existsSync(`${archive}.sha256`));
  assert.equal(readJson(path.join(bundleOf(root), 'offline-manifest.json')).version, '202611032031');
});

test('without --version the manifest has none and the archive carries the catalog version', async () => {
  const { root } = await build(nativeItems());
  assert.equal(readJson(path.join(bundleOf(root), 'offline-manifest.json')).version, null);
});

test('refuses a version that is not safe in a file name', async () => {
  for (const bad of ['', '../x', 'a b', '1/2', '-rf', 'x'.repeat(65)]) {
    const root = makeRoot(nativeItems());
    await assert.rejects(buildOffline({ root, version: bad, log: quiet }), OfflineBuildError, bad);
  }
});

test('a catalog that needs no download builds without one', async () => {
  const { calls, error } = await build(nativeItems());
  assert.equal(error, undefined);
  assert.deepEqual(calls, []);
});

test('writes a .tar.gz with a matching .sha256 file', { skip: !spawnSync('tar', ['--version']).stdout }, async () => {
  const root = makeRoot([...nativeItems(), urlSkill()]);
  const { fetchBytes } = fakeFetch(upstream());
  const { archive } = await buildOffline({ root, fetchBytes, log: quiet });

  assert.match(path.basename(archive), /^ihub-marketplace-offline-2\.3\.4.*\.tar\.gz$/);
  const hex = crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
  assert.equal(fs.readFileSync(`${archive}.sha256`, 'utf8'), `${hex}  ${path.basename(archive)}\n`);
  const listing = spawnSync('tar', ['-tzf', archive], { encoding: 'utf8' }).stdout;
  assert.match(listing, new RegExp(`${BUNDLE_NAME}/catalog\\.json`));
  assert.match(listing, new RegExp(`${BUNDLE_NAME}/skills/gke-basics/references/deep/b\\.md`));
});

test('fails naming every download that failed, and copies nothing', async () => {
  const files = upstream();
  delete files[`${RAW}/references/a.md`];
  delete files[`https://raw.githubusercontent.com/google/skills/${COMMIT}/LICENSE`];
  const { root, error } = await build([...nativeItems(), urlSkill()], { files });

  assert.ok(error instanceof OfflineBuildError);
  assert.match(error.message, /2 download\(s\) failed/);
  assert.match(error.message, /references\/a\.md/);
  assert.match(error.message, /LICENSE/);
  assert.equal(fs.existsSync(path.join(bundleOf(root), 'skills/gke-basics')), false);
});

test('refuses a companion that leaves the skill folder, before downloading anything', async () => {
  for (const bad of ['../other/SKILL.md', '/etc/passwd', 'a//b.md', 'a\\b.md', './a.md', 'SKILL.md']) {
    const item = urlSkill();
    item.source.companions = [bad];
    const { calls, error } = await build([...nativeItems(), item]);
    assert.ok(error instanceof OfflineBuildError, bad);
    assert.deepEqual(calls, [], bad);
  }
});

test('refuses a skill that would replace one of the bundle', async () => {
  const { error } = await build([...nativeItems(), urlSkill({ name: 'native-skill' })]);
  assert.match(error.message, /skills\/native-skill\/ already exists/);
});

test('refuses sources it cannot make offline instead of leaving them out', async () => {
  const cases = [
    [{ type: 'app', name: 'x', source: { type: 'url', url: 'https://example.com/x/SKILL.md' } }, /only skills/],
    [{ type: 'skill', name: 'x', source: { type: 'github', owner: 'o', repo: 'r', path: 'p' } }, /"github" cannot be made offline/],
    [{ type: 'skill', name: 'x', source: { type: 'relative', path: 'skills/x/SKILL.md', rawBase: 'https://example.com' } }, /rawBase/],
    [urlSkill({ source: { type: 'url', url: 'http://example.com/SKILL.md' } }), /not an https URL of a SKILL\.md/],
    [urlSkill({ source: { type: 'url', url: 'https://example.com/readme.md' } }), /not an https URL of a SKILL\.md/],
    [urlSkill({ name: '../evil' }), /not a valid skill folder name/]
  ];
  for (const [item, pattern] of cases) {
    const { error } = await build([...nativeItems(), item]);
    assert.ok(error instanceof OfflineBuildError, JSON.stringify(item.source));
    assert.match(error.message, pattern);
  }
});

test('refuses a skill whose SKILL.md names another skill', async () => {
  const files = upstream();
  files[`${RAW}/SKILL.md`] = Buffer.from('---\nname: other\n---\n');
  const { error } = await build([...nativeItems(), urlSkill()], { files });
  assert.match(error.message, /names itself "other"/);
});

test('refuses a license it cannot bundle', async () => {
  const { error } = await build([
    ...nativeItems(),
    urlSkill({ licenseUrl: 'https://example.com/license' })
  ]);
  assert.match(error.message, /license text cannot be bundled/);
});

test('fails when a file the catalog lists is not in the bundle', async () => {
  const items = nativeItems();
  items[1].source.companions = ['references/missing.md'];
  const { error } = await build(items);
  assert.match(error.message, /not self-contained/);
  assert.match(error.message, /references\/missing\.md is missing/);
});

test('fails when a version descriptor is not in the bundle', async () => {
  const items = nativeItems();
  items[0].versions = [{ version: '1.0.0', ref: 'versions/integrations/x/1.0.0.json' }];
  const { error } = await build(items);
  assert.match(error.message, /version descriptor versions\/integrations\/x\/1\.0\.0\.json/);
});

test('says to build the site first when _site/ is missing', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ihub-offline-test-'));
  await assert.rejects(buildOffline({ root, log: quiet }), /build the site first/);
});

test('companionPath accepts folders below the skill and nothing else', () => {
  assert.equal(companionPath('references/a.md'), 'references/a.md');
  for (const bad of ['', '..', '../a', 'a/../b', '/a', 'a/', 'a\\b', null, 7]) {
    assert.throws(() => companionPath(bad), OfflineBuildError);
  }
});

test('frontMatterName reads the name of a SKILL.md', () => {
  assert.equal(frontMatterName('---\nname: abc\n---\n'), 'abc');
  assert.equal(frontMatterName('---\r\ndescription: x\r\nname: "abc"\r\n---\r\n'), 'abc');
  assert.equal(frontMatterName('﻿---\nname: abc\n---\n'), 'abc');
  assert.equal(frontMatterName('# no front matter'), null);
});

test('licenseTarget understands a GitHub blob link to a LICENSE file only', () => {
  assert.deepEqual(licenseTarget(LICENSE_URL), {
    rawUrl: `https://raw.githubusercontent.com/google/skills/${COMMIT}/LICENSE`,
    bundlePath: `third-party/google/skills/${COMMIT}/LICENSE.txt`
  });
  assert.equal(licenseTarget('https://github.com/o/r/blob/main/LICENSE.md'), null);
  assert.equal(licenseTarget('https://example.com/LICENSE'), null);
  assert.equal(licenseTarget(undefined), null);
});

// ---------- scripts/check-served-bundle.js ----------

const http = require('node:http');
const { checkServedBundle } = require('../check-served-bundle.js');

/** Serves a folder over HTTP; `hide` lists paths that answer 404. */
function serve(dir, hide = []) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = path.join(dir, url);
    if (hide.includes(url.slice(1)) || !file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200).end(fs.readFileSync(file));
  });
  return new Promise(resolve =>
    server.listen(0, '127.0.0.1', () =>
      resolve({ address: `http://127.0.0.1:${server.address().port}/`, close: () => server.close() })
    )
  );
}

test('check-served-bundle accepts a bundle that is served completely', async () => {
  const { root } = await build([...nativeItems(), urlSkill()]);
  const server = await serve(bundleOf(root));
  try {
    const result = await checkServedBundle(server.address);
    assert.deepEqual(result.problems, []);
    assert.equal(result.items, 3);
    // index.html, the app, the native skill, the copied skill and its two companions
    assert.equal(result.files, 6);
  } finally {
    server.close();
  }
});

test('check-served-bundle names a file the web server does not serve', async () => {
  const { root } = await build([...nativeItems(), urlSkill()]);
  const server = await serve(bundleOf(root), ['skills/gke-basics/references/a.md']);
  try {
    const { problems } = await checkServedBundle(server.address);
    assert.deepEqual(problems, ['skills/gke-basics/references/a.md: HTTP 404']);
  } finally {
    server.close();
  }
});

test('check-served-bundle flags an item that still points away from the bundle', async () => {
  // The built site as GitHub Pages serves it: the skill is still a url source
  const root = makeRoot([...nativeItems(), urlSkill()]);
  const server = await serve(path.join(root, '_site'));
  try {
    const { problems } = await checkServedBundle(server.address);
    assert.equal(problems.length, 1);
    assert.match(problems[0], /skill:gke-basics: source is not in the bundle \(https:\/\/raw\.githubusercontent\.com/);
  } finally {
    server.close();
  }
});

test('check-served-bundle reports a server without catalog.json', async () => {
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'ihub-offline-empty-'));
  const server = await serve(empty);
  try {
    const { problems } = await checkServedBundle(server.address);
    assert.deepEqual(problems, ['catalog.json: HTTP 404']);
  } finally {
    server.close();
  }
});
