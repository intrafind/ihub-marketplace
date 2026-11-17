// Tests of the skills in catalog.json that live in this repository: their
// files are where the catalog says, iHub installs all of them (every file in a
// skill's folder is listed as a companion), the model learns that each
// companion exists (SKILL.md names it), and the worked examples keep the
// structure the skills point to.
//
// Run: node --test scripts/test/*.test.js
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog.json'), 'utf8'));
const skills = catalog.items.filter(item => item.type === 'skill' && item.source?.type === 'relative');

/** Every file under a folder, as paths relative to it. */
function filesUnder(dir, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory()
      ? filesUnder(path.join(dir, entry.name), `${prefix}${entry.name}/`)
      : [`${prefix}${entry.name}`]
  );
}

describe('skills in this repository', () => {
  it('are there', () => {
    assert.ok(skills.length > 100, `found ${skills.length}`);
  });

  for (const skill of skills) {
    const skillFile = path.join(ROOT, skill.source.path);
    const folder = path.dirname(skillFile);
    const companions = skill.source.companions || [];

    it(`${skill.name}: SKILL.md and every companion exist, and every file is installed`, () => {
      assert.ok(fs.existsSync(skillFile), skill.source.path);
      for (const companion of companions) {
        assert.ok(fs.existsSync(path.join(folder, companion)), `${skill.name}: ${companion}`);
      }
      const extra = filesUnder(folder).filter(file => file !== 'SKILL.md' && !companions.includes(file));
      assert.deepEqual(extra, [], `${skill.name}: files iHub would not install`);
    });

    it(`${skill.name}: SKILL.md names each companion, and links to no file it lacks`, () => {
      const text = fs.readFileSync(skillFile, 'utf8');
      for (const companion of companions) {
        assert.ok(text.includes(companion), `${skill.name}: SKILL.md does not mention ${companion}`);
      }
      // A link the model is told to load must be a file iHub installs with the skill.
      const linked = [...text.matchAll(/\]\(((?:references|assets|templates)\/[^)\s]+)\)/g)].map(m => m[1]);
      const missing = linked.filter(file => !companions.includes(file));
      assert.deepEqual(missing, [], `${skill.name}: SKILL.md links to files that are not installed`);
    });

    if (companions.includes('references/examples.md')) {
      it(`${skill.name}: the examples have the agreed structure`, () => {
        const text = fs.readFileSync(path.join(folder, 'references/examples.md'), 'utf8');
        assert.match(text, /^# .+: worked examples\n/);
        assert.match(text, /invented/);
        const examples = text.split(/^## Example \d+: /m).slice(1);
        assert.equal(examples.length, 2, `${skill.name}: two examples`);
        for (const example of examples) {
          for (const part of ['**Request**', '**How the skill handles it**', '**Answer**']) {
            assert.ok(example.includes(part), `${skill.name}: ${part} missing`);
          }
        }
        assert.ok(text.length >= 2000 && text.length <= 9000, `${skill.name}: ${text.length} characters`);
      });
    }
  }
});
