import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MCP_SERVER_VERSION } from "../src/version.ts";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

assert.equal(
  MCP_SERVER_VERSION,
  pkg.version,
  "MCP_SERVER_VERSION drifted from package.json version",
);
console.log(`ok 1 - advertised MCP server version matches package.json (${pkg.version})`);
