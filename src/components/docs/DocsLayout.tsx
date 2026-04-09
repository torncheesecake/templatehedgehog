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
      <SiteTopBar theme="hero" ctaHref="/components" ctaLabel="Browse components" />
      <section className={cn(VS.templates.content.frame, "pb-24")}>
        <div className={VS.widths.docs}>
          <header className={cn(VS.templates.content.heroCard, "max-w-[84rem]")}>
            <p className={VS.eyebrow.accent}>
              Documentation
            </p>
            <h1 className={cn("mt-4 max-w-[22ch] text-[2.05rem] sm:text-[2.5rem]", VS.headings.page)}>
              {title}
            </h1>
            <p className={cn("mt-3 max-w-[76ch] text-[1.02rem] leading-8 text-(--th-body-copy)")}>
              {summary}
            </p>
          </header>

          <div className="mt-8 rounded-[1.2rem] border border-[rgba(222, 210, 204,0.38)] bg-[linear-gradient(180deg,#fdfdfd_0%,#fbf3f0_100%)] p-4 sm:p-5 lg:p-6">
            <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
              <aside className="lg:sticky lg:top-[6.4rem]">
                <div className="hidden rounded-[0.9rem] border border-[rgba(222, 210, 204,0.32)] bg-[rgba(253,253,253,0.88)] p-4 lg:block">
                  <p className="text-[0.74rem] font-semibold tracking-[0.01em] text-(--th-body-copy)">
                    Sections
                  </p>
                  <nav aria-label="Documentation sections" className="mt-3 space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`#${item.id}`}
                        className="block rounded-[0.68rem] px-2.5 py-2 text-[0.92rem] font-medium text-(--th-body-copy) transition hover:bg-[hsl(var(--th-accent)/0.12)] hover:text-(--hedgehog-core-navy) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </aside>

              <div>
                <div className="mb-4 flex flex-wrap gap-2 border-b border-[rgba(222, 210, 204,0.34)] pb-4 lg:hidden">
                  {navItems.map((item) => (
                    <Link
                      key={`mobile-${item.id}`}
                      href={`#${item.id}`}
                      className="inline-flex rounded-[0.7rem] border border-[rgba(58,57,80,0.2)] bg-[#FDFDFD] px-3 py-1.5 text-[0.8rem] font-semibold text-(--hedgehog-core-navy) transition hover:border-(--accent-primary) hover:text-(--hedgehog-core-navy) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="rounded-[0.95rem] border border-[rgba(222, 210, 204,0.4)] bg-[#ffffff] px-5 py-5 sm:px-7 sm:py-7">
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
      className="border-t border-[rgba(222, 210, 204,0.52)] py-10 first:border-t-0 first:pt-0"
    >
      <h2 className="text-[1.5rem] font-semibold leading-[1.15] text-(--hedgehog-core-navy) sm:text-[1.68rem]">{title}</h2>
      <div className="mt-4 max-w-[74ch] space-y-4 text-[1.01rem] leading-8 text-(--th-body-copy) [&_li]:text-(--th-body-copy) [&_ol]:mt-4 [&_ul]:mt-4">
        {children}
      </div>
    </section>
  );
}
