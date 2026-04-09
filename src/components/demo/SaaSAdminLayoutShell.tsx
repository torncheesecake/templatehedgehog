"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CreditCard,
  Flag,
  LayoutDashboard,
  LineChart,
  Scale,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { TEMPLATE_CONFIG } from "@/config/template";

const navSections = [
  {
    title: "Core",
    items: [
      { href: "/demo/saas-admin-pro", label: "Overview", icon: LayoutDashboard },
      { href: "/demo/saas-admin-pro/onboarding", label: "Onboarding", icon: Flag },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/demo/saas-admin-pro/customers", label: "Customers", icon: Building2 },
      { href: "/demo/saas-admin-pro/billing", label: "Billing", icon: CreditCard },
      { href: "/demo/saas-admin-pro/reports", label: "Reports", icon: LineChart },
    ],
  },
  {
    title: "Workspace",
    items: [
      { href: "/demo/saas-admin-pro/team", label: "Team", icon: Users },
      { href: "/demo/saas-admin-pro/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function SaaSAdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-(--hedgehog-core-navy) text-(--text-primary-dark)">
      <div className="mx-auto grid min-h-screen max-w-[1520px] grid-cols-1 lg:grid-cols-[270px_1fr]">
        <aside className="border-b border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-5 lg:border-b-0 lg:border-r">
          <Link href="/templates/saas-admin-pro" className="inline-flex items-center gap-3 text-lg font-semibold text-(--accent-primary)">
            <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy)">
              <Image src="/brand/hedgehog-uxwing-logo.svg" alt={TEMPLATE_CONFIG.brandName} width={32} height={32} className="h-8 w-8 object-contain" />
            </span>
            SaaS Admin Pro
          </Link>

          <nav className="mt-6">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navSections.flatMap((section) => section.items).map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-(--accent-primary) bg-(--hedgehog-core-navy) text-(--dune-muted)"
                        : "border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) text-(--dune-muted) hover:border-(--hedgehog-core-blue-deep) hover:text-(--dune-muted)"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden space-y-4 lg:block">
            {navSections.map((section) => (
              <div key={section.title}>
                <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-[0.08em] text-(--dune-muted)">{section.title}</p>
                <div className="grid gap-1">
                  {section.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 border-l-2 px-3 py-2.5 text-base transition ${
                          active
                            ? "border-(--accent-primary) bg-(--hedgehog-core-navy) text-(--dune-muted)"
                            : "border-transparent text-(--dune-muted) hover:border-(--hedgehog-core-blue-deep) hover:bg-(--hedgehog-core-navy) hover:text-(--dune-muted)"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            </div>
          </nav>

          <section className="mt-6 rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-(--accent-primary)">Built for real B2B workflows</p>
            <div className="mt-3 space-y-2">
              {[
                { label: "UX coverage", score: "9.5" },
                { label: "Visual consistency", score: "9.7" },
                { label: "Workflow depth", score: "9.4" },
                { label: "Implementation readiness", score: "9.6" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-md bg-(--hedgehog-core-navy) px-2.5 py-2 text-xs">
                  <span className="text-[#f7e9e3]">{item.label}</span>
                  <span className="font-semibold text-(--accent-primary)">{item.score}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-4 rounded-xl border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-(--accent-primary)">Buyer actions</p>
            <div className="mt-3 grid gap-2">
              <Link href="/templates/saas-admin-pro#buy" className="rounded-lg bg-(--accent-primary) px-3 py-2 text-sm font-semibold text-(--text-primary-dark)">
                Buy template
              </Link>
              <Link
                href="/templates/saas-admin-pro#modules"
                className="rounded-lg border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-2 text-sm font-semibold text-(--dune-muted)"
              >
                View all screens
              </Link>
              <Link
                href="/templates/saas-admin-pro/docs"
                className="rounded-lg border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-2 text-sm font-semibold text-(--dune-muted)"
              >
                Read documentation
              </Link>
              <Link
                href="/templates/saas-admin-pro#licence"
                className="inline-flex items-center gap-2 rounded-lg border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-2 text-sm font-semibold text-(--dune-muted)"
              >
                <Scale className="h-4 w-4" />
                Compare licences
              </Link>
            </div>
          </section>
        </aside>

        <div>
          <header className="sticky top-0 z-10 border-b border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy)/95 px-6 py-3 backdrop-blur lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-(--dune-muted)">Workspace</p>
                <p className="text-base font-semibold text-(--dune-muted)">{TEMPLATE_CONFIG.brandName} Demo</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="hidden items-center gap-2 rounded-lg border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-1.5 md:flex">
                  <Search className="h-3.5 w-3.5 text-(--accent-primary)" />
                  <input
                    type="text"
                    value="Search pages"
                    readOnly
                    className="w-28 bg-transparent text-xs text-(--dune-muted) outline-none"
                  />
                </label>
                <span className="rounded-full border border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) px-3 py-1 text-xs font-semibold text-(--accent-primary)">
                  Interactive product demo
                </span>
              </div>
            </div>
          </header>

          <div className="p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
