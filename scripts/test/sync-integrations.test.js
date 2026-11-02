// Tests of the migrations copy of scripts/sync-integrations.js: which
// migrations a catalog item carries, and that --check notices when they
// drift from the definition.
//
// Run: node --test scripts/test/*.test.js
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { Repo, definition } = require('./fixture');

/** Releases 1.21.0 down to 1.0.0 (22 entries, 2 more than the catalog carries), newest first. */
const VERSIONS = Array.from({ length: 22 }, (_, i) => `1.${21 - i}.0`);

const step = key => ({ removeValue: { key } });

function withRepo(fn) {
  const repo = new Repo();
  try {
    return fn(repo);
  } finally {
    repo.remove();
  }
}

describe('sync-integrations: migrations', () => {
  it('copies the migrations the carried releases name, and the name on each release', () => {
    withRepo(repo => {
      const migrations = [
        { id: '1.1.0', steps: [step('oldest')] },
        { id: '1.5.0', steps: [step('middle')] },
        { id: '1.21.0', steps: [step('newest')] }
      ];
      repo.write(definition({ version: '1.21.0', releaseVersions: VERSIONS, migrations }));
      const item = repo.catalogItem();

      assert.equal(item.releases.length, 20);
      assert.equal(item.releases.at(-1).version, '1.2.0');
      assert.deepEqual(
        item.migrations,
        migrations.filter(migration => migration.id !== '1.1.0')
      );
      assert.equal(item.releases.find(release => release.version === '1.5.0').migration, '1.5.0');
      assert.equal(item.releases.find(release => release.version === '1.4.0').migration, undefined);
      const validated = repo.validate();
      assert.equal(validated.status, 0, validated.output);
    });
  });

  it('writes no migrations key when no carried release names one', () => {
    withRepo(repo => {
      repo.write(definition());
      assert.equal(Object.hasOwn(repo.catalogItem(), 'migrations'), false);
    });
  });

  it('--check fails when the migrations in catalog.json differ from the definition', () => {
    withRepo(repo => {
      const migrations = [{ id: '1.1.0', steps: [step('legacy')] }];
      const options = { version: '1.1.0', releaseVersions: ['1.1.0', '1.0.0'] };
      repo.write(definition({ ...options, migrations }));
      assert.equal(repo.run('sync-integrations.js', '--check').status, 0);

      repo.write(definition({ ...options, migrations: [{ id: '1.1.0', steps: [step('other')] }] }), { sync: false });
      const result = repo.run('sync-integrations.js', '--check');
      assert.equal(result.status, 1, result.output);
      assert.match(result.output, /catalog\.json is out of date for 1 integration item\(s\): org\.example__test/);
    });
  });
});
