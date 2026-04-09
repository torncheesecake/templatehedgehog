import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { createPageTitle } from "@/config/template";
import {
  emailWorkflows,
  getEmailWorkflowBySlug,
} from "@/data/workflows";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { TrackableLink } from "@/components/analytics/TrackableLink";
import { TrackableSubmitButton } from "@/components/analytics/TrackableSubmitButton";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { MJML_PACK_NAME } from "@/lib/pack";
import { getPackById } from "@/lib/packCatalog";
import { isStripeConfigured } from "@/lib/stripe-server";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return emailWorkflows.map((workflow) => ({ slug: workflow.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workflow = getEmailWorkflowBySlug(slug);

  if (!workflow) {
    return {
      title: createPageTitle("Workflow not found"),
    };
  }

  return {
    title: createPageTitle(`${workflow.title} workflow`),
    description: workflow.summary,
    openGraph: {
      title: createPageTitle(`${workflow.title} workflow`),
      description: workflow.summary,
      type: "article",
      images: [
        {
          url: workflow.previewImageUrl,
          alt: `${workflow.title} workflow preview`,
        },
      ],
    },
  };
}

export default async function WorkflowDetailPage({ params }: Props) {
  const { slug } = await params;
  const workflow = getEmailWorkflowBySlug(slug);

  if (!workflow) {
    notFound();
  }

  const corePack = getPackById("pack-1");
  const stripeReady = process.env.STATIC_EXPORT !== "true" && isStripeConfigured();

  return (
    <main className="min-h-screen text-(--th-body-copy)">
      <SiteTopBar />
      <TrackEventOnMount
        event="view_workflow_detail"
        payload={{ workflowSlug: workflow.slug }}
      />

      <section className="relative isolate mx-auto w-full max-w-[1840px] overflow-hidden rounded-[1.3rem] border border-[rgba(222,210,204,0.34)] bg-(--surface-strong) px-5 pb-20 pt-10 shadow-[0_18px_36px_rgba(20,19,43,0.2)] sm:px-8 lg:px-14 lg:pb-24 lg:pt-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[22rem] bg-[radial-gradient(circle_at_20%_18%,hsl(var(--th-accent)/0.24),transparent_52%),radial-gradient(circle_at_78%_16%,rgba(222,210,204,0.2),transparent_46%)]" />

        <article className="grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] xl:items-start">
          <div>
            <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--hedgehog-core-blue-deep)">
              Workflow reference
            </p>
            <h1 className="mt-4 text-[2.35rem] font-semibold leading-[1.02] text-(--hedgehog-core-navy) sm:text-[3.1rem]">
              {workflow.title}
            </h1>
            <p className="mt-4 max-w-[64ch] text-[1.08rem] leading-8 text-(--th-body-copy)">
              {workflow.summary}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.95rem] text-(--th-body-copy)">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-primary)" />
                Linked layout: {workflow.linkedLayoutTitle}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-primary)" />
                {workflow.componentStack.length} ordered components
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-primary)" />
                Source file: {workflow.sourceFile}
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/workflows"
                className="inline-flex h-11 items-center rounded-[0.82rem] border border-(--hedgehog-core-blue-deep) px-4 text-[0.92rem] font-semibold text-(--hedgehog-core-blue-deep) transition duration-200 hover:border-(--hedgehog-core-navy) hover:text-(--hedgehog-core-navy) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              >
                All workflows
              </Link>
              <Link
                href={`/layouts/${workflow.linkedLayoutSlug}`}
                className="inline-flex h-11 items-center rounded-[0.82rem] border border-(--hedgehog-core-blue-deep) px-4 text-[0.92rem] font-semibold text-(--hedgehog-core-blue-deep) transition duration-200 hover:border-(--hedgehog-core-navy) hover:text-(--hedgehog-core-navy) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              >
                View layout
              </Link>
              <TrackableLink
                href={`/pricing?source=workflow_detail&workflow=${workflow.slug}`}
                event="workflow_to_pricing"
                payload={{ source: "workflow_detail", workflowSlug: workflow.slug }}
                className="inline-flex h-11 items-center gap-2 rounded-[0.82rem] border border-(--accent-primary) bg-(--accent-primary) px-5 text-[0.92rem] font-semibold tracking-[0.01em] !text-(--surface-strong) transition duration-200 hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              >
                Get the full workflow system
                <ArrowRight className="h-4 w-4" />
              </TrackableLink>
            </div>
          </div>

          <aside className="rounded-[1rem] border border-[rgba(222,210,204,0.3)] bg-[#FDFDFD] p-4 sm:p-5">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
              Linked layout preview
            </p>
            <div className="relative mt-2 aspect-[16/10] overflow-hidden rounded-[0.9rem] border border-[rgba(222,210,204,0.4)] bg-[#f7e9e3]">
              <Image
                src={workflow.previewImageUrl}
                alt={`${workflow.linkedLayoutTitle} preview`}
                fill
                sizes="(max-width: 1024px) 94vw, 42vw"
                className="object-cover object-top"
              />
            </div>
            <p className="mt-3 text-[0.95rem] leading-7 text-(--th-body-copy)">
              This workflow is built on the {workflow.linkedLayoutTitle} layout and can be expanded using the same
              reusable component registry.
            </p>
          </aside>
        </article>

        <section className="section-breath grid gap-5 lg:grid-cols-2">
          <article className="surface-card-soft p-5 sm:p-6">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Overview</p>
            <h2 className="mt-2 text-[1.45rem] font-semibold text-(--hedgehog-core-navy)">Trigger</h2>
            <p className="mt-3 text-[1rem] leading-8 text-(--th-body-copy)">
              {workflow.trigger}
            </p>
          </article>
          <article className="surface-card-soft p-5 sm:p-6">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Overview</p>
            <h2 className="mt-2 text-[1.45rem] font-semibold text-(--hedgehog-core-navy)">Goal</h2>
            <p className="mt-3 text-[1rem] leading-8 text-(--th-body-copy)">
              {workflow.goal}
            </p>
          </article>
        </section>

        <section className="section-breath border-t border-[rgba(222,210,204,0.16)] pt-8">
          <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Structure</p>
          <h2 className="mt-2 text-[1.55rem] font-semibold text-(--hedgehog-core-navy)">Layout and component stack</h2>
          <p className="mt-3 max-w-[72ch] text-[1rem] leading-8 text-(--th-body-copy)">
            This workflow uses the <strong>{workflow.linkedLayoutTitle}</strong> layout. Keep this order unless a variant
            needs a clear structural change.
          </p>

          <ol className="mt-5 grid gap-3 md:grid-cols-2">
            {workflow.componentStack.map((item) => (
              <li key={`${workflow.slug}-${item.componentSlug}`} className="surface-card-soft p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--hedgehog-core-blue-deep) text-[0.82rem] font-bold text-(--surface-strong)">
                    {item.order}
                  </span>
                  <div>
                    <Link
                      href={`/components/${item.componentSlug}`}
                      className="text-[1rem] font-semibold text-(--hedgehog-core-navy) underline-offset-2 transition hover:text-(--accent-secondary) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                    >
                      {item.componentTitle}
                    </Link>
                    <p className="mt-1 text-[0.95rem] leading-7 text-(--th-body-copy)">
                      {item.notes}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section-breath border-t border-[rgba(222,210,204,0.16)] pt-8">
          <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Data contract</p>
          <h2 className="mt-2 text-[1.55rem] font-semibold text-(--hedgehog-core-navy)">Required merge variables</h2>
          <div className="mt-4 overflow-x-auto rounded-[0.95rem] border border-[rgba(222,210,204,0.2)] bg-[#FDFDFD] p-4">
            <table className="min-w-full text-left text-[0.94rem]">
              <thead>
                <tr className="border-b border-[rgba(222,210,204,0.24)] text-(--hedgehog-core-navy)">
                  <th scope="col" className="pb-2 pr-4 font-semibold">Field</th>
                  <th scope="col" className="pb-2 pr-4 font-semibold">Purpose</th>
                  <th scope="col" className="pb-2 font-semibold">Example</th>
                </tr>
              </thead>
              <tbody>
                {workflow.requiredFields.map((field) => (
                  <tr key={`${workflow.slug}-${field.field}`} className="border-b border-[rgba(222,210,204,0.16)] last:border-b-0">
                    <td className="py-2 pr-4 font-semibold text-(--hedgehog-core-navy)">{field.field}</td>
                    <td className="py-2 pr-4 text-(--th-body-copy)">{field.description}</td>
                    <td className="py-2 text-(--th-body-copy)">{field.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section-breath grid gap-5 lg:grid-cols-2">
          <article className="surface-card-soft p-5 sm:p-6">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Variants</p>
            <h2 className="mt-2 text-[1.4rem] font-semibold text-(--hedgehog-core-navy)">Alternative states</h2>
            <ul className="mt-4 space-y-3">
              {workflow.variants.map((variant) => (
                <li key={`${workflow.slug}-${variant.title}`} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-primary)" />
                  <span className="text-[0.96rem] leading-7 text-(--th-body-copy)">
                    <strong className="text-(--hedgehog-core-navy)">{variant.title}.</strong>{" "}
                    {variant.description}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="surface-card-soft p-5 sm:p-6">
            <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">QA risks</p>
            <h2 className="mt-2 text-[1.4rem] font-semibold text-(--hedgehog-core-navy)">Known fragile areas</h2>
            <ul className="mt-4 space-y-3">
              {workflow.qaRisks.map((risk) => (
                <li key={`${workflow.slug}-${risk}`} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-primary)" />
                  <span className="text-[0.96rem] leading-7 text-(--th-body-copy)">{risk}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="section-breath border-t border-[rgba(222,210,204,0.16)] pt-8">
          <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Handoff steps</p>
          <h2 className="mt-2 text-[1.55rem] font-semibold text-(--hedgehog-core-navy)">MJML edit to ESP import</h2>
          <ol className="mt-4 space-y-3 text-[0.98rem] leading-7 text-(--th-body-copy)">
            {workflow.handoffSteps.map((step, index) => (
              <li key={`${workflow.slug}-handoff-${step}`} className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--hedgehog-core-blue-deep) text-[0.82rem] font-semibold text-(--surface-strong)">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="section-breath border-t border-[rgba(222,210,204,0.16)] pt-8">
          <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Free vs paid</p>
          <h2 className="mt-2 text-[1.55rem] font-semibold text-(--hedgehog-core-navy)">Preview free, ship with Core</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <article className="surface-card-soft p-5 sm:p-6">
              <h3 className="text-[1.2rem] font-semibold text-(--hedgehog-core-navy)">Free reference</h3>
              <ul className="mt-3 space-y-2.5 text-[0.96rem] leading-7 text-(--th-body-copy)">
                {workflow.freeAccess.map((item) => (
                  <li key={`${workflow.slug}-free-${item}`} className="flex items-start gap-3">
                    <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-primary)" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[1rem] border border-[rgba(222,210,204,0.28)] bg-(--hedgehog-core-navy) p-5 sm:p-6">
              <h3 className="text-[1.2rem] font-semibold text-[#ffffff]">{MJML_PACK_NAME}</h3>
              <ul className="mt-3 space-y-2.5 text-[0.96rem] leading-7 text-(--dune-muted)">
                {workflow.coreAccess.map((item) => (
                  <li key={`${workflow.slug}-core-${item}`} className="flex items-start gap-3">
                    <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-primary)" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-3">
                <TrackableLink
                  href={`/pricing?source=workflow_detail&workflow=${workflow.slug}`}
                  event="workflow_to_pricing"
                  payload={{ source: "workflow_detail", workflowSlug: workflow.slug, target: "pricing" }}
                  className="inline-flex h-11 items-center rounded-[0.82rem] border border-(--accent-primary) bg-(--accent-primary) px-4 text-[0.9rem] font-semibold !text-(--surface-strong) transition duration-200 hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
                >
                  Get the full workflow system
                </TrackableLink>

                {stripeReady ? (
                  <form action="/api/checkout" method="post">
                    <input type="hidden" name="productId" value={corePack.productId} />
                    <input type="hidden" name="billingCycle" value="one_off" />
                    <TrackableSubmitButton
                      label={`Buy ${MJML_PACK_NAME}`}
                      event="buy_from_workflow"
                      payload={{ source: "workflow_detail", workflowSlug: workflow.slug, packId: corePack.id }}
                      className="inline-flex h-11 items-center rounded-[0.82rem] border border-[#FDFDFD] bg-[#FDFDFD] px-4 text-[0.9rem] font-semibold !text-(--hedgehog-core-navy) transition duration-200 hover:bg-[#ffffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2 focus-visible:ring-offset-(--hedgehog-core-navy)"
                    />
                  </form>
                ) : null}
              </div>
            </article>
          </div>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
