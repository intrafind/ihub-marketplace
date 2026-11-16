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

const USES = [
  'general', 'coding', 'agents', 'reasoning', 'rag', 'vision-documents', 'multilingual',
  'on-device', 'long-context', 'speech', 'translation', 'math-science'
];
const MODALITIES = ['text', 'image', 'video', 'audio'];
const PRECISIONS = ['bf16', 'fp16', 'fp8', 'fp4', 'q2'];
const GRANTS = ['yes', 'conditions', 'no'];
const KNOWN = ['yes', 'no', 'unknown'];
const HARDWARE_GROUPS = ['consumer', 'workstation', 'datacenter', 'apple', 'unified', 'cpu'];
const HARDWARE_KINDS = ['gpu', 'apple', 'unified', 'cpu'];
const ID = /^[a-z0-9][a-z0-9.-]*$/;
const REPO = /^[\w.-]+\/[\w.-]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isText = value => typeof value === 'string' && value.trim() !== '';
const isPositive = value => typeof value === 'number' && Number.isFinite(value) && value > 0;
const isBilingual = value => isObject(value) && isText(value.en) && isText(value.de);
const subsetOf = (list, allowed) => Array.isArray(list) && list.every(entry => allowed.includes(entry));

function checkLicense(where, license, fail) {
  if (!isObject(license)) return fail(`${where}: license is missing`);
  if (!isText(license.name)) fail(`${where}: license.name is missing`);
  if (!/^https:\/\//.test(license.url || '')) fail(`${where}: license.url must be an https link to the license text`);
  if (!['permissive', 'conditional', 'non-commercial'].includes(license.category)) {
    fail(`${where}: license.category must be permissive, conditional or non-commercial`);
  }
  for (const right of ['commercialUse', 'selfHosting', 'modifications']) {
    if (!GRANTS.includes(license[right])) fail(`${where}: license.${right} must be yes, conditions or no`);
  }
  if (![...GRANTS, 'unknown'].includes(license.offerAsService)) {
    fail(`${where}: license.offerAsService must be yes, conditions, no or unknown`);
  }
  if (!isBilingual(license.summary)) fail(`${where}: license.summary needs en and de`);
  const conditions = license.conditions;
  if (!isObject(conditions) || !Array.isArray(conditions.en) || !Array.isArray(conditions.de)) {
    fail(`${where}: license.conditions needs the lists en and de`);
  } else {
    if (conditions.en.length !== conditions.de.length) fail(`${where}: license.conditions has ${conditions.en.length} English and ${conditions.de.length} German entries`);
    // The category is what the filter uses; it must agree with what the license grants
    const limited = ['commercialUse', 'selfHosting', 'modifications', 'offerAsService'].some(right => license[right] === 'conditions' || license[right] === 'no');
    if (license.category === 'permissive' && (limited || conditions.en.length)) {
      fail(`${where}: a permissive license has no conditions and grants every right`);
    }
    if (license.category === 'conditional' && !conditions.en.length) fail(`${where}: a conditional license must list its conditions`);
  }
  if (license.category === 'non-commercial' && license.commercialUse !== 'no') fail(`${where}: a non-commercial license has commercialUse "no"`);
  if (license.category !== 'non-commercial' && license.commercialUse === 'no') fail(`${where}: commercialUse "no" needs the category non-commercial`);
  if (typeof license.gated !== 'boolean') fail(`${where}: license.gated must be true or false`);
}

function checkModel(model, index, seen, fail) {
  const where = `models[${index}]${isObject(model) && model.id ? ` (${model.id})` : ''}`;
  if (!isObject(model)) return fail(`${where}: not an object`);
  if (!ID.test(model.id || '')) fail(`${where}: id must be lower-case letters, digits, dots and dashes`);
  else if (seen.has(model.id)) fail(`${where}: id is used twice`);
  seen.add(model.id);
  for (const key of ['name', 'family', 'vendor']) if (!isText(model[key])) fail(`${where}: ${key} is missing`);
  if (!/^[A-Z]{2}$/.test(model.country || '')) fail(`${where}: country must be a two-letter country code`);
  if (!DATE.test(model.released || '')) fail(`${where}: released must be a date (YYYY-MM-DD)`);
  if (!REPO.test(model.huggingface || '')) fail(`${where}: huggingface must be <owner>/<repository>`);
  if (!['dense', 'moe'].includes(model.architecture)) fail(`${where}: architecture must be dense or moe`);
  if (!isPositive(model.paramsB)) fail(`${where}: paramsB must be a positive number (billions of parameters)`);
  if (model.activeParamsB !== null && !(isPositive(model.activeParamsB) && model.activeParamsB <= model.paramsB)) {
    fail(`${where}: activeParamsB must be null or a positive number up to paramsB`);
  }
  if (!PRECISIONS.includes(model.nativePrecision)) fail(`${where}: nativePrecision must be one of ${PRECISIONS.join(', ')}`);
  if (model.contextWindow !== null && !isPositive(model.contextWindow)) fail(`${where}: contextWindow must be null or a number of tokens`);
  if (model.maxOutputTokens !== null && !isPositive(model.maxOutputTokens)) fail(`${where}: maxOutputTokens must be null or a number of tokens`);
  if (!subsetOf(model.inputModalities, MODALITIES) || !model.inputModalities.includes('text')) fail(`${where}: inputModalities must list text and any of image, video, audio`);
  if (!subsetOf(model.outputModalities, MODALITIES) || !model.outputModalities.length) fail(`${where}: outputModalities is missing`);
  if (!['always', 'toggle', 'none', 'unknown'].includes(model.reasoning)) fail(`${where}: reasoning must be always, toggle, none or unknown`);
  if (!KNOWN.includes(model.toolCalling)) fail(`${where}: toolCalling must be yes, no or unknown`);
  if (!KNOWN.includes(model.structuredOutput)) fail(`${where}: structuredOutput must be yes, no or unknown`);
  if (!isObject(model.languages) || !['yes', 'no', 'unknown'].includes(model.languages.german)) fail(`${where}: languages.german must be yes, no or unknown`);
  else if (model.languages.count !== null && !isPositive(model.languages.count)) fail(`${where}: languages.count must be null or a number`);
  if (!subsetOf(model.bestFor, USES) || !model.bestFor.length) fail(`${where}: bestFor must list one or more of ${USES.join(', ')}`);
  if (!isBilingual(model.strengths)) fail(`${where}: strengths needs en and de`);
  if (model.vendorHardware !== null && !isBilingual(model.vendorHardware)) fail(`${where}: vendorHardware must be null or have en and de`);
  if (!Array.isArray(model.serving) || !model.serving.every(isText)) fail(`${where}: serving must be a list of names`);
  const quantized = model.quantized;
  if (!isObject(quantized) || (quantized.gguf !== null && !REPO.test(quantized.gguf || '')) || !Array.isArray(quantized.other)) {
    fail(`${where}: quantized needs gguf (a repository or null) and the list other`);
  } else if (!quantized.other.every(entry => isObject(entry) && REPO.test(entry.repo || '') && isText(entry.format))) {
    fail(`${where}: every quantized.other entry needs repo and format`);
  }
  checkLicense(where, model.license, fail);
}

/** The problems of the data of the open-model finder; an empty list when it is fine. */
function checkOpenModels(data) {
  const problems = [];
  const fail = message => problems.push(message);
  if (!isObject(data)) return ['open-models.json is not an object'];
  if (!DATE.test(data.updated || '')) fail('updated must be a date (YYYY-MM-DD)');

  const quantizations = Array.isArray(data.quantizations) ? data.quantizations : [];
  if (!quantizations.length) fail('quantizations is missing');
  quantizations.forEach((entry, index) => {
    if (!isObject(entry) || !['q8', 'q6', 'q4'].includes(entry.id) || !isPositive(entry.bits) || entry.bits >= 16) {
      fail(`quantizations[${index}]: needs the id q8, q6 or q4 and bits below 16`);
    }
  });

  const hardware = Array.isArray(data.hardware) ? data.hardware : [];
  if (!hardware.length) fail('hardware is missing');
  const machines = new Set();
  hardware.forEach((entry, index) => {
    const where = `hardware[${index}]${isObject(entry) && entry.id ? ` (${entry.id})` : ''}`;
    if (!isObject(entry)) return fail(`${where}: not an object`);
    if (!ID.test(entry.id || '') || entry.id === 'custom') fail(`${where}: id must be lower-case letters, digits, dots and dashes, and not "custom"`);
    else if (machines.has(entry.id)) fail(`${where}: id is used twice`);
    machines.add(entry.id);
    if (!isText(entry.name)) fail(`${where}: name is missing`);
    if (!HARDWARE_GROUPS.includes(entry.group)) fail(`${where}: group must be one of ${HARDWARE_GROUPS.join(', ')}`);
    if (!HARDWARE_KINDS.includes(entry.kind)) fail(`${where}: kind must be one of ${HARDWARE_KINDS.join(', ')}`);
    if (!isPositive(entry.memoryGB)) fail(`${where}: memoryGB must be a positive number`);
    if (!isPositive(entry.bandwidthGBs)) fail(`${where}: bandwidthGBs must be a positive number`);
    if (entry.usableShare !== undefined && !(isPositive(entry.usableShare) && entry.usableShare <= 1)) fail(`${where}: usableShare must be between 0 and 1`);
  });

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
