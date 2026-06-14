import type { Metadata } from "next";
import { Mail, SearchCheck } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { TEMPLATE_CONFIG } from "@/config/template";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

const pageWidth = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";

const servicePackages = [
  {
    name: "Starter Template",
    price: "£495",
    summary: "One campaign email template for a focused launch or replacement.",
    bestFor: "A single campaign, event email, offer email, or template replacement.",
    includes: [
      "one campaign email template",
      "responsive HTML",
      "NetSuite-ready structure",
      "one revision round",
    ],
  },
  {
    name: "Campaign Kit",
    price: "£1,500",
    summary: "Three campaign templates with a shared system for repeat sends.",
    bestFor: "Teams that need several campaign types to look consistent.",
    includes: [
      "three campaign templates",
      "shared header/footer system",
      "reusable content sections",
      "basic handoff notes",
    ],
    featured: true,
  },
  {
    name: "Email System",
    price: "£3,000+",
    summary: "A reusable campaign email system for teams with ongoing sends.",
    bestFor: "Marketing teams that want repeatable sections and fewer rebuilds.",
    includes: [
      "reusable campaign email system",
      "multiple layouts",
      "componentised sections",
      "implementation/handoff guide",
      "optional monthly support",
    ],
  },
];

const painPoints = [
  "emails that look dated next to your brand",
  "broken layouts after small edits",
  "poor mobile rendering",
  "slow campaign production",
  "raw HTML headaches",
  "teams stuck editing fragile templates",
];

const audienceItems = [
  "companies already using NetSuite marketing campaigns",
  "marketers who need cleaner campaign HTML",
  "teams editing raw HTML templates inside NetSuite",
  "businesses that want reusable campaign layouts without a wider implementation project",
];

const buyerGetsItems = [
  "campaign-ready HTML with valid structure",
  "responsive layout work for common mobile and desktop email contexts",
  "editable copy, image, button, and content areas",
  "clear handoff notes for upload and internal editing",
  "an optional reusable template system for repeat campaigns",
];

const leadCaptureItems = [
  "current HTML, MJML, or the closest existing template",
  "screenshots showing desktop, mobile, or broken states",
  "campaign type and next send date",
  "brand guidelines, website, or examples to match",
  "who signs off the work",
  "preferred package if you already know it",
];

const reviewOutcomeItems = [
  "whether the work is a fit for this service",
  "which package is the smallest sensible scope",
  "what assets are missing before build",
  "what is excluded from the fixed-price work",
  "whether a proposal is ready to send",
  "what the next step is to start",
];

const credibilityItems = [
  {
    title: "Practical NetSuite campaign experience",
    body:
      "The founder has working experience creating HTML email templates for NetSuite marketing campaign use. The offer stays focused on that practical template layer.",
  },
  {
    title: "Production email system behind the work",
    body:
      "Template Hedgehog provides the layout patterns, component thinking, and production workflow used to build the client templates.",
  },
  {
    title: "Clear scope before payment",
    body:
      "Each enquiry starts with the current template, campaign type, and assets so the recommendation can be a small build, a campaign kit, or no fit.",
  },
];

const fitItems = [
  "you use NetSuite marketing campaigns",
  "your templates look dated or break on mobile",
  "your team edits fragile HTML",
  "you need reusable campaign templates",
];

const notFitItems = [
  "you need full NetSuite implementation",
  "you need campaign strategy only",
  "you need CRM migration",
  "you need custom NetSuite scripting",
];

const enquiryItems = [
  "current template HTML",
  "screenshots of the current email and any broken states",
  "the type of campaign you need to send",
  "next campaign or send date",
  "brand guidelines",
  "target audience",
  "example emails you like",
  "preferred package if known",
  "who signs off the work",
];

const enquirySteps = [
  {
    title: "1. Send the useful context",
    body:
      "Share the HTML, screenshots, campaign type, campaign date, brand material, and approval owner. A rough template is enough.",
  },
  {
    title: "2. Receive a fixed-scope recommendation",
    body:
      "We confirm whether the right path is a single template, campaign kit, reusable system, or no fit, then identify any missing assets.",
  },
  {
    title: "3. Approve the proposal and start",
    body:
      "You get a short proposal with deliverables, exclusions, price, revision process, and handoff expectations before build starts.",
  },
  {
    title: "4. Build, hand off, and collect proof",
    body:
      "You receive campaign-ready HTML, editable areas, and handoff notes. After approval, we ask for feedback, testimonial permission, and approved proof where appropriate.",
  },
];

const caseStudyPlaceholders = [
  {
    title: "Template refresh",
    situation: "A marketing team has one campaign template that looks dated and breaks after small edits.",
    delivery: "Rebuild the HTML with clearer structure, responsive sections, editable image/copy areas, and one revision round.",
    proofToCollect: "Before/after screenshots, mobile rendering notes, testimonial quote, and time saved on the next edit.",
  },
  {
    title: "Campaign kit rebuild",
    situation: "A team sends newsletters, event emails, and offer emails from mismatched campaign templates.",
    delivery: "Create three templates with a shared header/footer system and reusable content sections.",
    proofToCollect: "Template consistency screenshots, handoff notes, approved quote, and reduced campaign production friction.",
  },
  {
    title: "Reusable email system",
    situation: "A business needs repeat campaign production without rebuilding the same layout from scratch.",
    delivery: "Build a reusable campaign system with multiple layouts, componentised sections, and a handoff guide.",
    proofToCollect: "Number of reusable sections, repeat-send examples, approved screenshots, and fewer layout defects after handoff.",
  },
];

const deliveryBoundaries = [
  {
    title: "What we provide",
    body:
      "Fixed-price HTML email template builds designed for NetSuite marketing campaign use, with responsive layout work, tested HTML structure, editable copy/image areas, and handoff notes.",
  },
  {
    title: "What this is not",
    body:
      "This is not NetSuite consulting, a full NetSuite implementation, or a claim to configure your wider NetSuite account.",
  },
  {
    title: "Your campaign setup",
    body:
      "Customers remain responsible for uploading templates, configuring campaigns, testing campaign records, and sending from NetSuite unless separately agreed in writing.",
  },
];

export const metadata: Metadata = createSeoMetadata({
  title: "NetSuite-Compatible Email Templates",
  description:
    "Fixed-price HTML email template builds for NetSuite marketing campaigns, powered by the Template Hedgehog production email system.",
  path: "/services/netsuite-email-templates",
  keywords: [
    "NetSuite compatible email templates",
    "NetSuite marketing campaign HTML",
    "HTML email template service",
    "responsive campaign email templates",
  ],
});

function buildMailto(subject: string, body: string): string {
  return `mailto:${TEMPLATE_CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function NetSuiteEmailTemplatesPage() {
  const reviewHref = buildMailto(
    "NetSuite email template review",
    [
      "Hi Template Hedgehog,",
      "",
      "I would like a NetSuite email template review.",
      "",
      "Current HTML/template:",
      "Screenshots:",
      "Campaign type:",
      "Next campaign/send date:",
      "Brand guidelines:",
      "Target audience:",
      "Examples of emails we like:",
      "Preferred package if known:",
      "Approval owner:",
      "What would make this project successful:",
    ].join("\n"),
  );
  const sendTemplateHref = buildMailto(
    "Current NetSuite email template for review",
    [
      "Hi Template Hedgehog,",
      "",
      "I am sending our current NetSuite email template for review.",
      "",
      "Current HTML/template:",
      "Screenshots:",
      "Campaign type:",
      "Next campaign/send date:",
      "Main issue with the current template:",
      "Brand guidelines:",
      "Target audience:",
      "Examples of emails we like:",
      "Preferred package if known:",
      "Approval owner:",
    ].join("\n"),
  );
  const fitQuestionHref = buildMailto(
    "NetSuite email template fit question",
    [
      "Hi Template Hedgehog,",
      "",
      "I am not sure whether this is a fit.",
      "",
      "How we use NetSuite campaigns:",
      "Current template problem:",
      "What we need changed:",
      "Timeline:",
      "Who approves the work:",
    ].join("\n"),
  );

  return (
    <main className="th-page">
      <SiteTopBar ctaHref="/workflows?view=product" ctaLabel="Explore Template Hedgehog" />
      <JsonLd
        id="netsuite-email-templates-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "NetSuite-Compatible Email Templates", path: "/services/netsuite-email-templates" },
        ])}
      />

      <section className="th-section th-section-roomy">
        <div className={pageWidth}>
          <div className="grid gap-9 lg:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)] lg:items-end">
            <div>
              <p className="th-eyebrow">NetSuite-Compatible Email Templates</p>
              <h1 className="th-heading-page mt-4">
                Production-ready HTML email templates for NetSuite marketing campaigns.
              </h1>
              <p className="th-lede">
                We build clean, responsive campaign HTML for teams using raw HTML templates inside NetSuite. The offer is deliberately focused: production email template work, not NetSuite implementation consulting.
              </p>
              <div className="mt-5 grid max-w-[42rem] gap-2 text-[0.88rem] font-semibold text-[var(--th-text-secondary)] sm:grid-cols-2">
                <p className="border-l border-[var(--action-primary)] pl-3">For NetSuite campaign teams</p>
                <p className="border-l border-[var(--action-primary)] pl-3">Fixed-price HTML builds</p>
                <p className="border-l border-[var(--action-primary)] pl-3">Reusable campaign sections</p>
                <p className="border-l border-[var(--action-primary)] pl-3">Clear handoff, no overclaiming</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#enquiry"
                  className="inline-flex h-12 items-center rounded-full bg-[var(--action-primary)] px-6 text-[0.94rem] font-semibold !text-[var(--action-text)] transition hover:bg-[var(--action-primary-hover)]"
                >
                  Book a template review
                  <SearchCheck className="ml-2 h-4 w-4" />
                </a>
                <a
                  href={sendTemplateHref}
                  className="inline-flex h-12 items-center rounded-full border border-[var(--border-subtle)] px-6 text-[0.92rem] font-semibold text-white"
                >
                  Send us your current NetSuite email template
                  <Mail className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>

            <aside className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
              <p className="text-[0.82rem] uppercase tracking-[0.1em] text-[var(--colour-emotional)]">
                Practical scope
              </p>
              <h2 className="mt-3 text-[1.45rem] font-semibold leading-tight text-white">
                Built for the HTML layer NetSuite expects.
              </h2>
              <p className="mt-3 text-[0.96rem] leading-7 text-[var(--th-text-secondary)]">
                NetSuite marketing templates can be created outside NetSuite as HTML files. We focus on NetSuite campaign-ready HTML, valid structure, and handoff that helps your team paste, upload, or configure with less template risk.
              </p>
              <ul className="mt-5 grid gap-2 text-[0.9rem] leading-7 text-[var(--th-text-secondary)]">
                <li className="border-l border-[var(--action-primary)] pl-3">valid html/body structure and closing tags</li>
                <li className="border-l border-[var(--action-primary)] pl-3">responsive layout for campaign sends</li>
                <li className="border-l border-[var(--action-primary)] pl-3">tested HTML structure before handoff</li>
                <li className="border-l border-[var(--action-primary)] pl-3">editable copy and image areas</li>
                <li className="border-l border-[var(--action-primary)] pl-3">cleaner handoff for marketing teams</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="th-section th-section-surface">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
            <div>
              <p className="th-eyebrow">Why trust this offer</p>
              <h2 className="th-heading-section mt-3">
                Credible because the scope is narrow.
              </h2>
              <p className="th-copy">
                The service does not pretend to be a NetSuite implementation practice. It focuses on the part we can stand behind: production HTML email template work for campaign teams.
              </p>
            </div>
            <div className="grid gap-4">
              {credibilityItems.map((item) => (
                <article key={item.title} className="border-l border-[var(--border-subtle)] pl-4">
                  <h3 className="text-[1rem] font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-[0.94rem] leading-7 text-[var(--th-text-secondary)]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="th-section">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="th-eyebrow">Who this is for</p>
              <h2 className="th-heading-section mt-3">
                Teams that already send campaigns in NetSuite and need better template production.
              </h2>
              <p className="th-copy">
                This is for marketing and operations teams who have the campaign process in place but need cleaner HTML, stronger mobile rendering, and reusable campaign layouts.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChecklistCard title="Good use cases" items={audienceItems} />
              <ChecklistCard title="What you get" items={buyerGetsItems} />
            </div>
          </div>
        </div>
      </section>

      <section className="th-section">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
            <div>
              <p className="th-eyebrow">The pain</p>
              <h2 className="th-heading-section mt-3">
                When campaign HTML is fragile, every send gets slower.
              </h2>
              <p className="th-copy">
                NetSuite campaign teams often inherit templates that were never built as a reusable email system. Small edits break layouts, mobile rendering falls behind, and marketers lose time fighting raw HTML instead of preparing the campaign.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {painPoints.map((point) => (
                <article key={point} className="border-l border-[var(--border-subtle)] pl-4">
                  <p className="text-[0.98rem] font-semibold leading-7 text-white">{point}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="th-section th-section-surface">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
            <div>
              <p className="th-eyebrow">Fit check</p>
              <h2 className="th-heading-section mt-3">
                A quick way to decide whether this is the right service.
              </h2>
              <p className="th-copy">
                The work is deliberately narrow. We help with campaign email HTML and reusable template production, not wider NetSuite administration.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChecklistCard title="Fit" items={fitItems} />
              <ChecklistCard title="Not fit" items={notFitItems} muted />
            </div>
          </div>
        </div>
      </section>

      <section className="th-section">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
            <div>
              <p className="th-eyebrow">Lead capture</p>
              <h2 className="th-heading-section mt-3">
                A useful first email is enough to turn the enquiry into a price.
              </h2>
              <p className="th-copy">
                You do not need a polished brief. The goal of the first step is to see the template problem, qualify the scope, and avoid wasting time on work that is really NetSuite implementation.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChecklistCard title="Send this" items={leadCaptureItems} />
              <ChecklistCard title="You get back" items={reviewOutcomeItems} />
            </div>
          </div>
        </div>
      </section>

      <section className="th-section">
        <div className={pageWidth}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="th-eyebrow">Fixed-price packages</p>
              <h2 className="th-heading-section mt-3">
                Choose the level of HTML template help you need.
              </h2>
            </div>
            <a
              href={reviewHref}
              className="inline-flex h-11 items-center rounded-[0.82rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-[0.9rem] font-semibold !text-[var(--action-text)]"
            >
              Book a template review
            </a>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {servicePackages.map((servicePackage) => (
              <article
                key={servicePackage.name}
                className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 data-[featured=true]:border-[var(--action-primary)]"
                data-featured={servicePackage.featured ? "true" : "false"}
              >
                {servicePackage.featured ? (
                  <p className="text-[0.78rem] uppercase tracking-[0.1em] text-[var(--colour-emotional)]">
                    Most useful for active campaign teams
                  </p>
                ) : null}
                <h3 className="mt-2 text-[1.45rem] font-semibold leading-tight text-white">
                  {servicePackage.name}
                </h3>
                <p className="mt-2 text-[2.25rem] font-semibold leading-none text-white">
                  {servicePackage.price}
                </p>
                <p className="mt-3 text-[0.94rem] leading-7 text-[var(--th-text-secondary)]">
                  {servicePackage.summary}
                </p>
                <p className="mt-3 text-[0.86rem] leading-6 text-[var(--th-text-muted)]">
                  Best for: {servicePackage.bestFor}
                </p>
                <ul className="mt-5 space-y-2 text-[0.9rem] leading-7 text-[var(--th-text-secondary)]">
                  {servicePackage.includes.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="th-section">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
            <div>
              <p className="th-eyebrow">Case-study placeholders</p>
              <h2 className="th-heading-section mt-3">
                The proof we should collect from the first projects.
              </h2>
              <p className="th-copy">
                These are not published client claims. They are the service patterns we can turn into real case studies once the first projects are delivered and approved.
              </p>
            </div>
            <div className="grid gap-4">
              {caseStudyPlaceholders.map((item) => (
                <article key={item.title} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                  <h3 className="text-[1.12rem] font-semibold text-white">{item.title}</h3>
                  <dl className="mt-4 grid gap-3 text-[0.92rem] leading-7 text-[var(--th-text-secondary)]">
                    <div>
                      <dt className="font-semibold text-white">Likely starting point</dt>
                      <dd>{item.situation}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-white">Delivery</dt>
                      <dd>{item.delivery}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-white">Proof to collect</dt>
                      <dd>{item.proofToCollect}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="th-section th-section-surface">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
            <div>
              <p className="th-eyebrow">Commercially honest scope</p>
              <h2 className="th-heading-section mt-3">
                Template production, with clear boundaries.
              </h2>
            </div>
            <div className="grid gap-4">
              {deliveryBoundaries.map((item) => (
                <article key={item.title} className="border-l border-[var(--border-subtle)] pl-4">
                  <h3 className="text-[1rem] font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-[0.94rem] leading-7 text-[var(--th-text-secondary)]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="enquiry" className="th-section">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="th-eyebrow">Enquiry brief</p>
              <h2 className="th-heading-section mt-3">
                Make the first email useful enough to price the work.
              </h2>
              <p className="th-copy">
                The fastest enquiries include the current template, the campaign type, and what keeps breaking or slowing the team down. We can then recommend the smallest sensible package.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={reviewHref}
                  className="inline-flex h-11 items-center rounded-[0.82rem] border border-[var(--action-primary)] bg-[var(--action-primary)] px-5 text-[0.9rem] font-semibold !text-[var(--action-text)]"
                >
                  Book a template review
                </a>
                <a
                  href={fitQuestionHref}
                  className="inline-flex h-11 items-center rounded-[0.82rem] border border-[var(--border-subtle)] px-5 text-[0.9rem] font-semibold text-white"
                >
                  Ask if this is a fit
                </a>
              </div>
            </div>
            <div className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
              <h3 className="text-[1.25rem] font-semibold text-white">
                Template review brief
              </h3>
              <p className="mt-3 text-[0.94rem] leading-7 text-[var(--th-text-secondary)]">
                Send whatever you have. The useful context is practical, not formal, and it helps us recommend the smallest sensible build.
              </p>
              <ul className="mt-5 space-y-2 text-[0.92rem] leading-7 text-[var(--th-text-secondary)]">
                {enquiryItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="th-section th-section-surface">
        <div className={pageWidth}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="th-eyebrow">Enquiry flow</p>
              <h2 className="th-heading-section">
                Simple process from current template to fixed-price scope.
              </h2>
              <p className="th-copy">
                We will review the HTML, campaign goal, brand fit, and likely template risks before recommending a fixed-price build or a reusable campaign system.
              </p>
            </div>
            <div className="grid gap-4">
              {enquirySteps.map((item) => (
                <article key={item.title} className="border-l border-[var(--border-subtle)] pl-4">
                  <h3 className="text-[1rem] font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-[0.94rem] leading-7 text-[var(--th-text-secondary)]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={reviewHref}
              className="inline-flex h-12 items-center rounded-full bg-[var(--action-primary)] px-6 text-[0.94rem] font-semibold !text-[var(--action-text)]"
            >
              Book a template review
            </a>
            <a
              href={sendTemplateHref}
              className="inline-flex h-12 items-center rounded-full border border-[var(--border-subtle)] px-6 text-[0.92rem] font-semibold text-white"
            >
              Send us your current NetSuite email template
            </a>
          </div>
          <p className="mt-6 max-w-4xl text-[0.84rem] leading-6 text-[var(--th-text-muted)]">
            No affiliation with Oracle NetSuite is implied. NetSuite and related marks belong to their respective owner.
          </p>
        </div>
      </section>

      <SiteFooter showPrimaryCta={false} />
    </main>
  );
}

function ChecklistCard({
  title,
  items,
  muted = false,
}: {
  title: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <article className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <h3 className="text-[1.08rem] font-semibold text-white">{title}</h3>
      <ul
        className={`mt-4 space-y-2 text-[0.92rem] leading-7 ${
          muted ? "text-[var(--th-text-muted)]" : "text-[var(--th-text-secondary)]"
        }`}
      >
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </article>
  );
}
