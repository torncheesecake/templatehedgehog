import type { Metadata } from "next";
import { TEMPLATE_CONFIG } from "@/config/template";
import {
  CHANGELOG,
  formatVersionDate,
  type ChangelogEntry,
} from "@/lib/versioning";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { cn } from "@/lib/utils";
import { visualSystem } from "@/components/site/visualSystem";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Changelog",
  description:
    `Release history for the ${TEMPLATE_CONFIG.brandName} MJML components pack.`,
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

export default function ChangelogPage() {
  const VS = visualSystem;
  const entries = [...CHANGELOG].sort(byReverseChronologicalDate);

  return (
    <main className={cn(VS.templates.content.main, VS.surfaces.page)}>
      <SiteTopBar />
      <JsonLd
        id="changelog-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Changelog", path: "/changelog" },
        ])}
      />
      <section className={cn(VS.templates.content.frame, "pb-20")}>
        <div className={VS.templates.content.body}>
          <header className={VS.templates.content.heroCard}>
            <p className={VS.eyebrow.accent}>Release history</p>
            <h1 className={cn("mt-3 text-[2rem] sm:text-[2.3rem]", VS.headings.page)}>
              Changelog
            </h1>
            <p className={cn("mt-3 max-w-3xl", VS.body.onLight)}>
              Release notes for the pack and delivery pipeline, with newest changes first.
            </p>
          </header>

          <ol
            aria-label={`${TEMPLATE_CONFIG.brandName} changelog entries`}
            className="mt-8 space-y-3"
          >
            {entries.map((entry) => (
              <li key={`${entry.date}-${entry.title}`}>
                <article className={cn(VS.cards.light, "p-5 sm:p-6")}>
                  <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-[var(--th-text-secondary)]">
                    <time dateTime={entry.date}>{formatVersionDate(entry.date)}</time>
                  </p>
                  <h2 className="mt-2 text-[1.35rem] font-semibold text-white">
                    {entry.title}
                  </h2>
                  <ul className="mt-4 space-y-2 text-[0.97rem] leading-7 text-[var(--th-text-secondary)]">
                    {entry.bulletPoints.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--action-primary)]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
