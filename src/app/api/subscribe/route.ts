import { NextRequest, NextResponse } from "next/server";
import {
  getWaitlistStore,
  WaitlistStorageNotConfiguredError,
} from "@/lib/waitlist/store";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normaliseEmail(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function normaliseSource(value: unknown): string | undefined {
  const source = String(value ?? "").trim().toLowerCase();
  return source ? source.slice(0, 80) : undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: unknown; source?: unknown };
    const email = normaliseEmail(body.email);
    const source = normaliseSource(body.source) ?? "subscribe";

    if (!email) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (email.length > 254 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const store = getWaitlistStore();
    const inserted = await store.insertIfAbsent({
      email,
      source,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: inserted
          ? "Subscribed successfully"
          : "You are already subscribed",
        source,
      },
      { status: inserted ? 201 : 200 }
    );
  } catch (error) {
    if (error instanceof WaitlistStorageNotConfiguredError) {
      return NextResponse.json(
        { error: "Shared subscription storage is not configured." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Subscription failed" },
      { status: 500 }
    );
  }
}
