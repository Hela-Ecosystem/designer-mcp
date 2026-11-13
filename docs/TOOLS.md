# HeLa Phenotype: canonical tools

Server version **3.0.1**. Generated from the ecosystem schema catalog; regenerate with `npm run docs:generate -- --servers` in the ecosystem checkout.

Only names advertised by `tools/list` are listed here. Older aliases in migration examples are not additional tools. Runtime namespace prefixes are optional and do not change these server-local names.

## `brand_fetch_design_md`

Download and return the DESIGN.md for a real brand (stripe, vercel, linear, notion, claude, tesla, etc.).

## `brand_list`

List the curated local brand catalog (62 brands across 7 categories) grouped by category. For DESIGN.md retrieval beyond this list, use brand_fetch_design_md, which resolves the full 328+ brand getdesign catalog.

## `design_audit`

Audit design work. Select action: accessibility (25-check WCAG 2.1), slop (35-gate anti-pattern check), critique (6-axis quality score), or preflight (scan an existing project's design tokens and stack).

Actions: `accessibility`, `slop`, `critique`, `preflight`.

## `design_tokens`

Generate design tokens. Select action: theme (named theme or genre), custom (OKLCH paper/accent + fonts), css (vanilla/CSS Modules/SCSS/variables-only), or tailwind (complete tailwind.config.js).

Actions: `theme`, `custom`, `css`, `tailwind`.

## `detect_genre`

Detect the most appropriate design genre from a product description or brief. Returns one of: editorial, modern-minimal, atmospheric, playful.

## `evaluate_style`

Evaluates a product description against all design systems and returns ranked style recommendations with scoring. USE THIS FIRST before generate_rules. Takes a product context (e.g. 'automotive gaming mouse', 'enterprise dashboard', 'luxury ecommerce') and returns the best-matching style, palette, archetype, and a step-by-step workflow.

## `export_project`

Export a complete project scaffold: tailwind.config.js, index.html, input.css, package.json, and component files. Returns all files as a structured manifest ready to write to disk.

## `generate_8state_component`

Generate a complete 8-state component demo page (default, hover, focus, active, disabled, loading, error, success) for a given component kind. Returns a standalone HTML preview file with all states rendered.

## `generate_motion_snippet`

Generate a ready-to-paste anime.js v3 animation snippet for a given motion category and design style. Returns CDN link, code snippet, usage hint, and reduced-motion note. Categories: entrance, micro, stagger, scroll, loader, transition, counter, typewriter. All snippets include prefers-reduced-motion guards.

## `generate_rules`

Generate design rules for a style + palette + optional archetype/hybrid. IMPORTANT: Run evaluate_style first to determine the best style for your product context. Only use this tool after evaluation confirms the style choice.

## `generate_template`

Generate a full HTML starter page for a style + palette + archetype combination. IMPORTANT: Run evaluate_style first to determine the best style/palette/archetype for your product context.

## `get_component`

Get a production-ready component snippet styled for a specific design system. Supports HTML (Tailwind), React (TSX functional component with typed props), and Vue 3 (SFC with script setup). IMPORTANT: Run evaluate_style first to confirm the style choice.

## `get_cross_cutting_rules`

Get standalone cross-cutting design rules by category. Categories: icons, accessibility, motion, tokens, responsive, tailwind. Returns the rules as a formatted string.

## `get_ellis_ui_template`

Fetch the HTML structure and CSS logic of a specific Ellis UI design system (e.g., 'backup_dossier' or 'backup_gameboy'). Returns both the design.md guidelines and the root index.html template.

## `get_reference`

Return the full content of a reference document by name (e.g. 'ant-design', 'accessibility', 'design-tokens', 'getdesign-md').

## `list_ellis_ui_designs`

List all 24 bespoke Ellis UI component design templates with their specific aesthetic focus.

## `list_installed_skills`

Detect and list all installed skill submodules alongside this MCP. Shows which skills are available for standalone use and what capabilities they provide.

## `list_options`

List all available design systems, palettes, archetypes, and valid hybrid combinations.

## `list_themes`

List all available named themes, optionally filtered by genre. Each theme includes paper/accent OKLCH values, font pairing, and axis metadata for diversification.

## `logo_workflow`

Logo-design workflow. Select action: audit, search, renderers, render, export_variants, concept_sheet, preview_sheet, or presentation_board. Search queries the 1,400+ mark library; render/export/board actions write files.

Actions: `audit`, `search`, `renderers`, `render`, `export_variants`, `concept_sheet`, `preview_sheet`, `presentation_board`.

## `palette`

Fetch live palettes from Color Hunt, convert palette JSON into CSS/Tailwind/SCSS/Figma/Android/Swift, or generate light/dark/high-contrast/muted/vivid variants. Select action: fetch, convert, or variants.

Actions: `fetch`, `convert`, `variants`.

## `stitch_create`

Creates one Stitch resource (project, screen, design-system). Mirrors 'stitch create <resource>'. Returns created resource metadata.

## `stitch_find`

Lists Stitch resources of a given type (projects, screens, design-systems). Mirrors 'stitch find <resource>'. Returns items list, count, and pagination info.

## `stitch_generate`

Triggers a backend generative creation job for Stitch screens or variants. Mirrors 'stitch generate <resource>'.

## `stitch_resource`

Read, edit, or delete one Stitch resource, or print its canonical canvas URL. Select action: get, edit, delete, or url.

Actions: `get`, `edit`, `delete`, `url`.

## `stitch_screen_audit`

Run a unified audit on a Stitch-captured HTML screen or file. Executes 25-check WCAG 2.1 static analysis, 35+ gate anti-slop checks, and 6-axis craft critique.

## `stitch_sync_design_system`

Export the current or chosen OKLCH theme and design rules into a Stitch-compliant DESIGN.md and .stitch/design-system.json for automated visual canvas synchronization.

## `validate_combo`

Validate a style + palette + optional hybrid combination before generating rules.
