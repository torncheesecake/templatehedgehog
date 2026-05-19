import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { BrandSignature } from "@/components/site/BrandSignature";
import { cn } from "@/lib/utils";
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
    <main className={VS.templates.content.main}>
      <SiteTopBar theme="hero" />
      <section className={cn(VS.templates.content.frame, "pb-18") }>
        <div className={VS.widths.docs}>
          <header className="max-w-4xl">
            <BrandSignature index="06" label="Documentation" />
            <h1 className="mt-3 text-[1.95rem] font-semibold leading-tight text-white sm:text-[2.2rem]">{title}</h1>
            <p className="mt-3 text-[1rem] leading-7 text-[var(--th-text-secondary)]">{summary}</p>
          </header>

          <div className="mt-8 grid gap-7 lg:grid-cols-[200px_minmax(0,1fr)] lg:items-start">
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

            <div className="border-l border-[var(--th-border-dark)] pl-5 sm:pl-7">
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
    <section id={id} className="border-t border-[var(--th-border-dark)] py-9 first:border-t-0 first:pt-0">
      <h2 className="text-[1.28rem] font-semibold leading-tight text-white sm:text-[1.4rem]">{title}</h2>
      <div className="mt-4 max-w-3xl space-y-4 text-[1rem] leading-8 text-[var(--th-text-secondary)] [&_li]:text-[var(--th-text-secondary)] [&_ol]:mt-4 [&_ul]:mt-4">
        {children}
      </div>
    </section>
  );
}
