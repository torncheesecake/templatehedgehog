import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { HtmlPreviewFrame } from "./HtmlPreviewFrame";

test("HtmlPreviewFrame renders an iframe with srcDoc and sandbox", () => {
  const sampleHtml = "<html><body><p>Hello preview</p></body></html>";
  const rendered = renderToStaticMarkup(<HtmlPreviewFrame html={sampleHtml} />);

  assert.match(rendered, /<iframe/i);
  assert.match(rendered, /sandbox="allow-same-origin"/i);
  assert.match(rendered, /srcdoc="[^"]+"/i);
});
