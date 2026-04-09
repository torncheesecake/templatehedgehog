import Link from "next/link";
import { Menu } from "lucide-react";
import { TEMPLATE_CONFIG } from "@/config/template";

interface SiteTopBarProps {
  ctaHref?: string;
  ctaLabel?: string;
  theme?: "default" | "hero";
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
}: SiteTopBarProps) {
  const isHero = theme === "hero";

  return (
    <header
      className={
        isHero
          ? "relative z-40 border-b border-(--surface-line) bg-(--surface-strong)"
          : "sticky top-0 z-40 border-b border-(--surface-line) bg-(--surface-strong) shadow-[0_14px_30px_rgba(0,0,0,0.34)] backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex w-full max-w-[1840px] items-center justify-between px-5 py-3.5 sm:px-8 lg:px-14">
        <Link href="/" className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2">
          <span className="text-[1.08rem] font-semibold tracking-[0.01em] text-(--text-primary-dark) sm:text-[1.36rem]">
            {TEMPLATE_CONFIG.brandName}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {primaryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.94rem] font-medium tracking-[0.012em] text-(--th-body-copy) transition-colors hover:text-(--text-primary-dark) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
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
                  ? "inline-flex h-11 items-center rounded-[0.82rem] border border-(--accent-primary) bg-(--accent-primary) px-5 text-[0.95rem] font-semibold !text-(--text-primary-dark) tracking-[0.01em] transition duration-200 hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                  : "button-refined-primary inline-flex h-11 items-center px-5 text-[0.95rem] font-semibold !text-(--text-primary-dark) tracking-[0.01em] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              }
            >
              {ctaLabel}
            </Link>
          ) : null}

          <details className="relative lg:hidden">
            <summary className="inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-[0.78rem] border border-(--surface-line) bg-(--surface-soft) text-(--text-primary-dark) transition hover:border-(--accent-support) hover:text-(--text-primary-dark) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation</span>
            </summary>
            <nav
              aria-label="Mobile primary"
              className="absolute right-0 top-[3.25rem] z-50 min-w-[220px] rounded-[0.95rem] border border-(--surface-line) bg-(--surface-soft) p-2 shadow-[0_24px_42px_rgba(0,0,0,0.42)]"
            >
              {primaryLinks.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className="block rounded-[0.7rem] px-3 py-2 text-[0.98rem] font-medium tracking-[0.01em] text-(--th-body-copy) transition hover:bg-[hsl(var(--th-accent-support)/0.14)] hover:text-(--text-primary-dark) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
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
