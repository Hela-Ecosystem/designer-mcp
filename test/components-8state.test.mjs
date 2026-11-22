import assert from 'node:assert/strict';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { generate8StateWrapperHtml } from '../dist/components-8state.js';

const kinds = ['button', 'input', 'toggle', 'chip', 'select'];
const toggleHtml = generate8StateWrapperHtml('toggle');

test('state classes share a single class attribute with the base class for every kind', () => {
  for (const kind of kinds) {
    const html = generate8StateWrapperHtml(kind);
    const markup = html.replace(/<(style|script)\b[^>]*>[\s\S]*?<\/\1>/g, '');
    const openingTags = markup.match(/<[a-z][\w-]*(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi);
    for (const tag of openingTags) {
      const attributes = [...tag.matchAll(/\s+([^\s=/<>]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g)];
      assert.ok(attributes.filter(([, name]) => name.toLowerCase() === 'class').length <= 1, tag);
    }
    const baseClass = { button: 'btn', toggle: 'toggle-input' }[kind] ?? kind;
    for (const state of ['hover', 'focus', 'active']) {
      assert.match(markup, new RegExp(`class="${baseClass} is-${state}"`));
    }
  }
});

test('the eight toggle rows have distinct non-text signatures', () => {
  const controls = [...toggleHtml.matchAll(/<div class="demo-component">(<label class="toggle">.*?<\/label>)/g)]
    .map(([, control]) => control);
  assert.equal(controls.length, 8);
  assert.equal(new Set(controls.map((control) => control.replace(/>[^<]+</g, '><'))).size, 8);

  const [defaults, hover, focus, active, disabled, loading, error, success] = controls;
  for (const control of controls) {
    assert.match(control, /class="toggle-track"[^>]*><span class="toggle-thumb">/);
  }
  assert.match(defaults, /class="toggle-input"\s*\/>/);
  assert.match(hover, /class="toggle-input is-hover"/);
  assert.match(focus, /class="toggle-input is-focus"/);
  assert.match(active, /class="toggle-input is-active"/);
  assert.match(disabled, /<input[^>]+\bdisabled\b/);
  assert.match(loading, /<input[^>]+aria-busy="true"/);
  assert.match(loading, /<span class="toggle-spinner"[^>]*>/);
  assert.match(error, /<input[^>]+aria-invalid="true"/);
  assert.match(error, /<span class="toggle-status">!<\/span>/);
  assert.match(success, /<input[^>]+\bchecked\b/);
  assert.match(success, /<span class="toggle-status">✓<\/span>/);
});

test('toggle geometry and simulated interaction styles are present in the generated CSS', () => {
  assert.match(toggleHtml, /\.toggle-track\s*\{[^}]*\bwidth:\s*[1-9]\d*px/);
  assert.match(toggleHtml, /\.toggle-thumb\s*\{[^}]*\bwidth:\s*[1-9]\d*px/);
  assert.match(toggleHtml, /\.toggle-input\.is-hover \+ \.toggle-track\s*\{[^}]*border-color:/);
  assert.match(toggleHtml, /\.toggle-input\.is-focus \+ \.toggle-track\s*\{[^}]*outline:/);
  assert.match(toggleHtml, /\.toggle-input\.is-active \+ \.toggle-track \.toggle-thumb\s*\{[^}]*transform:/);
});

test('the animation script pins v3 and tolerates an unavailable or v4 global', () => {
  assert.match(toggleHtml, /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/animejs@3\.2\.2\/lib\/anime\.min\.js"><\/script>/);
  assert.doesNotMatch(toggleHtml, /<script[^>]+animejs@4/);
  const [, script] = toggleHtml.match(/<script>([\s\S]+?)<\/script>/);
  const window = { matchMedia: () => ({ matches: false }) };
  const document = { querySelectorAll: () => [] };
  runInNewContext(script, { window, document });
  runInNewContext(script, { window, document, anime: { animate() {}, stagger() {} } });

  const animations = [];
  const anime = (options) => animations.push(options.targets);
  anime.stagger = () => 0;
  runInNewContext(script, { window, document, anime });
  assert.deepEqual(animations, ['.demo-row']);
});
