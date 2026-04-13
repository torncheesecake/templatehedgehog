"use client";

import { Search } from "lucide-react";

export function CommandBar() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
        <Search className="h-4 w-4 text-rose-600" />
        <input
          aria-label="Search"
          placeholder="Search customers, invoices, team members"
          className="w-full bg-transparent text-sm text-slate-500 outline-none placeholder:text-slate-500"
        />
        <span className="rounded border border-slate-200 px-1.5 py-0.5 text-xs text-slate-500">Cmd K</span>
      </label>
    </div>
  );
}
