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
import {
  MjmlHtmlSplitView,
  WorkflowFlowDiagram,
  WorkflowStackVisual,
} from "@/components/site/ProductVisuals";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { visualSystem } from "@/components/site/visualSystem";
import { MJML_PACK_NAME } from "@/lib/pack";
import { getPackById } from "@/lib/packCatalog";
import { isStripeConfigured } from "@/lib/stripe-server";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

const fallbackFlowSteps = [
  {
    label: "Trigger",
    detail: "Event starts the workflow.",
  },
  {
    label: "Layout",
    detail: "Structure is set from linked layout.",
  },
  {
    label: "Components",
    detail: "Ordered blocks define content and actions.",
  },
  {
    label: "Output",
    detail: "Compiled HTML is ready for QA and ESP import.",
  },
] as const;

const mjmlSnippet = `<mj-section padding="24px">
  <mj-column>
    <mj-text>{{user.first_name}}, action required</mj-text>
    <mj-button href="{{action.url}}">Continue</mj-button>
  </mj-column>
</mj-section>`;

const htmlSnippet = `<table role="presentation" width="100%">
  <tr>
    <td style="padding:24px;">
      <a href="{{action.url}}">Continue</a>
    </td>
  </tr>
</table>`;

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
  const VS = visualSystem;

  if (!workflow) {
    notFound();
  }

  const corePack = getPackById("pack-1");
  const stripeReady = process.env.STATIC_EXPORT !== "true" && isStripeConfigured();

  const mappingSteps = [
    `workflow/${workflow.slug}`,
    `layout/${workflow.linkedLayoutSlug}`,
    ...workflow.componentStack.slice(0, 3).map((item) => `component/${item.componentSlug}`),
  ];

  const workflowFlowSteps = [
    {
      label: "Trigger",
      detail: workflow.trigger,
    },
    {
      label: "Goal",
      detail: workflow.goal,
    },
    ...fallbackFlowSteps.slice(2),
  ];

  return (
    <main className="min-h-screen bg-(--surface-strong) text-(--th-body-copy)">
      <SiteTopBar theme="hero" ctaHref="/pricing" ctaLabel="Get Hedgehog Core - £79" />
      <TrackEventOnMount
        event="view_workflow_detail"
        payload={{ workflowSlug: workflow.slug }}
      />

      <section className={cn(VS.widths.page, VS.sections.types.hero)}>
        <article className={VS.sections.intros.wideSplit}>
          <div className={VS.sections.intros.fullWidth}>
            <p className="text-[1rem] font-semibold uppercase tracking-[0.1em] text-(--accent-support)">
              Workflow reference
            </p>
            <h1 className="mt-4 text-[2.5rem] font-semibold leading-[0.98] text-(--text-primary-dark) sm:text-[3.4rem]">
              {workflow.title}
            </h1>
            <p className="mt-5 max-w-[64ch] text-[1.08rem] leading-8 text-(--th-body-copy)">
              {workflow.summary}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.95rem] text-(--th-body-copy)">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                Linked layout: {workflow.linkedLayoutTitle}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                {workflow.componentStack.length} ordered components
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                Source file: {workflow.sourceFile}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link href="/workflows" className={VS.buttons.secondaryDark}>
                All workflows
              </Link>
              <Link href={`/layouts/${workflow.linkedLayoutSlug}`} className={VS.buttons.secondaryDark}>
                View layout
              </Link>
              <TrackableLink
                href={`/pricing?source=workflow_detail&workflow=${workflow.slug}`}
                event="workflow_to_pricing"
                payload={{ source: "workflow_detail", workflowSlug: workflow.slug }}
                className={cn(VS.buttons.primaryLarge, "gap-2 shadow-[0_18px_34px_rgba(0,0,0,0.28)]")}
              >
                Get Hedgehog Core - £79
                <ArrowRight className="h-4 w-4" />
              </TrackableLink>
            </div>
          </div>

          <div className="grid gap-5">
            <aside className="rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) p-5 sm:p-6">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
                Linked layout preview
              </p>
              <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-[0.9rem] border border-(--surface-line) bg-(--bg-soft)">
                <Image
                  src={workflow.previewImageUrl}
                  alt={`${workflow.linkedLayoutTitle} preview`}
                  fill
                  sizes="(max-width: 1024px) 94vw, 42vw"
                  className="object-cover object-top"
                />
              </div>
              <p className="mt-4 text-[0.95rem] leading-7 text-(--th-body-copy)">
                This workflow is built on the {workflow.linkedLayoutTitle} layout and expands through the same reusable
                component registry.
              </p>
            </aside>

            <WorkflowFlowDiagram
              title="Workflow at a glance"
              subtitle="Trigger, intent, and delivery path"
              steps={workflowFlowSteps.slice(0, 4)}
              className="shadow-[0_18px_34px_rgba(0,0,0,0.26)]"
            />
          </div>
        </article>
      </section>

      <section className={cn("border-y border-(--border-light) bg-(--bg-soft)", VS.sections.types.proof)}>
        <div className={VS.widths.page}>
          <div className={VS.sections.intros.fullWidth}>
            <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--text-secondary-light)">Technical proof</p>
            <h2 className="mt-3 max-w-[18ch] text-[2rem] font-semibold leading-[0.95] text-(--text-primary-light) sm:text-[2.46rem]">
              Source and output shown in one place
            </h2>
            <p className="mt-4 max-w-[72ch] text-[1rem] leading-8 text-(--text-secondary-light)">
              Verify the workflow structure, inspect source patterns, and confirm how it maps to compiled output before you
              start implementation.
            </p>
          </div>

          <div className={cn(VS.sections.intros.contentGap, VS.sections.layouts.proofCombo)}>
            <MjmlHtmlSplitView
              title="MJML to compiled HTML"
              mjml={mjmlSnippet}
              html={htmlSnippet}
              className="border-(--border-light) bg-(--bg-soft-elevated) shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
            />
            <WorkflowStackVisual
              title="Workflow to component mapping"
              description={`${workflow.title} maps directly to layout and ordered component sequence.`}
              steps={mappingSteps}
              imageUrl={workflow.previewImageUrl}
              imageAlt={`${workflow.title} mapping preview`}
              className="border-(--border-light) bg-(--bg-soft-elevated) shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
            />
          </div>
        </div>
      </section>

      <section className={cn("border-b border-(--surface-line) bg-(--surface-soft)", VS.sections.types.feature)}>
        <div className={VS.widths.page}>
          <section className={VS.sections.layouts.pair}>
            <article className="surface-card-soft p-6 sm:p-7">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Overview</p>
              <h2 className="mt-2 text-[1.56rem] font-semibold text-(--text-primary-dark)">Trigger</h2>
              <p className="mt-4 text-[1rem] leading-8 text-(--th-body-copy)">
                {workflow.trigger}
              </p>
            </article>
            <article className="surface-card-soft p-6 sm:p-7">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Overview</p>
              <h2 className="mt-2 text-[1.56rem] font-semibold text-(--text-primary-dark)">Goal</h2>
              <p className="mt-4 text-[1rem] leading-8 text-(--th-body-copy)">
                {workflow.goal}
              </p>
            </article>
          </section>

          <section className="section-breath border-t border-(--surface-line) pt-10">
            <div className={VS.sections.intros.fullWidth}>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Structure</p>
              <h2 className="mt-2 text-[1.62rem] font-semibold text-(--text-primary-dark)">Layout and component stack</h2>
              <p className="mt-4 max-w-[72ch] text-[1rem] leading-8 text-(--th-body-copy)">
                This workflow uses the <strong>{workflow.linkedLayoutTitle}</strong> layout. Keep this order unless a
                variant needs a clear structural change.
              </p>
            </div>

            <ol className="mt-6 grid gap-4 md:grid-cols-2">
              {workflow.componentStack.map((item) => (
                <li key={`${workflow.slug}-${item.componentSlug}`} className="surface-card-soft p-5">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--hedgehog-core-blue-deep) text-[0.82rem] font-bold text-(--text-primary-dark)">
                      {item.order}
                    </span>
                    <div>
                      <Link
                        href={`/components/${item.componentSlug}`}
                        className="text-[1rem] font-semibold text-(--text-primary-dark) underline-offset-2 transition hover:text-(--accent-support) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
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
        </div>
      </section>

      <section className={cn("border-y border-(--border-light) bg-(--bg-soft)", VS.sections.types.feature)}>
        <div className={VS.widths.page}>
          <section>
            <div className={VS.sections.intros.fullWidth}>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--text-secondary-light)">Data contract</p>
              <h2 className="mt-2 text-[1.62rem] font-semibold text-(--text-primary-light)">Required merge variables</h2>
            </div>
            <div className="mt-5 overflow-x-auto rounded-[0.95rem] border border-(--border-light) bg-(--bg-soft-elevated) p-5 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
              <table className="min-w-full text-left text-[0.94rem]">
                <thead>
                  <tr className="border-b border-(--border-light) text-(--text-primary-light)">
                    <th scope="col" className="pb-2 pr-4 font-semibold">Field</th>
                    <th scope="col" className="pb-2 pr-4 font-semibold">Purpose</th>
                    <th scope="col" className="pb-2 font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {workflow.requiredFields.map((field) => (
                    <tr key={`${workflow.slug}-${field.field}`} className="border-b border-(--border-light) last:border-b-0">
                      <td className="py-2 pr-4 font-semibold text-(--text-primary-light)">{field.field}</td>
                      <td className="py-2 pr-4 text-(--text-secondary-light)">{field.description}</td>
                      <td className="py-2 text-(--text-secondary-light)">{field.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="section-breath grid gap-6 lg:grid-cols-2">
            <article className="rounded-[1rem] border border-(--border-light) bg-(--bg-soft-elevated) p-6 shadow-[0_12px_24px_rgba(15,23,42,0.08)] sm:p-7">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--text-secondary-light)">Variants</p>
              <h2 className="mt-2 text-[1.48rem] font-semibold text-(--text-primary-light)">Alternative states</h2>
              <ul className="mt-5 space-y-3.5">
                {workflow.variants.map((variant) => (
                  <li key={`${workflow.slug}-${variant.title}`} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                    <span className="text-[0.96rem] leading-7 text-(--text-secondary-light)">
                      <strong className="text-(--text-primary-light)">{variant.title}.</strong>{" "}
                      {variant.description}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[1rem] border border-(--border-light) bg-(--bg-soft-elevated) p-6 shadow-[0_12px_24px_rgba(15,23,42,0.08)] sm:p-7">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--text-secondary-light)">QA risks</p>
              <h2 className="mt-2 text-[1.48rem] font-semibold text-(--text-primary-light)">Known fragile areas</h2>
              <ul className="mt-5 space-y-3.5">
                {workflow.qaRisks.map((risk) => (
                  <li key={`${workflow.slug}-${risk}`} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                    <span className="text-[0.96rem] leading-7 text-(--text-secondary-light)">{risk}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="section-breath border-t border-(--border-light) pt-10">
            <div className={VS.sections.intros.fullWidth}>
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--text-secondary-light)">Handoff steps</p>
              <h2 className="mt-2 text-[1.62rem] font-semibold text-(--text-primary-light)">MJML edit to ESP import</h2>
            </div>
            <ol className="mt-5 grid gap-4 md:grid-cols-2 text-[0.98rem] leading-7 text-(--text-secondary-light)">
              {workflow.handoffSteps.map((step, index) => (
                <li key={`${workflow.slug}-handoff-${step}`} className="rounded-[0.88rem] border border-(--border-light) bg-(--bg-soft-elevated) p-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--border-light) text-[0.82rem] font-semibold text-(--text-primary-light)">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </section>

      <section className={cn("border-b border-(--surface-line) bg-(--surface-soft)", VS.sections.types.feature)}>
        <div className={VS.widths.page}>
          <div className={VS.sections.intros.fullWidth}>
            <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">Free vs paid</p>
            <h2 className="mt-2 text-[1.62rem] font-semibold text-(--text-primary-dark)">Preview free, ship with Core</h2>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <article className="surface-card-soft p-6 sm:p-7">
              <h3 className="text-[1.2rem] font-semibold text-(--text-primary-dark)">Free reference</h3>
              <ul className="mt-4 space-y-2.5 text-[0.96rem] leading-7 text-(--th-body-copy)">
                {workflow.freeAccess.map((item) => (
                  <li key={`${workflow.slug}-free-${item}`} className="flex items-start gap-3">
                    <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-support)" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[1rem] border border-(--surface-line) bg-(--hedgehog-core-navy) p-6 shadow-[0_20px_38px_rgba(0,0,0,0.3)] sm:p-7">
              <h3 className="text-[1.2rem] font-semibold text-(--text-primary-dark)">{MJML_PACK_NAME}</h3>
              <ul className="mt-4 space-y-2.5 text-[0.96rem] leading-7 text-(--dune-muted)">
                {workflow.coreAccess.map((item) => (
                  <li key={`${workflow.slug}-core-${item}`} className="flex items-start gap-3">
                    <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-support)" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3.5">
                <TrackableLink
                  href={`/pricing?source=workflow_detail&workflow=${workflow.slug}`}
                  event="workflow_to_pricing"
                  payload={{ source: "workflow_detail", workflowSlug: workflow.slug, target: "pricing" }}
                  className={cn(VS.buttons.primaryLarge, "shadow-[0_18px_34px_rgba(0,0,0,0.3)]")}
                >
                  Get Hedgehog Core - £79
                </TrackableLink>

                {stripeReady ? (
                  <form action="/api/checkout" method="post">
                    <input type="hidden" name="productId" value={corePack.productId} />
                    <input type="hidden" name="billingCycle" value="one_off" />
                    <TrackableSubmitButton
                      label={`Buy ${MJML_PACK_NAME}`}
                      event="buy_from_workflow"
                      payload={{ source: "workflow_detail", workflowSlug: workflow.slug, packId: corePack.id }}
                      className={VS.buttons.secondaryDark}
                    />
                  </form>
                ) : null}
              </div>
            </article>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
