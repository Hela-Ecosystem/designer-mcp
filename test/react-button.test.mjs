import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { parseHTML } from 'linkedom';
import { createElement, createRef } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const temp = mkdtempSync(fileURLToPath(new URL('./.react-button-', import.meta.url)));
const client = new Client({ name: 'react-button-test', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [fileURLToPath(new URL('../dist/index.js', import.meta.url))],
  env: { HELA_ENVELOPE: 'false', HELA_PHENOTYPE_STITCH: '0' },
});

const snippets = {};

async function loadButton(name) {
  const path = join(temp, `${name}.mjs`);
  const { outputText } = ts.transpileModule(snippets[name], {
    compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  writeFileSync(path, outputText);
  return (await import(pathToFileURL(path))).Button;
}

function renderedButton(Button, props, children) {
  const html = renderToStaticMarkup(createElement(Button, props, children));
  const { document } = parseHTML(html);
  const buttons = document.querySelectorAll('button');
  assert.equal(buttons.length, 1);
  return buttons[0];
}

before(async () => {
  await client.connect(transport);
  for (const [name, args] of Object.entries({
    carbon: { style: 'carbon' },
    brutal: { style: 'neo-brutalism' },
    pastel: { style: 'carbon', palette: 'pastel' },
  })) {
    const result = await client.callTool({
      name: 'get_component',
      arguments: { component: 'button', framework: 'react', ...args },
    });
    assert.ok(!result.isError, result.content[0]?.text);
    snippets[name] = result.content[0].text;
    writeFileSync(join(temp, `${name}.tsx`), snippets[name]);
  }
});

after(async () => {
  await client.close();
  rmSync(temp, { force: true, recursive: true });
});

test('React button renders one button with custom children and merged classes', async () => {
  const Button = await loadButton('carbon');
  const button = renderedButton(
    Button, { className: 'my-button', disabled: true }, createElement('span', null, 'Save'),
  );
  assert.ok(button.classList.contains('my-button'));
  assert.ok(button.classList.contains('rounded-none'));
  assert.equal(button.querySelector('span')?.textContent, 'Save');
  assert.ok(button.hasAttribute('disabled'));
  assert.equal(button.getAttribute('type'), 'button');
});

test('React button applies variants, styles, and palettes to the rendered classes', async () => {
  const [Carbon, Brutal, Pastel] = await Promise.all(['carbon', 'brutal', 'pastel'].map(loadButton));
  const carbon = renderedButton(Carbon, {}, 'Save').classList;
  const brutal = renderedButton(Brutal, {}, 'Save').classList;
  const pastel = renderedButton(Pastel, {}, 'Save').classList;
  assert.ok(carbon.contains('rounded-none'));
  assert.ok(carbon.contains('bg-[#0f62fe]'));
  assert.ok(pastel.contains('bg-[#f472b6]'));
  assert.ok(brutal.contains('shadow-[4px_4px_0px_rgba(0,0,0,1)]'));
  assert.ok(!brutal.contains('neo-shadow'));
  assert.ok(brutal.contains('motion-safe:enabled:hover:translate-x-[2px]'));
  assert.notDeepEqual([...carbon].sort(), [...brutal].sort());
  assert.notDeepEqual([...carbon].sort(), [...pastel].sort());
  const variants = ['primary', 'secondary', 'outline', 'ghost'];
  const classes = variants.map(variant => renderedButton(Carbon, { variant }, 'Save').className);
  assert.equal(new Set(classes).size, variants.length);
  assert.equal(classes[0], [...carbon].join(' '));
});

test('React button forwards clicks, refs, and ordinary button attributes', async t => {
  const Button = await loadButton('carbon');
  const { window, document } = parseHTML('<html><body><form id="root"></form></body></html>');
  const previous = { window: globalThis.window, document: globalThis.document };
  Object.assign(globalThis, { window, document });
  const container = document.getElementById('root');
  const root = createRoot(container);
  const ref = createRef();
  const onClick = t.mock.fn();

  try {
    const props = { onClick, ref, type: 'submit', name: 'action' };
    flushSync(() => root.render(createElement(Button, props, 'Save')));
    const buttons = container.querySelectorAll('button');
    assert.equal(buttons.length, 1);
    const [button] = buttons;
    assert.equal(ref.current, button);
    assert.equal(button.getAttribute('type'), 'submit');
    assert.equal(button.getAttribute('name'), 'action');
    button.dispatchEvent(new window.Event('click', { bubbles: true }));
    assert.equal(onClick.mock.callCount(), 1);
    flushSync(() => root.render(createElement(Button, { ...props, disabled: true }, 'Save')));
    button.dispatchEvent(new window.Event('click', { bubbles: true }));
    assert.equal(onClick.mock.callCount(), 1);
  } finally {
    root.unmount();
    Object.assign(globalThis, previous);
  }
});

test('generated React buttons pass tsc --noEmit with strict unused checks', () => {
  const tsc = fileURLToPath(new URL('../node_modules/typescript/bin/tsc', import.meta.url));
  execFileSync(process.execPath, [
    tsc, '--noEmit', '--strict', '--skipLibCheck', '--noUnusedLocals', '--noUnusedParameters',
    '--esModuleInterop', '--jsx', 'react', '--target', 'ES2022', '--module', 'NodeNext',
    ...Object.keys(snippets).map(name => join(temp, `${name}.tsx`)),
  ], { stdio: 'inherit' });
});
