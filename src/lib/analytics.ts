export type EventName =
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
