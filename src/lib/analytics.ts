export type EventName =
  | "homepage_view"
  | "hero_primary_cta_click"
  | "hero_secondary_cta_click"
  | "hero_tertiary_cta_click"
  | "workflows_section_view"
  | "workflow_card_click"
  | "technical_proof_view"
  | "pricing_section_view"
  | "docs_click"
  | "changelog_click"
  | "licence_click"
  | "faq_expand"
  | "final_cta_click"
  | "checkout_start"
  | "purchase_complete"
  | "view_component_detail"
  | "copy_mjml"
  | "copy_html"
  | "view_layout_detail"
  | "view_workflow_index"
  | "view_workflow_detail"
  | "workflow_to_pricing"
  | "buy_from_workflow"
  | "click_buy_now"
  | "visit_success";

export type AnalyticsPayload = Record<string, unknown>;

const BLOCKED_PAYLOAD_KEY_PATTERN = /email|name|phone|token|session|customer|address/i;

function sanitisePayload(payload: AnalyticsPayload): AnalyticsPayload {
  const next: AnalyticsPayload = {};

  for (const [key, value] of Object.entries(payload)) {
    if (BLOCKED_PAYLOAD_KEY_PATTERN.test(key)) {
      continue;
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      next[key] = typeof value === "string" ? value.slice(0, 120) : value;
    }
  }

  return next;
}

export function track(event: EventName, payload: AnalyticsPayload = {}): void {
  try {
    const safePayload = sanitisePayload(payload);
    const payloadWithPath = typeof window !== "undefined"
      ? { ...safePayload, path: window.location.pathname }
      : safePayload;

    if (typeof window !== "undefined") {
      const body = JSON.stringify({
        event,
        payload: payloadWithPath,
      });

      const endpoint = "/api/analytics/track";
      const sentWithBeacon =
        typeof navigator !== "undefined"
        && typeof navigator.sendBeacon === "function"
        && navigator.sendBeacon(
          endpoint,
          new Blob([body], { type: "application/json" }),
        );

      if (!sentWithBeacon) {
        void fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {
          // Never break app flow for analytics.
        });
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.info("[analytics]", {
        event,
        payload: payloadWithPath,
        timestamp: new Date().toISOString(),
      });
    }
  } catch {
    // Never break app flow for analytics.
  }
}
