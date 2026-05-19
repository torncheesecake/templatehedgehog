import type { Metadata } from "next";
import Link from "next/link";
import { TEMPLATE_CONFIG } from "@/config/template";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { cn } from "@/lib/utils";
import { visualSystem } from "@/components/site/visualSystem";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "About",
  description:
    `${TEMPLATE_CONFIG.brandName} is a product of ${TEMPLATE_CONFIG.owner.name}, built for production-ready MJML components, layouts, and email systems.`,
  path: "/about",
  keywords: [
    "Template Hedgehog",
    "Artifexa",
    "production email systems",
    "MJML product",
  ],
});

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
      <SiteTopBar />
      <JsonLd
        id="about-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <section className={cn(VS.templates.content.frame, "pb-20")}>
        <div className={VS.templates.content.body}>
          <article className={VS.templates.content.heroCard}>
            <p className={VS.eyebrow.accent}>
              {`About ${TEMPLATE_CONFIG.brandName}`}
            </p>
            <h1 className={cn("mt-3 max-w-3xl text-[2.1rem] sm:text-[2.55rem]", VS.headings.page)}>
              Built for teams that send real email.
            </h1>
            <p className={cn("mt-4 max-w-3xl text-[1.02rem] leading-8", VS.body.onLight)}>
              {TEMPLATE_CONFIG.brandName} is a product of {TEMPLATE_CONFIG.owner.name} for teams that need dependable MJML structure, predictable rendering, and a workflow that holds up under delivery pressure.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[0.9rem] border border-[var(--th-border-dark)] bg-[#111933] px-4 py-3">
                <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-[var(--th-text-secondary)]">Components</p>
                <p className="mt-1 text-[0.95rem] font-semibold text-white">Single reusable blocks</p>
              </div>
              <div className="rounded-[0.9rem] border border-[var(--th-border-dark)] bg-[#111933] px-4 py-3">
                <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-[var(--th-text-secondary)]">Layouts</p>
                <p className="mt-1 text-[0.95rem] font-semibold text-white">Full recipes from stacked components</p>
              </div>
            </div>
          </article>

          <section className={VS.templates.content.sectionCard}>
            <h2 className={cn("text-[1.32rem]", VS.headings.subsection)}>What we optimise for</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {principles.map((principle) => (
                <article key={principle.title} className="rounded-[0.9rem] border border-[var(--th-border-dark)] bg-[#111933] px-4 py-3">
                  <h3 className="text-[1rem] font-semibold text-white">{principle.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-7 text-[var(--th-text-secondary)]">{principle.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={VS.templates.content.sectionCard}>
            <h2 className={cn("text-[1.32rem]", VS.headings.subsection)}>Get started</h2>
            <p className={cn("mt-3 text-[0.98rem] leading-7", VS.body.compact)}>
              Start with components, move to layouts for full campaign structure, then choose Pro when the full archive will save your team time.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link
                href="/components"
                className={cn(VS.buttons.secondaryDark, "h-10 px-4")}
              >
                View components
              </Link>
              <Link
                href="/layouts"
                className={cn(VS.buttons.secondaryDark, "h-10 px-4")}
              >
                View layouts
              </Link>
              <Link
                href="/pricing"
                className={cn(VS.buttons.primary, "h-10 px-4")}
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
