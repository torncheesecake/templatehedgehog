import assert from "node:assert/strict";
import test from "node:test";
import { track } from "./analytics";

test("analytics track is safe and never throws", () => {
  assert.doesNotThrow(() => {
    track("homepage_view", { source: "home" });
    track("hero_primary_cta_click", { source: "hero" });
    track("hero_secondary_cta_click", { source: "hero" });
    track("hero_tertiary_cta_click", { source: "hero" });
    track("workflows_section_view", { source: "home" });
    track("workflow_card_click", { workflowSlug: "onboarding", source: "workflows_section" });
    track("technical_proof_view", { source: "home" });
    track("pricing_section_view", { source: "home" });
    track("docs_click", { source: "hero" });
    track("changelog_click", { source: "hero" });
    track("licence_click", { source: "hero" });
    track("faq_expand", { source: "home", question: "who_for" });
    track("final_cta_click", { source: "final_cta" });
    track("checkout_start", { source: "pricing_page" });
    track("purchase_complete", { source: "success_page" });
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
