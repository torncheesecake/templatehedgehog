import Link from "next/link";
import { Menu } from "lucide-react";
import { TEMPLATE_CONFIG } from "@/config/template";

interface SiteTopBarProps {
  ctaHref?: string;
  ctaLabel?: string;
  theme?: "default" | "hero";
  heroTone?: "brand" | "neutral";
}

const primaryLinks = [
  { href: "/components", label: "Components" },
  { href: "/layouts", label: "Layouts" },
  { href: "/workflows", label: "Workflows" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

export function SiteTopBar({
  ctaHref = "/pricing",
  ctaLabel = "Get Hedgehog Core - £79",
  theme = "default",
  heroTone = "brand",
}: SiteTopBarProps) {
  const isHero = theme === "hero";
  const isNeutralHero = isHero && heroTone === "neutral";

  return (
    <header
      className={
        isHero
          ? isNeutralHero
            ? "relative z-40 border-b border-slate-800/70 bg-[radial-gradient(circle_at_76%_18%,rgba(59,130,246,0.24),transparent_38%),radial-gradient(circle_at_18%_84%,rgba(30,64,175,0.14),transparent_34%),#07111f]"
            : "relative z-40 border-b border-slate-800/70 bg-[radial-gradient(circle_at_76%_18%,rgba(59,130,246,0.24),transparent_38%),radial-gradient(circle_at_18%_84%,rgba(30,64,175,0.14),transparent_34%),#07111f]"
          : "sticky top-0 z-40 border-b border-slate-200 bg-white shadow-[0_14px_30px_rgba(0,0,0,0.34)] backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
        >
          <span className={isHero ? "text-[1.08rem] font-semibold tracking-[0.01em] text-white sm:text-[1.36rem]" : "text-[1.08rem] font-semibold tracking-[0.01em] text-slate-900 sm:text-[1.36rem]"}>
            {TEMPLATE_CONFIG.brandName}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {primaryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isHero
                  ? "text-[0.94rem] font-medium tracking-[0.012em] text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
                  : "text-[0.94rem] font-medium tracking-[0.012em] text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {ctaHref ? (
            <Link
              href={ctaHref}
              className={
                isHero
                  ? "inline-flex h-11 items-center rounded-[0.82rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-[0.95rem] font-semibold !text-[var(--action-text)] tracking-[0.01em] transition duration-200 hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
                  : "inline-flex h-11 items-center rounded-[0.82rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-[0.95rem] font-semibold !text-[var(--action-text)] tracking-[0.01em] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
              }
            >
              {ctaLabel}
            </Link>
          ) : null}

          <details className="relative lg:hidden">
            <summary
              className={
                isHero
                  ? isNeutralHero
                    ? "inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-[0.78rem] border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-slate-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
                    : "inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-[0.78rem] border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-blue-500/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
                  : "inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-[0.78rem] border border-slate-200 bg-slate-50 text-slate-900 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              }
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation</span>
            </summary>
            <nav
              aria-label="Mobile primary"
              className={
                isHero
                  ? isNeutralHero
                    ? "absolute right-0 top-[3.25rem] z-50 min-w-[220px] rounded-[0.95rem] border border-slate-700 bg-slate-800 p-2"
                    : "absolute right-0 top-[3.25rem] z-50 min-w-[220px] rounded-[0.95rem] border border-slate-700 bg-slate-800 p-2"
                  : "absolute right-0 top-[3.25rem] z-50 min-w-[220px] rounded-[0.95rem] border border-slate-200 bg-slate-50 p-2 shadow-[0_24px_42px_rgba(0,0,0,0.42)]"
              }
            >
              {primaryLinks.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className={
                    isHero
                      ? "block rounded-[0.7rem] px-3 py-2 text-[0.98rem] font-medium tracking-[0.01em] text-slate-300 transition hover:bg-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
                      : "block rounded-[0.7rem] px-3 py-2 text-[0.98rem] font-medium tracking-[0.01em] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
