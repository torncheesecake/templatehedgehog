import Link from "next/link";
import { TEMPLATE_CONFIG } from "@/config/template";
import { withBasePath } from "@/lib/asset-path";

const footerNavigation = [
  { href: "/components", label: "Components" },
  { href: "/layouts", label: "Layouts" },
  { href: "/workflows", label: "Workflows" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

const footerResources = [
  { href: "/changelog", label: "Changelog" },
  { href: "/docs", label: "Documentation" },
  { href: "/workflows", label: "Workflow reference" },
  { href: "/pricing", label: "Licence and pricing" },
];

const footerCompany = [
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
  { href: "/success", label: "Success" },
];

interface SiteFooterProps {
  flush?: boolean;
}

export function SiteFooter({ flush = false }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const hogMarkUrl = withBasePath("/brand/hedgehog-mark-core-blue.svg");
  const footerLinkClass =
    "text-[1rem] font-semibold text-(--text-primary-dark) transition hover:text-(--accent-support) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2";

  return (
    <section
      className={`relative overflow-hidden bg-(--hedgehog-core-navy) ${
        flush ? "border-t-0" : "border-t border-(--surface-line)"
      } ${
        flush ? "mt-0" : "mt-16"
      }`}
    >
      <div className="relative mx-auto w-full max-w-[1840px] px-5 pb-12 pt-10 sm:px-8 lg:px-14 lg:pb-14 lg:pt-11">
        <footer className="space-y-8">
          <div className="grid gap-8 border-b border-(--surface-line) pb-8 lg:grid-cols-[minmax(0,1.16fr)_auto] lg:items-end">
            <div>
              <Link
                href="/"
                className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              >
                <span className="text-[1.32rem] font-semibold tracking-[0.01em] text-(--text-primary-dark)">
                  {TEMPLATE_CONFIG.brandName}
                </span>
              </Link>
              <p className="mt-3 max-w-[52ch] text-[1.02rem] leading-8 text-(--th-body-copy)">
                A production-ready MJML workflow system for teams who want faster builds, cleaner handoff, and fewer regressions.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center rounded-[0.82rem] border border-(--accent-primary) bg-(--accent-primary) px-5 text-[0.95rem] font-semibold !text-(--text-primary-dark) tracking-[0.01em] transition duration-200 hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              >
                Get Hedgehog Core - £79
              </Link>
              <Link
                href="/workflows"
                className="inline-flex h-11 items-center rounded-[0.82rem] border border-(--surface-line) bg-transparent px-5 text-[0.95rem] font-semibold !text-(--text-primary-dark) tracking-[0.01em] transition duration-200 hover:border-(--accent-support) hover:!text-(--text-primary-dark) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              >
                Explore workflows
              </Link>
            </div>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            <nav aria-label="Footer primary">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--text-primary-dark)">Navigate</p>
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
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--text-primary-dark)">Resources</p>
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
              <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--text-primary-dark)">Company</p>
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

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--surface-line) pt-5">
            <p className="text-[0.9rem] text-(--dune-muted)">
              Copyright {currentYear} {TEMPLATE_CONFIG.brandName}. All rights reserved.
            </p>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-5 w-5 shrink-0 bg-(--accent-support)"
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
              <p className="text-[0.9rem] text-(--dune-muted)">Built for teams shipping production email.</p>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
