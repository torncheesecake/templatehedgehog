import Link from "next/link";
import { Menu } from "lucide-react";
import { TEMPLATE_CONFIG } from "@/config/template";
import { withBasePath } from "@/lib/asset-path";

interface SiteTopBarProps {
  ctaHref?: string;
  ctaLabel?: string;
  ctaTone?: "action" | "inverse";
  theme?: "default" | "hero";
  heroTone?: "brand" | "neutral";
}

const primaryLinks = [
  { href: "/workflows?view=product", label: "Workflows" },
  { href: "/components", label: "Components" },
  { href: "/layouts", label: "Layouts" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

export function SiteTopBar({
  ctaHref = "/pricing#pro",
  ctaLabel = TEMPLATE_CONFIG.pricing.primaryCtaLabel,
  ctaTone = "action",
  theme = "default",
  heroTone = "brand",
}: SiteTopBarProps) {
  const isHero = theme === "hero";
  const isNeutralHero = isHero && heroTone === "neutral";
  const hogMarkUrl = withBasePath("/brand/hedgehog-mark.svg");
  const headerClass = isHero
    ? "relative z-40 border-b border-white/15 bg-[var(--bg-structural)]"
    : "sticky top-0 z-40 border-b border-white/15 bg-[var(--bg-structural)]";
  const navLinkClass =
    "inline-flex min-h-10 items-center text-[0.94rem] font-semibold tracking-normal !text-[var(--colour-high-priority)] transition-colors duration-200 hover:!text-[#bfe3ca] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2";
  const menuButtonClass =
    "inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-[0.78rem] border border-white/20 bg-white/8 !text-[var(--colour-high-priority)] transition hover:border-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2";
  const mobilePanelClass =
    "absolute right-0 top-[3.25rem] z-50 min-w-[220px] rounded-[0.95rem] border border-white/15 bg-[var(--bg-structural)] p-2 shadow-[0_24px_42px_rgba(0,0,0,0.16)]";
  const mobileLinkClass =
    "block rounded-[0.7rem] px-3 py-2 text-[0.98rem] font-semibold tracking-normal !text-[var(--colour-high-priority)] transition hover:bg-white/8 hover:!text-[#bfe3ca] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2";
  const ctaClass = ctaTone === "inverse"
    ? "th-btn th-btn-sm th-btn-primary-on-dark hidden sm:inline-flex"
    : isHero
      ? "th-btn th-btn-sm th-btn-primary hidden sm:inline-flex"
      : "th-btn th-btn-sm th-btn-primary hidden sm:inline-flex";

  void isNeutralHero;

  return (
    <header className={headerClass}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
        >
          <span
            aria-hidden="true"
            className="h-7 w-7 shrink-0 bg-[var(--colour-high-priority)]"
            style={{
              WebkitMaskImage: `url('${hogMarkUrl}')`,
              maskImage: `url('${hogMarkUrl}')`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
          <span className="font-serif text-[1.14rem] font-semibold tracking-normal !text-[var(--colour-high-priority)] sm:text-[1.52rem]">
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
              className={ctaClass}
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
