// Debug: inspect parser output for include-test before mjml-core processes it
import { createRequire } from "node:module";
import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const parser = require("mjml-parser-xml");
const parse = parser.default || parser;

const srcPath = path.join(here, "include-test.mjml");
const source = readFileSync(srcPath, "utf8");

const result = parse(source, {
  filePath: srcPath,
  keepComments: true
});

// Safely serialize
const safe = JSON.parse(JSON.stringify(result, (key, val) => key === 'parent' ? '[parent]' : val));
const head = safe.children?.find(c => c.tagName === 'mj-head');
console.log("=== Full mj-head node ===");
console.log(JSON.stringify(head, null, 2));
