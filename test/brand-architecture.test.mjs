import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "skills", "brand-architecture");
const skill = fs.readFileSync(path.join(root, "SKILL.md"), "utf8");
const framework = fs.readFileSync(path.join(root, "references", "brand-architecture-framework.md"), "utf8");

assert.match(skill, /^name: brand-architecture/m);
assert.match(skill, /branded house/);
assert.match(skill, /governance/);
assert.match(skill, /brand-architecture-framework\.md/);
assert.match(framework, /The Brand Relationship Spectrum/);
assert.match(framework, /https:\/\/cmr\.berkeley\.edu\//);
assert.doesNotMatch(`${skill}\n${framework}`, /\/home\/azzar|1999AZZAR|Budiyanto|api[_-]?key/i);

console.log("brand-architecture skill checks passed");
