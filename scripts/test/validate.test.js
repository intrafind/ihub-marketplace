// Tests of the migration checks of scripts/validate.js: the format of
// `migrations` and `releases[].migration`, and the structural diff against
// the definition on `main` that a version bump must cover with migrations.
//
// Run: node --test scripts/test/*.test.js
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { BASE_ACTIONS, BASE_INSTALL, GIT, Repo, definition, validateDefinition, validateUpdate } = require('./fixture');

/** Version 1.1.0 of the base definition with the given changes. */
function bump(options = {}) {
  return definition({ version: '1.1.0', releaseVersions: ['1.1.0', '1.0.0'], ...options });
}

/** Migration 1.1.0 with the given steps. */
const migration = (...steps) => [{ id: '1.1.0', steps }];

const without = (list, key, prop = 'key') => list.filter(entry => entry[prop] !== key);

function assertFails(result, ...messages) {
  assert.equal(result.status, 1, result.output);
  for (const message of messages) assert.ok(result.output.includes(message), `expected "${message}" in:\n${result.output}`);
}

function assertPasses(result) {
  assert.equal(result.status, 0, result.output);
}

describe('migration format', () => {
  it('accepts every declarative step in a migration its release names', () => {
    assertPasses(
      validateDefinition(
        bump({
          migrations: migration(
            { renameValue: { from: 'fq', to: 'filter' } },
            { setValue: { key: 'filter', value: null } },
            { setValue: { key: 'profile', value: 'plain', when: 'always' } },
            { removeValue: { key: 'legacy' } },
            { mapValue: { key: 'profile', map: { ckan: 'plain', 'dcat-ap-de': 'dcat' } } },
            { renameAction: { from: 'find', to: 'search' } },
            { removeAction: { name: 'status' } },
            { renameScope: { from: 'stadt-norderstedt', to: 'norderstedt' } }
          )
        })
      )
    );
  });

  it('accepts a module step whose file is in the folder, bundled and hashed in the catalog', () => {
    const repo = new Repo();
    try {
      repo.writeFile('migrations/1.1.0.js', 'export function up({ instance }) { return instance; }\n');
      repo.write(bump({ migrations: migration({ module: 'migrations/1.1.0.js' }) }));
      assertPasses(repo.validate());
      assert.match(repo.catalogItem().source.integrity['migrations/1.1.0.js'], /^sha256-/);
    } finally {
      repo.remove();
    }
  });

  it('refuses a module step outside migrations/, a missing module, a sibling import and a missing hash', () => {
    assertFails(
      validateDefinition(bump({ migrations: migration({ module: 'connector.js' }) })),
      'migrations[0].steps[0].module must name a file migrations/<name>.js (or .mjs) of the folder'
    );
    assertFails(
      validateDefinition(bump({ migrations: migration({ module: 'migrations/1.1.0.js' }) })),
      'migrations[0].steps[0]: the module migrations/1.1.0.js is missing from integrations/org.example__test'
    );
    const repo = new Repo();
    const unsynced = new Repo();
    try {
      repo.writeFile('migrations/1.1.0.js', "import { x } from './lib.js';\nexport const up = i => i;\n");
      repo.write(bump({ migrations: migration({ module: 'migrations/1.1.0.js' }) }));
      assertFails(repo.validate(), 'the module migrations/1.1.0.js imports ./lib.js; bundle it into one file');
      // The module added after the catalog was synced: it has no hash there.
      unsynced.write(bump({ migrations: migration({ module: 'migrations/1.1.0.js' }) }));
      unsynced.writeFile('migrations/1.1.0.js', 'export const up = i => i;\n');
      assertFails(
        unsynced.validate(),
        'catalog.json is out of date',
        'the module migrations/1.1.0.js has no hash in the catalog item'
      );
    } finally {
      repo.remove();
      unsynced.remove();
    }
  });

  it('refuses a step that is not exactly one declarative step', () => {
    assertFails(
      validateDefinition(
        bump({
          migrations: migration(
            { renameValue: { from: 'a', to: 'b' }, removeValue: { key: 'c' } },
            { renameField: { from: 'a', to: 'b' } },
            'removeValue'
          )
        })
      ),
      'migrations[0].steps[0] must be an object with exactly one step (renameValue, setValue, removeValue, mapValue, renameAction, removeAction, renameScope, module)',
      'migrations[0].steps[1]: unknown step "renameField"; use one of renameValue',
      'migrations[0].steps[2] must be an object with exactly one step'
    );
  });

  it('checks the arguments of each step', () => {
    assertFails(
      validateDefinition(
        bump({
          migrations: migration(
            { renameValue: { from: 'fq' } },
            { setValue: { key: 'rows', value: 20, when: 'sometimes' } },
            { setValue: { key: 'rows' } },
            { removeValue: { key: '1st' } },
            { mapValue: { key: 'profile', map: {} } },
            { renameAction: { from: 'search', to: 'search' } },
            { removeAction: { name: 'status', reason: 'gone' } },
            { renameScope: { from: '', to: 'x' } }
          )
        })
      ),
      'migrations[0].steps[0].renameValue.to is missing',
      'migrations[0].steps[1].setValue.when must be "missing" or "always": "sometimes"',
      'migrations[0].steps[2].setValue.value is missing',
      'migrations[0].steps[3].removeValue.key must be an install field key (a letter, then letters, digits and _): "1st"',
      'migrations[0].steps[4].mapValue.map must map at least one old value to a new one',
      'migrations[0].steps[5].renameAction: from and to are the same ("search")',
      'migrations[0].steps[6].removeAction: unknown argument "reason"',
      'migrations[0].steps[7].renameScope.from must be a scope id'
    );
  });

  it('needs a semantic, unique id and at least one step', () => {
    const result = validateDefinition({
      ...bump(),
      migrations: [
        { id: 'next', steps: [{ removeValue: { key: 'a' } }] },
        { id: '1.1.0', steps: [] },
        { id: '1.1.0', steps: [{ removeValue: { key: 'a' } }] }
      ]
    });
    assertFails(
      result,
      'migrations[0]: id "next" is not semantic',
      'migrations[1]: steps must list at least one step',
      'migrations[2]: id 1.1.0 is listed twice'
    );
  });

  it('needs releases[].migration to be the release version and to name a migration', () => {
    const own = bump({ migrations: migration({ removeValue: { key: 'a' } }) });
    own.releases[0].migration = '1.0.0';
    assertFails(validateDefinition(own), 'releases[0]: migration "1.0.0" must be the release\'s own version 1.1.0');

    const missing = bump();
    missing.releases[0].migration = '1.1.0';
    assertFails(
      validateDefinition(missing),
      'releases[0]: migration 1.1.0 is not in migrations; add { "id": "1.1.0", "steps": [ … ] }'
    );
  });

  it('needs every migration named by the release of its version', () => {
    const unnamed = bump({ migrations: migration({ removeValue: { key: 'a' } }) });
    delete unnamed.releases[0].migration;
    assertFails(
      validateDefinition(unnamed),
      'migration 1.1.0 is not named by its release; add "migration": "1.1.0" to the releases entry 1.1.0'
    );

    assertFails(
      validateDefinition({ ...bump(), migrations: [{ id: '1.0.5', steps: [{ removeValue: { key: 'a' } }] }] }),
      'migration 1.0.5 has no releases entry 1.0.5'
    );
  });
});

describe('structural diff against main', { skip: !GIT && 'git is not installed' }, () => {
  const base = definition();

  it('passes a version bump that changes no install field and no action', () => {
    assertPasses(validateUpdate(base, bump()));
  });

  it('fails when an install field is gone and no migration renames or removes it', () => {
    assertFails(
      validateUpdate(base, bump({ install: without(BASE_INSTALL, 'filter') })),
      'install field "filter" is gone since 1.0.0 on main, and no migration in (1.0.0, 1.1.0] renames or removes it; add { "renameValue": { "from": "filter", "to": "<new key>" } } or { "removeValue": { "key": "filter" } } to migration 1.1.0'
    );
  });

  it('passes a renamed or removed install field with its migration', () => {
    const renamed = [...without(BASE_INSTALL, 'filter'), { key: 'defaultFilter', type: 'string', title: { en: 'Filter' } }];
    assertPasses(
      validateUpdate(
        base,
        bump({ install: renamed, migrations: migration({ renameValue: { from: 'filter', to: 'defaultFilter' } }) })
      )
    );
    assertPasses(
      validateUpdate(
        base,
        bump({ install: without(BASE_INSTALL, 'filter'), migrations: migration({ removeValue: { key: 'filter' } }) })
      )
    );
  });

  it('does not count a mapValue for a field that is gone', () => {
    assertFails(
      validateUpdate(
        base,
        bump({ install: without(BASE_INSTALL, 'filter'), migrations: migration({ mapValue: { key: 'filter', map: { a: 'b' } } }) })
      ),
      'install field "filter" is gone since 1.0.0 on main, and no migration in (1.0.0, 1.1.0] renames or removes it (a mapValue rewrites the value but keeps the key)'
    );
  });

  it('counts only migrations between the two versions', () => {
    const older = migration({ removeValue: { key: 'filter' } });
    const from = definition({ version: '1.1.0', releaseVersions: ['1.1.0', '1.0.0'], migrations: older });
    const next = definition({
      version: '1.2.0',
      releaseVersions: ['1.2.0', '1.1.0', '1.0.0'],
      migrations: older,
      install: without(BASE_INSTALL, 'filter')
    });
    assertFails(validateUpdate(from, next), 'install field "filter" is gone since 1.1.0 on main, and no migration in (1.1.0, 1.2.0]');
  });

  it('skips sensitive and per-user fields, which installations do not keep in their values', () => {
    const withUserField = [...BASE_INSTALL, { key: 'nickname', type: 'string', title: { en: 'Name' }, scope: 'user' }];
    assertPasses(
      validateUpdate(definition({ install: withUserField }), bump({ install: without(BASE_INSTALL, 'apiToken') }))
    );
  });

  it('fails when an enum choice is gone and no migration maps it', () => {
    const profile = {
      ...BASE_INSTALL[2],
      choices: [
        { value: 'plain', label: { en: 'Plain' } },
        { value: 'dcat-ap', label: { en: 'DCAT-AP' } }
      ]
    };
    const install = BASE_INSTALL.map(field => (field.key === 'profile' ? profile : field));
    assertFails(
      validateUpdate(base, bump({ install })),
      'install field "profile" no longer offers the choice "dcat" (since 1.0.0 on main), and no migration in (1.0.0, 1.1.0] maps it; add { "mapValue": { "key": "profile", "map": { "dcat": <new choice> } } } to migration 1.1.0'
    );
    assertPasses(
      validateUpdate(base, bump({ install, migrations: migration({ mapValue: { key: 'profile', map: { dcat: 'dcat-ap' } } }) }))
    );
  });

  it('fails when an install field every installation needs has no setValue', () => {
    const region = { key: 'region', type: 'string', title: { en: 'Region' }, required: true };
    assertFails(
      validateUpdate(base, bump({ install: [...BASE_INSTALL, region] })),
      'install field "region" is new and required without a default, and no migration in (1.0.0, 1.1.0] sets it; add { "setValue": { "key": "region", "value": <value>, "when": "missing" } } to migration 1.1.0'
    );
    assertPasses(
      validateUpdate(
        base,
        bump({ install: [...BASE_INSTALL, region], migrations: migration({ setValue: { key: 'region', value: 'eu', when: 'missing' } }) })
      )
    );
    assertPasses(validateUpdate(base, bump({ install: [...BASE_INSTALL, { ...region, default: 'eu' }] })));

    const nowRequired = BASE_INSTALL.map(field => (field.key === 'filter' ? { ...field, required: true } : field));
    assertFails(
      validateUpdate(base, bump({ install: nowRequired })),
      'install field "filter" is now required without a default, and no migration in (1.0.0, 1.1.0] sets it'
    );
  });

  it('fails when an action is gone and no migration renames or removes it', () => {
    assertFails(
      validateUpdate(base, bump({ actions: without(BASE_ACTIONS, 'get_item', 'name') })),
      'action "get_item" is gone since 1.0.0 on main, and no migration in (1.0.0, 1.1.0] renames or removes it; add { "renameAction": { "from": "get_item", "to": "<new name>" } } or { "removeAction": { "name": "get_item" } } to migration 1.1.0'
    );
  });

  it('passes a renamed or removed action with its migration', () => {
    const renamed = [...without(BASE_ACTIONS, 'get_item', 'name'), { name: 'item_get', title: { en: 'Get item' } }];
    assertPasses(
      validateUpdate(base, bump({ actions: renamed, migrations: migration({ renameAction: { from: 'get_item', to: 'item_get' } }) }))
    );
    assertPasses(
      validateUpdate(
        base,
        bump({ actions: without(BASE_ACTIONS, 'get_item', 'name'), migrations: migration({ removeAction: { name: 'get_item' } }) })
      )
    );
  });
});
