"use client";

import { useMemo, useState } from "react";
import { Bell, Palette, Receipt } from "lucide-react";
import { TEMPLATE_CONFIG } from "@/config/template";

const currencies = ["GBP (£)", "USD ($)", "EUR (€)"];

export function SettingsControlPanel() {
  const [companyName, setCompanyName] = useState(TEMPLATE_CONFIG.brandName);
  const [accent, setAccent] = useState(() => {
    if (typeof window !== "undefined") {
      const cssAccent = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-primary")
        .trim();
      if (/^#[0-9a-fA-F]{6}$/.test(cssAccent)) {
        return cssAccent;
      }
    }
    return "#d13d4c";
  });
  const [currency, setCurrency] = useState(currencies[0]);
  const [invoicePrefix, setInvoicePrefix] = useState("TH");
  const [notifyPaid, setNotifyPaid] = useState(true);
  const [notifyFailed, setNotifyFailed] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const previewGradient = useMemo(
    () => `linear-gradient(135deg, ${accent}33 0%, var(--hedgehog-core-navy) 45%, var(--hedgehog-core-navy) 100%)`,
    [accent],
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-2xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-5">
        <div className="flex items-center gap-2 text-(--accent-primary)">
          <Palette className="h-4 w-4" />
          <h2 className="text-xl font-semibold text-(--text-primary-dark)">Workspace profile</h2>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1.5 block text-(--dune-muted)">Company name</span>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-2.5 text-base text-(--text-primary-dark) outline-none focus:border-(--accent-primary)"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1.5 block text-(--dune-muted)">Default currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-2.5 text-base text-(--text-primary-dark) outline-none focus:border-(--accent-primary)"
            >
              {currencies.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1.5 block text-(--dune-muted)">Brand accent</span>
            <div className="flex gap-2">
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-11 w-16 cursor-pointer rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-1"
              />
              <input
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="w-full rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-2.5 text-base text-(--text-primary-dark) outline-none focus:border-(--accent-primary)"
              />
            </div>
          </label>

          <label className="text-sm">
            <span className="mb-1.5 block text-(--dune-muted)">Invoice prefix</span>
            <input
              value={invoicePrefix}
              onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase().slice(0, 4))}
              className="w-full rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-2.5 text-base text-(--text-primary-dark) outline-none focus:border-(--accent-primary)"
            />
          </label>
        </div>

        <div className="mt-5 rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-4">
          <div className="mb-3 flex items-center gap-2 text-(--accent-primary)">
            <Receipt className="h-4 w-4" />
            <p className="text-sm font-semibold">Invoice format preview</p>
          </div>
          <div className="grid gap-2 text-sm text-(--dune-muted) sm:grid-cols-3">
            <div className="rounded-lg bg-(--hedgehog-core-navy) px-3 py-2">
              <p className="text-xs text-(--dune-muted)">Company</p>
              <p className="mt-0.5 font-semibold">{companyName || TEMPLATE_CONFIG.brandName}</p>
            </div>
            <div className="rounded-lg bg-(--hedgehog-core-navy) px-3 py-2">
              <p className="text-xs text-(--dune-muted)">Invoice ID</p>
              <p className="mt-0.5 font-semibold">{invoicePrefix || "TH"}-4821</p>
            </div>
            <div className="rounded-lg bg-(--hedgehog-core-navy) px-3 py-2">
              <p className="text-xs text-(--dune-muted)">Currency</p>
              <p className="mt-0.5 font-semibold">{currency}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-5">
        <section className="rounded-2xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-5">
          <div className="flex items-center gap-2 text-(--accent-primary)">
            <Bell className="h-4 w-4" />
            <h2 className="text-xl font-semibold text-(--text-primary-dark)">Notification rules</h2>
          </div>
          <div className="mt-4 space-y-2.5 text-sm">
            <Toggle checked={notifyPaid} onChange={() => setNotifyPaid((v) => !v)} label="Invoice paid alerts" />
            <Toggle checked={notifyFailed} onChange={() => setNotifyFailed((v) => !v)} label="Failed payment alerts" />
            <Toggle checked={weeklyDigest} onChange={() => setWeeklyDigest((v) => !v)} label="Weekly KPI digest" />
          </div>
        </section>

        <section className="rounded-2xl border border-(--hedgehog-core-blue-deep) p-5" style={{ background: previewGradient }}>
          <h2 className="text-xl font-semibold text-(--text-primary-dark)">Brand preview</h2>
          <p className="mt-1 text-sm text-[#f7e9e3]">Live preview of cards and action colour</p>
          <div className="mt-4 rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy)/80 p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-(--dune-muted)">Action button</p>
            <button className="mt-2 rounded-lg px-4 py-2 text-sm font-semibold text-[#072031]" style={{ backgroundColor: accent }}>
              Save workspace
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-2.5 text-left"
      aria-pressed={checked}
    >
      <span className="text-base text-(--dune-muted)">{label}</span>
      <span className={`inline-flex h-6 w-11 items-center rounded-full p-1 transition ${checked ? "bg-(--accent-primary)" : "bg-(--hedgehog-core-blue-deep)"}`}>
        <span className={`h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </span>
    </button>
  );
}
