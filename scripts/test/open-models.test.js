// Tests of the open-model finder: the estimates of site/assets/model-finder.js
// (memory, fit, speed), the rules of scripts/open-models.js, and the data file
// the page ships with.
//
// Run: node --test scripts/test/*.test.js
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Finder = require('../../site/assets/model-finder.js');
const { checkOpenModels, DATA } = require('../open-models');

const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const QUANTIZATIONS = data.quantizations;
const GPU_24 = { id: 'gpu', kind: 'gpu', memoryGB: 24, bandwidthGBs: 1000 };
const dense = (paramsB, nativePrecision = 'bf16') => ({ paramsB, activeParamsB: null, architecture: 'dense', nativePrecision });

describe('estimates', () => {
  it('sizes the weights by bits per weight and adds the runtime overhead', () => {
    const model = dense(8);
    assert.equal(Finder.weightsGB(model, { bits: 16 }), 16);
    assert.equal(Finder.memoryGB(model, { bits: 16 }), 16 * Finder.OVERHEAD_FACTOR + Finder.OVERHEAD_GB);
  });

  it('never counts more bits than the model was released with', () => {
    assert.equal(Finder.weightsGB(dense(8, 'fp8'), { bits: 16 }), 8);
    const ids = Finder.quantizationsFor(dense(8, 'fp8'), QUANTIZATIONS).map(q => q.id);
    assert.deepEqual(ids, ['native', 'q6', 'q4']);
    assert.deepEqual(Finder.quantizationsFor(dense(8, 'fp4'), QUANTIZATIONS).map(q => q.id), ['native']);
  });

  it('picks the best quantization that fits', () => {
    // 27 B: 16-bit needs ~61 GB, 8-bit ~33 GB, 6-bit ~26 GB, 4-bit ~19.5 GB
    const run = Finder.evaluate(dense(27), { hardware: GPU_24, quantizations: QUANTIZATIONS, minBits: 4 });
    assert.equal(run.fits, true);
    assert.equal(run.quantization.id, 'q4');
    assert.equal(Finder.evaluate(dense(8), { hardware: GPU_24, quantizations: QUANTIZATIONS }).quantization.id, 'native');
  });

  it('respects the minimum quality and says what is missing', () => {
    const run = Finder.evaluate(dense(27), { hardware: GPU_24, quantizations: QUANTIZATIONS, minBits: 8 });
    assert.equal(run.fits, false);
    assert.equal(run.quantization.id, 'q8');
    assert.ok(run.memoryGB > 24);
  });

  it('offers a model released below the wanted quality as released', () => {
    const run = Finder.evaluate(dense(8, 'fp4'), { hardware: GPU_24, quantizations: QUANTIZATIONS, minBits: 16 });
    assert.equal(run.fits, true);
    assert.equal(run.quantization.id, 'native');
  });

  it('adds up the memory of several GPUs and takes the usable share of shared memory', () => {
    assert.equal(Finder.usableMemoryGB(GPU_24, 4), 96);
    assert.equal(Finder.usableMemoryGB({ kind: 'apple', memoryGB: 64, usableShare: 0.75 }, 4), 48);
    assert.equal(Finder.evaluate(dense(27), { hardware: GPU_24, count: 4, quantizations: QUANTIZATIONS }).quantization.id, 'native');
  });

  it('estimates speed from the bandwidth and the bytes read per token', () => {
    const q4 = { bits: 4 };
    // 32 B at 4 bit = 16 GB per token; 1000 GB/s ÷ 16 GB × 0.55
    assert.ok(Math.abs(Finder.tokensPerSecond(dense(32), q4, GPU_24, 1) - 34.375) < 1e-9);
    // Twice the model, half the speed
    assert.ok(Math.abs(Finder.tokensPerSecond(dense(64), q4, GPU_24, 1) - 17.1875) < 1e-9);
  });

  it('reads only the active parameters of a mixture-of-experts model', () => {
    const moe = { paramsB: 120, activeParamsB: 12, architecture: 'moe', nativePrecision: 'bf16' };
    const speed = Finder.tokensPerSecond(moe, { bits: 4 }, GPU_24, 1);
    assert.ok(speed > Finder.tokensPerSecond(dense(120), { bits: 4 }, GPU_24, 1) * 5);
    assert.ok(speed < Finder.tokensPerSecond(dense(12), { bits: 4 }, GPU_24, 1));
  });

  it('caps the speed, and has none without a bandwidth', () => {
    assert.equal(Finder.tokensPerSecond(dense(0.5), { bits: 4 }, GPU_24, 1), Finder.MAX_SPEED);
    assert.equal(Finder.tokensPerSecond(dense(8), { bits: 4 }, { kind: 'gpu', memoryGB: 24, bandwidthGBs: null }, 1), null);
  });

  it('lets every model fit when no machine is chosen', () => {
    const run = Finder.evaluate(dense(1000), { hardware: null, quantizations: QUANTIZATIONS, minBits: 4 });
    assert.equal(run.fits, true);
    assert.equal(run.quantization.id, 'q4');
  });
});

describe('open-models.json', () => {
  const clone = () => structuredClone(data);

  it('is valid', () => {
    assert.deepEqual(checkOpenModels(data), []);
  });

  it('lists the newest models first', () => {
    const dates = data.models.map(model => model.released);
    assert.deepEqual(dates, dates.toSorted((a, b) => b.localeCompare(a)));
  });

  it('has a translation for every use case and every hardware group', () => {
    const i18n = fs.readFileSync(path.join(__dirname, '../../site/assets/i18n-models.js'), 'utf8');
    const uses = new Set(data.models.flatMap(model => model.bestFor));
    for (const use of uses) assert.equal(i18n.split(`'om.use.${use}'`).length, 3, `om.use.${use} in en and de`);
    for (const group of new Set(data.hardware.map(entry => entry.group))) {
      assert.equal(i18n.split(`'om.hw.group.${group}'`).length, 3, `om.hw.group.${group} in en and de`);
    }
  });

  it('refuses a permissive license with conditions', () => {
    const broken = clone();
    const model = broken.models.find(entry => entry.license.category === 'permissive');
    model.license.conditions = { en: ['Revenue below 1 million'], de: ['Umsatz unter 1 Million'] };
    assert.match(checkOpenModels(broken).join('\n'), /a permissive license has no conditions/);
  });

  it('refuses a commercial-use ban outside the non-commercial category', () => {
    const broken = clone();
    const model = broken.models.find(entry => entry.license.category === 'conditional');
    model.license.commercialUse = 'no';
    assert.match(checkOpenModels(broken).join('\n'), /needs the category non-commercial/);
  });

  it('refuses duplicate ids, unknown use cases and a missing translation', () => {
    const broken = clone();
    broken.models[1].id = broken.models[0].id;
    broken.models[2].bestFor = ['poetry'];
    delete broken.models[3].strengths.de;
    const problems = checkOpenModels(broken).join('\n');
    assert.match(problems, /id is used twice/);
    assert.match(problems, /bestFor must list/);
    assert.match(problems, /strengths needs en and de/);
  });

  it('refuses more active than total parameters and a machine without bandwidth', () => {
    const broken = clone();
    broken.models[0].activeParamsB = broken.models[0].paramsB + 1;
    delete broken.hardware[0].bandwidthGBs;
    const problems = checkOpenModels(broken).join('\n');
    assert.match(problems, /activeParamsB must be null or a positive number up to paramsB/);
    assert.match(problems, /bandwidthGBs must be a positive number/);
  });
});
