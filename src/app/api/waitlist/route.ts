import { NextRequest, NextResponse } from "next/server";
import {
  getWaitlistStore,
  WaitlistStorageNotConfiguredError,
} from "@/lib/waitlist/store";
import {
  getWaitlistRateLimiter,
  isWaitlistRateLimitStorageMisconfigured,
  __resetWaitlistRateLimiterForTests,
  toWaitlistRateLimitKey,
} from "@/lib/rateLimit";

export const runtime = "nodejs";

const WAITLIST_EMAIL_MAX_LENGTH = 254;
const WAITLIST_SOURCE_MAX_LENGTH = 80;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normaliseEmail(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function normaliseSource(value: unknown): string | undefined {
  const source = String(value ?? "").trim().toLowerCase();
  if (!source) return undefined;
  return source.slice(0, WAITLIST_SOURCE_MAX_LENGTH);
}

function isValidEmail(email: string): boolean {
  return (
    email.length > 0
    && email.length <= WAITLIST_EMAIL_MAX_LENGTH
    && EMAIL_REGEX.test(email)
  );
}

function getRequestIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

export function __resetWaitlistRouteStateForTests(): void {
  __resetWaitlistRateLimiterForTests();
}

export async function POST(request: NextRequest) {
  try {
    const ip = getRequestIp(request);
    const rateLimiter = getWaitlistRateLimiter();
    const rateLimitResult = await rateLimiter.consume(
      toWaitlistRateLimitKey(ip),
    );
    if (rateLimitResult.limited) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute and try again." },
        { status: 429 },
      );
    }

    const body = (await request.json()) as { email?: unknown; source?: unknown };
    const email = normaliseEmail(body.email);
    const source = normaliseSource(body.source);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const store = getWaitlistStore();
    const inserted = await store.insertIfAbsent({
      email,
      createdAt: new Date().toISOString(),
      source,
    });
    if (!inserted) {
      return NextResponse.json(
        { message: "You are already on the waitlist." },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Thanks. You are on the waitlist." },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof WaitlistStorageNotConfiguredError
      || isWaitlistRateLimitStorageMisconfigured(error)
    ) {
      return NextResponse.json(
        { error: "Shared waitlist storage is not configured." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
