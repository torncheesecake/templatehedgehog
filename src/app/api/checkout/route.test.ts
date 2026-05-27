import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { getPackById } from "@/lib/packCatalog";
import { buildCheckoutSessionCreateParams, POST } from "./route";

function withEnv<T>(
  env: Record<string, string | undefined>,
  run: () => Promise<T>,
): Promise<T> {
  const previous: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(env)) {
    previous[key] = process.env[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  return run().finally(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });
}

test("checkout session params preserve canonical Pro metadata", () => {
  const selectedPack = getPackById("pro");
  const params = buildCheckoutSessionCreateParams({
    baseUrl: "https://templatehedgehog.co.uk",
    billingCycle: "one_off",
    customerEmail: "buyer@example.com",
    productId: selectedPack.productId,
    selectedPack,
    unitAmount: selectedPack.oneOffPricePence,
  });

  assert.equal(params.mode, "payment");
  assert.equal(params.customer_email, "buyer@example.com");
  assert.equal(params.success_url, "https://templatehedgehog.co.uk/success?session_id={CHECKOUT_SESSION_ID}");
  assert.equal(params.cancel_url, "https://templatehedgehog.co.uk/pricing?cancelled=1");
  assert.deepEqual(params.metadata, {
    productId: "template_hedgehog_pro",
    packId: "pro",
    tierName: "Pro",
    amountGbp: "179",
    billingCycle: "one_off",
  });

  assert.deepEqual(params.line_items?.[0]?.price_data, {
    currency: "gbp",
    unit_amount: 17900,
    product_data: {
      name: "Template Hedgehog Pro",
      description: "One-time purchase for Template Hedgehog Pro.",
    },
  });
});

test("checkout session params preserve canonical Starter and Enterprise pricing", () => {
  const starter = getPackById("starter");
  const enterprise = getPackById("enterprise");

  const starterParams = buildCheckoutSessionCreateParams({
    baseUrl: "https://templatehedgehog.co.uk",
    billingCycle: "one_off",
    productId: starter.productId,
    selectedPack: starter,
    unitAmount: starter.oneOffPricePence,
  });
  const enterpriseParams = buildCheckoutSessionCreateParams({
    baseUrl: "https://templatehedgehog.co.uk",
    billingCycle: "one_off",
    productId: enterprise.productId,
    selectedPack: enterprise,
    unitAmount: enterprise.oneOffPricePence,
  });

  assert.equal(starterParams.metadata?.amountGbp, "59");
  assert.equal(starterParams.line_items?.[0]?.price_data?.unit_amount, 5900);
  assert.equal(enterpriseParams.metadata?.amountGbp, "349");
  assert.equal(enterpriseParams.line_items?.[0]?.price_data?.unit_amount, 34900);
});

test("POST /api/checkout refuses checkout when download tokens are not configured", async () => {
  await withEnv(
    {
      STRIPE_SECRET_KEY: "sk_test_checkoutconfigured",
      DOWNLOAD_TOKEN_SECRET: undefined,
    },
    async () => {
      const request = new NextRequest("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          productId: "template_hedgehog_pro",
          billingCycle: "one_off",
        }),
      });

      const response = await POST(request);
      const body = await response.json();

      assert.equal(response.status, 503);
      assert.match(body.error, /DOWNLOAD_TOKEN_SECRET/);
    },
  );
});
