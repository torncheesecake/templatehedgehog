import type { Metadata } from "next";
import Link from "next/link";
import { createPageTitle, TEMPLATE_CONFIG } from "@/config/template";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { cn } from "@/lib/utils";
import { visualSystem } from "@/components/site/visualSystem";

export const metadata: Metadata = {
  title: createPageTitle("About"),
  description:
    `About ${TEMPLATE_CONFIG.brandName} and the product philosophy behind enterprise MJML components and layout recipes.`,
};

const principles = [
  {
    title: "Production quality first",
    description:
      "Blocks should work in real campaigns and lifecycle sends, not just look good in mockups.",
  },
  {
    title: "Components and layouts together",
    description:
      "Single blocks support reuse. Full layouts support complete send journeys. Teams need both.",
  },
  {
    title: "Workflow over screenshots",
    description:
      "You should be able to inspect, edit, compile, and export quickly without friction.",
  },
  {
    title: "Commercial clarity",
    description:
      "Versioning, changelog visibility, and clear delivery are part of product trust.",
  },
];

export default function AboutPage() {
  const VS = visualSystem;

  return (
    <main className={VS.templates.content.main}>
      <SiteTopBar ctaHref="/components" ctaLabel="Browse components" />
      <section className={cn(VS.templates.content.frame, "pb-20")}>
        <div className={VS.templates.content.body}>
          <article className={VS.templates.content.heroCard}>
            <p className={VS.eyebrow.accent}>
              {`About ${TEMPLATE_CONFIG.brandName}`}
            </p>
            <h1 className={cn("mt-3 max-w-[22ch] text-[2.1rem] sm:text-[2.55rem]", VS.headings.page)}>
              Built for teams that send real email.
            </h1>
            <p className={cn("mt-4 max-w-[72ch] text-[1.02rem] leading-8", VS.body.onLight)}>
              {TEMPLATE_CONFIG.brandName} is for teams that need dependable MJML structure, predictable rendering, and a workflow that holds up under delivery pressure.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[0.9rem] border border-(--surface-line) bg-(--surface-soft) px-4 py-3">
                <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Components</p>
                <p className="mt-1 text-[0.95rem] font-semibold text-(--text-primary-dark)">Single reusable blocks</p>
              </div>
              <div className="rounded-[0.9rem] border border-(--surface-line) bg-(--surface-soft) px-4 py-3">
                <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Layouts</p>
                <p className="mt-1 text-[0.95rem] font-semibold text-(--text-primary-dark)">Full recipes from stacked components</p>
              </div>
            </div>
          </article>

          <section className={VS.templates.content.sectionCard}>
            <h2 className={cn("text-[1.32rem]", VS.headings.subsection)}>What we optimise for</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {principles.map((principle) => (
                <article key={principle.title} className="rounded-[0.9rem] border border-(--surface-line) bg-(--surface-soft) px-4 py-3">
                  <h3 className="text-[1rem] font-semibold text-(--text-primary-dark)">{principle.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-7 text-(--th-body-copy)">{principle.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={VS.templates.content.sectionCard}>
            <h2 className={cn("text-[1.32rem]", VS.headings.subsection)}>Get started</h2>
            <p className={cn("mt-3 text-[0.98rem] leading-7", VS.body.compact)}>
              Start with components, move to layouts for full campaign structure, then upgrade when the full archive will save your team time.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link
                href="/components"
                className={cn(VS.buttons.primary, "h-10 px-4")}
              >
                View components
              </Link>
              <Link
                href="/layouts"
                className={cn(VS.buttons.secondaryLight, "h-10 bg-(--surface-soft) px-4 text-(--text-primary-dark)")}
              >
                View layouts
              </Link>
              <Link
                href="/pricing"
                className={cn(VS.buttons.secondaryLight, "h-10 bg-(--surface-soft) px-4 text-(--text-primary-dark)")}
              >
                Pricing
              </Link>
            </div>
          </section>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
