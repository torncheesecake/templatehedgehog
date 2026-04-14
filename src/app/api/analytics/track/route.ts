import { NextRequest, NextResponse } from "next/server";
import type { EventName } from "@/lib/analytics";
import { appendFunnelEvent } from "@/lib/funnelAnalytics";

export const runtime = "nodejs";

type FunnelTrackPayload = {
  event?: unknown;
  payload?: unknown;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 80;
const rateLimitByIp = new Map<string, number[]>();

const ALLOWED_EVENTS: EventName[] = [
  "homepage_view",
  "hero_primary_cta_click",
  "hero_secondary_cta_click",
  "hero_tertiary_cta_click",
  "workflows_section_view",
  "workflow_card_click",
  "technical_proof_view",
  "pricing_section_view",
  "docs_click",
  "changelog_click",
  "licence_click",
  "faq_expand",
  "final_cta_click",
  "checkout_start",
  "purchase_complete",
  "view_component_detail",
  "copy_mjml",
  "copy_html",
  "view_layout_detail",
  "view_workflow_index",
  "view_workflow_detail",
  "workflow_to_pricing",
  "buy_from_workflow",
  "click_buy_now",
  "visit_success",
];

function getRequestIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent =
    rateLimitByIp.get(ip)?.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS) ?? [];

  recent.push(now);
  rateLimitByIp.set(ip, recent);

  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

function isAllowedEvent(value: unknown): value is EventName {
  return typeof value === "string" && ALLOWED_EVENTS.includes(value as EventName);
}

function sanitiseSource(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalised = value.trim();
  if (!normalised) {
    return undefined;
  }

  return normalised.slice(0, 80);
}

function sanitisePath(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalised = value.trim();
  if (!normalised) {
    return undefined;
  }

  return normalised.slice(0, 120);
}

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ ok: true }, { status: 202 });
    }

    const ip = getRequestIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = (await request.json()) as FunnelTrackPayload;
    if (!isAllowedEvent(body.event)) {
      return NextResponse.json({ error: "Unknown event." }, { status: 400 });
    }

    const payload = (typeof body.payload === "object" && body.payload !== null)
      ? body.payload as Record<string, unknown>
      : {};

    await appendFunnelEvent({
      event: body.event,
      source: sanitiseSource(payload.source),
      path: sanitisePath(payload.path),
    });

    return NextResponse.json({ ok: true }, { status: 202 });
  } catch (error) {
    console.error({
      scope: "api.analytics.track",
      event: "track_failed",
      message: error instanceof Error ? error.message : "Unknown tracking failure",
    });
    return NextResponse.json({ error: "Tracking failed." }, { status: 500 });
  }
}
