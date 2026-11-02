// Tests of the release versions of integrations: scripts/tag-integrations.js
// (a tag `integrations/<id>@<version>` per released version), the published
// versions of scripts/build-versions.js (one folder and one descriptor per
// tag, `versions` on the catalog item), and scripts/validate.js comparing a
// changed folder with the previous release tag instead of main.
//
// Run: node --test scripts/test/*.test.js
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { BASE_INSTALL, FOLDER, GIT, Repo, definition } = require('./fixture');

const TAG = version => `integrations/org.example/test@${version}`;

function withRepo(fn) {
  const repo = new Repo();
  try {
    return fn(repo);
  } finally {
    repo.remove();
  }
}

/** Version `version` of the base definition, with the history down to 1.0.0. */
function release(version, options = {}) {
  const history = ['1.2.0', '1.1.0', '1.0.0'].filter(v => v <= version);
  return definition({ version, releaseVersions: history, ...options });
}

function tags(repo) {
  return repo
    .git('tag', '--list', 'integrations/*')
    .split('\n')
    .filter(Boolean)
    .sort();
}

describe('tag-integrations', { skip: !GIT && 'git is not installed' }, () => {
  it('tags every released version on HEAD once, and never moves a tag', () => {
    withRepo(repo => {
      repo.write(release('1.0.0'));
      repo.commit('1.0.0');
      let result = repo.run('tag-integrations.js');
      assert.equal(result.status, 0, result.output);
      assert.match(result.output, /tagged integrations\/org\.example\/test@1\.0\.0/);
      assert.deepEqual(tags(repo), [TAG('1.0.0')]);

      result = repo.run('tag-integrations.js');
      assert.equal(result.status, 0, result.output);
      assert.match(result.output, /every integration version is tagged/);

      repo.write(release('1.1.0'));
      repo.commit('1.1.0');
      assert.equal(repo.run('tag-integrations.js', '--dry-run').status, 0);
      assert.deepEqual(tags(repo), [TAG('1.0.0')], 'a dry run tags nothing');
      assert.equal(repo.run('tag-integrations.js').status, 0);
      assert.deepEqual(tags(repo), [TAG('1.0.0'), TAG('1.1.0')]);
    });
  });

  it('fails when a tagged version changed on HEAD without a bump', () => {
    withRepo(repo => {
      repo.write(release('1.0.0'));
      repo.commit('1.0.0');
      assert.equal(repo.run('tag-integrations.js').status, 0);
      repo.writeFile('README.md', '# changed\n');
      repo.write(release('1.0.0'));
      repo.commit('changed without a bump');
      const result = repo.run('tag-integrations.js');
      assert.equal(result.status, 1, result.output);
      assert.match(
        result.output,
        /integrations\/org\.example\/test@1\.0\.0 exists, but the folder changed since without a version bump/
      );
    });
  });
});

describe('build-versions', { skip: !GIT && 'git is not installed' }, () => {
  it('publishes a folder and a descriptor per tag and lists them on the catalog item', () => {
    withRepo(repo => {
      repo.write(release('1.0.0'));
      repo.writeFile('notes.md', 'one\n');
      repo.write(release('1.0.0'));
      repo.commit('1.0.0');
      repo.run('tag-integrations.js');
      repo.writeFile('notes.md', 'two\n');
      repo.write(release('1.1.0'));
      repo.commit('1.1.0');
      repo.run('tag-integrations.js');

      const site = fs.mkdtempSync(path.join(os.tmpdir(), 'marketplace-site-'));
      try {
        fs.copyFileSync(path.join(repo.root, 'catalog.json'), path.join(site, 'catalog.json'));
        const result = repo.run('build-versions.js', site);
        assert.equal(result.status, 0, result.output);
        assert.match(result.output, /published 2 integration version\(s\)/);

        const item = JSON.parse(fs.readFileSync(path.join(site, 'catalog.json'), 'utf8')).items[0];
        assert.deepEqual(item.versions, [
          { version: '1.1.0', ref: `versions/integrations/${FOLDER}/1.1.0.json` },
          { version: '1.0.0', ref: `versions/integrations/${FOLDER}/1.0.0.json` }
        ]);
        const descriptor = JSON.parse(
          fs.readFileSync(path.join(site, `versions/integrations/${FOLDER}/1.0.0.json`), 'utf8')
        );
        assert.equal(descriptor.type, 'integration');
        assert.equal(descriptor.name, FOLDER);
        assert.equal(descriptor.version, '1.0.0');
        assert.equal(descriptor.displayName.en, 'Example', 'the item fields are kept');
        assert.equal(descriptor.versions, undefined);
        assert.equal(
          descriptor.source.path,
          `versions/integrations/${FOLDER}/1.0.0/integration.json`
        );
        assert.deepEqual(descriptor.source.companions, ['notes.md']);
        const exported = path.join(site, `versions/integrations/${FOLDER}/1.0.0`);
        assert.equal(fs.readFileSync(path.join(exported, 'notes.md'), 'utf8'), 'one\n');
        assert.equal(
          JSON.parse(fs.readFileSync(path.join(exported, 'integration.json'), 'utf8')).version,
          '1.0.0'
        );
        const hash = `sha256-${crypto
          .createHash('sha256')
          .update(fs.readFileSync(path.join(exported, 'notes.md')))
          .digest('base64')}`;
        assert.equal(descriptor.source.integrity['notes.md'], hash, 'the integrity of that version');
      } finally {
        fs.rmSync(site, { recursive: true, force: true });
      }
    });
  });

  it('leaves the catalog without versions when nothing is tagged', () => {
    withRepo(repo => {
      repo.write(release('1.0.0'));
      repo.commit('1.0.0');
      const site = fs.mkdtempSync(path.join(os.tmpdir(), 'marketplace-site-'));
      try {
        fs.copyFileSync(path.join(repo.root, 'catalog.json'), path.join(site, 'catalog.json'));
        assert.equal(repo.run('build-versions.js', site).status, 0);
        const item = JSON.parse(fs.readFileSync(path.join(site, 'catalog.json'), 'utf8')).items[0];
        assert.equal(item.versions, undefined);
      } finally {
        fs.rmSync(site, { recursive: true, force: true });
      }
    });
  });
});

describe('validate against the previous release', { skip: !GIT && 'git is not installed' }, () => {
  it('compares a changed folder with the newest release tag, not with main', () => {
    withRepo(repo => {
      repo.write(release('1.0.0'));
      repo.publish(); // main: 1.0.0, now on the branch "change"
      repo.write(release('1.1.0'));
      repo.commit('1.1.0');
      repo.git('tag', '-a', TAG('1.1.0'), '-m', 'org.example/test 1.1.0');
      // Against main (1.0.0) this would be a fine bump; against the release 1.1.0 it is a
      // change without one.
      repo.writeFile('README.md', '# changed\n');
      repo.write(release('1.1.0'));
      const result = repo.validate();
      assert.equal(result.status, 1, result.output);
      assert.match(
        result.output,
        /the folder changed since integrations\/org\.example\/test@1\.1\.0 but version is still 1\.1\.0/
      );
    });
  });

  it('checks the migrations between the release tag and the new version', () => {
    withRepo(repo => {
      repo.write(release('1.0.0'));
      repo.commit('1.0.0');
      repo.git('tag', '-a', TAG('1.0.0'), '-m', 'org.example/test 1.0.0');
      const install = BASE_INSTALL.filter(field => field.key !== 'filter');
      repo.write(release('1.1.0', { install }));
      let result = repo.validate();
      assert.equal(result.status, 1, result.output);
      assert.match(result.output, /install field "filter" is gone since 1\.0\.0 on integrations\/org\.example\/test@1\.0\.0/);

      // A module step between the versions counts as handling it: its code is not inspected.
      repo.writeFile('migrations/1.1.0.js', 'export const up = ({ instance }) => instance;\n');
      repo.write(
        release('1.1.0', { install, migrations: [{ id: '1.1.0', steps: [{ module: 'migrations/1.1.0.js' }] }] })
      );
      result = repo.validate();
      assert.equal(result.status, 0, result.output);
    });
  });
});
