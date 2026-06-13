import test from "node:test";
import assert from "node:assert/strict";
import { applyPreviewSampleData } from "./previewSampleData";

test("substitutes known merge fields with sample values", () => {
  const out = applyPreviewSampleData("Hi {{ user.first_name }}, welcome");
  assert.equal(out, "Hi Alex, welcome");
});

test("handles spacing variations and dotted keys", () => {
  assert.equal(applyPreviewSampleData("{{user.first_name}}"), "Alex");
  assert.equal(
    applyPreviewSampleData('href="{{ account.verify_url }}"'),
    'href="https://example.com/verify"',
  );
});

test("unknown link-like tokens become a sample URL", () => {
  assert.equal(
    applyPreviewSampleData('<a href="{{ some.custom_url }}">x</a>'),
    '<a href="https://example.com">x</a>',
  );
});

test("unknown plain tokens become a humanised label", () => {
  assert.equal(applyPreviewSampleData("{{ company_name }}"), "Company Name");
});

test("resolves transactional sample values", () => {
  assert.equal(applyPreviewSampleData("{{ order.total }}"), "£240.00");
  assert.equal(applyPreviewSampleData("{{ invoice.number }}"), "INV-2048");
  assert.equal(applyPreviewSampleData("{{ event.location }}"), "London, United Kingdom");
});

test("leaves markup without tokens untouched", () => {
  const html = "<p>No tokens here</p>";
  assert.equal(applyPreviewSampleData(html), html);
});
