import test from "node:test";
import assert from "node:assert/strict";
import { extractComponentHtmlSnippet } from "@/lib/html-snippets";

test("extractComponentHtmlSnippet returns comment-wrapped component slice when markers exist", () => {
  const standalone = `
<!doctype html>
<html>
  <head><title>Example</title></head>
  <body>
    <div>before</div>
    <!-- #-START-# Header -->
    <table><tr><td>block</td></tr></table>
    <!-- #-END-# Header -->
    <div>after</div>
  </body>
</html>`;

  const snippet = extractComponentHtmlSnippet(standalone);

  assert.equal(
    snippet,
    `<!-- #-START-# Header -->
    <table><tr><td>block</td></tr></table>
    <!-- #-END-# Header -->`,
  );
});

test("extractComponentHtmlSnippet falls back to body inner HTML when markers are absent", () => {
  const standalone = `
<!doctype html>
<html>
  <body>
    <section>body block</section>
  </body>
</html>`;

  const snippet = extractComponentHtmlSnippet(standalone);

  assert.equal(snippet, "<section>body block</section>");
});

