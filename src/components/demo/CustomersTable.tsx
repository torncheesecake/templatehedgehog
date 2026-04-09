"use client";

import { useMemo, useState } from "react";
import { Customer, formatCurrency } from "@/lib/saas-admin-data";
import { StatusBadge } from "@/components/demo/StatusBadge";

interface CustomersTableProps {
  rows: Customer[];
}

type SortKey = "company" | "arr" | "seats";

export function CustomersTable({ rows }: CustomersTableProps) {
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState<"All" | Customer["plan"]>("All");
  const [sortKey, setSortKey] = useState<SortKey>("arr");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const base = rows.filter((row) => {
      const matchesQuery = q.length === 0 || row.company.toLowerCase().includes(q);
      const matchesPlan = plan === "All" || row.plan === plan;
      return matchesQuery && matchesPlan;
    });

    const sorted = [...base].sort((a, b) => {
      const direction = sortDir === "asc" ? 1 : -1;
      if (sortKey === "company") return a.company.localeCompare(b.company) * direction;
      if (sortKey === "seats") return (a.seats - b.seats) * direction;
      return (a.arr - b.arr) * direction;
    });

    return sorted;
  }, [rows, query, plan, sortKey, sortDir]);

  function toggleSort(next: SortKey) {
    if (sortKey === next) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(next);
    setSortDir(next === "company" ? "asc" : "desc");
  }

  return (
    <section className="rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-xl font-semibold">Customer accounts</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search company"
            className="rounded-lg border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-2 text-sm"
          />
          <select
            value={plan}
            onChange={(event) => setPlan(event.target.value as "All" | Customer["plan"])}
            className="rounded-lg border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-2 text-sm"
          >
            <option>All</option>
            <option>Starter</option>
            <option>Growth</option>
            <option>Scale</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-8 text-center">
          <p className="text-lg font-semibold">No customer matches</p>
          <p className="mt-1 text-sm text-(--dune-muted)">Try clearing filters or using a broader search term.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-(--hedgehog-core-blue-deep) text-(--dune-muted)">
                <th className="pb-3 pr-3">
                  <button onClick={() => toggleSort("company")} className="font-semibold">Company</button>
                </th>
                <th className="pb-3 pr-3">Plan</th>
                <th className="pb-3 pr-3">
                  <button onClick={() => toggleSort("seats")} className="font-semibold">Seats</button>
                </th>
                <th className="pb-3 pr-3">
                  <button onClick={() => toggleSort("arr")} className="font-semibold">ARR</button>
                </th>
                <th className="pb-3">Health</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.company} className="border-b border-(--hedgehog-core-navy) last:border-0">
                  <td className="py-3 pr-3 font-medium">{customer.company}</td>
                  <td className="py-3 pr-3">{customer.plan}</td>
                  <td className="py-3 pr-3">{customer.seats}</td>
                  <td className="py-3 pr-3">{formatCurrency(customer.arr)}</td>
                  <td className="py-3">
                    <StatusBadge
                      label={customer.health}
                      tone={customer.health === "Strong" ? "success" : customer.health === "Risk" ? "danger" : "warning"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
