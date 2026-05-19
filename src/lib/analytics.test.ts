import assert from "node:assert/strict";
import test from "node:test";
import { track } from "./analytics";

test("analytics track is safe and never throws", () => {
  assert.doesNotThrow(() => {
    track("homepage_view", { source: "home" });
    track("hero_primary_cta_click", { source: "hero" });
    track("hero_secondary_cta_click", { source: "hero" });
    track("hero_tertiary_cta_click", { source: "hero" });
    track("layouts_section_view", { source: "home" });
    track("layout_card_click", { layoutSlug: "onboarding", source: "layouts_section" });
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
    track("view_layout_index", { source: "layout_index" });
    track("view_layout_system_detail", { layoutSlug: "onboarding" });
    track("layout_to_pricing", { source: "layout_detail", layoutSlug: "onboarding" });
    track("buy_from_layout", { source: "layout_detail", layoutSlug: "onboarding" });
    track("click_buy_now", { source: "pricing_page" });
    track("visit_success", { state: "valid_session" });
    track("lead_capture_submit", { source: "homepage_checklist" });
  });
});
