import assert from "node:assert/strict";
import test from "node:test";
import {
  CHANGELOG,
  PACK_LAST_UPDATED,
  PACK_VERSION,
} from "./versioning";

const SEMVER_PATTERN =
  /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

test("versioning exports a semver-like PACK_VERSION", () => {
  assert.equal(typeof PACK_VERSION, "string");
  assert.notEqual(PACK_VERSION.trim(), "");
  assert.match(PACK_VERSION, SEMVER_PATTERN);
});

test("versioning CHANGELOG export has expected entry contract", () => {
  assert(Array.isArray(CHANGELOG));
  assert(CHANGELOG.length > 0);

  for (const entry of CHANGELOG) {
    assert.equal(typeof entry.date, "string");
    assert.notEqual(entry.date.trim(), "");

    assert.equal(typeof entry.title, "string");
    assert.notEqual(entry.title.trim(), "");

    assert(Array.isArray(entry.bulletPoints));
    assert(entry.bulletPoints.length > 0);

    for (const point of entry.bulletPoints) {
      assert.equal(typeof point, "string");
      assert.notEqual(point.trim(), "");
    }
  }
});

test("versioning PACK_LAST_UPDATED aligns with the latest changelog entry", () => {
  assert.equal(PACK_LAST_UPDATED, CHANGELOG[0]?.date);
});
