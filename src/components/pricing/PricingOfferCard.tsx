"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TrackableSubmitButton } from "@/components/analytics/TrackableSubmitButton";
import { TEMPLATE_CONFIG } from "@/config/template";

const VAT_RATE = 0.2;

type VatMode = "ex_vat" | "inc_vat";

interface PricingOfferCardProps {
  pricePence: number;
  stripeReady: boolean;
  productId: string;
  inclusionPoints: string[];
  ctaLabel: string;
  versionLabel: string;
  lastUpdatedLabel: string;
  isStaticPreview: boolean;
}

function formatHeadlinePriceFromPence(pence: number): string {
  if (pence % 100 === 0) {
    return `£${pence / 100}`;
  }

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(pence / 100);
}

export function PricingOfferCard({
  pricePence,
  stripeReady,
  productId,
  inclusionPoints,
  ctaLabel,
  versionLabel,
  lastUpdatedLabel,
  isStaticPreview,
}: PricingOfferCardProps) {
  const [vatMode, setVatMode] = useState<VatMode>("ex_vat");

  const displayedPrice = useMemo(() => {
    if (vatMode === "inc_vat") {
      return Math.round(pricePence * (1 + VAT_RATE));
    }
    return pricePence;
  }, [pricePence, vatMode]);

  return (
    <aside className="relative overflow-hidden rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-8">
      <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--th-accent-support)/0.52),transparent)]" />
      <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-[var(--text-meta)]">
        {TEMPLATE_CONFIG.productName}
      </p>
      <p className="mt-2 text-[0.9rem] leading-7 text-[var(--text-secondary)]">
        One-time purchase. No subscription.
      </p>

      <div
        className="mt-4 inline-flex items-center gap-2 rounded-[0.8rem] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-1.5"
        role="group"
        aria-label="VAT display mode"
      >
        <button
          type="button"
          onClick={() => setVatMode("ex_vat")}
          aria-pressed={vatMode === "ex_vat"}
          className={`h-8 rounded-[0.58rem] px-3.5 text-[0.74rem] font-semibold tracking-[0.02em] transition ${
            vatMode === "ex_vat"
              ? "border border-[var(--border-strong)] bg-[var(--bg-accent-soft)] text-[var(--text-primary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Ex VAT
        </button>
        <button
          type="button"
          onClick={() => setVatMode("inc_vat")}
          aria-pressed={vatMode === "inc_vat"}
          className={`h-8 rounded-[0.58rem] px-3.5 text-[0.74rem] font-semibold tracking-[0.02em] transition ${
            vatMode === "inc_vat"
              ? "border border-[var(--border-strong)] bg-[var(--bg-accent-soft)] text-[var(--text-primary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Inc VAT
        </button>
      </div>

      <div className="mt-7 flex items-end gap-2.5">
        <p className="text-[3.4rem] font-semibold leading-[0.9] text-[var(--text-primary)] sm:text-[4.4rem]">
          {formatHeadlinePriceFromPence(displayedPrice)}
        </p>
        <p className="pb-2 text-[1rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
          {vatMode === "inc_vat" ? "inc VAT" : "ex VAT"}
        </p>
      </div>

      <div className="mt-6 rounded-[0.9rem] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 text-[0.84rem] text-[var(--text-secondary)]">
        <div className="flex items-center justify-between gap-3">
          <span>Version</span>
          <span className="font-semibold text-[var(--text-primary)]">{versionLabel}</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-2">
          <span>Last updated</span>
          <span className="font-semibold text-[var(--text-primary)]">{lastUpdatedLabel}</span>
        </div>
      </div>

      <ul className="mt-7 space-y-2.5 text-[0.95rem] leading-7 text-[var(--text-primary)]">
        {inclusionPoints.map((point) => (
          <li key={point} className="flex items-start gap-2.5">
            <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--action-primary)]" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-6 space-y-2.5 text-[0.88rem] leading-6 text-[var(--text-secondary)]">
        <li className="flex items-start gap-2.5">
          <span className="mt-[0.58rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--action-primary)]" />
          Instant download after checkout
        </li>
        <li className="flex items-start gap-2.5">
          <span className="mt-[0.58rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--action-primary)]" />
          Secure checkout powered by Stripe
        </li>
        <li className="flex items-start gap-2.5">
          <span className="mt-[0.58rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--action-primary)]" />
          Pro production use. Enterprise covers commercial reuse and white-label deployment
        </li>
      </ul>

      {stripeReady ? (
        <form action="/api/checkout" method="post" className="mt-8">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="billingCycle" value="one_off" />
          <TrackableSubmitButton
            label={ctaLabel}
            event="checkout_start"
            payload={{ source: "pricing_page", productId, billingCycle: "one_off" }}
            className="inline-flex h-12 w-full items-center justify-center rounded-[0.9rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-[0.94rem] font-semibold !text-[var(--action-text)] shadow-[0_18px_34px_rgba(0,0,0,0.3)] transition hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
          />
        </form>
      ) : (
        <div className="mt-8 space-y-2.5">
          <button
            type="button"
            disabled
            className="inline-flex h-12 w-full items-center justify-center rounded-[0.9rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-[0.94rem] font-semibold !text-[var(--action-text)] shadow-[0_18px_34px_rgba(0,0,0,0.3)]"
          >
            {ctaLabel}
          </button>
          <p className="rounded-[0.8rem] border border-[var(--border-subtle)] bg-[var(--bg-accent-soft)] px-4 py-3 text-[0.84rem] leading-6 text-[var(--text-secondary)]">
            {isStaticPreview
              ? "GitHub Pages preview only. Live checkout runs on the primary deployment."
              : "Checkout is currently unavailable in this environment."}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.84rem] font-semibold text-[var(--text-secondary)]">
        <Link href="/layouts" className="underline-offset-2 hover:text-[var(--text-primary)] hover:underline">
          Explore layouts
        </Link>
        <Link href="/components" className="underline-offset-2 hover:text-[var(--text-primary)] hover:underline">
          Inspect components
        </Link>
      </div>
    </aside>
  );
}
