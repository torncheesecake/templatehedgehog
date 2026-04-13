"use client";

import { Plus, Send, UserPlus } from "lucide-react";

const actions = [
  { label: "New invoice", icon: Plus },
  { label: "Invite team member", icon: UserPlus },
  { label: "Send report", icon: Send },
];

export function QuickActions() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold">Common operational actions</h2>
      <p className="mt-1 text-sm text-slate-500">Shows action-focused controls used in day-to-day SaaS operations.</p>
      <div className="mt-4 grid gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 transition hover:-translate-y-[1px] hover:border-slate-200"
          >
            <action.icon className="h-4 w-4 text-rose-600" />
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
