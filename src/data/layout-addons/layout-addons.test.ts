import assert from "node:assert/strict";
import test from "node:test";
import {
  READY_LAYOUT_ADDON_COUNT,
  READY_LAYOUT_ADDON_SOURCE_FOLDER_COUNT,
  READY_LAYOUT_ADDON_SOURCE_TEMPLATE_COUNT,
  readyLayoutAddons,
} from "./generated";

test("ready layout add-ons have stable non-zero catalogue counts", () => {
  assert.equal(READY_LAYOUT_ADDON_COUNT, readyLayoutAddons.length);
  assert.ok(READY_LAYOUT_ADDON_COUNT > 0);
  assert.ok(READY_LAYOUT_ADDON_SOURCE_FOLDER_COUNT >= READY_LAYOUT_ADDON_COUNT);
  assert.ok(READY_LAYOUT_ADDON_SOURCE_TEMPLATE_COUNT >= READY_LAYOUT_ADDON_COUNT);
});

test("ready layout add-ons slugs are unique", () => {
  const slugs = readyLayoutAddons.map((item) => item.slug);
  const unique = new Set(slugs);
  assert.equal(unique.size, slugs.length);
});
