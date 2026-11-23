import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const ELLIS = join(REPO, "examples", "ellis-ui");

const server = spawn(process.execPath, [join(REPO, "dist", "index.js")], {
  stdio: ["pipe", "pipe", "pipe"],
  env: { ...process.env, HELA_ENVELOPE: "false" },
});
server.stderr.resume();

let buffer = "";
let nextId = 0;
const pending = new Map();
server.stdout.on("data", (chunk) => {
  buffer += chunk.toString();
  let newline;
  while ((newline = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    if (!line) continue;
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      continue;
    }
    if (message.id !== undefined && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  }
});

const send = (method, params) =>
  new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    server.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  });

await send("initialize", {
  protocolVersion: "2024-11-05",
  capabilities: {},
  clientInfo: { name: "ellis-test", version: "1" },
});
server.stdin.write(
  JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n",
);

const call = async (tool, args) => {
  const response = await send("tools/call", { name: tool, arguments: args });
  const result = response.result;
  return {
    text: result.content.map((block) => block.text).join("\n"),
    isError: result.isError === true,
  };
};

let passed = 0;
const test = (label, fn) => {
  fn();
  passed += 1;
  console.log(`ok ${passed} - ${label}`);
};

const designs = readdirSync(ELLIS, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith("backup_"))
  .map((entry) => entry.name);

const list = await call("list_ellis_ui_designs", {});
const listed = JSON.parse(list.text);

test("list returns a compact JSON index", () => {
  assert.equal(list.isError, false);
  assert.equal(listed.count, designs.length);
  assert.equal(listed.templates.length, designs.length);
  assert.ok(!list.text.includes("## Overview"), "full design body leaked");
  assert.ok(!list.text.includes("\\n"), "literal backslash-n in output");
  for (const template of listed.templates) {
    assert.deepEqual(Object.keys(template), [
      "name",
      "title",
      "concept",
      "typography",
      "palette",
      "pages",
    ]);
    assert.equal(template.pages.length, 4, template.name);
    assert.equal(template.pages[0], "index.html");
    assert.ok(!template.title.includes("\n"), template.name);
  }
  const film = listed.templates.find((template) => template.name === "backup_35mm");
  assert.equal(film.title, "35mm Film Strip");
  assert.match(film.concept, /film strip/i);
});

const full = await call("get_ellis_ui_template", { design_name: "backup_journal" });

test("template fetch returns every page with real newlines", () => {
  assert.equal(full.isError, false);
  assert.match(full.text, /^--- DESIGN GUIDELINES \(design\.md\) ---\n# Design System:/);
  for (const page of ["index.html", "letter.html", "note.html", "slideshow.html"]) {
    assert.ok(
      full.text.includes(`--- HTML PAGE: ${page} (`),
      `missing ${page}`,
    );
    assert.ok(full.text.includes(readFileSync(join(ELLIS, "backup_journal", page), "utf8").trim()));
  }
  assert.ok(!full.text.includes("\\n"), "literal backslash-n in output");
  assert.ok(!full.text.includes("--- DESIGN GUIDELINES ---\\n"));
});

const single = await call("get_ellis_ui_template", {
  design_name: "backup_journal",
  page: "letter.html",
});

test("page parameter returns one page", () => {
  assert.equal(single.isError, false);
  assert.match(single.text, /--- HTML PAGE: letter\.html \(/);
  assert.ok(!single.text.includes("--- HTML PAGE: index.html"));
  assert.ok(single.text.includes(readFileSync(join(ELLIS, "backup_journal", "letter.html"), "utf8").trim()));
});

const missingPage = await call("get_ellis_ui_template", {
  design_name: "backup_journal",
  page: "missing.html",
});

test("unknown page is rejected with the available list", () => {
  assert.equal(missingPage.isError, true);
  assert.match(missingPage.text, /Available: index\.html, letter\.html, note\.html, slideshow\.html/);
});

const traversal = await call("get_ellis_ui_template", { design_name: "../backup_journal" });

test("design_name traversal is rejected", () => {
  assert.equal(traversal.isError, true);
  assert.match(traversal.text, /design_name/);
});

test("no template claims zero dependencies", () => {
  for (const design of designs) {
    const md = readFileSync(join(ELLIS, design, "design.md"), "utf8");
    assert.ok(!md.includes("Zero Dependencies"), design);
    assert.match(md, /\*\*Runtime Dependencies:\*\*/, design);
  }
});

test("every advertised page exists and every page is advertised", () => {
  for (const design of designs) {
    const onDisk = readdirSync(join(ELLIS, design))
      .filter((name) => name.endsWith(".html"))
      .sort();
    const advertised = listed.templates
      .find((template) => template.name === design)
      .pages.slice()
      .sort();
    assert.deepEqual(advertised, onDisk, design);
  }
});

server.kill();
console.log(`1..${passed}`);
