import { NextRequest, NextResponse } from "next/server";

// POST /api/subscribe
// Add email to subscriber list
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    const source = typeof body.source === "string" ? body.source : "homepage";

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // TODO: Implement subscription
    // 1. Check if email already exists in subscribers table
    // 2. If exists and subscribed, return success (idempotent)
    // 3. If exists and unsubscribed, re-subscribe
    // 4. If new, create subscriber record
    // 5. Send welcome email via Resend with free component download link
    // 6. Add to Resend audience for marketing emails

    return NextResponse.json(
      { message: "Subscribed successfully", source },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Subscription failed" },
      { status: 500 }
    );
  }
}
