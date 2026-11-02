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
//   - a definition migration (`migrations[]`) is malformed: its id is not a
//     version, it has no steps, a step is not exactly one of the declarative
//     steps or has bad arguments, or it is a `module` step (code migrations
//     are not supported yet);
//   - `releases[].migration` is not that release's own version or names no
//     migration, or a migration is not named by the release of its version;
//   - the catalog item is out of sync with the folder (version,
//     compatibility, releases, migrations, companions, integrity): run
//     `node scripts/sync-integrations.js`.
//
// It also compares with the folder on `origin/main` (or `main`) when git has
// it: a changed folder whose version did not change is an error, since the
// catalog would then offer different files under the same version. When the
// version went up, the structure is compared too: an install field or an
// action that is gone, an enum choice that is gone, or an install field that
// every installation now needs (required, no default) must be handled by a
// migration whose id lies between the two versions, so that an update never
// leaves an installation with values or action names the new definition
// rejects.
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
// semver helpers (no dependencies)

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
// definition migrations (declarative steps; `module` steps come with code trust)

/** An install field key or an action name, as iHub's definition schema accepts it. */
const IDENTIFIER = /^[A-Za-z]\w{0,63}$/;
const MAX_SCOPE_ID = 256;
const WHEN = new Set(['missing', 'always']);

/**
 * The declarative steps and the arguments each takes. `field` is an install
 * field key, `action` an action name, `scope` a scope id (the portal's or the
 * connector's own, so any non-empty string), `any` any JSON value; `when` and
 * `map` are checked on their own. Every argument is required except
 * `setValue.when` (default `missing`).
 */
const STEPS = {
  renameValue: { from: 'field', to: 'field' },
  setValue: { key: 'field', value: 'any', when: 'when' },
  removeValue: { key: 'field' },
  mapValue: { key: 'field', map: 'map' },
  renameAction: { from: 'action', to: 'action' },
  removeAction: { name: 'action' },
  renameScope: { from: 'scope', to: 'scope' }
};
const OPTIONAL_ARGUMENTS = new Set(['setValue.when']);
const STEP_NAMES = Object.keys(STEPS).join(', ');

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

/** Why one argument of a step is not acceptable, or null when it is. */
function argumentProblem(type, value) {
  switch (type) {
    case 'field':
      return typeof value === 'string' && IDENTIFIER.test(value)
        ? null
        : 'must be an install field key (a letter, then letters, digits and _)';
    case 'action':
      return typeof value === 'string' && IDENTIFIER.test(value)
        ? null
        : 'must be an action name (a letter, then letters, digits and _)';
    case 'scope':
      return typeof value === 'string' && value.trim() !== '' && value.length <= MAX_SCOPE_ID
        ? null
        : `must be a scope id (a non-empty string of at most ${MAX_SCOPE_ID} characters)`;
    case 'when':
      return WHEN.has(value) ? null : `must be "missing" or "always"`;
    case 'map':
      return isPlainObject(value) && Object.keys(value).length > 0
        ? null
        : 'must map at least one old value to a new one ({ "<old>": <new> })';
    default:
      return null;
  }
}

/** Check one step of a migration: exactly one declarative step with its arguments. */
function checkStep(where, step) {
  if (!isPlainObject(step) || Object.keys(step).length !== 1) {
    fail(`${where} must be an object with exactly one step (${STEP_NAMES})`);
    return;
  }
  const [kind] = Object.keys(step);
  if (kind === 'module') {
    fail(
      `${where}: module steps are not supported yet (code migrations come with registries trusted for code); use declarative steps (${STEP_NAMES})`
    );
    return;
  }
  const spec = STEPS[kind];
  if (!spec) {
    fail(`${where}: unknown step "${kind}"; use one of ${STEP_NAMES}`);
    return;
  }
  const args = step[kind];
  if (!isPlainObject(args)) {
    fail(`${where}.${kind} must be an object`);
    return;
  }
  checkStepArguments(`${where}.${kind}`, kind, spec, args);
}

/** Check the arguments of one step against what its kind takes (`spec`). */
function checkStepArguments(where, kind, spec, args) {
  for (const name of Object.keys(args)) {
    if (!Object.hasOwn(spec, name)) fail(`${where}: unknown argument "${name}"`);
  }
  for (const [name, type] of Object.entries(spec)) {
    if (!Object.hasOwn(args, name)) {
      if (!OPTIONAL_ARGUMENTS.has(`${kind}.${name}`)) fail(`${where}.${name} is missing`);
      continue;
    }
    const problem = argumentProblem(type, args[name]);
    if (problem) fail(`${where}.${name} ${problem}: ${JSON.stringify(args[name])}`);
  }
  if (Object.hasOwn(spec, 'from') && args.from !== undefined && args.from === args.to) {
    fail(`${where}: from and to are the same ("${args.from}")`);
  }
}

/**
 * The format of `migrations` and how releases name them: every migration has
 * a version as id and at least one step, `releases[i].migration` is that
 * release's own version and names a migration, and every migration is named
 * by the release of its version (a migration brings an installation up to
 * the release it belongs to).
 */
function checkMigrations(label, definition) {
  const { migrations } = definition;
  const releases = Array.isArray(definition.releases) ? definition.releases : [];
  const ids = new Set();
  if (migrations !== undefined && !Array.isArray(migrations)) {
    fail(`${label}: migrations must be a list`);
  } else {
    (migrations || []).forEach((migration, i) => {
      const where = `${label}: migrations[${i}]`;
      if (!isPlainObject(migration)) {
        fail(`${where} must be an object { "id": "<version>", "steps": [ … ] }`);
        return;
      }
      const { id, steps } = migration;
      for (const name of Object.keys(migration)) {
        if (name !== 'id' && name !== 'steps') fail(`${where}: unknown property "${name}"`);
      }
      if (!VERSION.test(String(id))) fail(`${where}: id "${id}" is not semantic`);
      else if (ids.has(id)) fail(`${where}: id ${id} is listed twice`);
      else ids.add(id);
      if (!Array.isArray(steps) || steps.length === 0) {
        fail(`${where}: steps must list at least one step`);
        return;
      }
      steps.forEach((step, j) => checkStep(`${where}.steps[${j}]`, step));
    });
  }

  const named = new Set();
  releases.forEach((release, i) => {
    if (!isPlainObject(release) || release.migration === undefined) return;
    const where = `${label}: releases[${i}]`;
    if (release.migration !== release.version) {
      fail(`${where}: migration "${release.migration}" must be the release's own version ${release.version}`);
    } else if (!ids.has(release.migration)) {
      fail(`${where}: migration ${release.migration} is not in migrations; add { "id": "${release.migration}", "steps": [ … ] }`);
    } else {
      named.add(release.migration);
    }
  });
  for (const id of ids) {
    if (named.has(id)) continue;
    if (releases.some(release => release?.version === id)) {
      fail(`${label}: migration ${id} is not named by its release; add "migration": "${id}" to the releases entry ${id}`);
    } else {
      fail(`${label}: migration ${id} has no releases entry ${id}; a migration's id is the version of the release that needs it`);
    }
  }
}

/**
 * The install fields whose values an installation keeps in `values`: admin
 * scope and not sensitive. A sensitive field (`type: "secret"` or
 * `sensitive: true`) lives in the credential store and a `user` field with
 * each user, both out of a migration's reach.
 */
function storedFields(definition) {
  const fields = new Map();
  for (const field of Array.isArray(definition.install) ? definition.install : []) {
    if (!isPlainObject(field) || typeof field.key !== 'string') continue;
    const sensitive = field.sensitive ?? field.type === 'secret';
    if (sensitive || (field.scope ?? 'admin') !== 'admin') continue;
    fields.set(field.key, field);
  }
  return fields;
}

function installKeys(definition) {
  return new Set(
    (Array.isArray(definition.install) ? definition.install : []).filter(isPlainObject).map(field => field.key)
  );
}

function actionNames(definition) {
  return new Set(
    (Array.isArray(definition.actions) ? definition.actions : []).filter(isPlainObject).map(action => action.name)
  );
}

/** Whether every installation must hold a value for the field: required, no default. */
const needsValue = field => Boolean(field?.required) && field.default === undefined;

/**
 * The steps an update from `from` to `to` runs: those of every migration of
 * the new definition whose id lies in (from, to], as `{ kind, args }`.
 */
function stepsBetween(definition, from, to) {
  return (Array.isArray(definition.migrations) ? definition.migrations : [])
    .filter(m => isPlainObject(m) && VERSION.test(String(m.id)))
    .filter(m => compareVersions(m.id, from) > 0 && compareVersions(m.id, to) <= 0)
    .flatMap(m => (Array.isArray(m.steps) ? m.steps : []))
    .filter(step => isPlainObject(step) && Object.keys(step).length === 1)
    .map(step => {
      const [kind] = Object.keys(step);
      return { kind, args: isPlainObject(step[kind]) ? step[kind] : {} };
    });
}

/**
 * The structural diff between the definition on the base ref and the one in
 * the working tree, for a version bump. iHub validates a migrated
 * installation against the new definition (install values, the action
 * policy, the app bindings) and fails the update on any unknown or missing
 * reference, so every such change needs a step:
 *
 * - an install field that is gone: `renameValue` (from) or `removeValue`.
 *   A `mapValue` does not count: it rewrites the value and keeps the key;
 * - an enum choice that is gone: `mapValue` with that old value, or
 *   `setValue` with `when: "always"`, or `removeValue`;
 * - an install field every installation now needs (required, no default)
 *   that it did not need before: `setValue`, or a `renameValue` onto it from
 *   a field every installation already had;
 * - an action that is gone: `renameAction` (from) or `removeAction`.
 *
 * Scope ids are not part of a definition (the scopes action or the native
 * connector lists them at runtime), so there is nothing to compare for
 * `renameScope`; its format is checked in `checkMigrations`.
 */
function checkMigrationCoverage(label, previous, definition, ref) {
  const from = previous.version;
  const to = definition.version;
  const steps = stepsBetween(definition, from, to);
  const coverage = {
    label,
    to,
    range: `(${from}, ${to}]`,
    since: `since ${from} on ${ref}`,
    hasStep: (kind, test) => steps.some(step => step.kind === kind && test(step.args))
  };

  const before = storedFields(previous);
  const keysNow = installKeys(definition);
  for (const key of before.keys()) {
    if (!keysNow.has(key)) checkRemovedField(coverage, key);
  }
  for (const [key, field] of storedFields(definition)) {
    const old = before.get(key);
    if (field.type === 'enum' && old?.type === 'enum') checkRemovedChoices(coverage, key, field, old);
    checkNeededValue(coverage, key, field, old, before);
  }
  const actionsNow = actionNames(definition);
  for (const name of actionNames(previous)) {
    if (!actionsNow.has(name)) checkRemovedAction(coverage, name);
  }
}

/** An install field that is gone needs a `renameValue` (from) or a `removeValue`. */
function checkRemovedField({ label, to, range, since, hasStep }, key) {
  if (hasStep('renameValue', a => a.from === key) || hasStep('removeValue', a => a.key === key)) return;
  const mapped = hasStep('mapValue', a => a.key === key) ? ' (a mapValue rewrites the value but keeps the key)' : '';
  fail(
    `${label}: install field "${key}" is gone ${since}, and no migration in ${range} renames or removes it${mapped}; add { "renameValue": { "from": "${key}", "to": "<new key>" } } or { "removeValue": { "key": "${key}" } } to migration ${to}`
  );
}

/** An enum choice that is gone needs a `mapValue` of it, a `setValue` (always) or a `removeValue`. */
function checkRemovedChoices({ label, to, range, since, hasStep }, key, field, old) {
  const offered = new Set((Array.isArray(field.choices) ? field.choices : []).map(choice => JSON.stringify(choice?.value)));
  const replaced =
    hasStep('setValue', a => a.key === key && a.when === 'always') || hasStep('removeValue', a => a.key === key);
  for (const choice of Array.isArray(old.choices) ? old.choices : []) {
    const value = choice?.value;
    if (replaced || offered.has(JSON.stringify(value))) continue;
    if (hasStep('mapValue', a => a.key === key && isPlainObject(a.map) && Object.hasOwn(a.map, String(value)))) continue;
    fail(
      `${label}: install field "${key}" no longer offers the choice ${JSON.stringify(value)} (${since}), and no migration in ${range} maps it; add { "mapValue": { "key": "${key}", "map": { ${JSON.stringify(String(value))}: <new choice> } } } to migration ${to}`
    );
  }
}

/**
 * A field every installation now needs (required, no default) and did not
 * need before needs a `setValue`, or a `renameValue` onto it from a field
 * every installation already had.
 */
function checkNeededValue({ label, to, range, hasStep }, key, field, old, before) {
  if (!needsValue(field) || needsValue(old)) return;
  if (hasStep('setValue', a => a.key === key)) return;
  if (hasStep('renameValue', a => a.to === key && needsValue(before.get(a.from)))) return;
  const what = old ? 'is now required without a default' : 'is new and required without a default';
  fail(
    `${label}: install field "${key}" ${what}, and no migration in ${range} sets it; add { "setValue": { "key": "${key}", "value": <value>, "when": "missing" } } to migration ${to}`
  );
}

/** An action that is gone needs a `renameAction` (from) or a `removeAction`. */
function checkRemovedAction({ label, to, range, since, hasStep }, name) {
  if (hasStep('renameAction', a => a.from === name) || hasStep('removeAction', a => a.name === name)) return;
  fail(
    `${label}: action "${name}" is gone ${since}, and no migration in ${range} renames or removes it; add { "renameAction": { "from": "${name}", "to": "<new name>" } } or { "removeAction": { "name": "${name}" } } to migration ${to}`
  );
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

  checkMigrations(label, definition);

  // A changed folder needs a new version (and, with it, a releases entry);
  // a new version needs a migration for every structural change.
  if (baseRef) {
    const previousText = gitShow(baseRef, `integrations/${folder}/integration.json`);
    if (previousText) {
      let previous;
      try {
        previous = JSON.parse(previousText);
      } catch {
        previous = null;
      }
      const previousVersion = isPlainObject(previous) ? previous.version : null;
      if (previousVersion && folderChangedSince(baseRef, folder)) {
        if (previousVersion === definition.version) {
          fail(`${label}: the folder changed since ${baseRef} but version is still ${previousVersion}; bump it and add a releases entry`);
        } else if (compareVersions(definition.version, previousVersion) <= 0) {
          fail(`${label}: version ${definition.version} is not newer than ${previousVersion} on ${baseRef}`);
        } else {
          if (releases !== undefined && !releases.some(r => r.version === definition.version)) {
            fail(`${label}: version changed to ${definition.version} without a releases entry`);
          }
          if (VERSION.test(String(previousVersion)) && VERSION.test(String(definition.version))) {
            checkMigrationCoverage(label, previous, definition, baseRef);
          }
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
