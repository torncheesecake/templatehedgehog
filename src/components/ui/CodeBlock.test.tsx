import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { CodeBlock } from "./CodeBlock";

test("CodeBlock renders label, copy action, and code container", () => {
  const rendered = renderToStaticMarkup(
    <CodeBlock
      code={"<mjml><mj-body><mj-text>Hello</mj-text></mj-body></mjml>"}
      language="mjml"
      label="MJML source"
      copyButtonLabel="Copy MJML"
    />,
  );

  assert.match(rendered, /MJML source/i);
  assert.match(rendered, /Copy MJML/i);
  assert.match(rendered, /aria-label="MJML source code block"/i);
});
