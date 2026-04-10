import type { Metadata } from "next";
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
  SystemArchitectureVisual,
  WorkflowFlowDiagram,
  WorkflowStackVisual,
} from "@/components/site/ProductVisuals";
import {
  SectionIntro,
  SectionShell,
  VisualPanel,
} from "@/components/site/SectionPrimitives";
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
    <main className="min-h-screen bg-(--surface-strong) text-(--th-body-copy) [font-family:Arial,sans-serif]">
      <SiteTopBar theme="hero" ctaHref="/pricing" ctaLabel="Get Hedgehog Core - £79" />
      <TrackEventOnMount event="view_workflow_detail" payload={{ workflowSlug: workflow.slug }} />

      <SectionShell spacing="hero" tone="canvas" width="content">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-start">
          <div>
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-(--th-body-copy)">Workflow reference</p>
            <h1 className="mt-4 max-w-[16ch] text-[2.8rem] font-semibold leading-[0.9] text-(--text-primary-dark) sm:text-[3.95rem]">
              {workflow.title}
            </h1>
            <p className="mt-5 max-w-[64ch] text-[1.05rem] leading-8 text-(--th-body-copy)">{workflow.summary}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.92rem] text-(--th-body-copy)">
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
              <TrackableLink
                href={`/pricing?source=workflow_detail&workflow=${workflow.slug}`}
                event="workflow_to_pricing"
                payload={{ source: "workflow_detail", workflowSlug: workflow.slug }}
                className={cn(VS.buttons.primaryLarge, "gap-2 shadow-[0_18px_34px_rgba(0,0,0,0.3)]")}
              >
                Get Hedgehog Core - £79
                <ArrowRight className="h-4 w-4" />
              </TrackableLink>
              <Link href="/workflows" className={VS.buttons.secondaryDark}>
                All workflows
              </Link>
              <Link href={`/layouts/${workflow.linkedLayoutSlug}`} className={VS.buttons.secondaryDark}>
                View linked layout
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            <SystemArchitectureVisual
              title="Workflow architecture"
              subtitle="Trigger to output mapping"
              workflowLabel={workflow.slug}
              layoutLabel={workflow.linkedLayoutSlug}
              componentLabels={workflow.componentStack.slice(0, 4).map((item) => item.componentSlug)}
              imageUrl={workflow.previewImageUrl}
              imageAlt={`${workflow.title} preview`}
            />
            <WorkflowFlowDiagram
              title="Workflow at a glance"
              subtitle="Trigger, goal, and delivery path"
              steps={workflowFlowSteps.slice(0, 4)}
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell spacing="proof" tone="soft" border="softBoth" width="content">
        <SectionIntro
          pattern="full"
          tone="light"
          eyebrow="Technical proof"
          title="Source and output shown in one place"
          description="Review source structure and output expectations before implementation starts."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.24fr)_minmax(0,0.76fr)]">
          <MjmlHtmlSplitView title="MJML to compiled HTML" mjml={mjmlSnippet} html={htmlSnippet} tone="soft" />
          <WorkflowStackVisual
            title="Workflow to component mapping"
            description={`${workflow.title} maps directly to layout and ordered component sequence.`}
            steps={mappingSteps}
            imageUrl={workflow.previewImageUrl}
            imageAlt={`${workflow.title} mapping preview`}
            tone="soft"
          />
        </div>
      </SectionShell>

      <SectionShell spacing="feature" tone="canvas" border="bottom" width="content">
        <SectionIntro
          pattern="split"
          eyebrow="Overview"
          title="Trigger and goal"
          description="Each workflow defines both initiating event and expected outcome so teams can align copy, logic, and QA." 
          aside={
            <VisualPanel>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">Handoff anchor</p>
              <p className="mt-2 text-[0.92rem] leading-7 text-(--th-body-copy)">
                Keep layout order intact where possible, then tailor component content for your exact event and audience.
              </p>
            </VisualPanel>
          }
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <VisualPanel>
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">Trigger</p>
            <p className="mt-3 text-[0.98rem] leading-8 text-(--th-body-copy)">{workflow.trigger}</p>
          </VisualPanel>
          <VisualPanel>
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-(--th-body-copy)">Goal</p>
            <p className="mt-3 text-[0.98rem] leading-8 text-(--th-body-copy)">{workflow.goal}</p>
          </VisualPanel>
        </div>

        <section className="section-breath border-t border-(--surface-line) pt-10">
          <SectionIntro
            pattern="full"
            eyebrow="Structure"
            title="Layout and component stack"
            titleClassName="text-[1.74rem] sm:text-[2.02rem]"
            description={`This workflow uses ${workflow.linkedLayoutTitle}. Keep this sequence stable unless a variant requires a clear structural change.`}
          />

          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {workflow.componentStack.map((item) => (
              <li key={`${workflow.slug}-${item.componentSlug}`} className="rounded-[0.94rem] border border-(--surface-line) bg-(--surface-soft) p-5 shadow-[0_12px_24px_rgba(0,0,0,0.24)]">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--hedgehog-core-blue-deep) text-[0.82rem] font-bold text-(--text-primary-dark)">
                    {item.order}
                  </span>
                  <div>
                    <Link
                      href={`/components/${item.componentSlug}`}
                      className="text-[1rem] font-semibold text-(--text-primary-dark) underline-offset-2 transition hover:text-(--accent-support) hover:underline"
                    >
                      {item.componentTitle}
                    </Link>
                    <p className="mt-1 text-[0.94rem] leading-7 text-(--th-body-copy)">{item.notes}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </SectionShell>

      <SectionShell spacing="feature" tone="soft" border="softBoth" width="content">
        <SectionIntro
          pattern="full"
          tone="light"
          eyebrow="Data contract"
          title="Required merge variables"
          titleClassName="text-[1.74rem] sm:text-[2.02rem]"
        />

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

        <div className="section-breath grid gap-6 lg:grid-cols-2">
          <VisualPanel tone="soft">
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-(--text-secondary-light)">Variants</p>
            <h2 className="mt-2 text-[1.42rem] font-semibold text-(--text-primary-light)">Alternative states</h2>
            <ul className="mt-5 space-y-3.5">
              {workflow.variants.map((variant) => (
                <li key={`${workflow.slug}-${variant.title}`} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                  <span className="text-[0.95rem] leading-7 text-(--text-secondary-light)">
                    <strong className="text-(--text-primary-light)">{variant.title}.</strong> {variant.description}
                  </span>
                </li>
              ))}
            </ul>
          </VisualPanel>

          <VisualPanel tone="soft">
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-(--text-secondary-light)">QA risks</p>
            <h2 className="mt-2 text-[1.42rem] font-semibold text-(--text-primary-light)">Known fragile areas</h2>
            <ul className="mt-5 space-y-3.5">
              {workflow.qaRisks.map((risk) => (
                <li key={`${workflow.slug}-${risk}`} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support)" />
                  <span className="text-[0.95rem] leading-7 text-(--text-secondary-light)">{risk}</span>
                </li>
              ))}
            </ul>
          </VisualPanel>
        </div>

        <section className="section-breath border-t border-(--border-light) pt-10">
          <SectionIntro
            pattern="full"
            tone="light"
            eyebrow="Handoff steps"
            title="MJML edit to ESP import"
            titleClassName="text-[1.74rem] sm:text-[2.02rem]"
          />
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
      </SectionShell>

      <SectionShell spacing="feature" tone="surface" border="bottom" width="content">
        <SectionIntro
          pattern="full"
          eyebrow="Free vs paid"
          title="Preview free, ship with Core"
          titleClassName="text-[1.74rem] sm:text-[2.02rem]"
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <VisualPanel>
            <h3 className="text-[1.2rem] font-semibold text-(--text-primary-dark)">Free reference</h3>
            <ul className="mt-4 space-y-2.5 text-[0.96rem] leading-7 text-(--th-body-copy)">
              {workflow.freeAccess.map((item) => (
                <li key={`${workflow.slug}-free-${item}`} className="flex items-start gap-3">
                  <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-support)" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </VisualPanel>

          <article className="relative overflow-hidden rounded-[1.08rem] border border-(--surface-line) bg-(--hedgehog-core-navy) p-6 shadow-[0_20px_38px_rgba(0,0,0,0.34)] sm:p-7">
            <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--th-accent-support)/0.52),transparent)]" />
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
      </SectionShell>

      <SiteFooter />
    </main>
  );
}
