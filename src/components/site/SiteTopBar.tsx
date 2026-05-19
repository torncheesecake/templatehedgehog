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
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

export function SiteTopBar({
  ctaHref = TEMPLATE_CONFIG.pricing.primaryCtaHref,
  ctaLabel = TEMPLATE_CONFIG.pricing.primaryCtaLabel,
  theme = "default",
  heroTone = "brand",
}: SiteTopBarProps) {
  const isHero = theme === "hero";
  const isNeutralHero = isHero && heroTone === "neutral";
  const headerClass = isHero
    ? "relative z-40 border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-canvas)_88%,transparent)] backdrop-blur-xl"
    : "sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-canvas)_88%,transparent)] backdrop-blur-xl";
  const navLinkClass =
    "inline-flex min-h-10 items-center text-[0.94rem] font-medium tracking-normal text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2";
  const menuButtonClass =
    "inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-[0.78rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2";
  const mobilePanelClass =
    "absolute right-0 top-[3.25rem] z-50 min-w-[220px] rounded-[0.95rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 shadow-[0_24px_42px_rgba(0,0,0,0.16)]";
  const mobileLinkClass =
    "block rounded-[0.7rem] px-3 py-2 text-[0.98rem] font-medium tracking-normal text-[var(--text-secondary)] transition hover:bg-[var(--bg-canvas)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2";

  void isNeutralHero;

  return (
    <header className={headerClass}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
        >
          <span className="font-serif text-[1.14rem] font-semibold tracking-normal text-[var(--text-primary)] sm:text-[1.52rem]">
            {TEMPLATE_CONFIG.brandName}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {primaryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClass}
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
                  ? "inline-flex h-11 items-center whitespace-nowrap rounded-[0.82rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-4 text-[0.9rem] font-semibold !text-[var(--action-text)] tracking-[0.01em] transition duration-200 hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2 sm:px-5 sm:text-[0.94rem]"
                  : "inline-flex h-11 items-center whitespace-nowrap rounded-[0.82rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-4 text-[0.9rem] font-semibold !text-[var(--action-text)] tracking-[0.01em] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2 sm:px-5 sm:text-[0.95rem]"
              }
            >
              {ctaLabel}
            </Link>
          ) : null}

          <details className="relative lg:hidden">
            <summary className={menuButtonClass}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation</span>
            </summary>
            <nav
              aria-label="Mobile primary"
              className={mobilePanelClass}
            >
              {primaryLinks.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className={mobileLinkClass}
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
