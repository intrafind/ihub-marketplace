#!/usr/bin/env node
// Publishes every released version of every integration next to the site, so
// iHub can install or update to a version that is not the current one (a
// registry pin such as "1.3.x") and keep the definition of every version an
// update passes for a later Revert (versioning phase 3).
//
// The site is static (GitHub Pages), so it cannot answer `?version=`. Instead,
// for each release tag `integrations/<id>@<version>` (tag-integrations.js) it
// writes into the built site:
//
//   versions/integrations/<folder>/<version>/        the folder as it was at the tag
//   versions/integrations/<folder>/<version>.json    the version descriptor: a catalog
//                                                    item of that version (its own
//                                                    version, compatibility, releases,
//                                                    migrations, companions and integrity)
//
// and adds to the integration item of the built catalog.json
//
//   "versions": [{ "version": "1.3.2", "ref": "versions/integrations/<folder>/1.3.2.json" }, …]
//
// newest first (the last MAX_VERSIONS). iHub resolves `ref` against the
// catalog URL, fetches the descriptor and installs from its `source` with the
// same hash check as any install. The committed catalog.json carries no
// `versions`: tags exist only after a release, so the published copy is the
// only place they can be added without the repository going out of sync.
//
// Without git or without tags it leaves the catalog as it is.
//
// Usage: node scripts/build-versions.js <site-dir>
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { derive, applyDerived } = require('./sync-integrations');
const { GIT, ROOT, folderOf, git, releaseTags } = require('./integration-tags');

const MAX_VERSIONS = 50;

/**
 * Write the folder of an integration as it was at a tag into `target`.
 * Binary-safe: every file is read as bytes from the tag's tree.
 *
 * @returns {boolean} whether the folder existed at the tag
 */
function exportFolder(tag, folder, target) {
  const prefix = `integrations/${folder}/`;
  const listing = git(ROOT, ['ls-tree', '-r', '--name-only', tag, '--', prefix]);
  if (!listing) return false;
  const files = listing
    .split('\n')
    .map(line => line.trim())
    .filter(file => file.startsWith(prefix));
  if (!files.includes(`${prefix}integration.json`)) return false;
  fs.rmSync(target, { recursive: true, force: true });
  for (const file of files) {
    const rel = file.slice(prefix.length);
    if (rel.split('/').some(part => part === '..' || part === '')) continue;
    const content = git(ROOT, ['show', `${tag}:${file}`], { binary: true });
    if (content === null) throw new Error(`cannot read ${file} at ${tag}`);
    const out = path.join(target, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, content);
  }
  return true;
}

/**
 * The descriptor of one version: the current catalog item's own fields
 * (names, description, category, license, …) with everything the folder
 * decides taken from the folder at the tag.
 */
function descriptorOf(item, folder, version, exportDir) {
  const derived = derive(folder, exportDir);
  if (derived.version !== version) {
    throw new Error(`the folder at the tag says ${derived.version}, the tag ${version}`);
  }
  const next = applyDerived({ ...item }, derived);
  delete next.versions;
  next.source = {
    ...next.source,
    type: 'relative',
    path: `versions/integrations/${folder}/${version}/integration.json`
  };
  return next;
}

function main() {
  const site = process.argv[2];
  if (!site) {
    console.error('Usage: node scripts/build-versions.js <site-dir>');
    process.exit(2);
  }
  const catalogFile = path.join(site, 'catalog.json');
  const catalog = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
  if (!GIT) {
    console.warn('build-versions: git is not installed; the catalog lists no versions');
    return;
  }
  let published = 0;
  for (const item of catalog.items || []) {
    if (item.type !== 'integration' || item.source?.type !== 'relative') continue;
    const folder = item.name;
    const definitionFile = path.join(ROOT, 'integrations', folder, 'integration.json');
    if (!fs.existsSync(definitionFile)) continue;
    const { id } = JSON.parse(fs.readFileSync(definitionFile, 'utf8'));
    if (typeof id !== 'string' || folderOf(id) !== folder) continue;
    const versions = [];
    for (const { tag, version } of releaseTags(ROOT, id).slice(0, MAX_VERSIONS)) {
      const base = `versions/integrations/${folder}/${version}`;
      const exportDir = path.join(site, base);
      if (!exportFolder(tag, folder, exportDir)) {
        console.warn(`build-versions: ${tag} has no folder integrations/${folder}; skipped`);
        continue;
      }
      const descriptor = descriptorOf(item, folder, version, exportDir);
      fs.writeFileSync(path.join(site, `${base}.json`), `${JSON.stringify(descriptor, null, 2)}\n`);
      versions.push({ version, ref: `${base}.json` });
      published += 1;
    }
    if (versions.length > 0) item.versions = versions;
  }
  fs.writeFileSync(catalogFile, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`build-versions: published ${published} integration version(s)`);
}

main();
