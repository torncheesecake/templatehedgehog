import type { Metadata } from "next";
import Link from "next/link";
import { createPageTitle } from "@/config/template";
import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  MJML_PACK_NAME,
} from "@/lib/pack";
import { getPackByProductId } from "@/lib/packCatalog";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { getPackSizeInfo } from "@/lib/packSize";
import { getStripeServerClient, isStripeConfigured } from "@/lib/stripe-server";
import {
  PACK_LAST_UPDATED,
  PACK_VERSION,
  formatVersionDate,
} from "@/lib/versioning";
import { createDownloadToken } from "@/lib/downloadToken";
import { cn } from "@/lib/utils";
import { visualSystem } from "@/components/site/visualSystem";

const isStaticExport = process.env.STATIC_EXPORT === "true";

export const metadata: Metadata = {
  title: createPageTitle("Success"),
  description: "Payment success and download access for the configured MJML pack.",
};

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

type CheckoutSummary = {
  sessionId: string;
  amountTotal: number | null;
  currency: string | null;
  paymentStatus: string | null;
  customerEmail: string | null;
  productId: string | null;
  packName: string;
  billingCycle: string | null;
};

type DownloadStatus = {
  available: boolean;
  status: number | null;
};

type SuccessState =
  | "valid_session"
  | "missing_or_invalid_session"
  | "download_unavailable"
  | "static_preview";

async function getBaseUrl(): Promise<string> {
  const configuredBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (isStaticExport) {
    return "http://localhost:3000";
  }

  const { headers } = await import("next/headers");
  const requestHeaders = await headers();
  const forwardedHost =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProto = requestHeaders.get("x-forwarded-proto") ?? "http";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return "http://localhost:3000";
}

async function getCheckoutSummary(
  sessionId: string,
): Promise<CheckoutSummary | null> {
  const stripe = getStripeServerClient();
  if (!stripe) {
    return null;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const productId = session.metadata?.productId ?? null;
    const pack = productId ? getPackByProductId(productId) : null;

    return {
      sessionId: session.id,
      amountTotal: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email ?? session.customer_email,
      productId,
      packName: pack?.name ?? MJML_PACK_NAME,
      billingCycle: session.metadata?.billingCycle ?? null,
    };
  } catch {
    return null;
  }
}

function formatTotal(amountTotal: number | null, currency: string | null): string {
  if (typeof amountTotal !== "number") {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: (currency ?? "gbp").toUpperCase(),
  }).format(amountTotal / 100);
}

async function getDownloadStatus(sessionId: string): Promise<DownloadStatus> {
  const baseUrl = await getBaseUrl();
  const url = new URL("/api/download", baseUrl);
  url.searchParams.set("session_id", sessionId);

  try {
    const response = await fetch(url.toString(), {
      method: "HEAD",
      cache: "no-store",
    });
    return {
      available: response.status === 200,
      status: response.status,
    };
  } catch {
    return {
      available: false,
      status: null,
    };
  }
}

function resolveSuccessState(
  sessionId: string | null,
  summary: CheckoutSummary | null,
  downloadStatus: DownloadStatus,
): SuccessState {
  if (!sessionId) {
    return "missing_or_invalid_session";
  }

  if (downloadStatus.available) {
    return "valid_session";
  }

  if (
    downloadStatus.status !== null
    && [400, 402, 403, 404].includes(downloadStatus.status)
  ) {
    return "missing_or_invalid_session";
  }

  if (summary || (downloadStatus.status !== null && downloadStatus.status >= 500)) {
    return "download_unavailable";
  }

  return "missing_or_invalid_session";
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const VS = visualSystem;
  const { session_id: rawSessionId } = await searchParams;
  const sessionId = rawSessionId?.trim() ? rawSessionId.trim() : null;
  const summary = !isStaticExport && sessionId ? await getCheckoutSummary(sessionId) : null;
  const downloadStatus = !isStaticExport && sessionId
    ? await getDownloadStatus(sessionId)
    : { available: false, status: null };
  const successState: SuccessState = isStaticExport
    ? "static_preview"
    : resolveSuccessState(sessionId, summary, downloadStatus);
  const stripeConfigured = !isStaticExport && isStripeConfigured();
  const lastUpdatedLabel = formatVersionDate(PACK_LAST_UPDATED);
  const packSizeInfo = await getPackSizeInfo();
  const downloadToken = !isStaticExport && sessionId
    ? (() => {
        try {
          return createDownloadToken(sessionId);
        } catch {
          return null;
        }
      })()
    : null;
  const downloadLink = downloadToken
    ? `/api/downloads/${encodeURIComponent(downloadToken)}`
    : null;

  return (
    <main className={VS.templates.content.main}>
      <SiteTopBar ctaHref="/pricing" ctaLabel="View pricing" />
      <TrackEventOnMount
        event="visit_success"
        payload={{
          state: successState,
          hasSessionId: Boolean(sessionId),
          downloadAvailable: downloadStatus.available,
        }}
      />
      <section className={VS.templates.content.frame}>
        <div className={cn(VS.templates.content.body, VS.templates.content.heroCard)}>
          {successState === "valid_session" ? (
            <>
              <h1 className={cn("text-[2rem] sm:text-[2.25rem]", VS.headings.page)}>
                Payment successful
              </h1>
              <p className="mt-2 text-[1rem] leading-8 text-slate-600">
                Thank you for purchasing {summary?.packName ?? MJML_PACK_NAME}. You purchased v{PACK_VERSION}.
              </p>
            </>
          ) : null}

          {successState === "static_preview" ? (
            <>
              <h1 className={cn("text-[2rem] sm:text-[2.25rem]", VS.headings.page)}>
                Checkout confirmation is disabled on this preview
              </h1>
              <p className="mt-2 text-[1rem] leading-8 text-slate-600">
                This GitHub Pages deployment is static, so live Stripe session
                validation and secure downloads are not available here.
              </p>
            </>
          ) : null}

          {successState === "missing_or_invalid_session" ? (
            <>
              <h1 className={cn("text-[2rem] sm:text-[2.25rem]", VS.headings.page)}>
                Purchase session not found
              </h1>
              <p className="mt-2 text-[1rem] leading-8 text-slate-600">
                We could not verify this checkout session. Please start checkout
                again from the pricing page.
              </p>
            </>
          ) : null}

          {successState === "download_unavailable" ? (
            <>
              <h1 className={cn("text-[2rem] sm:text-[2.25rem]", VS.headings.page)}>
                Download currently unavailable
              </h1>
              <p className="mt-2 text-[1rem] leading-8 text-slate-600">
                Your purchase appears valid, but the download cannot be served at
                the moment. Please try again or contact support.
              </p>
            </>
          ) : null}

          <div className={cn(VS.cards.lightSoft, "mt-4 rounded-xl px-4 py-3")}>
            <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
              Library version
            </p>
            <p className="mt-1 text-[0.98rem] font-semibold text-slate-900">
              v{PACK_VERSION}
            </p>
            <p className="mt-1 text-[0.9rem] text-slate-600">
              Last updated: {lastUpdatedLabel}
            </p>
          </div>

          <div className={cn(VS.cards.lightSoft, "mt-4 rounded-xl px-4 py-3")}>
            <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
              Archive details
            </p>
            <dl className="mt-2 grid gap-2 text-[0.92rem] text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <dt>Components</dt>
                <dd className="font-semibold text-slate-900">{COMPONENT_COUNT}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Layouts included</dt>
                <dd className="font-semibold text-slate-900">{LAYOUT_COUNT}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Archive size</dt>
                <dd className="font-semibold text-slate-900">{packSizeInfo.formatted}</dd>
              </div>
            </dl>
          </div>

          {!isStaticExport && !stripeConfigured ? (
            <div className="mt-4 rounded-xl border border-[rgba(234,88,12,0.35)] bg-[rgba(234,88,12,0.14)] px-4 py-3 text-[0.92rem] text-slate-900">
              Stripe keys are not configured in this environment, so live checkout details are unavailable.
            </div>
          ) : null}

          {!isStaticExport ? (
            <details className={cn(VS.cards.lightSoft, "mt-6 rounded-xl p-4")}>
              <summary className="cursor-pointer text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
                Checkout summary
              </summary>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">Session</p>
                  <p className="mt-1 break-all text-[0.9rem] text-slate-900">{summary?.sessionId ?? sessionId ?? "Unavailable"}</p>
                </div>
                <div>
                  <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">Amount</p>
                  <p className="mt-1 text-[1rem] font-semibold text-slate-900">
                    {formatTotal(summary?.amountTotal ?? null, summary?.currency ?? null)}
                  </p>
                </div>
                <div>
                  <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">Product</p>
                  <p className="mt-1 text-[0.96rem] text-slate-900">{summary?.packName ?? MJML_PACK_NAME}</p>
                </div>
                <div>
                  <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">Payment status</p>
                  <p className="mt-1 text-[0.96rem] capitalize text-slate-900">{summary?.paymentStatus ?? "Unavailable"}</p>
                </div>
                <div>
                  <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">Billing cycle</p>
                  <p className="mt-1 text-[0.96rem] capitalize text-slate-900">{summary?.billingCycle?.replace("_", " ") ?? "Unavailable"}</p>
                </div>
                <div>
                  <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">Email</p>
                  <p className="mt-1 text-[0.96rem] text-slate-900">{summary?.customerEmail ?? "Unavailable"}</p>
                </div>
              </div>
            </details>
          ) : null}

          {successState === "valid_session" ? (
            <>
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[0.95rem] leading-7 text-slate-600">
                  Download link:
                </p>
                {downloadStatus.available && downloadLink ? (
                  <a
                    href={downloadLink}
                    className="mt-3 inline-flex h-11 items-center rounded-full bg-rose-600 px-5 text-[0.93rem] font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
                  >
                    Download pack
                  </a>
                ) : null}
              </div>

              <article className={cn(VS.cards.lightSoft, "mt-6 rounded-xl p-4")}>
                <h2 className="text-[1rem] font-semibold text-slate-900">
                  Next steps
                </h2>
                <ul className="mt-2 space-y-1 text-[0.92rem] leading-7 text-slate-600">
                  <li>1. Open the downloaded pack archive.</li>
                  <li>2. Customise included components for your campaign workflows.</li>
                  <li>3. Read integration docs before production send.</li>
                </ul>
                <Link
                  href="/pack"
                  className="mt-3 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[0.88rem] font-semibold text-slate-900 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
                >
                  What&apos;s included
                </Link>
              </article>
            </>
          ) : null}

          {successState === "missing_or_invalid_session" ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="rounded-full bg-rose-600 px-4 py-2 text-[0.9rem] font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              >
                Go to pricing
              </Link>
              <Link
                href="/docs"
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[0.9rem] font-semibold text-slate-900 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              >
                Open docs
              </Link>
            </div>
          ) : null}

          {successState === "static_preview" ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="rounded-full bg-rose-600 px-4 py-2 text-[0.9rem] font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              >
                View pricing
              </Link>
              <Link
                href="/workflows"
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[0.9rem] font-semibold text-slate-900 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              >
                Explore workflows
              </Link>
            </div>
          ) : null}

          {successState === "download_unavailable" ? (
            <div className="mt-6 rounded-xl border border-[rgba(220,38,38,0.42)] bg-[rgba(220,38,38,0.14)] px-4 py-3 text-[0.92rem] leading-7 text-slate-900">
              Download currently unavailable. Please try again or contact support.
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/pack"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[0.9rem] font-semibold text-slate-900 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
            >
              What&apos;s included
            </Link>
            <Link
              href="/docs"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[0.9rem] font-semibold text-slate-900 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
            >
              Open docs
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[0.9rem] font-semibold text-slate-900 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
            >
              Back to pricing
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
