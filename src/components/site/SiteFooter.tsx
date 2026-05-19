import Link from "next/link";
import { TEMPLATE_CONFIG } from "@/config/template";
import { withBasePath } from "@/lib/asset-path";

const footerNavigation = [
  { href: "/components", label: "Components" },
  { href: "/layouts", label: "Layouts" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

const footerResources = [
  { href: "/changelog", label: "Changelog" },
  { href: "/docs", label: "Documentation" },
  { href: "/layouts", label: "System reference" },
  { href: "/pricing", label: "Licence and pricing" },
];

const footerCompany = [
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
];

interface SiteFooterProps {
  flush?: boolean;
  theme?: "light" | "dark";
  showPrimaryCta?: boolean;
}

export function SiteFooter({ flush = false, theme = "dark", showPrimaryCta = true }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const hogMarkUrl = withBasePath("/brand/hedgehog-mark-core-blue.svg");
  const footerLinkClass =
    "inline-flex min-h-10 items-center text-[1rem] font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2";

  void theme;

  return (
    <section
      className={`relative overflow-hidden bg-[var(--bg-canvas)] ${
        flush ? "border-t-0" : "border-t border-[var(--border-subtle)]"
      } ${
        flush ? "mt-0" : "mt-16"
      }`}
    >
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-12 pt-10 sm:px-8 lg:px-12 lg:pb-14 lg:pt-11">
        <footer className="space-y-8">
          <div className="grid gap-8 border-b border-[var(--border-subtle)] pb-8 lg:grid-cols-[minmax(0,1.16fr)_auto] lg:items-end">
            <div>
              <Link
                href="/"
                className="inline-flex min-h-10 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
              >
                <span className="font-serif text-[1.32rem] font-semibold tracking-normal text-[var(--text-primary)]">
                  {TEMPLATE_CONFIG.brandName}
                </span>
              </Link>
              <p className="mt-3 max-w-3xl text-[1.02rem] leading-8 text-[var(--text-secondary)]">
                A production-ready MJML email system from {TEMPLATE_CONFIG.owner.name} for teams who want faster builds, cleaner handoff, and fewer regressions.
              </p>
            </div>

            {showPrimaryCta ? (
              <div className="flex lg:justify-end">
                <Link
                  href="/pricing"
                  className="inline-flex h-11 items-center rounded-[0.82rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-[0.95rem] font-semibold !text-[var(--action-text)] tracking-[0.01em] transition duration-200 hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
                >
                  {TEMPLATE_CONFIG.pricing.primaryCtaLabel}
                </Link>
              </div>
            ) : null}
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            <nav aria-label="Footer primary">
              <p className="text-[0.95rem] font-semibold text-[var(--text-primary)]">Navigate</p>
              <ul className="mt-3.5 space-y-2.5">
                {footerNavigation.map((item) => (
                  <li key={`footer-${item.href}`}>
                    <Link
                      href={item.href}
                      className={footerLinkClass}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Footer resources">
              <p className="text-[0.95rem] font-semibold text-[var(--text-primary)]">Resources</p>
              <ul className="mt-3.5 space-y-2.5">
                {footerResources.map((item) => (
                  <li key={`resources-${item.href}`}>
                    <Link
                      href={item.href}
                      className={footerLinkClass}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Footer company">
              <p className="text-[0.95rem] font-semibold text-[var(--text-primary)]">Company</p>
              <ul className="mt-3.5 space-y-2.5">
                {footerCompany.map((item) => (
                  <li key={`company-${item.href}`}>
                    <Link
                      href={item.href}
                      className={footerLinkClass}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-5">
            <p className="text-[0.9rem] text-[var(--text-meta)]">
              Copyright {currentYear} {TEMPLATE_CONFIG.owner.name}. {TEMPLATE_CONFIG.brandName} is a product of {TEMPLATE_CONFIG.owner.name}.
            </p>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-5 w-5 shrink-0 bg-[var(--text-primary)]"
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
              <p className="text-[0.9rem] text-[var(--text-meta)]">Built for teams shipping production email.</p>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
