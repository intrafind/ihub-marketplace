// Temporary marketplace repositories for the tests of scripts/validate.js and
// scripts/sync-integrations.js. Each one is a git repository in the system's
// temp directory with both scripts copied into scripts/, one integration
// folder (integrations/org.example__test/) and a catalog.json item for it, so
// the scripts run exactly as in this repository: against their own ROOT and,
// for the comparison with the base version, against the repository's `main`.
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const SCRIPTS = path.resolve(__dirname, '..');
/** The scripts a temporary repository gets, as in this one. */
const SCRIPT_FILES = [
  'validate.js',
  'sync-integrations.js',
  'integration-tags.js',
  'tag-integrations.js',
  'build-versions.js'
];
const FOLDER = 'org.example__test';

/** The git binary, found the way validate.js finds it; null when git is not installed. */
const GIT =
  process.platform === 'win32'
    ? 'git'
    : ['/usr/bin/git', '/usr/local/bin/git', '/opt/homebrew/bin/git'].find(candidate =>
        fs.existsSync(candidate)
      ) || null;

/** Install fields of the base definition: a stored required field, an optional one, an enum and a secret. */
const BASE_INSTALL = [
  { key: 'baseUrl', type: 'url', title: { en: 'Portal URL' }, required: true },
  { key: 'filter', type: 'string', title: { en: 'Default filter' } },
  {
    key: 'profile',
    type: 'enum',
    title: { en: 'Metadata profile' },
    choices: [
      { value: 'plain', label: { en: 'Plain' } },
      { value: 'dcat', label: { en: 'DCAT' } }
    ],
    default: 'plain'
  },
  { key: 'apiToken', type: 'secret', title: { en: 'API token' } }
];

const BASE_ACTIONS = [
  { name: 'search', title: { en: 'Search' } },
  { name: 'get_item', title: { en: 'Get item' } }
];

/**
 * An integration definition with what the scripts read. `releaseVersions`
 * lists the release history newest first (default: just `version`); a
 * release names a migration when `migrations` has one with its version as id.
 *
 * @param {object} [options]
 * @param {string} [options.version] - the definition version (default 1.0.0)
 * @param {string[]} [options.releaseVersions] - versions of `releases`, newest first
 * @param {Array<{ id: string, steps: object[] }>} [options.migrations]
 * @param {object[]} [options.install] - default BASE_INSTALL
 * @param {object[]} [options.actions] - default BASE_ACTIONS
 * @returns {object} the definition, ready to be written as integration.json
 */
function definition(options = {}) {
  const version = options.version || '1.0.0';
  const migrations = options.migrations;
  const ids = new Set((migrations || []).map(migration => migration.id));
  const releases = (options.releaseVersions || [version]).map(v => ({
    version: v,
    date: '2026-11-01',
    summary: { en: `Release ${v}` },
    ...(ids.has(v) ? { migration: v } : {})
  }));
  return {
    id: 'org.example/test',
    version,
    compatibility: { ihub: '>=5.7.0' },
    releases,
    ...(migrations ? { migrations } : {}),
    name: { en: 'Example' },
    install: options.install || BASE_INSTALL,
    actions: options.actions || BASE_ACTIONS
  };
}

/** One temporary marketplace repository; call remove() when done. */
class Repo {
  constructor() {
    this.root = fs.mkdtempSync(path.join(os.tmpdir(), 'marketplace-test-'));
    fs.mkdirSync(path.join(this.root, 'scripts'));
    for (const script of SCRIPT_FILES.filter(file => fs.existsSync(path.join(SCRIPTS, file)))) {
      fs.copyFileSync(path.join(SCRIPTS, script), path.join(this.root, 'scripts', script));
    }
    const catalog = {
      items: [
        {
          type: 'integration',
          name: FOLDER,
          displayName: { en: 'Example' },
          source: { type: 'relative', path: `integrations/${FOLDER}/integration.json` }
        }
      ]
    };
    fs.writeFileSync(path.join(this.root, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);
    // A repository of its own, so the validator never looks at an enclosing one
    if (GIT) this.git('init', '-q', '-b', 'main');
  }

  /** Run git in the repository with a fixed identity and no signing. */
  git(...args) {
    return execFileSync(
      GIT,
      ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', '-c', 'commit.gpgsign=false', ...args],
      { cwd: this.root, shell: false, stdio: ['ignore', 'pipe', 'pipe'] }
    ).toString('utf8');
  }

  /**
   * Write integration.json and, unless `sync` is false, bring catalog.json in
   * sync with it (as an author runs `node scripts/sync-integrations.js`).
   */
  write(value, { sync = true } = {}) {
    const dir = path.join(this.root, 'integrations', FOLDER);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'integration.json'), `${JSON.stringify(value, null, 2)}\n`);
    if (sync) {
      const result = this.run('sync-integrations.js');
      if (result.status !== 0) throw new Error(`sync-integrations.js failed:\n${result.output}`);
    }
  }

  /** Write another file of the integration folder (a migration module, a note file). */
  writeFile(rel, content) {
    const file = path.join(this.root, 'integrations', FOLDER, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }

  /** Commit everything on the current branch. */
  commit(message = 'change') {
    this.git('add', '-A');
    this.git('commit', '-q', '-m', message);
  }

  /** Commit everything on `main` (the base the validator compares with) and continue on a branch. */

  publish() {
    this.git('add', '-A');
    this.git('commit', '-q', '-m', 'base');
    this.git('checkout', '-q', '-b', 'change');
  }

  /** Run one of the scripts; `output` is stdout and stderr together. */
  run(script, ...args) {
    const result = spawnSync(process.execPath, [path.join(this.root, 'scripts', script), ...args], {
      cwd: this.root,
      shell: false,
      encoding: 'utf8'
    });
    return { status: result.status, output: `${result.stdout}${result.stderr}` };
  }

  validate() {
    return this.run('validate.js');
  }

  /** The integration item of catalog.json as it is on disk. */
  catalogItem() {
    return JSON.parse(fs.readFileSync(path.join(this.root, 'catalog.json'), 'utf8')).items[0];
  }

  remove() {
    fs.rmSync(this.root, { recursive: true, force: true });
  }
}

/** Validate a repository holding just `value`, with no base version to compare with. */
function validateDefinition(value) {
  const repo = new Repo();
  try {
    repo.write(value);
    return repo.validate();
  } finally {
    repo.remove();
  }
}

/** Validate an update: `base` committed on `main`, `next` in the working tree. */
function validateUpdate(base, next) {
  const repo = new Repo();
  try {
    repo.write(base);
    repo.publish();
    repo.write(next);
    return repo.validate();
  } finally {
    repo.remove();
  }
}

module.exports = {
  BASE_ACTIONS,
  BASE_INSTALL,
  FOLDER,
  GIT,
  Repo,
  definition,
  validateDefinition,
  validateUpdate
};
