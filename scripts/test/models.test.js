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

/** A SynthID declaration by the provider, with the reference to Google's statement. */
function assertSynthId(marking, label) {
  assert.ok(marking, `${label} declares no marking`);
  assert.equal(marking.by, 'provider', label);
  assert.equal(marking.scheme, 'synthid', label);
  assert.match(marking.statementRef, /^Google DeepMind, SynthID: https:\/\/deepmind\.google\//, label);
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

  it('declares a marking nowhere else', () => {
    for (const { file, model } of models().filter(entry => !isGoogle(entry))) {
      assert.equal(
        model.contentMarking,
        undefined,
        `${file}: no provider other than Google is declared marked here`
      );
    }
  });
});
