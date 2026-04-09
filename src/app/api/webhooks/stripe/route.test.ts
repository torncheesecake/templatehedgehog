import assert from "node:assert/strict";
import test from "node:test";
import Stripe from "stripe";
import { NextRequest } from "next/server";
import { POST } from "./route";

type EnvPatch = Record<string, string | undefined>;

async function withPatchedEnv<T>(
  patch: EnvPatch,
  run: () => Promise<T>,
): Promise<T> {
  const previous: EnvPatch = {};

  for (const [key, value] of Object.entries(patch)) {
    previous[key] = process.env[key];
    if (typeof value === "string") {
      process.env[key] = value;
    } else {
      delete process.env[key];
    }
  }

  try {
    return await run();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (typeof value === "string") {
        process.env[key] = value;
      } else {
        delete process.env[key];
      }
    }
  }
}

function createSignedRequest(payload: string, webhookSecret: string): NextRequest {
  const stripe = new Stripe("sk_test_webhooksigning");
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: webhookSecret,
  });

  return new NextRequest("http://localhost:3000/api/webhooks/stripe", {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": signature,
    },
  });
}

test("POST /api/webhooks/stripe returns 503 when STRIPE_WEBHOOK_SECRET is missing", async () => {
  await withPatchedEnv(
    {
      STRIPE_SECRET_KEY: "sk_test_missingwebhooksecret",
      STRIPE_WEBHOOK_SECRET: undefined,
    },
    async () => {
      const response = await POST(
        new NextRequest("http://localhost:3000/api/webhooks/stripe", {
          method: "POST",
          body: "{}",
        }),
      );
      assert.equal(response.status, 503);
    },
  );
});

test("POST /api/webhooks/stripe rejects missing stripe-signature header", async () => {
  await withPatchedEnv(
    {
      STRIPE_SECRET_KEY: "sk_test_missingheader",
      STRIPE_WEBHOOK_SECRET: "whsec_missingheader",
    },
    async () => {
      const response = await POST(
        new NextRequest("http://localhost:3000/api/webhooks/stripe", {
          method: "POST",
          body: "{}",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );
      assert.equal(response.status, 400);
    },
  );
});

test("POST /api/webhooks/stripe accepts valid checkout.session.completed events", async () => {
  await withPatchedEnv(
    {
      STRIPE_SECRET_KEY: "sk_test_validcheckout",
      STRIPE_WEBHOOK_SECRET: "whsec_validcheckout",
    },
    async () => {
      const payload = JSON.stringify({
        id: "evt_test_checkout_1",
        object: "event",
        api_version: "2025-10-29.clover",
        created: 1_761_000_000,
        livemode: false,
        pending_webhooks: 1,
        request: { id: null, idempotency_key: null },
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_webhooksession123",
            object: "checkout.session",
            mode: "payment",
            payment_status: "paid",
          },
        },
      });

      const response = await POST(
        createSignedRequest(payload, "whsec_validcheckout"),
      );

      assert.equal(response.status, 200);
      const json = await response.json() as { handled?: boolean };
      assert.equal(json.handled, true);
    },
  );
});

test("POST /api/webhooks/stripe returns handled=false for unsupported events", async () => {
  await withPatchedEnv(
    {
      STRIPE_SECRET_KEY: "sk_test_unsupported",
      STRIPE_WEBHOOK_SECRET: "whsec_unsupported",
    },
    async () => {
      const payload = JSON.stringify({
        id: "evt_test_unsupported_1",
        object: "event",
        api_version: "2025-10-29.clover",
        created: 1_761_000_100,
        livemode: false,
        pending_webhooks: 1,
        request: { id: null, idempotency_key: null },
        type: "payment_intent.created",
        data: {
          object: {
            id: "pi_test_123",
            object: "payment_intent",
          },
        },
      });

      const response = await POST(
        createSignedRequest(payload, "whsec_unsupported"),
      );

      assert.equal(response.status, 200);
      const json = await response.json() as { handled?: boolean };
      assert.equal(json.handled, false);
    },
  );
});

