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
    <main className="min-h-screen text-slate-600">
      <SiteTopBar ctaHref="/pricing" ctaLabel="View pricing" />

      <section className="relative isolate mx-auto w-full max-w-7xl overflow-hidden px-5 pb-24 pt-10 sm:px-8 lg:px-12 lg:pt-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[20rem] bg-[radial-gradient(circle_at_18%_18%,hsl(var(--th-accent)/0.22),transparent_52%),radial-gradient(circle_at_76%_16%,rgba(222, 210, 204,0.16),transparent_46%)]" />
        <div className="mx-auto w-full">
          <div className="mb-8">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-slate-500">
              What&apos;s included
            </p>
            <h1 className="mt-3 text-[2rem] font-semibold leading-tight sm:text-[2.45rem]">
              Inside {MJML_PACK_NAME}
            </h1>
            <p className="mt-3 max-w-3xl text-[1rem] leading-8 text-slate-600">
              This page is the purchase support view for {MJML_PACK_NAME}. It shows the actual scope of the download without
              repeating component or layout catalogue pages.
            </p>
          </div>

          <article className="rounded-[1rem] border border-black/10 bg-white p-5 sm:p-6">
            <dl className="grid gap-2 text-[0.92rem] text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center justify-between gap-4 rounded-md bg-[rgba(251,243,240,0.92)] px-3 py-2">
                <dt>Components</dt>
                <dd className="font-semibold text-slate-900">{COMPONENT_COUNT}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md bg-[rgba(251,243,240,0.92)] px-3 py-2">
                <dt>Layouts</dt>
                <dd className="font-semibold text-slate-900">{LAYOUT_COUNT}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md bg-[rgba(251,243,240,0.92)] px-3 py-2">
                <dt>Workflows</dt>
                <dd className="font-semibold text-slate-900">{WORKFLOW_COUNT}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md bg-[rgba(251,243,240,0.92)] px-3 py-2">
                <dt>Systems</dt>
                <dd className="font-semibold text-slate-900">{LAYOUT_SYSTEM_COUNT}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md bg-[rgba(251,243,240,0.92)] px-3 py-2">
                <dt>Version</dt>
                <dd className="font-semibold text-slate-900">v{PACK_VERSION}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md bg-[rgba(251,243,240,0.92)] px-3 py-2">
                <dt>Last updated</dt>
                <dd className="font-semibold text-slate-900">{lastUpdatedLabel}</dd>
              </div>
            </dl>

            <ul className="mt-5 grid gap-2 text-[0.95rem] leading-7 text-slate-600">
              {MJML_PACK_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-[0.7rem] h-1.5 w-1.5 rounded-full bg-rose-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {MJML_PACK_PROJECT_STRUCTURE.map((entry) => (
                <span
                  key={entry}
                  className="rounded-full border border-[hsl(var(--th-accent)/0.24)] bg-white/92 px-3 py-1 text-[0.82rem] font-semibold text-slate-900"
                >
                  {entry}
                </span>
              ))}
            </div>
          </article>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            <section className="rounded-[1rem] border border-black/10 bg-white p-5 sm:p-6">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-500">Components</p>
              <h2 className="mt-2 text-[1.2rem] font-semibold text-slate-900">{COMPONENT_COUNT} reusable blocks</h2>
              <p className="mt-2 text-[0.95rem] leading-7 text-slate-600">
                Copy single blocks from the public reference, then use the full local project when you need speed and consistency.
              </p>
              <Link
                href="/components"
                className="mt-3 inline-flex text-[0.92rem] font-semibold text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              >
                Browse components
              </Link>
            </section>

            <section className="rounded-[1rem] border border-black/10 bg-white p-5 sm:p-6">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-500">Layout systems</p>
              <h2 className="mt-2 text-[1.2rem] font-semibold text-slate-900">{LAYOUT_COUNT} full layouts</h2>
              <ul className="mt-2 space-y-1 text-[0.92rem] leading-7 text-slate-600">
                {emailLayoutSystems.map((system) => (
                  <li key={system.slug}>{system.title}</li>
                ))}
              </ul>
              <Link
                href="/layouts"
                className="mt-3 inline-flex text-[0.92rem] font-semibold text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              >
                Browse layouts
              </Link>
            </section>

            <section className="rounded-[1rem] border border-black/10 bg-white p-5 sm:p-6">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-500">Workflow references</p>
              <h2 className="mt-2 text-[1.2rem] font-semibold text-slate-900">{WORKFLOW_COUNT} production workflows</h2>
              <p className="mt-2 text-[0.95rem] leading-7 text-slate-600">
                Production workflow references are included so teams can start from trigger-based structures instead of blank files.
              </p>
              <Link
                href="/workflows"
                className="mt-3 inline-flex text-[0.92rem] font-semibold text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              >
                Browse workflows
              </Link>
            </section>
          </div>

          <section className="mt-14 border-t border-black/10 pt-8">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center rounded-[0.82rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-4 text-[0.9rem] font-semibold tracking-[0.01em] !text-[var(--action-text)] transition duration-200 hover:bg-[var(--action-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
              >
                View pricing
              </Link>
              <Link
                href="/changelog"
                className="inline-flex h-11 items-center rounded-[0.82rem] border border-slate-200 bg-transparent px-4 text-[0.9rem] font-semibold text-slate-600 transition duration-200 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              >
                Read changelog
              </Link>
              <Link
                href="/docs"
                className="inline-flex h-11 items-center rounded-[0.82rem] border border-slate-200 bg-transparent px-4 text-[0.9rem] font-semibold text-slate-600 transition duration-200 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
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
