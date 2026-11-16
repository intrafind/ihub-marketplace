#!/usr/bin/env node
// Checks site/data/open-models.json, the data of the open-model finder
// (site/models.html): the models with their capabilities and license terms,
// the machines and the quantization steps the estimates are made for.
//
// A problem here would show on the page as a broken filter, a wrong estimate
// or a dead link, so the build fails instead (scripts/validate.js calls this).
//
// Usage: node scripts/open-models.js
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const DATA = path.resolve(__dirname, '..', 'site', 'data', 'open-models.json');

const USES = new Set([
  'general', 'coding', 'agents', 'reasoning', 'rag', 'vision-documents', 'multilingual',
  'on-device', 'long-context', 'speech', 'translation', 'math-science'
]);
const MODALITIES = new Set(['text', 'image', 'video', 'audio']);
const GRANTS = new Set(['yes', 'conditions', 'no']);
const KNOWN = new Set(['yes', 'no', 'unknown']);
const CATEGORIES = new Set(['permissive', 'conditional', 'non-commercial']);
const QUANTIZATION_IDS = new Set(['q8', 'q6', 'q4']);
const HARDWARE_GROUPS = new Set(['consumer', 'workstation', 'datacenter', 'apple', 'unified', 'cpu']);
const HARDWARE_KINDS = new Set(['gpu', 'apple', 'unified', 'cpu']);
const RIGHTS = ['commercialUse', 'selfHosting', 'modifications', 'offerAsService'];

/** The values each field of a model may have. */
const MODEL_ENUMS = {
  architecture: new Set(['dense', 'moe']),
  nativePrecision: new Set(['bf16', 'fp16', 'fp8', 'fp4', 'q2']),
  reasoning: new Set(['always', 'toggle', 'none', 'unknown']),
  toolCalling: KNOWN,
  structuredOutput: KNOWN
};
/** What each right of a license may be: `offerAsService` may also be unknown. */
const RIGHT_VALUES = {
  commercialUse: GRANTS,
  selfHosting: GRANTS,
  modifications: GRANTS,
  offerAsService: new Set([...GRANTS, 'unknown'])
};

const ID = /^[a-z0-9][a-z0-9.-]*$/;
const REPO = /^[\w.-]+\/[\w.-]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isText = value => typeof value === 'string' && value.trim() !== '';
const isPositive = value => typeof value === 'number' && Number.isFinite(value) && value > 0;
const isBilingual = value => isObject(value) && isText(value.en) && isText(value.de);
const subsetOf = (list, allowed) => Array.isArray(list) && list.every(entry => allowed.has(entry));
const names = set => [...set].join(', ');
const isHttps = value => String(value || '').startsWith('https://');

/** `models[3] (qwen3.8-27b)`: where a problem is, as the message says it. */
function locate(kind, index, entry) {
  const id = isObject(entry) && entry.id ? ` (${entry.id})` : '';
  return `${kind}[${index}]${id}`;
}

// ---------- License ----------

function checkLicenseRights(where, license, fail) {
  for (const right of RIGHTS) {
    if (!RIGHT_VALUES[right].has(license[right])) {
      fail(`${where}: license.${right} must be one of ${names(RIGHT_VALUES[right])}`);
    }
  }
}

function checkLicenseConditions(where, license, fail) {
  const { conditions } = license;
  if (!isObject(conditions) || !Array.isArray(conditions.en) || !Array.isArray(conditions.de)) {
    fail(`${where}: license.conditions needs the lists en and de`);
    return;
  }
  if (conditions.en.length !== conditions.de.length) {
    fail(`${where}: license.conditions has ${conditions.en.length} English and ${conditions.de.length} German entries`);
  }
  // The category is what the filter uses; it must agree with what the license grants
  const limited = RIGHTS.some(right => license[right] === 'conditions' || license[right] === 'no');
  if (license.category === 'permissive' && (limited || conditions.en.length)) {
    fail(`${where}: a permissive license has no conditions and grants every right`);
  }
  if (license.category === 'conditional' && !conditions.en.length) {
    fail(`${where}: a conditional license must list its conditions`);
  }
}

function checkLicenseCategory(where, license, fail) {
  const nonCommercial = license.category === 'non-commercial';
  if (nonCommercial && license.commercialUse !== 'no') {
    fail(`${where}: a non-commercial license has commercialUse "no"`);
  }
  if (!nonCommercial && license.commercialUse === 'no') {
    fail(`${where}: commercialUse "no" needs the category non-commercial`);
  }
}

function checkLicense(where, license, fail) {
  if (!isObject(license)) {
    fail(`${where}: license is missing`);
    return;
  }
  if (!isText(license.name)) fail(`${where}: license.name is missing`);
  if (!isHttps(license.url)) fail(`${where}: license.url must be an https link to the license text`);
  if (!CATEGORIES.has(license.category)) fail(`${where}: license.category must be one of ${names(CATEGORIES)}`);
  if (!isBilingual(license.summary)) fail(`${where}: license.summary needs en and de`);
  if (typeof license.gated !== 'boolean') fail(`${where}: license.gated must be true or false`);
  checkLicenseRights(where, license, fail);
  checkLicenseConditions(where, license, fail);
  checkLicenseCategory(where, license, fail);
}

// ---------- Model ----------

function checkModelIdentity(where, model, seen, fail) {
  if (!ID.test(model.id || '')) fail(`${where}: id must be lower-case letters, digits, dots and dashes`);
  else if (seen.has(model.id)) fail(`${where}: id is used twice`);
  seen.add(model.id);
  for (const key of ['name', 'family', 'vendor']) {
    if (!isText(model[key])) fail(`${where}: ${key} is missing`);
  }
  if (!/^[A-Z]{2}$/.test(model.country || '')) fail(`${where}: country must be a two-letter country code`);
  if (!DATE.test(model.released || '')) fail(`${where}: released must be a date (YYYY-MM-DD)`);
  if (!REPO.test(model.huggingface || '')) fail(`${where}: huggingface must be <owner>/<repository>`);
}

function checkModelSize(where, model, fail) {
  if (!isPositive(model.paramsB)) fail(`${where}: paramsB must be a positive number (billions of parameters)`);
  const active = model.activeParamsB;
  if (active !== null && !(isPositive(active) && active <= model.paramsB)) {
    fail(`${where}: activeParamsB must be null or a positive number up to paramsB`);
  }
  for (const key of ['contextWindow', 'maxOutputTokens']) {
    if (model[key] !== null && !isPositive(model[key])) fail(`${where}: ${key} must be null or a number of tokens`);
  }
}

function checkModelAbilities(where, model, fail) {
  for (const [key, allowed] of Object.entries(MODEL_ENUMS)) {
    if (!allowed.has(model[key])) fail(`${where}: ${key} must be one of ${names(allowed)}`);
  }
  if (!subsetOf(model.inputModalities, MODALITIES) || !model.inputModalities.includes('text')) {
    fail(`${where}: inputModalities must list text and any of image, video, audio`);
  }
  if (!subsetOf(model.outputModalities, MODALITIES) || !model.outputModalities.length) {
    fail(`${where}: outputModalities is missing`);
  }
  const languages = model.languages;
  if (!isObject(languages) || !KNOWN.has(languages.german)) {
    fail(`${where}: languages.german must be yes, no or unknown`);
  } else if (languages.count !== null && !isPositive(languages.count)) {
    fail(`${where}: languages.count must be null or a number`);
  }
}

function checkModelTexts(where, model, fail) {
  if (!subsetOf(model.bestFor, USES) || !model.bestFor.length) {
    fail(`${where}: bestFor must list one or more of ${names(USES)}`);
  }
  if (!isBilingual(model.strengths)) fail(`${where}: strengths needs en and de`);
  if (model.vendorHardware !== null && !isBilingual(model.vendorHardware)) {
    fail(`${where}: vendorHardware must be null or have en and de`);
  }
}

function checkModelVariants(where, model, fail) {
  if (!Array.isArray(model.serving) || !model.serving.every(isText)) {
    fail(`${where}: serving must be a list of names`);
  }
  const quantized = model.quantized;
  if (!isObject(quantized) || !Array.isArray(quantized.other)) {
    fail(`${where}: quantized needs gguf (a repository or null) and the list other`);
    return;
  }
  if (quantized.gguf !== null && !REPO.test(quantized.gguf || '')) {
    fail(`${where}: quantized.gguf must be a repository or null`);
  }
  if (!quantized.other.every(entry => isObject(entry) && REPO.test(entry.repo || '') && isText(entry.format))) {
    fail(`${where}: every quantized.other entry needs repo and format`);
  }
}

function checkModel(model, index, seen, fail) {
  const where = locate('models', index, model);
  if (!isObject(model)) {
    fail(`${where}: not an object`);
    return;
  }
  checkModelIdentity(where, model, seen, fail);
  checkModelSize(where, model, fail);
  checkModelAbilities(where, model, fail);
  checkModelTexts(where, model, fail);
  checkModelVariants(where, model, fail);
  checkLicense(where, model.license, fail);
}

// ---------- Machines and quantizations ----------

function checkQuantizations(quantizations, fail) {
  if (!quantizations.length) fail('quantizations is missing');
  quantizations.forEach((entry, index) => {
    const valid = isObject(entry) && QUANTIZATION_IDS.has(entry.id) && isPositive(entry.bits) && entry.bits < 16;
    if (!valid) fail(`quantizations[${index}]: needs the id q8, q6 or q4 and bits below 16`);
  });
}

function checkMachine(entry, index, seen, fail) {
  const where = locate('hardware', index, entry);
  if (!isObject(entry)) {
    fail(`${where}: not an object`);
    return;
  }
  if (!ID.test(entry.id || '') || entry.id === 'custom') {
    fail(`${where}: id must be lower-case letters, digits, dots and dashes, and not "custom"`);
  } else if (seen.has(entry.id)) {
    fail(`${where}: id is used twice`);
  }
  seen.add(entry.id);
  if (!isText(entry.name)) fail(`${where}: name is missing`);
  if (!HARDWARE_GROUPS.has(entry.group)) fail(`${where}: group must be one of ${names(HARDWARE_GROUPS)}`);
  if (!HARDWARE_KINDS.has(entry.kind)) fail(`${where}: kind must be one of ${names(HARDWARE_KINDS)}`);
  if (!isPositive(entry.memoryGB)) fail(`${where}: memoryGB must be a positive number`);
  if (!isPositive(entry.bandwidthGBs)) fail(`${where}: bandwidthGBs must be a positive number`);
  if (entry.usableShare !== undefined && !(isPositive(entry.usableShare) && entry.usableShare <= 1)) {
    fail(`${where}: usableShare must be between 0 and 1`);
  }
}

function checkHardware(hardware, fail) {
  if (!hardware.length) fail('hardware is missing');
  const seen = new Set();
  hardware.forEach((entry, index) => checkMachine(entry, index, seen, fail));
}

// ---------- Whole file ----------

/** The problems of the data of the open-model finder; an empty list when it is fine. */
function checkOpenModels(data) {
  const problems = [];
  const fail = message => problems.push(message);
  if (!isObject(data)) return ['open-models.json is not an object'];
  if (!DATE.test(data.updated || '')) fail('updated must be a date (YYYY-MM-DD)');
  checkQuantizations(Array.isArray(data.quantizations) ? data.quantizations : [], fail);
  checkHardware(Array.isArray(data.hardware) ? data.hardware : [], fail);

  const models = Array.isArray(data.models) ? data.models : [];
  if (!models.length) fail('models is missing');
  const seen = new Set();
  models.forEach((model, index) => checkModel(model, index, seen, fail));
  return problems;
}

/** The problems of the data file on disk; an empty list when it is fine or when there is no file. */
function checkOpenModelsFile(file = DATA) {
  if (!fs.existsSync(file)) return [];
  try {
    return checkOpenModels(JSON.parse(fs.readFileSync(file, 'utf8')));
  } catch (error) {
    return [`open-models.json is not valid JSON: ${error.message}`];
  }
}

module.exports = { checkOpenModels, checkOpenModelsFile, DATA };

if (require.main === module) {
  const problems = checkOpenModelsFile();
  if (problems.length) {
    console.error(`open-models: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  console.log('open-models: site/data/open-models.json is fine');
}
