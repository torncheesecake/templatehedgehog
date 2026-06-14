import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  FileCode2,
  PackageOpen,
  ShieldCheck,
} from "lucide-react";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import {
  ArchiveStructureProof,
  BuildComparison,
  FounderProof,
  LicenceMatrix,
  PostPurchaseProof,
  SupportRefundPanel,
  TestingProofPanel,
  TrustProofGrid,
  ValueReceipt,
  type ValueReceiptWorkflowExample,
} from "@/components/site/V2Primitives";
import { getPricingTierById, TEMPLATE_CONFIG } from "@/config/template";
import { getEmailLayoutBySlug } from "@/data/email-layouts";
import { getEmailWorkflowBySlug } from "@/data/workflows";
import { withBasePath } from "@/lib/asset-path";
import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  STARTER_WORKFLOW_COUNT,
  WORKFLOW_COUNT,
} from "@/lib/pack";
import { createSeoMetadata, DEFAULT_SEO_DESCRIPTION } from "@/lib/seo";

const coreTier = getPricingTierById("starter");
const proTier = getPricingTierById("pro");
const teamTier = getPricingTierById("enterprise");

const workflowStages = [
  {
    step: "01",
    title: "Author",
    copy: "Start with editable MJML blocks and workflow intent, not a blank email file.",
    icon: Code2,
  },
  {
    step: "02",
    title: "Review",
    copy: "Keep trigger, audience, layout, variants, and risks attached to the send.",
    icon: ClipboardCheck,
  },
  {
    step: "03",
    title: "Compile",
    copy: "Turn source into production-safe HTML that can move into the delivery tool.",
    icon: FileCode2,
  },
  {
    step: "04",
    title: "QA",
    copy: "Check structure, mobile behaviour, client risk, fallbacks, and handoff notes.",
    icon: ShieldCheck,
  },
  {
    step: "05",
    title: "Ship",
    copy: "Hand over source, compiled output, preview, guidance, and update context.",
    icon: PackageOpen,
  },
];

const archiveItems = [
  {
    label: "MJML source",
    detail: "Editable production source files",
  },
  {
    label: "Compiled HTML",
    detail: "Delivery-ready output",
  },
  {
    label: "Rendered previews",
    detail: "Visual inspection before handoff",
  },
  {
    label: "QA notes",
    detail: "Client risks and checks",
  },
  {
    label: "Guidance",
    detail: "Implementation and setup notes",
  },
  {
    label: "Workflow examples",
    detail: "Real sends to adapt from",
  },
];

const workflowExamples = [
  {
    name: "Onboarding",
    trigger: "New user created",
    output: "Welcome, activation, and first-action send",
  },
  {
    name: "Password reset",
    trigger: "Recovery requested",
    output: "Secure transactional email with support-safe close",
  },
  {
    name: "Product launch",
    trigger: "Campaign ready",
    output: "Announcement email with hero, feature pair, and compliance footer",
  },
  {
    name: "Weekly digest",
    trigger: "Recurring editorial send",
    output: "Repeatable digest structure for updates and links",
  },
];

const platformFitTargets = [
  "Mailchimp",
  "HubSpot",
  "Salesforce",
  "NetSuite",
  "Klaviyo",
];

const templateHedgehogResponsibilities = [
  "Build",
  "Review",
  "Compile",
  "QA",
  "Handoff",
];

const emailPlatformResponsibilities = [
  "Audiences",
  "Automation",
  "Sending",
  "Reporting",
];

const compatiblePlatforms = [
  {
    name: "Mailchimp",
    note: "Prepare reviewed HTML before import. Lists, segments, automations, sends, and reporting stay in Mailchimp.",
  },
  {
    name: "HubSpot",
    note: "Use the compiled artefact for handoff into HubSpot email production. CRM data, workflows, and reporting stay in HubSpot.",
  },
  {
    name: "Salesforce",
    note: "Hand over source, compiled HTML, and QA notes for Salesforce email tooling. Setup, audiences, journeys, and reporting stay there.",
  },
  {
    name: "NetSuite",
    note: "Prepare valid HTML for NetSuite marketing campaign use. Uploading, campaign setup, lists, and sending remain customer-owned.",
  },
  {
    name: "Klaviyo",
    note: "Prepare production HTML and handoff notes before Klaviyo import. Segments, flows, delivery, and reporting stay in Klaviyo.",
  },
  {
    name: "Customer.io",
    note: "Prepare source and HTML for handoff. Journeys, profile data, delivery, and reporting stay inside Customer.io.",
  },
];

const heroProofPoints = [
  "Core from £59",
  "Pro full archive £179",
  "MJML plus compiled HTML",
  "QA and handoff notes",
] as const;

const receiptWorkflowSlugs = [
  "onboarding",
  "password-reset",
  "campaign-launch",
  "reporting",
] as const;

const editionCards = [
  {
    name: "Core",
    price: `£${coreTier.priceGbp}`,
    outcome: "Core covers the first production journeys.",
    copy: `${STARTER_WORKFLOW_COUNT} complete starter workflows for welcome, password reset, and order confirmation email, with 11 components, 3 layouts, editable MJML, compiled HTML, previews, and setup docs.`,
  },
  {
    name: "Pro",
    price: `£${proTier.priceGbp}`,
    outcome: "Pro standardises production.",
    copy: `The complete source-to-handoff archive for recurring email production: ${COMPONENT_COUNT} components, ${LAYOUT_COUNT} layouts, ${WORKFLOW_COUNT} workflows, source, compiled HTML, previews, QA notes, handoff guidance, and 6 months of updates.`,
  },
  {
    name: "Team",
    price: `£${teamTier.priceGbp}+`,
    outcome: "Team adds rights, rollout, and support.",
    copy: "Pro plus commercial reuse rights, white-label or internal deployment, reusable generation framework, priority support, and 12 months of updates.",
  },
];

export const metadata: Metadata = createSeoMetadata({
  title: `${TEMPLATE_CONFIG.brandName} | Modern email production workflow`,
  description: DEFAULT_SEO_DESCRIPTION,
  path: "/",
  keywords: [
    "modern email production workflow",
    "MJML email systems",
    "MJML source",
    "compiled HTML email",
    "email QA notes",
    "email handoff guidance",
    "lifecycle email workflows",
    "transactional email systems",
    "developer email archive",
  ],
});

function buildReceiptWorkflowExamples(): ValueReceiptWorkflowExample[] {
  return receiptWorkflowSlugs.flatMap((slug) => {
    const workflow = getEmailWorkflowBySlug(slug);
    if (!workflow) {
      return [];
    }

    return [{
      title: workflow.title,
      summary: workflow.summary,
      trigger: workflow.trigger,
      href: `/workflows/${workflow.slug}`,
      deliverables: [
        "MJML source",
        "Compiled HTML",
        `${workflow.componentStack.length} blocks`,
        `${workflow.requiredFields.length} fields`,
      ],
    }];
  });
}

function MjmlSourcePreview() {
  const tag = "text-[#7dd3fc]";
  const attr = "text-[#c4b5fd]";
  const value = "text-[#fda4af]";
  const content = "text-[#fde68a]";

  return (
    <pre className="overflow-hidden text-[0.72rem] leading-6 !text-[#eef7f1] sm:text-[0.78rem]">
      <code>
        <span className={tag}>{"<mjml>"}</span>
        {"\n  "}
        <span className={tag}>{"<mj-body "}</span>
        <span className={attr}>css-class</span>
        <span>=</span>
        <span className={value}>{'"launch"'}</span>
        <span className={tag}>{">"}</span>
        {"\n    "}
        <span className={tag}>{"<mj-section>"}</span>
        {"\n      "}
        <span className={tag}>{"<mj-column>"}</span>
        {"\n        "}
        <span className={tag}>{"<mj-text "}</span>
        <span className={attr}>mj-class</span>
        <span>=</span>
        <span className={value}>{'"eyebrow"'}</span>
        <span className={tag}>{">"}</span>
        {"\n          "}
        <span className={content}>Release bulletin</span>
        {"\n        "}
        <span className={tag}>{"</mj-text>"}</span>
        {"\n        "}
        <span className={tag}>{"<mj-text "}</span>
        <span className={attr}>mj-class</span>
        <span>=</span>
        <span className={value}>{'"h1"'}</span>
        <span className={tag}>{">"}</span>
        {"\n          "}
        <span className={content}>Launch email updates</span>
        {"\n        "}
        <span className={tag}>{"</mj-text>"}</span>
        {"\n        "}
        <span className={tag}>{"<mj-button "}</span>
        <span className={attr}>href</span>
        <span>=</span>
        <span className={value}>{'"{{cta_url}}"'}</span>
        <span className={tag}>{">"}</span>
        {"\n          "}
        <span className={content}>Review workflow</span>
        {"\n        "}
        <span className={tag}>{"</mj-button>"}</span>
        {"\n      "}
        <span className={tag}>{"</mj-column>"}</span>
        {"\n    "}
        <span className={tag}>{"</mj-section>"}</span>
        {"\n  "}
        <span className={tag}>{"</mj-body>"}</span>
        {"\n"}
        <span className={tag}>{"</mjml>"}</span>
      </code>
    </pre>
  );
}

function ShellWindow() {
  const layout = getEmailLayoutBySlug("product-launch-campaign");

  return (
    <div className="relative overflow-hidden rounded-[1.2rem] border border-black bg-black shadow-[0_36px_110px_rgba(0,0,0,0.18)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_0%,rgba(255,255,255,0.2),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.1),transparent_32%,rgba(255,255,255,0.04)_68%,transparent)]"
      />
      <div className="relative flex min-h-[4.15rem] items-start border-b border-white/[0.12] bg-[linear-gradient(90deg,#000_0%,#141414_52%,#000_100%)] py-4 pl-[5.75rem] pr-5">
        <div className="absolute left-3.5 top-3.5 hidden items-center gap-1.5 sm:flex" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] ring-1 ring-black/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] ring-1 ring-black/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] ring-1 ring-black/20" />
        </div>
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] !text-[var(--identity-source-on-dark)]">
            Production workflow
          </p>
          <p className="mt-1 text-[0.82rem] !text-[var(--text-on-structural-muted)]">
            Source, review, compile, QA, and handoff in one view
          </p>
        </div>
      </div>

      <div className="relative grid lg:grid-cols-[5.5rem_minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="hidden border-r border-white/10 bg-[linear-gradient(180deg,#111,#000)] px-3 py-5 lg:block">
          <div className="space-y-3">
            {workflowStages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.title}
                  className={`grid h-12 place-items-center border text-[0.72rem] font-semibold ${
                    index === 0
                      ? "border-white bg-white !text-black"
                      : "border-white/[0.12] bg-white/[0.04] !text-[var(--text-on-structural-muted)]"
                  }`}
                >
                  <Icon className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
                  <span className="sr-only">{stage.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-b border-white/10 bg-[linear-gradient(150deg,#050505_0%,#181818_50%,#000_100%)] p-5 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="border-l border-white/[0.22] bg-[linear-gradient(180deg,#111,#030303)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[0.72rem] font-semibold uppercase !text-[var(--identity-source-on-dark)]">
                MJML source
              </p>
              <p className="rounded-full bg-white/[0.1] px-2 py-1 text-[0.7rem] font-semibold !text-[var(--text-on-structural-muted)]">
                editable
              </p>
            </div>
            <MjmlSourcePreview />
          </div>
        </div>

        <div className="bg-[linear-gradient(145deg,#f8f8f8_0%,#fff_42%,#ededed_100%)] p-5">
          <div className="overflow-hidden border border-neutral-300 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.16)]">
            <div className="flex items-center justify-between border-b border-neutral-200 bg-[linear-gradient(180deg,#fff,#f4f4f4)] px-4 py-2.5">
              <p className="text-[0.72rem] font-semibold uppercase text-neutral-600">Rendered preview</p>
              <p className="text-[0.72rem] font-semibold text-[var(--action-primary)]">ready</p>
            </div>
            <div className="relative aspect-[16/13.5] overflow-hidden bg-white">
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-white to-transparent" />
              {layout ? (
                <Image
                  src={layout.previewImageUrl}
                  alt={`${layout.title} rendered email preview`}
                  fill
                  sizes="(max-width: 1280px) 92vw, 42vw"
                  unoptimized
                  priority
                  className="origin-top scale-[1.16] object-cover object-top"
                />
              ) : null}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="min-h-[7.75rem] border-t border-neutral-300 bg-[linear-gradient(180deg,#fff,#f7f7f7)] px-4 py-3.5">
              <p className="text-[0.72rem] font-semibold uppercase text-neutral-600">QA</p>
              <div className="mt-2 space-y-1.5 text-[0.82rem] leading-5 text-neutral-800">
                {["Mobile stack", "Fallback copy", "Footer route"].map((item) => (
                  <p key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-black" aria-hidden="true" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="min-h-[7.75rem] border-t border-black bg-[linear-gradient(180deg,#fff,#f7f7f7)] px-4 py-3.5">
              <p className="text-[0.72rem] font-semibold uppercase text-black">Handoff</p>
              <div className="mt-2 grid gap-1.5 text-[0.82rem] font-semibold text-neutral-900">
                <span>source.mjml</span>
                <span>compiled.html</span>
                <span>qa-notes.md</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlatformFitSection() {
  return (
    <section className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeader
          title="Where Template Hedgehog fits."
          copy="Template Hedgehog is not Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, or an ESP. It is the production layer before those tools: build, review, compile, QA, then hand off."
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start">
          <div className="border-y border-black bg-[var(--bg-surface)] p-5 sm:p-6">
            <p className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
              Production stack
            </p>
            <div className="mt-5">
              <div className="border border-black bg-black px-4 py-4 text-white">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[1.08rem] font-semibold !text-white">Template Hedgehog</span>
                  <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] !text-white/[0.68]">
                    production layer
                  </span>
                </div>
                <p className="mt-2 text-[0.92rem] leading-6 !text-white/[0.78]">
                  Source, preview, compiled HTML, QA notes, and handoff package.
                </p>
              </div>
              <div className="grid h-10 place-items-center text-[1.35rem] font-semibold text-[var(--text-meta)]" aria-hidden="true">
                ↓
              </div>
              <div className="border border-[var(--border-subtle)] bg-white px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[1.02rem] font-semibold text-[var(--text-primary)]">Your email platform</span>
                  <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                    delivery layer
                  </span>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {platformFitTargets.map((platform) => (
                    <span
                      key={platform}
                      className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-[0.9rem] font-semibold text-[var(--text-primary)]"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-[0.9rem] leading-6 text-[var(--text-secondary)]">
                  Audiences, consent, unsubscribe, automation, sending, delivery, and reporting stay here.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <article className="border-y border-black bg-black p-5 text-white sm:p-6">
                <p className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] !text-white/[0.66]">
                  Template Hedgehog
                </p>
                <h3 className="mt-3 text-[1.55rem] font-semibold !text-white">
                  Production before upload.
                </h3>
                <ul className="mt-5 grid gap-3 text-[1rem] font-semibold leading-7 !text-white">
                  {templateHedgehogResponsibilities.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                      <span className="!text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="border-y border-[var(--border-subtle)] bg-white p-5 sm:p-6">
                <p className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                  Email platforms
                </p>
                <h3 className="mt-3 text-[1.55rem] font-semibold text-[var(--text-primary)]">
                  Delivery after upload.
                </h3>
                <ul className="mt-5 grid gap-3 text-[1rem] font-semibold leading-7 text-[var(--text-primary)]">
                  {emailPlatformResponsibilities.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--identity-source)]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-start">
                <div>
                  <p className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                    Compatibility
                  </p>
                  <h3 className="mt-3 text-[1.42rem] font-semibold text-[var(--text-primary)]">
                    Manual handoff, not replacement.
                  </h3>
                  <p className="mt-3 text-[0.98rem] leading-7 text-[var(--text-secondary)]">
                    Compatibility means Template Hedgehog prepares production artefacts for the platform you already use. It does not run accounts, lists, automations, sends, or reports.
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {compatiblePlatforms.map((platform) => (
                    <div
                      key={platform.name}
                      className="border border-[var(--border-subtle)] bg-white px-4 py-3"
                    >
                      <p className="text-[0.95rem] font-semibold text-[var(--text-primary)]">{platform.name}</p>
                      <p className="mt-1.5 text-[0.82rem] leading-6 text-[var(--text-secondary)]">{platform.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkflowMap() {
  return (
    <div className="grid gap-0 border-y border-[var(--border-subtle)] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)] md:grid-cols-5">
      {workflowStages.map((stage, index) => {
        const Icon = stage.icon;
        return (
          <div
            key={stage.title}
            className="relative border-t border-[var(--border-subtle)] p-5 first:border-t-0 md:border-l md:border-t-0 md:first:border-l-0"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[0.86rem] font-semibold text-[var(--identity-source)]">{stage.step}</span>
              <Icon className="h-[1.375rem] w-[1.375rem] stroke-[2.2] text-[var(--identity-source)]" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-[1.25rem] font-semibold text-[var(--text-primary)]">{stage.title}</h3>
            <p className="mt-2 text-[0.9rem] leading-7 text-[var(--text-secondary)]">{stage.copy}</p>
            {index < workflowStages.length - 1 ? (
              <ArrowRight className="absolute right-5 top-6 hidden h-4 w-4 text-[var(--action-primary)] md:block" aria-hidden="true" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function SectionHeader({
  title,
  copy,
  inverse = false,
}: {
  title: string;
  copy: string;
  inverse?: boolean;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <h2 className={`font-serif text-[clamp(2rem,4.4vw,3.35rem)] font-semibold leading-[1] ${inverse ? "!text-white" : "text-[var(--text-primary)]"}`}>
        {title}
      </h2>
      <p className={`mt-4 text-[1rem] leading-8 ${inverse ? "!text-[var(--text-on-structural-muted)]" : "text-[var(--text-secondary)]"}`}>{copy}</p>
    </div>
  );
}

function EditionCard({
  edition,
  highlighted = false,
}: {
  edition: typeof editionCards[number];
  highlighted?: boolean;
}) {
  return (
    <article className={`flex min-h-full flex-col border-y p-5 ${highlighted ? "border-black bg-black text-white" : "border-[var(--border-subtle)] bg-white"}`}>
      <p className={`text-[0.78rem] font-semibold uppercase ${highlighted ? "!text-white/[0.7]" : "text-[var(--text-meta)]"}`}>{edition.outcome}</p>
      <h3 className={`mt-3 text-[1.5rem] font-semibold ${highlighted ? "!text-white" : "text-[var(--text-primary)]"}`}>{edition.name}</h3>
      <p className={`mt-2 text-[2.4rem] font-semibold leading-none ${highlighted ? "!text-white" : "text-[var(--text-primary)]"}`}>{edition.price}</p>
      <p className={`mt-4 flex-1 text-[0.94rem] leading-7 ${highlighted ? "!text-white/[0.82]" : "text-[var(--text-secondary)]"}`}>{edition.copy}</p>
      <Link href="/pricing" className={`mt-6 inline-flex items-center text-[0.9rem] font-semibold ${highlighted ? "!text-white" : "text-[var(--action-primary)]"}`}>
        Compare editions
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function Home() {
  const hedgehogMarkUrl = withBasePath("/brand/hedgehog-mark.svg");
  const receiptWorkflowExamples = buildReceiptWorkflowExamples();
  const receiptPreview = getEmailLayoutBySlug("product-launch-campaign");

  return (
    <main className="th-monochrome min-h-screen overflow-x-hidden bg-white text-black">
      <SiteTopBar theme="hero" ctaTone="inverse" />
      <TrackEventOnMount event="homepage_view" payload={{ page: "home_vision" }} />

      <section className="border-b border-[var(--border-subtle)] py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:px-12">
          <div className="min-w-0">
            <h1
              aria-label="Production email systems with handoff built in."
              className="max-w-[13.5ch] text-wrap font-serif text-[clamp(2.55rem,5.1vw,4.45rem)] font-semibold leading-[1.02] text-[var(--text-primary)]"
            >
              <span className="block">Production email{" "}</span>
              <span className="block">systems with{" "}</span>
              <span className="block">handoff built in.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[1.06rem] leading-8 text-[var(--text-secondary)]">
              Template Hedgehog gives lifecycle, transactional, and campaign emails as editable MJML, compiled HTML, previews, QA notes, and platform handoff guidance, so your ESP receives a reviewed package instead of a fragile one-off build.
            </p>
            <div className="mt-8 grid max-w-[32rem] grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/workflows?view=product"
                className="th-btn th-btn-primary w-full"
              >
                Inspect workflows
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/pricing"
                className="th-btn th-btn-secondary w-full"
              >
                Compare editions
              </Link>
            </div>
            <div className="mt-5 flex max-w-[36rem] flex-wrap gap-2">
              {heroProofPoints.map((point) => (
                <span
                  key={point}
                  className="border border-[var(--border-subtle)] bg-white px-3 py-1.5 text-[0.78rem] font-semibold text-[var(--text-secondary)]"
                >
                  {point}
                </span>
              ))}
            </div>
          </div>

          <ShellWindow />
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 sm:py-20">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-12 hidden h-32 w-32 translate-y-[22%] bg-black/[0.12] lg:block"
          style={{
            WebkitMaskImage: `url('${hedgehogMarkUrl}')`,
            maskImage: `url('${hedgehogMarkUrl}')`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionHeader
            title="How modern email production works."
            copy="The work is not choosing a pretty block. The work is keeping source, intent, output, QA, and handoff connected from the first draft to the final send."
          />
          <WorkflowMap />
        </div>
      </section>

      <section className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionHeader
            title="Why not just build it yourself?"
            copy="Free MJML, your ESP's template builder, and marketplace templates all leave the same work undone: the workflow context, the QA, the source ownership, and the handoff. Template Hedgehog ships that work with the email."
          />
          <BuildComparison />
        </div>
      </section>

      <PlatformFitSection />

      <section className="border-b border-[var(--border-subtle)] py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-12">
          <div>
            <h2 className="font-serif text-[clamp(2rem,4.4vw,3.35rem)] font-semibold leading-[1] text-[var(--text-primary)]">
              Workflow proof before file inventory.
            </h2>
            <p className="mt-4 text-[1rem] leading-8 text-[var(--text-secondary)]">
              A useful email system shows how a send moves through production. Components matter, but only after the workflow proves where they fit.
            </p>
          </div>

          <div className="grid gap-4">
            {workflowExamples.map((example) => (
              <div key={example.name} className="grid gap-4 border-t border-[var(--border-subtle)] py-5 sm:grid-cols-[0.72fr_1fr]">
                <div>
                  <p className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">
                    {example.trigger}
                  </p>
                  <h3 className="mt-2 text-[1.22rem] font-semibold text-[var(--text-primary)]">{example.name}</h3>
                </div>
                <p className="text-[0.95rem] leading-7 text-[var(--text-secondary)]">{example.output}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[var(--border-on-structural)] bg-[linear-gradient(135deg,var(--bg-structural)_0%,var(--bg-structural)_46%,var(--identity-source)_100%)] py-16 sm:py-20">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -right-6 hidden h-44 w-44 bg-white/[0.07] lg:block"
          style={{
            WebkitMaskImage: `url('${hedgehogMarkUrl}')`,
            maskImage: `url('${hedgehogMarkUrl}')`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:px-12">
          <div>
            <h2 className="font-serif text-[clamp(2rem,4.4vw,3.35rem)] font-semibold leading-[1] !text-white">
              Then the archive becomes valuable.
            </h2>
            <p className="mt-4 text-[1rem] leading-8 !text-[var(--text-on-structural-muted)]">
              The archive is not sold as a gallery. It is the production material behind the workflow: source, compiled output, previews, QA, guidance, and examples that let teams repeat the process.
            </p>
            <Link
              href="/pricing"
              className="th-btn th-btn-primary-on-dark mt-8"
            >
              See what&apos;s included
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-0 overflow-hidden border-y border-white/[0.22] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:grid-cols-2">
            {archiveItems.map((item, index) => (
              <div
                key={item.label}
                className="group min-h-[7.35rem] border-t border-white/[0.14] p-5 first:border-t-0 sm:border-l sm:p-6 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(odd)]:border-l-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[0.78rem] font-semibold !text-white/[0.65]">
                      0{index + 1}
                    </p>
                    <h3 className="mt-3 text-[1.24rem] font-semibold leading-7 !text-white">
                      {item.label}
                    </h3>
                    <p className="mt-2 text-[0.98rem] leading-7 !text-white/[0.82]">
                      {item.detail}
                    </p>
                  </div>
                  <CheckCircle2
                    className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-white/[0.75] transition group-hover:text-white"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionHeader
            title="What you actually receive."
            copy="Each edition is a handoff-ready email system: source, compiled output, preview, QA context, guidance, and workflow examples."
          />
          <ValueReceipt
            image={receiptPreview?.previewImageUrl}
            alt={receiptPreview ? `${receiptPreview.title} preview included in the Template Hedgehog pack` : undefined}
            previewHref={receiptPreview?.previewImageUrl}
            workflowExamples={receiptWorkflowExamples}
          />
        </div>
      </section>

      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionHeader
            title="Proof you can inspect before buying."
            copy="Open the previews, inspect workflow QA notes, download a sample archive, and check how the paid zip is organised before committing."
          />
          <div className="grid gap-6">
            <TrustProofGrid />
            <ArchiveStructureProof />
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionHeader
            title="Built by someone who has had to hand these files over."
            copy="Template Hedgehog comes from practical HTML email work: MJML source, compiled output, QA checks, and platform handoff pressure."
          />
          <FounderProof />
        </div>
      </section>

      <section className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionHeader
            title="What happens after purchase."
            copy="The paid archive is delivered as a tier-matched zip with source, output, previews, workflow context, documentation, version metadata, and licence guidance."
          />
          <div className="grid gap-6">
            <PostPurchaseProof />
            <TestingProofPanel />
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionHeader
            title="Choose the edition by operating need."
            copy={`Core is the essential archive starter for the first production journeys. Pro is the main buying path: the full source-to-handoff archive, ${COMPONENT_COUNT} components, ${LAYOUT_COUNT} layouts, and ${WORKFLOW_COUNT} workflows. Team is Pro plus commercial reuse, rollout support, and longer updates.`}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {editionCards.map((edition) => (
              <EditionCard key={edition.name} edition={edition} highlighted={edition.name === "Pro"} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionHeader
            title="Licence, updates, and support."
            copy="The hesitation point is usually not the files. It is whether the licence fits, how updates are accessed, and what happens if delivery fails."
          />
          <div className="grid gap-6">
            <LicenceMatrix />
            <SupportRefundPanel />
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-on-structural)] bg-black py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center lg:px-12">
          <div>
            <h2 className="font-serif text-[clamp(2rem,4.4vw,3.35rem)] font-semibold leading-[1] !text-white">
              Buy when the workflow fits.
            </h2>
            <p className="mt-4 max-w-2xl text-[1rem] leading-8 !text-white/[0.78]">
              Inspect the workflows, download the sample pack, compare the editions, then choose the archive that removes the most repeated production work.
            </p>
          </div>
          <Link
            href="/pricing"
            className="th-btn th-btn-primary-on-dark"
          >
            See what&apos;s included
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <SiteFooter flush theme="dark" ctaTone="inverse" />
    </main>
  );
}
