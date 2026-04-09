"use client";

import { Search } from "lucide-react";

export function CommandBar() {
  return (
    <div className="rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-3">
      <label className="flex items-center gap-3 rounded-lg border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-2.5">
        <Search className="h-4 w-4 text-(--accent-primary)" />
        <input
          aria-label="Search"
          placeholder="Search customers, invoices, team members"
          className="w-full bg-transparent text-sm text-(--dune-muted) outline-none placeholder:text-(--dune-muted)"
        />
        <span className="rounded border border-(--hedgehog-core-blue-deep) px-1.5 py-0.5 text-xs text-(--dune-muted)">Cmd K</span>
      </label>
    </div>
  );
}
