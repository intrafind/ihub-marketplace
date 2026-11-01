#!/usr/bin/env node
// Copies what iHub needs to know about each integration definition into the
// matching catalog.json item, so the marketplace decides compatibility and
// shows release notes without downloading the folder:
//
//   version, compatibility, releases (version, date, summary, note paths; the
//   last 20), source.companions (every file of the folder next to
//   integration.json) and source.integrity (sha256 of every companion).
//
// Everything else of the item (names, description, category, tags, license,
// …) is kept as it is in catalog.json, and so is the file's formatting: only
// the integration items are rewritten, in place.
//
// Usage: node scripts/sync-integrations.js [--check]
//   --check  exit 1 when catalog.json is out of date instead of writing it
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const CATALOG = path.join(ROOT, 'catalog.json');
const INTEGRATIONS_DIR = path.join(ROOT, 'integrations');
const MAX_RELEASES = 20;
/** Keys of an integration item, in the order they are written. */
const KEY_ORDER = [
  'type',
  'name',
  'displayName',
  'description',
  'version',
  'compatibility',
  'releases',
  'author',
  'category',
  'tags',
  'icon',
  'license',
  'licenseUrl',
  'minVersion',
  'source'
];

/** Every file of a definition folder except integration.json, as relative POSIX paths, sorted. */
function listCompanions(dir) {
  const out = [];
  const walk = (current, prefix) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      if (entry.name.startsWith('.')) continue;
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(path.join(current, entry.name), rel);
      else if (rel !== 'integration.json') out.push(rel);
    }
  };
  walk(dir, '');
  return out;
}

function sha256(file) {
  return `sha256-${crypto.createHash('sha256').update(fs.readFileSync(file)).digest('base64')}`;
}

/** The catalog fields derived from one definition folder. */
function derive(folder) {
  const dir = path.join(INTEGRATIONS_DIR, folder);
  const definition = JSON.parse(fs.readFileSync(path.join(dir, 'integration.json'), 'utf8'));
  const companions = listCompanions(dir);
  const integrity = {};
  for (const companion of companions) integrity[companion] = sha256(path.join(dir, companion));
  const releases = Array.isArray(definition.releases)
    ? definition.releases.slice(0, MAX_RELEASES).map(release => {
        const out = { version: release.version, date: release.date, summary: release.summary };
        if (release.notes && Object.keys(release.notes).length) out.notes = release.notes;
        return out;
      })
    : undefined;
  return {
    folder,
    version: definition.version,
    compatibility: definition.compatibility,
    releases,
    companions,
    integrity
  };
}

// ---------------------------------------------------------------------------
// catalog.json: locate each item's text span and rewrite integration items

/** The `{ … }` spans of the top-level items (4-space indented objects), with their parsed value. */
function findItemSpans(text) {
  const spans = [];
  const lines = text.split('\n');
  let offset = 0;
  let start = null;
  for (const line of lines) {
    if (line === '    {') start = offset;
    if ((line === '    }' || line === '    },') && start !== null) {
      const end = offset + line.length - (line.endsWith(',') ? 1 : 0);
      const raw = text.slice(start, end);
      spans.push({ start, end, item: JSON.parse(raw), indent: '    ' });
      start = null;
    }
    offset += line.length + 1;
  }
  return spans;
}

const INLINE_WIDTH = 110;

/** JSON in the catalog's house style: short objects and arrays on one line, long ones expanded. */
function format(value, indent) {
  const inline = inlineJson(value);
  if (value === null || typeof value !== 'object') return inline;
  if (indent.length + inline.length <= INLINE_WIDTH) return inline;
  const inner = `${indent}  `;
  if (Array.isArray(value)) {
    return `[\n${value.map(v => inner + format(v, inner)).join(',\n')}\n${indent}]`;
  }
  return `{\n${Object.entries(value)
    .map(([k, v]) => `${inner}${JSON.stringify(k)}: ${format(v, inner)}`)
    .join(',\n')}\n${indent}}`;
}

function inlineJson(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(inlineJson).join(', ')}]`;
  const entries = Object.entries(value);
  if (entries.length === 0) return '{}';
  const pairs = entries.map(([k, v]) => `${JSON.stringify(k)}: ${inlineJson(v)}`);
  return `{ ${pairs.join(', ')} }`;
}

function formatItem(item, indent) {
  const keys = [
    ...KEY_ORDER.filter(key => item[key] !== undefined),
    ...Object.keys(item).filter(key => !KEY_ORDER.includes(key))
  ];
  const inner = `${indent}  `;
  return `${indent}{\n${keys
    .map(key => `${inner}${JSON.stringify(key)}: ${format(item[key], inner)}`)
    .join(',\n')}\n${indent}}`;
}

/** The item with the derived fields applied (a new object, keys reordered). */
function applyDerived(item, derived) {
  const next = { ...item, version: derived.version };
  if (derived.compatibility) next.compatibility = derived.compatibility;
  else delete next.compatibility;
  if (derived.releases) next.releases = derived.releases;
  else delete next.releases;
  const source = { ...item.source };
  if (source.type === 'relative') {
    source.path = `integrations/${derived.folder}/integration.json`;
    source.companions = derived.companions;
    source.integrity = derived.integrity;
  }
  next.source = source;
  return next;
}

function main() {
  const check = process.argv.includes('--check');
  const text = fs.readFileSync(CATALOG, 'utf8');
  const folders = fs.existsSync(INTEGRATIONS_DIR)
    ? fs
        .readdirSync(INTEGRATIONS_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('.'))
        .map(d => d.name)
    : [];
  const derivedByFolder = new Map(folders.map(folder => [folder, derive(folder)]));

  const spans = findItemSpans(text);
  const seen = new Set();
  const replacements = [];
  for (const span of spans) {
    if (span.item.type !== 'integration') continue;
    const derived = derivedByFolder.get(span.item.name);
    if (!derived) {
      console.error(`catalog item integration/${span.item.name} has no folder integrations/${span.item.name}`);
      process.exitCode = 1;
      continue;
    }
    seen.add(span.item.name);
    const next = applyDerived(span.item, derived);
    const formatted = formatItem(next, span.indent);
    if (formatted !== text.slice(span.start, span.end)) {
      replacements.push({ ...span, formatted });
    }
  }
  for (const folder of folders) {
    if (!seen.has(folder)) {
      console.warn(`integrations/${folder} has no catalog item yet; add one with "type": "integration" and "name": "${folder}"`);
    }
  }
  if (replacements.length === 0) {
    console.log('catalog.json is in sync with the integration folders');
    return;
  }
  if (check) {
    console.error(
      `catalog.json is out of date for ${replacements.length} integration item(s): ${replacements
        .map(r => r.item.name)
        .join(', ')}. Run: node scripts/sync-integrations.js`
    );
    process.exitCode = 1;
    return;
  }
  let out = text;
  // Rewrite from the end, so earlier offsets stay valid.
  const fromTheEnd = replacements.toSorted((a, b) => b.start - a.start);
  for (const r of fromTheEnd) {
    out = out.slice(0, r.start) + r.formatted + out.slice(r.end);
  }
  JSON.parse(out);
  fs.writeFileSync(CATALOG, out);
  console.log(`catalog.json updated for ${replacements.map(r => r.item.name).join(', ')}`);
}

main();
