import assert from "node:assert/strict";
import test from "node:test";
import { emailComponents } from "@/data/email-components";
import { emailLayouts } from "@/data/email-layouts";
import { emailWorkflows } from "@/data/workflows";
import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  MJML_PACK_ABSOLUTE_PATH,
  MJML_PACK_FILENAME,
  WORKFLOW_COUNT,
} from "./pack";
import { getPackById } from "./packCatalog";

test("pack metadata counts match source registries", () => {
  assert.equal(COMPONENT_COUNT, emailComponents.length);
  assert.equal(LAYOUT_COUNT, emailLayouts.length);
  assert.equal(WORKFLOW_COUNT, emailWorkflows.length);
});

test("pack catalogue counts match live registries", () => {
  const pack1 = getPackById("pack-1");
  assert.equal(pack1.componentCount, COMPONENT_COUNT);
  assert.equal(pack1.layoutCount, LAYOUT_COUNT);
  assert.equal(pack1.workflowCount, WORKFLOW_COUNT);
});

test("pack absolute path resolves to the configured zip filename", () => {
  assert.match(MJML_PACK_ABSOLUTE_PATH, new RegExp(`${MJML_PACK_FILENAME}$`));
});
