import assert from 'node:assert/strict';
import { runSlopTest } from '../src/anti-patterns.ts';

let n = 0;
const t = (name, fn) => {
  fn();
  n++;
  console.log(`ok ${n} - ${name}`);
};

function gate14(html) {
  const result = runSlopTest(html);
  const gate = result.gates.find((g) => g.id === 14);
  assert.ok(gate, 'gate 14 missing from runSlopTest');
  return gate;
}

const cases = [
  ['no font-family at all', '<html><body><h1>none</h1></body></html>', false],
  [
    'one system font (the case that lied)',
    '<html><body style="font-family: system-ui"><h1>x</h1></body></html>',
    false,
  ],
  [
    'one family declared on several elements',
    '<html><body style="font-family: Georgia"><h1 style="font-family: Georgia">x</h1></body></html>',
    false,
  ],
  [
    'two distinct families',
    '<html><body style="font-family: Georgia, serif"><h1 style="font-family: Impact, sans-serif">x</h1></body></html>',
    true,
  ],
  [
    'two families through tokens',
    '<html><body style="font-family: var(--font-body)"><h1 style="font-family: var(--font-display)">x</h1></body></html>',
    true,
  ],
];

for (const [name, html, expectPass] of cases) {
  t(`gate 14 ${expectPass ? 'passes' : 'fails'} and says so: ${name}`, () => {
    const gate = gate14(html);
    assert.equal(gate.pass, expectPass, 'verdict');
    assert.equal(/found/i.test(gate.detail), gate.pass, `detail disagreed: "${gate.detail}"`);
  });
}

t('gate 14 names the single family it found, so the fix is actionable', () => {
  const gate = gate14('<html><body style="font-family: system-ui"><h1>x</h1></body></html>');
  assert.match(gate.detail, /system-ui/);
});

console.log(`\n1..${n}`);
