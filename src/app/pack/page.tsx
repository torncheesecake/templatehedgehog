import type { Metadata } from "next";
import Link from "next/link";
import { emailLayoutSystems } from "@/data/email-layouts";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  LAYOUT_SYSTEM_COUNT,
  MJML_PACK_INCLUDED,
  MJML_PACK_NAME,
  MJML_PACK_PROJECT_STRUCTURE,
  WORKFLOW_COUNT,
} from "@/lib/pack";
import { PACK_LAST_UPDATED, PACK_VERSION, formatVersionDate } from "@/lib/versioning";

export const metadata: Metadata = {
  title: `What's included | ${MJML_PACK_NAME}`,
  description:
    `What is included in ${MJML_PACK_NAME}.`,
};

export default function PackPage() {
  const lastUpdatedLabel = formatVersionDate(PACK_LAST_UPDATED);

  return (
    <main className="min-h-screen text-(--th-body-copy)">
      <SiteTopBar ctaHref="/pricing" ctaLabel="View pricing" />

      <section className="relative isolate mx-auto w-full max-w-[1840px] overflow-hidden px-5 pb-24 pt-10 sm:px-8 lg:px-14 lg:pt-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[20rem] bg-[radial-gradient(circle_at_18%_18%,hsl(var(--th-accent)/0.22),transparent_52%),radial-gradient(circle_at_76%_16%,rgba(222, 210, 204,0.16),transparent_46%)]" />
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="mb-8">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--dune-muted)">
              What&apos;s included
            </p>
            <h1 className="mt-3 text-[2rem] font-semibold leading-tight sm:text-[2.45rem]">
              Inside {MJML_PACK_NAME}
            </h1>
            <p className="mt-3 max-w-[68ch] text-[1rem] leading-8 text-(--th-body-copy)">
              This page is the purchase support view for {MJML_PACK_NAME}. It shows the actual scope of the download without
              repeating component or layout catalogue pages.
            </p>
          </div>

          <article className="surface-card-soft p-5 sm:p-6">
            <dl className="grid gap-2 text-[0.92rem] text-(--th-body-copy) sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center justify-between gap-4 rounded-md bg-[rgba(251,243,240,0.92)] px-3 py-2">
                <dt>Components</dt>
                <dd className="font-semibold text-(--hedgehog-core-navy)">{COMPONENT_COUNT}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md bg-[rgba(251,243,240,0.92)] px-3 py-2">
                <dt>Layouts</dt>
                <dd className="font-semibold text-(--hedgehog-core-navy)">{LAYOUT_COUNT}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md bg-[rgba(251,243,240,0.92)] px-3 py-2">
                <dt>Workflows</dt>
                <dd className="font-semibold text-(--hedgehog-core-navy)">{WORKFLOW_COUNT}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md bg-[rgba(251,243,240,0.92)] px-3 py-2">
                <dt>Systems</dt>
                <dd className="font-semibold text-(--hedgehog-core-navy)">{LAYOUT_SYSTEM_COUNT}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md bg-[rgba(251,243,240,0.92)] px-3 py-2">
                <dt>Version</dt>
                <dd className="font-semibold text-(--hedgehog-core-navy)">v{PACK_VERSION}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md bg-[rgba(251,243,240,0.92)] px-3 py-2">
                <dt>Last updated</dt>
                <dd className="font-semibold text-(--hedgehog-core-navy)">{lastUpdatedLabel}</dd>
              </div>
            </dl>

            <ul className="mt-5 grid gap-2 text-[0.95rem] leading-7 text-(--th-body-copy)">
              {MJML_PACK_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-[0.7rem] h-1.5 w-1.5 rounded-full bg-(--accent-primary)" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {MJML_PACK_PROJECT_STRUCTURE.map((entry) => (
                <span
                  key={entry}
                  className="rounded-full border border-[hsl(var(--th-accent)/0.24)] bg-white/92 px-3 py-1 text-[0.82rem] font-semibold text-(--hedgehog-core-navy)"
                >
                  {entry}
                </span>
              ))}
            </div>
          </article>

          <div className="section-breath grid gap-5 lg:grid-cols-3">
            <section className="surface-card-soft p-5 sm:p-6">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--dune-muted)">Components</p>
              <h2 className="mt-2 text-[1.2rem] font-semibold text-(--hedgehog-core-navy)">{COMPONENT_COUNT} reusable blocks</h2>
              <p className="mt-2 text-[0.95rem] leading-7 text-(--th-body-copy)">
                Copy single blocks from the public library, then use the full local project when you need speed and consistency.
              </p>
              <Link
                href="/components"
                className="mt-3 inline-flex text-[0.92rem] font-semibold text-(--hedgehog-core-blue-deep) transition hover:text-(--hedgehog-core-navy) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              >
                Browse components
              </Link>
            </section>

            <section className="surface-card-soft p-5 sm:p-6">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--dune-muted)">Layout systems</p>
              <h2 className="mt-2 text-[1.2rem] font-semibold text-(--hedgehog-core-navy)">{LAYOUT_COUNT} full layouts</h2>
              <ul className="mt-2 space-y-1 text-[0.92rem] leading-7 text-(--th-body-copy)">
                {emailLayoutSystems.map((system) => (
                  <li key={system.slug}>{system.title}</li>
                ))}
              </ul>
              <Link
                href="/layouts"
                className="mt-3 inline-flex text-[0.92rem] font-semibold text-(--hedgehog-core-blue-deep) transition hover:text-(--hedgehog-core-navy) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              >
                Browse layouts
              </Link>
            </section>

            <section className="surface-card-soft p-5 sm:p-6">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--dune-muted)">Workflow references</p>
              <h2 className="mt-2 text-[1.2rem] font-semibold text-(--hedgehog-core-navy)">{WORKFLOW_COUNT} production workflows</h2>
              <p className="mt-2 text-[0.95rem] leading-7 text-(--th-body-copy)">
                Production workflow references are included so teams can start from trigger-based structures instead of blank files.
              </p>
              <Link
                href="/workflows"
                className="mt-3 inline-flex text-[0.92rem] font-semibold text-(--hedgehog-core-blue-deep) transition hover:text-(--hedgehog-core-navy) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              >
                Browse workflows
              </Link>
            </section>
          </div>

          <section className="section-breath border-t border-[rgba(222, 210, 204,0.16)] pt-8">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center rounded-[0.82rem] border border-(--accent-primary) bg-(--accent-primary) px-4 text-[0.9rem] font-semibold tracking-[0.01em] !text-(--surface-strong) transition duration-200 hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              >
                View pricing
              </Link>
              <Link
                href="/changelog"
                className="inline-flex h-11 items-center rounded-[0.82rem] border border-(--hedgehog-core-blue-deep) bg-transparent px-4 text-[0.9rem] font-semibold text-(--hedgehog-core-blue-deep) transition duration-200 hover:border-(--hedgehog-core-navy) hover:text-(--hedgehog-core-navy) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              >
                Read changelog
              </Link>
              <Link
                href="/docs"
                className="inline-flex h-11 items-center rounded-[0.82rem] border border-(--hedgehog-core-blue-deep) bg-transparent px-4 text-[0.9rem] font-semibold text-(--hedgehog-core-blue-deep) transition duration-200 hover:border-(--hedgehog-core-navy) hover:text-(--hedgehog-core-navy) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              >
                Read docs
              </Link>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
