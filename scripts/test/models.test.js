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
