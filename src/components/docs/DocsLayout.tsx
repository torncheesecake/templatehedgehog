import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
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
      <SiteTopBar theme="hero" ctaHref="/pricing" ctaLabel="Get Hedgehog Core - £79" />
      <section className={cn(VS.templates.content.frame, "pb-24")}>
        <div className={VS.widths.docs}>
          <header className={cn(VS.templates.content.heroCard, "max-w-[84rem]")}>
            <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--accent-support)">
              Documentation
            </p>
            <h1 className={cn("mt-4 max-w-[22ch] text-[2.05rem] sm:text-[2.5rem]", VS.headings.page)}>
              {title}
            </h1>
            <p className={cn("mt-3 max-w-[76ch] text-[1.02rem] leading-8 text-(--th-body-copy)")}>
              {summary}
            </p>
          </header>

          <div className="mt-8 rounded-[1.2rem] border border-(--surface-line) bg-(--surface-soft) p-4 sm:p-5 lg:p-6">
            <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
              <aside className="lg:sticky lg:top-[6.4rem]">
                <div className="hidden rounded-[0.9rem] border border-(--border-light) bg-(--bg-soft-elevated) p-4 lg:block">
                  <p className="text-[0.74rem] font-semibold tracking-[0.01em] text-(--text-secondary-light)">
                    Sections
                  </p>
                  <nav aria-label="Documentation sections" className="mt-3 space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`#${item.id}`}
                        className="block rounded-[0.68rem] px-2.5 py-2 text-[0.92rem] font-medium text-(--text-secondary-light) transition hover:bg-[hsl(var(--th-accent-support)/0.14)] hover:text-(--text-primary-light) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </aside>

              <div>
                <div className="mb-4 flex flex-wrap gap-2 border-b border-(--border-light) pb-4 lg:hidden">
                  {navItems.map((item) => (
                    <Link
                      key={`mobile-${item.id}`}
                      href={`#${item.id}`}
                      className="inline-flex rounded-[0.7rem] border border-(--border-light) bg-(--bg-soft-elevated) px-3 py-1.5 text-[0.8rem] font-semibold text-(--text-primary-light) transition hover:border-(--accent-support) hover:text-(--text-primary-light) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="rounded-[0.95rem] border border-(--border-light) bg-(--bg-soft) px-5 py-5 sm:px-7 sm:py-7">
                  {children}
                </div>
              </div>
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
    <section
      id={id}
      className="border-t border-(--border-light) py-10 first:border-t-0 first:pt-0"
    >
      <h2 className="text-[1.5rem] font-semibold leading-[1.15] text-(--text-primary-light) sm:text-[1.68rem]">{title}</h2>
      <div className="mt-4 max-w-[74ch] space-y-4 text-[1.01rem] leading-8 text-(--text-secondary-light) [&_li]:text-(--text-secondary-light) [&_ol]:mt-4 [&_ul]:mt-4">
        {children}
      </div>
    </section>
  );
}
