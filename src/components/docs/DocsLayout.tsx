import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { BrandSignature } from "@/components/site/BrandSignature";
import { visualSystem } from "@/components/site/visualSystem";

interface DocsLayoutProps {
  title: string;
  summary: string;
  children: ReactNode;
  navItems?: Array<{
    id: string;
    label: string;
  }>;
}

interface DocsSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
}

export function DocsLayout({ title, summary, children, navItems = [] }: DocsLayoutProps) {
  const VS = visualSystem;

  return (
    <main className="th-page">
      <SiteTopBar theme="hero" />
      <section className="th-section th-section-roomy">
        <div className={VS.widths.docs}>
          <header className="max-w-4xl">
            <BrandSignature index="06" label="Documentation" />
            <h1 className="th-heading-page mt-4">{title}</h1>
            <p className="th-lede">{summary}</p>
          </header>

          <div className="mt-10 grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:items-start">
            <aside className="lg:sticky lg:top-[6rem]">
              <nav aria-label="Documentation sections" className="hidden lg:block">
                <ul className="space-y-1.5">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <Link href={`#${item.id}`} className="block rounded-[0.64rem] px-2.5 py-2 text-[0.9rem] text-[var(--th-text-secondary)] transition hover:bg-[var(--bg-surface)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div className="border-l border-[var(--th-border-dark)] pl-5 sm:pl-8">
              <div className="mb-4 flex flex-wrap gap-2 border-b border-[var(--th-border-dark)] pb-4 lg:hidden">
                {navItems.map((item) => (
                  <Link key={`mobile-${item.id}`} href={`#${item.id}`} className="inline-flex rounded-[0.7rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)] px-3 py-1.5 text-[0.8rem] font-semibold text-white">
                    {item.label}
                  </Link>
                ))}
              </div>
              {children}
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

export function DocsSection({ id, title, children }: DocsSectionProps) {
  return (
    <section id={id} className="border-t border-[var(--th-border-dark)] py-10 first:border-t-0 first:pt-0">
      <h2 className="text-[1.45rem] font-semibold leading-[1.18] text-white">{title}</h2>
      <div className="mt-4 max-w-3xl space-y-4 text-[1rem] leading-8 text-[var(--th-text-secondary)] [&_li]:text-[var(--th-text-secondary)] [&_ol]:mt-4 [&_ul]:mt-4">
        {children}
      </div>
    </section>
  );
}
