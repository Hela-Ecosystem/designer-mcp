# Changelog

All notable changes to this project.

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

