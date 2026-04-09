import assert from "node:assert/strict";
import test from "node:test";
import { track } from "./analytics";

test("analytics track is safe and never throws", () => {
  assert.doesNotThrow(() => {
    track("view_component_detail", { componentSlug: "hero-overlay-modern" });
    track("copy_mjml", { sourceType: "mjml" });
    track("copy_html", { sourceType: "html" });
    track("view_layout_detail", { layoutSlug: "product-launch-campaign" });
    track("view_workflow_index", { source: "workflow_index" });
    track("view_workflow_detail", { workflowSlug: "onboarding" });
    track("workflow_to_pricing", { source: "workflow_detail", workflowSlug: "onboarding" });
    track("buy_from_workflow", { source: "workflow_detail", workflowSlug: "onboarding" });
    track("click_buy_now", { source: "pricing_page" });
    track("visit_success", { state: "valid_session" });
  });
});
