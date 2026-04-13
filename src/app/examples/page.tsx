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
          <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
            Route updated
          </p>
          <h1 className={cn("mt-2 text-[2rem] sm:text-[2.25rem]", VS.headings.page)}>
            Examples moved to workflows
          </h1>
          <p className="mt-3 max-w-3xl text-[1rem] leading-8 text-slate-600">
            Template Hedgehog now uses workflow-first references. Open the
            workflows index to browse onboarding, billing, reporting, and
            notification flows.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/workflows"
              className="inline-flex h-11 items-center rounded-[0.82rem] border border-rose-600 bg-rose-600 px-4 text-[0.92rem] font-semibold !text-slate-900 transition duration-200 hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
            >
              Go to workflows
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center rounded-[0.82rem] border border-slate-300 bg-[#FDFDFD] px-4 text-[0.92rem] font-semibold text-slate-900 transition duration-200 hover:border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
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
