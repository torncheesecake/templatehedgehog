import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { visualSystem } from "@/components/site/visualSystem";

type DocsAction = {
  href: string;
  label: string;
  primary?: boolean;
};

interface DocsLayoutProps {
  title: string;
  summary: string;
  children: ReactNode;
  eyebrow?: string;
  actions?: DocsAction[];
  heroPanel?: ReactNode;
  preface?: ReactNode;
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

export function DocsLayout({
  title,
  summary,
  children,
  eyebrow,
  actions = [],
  heroPanel,
  preface,
  navItems = [],
}: DocsLayoutProps) {
  const VS = visualSystem;

  return (
    <main className="th-monochrome min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <SiteTopBar theme="hero" ctaTone="inverse" />
      <section className="border-t border-[var(--border-subtle)] py-14 sm:py-16">
        <div className={VS.widths.docs}>
          <header className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-end">
            <div>
              {eyebrow ? (
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[var(--identity-source)]">
                  {eyebrow}
                </p>
              ) : null}
              <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.65rem,5.8vw,5rem)] font-semibold leading-[0.94] text-[var(--text-primary)]">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-[1.06rem] leading-8 text-[var(--text-secondary)]">
                {summary}
              </p>
              {actions.length > 0 ? (
                <div className="mt-7 flex flex-wrap gap-3">
                  {actions.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className={action.primary ? "th-btn th-btn-primary" : "th-btn th-btn-secondary text-[var(--text-primary)]"}
                    >
                      {action.label}
                      {action.primary ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            {heroPanel}
          </header>

          {preface ? <div className="mt-12">{preface}</div> : null}

          <div className="mt-12 grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:items-start">
            <aside className="lg:sticky lg:top-[6rem]">
              <nav aria-label="Implementation guide sections" className="hidden border-t border-[var(--border-subtle)] pt-4 lg:block">
                <ul className="space-y-1.5">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <Link href={`#${item.id}`} className="block border-l border-transparent px-2.5 py-2 text-[0.9rem] font-medium text-[var(--text-meta)] transition hover:border-[var(--identity-source-border)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div className="border-l border-[var(--border-subtle)] pl-5 sm:pl-10">
              <div className="mb-4 flex flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-4 lg:hidden">
                {navItems.map((item) => (
                  <Link key={`mobile-${item.id}`} href={`#${item.id}`} className="inline-flex border border-[var(--border-subtle)] bg-white px-3 py-1.5 text-[0.8rem] font-semibold text-[var(--text-secondary)]">
                    {item.label}
                  </Link>
                ))}
              </div>
              {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function DocsSection({ id, title, children }: DocsSectionProps) {
  return (
    <section id={id} className="border-t border-[var(--border-subtle)] py-12 first:border-t-0 first:pt-0">
      <h2 className="text-[1.55rem] font-semibold leading-[1.18] text-[var(--text-primary)]">{title}</h2>
      <div className="mt-5 max-w-3xl space-y-5 text-[1rem] leading-8 text-[var(--text-secondary)] [&_li]:text-[var(--text-secondary)] [&_ol]:mt-4 [&_p]:text-[var(--text-secondary)] [&_ul]:mt-4">
        {children}
      </div>
    </section>
  );
}
