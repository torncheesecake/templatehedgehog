import { promises as fs } from "node:fs";
import path from "node:path";
import type { EventName } from "@/lib/analytics";

type FunnelEventEntry = {
  event: EventName;
  createdAt: string;
  source?: string;
  path?: string;
};

type FunnelSummary = {
  windowDays: number;
  sinceIso: string;
  untilIso: string;
  eventCounts: Record<EventName, number>;
  totals: {
    componentViews: number;
    buyClicks: number;
    successVisits: number;
    sourceCopies: number;
  };
  conversion: {
    buyClickFromViewPct: number;
    successFromBuyClickPct: number;
  };
};

const FUNNEL_EVENTS_PATH = path.join(process.cwd(), "src", "data", "funnel-events.json");
const FUNNEL_MAX_ENTRIES = 15_000;

const ALLOWED_EVENTS: EventName[] = [
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

function isValidEvent(value: unknown): value is EventName {
  return typeof value === "string" && ALLOWED_EVENTS.includes(value as EventName);
}

function sanitiseText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalised = value.trim();
  if (!normalised) {
    return undefined;
  }

  return normalised.slice(0, maxLength);
}

function normaliseEntry(raw: unknown): FunnelEventEntry | null {
  if (typeof raw !== "object" || raw === null) {
    return null;
  }

  const maybe = raw as {
    event?: unknown;
    createdAt?: unknown;
    source?: unknown;
    path?: unknown;
  };

  if (!isValidEvent(maybe.event)) {
    return null;
  }

  if (typeof maybe.createdAt !== "string") {
    return null;
  }

  if (Number.isNaN(Date.parse(maybe.createdAt))) {
    return null;
  }

  return {
    event: maybe.event,
    createdAt: maybe.createdAt,
    source: sanitiseText(maybe.source, 80),
    path: sanitiseText(maybe.path, 120),
  };
}

async function ensureEventsFile(): Promise<void> {
  await fs.mkdir(path.dirname(FUNNEL_EVENTS_PATH), { recursive: true });

  try {
    await fs.access(FUNNEL_EVENTS_PATH);
  } catch {
    await fs.writeFile(FUNNEL_EVENTS_PATH, "[]\n", "utf8");
  }
}

async function readEvents(): Promise<FunnelEventEntry[]> {
  await ensureEventsFile();

  try {
    const content = await fs.readFile(FUNNEL_EVENTS_PATH, "utf8");
    const parsed = JSON.parse(content) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normaliseEntry)
      .filter((entry): entry is FunnelEventEntry => entry !== null);
  } catch {
    return [];
  }
}

async function writeEvents(entries: FunnelEventEntry[]): Promise<void> {
  await ensureEventsFile();
  await fs.writeFile(FUNNEL_EVENTS_PATH, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

function emptyCounts(): Record<EventName, number> {
  return {
    view_component_detail: 0,
    copy_mjml: 0,
    copy_html: 0,
    view_layout_detail: 0,
    view_workflow_index: 0,
    view_workflow_detail: 0,
    workflow_to_pricing: 0,
    buy_from_workflow: 0,
    click_buy_now: 0,
    visit_success: 0,
  };
}

function toPercent(part: number, whole: number): number {
  if (whole <= 0) {
    return 0;
  }
  return Number(((part / whole) * 100).toFixed(1));
}

export async function appendFunnelEvent(input: {
  event: EventName;
  source?: string;
  path?: string;
  createdAt?: string;
}): Promise<void> {
  const createdAt = input.createdAt && !Number.isNaN(Date.parse(input.createdAt))
    ? input.createdAt
    : new Date().toISOString();

  const nextEntry: FunnelEventEntry = {
    event: input.event,
    createdAt,
    source: sanitiseText(input.source, 80),
    path: sanitiseText(input.path, 120),
  };

  const existing = await readEvents();
  const nextEntries = [...existing, nextEntry].slice(-FUNNEL_MAX_ENTRIES);
  await writeEvents(nextEntries);
}

export async function getFunnelSummary(windowDays: number = 30): Promise<FunnelSummary> {
  const now = new Date();
  const sinceDate = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);
  const counts = emptyCounts();

  const events = await readEvents();
  for (const entry of events) {
    const eventDate = new Date(entry.createdAt);
    if (eventDate < sinceDate || eventDate > now) {
      continue;
    }
    counts[entry.event] += 1;
  }

  const sourceCopies = counts.copy_mjml + counts.copy_html;
  const trackedViews =
    counts.view_component_detail + counts.view_layout_detail + counts.view_workflow_detail;
  const trackedBuyClicks = counts.click_buy_now + counts.buy_from_workflow;

  return {
    windowDays,
    sinceIso: sinceDate.toISOString(),
    untilIso: now.toISOString(),
    eventCounts: counts,
    totals: {
      componentViews: counts.view_component_detail,
      buyClicks: trackedBuyClicks,
      successVisits: counts.visit_success,
      sourceCopies,
    },
    conversion: {
      buyClickFromViewPct: toPercent(trackedBuyClicks, trackedViews),
      successFromBuyClickPct: toPercent(counts.visit_success, trackedBuyClicks),
    },
  };
}
