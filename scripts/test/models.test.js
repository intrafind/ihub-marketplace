// Tests of the model definitions in models/.
//
// Google marks what its Gemini models generate with SynthID. iHub records that
// as `contentMarking` on the model (EU AI Act Art. 50(2)), and the models of this
// catalog carry it, so a model installed from here is marked from the start:
//
//   - a Gemini chat model declares `contentMarking.text`;
//   - a Gemini image model (`supportsImageGeneration`) declares `text` and `image`;
//   - speech models (transcription, text-to-speech) generate no marked text or
//     image and declare nothing.
//
// Anthropic marks the text of the Claude models its page "How Claude marks
// AI-generated content" lists with a text watermark derived from SynthID-Text.
// A Claude model of that list declares `contentMarking.text`; four of them are
// listed for Anthropic's own API only, not for cloud partners, so they declare it
// only on `api.anthropic.com`. Any other model declares nothing, the Bedrock
// models included.
//
// Run: node --test scripts/test/*.test.js
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const MODELS_DIR = path.resolve(__dirname, '..', '..', 'models');

/** Every model definition, as `{ file, model }`. */
function models() {
  return fs
    .readdirSync(MODELS_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => ({
      file,
      model: JSON.parse(fs.readFileSync(path.join(MODELS_DIR, file), 'utf8'))
    }));
}

/** `google`, and the Google speech backends (`google-live`, `google-transcribe`). */
const isGoogle = ({ model }) => model.provider === 'google' || model.provider.startsWith('google-');
const isSpeech = ({ model }) => model.modelType === 'transcription' || model.modelType === 'tts';

/** The Claude models Anthropic's page marks for first-party text, by API id. */
const ANTHROPIC_MARKED = [
  'claude-fable-5-2',
  'claude-fable-5-1',
  'claude-fable-5',
  'claude-mythos-5-2',
  'claude-mythos-5-1',
  'claude-mythos-5',
  'claude-opus-5-5',
  'claude-opus-5',
  'claude-opus-4-8',
  'claude-opus-4-7',
  'claude-opus-4-6',
  'claude-opus-4-5',
  'claude-sonnet-5-5',
  'claude-sonnet-5',
  'claude-sonnet-4-6',
  'claude-sonnet-4-5',
  'claude-haiku-5-5',
  'claude-haiku-4-5'
];

/** Listed for Anthropic's own API only, not for cloud partners. */
const ANTHROPIC_FIRST_PARTY_ONLY = [
  'claude-opus-4-6',
  'claude-opus-4-5',
  'claude-sonnet-4-5',
  'claude-haiku-4-5'
];

const isAnthropic = ({ model }) => model.provider === 'anthropic';

/** A SynthID declaration by the provider, with the reference to Google's statement. */
function assertSynthId(marking, label) {
  assert.ok(marking, `${label} declares no marking`);
  assert.equal(marking.by, 'provider', label);
  assert.equal(marking.scheme, 'synthid', label);
  assert.match(marking.statementRef, /^Google DeepMind, SynthID: https:\/\/deepmind\.google\//, label);
}

/** Anthropic's text watermark, with the reference to Anthropic's page. */
function assertAnthropicWatermark(marking, label) {
  assert.ok(marking, `${label} declares no marking`);
  assert.equal(marking.by, 'provider', label);
  assert.equal(marking.scheme, 'synthid-text', label);
  assert.match(
    marking.statementRef,
    /^Anthropic, How Claude marks AI-generated content: https:\/\/support\.claude\.com\//,
    label
  );
}

describe('Google models and their SynthID marking', () => {
  const google = models().filter(isGoogle);

  it('finds the Google models', () => {
    assert.ok(google.length >= 10, `only ${google.length} Google models found`);
  });

  it('declares SynthID for the text of every Gemini chat and image model', () => {
    const chat = google.filter(entry => !isSpeech(entry));
    assert.ok(chat.length >= 8);
    for (const { file, model } of chat) {
      assertSynthId(model.contentMarking?.text, `${file}: text`);
    }
  });

  it('declares SynthID for the images of a model that generates images, and only of those', () => {
    for (const { file, model } of google.filter(entry => !isSpeech(entry))) {
      if (model.supportsImageGeneration === true) {
        assertSynthId(model.contentMarking?.image, `${file}: image`);
      } else {
        assert.equal(model.contentMarking?.image, undefined, `${file} declares image marking`);
      }
    }
  });

  it('declares nothing for speech models', () => {
    const speech = google.filter(isSpeech);
    assert.ok(speech.length >= 4);
    for (const { file, model } of speech) {
      assert.equal(model.contentMarking, undefined, `${file} declares a marking`);
    }
  });

  it('declares a marking nowhere else but at Google and Anthropic', () => {
    for (const { file, model } of models().filter(
      entry => !isGoogle(entry) && !isAnthropic(entry)
    )) {
      assert.equal(
        model.contentMarking,
        undefined,
        `${file}: no provider other than Google and Anthropic is declared marked here`
      );
    }
  });
});

describe('Anthropic models and their text watermark', () => {
  const anthropic = models().filter(isAnthropic);

  it('finds the Claude models', () => {
    assert.ok(anthropic.length >= 4, `only ${anthropic.length} Anthropic models found`);
  });

  it('declares the watermark for the text of every Claude model Anthropic marks', () => {
    for (const { file, model } of anthropic) {
      const firstParty = new URL(model.url).hostname === 'api.anthropic.com';
      const marked =
        ANTHROPIC_MARKED.includes(model.modelId) &&
        (firstParty || !ANTHROPIC_FIRST_PARTY_ONLY.includes(model.modelId));
      if (marked) {
        assertAnthropicWatermark(model.contentMarking?.text, `${file}: text`);
      } else {
        assert.equal(model.contentMarking, undefined, `${file} declares a marking`);
      }
    }
  });

  it('declares text only: Anthropic generates no images', () => {
    for (const { file, model } of anthropic) {
      assert.equal(model.contentMarking?.image, undefined, `${file} declares image marking`);
    }
  });
});

// Capabilities follow what the providers document (Anthropic "Models overview",
// Google AI Studio model pages, Mistral "Models overview"), checked in November 2026.
describe('model capabilities', () => {
  const all = models();
  const byId = id => all.find(({ model }) => model.id === id)?.model;

  it('offers the current Claude lineup, each with a 1M context and 128K output', () => {
    for (const id of ['claude-fable-5-2', 'claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-5-5']) {
      const model = byId(id);
      assert.ok(model, `${id} is missing`);
      assert.equal(model.modelId, id);
      assert.equal(model.contextWindow, 1000000, id);
      assert.equal(model.maxOutputTokens, 128000, id);
      assert.equal(model.supportsTemperature, false, id);
    }
    // Earlier 5-series models allow the same 128K output.
    for (const id of ['claude-fable-5-1', 'claude-opus-5', 'claude-sonnet-5']) {
      assert.equal(byId(id).maxOutputTokens, 128000, id);
    }
  });

  it('offers the current Gemini 4 and Nano Banana models', () => {
    for (const id of ['gemini-4-carbon', 'gemini-4-argon']) {
      const model = byId(id);
      assert.ok(model, `${id} is missing`);
      assert.equal(model.contextWindow, 1048576, id);
      assert.equal(model.maxOutputTokens, 65536, id);
      assert.ok(['low', 'medium', 'high'].includes(model.thinking.level), id);
    }
    const banana = byId('gemini-nano-banana-2.1');
    assert.equal(banana?.supportsImageGeneration, true);
  });

  it('does not offer tools or audio input to Gemini image models: Google lists neither', () => {
    for (const { file, model } of all.filter(
      entry => isGoogle(entry) && entry.model.supportsImageGeneration === true
    )) {
      assert.equal(model.supportsTools, 'none', `${file}: function calling is not supported`);
      assert.notEqual(model.supportsAudio, true, `${file}: audio input is not supported`);
    }
  });

  it('uses the thinking levels a Gemini image model supports', () => {
    // Nano Banana 2.1: minimal, medium, high. Gemini 3.1 Flash-Lite Image: minimal, high.
    assert.ok(['minimal', 'medium', 'high'].includes(byId('gemini-nano-banana-2.1').thinking.level));
    assert.ok(['minimal', 'high'].includes(byId('gemini-3.1-flash-lite-image').thinking.level));
  });

  it('offers the GPT-6 family via the Responses API with a 1M context and 128K output', () => {
    for (const id of ['gpt-6.1-sol', 'gpt-6.1-terra', 'gpt-6-luna', 'gpt-6-astra']) {
      const model = byId(id);
      assert.ok(model, `${id} is missing`);
      assert.equal(model.modelId, id);
      assert.equal(model.provider, 'openai-responses', id);
      assert.equal(model.url, 'https://api.openai.com/v1/responses', id);
      assert.equal(model.contextWindow, 1050000, id);
      assert.equal(model.maxOutputTokens, 128000, id);
      assert.equal(model.supportsVision, true, id);
      assert.equal(model.enabled, false, id);
      assert.equal(model.default, false, id);
    }
  });

  it('keeps GPT-5 for installed copies but says that OpenAI shuts it down', () => {
    const model = byId('gpt-5');
    assert.equal(model.enabled, false);
    assert.match(model.description.en, /December 11, 2026/);
    assert.match(model.description.en, /GPT-6\.1 Sol/);
  });

  it('offers Gemini 4 Hydrogen next to Carbon and Argon', () => {
    const model = byId('gemini-4-hydrogen');
    assert.ok(model, 'gemini-4-hydrogen is missing');
    assert.equal(model.modelId, 'gemini-4-hydrogen');
    assert.equal(model.contextWindow, 1048576);
    assert.equal(model.maxOutputTokens, 65536);
    assert.ok(['low', 'medium', 'high'].includes(model.thinking.level));
  });

  it('does not enable Nano Banana 2, which Google deprecated in favour of Nano Banana 2.1', () => {
    assert.equal(byId('gemini-3.1-flash-image').enabled, false);
    assert.match(byId('gemini-3.1-flash-image').description.en, /Deprecated/);
  });

  it('points the Voxtral realtime model at Voxtral 3, not at the deprecated 2602 version', () => {
    assert.equal(byId('voxtral-mini-transcribe-realtime').modelId, 'voxtral-mini-transcribe-realtime-3-0');
  });

  it('says on the Bedrock models that AWS moved them to Legacy', () => {
    for (const id of [
      'bedrock-claude-3-5-sonnet',
      'bedrock-claude-3-7-sonnet',
      'bedrock-llama-3-3-70b',
      'bedrock-llama-4-scout'
    ]) {
      assert.match(byId(id).description.en, /Legacy/, id);
    }
  });

  it('points Mistral Large and Small at the current generation, not at deprecated ones', () => {
    assert.equal(byId('mistral-large').modelId, 'mistral-large-4');
    assert.equal(byId('mistral-large').contextWindow, 1000000);
    assert.equal(byId('mistral-small').modelId, 'mistral-small-2603');
    // Mistral deprecated Medium 3.5: it stays for installed copies but is not enabled for new ones.
    assert.equal(byId('mistral-medium').enabled, false);
  });

  it('names no model that its provider has retired', () => {
    const retired = [
      'claude-3-7-sonnet-20250219',
      'claude-3-5-haiku-20241022',
      'claude-opus-4-1-20250805',
      'claude-sonnet-4-20250514',
      'gemini-2.0-flash',
      'gemini-3-pro-preview',
      'gemini-3.1-flash-lite-preview',
      'mistral-large-2411',
      'mistral-large-2512',
      'mistral-small-2506'
    ];
    for (const { file, model } of all.filter(entry => !entry.model.provider.startsWith('bedrock'))) {
      assert.ok(!retired.includes(model.modelId), `${file} points at ${model.modelId}`);
    }
  });
});
