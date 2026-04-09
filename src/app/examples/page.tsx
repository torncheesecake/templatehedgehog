import Link from "next/link";
import type { Metadata } from "next";
import { createPageTitle } from "@/config/template";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { visualSystem } from "@/components/site/visualSystem";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: createPageTitle("Workflows"),
  description: "Legacy examples are now available as workflows.",
};

export default function ExamplesPage() {
  const VS = visualSystem;

  return (
    <main className={VS.templates.content.main}>
      <SiteTopBar ctaHref="/workflows" ctaLabel="View workflows" />
      <section className={VS.templates.content.frame}>
        <article className={cn(VS.templates.content.body, VS.templates.content.heroCard)}>
          <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
            Route updated
          </p>
          <h1 className={cn("mt-2 text-[2rem] sm:text-[2.25rem]", VS.headings.page)}>
            Examples moved to workflows
          </h1>
          <p className="mt-3 max-w-[64ch] text-[1rem] leading-8 text-(--th-body-copy)">
            Template Hedgehog now uses workflow-first references. Open the
            workflows index to browse onboarding, billing, reporting, and
            notification flows.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/workflows"
              className="inline-flex h-11 items-center rounded-[0.82rem] border border-(--accent-primary) bg-(--accent-primary) px-4 text-[0.92rem] font-semibold !text-(--surface-strong) transition duration-200 hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2"
            >
              Go to workflows
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center rounded-[0.82rem] border border-(--dune-muted) bg-[#FDFDFD] px-4 text-[0.92rem] font-semibold text-(--hedgehog-core-navy) transition duration-200 hover:border-(--hedgehog-core-blue-deep) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2"
            >
              Back to homepage
            </Link>
          </div>
        </article>
      </section>
      <SiteFooter />
    </main>
  );
}
