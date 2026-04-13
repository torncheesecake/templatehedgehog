"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TrackableSubmitButton } from "@/components/analytics/TrackableSubmitButton";

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
    <aside className="relative overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-50 p-7 shadow-[0_34px_64px_rgba(0,0,0,0.42)] sm:p-8">
      <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--th-accent-support)/0.52),transparent)]" />
      <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-slate-600">
        Hedgehog Core
      </p>
      <p className="mt-2 text-[0.9rem] leading-7 text-slate-500">
        One-time purchase. No subscription.
      </p>

      <div
        className="mt-4 inline-flex rounded-[0.8rem] border border-slate-200 bg-white p-1"
        role="group"
        aria-label="VAT display mode"
      >
        <button
          type="button"
          onClick={() => setVatMode("ex_vat")}
          aria-pressed={vatMode === "ex_vat"}
          className={`h-8 rounded-[0.58rem] px-3 text-[0.74rem] font-semibold tracking-[0.02em] transition ${
            vatMode === "ex_vat"
              ? "bg-slate-900 text-slate-900"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Ex VAT
        </button>
        <button
          type="button"
          onClick={() => setVatMode("inc_vat")}
          aria-pressed={vatMode === "inc_vat"}
          className={`h-8 rounded-[0.58rem] px-3 text-[0.74rem] font-semibold tracking-[0.02em] transition ${
            vatMode === "inc_vat"
              ? "bg-slate-900 text-slate-900"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Inc VAT
        </button>
      </div>

      <div className="mt-7 flex items-end gap-2.5">
        <p className="text-[3.9rem] font-semibold leading-[0.86] text-slate-900 sm:text-[4.4rem]">
          {formatHeadlinePriceFromPence(displayedPrice)}
        </p>
        <p className="pb-2 text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
          {vatMode === "inc_vat" ? "inc VAT" : "ex VAT"}
        </p>
      </div>

      <div className="mt-6 rounded-[0.9rem] border border-slate-200 bg-white p-4 text-[0.84rem] text-slate-600">
        <div className="flex items-center justify-between gap-3">
          <span>Version</span>
          <span className="font-semibold text-slate-900">{versionLabel}</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 border-t border-slate-200 pt-2">
          <span>Last updated</span>
          <span className="font-semibold text-slate-900">{lastUpdatedLabel}</span>
        </div>
      </div>

      <ul className="mt-7 space-y-2.5 text-[0.95rem] leading-7 text-slate-900">
        {inclusionPoints.map((point) => (
          <li key={point} className="flex items-start gap-2.5">
            <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-6 space-y-2.5 text-[0.88rem] leading-6 text-slate-500">
        <li className="flex items-start gap-2.5">
          <span className="mt-[0.58rem] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
          Instant download after checkout
        </li>
        <li className="flex items-start gap-2.5">
          <span className="mt-[0.58rem] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
          Secure checkout powered by Stripe
        </li>
        <li className="flex items-start gap-2.5">
          <span className="mt-[0.58rem] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
          Commercial use across your own and client projects
        </li>
      </ul>

      {stripeReady ? (
        <form action="/api/checkout" method="post" className="mt-8">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="billingCycle" value="one_off" />
          <TrackableSubmitButton
            label={ctaLabel}
            event="click_buy_now"
            payload={{ source: "pricing_page", packId: "pack-1", billingCycle: "one_off" }}
            className="inline-flex h-12 w-full items-center justify-center rounded-[0.9rem] border border-rose-600 bg-rose-600 px-5 text-[0.94rem] font-semibold text-white shadow-[0_18px_34px_rgba(0,0,0,0.3)] transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          />
        </form>
      ) : (
        <div className="mt-8 space-y-2.5">
          <button
            type="button"
            disabled
            className="inline-flex h-12 w-full items-center justify-center rounded-[0.9rem] border border-rose-600 bg-rose-600 px-5 text-[0.94rem] font-semibold text-white shadow-[0_18px_34px_rgba(0,0,0,0.3)] opacity-80"
          >
            {ctaLabel}
          </button>
          <p className="rounded-[0.8rem] border border-slate-200 bg-slate-50 px-4 py-3 text-[0.84rem] leading-6 text-slate-600">
            {isStaticPreview
              ? "GitHub Pages preview only. Live checkout runs on the primary deployment."
              : "Checkout is currently unavailable in this environment."}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.84rem] font-semibold text-slate-500">
        <Link href="/workflows" className="underline-offset-2 hover:text-slate-900 hover:underline">
          Explore workflows
        </Link>
        <Link href="/components" className="underline-offset-2 hover:text-slate-900 hover:underline">
          Browse free reference
        </Link>
      </div>
    </aside>
  );
}
