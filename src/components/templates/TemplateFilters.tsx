"use client";

import { cn } from "@/lib/utils";
import { ProductCategory } from "@/types";

interface TemplateFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: ProductCategory | "all";
  onCategoryChange: (value: ProductCategory | "all") => void;
  sort: string;
  onSortChange: (value: string) => void;
}

const categories: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "erp", label: "ERP" },
  { value: "analytics", label: "Analytics" },
  { value: "saas", label: "SaaS" },
  { value: "crm", label: "CRM" },
];

export function TemplateFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: TemplateFiltersProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Category + Sort Row */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                category === cat.value
                  ? "bg-primary text-white"
                  : "bg-surface-tertiary text-text-secondary hover:bg-border hover:text-text-primary"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}
