# Changelog

All notable changes to this project.

## [3.3.0] - 2026-11-24

### Added
- `get_ellis_ui_template` returns the whole design system: `design.md` and all four HTML pages (`index.html`, `letter.html`, `note.html`, `slideshow.html`) instead of only the root index. An optional `page` argument returns a single page by filename; unknown names are rejected with the available list. (`designer-mcp#41`)
- `list_ellis_ui_designs` returns a compact JSON index — name, title, concept, typography, palette and page names — instead of embedding the full `design.md` in every entry. The 24-template response drops from the full corpus to a scannable index. (`designer-mcp#41`)

### Fixed
- Both Ellis UI tools emitted literal `\n` two-character sequences instead of newlines. Output now contains real line breaks, and a parsing bug that turned each list title into the whole document is gone. (`designer-mcp#41`)
- The templates no longer claim "Zero Dependencies". They use no JS framework, but every page loads the Tailwind Play CDN and Google Fonts and some hotlink icons; `design.md` and the README now say so and warn that the Play CDN is a development tool to compile away before shipping. (`designer-mcp#41`)
- The personal Ellis letter copy is intentionally retained; these templates originated as a birthday project, and the showcase is part of their identity.

## [3.2.3] - 2026-11-23

### Fixed
- The tool reference is owned by the ecosystem generator. 3.2.2 added a local generator for `docs/TOOLS.md`, which produced a second, incompatible format and failed CI once the ecosystem regenerated the file. The local generator and its `docs:generate`/`docs:check` scripts are removed; the consistency test still reads a live `tools/list` and checks the README counts against it.

## [3.2.2] - 2026-11-23

### Fixed
- Published counts and enums are derived from the live data instead of hand-written copies. The anti-slop test is 37 gates (was "35"), the brand catalogue summary is 68 unique brands in 9 categories over 72 listings (was "62 brands"), motion snippets expose 14 categories (was 8), the theme catalogue is 19, the design systems are 18, and the README tool count follows `tools/list`. (`designer-mcp#45`)
- Two rules that contradicted the code are gone: "max 4-5 size steps" (the tokens emit 8) and "no animation longer than 500ms" (presets deliberately exceed it).
- `get_reference` no longer returns the server absolute reference path; it lists the available reference names.
- A consistency test spawns the built server, reads the live catalogues, and fails when a published number, enum or list disagrees. Counts that cannot be derived (the getdesign catalogue size, the host-dependent advertised tool count) are not claimed.

## [3.2.1] - 2026-11-22

### Fixed
- `get_component` React output is a real component: it merges `className`, renders `children`, forwards `onClick`/`disabled`/remaining props and a ref, and derives its classes from the requested style and palette instead of returning a hard-coded demo gallery. Carbon and neo-brutalism now produce different components, and the test typechecks and renders the snippet. (`designer-mcp#42`)

## [3.2.0] - 2026-11-22

### Fixed
- Every stored theme colour is inside sRGB again, and so is every derived one. The 19 accents and 19 papers carried 1.1x-3.1x the displayable chroma, and the paper-band/text/accent-2 derivations added more; a walk of the full tool response found 79 out-of-gamut values after the catalogue was fixed. Stored values are clamped at 3-decimal CSS precision (lightness and hue preserved) and all derivations go through `derivedOklch`. Verified externally: 0 of 342 emitted values out of gamut. (`designer-mcp#40`)
- `stitch_sync_design_system` writes one accent, not two. `DESIGN.md` and `.stitch/design-system.json` now come from the same resolved theme (`oklchToHex` of the accent), so the canvas hex and the oklch token agree; the hard-coded `#3B82F6`/`#10B981` alternates are gone. (`designer-mcp#37`)
- `generate_template` applies its palette. The browser shell assigned the CommonJS build output to a `<script>`, so `module.exports` never reached Tailwind and the CTA rendered unstyled; it now assigns `tailwind.config`. (`designer-mcp#44`)
- `generate_8state_component` renders eight states. State classes are merged into a single `class` attribute (a second one was discarded), the toggle has a 48 px track with real hover/focus/active styling, Loading/Error/Success differ structurally, and the script pins anime 3.2.2 with a guarded bootstrap. Headless Chrome: 8 of 8 distinct computed-style signatures. (`designer-mcp#38`)
- `logo_workflow search` matches the whole catalogue. Free text now covers industry, mark/symbol type, technique, geometry, type style, case, mood, colour and aspect, reports which field matched, and a zero result returns a reason, the catalogue total, the searched fields and facet suggestions. (`designer-mcp#39`)
- `export_project` covers `index.html` in the Tailwind `content` globs, so the exported page is not built unstyled. Verified by matching every emitted HTML file against the config. (`designer-mcp#43`)

## [3.1.0] - 2026-11-22

### Changed
- The five CLI-dependent Stitch tools (`stitch_create`, `stitch_find`, `stitch_generate`, `stitch_resource`, `stitch_sync_design_system`) are advertised only when the CLI is present. They were exposed on hosts without the binary, loading five dead schemas into every client and deferring the failure to call time. `stitch_screen_audit` stays: it is a local static analysis. Override with `HELA_PHENOTYPE_STITCH=1` (force on) or `0` (force off). 23 advertised tools without the CLI, 28 with.

### Fixed
- Inline contrast is measured, not string-matched. `design_audit` only flagged identical colour strings, so white-on-white at 1.01:1 and yellow-on-white at 1.07:1 passed and fed the score; the sample page graded A/96. It now computes WCAG 2.x relative luminance and fails anything under 4.5:1 (serious under 3:1). Same sample: B/75 with two measured issues. (`designer-mcp#34`)
- Palette variants treat achromatic colours as achromatic. Muted and Vivid added saturation to greys because an undefined HSL hue reads as 0 (red), so `#767676` came back as `#816a6a`. Both now return the input unchanged when saturation is ~0, and Muted no longer floors saturation at 10%. (`designer-mcp#32`)
- The "High Contrast" variant no longer asserts WCAG AAA on a single colour: contrast is a property of a pair, so the label names the surface it was measured against. (`designer-mcp#33`)
- `design_tokens` clamps the derived `--color-focus` chroma into sRGB. Accent chroma +0.1 at hue 250 (L 55-65) is outside the gamut; the token is now the largest displayable chroma at that lightness and hue. (`designer-mcp#35`)

## [3.0.5] - 2026-11-19

### Changed
- npm audit fix clears two advisories; tool behaviour unchanged.

## [3.0.4] - 2026-11-18

### Fixed
- The advertised MCP server version now comes from one `MCP_SERVER_VERSION` constant used by ServerInfo and the exported project scaffold, so a `package.json` bump can no longer leave the server reporting an old number.

### Tests
- Added `test/version.test.mjs` (run first by `npm test`) asserting the constant equals `package.json.version`.

## [3.0.3] - 2026-11-15

### Added
- Bundled Google's pinned `modern-web-guidance` skill and exposed it through `list_installed_skills`.

## [3.0.2] - 2026-11-15

### Added
- Added the `brand-architecture` skill for portfolio relationship models, naming hierarchy, visual/verbal linkage, migration, governance, and measurement planning.
- Exposed the skill through `list_installed_skills` alongside the existing Phenotype design skills.

## [3.0.1] - 2026-11-13

### Fixed
- Corrected palette path resolution and missing-reference handling.

### Changed
- Updated dependency metadata and synchronized canonical documentation.

## [3.0.0] - 2026-10-31

### Changed
- **Version reset to 3.0.0** — per-server version metadata baseline reset (Phase 7). All `package.json`, MCP `ServerInfo.version`, and HTTP metadata now report `3.0.0`. This is a metadata/interface baseline reset; for `hela-plastid` it is not an upgrade from the previous `4.2.0` advert.

