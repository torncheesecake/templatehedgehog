import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getStripeServerClient, isStripeConfigured } from "@/lib/stripe-server";

const SUPPORTED_EVENT_TYPES = new Set<string>([
  "checkout.session.completed",
  "charge.refunded",
]);

function getWebhookSecret(): string | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  return secret ? secret : null;
}

function getWebhookErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Unknown webhook verification failure.";
}

function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

function isValidCheckoutSession(event: Stripe.Event): boolean {
  if (event.type !== "checkout.session.completed") {
    return false;
  }

  const session = event.data.object as Stripe.Checkout.Session;
  return session.mode === "payment" && session.payment_status === "paid";
}

function isValidRefundCharge(event: Stripe.Event): boolean {
  if (event.type !== "charge.refunded") {
    return false;
  }

  const charge = event.data.object as Stripe.Charge;
  return typeof charge.id === "string" && charge.id.length > 0;
}

// POST /api/webhooks/stripe
// Verifies Stripe signatures and only accepts supported event types.
export async function POST(request: NextRequest) {
  const webhookSecret = getWebhookSecret();
  if (!webhookSecret) {
    return jsonError("Stripe webhook is not configured.", 503);
  }

  if (!isStripeConfigured()) {
    return jsonError("Stripe secret key is not configured.", 503);
  }

  const stripe = getStripeServerClient();
  if (!stripe) {
    return jsonError("Stripe client is unavailable.", 503);
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return jsonError("Missing stripe-signature header.", 400);
  }

  const payload = await request.text();
  if (!payload.trim()) {
    return jsonError("Missing webhook payload.", 400);
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return jsonError(
      `Webhook signature verification failed: ${getWebhookErrorMessage(error)}`,
      400,
    );
  }

  if (!SUPPORTED_EVENT_TYPES.has(event.type)) {
    return NextResponse.json(
      {
        received: true,
        handled: false,
        message: `Event type \"${event.type}\" is not handled by this template.`,
      },
      { status: 200 },
    );
  }

  if (event.type === "checkout.session.completed" && !isValidCheckoutSession(event)) {
    return jsonError("Checkout session event payload is invalid.", 422);
  }

  if (event.type === "charge.refunded" && !isValidRefundCharge(event)) {
    return jsonError("Refund event payload is invalid.", 422);
  }

  return NextResponse.json(
    {
      received: true,
      handled: true,
      eventType: event.type,
      // Intentionally no side effects here. Integrators should attach their own persistence/email logic.
    },
    { status: 200 },
  );
}
