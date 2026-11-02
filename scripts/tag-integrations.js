#!/usr/bin/env node
// Tags every released integration version: for each definition folder on
// HEAD, `integrations/<id>@<version>` must exist. A missing tag is created on
// HEAD (annotated, "<id> <version>"), so every version that reaches main stays
// reachable after the folder moves on: build-versions.js publishes one
// descriptor per tag, which iHub fetches for a pinned install or update and
// for the backup of every version an update passes (versioning phase 3).
//
// An existing tag is never moved. When it exists but the folder on HEAD
// differs from the folder at the tag, the version was changed without a bump
// (validate.js refuses that on a pull request), and this script fails instead
// of publishing two different folders under one version.
//
// The workflow runs it on every push to main, before the site is built.
//
// Usage: node scripts/tag-integrations.js [--push] [--dry-run]
//   --push     push the tags it created to origin
//   --dry-run  only print what it would tag
'use strict';

const { GIT, ROOT, VERSION, git, tagName } = require('./integration-tags');

function main() {
  const push = process.argv.includes('--push');
  const dryRun = process.argv.includes('--dry-run');
  if (!GIT) {
    console.error('tag-integrations: git is not installed');
    process.exit(1);
  }
  const listing = git(ROOT, ['ls-tree', '--name-only', 'HEAD', 'integrations/']);
  if (listing === null) {
    console.error('tag-integrations: cannot read HEAD');
    process.exit(1);
  }
  const folders = listing
    .split('\n')
    .map(line => line.trim().replace(/^integrations\//, ''))
    .filter(name => name && !name.startsWith('.'));
  const created = [];
  const problems = [];
  for (const folder of folders) {
    const text = git(ROOT, ['show', `HEAD:integrations/${folder}/integration.json`]);
    if (!text) continue;
    let definition;
    try {
      definition = JSON.parse(text);
    } catch {
      problems.push(`integrations/${folder}: integration.json does not parse on HEAD`);
      continue;
    }
    const { id, version } = definition;
    if (typeof id !== 'string' || !VERSION.test(String(version))) {
      problems.push(`integrations/${folder}: no id or no semantic version on HEAD`);
      continue;
    }
    const tag = tagName(id, version);
    const tagged = git(ROOT, ['rev-parse', '--verify', '--quiet', `refs/tags/${tag}^{commit}`]);
    if (tagged) {
      const atTag = git(ROOT, ['rev-parse', `${tagged.trim()}:integrations/${folder}`]);
      const atHead = git(ROOT, ['rev-parse', `HEAD:integrations/${folder}`]);
      if (atTag && atHead && atTag.trim() !== atHead.trim()) {
        problems.push(
          `integrations/${folder}: ${tag} exists, but the folder changed since without a version bump`
        );
      }
      continue;
    }
    if (dryRun) {
      console.log(`would tag ${tag}`);
      created.push(tag);
      continue;
    }
    if (git(ROOT, ['tag', '-a', tag, '-m', `${id} ${version}`, 'HEAD']) === null) {
      problems.push(`integrations/${folder}: could not create ${tag}`);
      continue;
    }
    console.log(`tagged ${tag}`);
    created.push(tag);
  }
  if (push && !dryRun && created.length > 0) {
    if (git(ROOT, ['push', 'origin', ...created.map(tag => `refs/tags/${tag}`)]) === null) {
      problems.push(`could not push ${created.join(', ')}`);
    } else {
      console.log(`pushed ${created.length} tag(s)`);
    }
  }
  if (problems.length > 0) {
    console.error(`tag-integrations: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  if (created.length === 0) console.log('tag-integrations: every integration version is tagged');
}

main();
