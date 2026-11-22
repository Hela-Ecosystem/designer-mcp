import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generatePaletteVariants } from '../dist/palette-variants.js';
import { auditA11y } from '../dist/a11y-audit.js';
import { buildCustomTokens, generateTokens, listThemes } from '../dist/tokens.js';
import { isStitchCliTool, STITCH_CLI_TOOLS } from '../dist/stitch.js';

let n = 0;
const t = (name, fn) => { fn(); n++; console.log(`ok ${n} - ${name}`); };

// #32 — achromatic input must not acquire a hue
t('grey variants stay grey', () => {
  const variants = generatePaletteVariants(['#767676']);
  const muted = variants.find((v) => v.name === 'Muted').colors[0];
  const vivid = variants.find((v) => v.name === 'Vivid').colors[0];
  assert.equal(muted, '#767676', `Muted tinted the grey: ${muted}`);
  assert.equal(vivid, '#767676', `Vivid tinted the grey: ${vivid}`);
});

t('coloured variants still move saturation', () => {
  const variants = generatePaletteVariants(['#3b82f6']);
  const muted = variants.find((v) => v.name === 'Muted').colors[0];
  const vivid = variants.find((v) => v.name === 'Vivid').colors[0];
  assert.notEqual(muted, '#3b82f6');
  assert.notEqual(vivid, '#3b82f6');
  assert.notEqual(muted, vivid);
});

// #33 — contrast claim names its surface
t('high contrast label qualifies the background', () => {
  const label = generatePaletteVariants(['#073c92']).find((v) => v.name === 'High Contrast').description;
  assert.match(label, /against light backgrounds/i);
  assert.match(label, /#ffffff/);
});

// #34 — inline contrast is measured, not string-matched
t('invisible and low-contrast inline text fail the check', () => {
  const html = `<!doctype html><html lang="en"><head><title>t</title></head><body><main>
    <p style="color:#fefefe;background-color:#ffffff">invisible</p>
    <span style="color:#ffff00;background-color:#ffffff">yellow on white</span>
    <p style="color:#999999;background-color:#ffffff">grey on white</p>
  </main></body></html>`;
  const result = auditA11y(html);
  const contrast = result.issues.filter((i) => i.rule === 'color-contrast-inline');
  assert.equal(contrast.length, 3, `expected three contrast failures, got ${contrast.length}`);
  assert.match(contrast[0].description, /1\.0\d:1/);
  assert.ok(contrast.every((i) => i.severity === 'serious' || i.severity === 'moderate'));
});

t('passing contrast is not flagged', () => {
  const html = `<!doctype html><html lang="en"><head><title>t</title></head><body><main>
    <p style="color:#000000;background-color:#ffffff">fine</p>
  </main></body></html>`;
  const result = auditA11y(html);
  assert.equal(result.issues.filter((i) => i.rule === 'color-contrast-inline').length, 0);
});

// #35 — derived focus token stays inside sRGB
const oklchToLinearSrgb = (l, c, h) => {
  const L = l / 100, C = c, H = (h * Math.PI) / 180;
  const a = C * Math.cos(H), b = C * Math.sin(H);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  return [
    4.0767416621 * l_ ** 3 - 3.3077115913 * m_ ** 3 + 0.2309699292 * s_ ** 3,
    -1.2684380046 * l_ ** 3 + 2.6097574011 * m_ ** 3 - 0.3413193965 * s_ ** 3,
    -0.0041960863 * l_ ** 3 - 0.7034186147 * m_ ** 3 + 1.707614701 * s_ ** 3,
  ];
};
const isInSrgb = (rgb) => {
  const epsilon = 1e-6;
  return rgb.every((channel) => channel >= -epsilon && channel <= 1 + epsilon);
};
const parseOklch = (value) => {
  const m = /oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/.exec(value);
  assert.ok(m, `not an oklch token: ${value}`);
  return { l: Number(m[1]), c: Number(m[2]), h: Number(m[3]) };
};

// Convert the canvas's 8-bit sRGB value back to OKLCH for comparison.
function hexToOklch(hex) {
  assert.match(hex, /^#[\da-f]{6}$/i);
  const [r, g, b] = hex.slice(1).match(/../g).map((byte) => {
    const srgb = Number.parseInt(byte, 16) / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const labB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return {
    l: 100 * (0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s),
    c: Math.hypot(a, labB),
    h: (Math.atan2(labB, a) * 180 / Math.PI + 360) % 360,
  };
}

// #40 — catalogue colours fit sRGB before token generation
t('all stored theme colours are inside the sRGB gamut', () => {
  const outOfGamut = [];
  const themes = listThemes();
  assert.ok(themes.length > 0, 'theme catalogue is empty');
  for (const theme of themes) {
    for (const key of ['paper', 'accent']) {
      const { l, c, h } = theme[key];
      const rgb = oklchToLinearSrgb(l, c / 100, h);
      if (!isInSrgb(rgb)) {
        outOfGamut.push(`${theme.name} ${key}: ${rgb.join(', ')}`);
      }
    }
  }
  assert.deepEqual(outOfGamut, []);
});

t('every emitted named theme colour fits sRGB at CSS precision', () => {
  const outOfGamut = [];
  for (const theme of listThemes()) {
    const { tokens, dark_tokens: counterpart } = generateTokens(theme.name);
    for (const key of ['paper', 'accent']) {
      const { l, c, h } = theme[key];
      assert.equal(tokens.colors[`--color-${key}`], `oklch(${l}% ${(c / 100).toFixed(3)} ${h})`,
        `${theme.name} ${key}`);
    }
    for (const [label, set] of [['tokens', tokens], ['dark_tokens', counterpart]]) {
      assert.equal(parseOklch(set.colors['--color-focus']).h, theme.accent.h, theme.name);
      for (const [key, value] of Object.entries(set.colors)) {
        const { l, c, h } = parseOklch(value);
        const rgb = oklchToLinearSrgb(l, c, h);
        if (!isInSrgb(rgb)) {
          outOfGamut.push(`${theme.name} ${label} ${key}: ${value} -> ${rgb.join(', ')}`);
        }
      }
    }
  }
  assert.deepEqual(outOfGamut, []);
});

t('focus token is clamped into the sRGB gamut', () => {
  const result = buildCustomTokens(
    { l: 97, c: 0.4, h: 90 },
    { l: 55, c: 18, h: 250 },
    'Plus Jakarta Sans',
    'Inter',
  );
  for (const set of [result.tokens, result.dark_tokens]) {
    const focus = parseOklch(set.colors['--color-focus']);
    assert.ok(focus.c < 0.28, `focus chroma not reduced: ${focus.c}`);
    const rgb = oklchToLinearSrgb(focus.l, focus.c, focus.h);
    assert.ok(isInSrgb(rgb), `out of gamut: ${JSON.stringify(rgb)}`);
  }
});

// #36 — the CLI-dependent set is explicit and excludes the local audit
t('stitch gating targets only CLI-dependent tools', () => {
  assert.deepEqual([...STITCH_CLI_TOOLS].sort(), [
    'stitch_create', 'stitch_find', 'stitch_generate', 'stitch_resource', 'stitch_sync_design_system',
  ]);
  assert.equal(isStitchCliTool('stitch_screen_audit'), false);
  assert.equal(isStitchCliTool('stitch_get'), false);
});

// #37 — the canvas and CSS receive the same in-gamut accent.
t('stitch sync writes matching canvas and Markdown accents in sRGB', () => {
  const targetDir = mkdtempSync(join(tmpdir(), 'phenotype-stitch-sync-'));
  try {
    const call = spawnSync(process.execPath, [fileURLToPath(new URL('../dist/index.js', import.meta.url))], {
      // Enable the Stitch CLI gate explicitly. Sync itself only writes local files.
      env: { ...process.env, HELA_PHENOTYPE_STITCH: '1', HELA_ENVELOPE: 'false' },
      input: [
        { jsonrpc: '2.0', id: 1, method: 'initialize',
          params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'stitch-regression', version: '1' } } },
        { jsonrpc: '2.0', method: 'notifications/initialized' },
        { jsonrpc: '2.0', id: 2, method: 'tools/call',
          params: { name: 'stitch_sync_design_system', arguments: { themeName: 'Studio', style: 'minimal', targetDir } } },
      ].map((request) => JSON.stringify(request)).join('\n') + '\n',
      encoding: 'utf8',
      timeout: 10_000,
    });
    assert.ifError(call.error);
    assert.equal(call.status, 0, call.stderr);
    const reply = call.stdout.trim().split('\n').map((line) => JSON.parse(line))
      .find((message) => message.id === 2);
    assert.ok(reply?.result && !reply.result.isError, call.stdout);
    assert.equal(JSON.parse(reply.result.content[0].text).theme, 'Studio');

    const markdown = readFileSync(join(targetDir, 'DESIGN.md'), 'utf8');
    const { designSystem } = JSON.parse(readFileSync(join(targetDir, '.stitch', 'design-system.json'), 'utf8'));
    const markdownColors = Object.fromEntries(
      [...markdown.matchAll(/^- `--color-([\w-]+)`: `(oklch\([^)]+\))`$/gm)]
        .map(([, name, value]) => [name, value]),
    );
    assert.deepEqual(Object.keys(designSystem.tokens).sort(), ['accent', 'border', 'paper', 'text']);
    for (const [name, value] of Object.entries(designSystem.tokens)) {
      assert.equal(markdownColors[name], value, name);
    }
    assert.deepEqual(Object.keys(markdownColors).sort(), ['accent', 'border', 'paper', 'paper-2', 'text']);
    for (const value of Object.values(markdownColors)) {
      const { l, c, h } = parseOklch(value);
      assert.ok(isInSrgb(oklchToLinearSrgb(l, c, h)), `${value} is outside sRGB`);
    }

    const token = parseOklch(markdownColors.accent);
    const canvas = hexToOklch(designSystem.theme.customColor);
    const hueDelta = Math.abs(canvas.h - token.h);
    // Allow for rounding to 8-bit sRGB.
    assert.ok(Math.min(hueDelta, 360 - hueDelta) < 1, `accent hue differs: ${canvas.h}° vs ${token.h}°`);
    assert.ok(Math.abs(canvas.c - token.c) < 0.002, `accent chroma differs: ${canvas.c} vs ${token.c}`);
    assert.ok(Math.abs(canvas.l - token.l) < 0.3, `accent lightness differs: ${canvas.l}% vs ${token.l}%`);
  } finally {
    rmSync(targetDir, { recursive: true, force: true });
  }
});

console.log(`\n${n} phenotype fixes verified`);
