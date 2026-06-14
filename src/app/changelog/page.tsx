import type { Metadata } from "next";
import Link from "next/link";
import { TEMPLATE_CONFIG } from "@/config/template";
import {
  CHANGELOG,
  PACK_LAST_UPDATED,
  PACK_VERSION,
  formatVersionDate,
  type ChangelogEntry,
} from "@/lib/versioning";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FeatureBlock, V2PageHero, V2Section } from "@/components/site/V2Primitives";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Changelog",
  description:
    `Release history for the ${TEMPLATE_CONFIG.brandName} production email system.`,
  path: "/changelog",
  keywords: [
    "Template Hedgehog changelog",
    "MJML release history",
    "email system updates",
  ],
});

function byReverseChronologicalDate(a: ChangelogEntry, b: ChangelogEntry): number {
  const aDate = new Date(a.date).getTime();
  const bDate = new Date(b.date).getTime();

  const safeA = Number.isNaN(aDate) ? 0 : aDate;
  const safeB = Number.isNaN(bDate) ? 0 : bDate;

  return safeB - safeA;
}

const updateConfidenceItems = [
  {
    title: "Versioned archive",
    copy: `The current archive is v${PACK_VERSION}, last updated ${formatVersionDate(PACK_LAST_UPDATED)}. Version files and changelog metadata ship with the download.`,
  },
  {
    title: "Update windows are commercial",
    copy: "Core includes standard fixes for the purchased archive version. Pro includes 6 months of versioned updates. Team includes 12 months plus priority support.",
  },
  {
    title: "Renewal does not lock the files",
    copy: "When an update window ends, the purchased archive remains yours inside the licence terms. Renewal is about future versions, support priority, and whether Team-level reuse rights are now needed.",
  },
  {
    title: "Changes are implementation-facing",
    copy: "Release notes track source, compiled output, docs, sample-pack, delivery, checkout, and archive structure changes rather than cosmetic marketing updates.",
  },
] as const;

export default function ChangelogPage() {
  const entries = [...CHANGELOG].sort(byReverseChronologicalDate);

  return (
    <main className="th-page th-monochrome">
      <SiteTopBar theme="hero" ctaTone="inverse" />
      <JsonLd
        id="changelog-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Changelog", path: "/changelog" },
        ])}
      />
      <V2PageHero
        title="Version history for the production archive."
        copy="Use the changelog to judge whether the archive is maintained like production infrastructure: source, compiled output, documentation, sample-pack, checkout, delivery, and version metadata are tracked with the newest release notes first."
        actions={[
          { href: "/pricing#pro", label: "Buy Pro - £179", primary: true },
          { href: "/support", label: "Review support" },
        ]}
        compact
      />

      <V2Section
        title="Updates reduce implementation risk."
        copy="A production email archive should not feel like a static download. The buyer needs to know what version they have, what changes over time, and which edition covers future updates."
        surface="surface"
      >
        <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">
          {updateConfidenceItems.map((item) => (
            <FeatureBlock key={item.title} title={item.title} copy={item.copy} />
          ))}
        </div>
      </V2Section>

      <V2Section>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">
                Current release
              </p>
              <h2 className="mt-2 text-[1.65rem] font-semibold text-[var(--text-primary)]">
                v{PACK_VERSION}
              </h2>
              <p className="mt-2 text-[0.95rem] leading-7 text-[var(--text-secondary)]">
                Last updated {formatVersionDate(PACK_LAST_UPDATED)}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/docs" className="th-btn th-btn-sm th-btn-secondary">
                Implementation docs
              </Link>
              <Link href="/pricing#pro" className="th-btn th-btn-sm th-btn-primary">
                Compare editions
              </Link>
            </div>
          </div>
          <ol
            aria-label={`${TEMPLATE_CONFIG.brandName} changelog entries`}
            className="space-y-3"
          >
            {entries.map((entry) => (
              <li key={`${entry.date}-${entry.title}`}>
                <article className="border-t border-[var(--border-subtle)] py-6">
                  <p className="th-metric-title !text-[var(--identity-source)]">
                    <time dateTime={entry.date}>{formatVersionDate(entry.date)}</time>
                  </p>
                  <h2 className="mt-2 text-[1.35rem] leading-snug text-[var(--text-primary)]">
                    {entry.title}
                  </h2>
                  <ul className="mt-4 space-y-2 text-[0.97rem] leading-7 text-[var(--text-secondary)]">
                    {entry.bulletPoints.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--identity-source)]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
      </V2Section>
      <SiteFooter />
    </main>
  );
}
