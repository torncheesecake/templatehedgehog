import { NextRequest, NextResponse } from "next/server";
import {
  MJML_PACK_PRODUCT_ID,
} from "@/lib/pack";
import {
  getPackByProductId,
  isPackPurchasable,
  parseBillingCycle,
} from "@/lib/packCatalog";
import { getStripeServerClient, isStripeConfigured } from "@/lib/stripe-server";
import { TEMPLATE_CONFIG } from "@/config/template";

type CheckoutPayload = {
  productId?: string;
  email?: string;
  billingCycle?: string;
};

const FRIENDLY_SETUP_ERROR =
  "Checkout is not configured yet. Please set STRIPE_SECRET_KEY and try again.";
const FRIENDLY_CHECKOUT_ERROR =
  "Checkout could not be started right now. Please try again in a moment.";

type CheckoutLogLevel = "info" | "warn" | "error";

function logCheckoutEvent(
  level: CheckoutLogLevel,
  event: string,
  details: Record<string, unknown>,
) {
  const payload = {
    scope: "api.checkout",
    event,
    ...details,
  };

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.info(payload);
}

function getBaseUrl(request: NextRequest): string {
  const configuredBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "http";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return "http://localhost:3000";
}

function requestWantsJson(request: NextRequest): boolean {
  const accept = request.headers.get("accept") ?? "";
  const contentType = request.headers.get("content-type") ?? "";
  return accept.includes("application/json") || contentType.includes("application/json");
}

function respondWithFriendlyError(
  request: NextRequest,
  message: string,
  status: number,
): NextResponse {
  if (requestWantsJson(request)) {
    return NextResponse.json({ error: message }, { status });
  }

  const pricingUrl = new URL("/pricing", getBaseUrl(request));
  pricingUrl.searchParams.set("error", message);
  return NextResponse.redirect(pricingUrl, 303);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function parsePayload(request: NextRequest): Promise<CheckoutPayload> {
  if (request.method === "GET") {
    const url = new URL(request.url);
    return {
      productId: url.searchParams.get("productId") ?? undefined,
      email: url.searchParams.get("email") ?? undefined,
      billingCycle: url.searchParams.get("billingCycle")
        ?? url.searchParams.get("billing")
        ?? undefined,
    };
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await request.json()) as CheckoutPayload;
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();
    const productId = formData.get("productId");
    const email = formData.get("email");
    const billingCycle = formData.get("billingCycle") ?? formData.get("billing");
    return {
      productId: typeof productId === "string" ? productId : undefined,
      email: typeof email === "string" ? email : undefined,
      billingCycle: typeof billingCycle === "string" ? billingCycle : undefined,
    };
  }

  return {};
}

async function handleCheckout(request: NextRequest): Promise<NextResponse> {
  if (!isStripeConfigured()) {
    logCheckoutEvent("error", "stripe_not_configured", {
      method: request.method,
    });
    return respondWithFriendlyError(request, FRIENDLY_SETUP_ERROR, 503);
  }

  const stripe = getStripeServerClient();
  if (!stripe) {
    logCheckoutEvent("error", "stripe_client_unavailable", {
      method: request.method,
    });
    return respondWithFriendlyError(request, FRIENDLY_SETUP_ERROR, 503);
  }

  const payload = await parsePayload(request);
  const productId = payload.productId ?? MJML_PACK_PRODUCT_ID;
  const selectedPack = getPackByProductId(productId);
  if (!selectedPack) {
    logCheckoutEvent("warn", "invalid_product_id", {
      method: request.method,
      productId,
    });
    return respondWithFriendlyError(
      request,
      "Unknown product selected for checkout.",
      400,
    );
  }

  const billingCycle = parseBillingCycle(payload.billingCycle);
  if (!isPackPurchasable(selectedPack, billingCycle)) {
    logCheckoutEvent("warn", "pack_not_purchasable", {
      method: request.method,
      productId,
      packId: selectedPack.id,
      billingCycle,
    });
    return respondWithFriendlyError(
      request,
      "That plan is not available for checkout yet.",
      400,
    );
  }

  const normalisedEmail = payload.email?.trim();
  const customerEmail =
    normalisedEmail && isValidEmail(normalisedEmail)
      ? normalisedEmail
      : undefined;

  const baseUrl = getBaseUrl(request);
  const unitAmount =
    billingCycle === "one_off"
      ? selectedPack.oneOffPricePence
      : selectedPack.monthlyPricePence;

  if (typeof unitAmount !== "number") {
    logCheckoutEvent("error", "missing_checkout_amount", {
      method: request.method,
      productId,
      packId: selectedPack.id,
      billingCycle,
    });
    return respondWithFriendlyError(request, FRIENDLY_CHECKOUT_ERROR, 500);
  }

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.create>>;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: unitAmount,
            product_data: {
              name: `${TEMPLATE_CONFIG.brandName} ${selectedPack.name}`,
              description:
                billingCycle === "one_off"
                  ? `One-time purchase for ${selectedPack.name}.`
                  : `Subscription purchase for ${selectedPack.name}.`,
            },
          },
        },
      ],
      customer_email: customerEmail,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?cancelled=1`,
      metadata: {
        productId,
        packId: selectedPack.id,
        billingCycle,
      },
    });
  } catch (error) {
    logCheckoutEvent("error", "stripe_session_create_failed", {
      method: request.method,
      productId,
      packId: selectedPack.id,
      billingCycle,
      message: error instanceof Error ? error.message : "Unknown Stripe error",
    });
    throw error;
  }

  if (!session.url) {
    logCheckoutEvent("error", "stripe_session_missing_url", {
      method: request.method,
      productId,
    });
    return respondWithFriendlyError(request, FRIENDLY_CHECKOUT_ERROR, 500);
  }

  if (requestWantsJson(request)) {
    return NextResponse.json({ url: session.url }, { status: 200 });
  }

  return NextResponse.redirect(session.url, 303);
}

export async function POST(request: NextRequest) {
  try {
    return await handleCheckout(request);
  } catch (error) {
    logCheckoutEvent("error", "checkout_request_failed", {
      method: request.method,
      message: error instanceof Error ? error.message : "Unknown checkout failure",
    });
    return respondWithFriendlyError(request, FRIENDLY_CHECKOUT_ERROR, 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    return await handleCheckout(request);
  } catch (error) {
    logCheckoutEvent("error", "checkout_request_failed", {
      method: request.method,
      message: error instanceof Error ? error.message : "Unknown checkout failure",
    });
    return respondWithFriendlyError(request, FRIENDLY_CHECKOUT_ERROR, 500);
  }
}
