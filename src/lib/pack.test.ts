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
  STARTER_COMPONENT_COUNT,
  STARTER_LAYOUT_COUNT,
  STARTER_WORKFLOW_COUNT,
  WORKFLOW_COUNT,
} from "./pack";
import { getPackById } from "./packCatalog";

test("pack metadata counts match source registries", () => {
  assert.equal(COMPONENT_COUNT, emailComponents.length);
  assert.equal(LAYOUT_COUNT, emailLayouts.length);
  assert.equal(WORKFLOW_COUNT, emailWorkflows.length);
});

test("pack catalogue counts match live registries", () => {
  const starterPack = getPackById("starter");
  const proPack = getPackById("pro");
  const enterprisePack = getPackById("enterprise");
  assert.equal(starterPack.componentCount, STARTER_COMPONENT_COUNT);
  assert.equal(starterPack.layoutCount, STARTER_LAYOUT_COUNT);
  assert.equal(starterPack.workflowCount, STARTER_WORKFLOW_COUNT);
  assert.equal(proPack.componentCount, COMPONENT_COUNT);
  assert.equal(proPack.layoutCount, LAYOUT_COUNT);
  assert.equal(proPack.workflowCount, WORKFLOW_COUNT);
  assert.equal(enterprisePack.componentCount, COMPONENT_COUNT);
  assert.equal(enterprisePack.layoutCount, LAYOUT_COUNT);
  assert.equal(enterprisePack.workflowCount, WORKFLOW_COUNT);
});

test("pack absolute path resolves to the configured zip filename", () => {
  assert.match(MJML_PACK_ABSOLUTE_PATH, new RegExp(`${MJML_PACK_FILENAME}$`));
});
