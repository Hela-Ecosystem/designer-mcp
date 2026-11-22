#!/usr/bin/env node
/**
 * Render docs/TOOLS.md from the live tools/list response.
 *
 * Usage:
 *   node scripts/generate-tool-docs.mjs           # write the file
 *   node scripts/generate-tool-docs.mjs --check   # fail if it is stale
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOC_PATH = join(ROOT, "docs", "TOOLS.md");

export function fetchTools() {
  const requests = [
    {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "docs-generator", version: "1" },
      },
    },
    { jsonrpc: "2.0", method: "notifications/initialized" },
    { jsonrpc: "2.0", id: 2, method: "tools/list" },
  ];
  const call = spawnSync(process.execPath, [join(ROOT, "dist", "index.js")], {
    env: { ...process.env, HELA_PHENOTYPE_STITCH: "1", HELA_ENVELOPE: "false" },
    input: requests.map((request) => JSON.stringify(request)).join("\n") + "\n",
    encoding: "utf8",
    timeout: 15_000,
  });
  if (call.error) throw call.error;
  if (call.status !== 0) throw new Error(call.stderr || `server exited ${call.status}`);
  const reply = call.stdout
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line))
    .find((message) => message.id === 2);
  if (!reply?.result?.tools) {
    throw new Error(`tools/list returned no tools:\n${call.stdout}`);
  }
  return reply.result.tools;
}

function renderActions(tool) {
  const action = tool.inputSchema?.properties?.action?.enum;
  return Array.isArray(action) && action.length
    ? `\n\nActions: ${action.map((value) => `\`${value}\``).join(", ")}.`
    : "";
}

export function renderToolDocs(tools) {
  const version = JSON.parse(
    readFileSync(join(ROOT, "package.json"), "utf8"),
  ).version;
  const sections = [...tools]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      (tool) =>
        `## \`${tool.name}\`\n\n${tool.description}${renderActions(tool)}`.trim(),
    );
  return [
    "# HeLa Phenotype: canonical tools",
    "",
    `Server version **${version}**. Generated from the live \`tools/list\` registry; regenerate with \`npm run docs:generate\`.`,
    "",
    "Only names advertised by `tools/list` are listed here. Older aliases in migration examples are not additional tools. Runtime namespace prefixes are optional and do not change these server-local names.",
    "",
    sections.join("\n\n"),
    "",
  ].join("\n");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const expected = renderToolDocs(fetchTools());
  if (process.argv.includes("--check")) {
    let actual = "";
    try {
      actual = readFileSync(DOC_PATH, "utf8");
    } catch {
      // Missing file is a failed check, reported below.
    }
    if (actual !== expected) {
      console.error(
        "docs/TOOLS.md is stale; run `npm run docs:generate` and commit the result.",
      );
      process.exit(1);
    }
  } else {
    writeFileSync(DOC_PATH, expected);
    console.log(`wrote ${DOC_PATH}`);
  }
}
