import type { Metadata } from "next";
import Link from "next/link";
import { TEMPLATE_CONFIG } from "@/config/template";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "About",
  description:
    `${TEMPLATE_CONFIG.brandName} is built for production-ready MJML components, layouts, and email systems.`,
  path: "/about",
  keywords: [
    "Template Hedgehog",
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
  return (
    <main className="th-page">
      <SiteTopBar />
      <JsonLd
        id="about-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <section className="th-section th-section-roomy">
        <div className="th-container max-w-6xl">
          <header>
            <p className="th-eyebrow">
              {`About ${TEMPLATE_CONFIG.brandName}`}
            </p>
            <h1 className="th-heading-page mt-4">
              Built for teams that send real email.
            </h1>
            <p className="th-lede">
              {TEMPLATE_CONFIG.brandName} is for teams that need dependable MJML structure, predictable rendering, and a workflow that holds up under delivery pressure.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="th-metric">
                <p className="th-metric-title">Components</p>
                <p className="th-metric-copy text-white">Single reusable blocks</p>
              </div>
              <div className="th-metric">
                <p className="th-metric-title">Layouts</p>
                <p className="th-metric-copy text-white">Full recipes from stacked components</p>
              </div>
            </div>
          </header>

          <section className="mt-12 border-t border-[var(--border-subtle)] pt-9">
            <h2 className="th-heading-section">What we optimise for</h2>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {principles.map((principle) => (
                <article key={principle.title} className="th-metric">
                  <h3 className="text-[1rem] font-semibold text-white">{principle.title}</h3>
                  <p className="th-metric-copy">{principle.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-12 border-t border-[var(--border-subtle)] pt-9">
            <h2 className="th-heading-section">Get started</h2>
            <p className="th-copy">
              Start with components, move to layouts for full campaign structure, then choose Pro when the full archive will save your team time.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link
                href="/components"
                className="inline-flex h-11 items-center rounded-full border border-[var(--border-subtle)] px-5 text-[0.9rem] font-semibold text-white"
              >
                View components
              </Link>
              <Link
                href="/layouts"
                className="inline-flex h-11 items-center rounded-full border border-[var(--border-subtle)] px-5 text-[0.9rem] font-semibold text-white"
              >
                View layouts
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center rounded-full bg-[var(--action-primary)] px-5 text-[0.9rem] font-semibold !text-[var(--action-text)]"
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
