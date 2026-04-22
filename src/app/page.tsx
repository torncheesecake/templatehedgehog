import Image from "next/image";
import {
  ArrowRight,
  FileCode2,
} from "lucide-react";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { TrackEventOnVisible } from "@/components/analytics/TrackEventOnVisible";
import { TrackableLink } from "@/components/analytics/TrackableLink";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { getEmailWorkflowBySlug, getFeaturedEmailWorkflows } from "@/data/workflows";
import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  WORKFLOW_COUNT,
} from "@/lib/pack";
import { cn } from "@/lib/utils";

const mjmlSnippet = `<mj-section padding="24px">
  <mj-column>
    <mj-text>Reset your password</mj-text>
    <mj-button href="{{auth.reset_url}}">Reset now</mj-button>
  </mj-column>
</mj-section>`;

const htmlSnippet = `<table role="presentation" width="100%">
  <tr>
    <td style="padding:24px;">
      <a href="{{auth.reset_url}}">Reset now</a>
    </td>
  </tr>
</table>`;

const heroTrustPoints = [
  "One payment - no subscription",
  "Instant download",
  "MJML + compiled HTML",
  "Use across client projects",
] as const;

export default function Home() {
  const pageWidth = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";
  const primaryButton =
    "inline-flex h-12 items-center rounded-[0.95rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-6 text-[0.88rem] font-semibold !text-[var(--action-text)] shadow-[0_16px_40px_rgba(201,167,77,0.28),0_4px_14px_rgba(15,23,32,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--action-primary-hover)] hover:shadow-[0_22px_56px_rgba(201,167,77,0.34),0_8px_22px_rgba(15,23,32,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2";
  const secondaryButton =
    "inline-flex h-12 items-center rounded-[0.95rem] border border-slate-700 bg-slate-900/90 px-6 text-[0.88rem] font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2";
  const mappingWorkflow =
    getEmailWorkflowBySlug("onboarding") ?? getFeaturedEmailWorkflows(1)[0];

  const mappingPath = mappingWorkflow
    ? `workflow/${mappingWorkflow.slug} -> layout/${mappingWorkflow.linkedLayoutSlug} -> component/${mappingWorkflow.componentStack[0]?.componentSlug ?? "hero-overlay-modern"} -> compiled/${mappingWorkflow.slug}.html`
    : "workflow/onboarding -> layout/saas-welcome-system -> component/header-brand-row -> compiled/onboarding.html";

  return (
    <main className="min-h-screen bg-[#07111f] text-slate-300 [font-family:Arial,sans-serif]">
      <SiteTopBar theme="hero" heroTone="neutral" ctaHref="/pricing" ctaLabel="Buy now - £79" />
      <TrackEventOnMount event="homepage_view" payload={{ source: "homepage" }} />
      <TrackEventOnVisible
        targetId="core-definition"
        event="workflows_section_view"
        payload={{ source: "homepage" }}
      />
      <TrackEventOnVisible
        targetId="technical-proof"
        event="technical_proof_view"
        payload={{ source: "homepage" }}
      />
      <TrackEventOnVisible
        targetId="pricing-cta"
        event="pricing_section_view"
        payload={{ source: "homepage" }}
      />

      <section className="relative overflow-hidden border-b border-slate-800/70 bg-[radial-gradient(circle_at_82%_12%,rgba(59,130,246,0.18),transparent_42%),radial-gradient(circle_at_14%_82%,rgba(30,64,175,0.12),transparent_36%),linear-gradient(180deg,#091423_0%,#07111f_62%,#07111f_100%)] py-28">
        <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-px w-[34rem] max-w-[78vw] bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        <div className="pointer-events-none absolute right-[9%] top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className={pageWidth}>
          <div className="grid gap-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
            <div className="max-w-[42rem]">
              <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-400">
                Hedgehog Core
              </p>
              <h1
                className={cn(
                  "mt-6 max-w-3xl text-[3.1rem] font-semibold leading-[0.88] text-white sm:text-[4.45rem] lg:text-[5.15rem]",
                )}
              >
                Rebuilding email code is the bottleneck. Stop doing it.
              </h1>
              <p className="mt-5 max-w-3xl text-[1.05rem] leading-8 text-slate-300">
                Rebuild cycles create drift, repeated QA failures, and slow handoff. Hedgehog Core removes that reset and gives one production path from workflow to output.
              </p>

              <div className="mt-14 flex flex-wrap items-center gap-3.5">
                <TrackableLink
                  href="/pricing"
                  event="hero_primary_cta_click"
                  payload={{ source: "hero" }}
                  className={cn(primaryButton, "gap-2")}
                >
                  Buy Hedgehog Core - £79 and ship today
                  <ArrowRight className="h-4 w-4" />
                </TrackableLink>
                <TrackableLink
                  href="#technical-proof"
                  event="hero_secondary_cta_click"
                  payload={{ source: "hero" }}
                  className={secondaryButton}
                >
                  Inspect the files
                </TrackableLink>
              </div>

              <p className="mt-8 text-[0.84rem] leading-7 text-slate-400">
                {heroTrustPoints.join(" • ")}
              </p>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-0 -z-10 translate-y-6 rounded-[2.25rem] bg-[radial-gradient(circle_at_55%_40%,rgba(59,130,246,0.18),transparent_54%)] blur-3xl" />
              <article className="relative overflow-hidden rounded-[1.85rem] border border-slate-700/80 bg-slate-900/95 shadow-[0_34px_90px_rgba(2,6,23,0.62),0_18px_40px_rgba(59,130,246,0.14)] ring-1 ring-white/[0.035] backdrop-blur-sm">
              <div className="relative aspect-[5/4] overflow-hidden">
                {mappingWorkflow ? (
                  <Image
                    src={mappingWorkflow.previewImageUrl}
                    alt={`${mappingWorkflow.title} production preview`}
                    fill
                    sizes="(max-width: 1280px) 90vw, 42vw"
                    className="object-cover object-top"
                  />
                ) : null}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_14%,rgba(59,130,246,0.18),transparent_42%),linear-gradient(180deg,rgba(7,17,31,0)_0%,rgba(7,17,31,0.06)_58%,rgba(7,17,31,0.24)_100%)]" />
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.045] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/88 to-transparent px-6 pb-6 pt-14">
                  <p className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-slate-300">
                    workflow → layout → components → compiled output
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-[0.8rem] text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <FileCode2 className="h-4 w-4 text-blue-400" />
                  MJML source + compiled HTML
                </span>
                <span className="text-slate-400">{mappingWorkflow?.slug ?? "onboarding"}</span>
              </div>
            </article>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_52%),linear-gradient(180deg,#07111f_0%,#081320_100%)] py-32">
        <div className={pageWidth}>
          <div className="mx-auto max-w-[54rem]">
            <p className="text-[0.95rem] font-semibold tracking-[0.012em] text-slate-400">
              Why teams move to a system
            </p>
            <h2
              className={cn(
                "mt-6 text-[2.55rem] font-semibold leading-[0.95] text-white sm:text-[3.7rem]",
              )}
            >
              Production email is slow because teams keep restarting structure.
            </h2>
            <ul className="mt-8 max-w-3xl space-y-2 text-[1rem] leading-8 text-slate-300">
              <li>Same campaigns rebuilt again and again.</li>
              <li>QA catches the same breakages every cycle.</li>
              <li>Handoff slows down at the point you need to ship.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="core-definition" className="border-y border-slate-800 bg-[linear-gradient(180deg,#0b1728_0%,#0a1524_100%)] py-28">
        <div className={pageWidth}>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-start">
            <div className="max-w-3xl">
              <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-400">
                What Hedgehog Core is
              </p>
              <h2
                className={cn(
                  "mt-5 text-[2.2rem] font-semibold leading-[0.94] text-white sm:text-[3rem]",
                )}
              >
                A production MJML system for teams that need repeatable output
              </h2>
              <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-slate-300">
                One pack. One decision. No repeated setup across projects.
              </p>

              <div className="mt-10 space-y-4 text-[0.98rem] leading-8 text-slate-300">
                <p><span className="font-semibold text-white">{COMPONENT_COUNT} components, {LAYOUT_COUNT} layouts, {WORKFLOW_COUNT} workflows.</span></p>
                <p><span className="font-semibold text-white">MJML source + compiled HTML</span> keeps QA and ESP handoff aligned.</p>
              </div>
            </div>

            <div className="lg:pt-1">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Included
              </p>
              <ul className="mt-5 space-y-3 text-[0.95rem] leading-7 text-slate-300">
                <li>Versioned updates and changelog</li>
                <li>Practical docs for client behaviour and handoff</li>
                <li>Commercial licence for project delivery</li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-2.5 text-[0.84rem] font-semibold">
                <TrackableLink
                  href="/docs"
                  event="docs_click"
                  payload={{ source: "core_definition" }}
                  className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900/90 px-4 text-slate-100 transition hover:border-slate-600"
                >
                  Documentation
                </TrackableLink>
                <TrackableLink
                  href="/changelog"
                  event="changelog_click"
                  payload={{ source: "core_definition" }}
                  className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900/90 px-4 text-slate-100 transition hover:border-slate-600"
                >
                  Changelog
                </TrackableLink>
                <TrackableLink
                  href="/pricing"
                  event="licence_click"
                  payload={{ source: "core_definition" }}
                  className="inline-flex h-10 items-center rounded-[0.75rem] border border-slate-700 bg-slate-900/90 px-4 text-slate-100 transition hover:border-slate-600"
                >
                  Licence and pricing
                </TrackableLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="technical-proof" className="border-y border-slate-800 bg-[linear-gradient(180deg,#07111f_0%,#08111d_100%)] py-28">
        <div className={pageWidth}>
          <div className="max-w-3xl">
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-400">
              Technical proof
            </p>
            <h2
              className={cn(
                "mt-5 text-[2.2rem] font-semibold leading-[0.94] text-white sm:text-[3rem]",
              )}
            >
              This is what you ship, not what you build
            </h2>
          </div>

          <article className="mt-14 overflow-hidden rounded-[1.6rem] border border-slate-700/80 bg-slate-900/95 shadow-[0_28px_76px_rgba(2,6,23,0.4)] ring-1 ring-white/[0.03]">
            <div className="grid lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
              <div className="p-6 sm:p-8">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-300">
                  MJML to compiled HTML
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-300">
                      MJML source
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded-[1rem] bg-[#07111f] p-3 text-[0.72rem] leading-6 text-slate-300 ring-1 ring-white/[0.03]">
                      {mjmlSnippet}
                    </pre>
                  </div>
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-300">
                      Compiled HTML
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded-[1rem] bg-[#07111f] p-3 text-[0.72rem] leading-6 text-slate-300 ring-1 ring-white/[0.03]">
                      {htmlSnippet}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 p-6 sm:p-8 lg:border-l lg:border-t-0">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-slate-300">
                  Pack structure and mapping
                </p>
                <pre className="mt-4 overflow-x-auto text-[0.8rem] leading-7 text-slate-200">
{`workflows/
layouts/
components/
compiled/*.html
docs/
mjml.config`}
                </pre>
                <p className="mt-4 text-[0.86rem] leading-7 text-slate-300">
                  {mappingPath}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="pricing-cta" className="border-t border-slate-800 bg-[linear-gradient(180deg,#0b1728_0%,#09131f_100%)] py-28">
        <div className={pageWidth}>
          <div className="mx-auto max-w-[44rem] text-center">
            <h2
              className={cn(
                "text-[2.35rem] font-semibold leading-[0.95] text-white sm:text-[3.1rem]",
              )}
            >
              Buy Hedgehog Core - £79
            </h2>
            <p className="mt-4 mx-auto max-w-3xl text-[1rem] leading-8 text-slate-300">
              Stop rebuilding and start shipping today with structured workflows and compiled output.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-2.5">
              <TrackableLink
                href="/pricing"
                event="final_cta_click"
                payload={{ source: "final_cta" }}
                className={cn(primaryButton, "gap-2")}
              >
                Buy now - £79 and start shipping
                <ArrowRight className="h-4 w-4" />
              </TrackableLink>
              <TrackableLink
                href="/workflows"
                event="hero_tertiary_cta_click"
                payload={{ source: "final_cta" }}
                className={secondaryButton}
              >
                Browse workflows
              </TrackableLink>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter flush theme="dark" />
    </main>
  );
}
