import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

import {
  STYLES,
  PALETTES,
  ARCHETYPES,
  HYBRIDS,
  CROSS_CUTTING,
  buildSingle,
} from "../dist/rules.js";
import { listThemes, listGenres, TEXT_STEP_COUNT } from "../dist/tokens.js";
import {
  MOTION_CATEGORIES,
  generateMotionSnippet,
} from "../dist/anime-motion.js";
import {
  COMPONENT_TYPES,
  OUTPUT_FRAMEWORKS,
} from "../dist/components.js";
import {
  ALL_8_STATES,
  COMPONENT_KINDS,
  COMPONENT_STATE_COUNT,
} from "../dist/components-8state.js";
import { A11Y_CHECK_COUNT } from "../dist/a11y-audit.js";
import {
  QUALITY_AXES,
  QUALITY_AXIS_COUNT,
  SLOP_GATE_COUNT,
  countSlopGates,
  runSlopTest,
} from "../dist/anti-patterns.js";
import {
  PALETTE_ACTIONS,
  DESIGN_AUDIT_ACTIONS,
  MOTION_ENGINES,
} from "../dist/actions.js";
import { CSS_OUTPUT_FORMATS } from "../dist/css-output.js";
import { LOGO_ACTIONS, logoLibraryMarkCount } from "../dist/logoTools.js";
import {
  BRAND_CATALOG,
  BRAND_CATEGORY_NAMES,
  summarizeBrandCatalog,
} from "../dist/brands.js";

let n = 0;
const t = (name, fn) => {
  fn();
  n++;
  console.log(`ok ${n} - ${name}`);
};

/**
 * Live tools/list from the built server. docs/TOOLS.md itself is owned by the
 * ecosystem generator (`npm run docs:generate -- --servers`), so this only reads
 * the count and names to compare against README claims.
 */
function fetchTools() {
  const child = spawnSync(
    process.execPath,
    [new URL("../dist/index.js", import.meta.url).pathname],
    {
      input: [
        JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: { name: "consistency", version: "1" },
          },
        }),
        JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
        JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list" }),
        "",
      ].join("\n"),
      encoding: "utf8",
      env: { ...process.env, HELA_PHENOTYPE_STITCH: "1" },
      timeout: 30000,
    },
  );
  const reply = String(child.stdout || "")
    .split("\n")
    .map((entry) => {
      try {
        return JSON.parse(entry);
      } catch {
        return null;
      }
    })
    .find((entry) => entry?.id === 2);
  assert.ok(reply, "the built server answered tools/list");
  return reply.result.tools;
}

const tools = fetchTools();
const byName = new Map(tools.map((tool) => [tool.name, tool]));
const tool = (name) => {
  const entry = byName.get(name);
  assert.ok(entry, `tool ${name} is not advertised`);
  return entry;
};
const prop = (toolName, property) => {
  const schema = tool(toolName).inputSchema?.properties?.[property];
  assert.ok(schema, `${toolName}.${property} is missing from its schema`);
  return schema;
};
const sorted = (values) => [...values].sort();
const assertEnum = (toolName, property, expected) => {
  const actual = prop(toolName, property).enum;
  assert.ok(Array.isArray(actual), `${toolName}.${property} has no enum`);
  assert.deepEqual(sorted(actual), sorted(expected), `${toolName}.${property}`);
};
const assertPublished = (haystack, needle, label) => {
  assert.ok(haystack.includes(needle), `${label} is missing "${needle}"`);
};

const styles = Object.keys(STYLES);
const palettes = Object.keys(PALETTES);
const archetypes = Object.keys(ARCHETYPES);
const hybrids = Object.keys(HYBRIDS);
const crossCutting = Object.keys(CROSS_CUTTING);
const genres = listGenres();
const themes = listThemes();
const themeNames = themes.map(({ name }) => name);
const brands = summarizeBrandCatalog(BRAND_CATALOG);
const logoMarks = logoLibraryMarkCount();
const ellisDesigns = readdirSync(
  new URL("../examples/ellis-ui", import.meta.url),
  { withFileTypes: true },
).filter((entry) => entry.isDirectory() && entry.name.startsWith("backup_"))
  .length;

// ---------------------------------------------------------------------------
// Source: schemas and descriptions agree with the live catalogues
// ---------------------------------------------------------------------------

t("style, palette and archetype lists are derived into every schema", () => {
  for (const name of ["generate_rules", "generate_template", "export_project"]) {
    assert.equal(prop(name, "style").description, `Design system: ${styles.join("|")}`, name);
    assert.equal(prop(name, "palette").description, `Color palette: ${palettes.join("|")}`, name);
  }
  assert.equal(
    prop("generate_rules", "archetype").description,
    `Optional page archetype: ${archetypes.join("|")}`,
  );
  for (const name of ["generate_template", "export_project"]) {
    assert.equal(
      prop(name, "archetype").description,
      `Page archetype: ${archetypes.join("|")}`,
      name,
    );
  }
  assert.ok(hybrids.length > 0);
});

t("every style/palette/archetype enum matches its live catalogue", () => {
  assertEnum("design_tokens", "palette", palettes);
  assertEnum("get_component", "palette", palettes);
  assertEnum("design_tokens", "format", CSS_OUTPUT_FORMATS);
  assertEnum("design_audit", "genre", genres);
  assertEnum("list_themes", "genre", genres);
  assertEnum("get_component", "component", COMPONENT_TYPES);
  assertEnum("get_component", "framework", OUTPUT_FRAMEWORKS);
  assertEnum("generate_motion_snippet", "framework", OUTPUT_FRAMEWORKS);
  assertEnum("generate_motion_snippet", "category", MOTION_CATEGORIES);
  assertEnum("generate_motion_snippet", "engine", MOTION_ENGINES);
  assertEnum("generate_8state_component", "kind", COMPONENT_KINDS);
  assertEnum("get_cross_cutting_rules", "category", crossCutting);
  assertEnum("logo_workflow", "action", LOGO_ACTIONS);
  assertEnum("palette", "action", PALETTE_ACTIONS);
  assertEnum("design_audit", "action", DESIGN_AUDIT_ACTIONS);
});

t("theme and genre lists are published from the token catalogue", () => {
  assert.equal(
    prop("design_tokens", "theme_name").description,
    `Named theme for theme action: ${themeNames.join("|")}`,
  );
  assertPublished(tool("detect_genre").description, genres.join(", "), "detect_genre genres");
  assert.equal(themes.length, themeNames.length);
});

t("published counts are computed from the live data", () => {
  const audit = tool("design_audit").description;
  assertPublished(audit, `${A11Y_CHECK_COUNT}-check`, "design_audit a11y count");
  assertPublished(audit, `${SLOP_GATE_COUNT}-gate`, "design_audit slop count");
  assertPublished(audit, `${QUALITY_AXIS_COUNT}-axis`, "design_audit axis count");
  assert.equal(QUALITY_AXES.length, QUALITY_AXIS_COUNT);

  const stitchAudit = tool("stitch_screen_audit").description;
  assertPublished(stitchAudit, `${A11Y_CHECK_COUNT}-check`, "stitch a11y count");
  assertPublished(stitchAudit, `${SLOP_GATE_COUNT}-gate`, "stitch slop count");
  assertPublished(stitchAudit, `${QUALITY_AXIS_COUNT}-axis`, "stitch axis count");

  assert.equal(
    tool("brand_list").description.includes(
      `${brands.unique} unique brands across ${brands.categories} categories, ${brands.listings} listings`,
    ),
    true,
    "brand_list counts",
  );
  assert.equal(
    prop("brand_list", "category").description,
    `Optional category filter: ${BRAND_CATEGORY_NAMES.join("|")}`,
  );

  assertPublished(
    tool("list_ellis_ui_designs").description,
    `${ellisDesigns} bespoke`,
    "Ellis design count",
  );
  assertPublished(
    tool("logo_workflow").description,
    `${logoMarks.toLocaleString("en-US")}-mark`,
    "logo library count",
  );
});

t("8-state names come from the state catalogue", () => {
  const description = tool("generate_8state_component").description;
  assertPublished(description, `${COMPONENT_STATE_COUNT}-state`, "state count");
  for (const state of ALL_8_STATES) {
    assertPublished(description, state.name, `state ${state.name}`);
  }
  assert.equal(ALL_8_STATES.length, COMPONENT_STATE_COUNT);
});

t("generated rules do not claim caps the generators exceed", () => {
  const rules = buildSingle("glass", "pastel");
  assert.doesNotMatch(rules, /max 4-5 size steps/i);
  assert.doesNotMatch(rules, /No animation longer than 500ms/i);
  assert.match(rules, new RegExp(`token scale`, "i"));

  assert.ok(TEXT_STEP_COUNT > 0);

  const snippet = generateMotionSnippet("stagger", "glass");
  assert.match(snippet.snippet, /prefers-reduced-motion/);
});

t("scoped slop gate counts come from the gate catalogue", () => {
  for (const genre of genres) {
    const scoped = countSlopGates(genre);
    assert.ok(scoped > 0 && scoped <= SLOP_GATE_COUNT, genre);
    assert.equal(runSlopTest("", genre).total, scoped, genre);
  }
});

// ---------------------------------------------------------------------------
// README numbers must match the live data
// ---------------------------------------------------------------------------

t("README published counts agree with the live data", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  const claims = [
    [/Canonical tools:\*\* ([\d][\d,]*)/g, tools.length, "canonical tools"],
    [/([\d][\d,]*) canonical tools/g, tools.length, "canonical tools"],
    [/([\d][\d,]*)-tool reference/g, tools.length, "tool reference"],
    [/([\d][\d,]*) design systems/g, styles.length, "design systems"],
    [/([\d][\d,]*) curated themes/g, themes.length, "curated themes"],
    [/all ([\d][\d,]*) themes/g, themes.length, "all themes"],
    [/([\d][\d,]*) genres/g, genres.length, "genres"],
    [/([\d][\d,]*) palettes/g, palettes.length, "palettes"],
    [/([\d][\d,]*) archetypes/g, archetypes.length, "archetypes"],
    [/([\d][\d,]*) categories/g, MOTION_CATEGORIES.length, "motion categories"],
    [/([\d][\d,]*)-gate/g, SLOP_GATE_COUNT, "slop gates"],
    [/([\d][\d,]*) anti-slop gates/g, SLOP_GATE_COUNT, "anti-slop gates"],
    [/([\d][\d,]*)-check/g, A11Y_CHECK_COUNT, "WCAG checks"],
    [/([\d][\d,]*)-axis/g, QUALITY_AXIS_COUNT, "quality axes"],
    [/all ([\d][\d,]*) states/g, COMPONENT_STATE_COUNT, "component states"],
    [/([\d][\d,]*) radically different/g, ellisDesigns, "Ellis designs"],
    [/([\d][\d,]*)-system showcase/g, ellisDesigns, "Ellis showcase"],
    [/([\d][\d,]*)-mark/g, logoMarks, "logo marks"],
    [/([\d][\d,]*) real-world/g, logoMarks, "logo library"],
    [/tool routing \(([\d][\d,]*) tools\)/g, tools.length, "tool routing"],
  ];
  for (const [pattern, expected, label] of claims) {
    const matches = [...readme.matchAll(pattern)];
    assert.ok(matches.length > 0, `README no longer publishes ${label}`);
    for (const match of matches) {
      assert.equal(
        Number(match[1].replaceAll(",", "")),
        expected,
        `README ${label}: "${match[0]}"`,
      );
    }
  }
});

t("README enumerations agree with the live data", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  assertPublished(readme, genres.join(" / "), "genre list");
  for (const category of MOTION_CATEGORIES) {
    assertPublished(readme, `\`${category}\``, `motion category ${category}`);
  }

  const avantGarde = listThemes("avant-garde").map(({ name }) => name);
  assert.deepEqual(
    readme.match(/including `avant-garde`: ([^)]+)\)/)?.[1].split(", "),
    avantGarde,
    "README avant-garde theme list",
  );

  for (const palette of ["obsidian-noir", "copper-cyber", "acid-avant"]) {
    assert.ok(palettes.includes(palette), `live palette ${palette} is missing`);
    assertPublished(readme, `\`${palette}\``, `palette ${palette}`);
  }
  assert.ok(archetypes.includes("awwwards-bento"));
  assertPublished(readme, "`awwwards-bento`", "archetype awwwards-bento");
});

console.log(`\n${n} consistency checks passed`);
