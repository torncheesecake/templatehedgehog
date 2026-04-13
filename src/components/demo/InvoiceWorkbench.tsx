"use client";

import { useMemo, useState } from "react";
import { Invoice, formatCurrency } from "@/lib/saas-admin-data";
import { StatusBadge } from "@/components/demo/StatusBadge";

interface InvoiceWorkbenchProps {
  invoices: Invoice[];
}

export function InvoiceWorkbench({ invoices }: InvoiceWorkbenchProps) {
  const [statusFilter, setStatusFilter] = useState<"All" | Invoice["status"]>("All");
  const [company, setCompany] = useState("New Account");
  const [amount, setAmount] = useState("1200");
  const [saved, setSaved] = useState(false);

  const visible = useMemo(() => {
    if (statusFilter === "All") return invoices;
    return invoices.filter((inv) => inv.status === statusFilter);
  }, [invoices, statusFilter]);

  const parsedAmount = Number(amount) || 0;

  function saveDraft() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Invoice queue</h2>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "All" | Invoice["status"])}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
          </select>
        </div>

        <div className="space-y-2">
          {visible.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
              <div>
                <p className="font-medium">{invoice.id} · {invoice.company}</p>
                <p className="text-sm text-slate-500">{invoice.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                <div className="mt-1">
                  <StatusBadge
                    label={invoice.status}
                    tone={invoice.status === "Paid" ? "success" : invoice.status === "Overdue" ? "danger" : "warning"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Create draft invoice</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm text-slate-500">Company</label>
            <input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-500">Amount (GBP)</label>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base"
            />
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Draft preview</p>
          <p className="mt-1 text-lg font-semibold">{company || "New Account"}</p>
          <p className="mt-1 text-2xl font-bold text-rose-600">{formatCurrency(parsedAmount)}</p>
          <p className="mt-2 text-sm text-slate-500">Status: Pending</p>
        </div>

        <button
          onClick={saveDraft}
          className="mt-4 w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-slate-900"
        >
          Save draft
        </button>

        {saved ? (
          <div className="mt-3 rounded-lg border border-[#2d6a52] bg-[#153a2e] px-3 py-2 text-sm text-[#9df0c3]">
            Draft saved successfully.
          </div>
        ) : null}
      </section>
    </div>
  );
}
