import type { Metadata } from "next";
import Link from "next/link";
import { TEMPLATE_CONFIG } from "@/config/template";
import { DocsLayout, DocsSection } from "@/components/docs/DocsLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Implementation confidence centre",
  description:
    `Source-to-handoff implementation guidance for ${TEMPLATE_CONFIG.brandName} workflows, MJML source, compiled HTML, QA, and platform handoff.`,
  path: "/docs",
  keywords: [
    "MJML implementation docs",
    "compiled HTML email guidance",
    "email client QA",
    "production email documentation",
  ],
});

const inlineCodeClass =
  "rounded-[0.45rem] border border-[var(--identity-source-border)] bg-[var(--identity-source-soft)] px-1.5 py-0.5 text-[0.88em] font-medium text-[var(--identity-source)]";
const listClass = "list-disc space-y-2.5 pl-5 marker:text-[var(--action-primary)]";

const sections = [
  { id: "intro", label: "Archive model" },
  { id: "workflow", label: "Working path" },
  { id: "copy-modes", label: "Source formats" },
  { id: "outlook", label: "Outlook caveats" },
  { id: "customisation", label: "Safe customisation" },
  { id: "images", label: "Image hosting" },
  { id: "layouts-vs-components", label: "Layouts vs components" },
  { id: "esp-handoff", label: "Platform handoff" },
  { id: "compatibility", label: "Compatibility" },
  { id: "pitfalls", label: "Client pitfalls" },
];

const implementationPath = [
  ["01", "Download archive", "Keep source, compiled output, previews, QA notes, and guidance together."],
  ["02", "Choose workflow", "Start from the closest lifecycle, transactional, newsletter, or campaign package."],
  ["03", "Inspect MJML", "Review the editable source and component stack before changing structure."],
  ["04", "Compile or use HTML", "Compile from source, or use the provided compiled HTML for platform upload."],
  ["05", "Review preview", "Check the rendered layout so visual changes are caught before handoff."],
  ["06", "Complete QA", "Review links, images, mobile stacking, footer/legal copy, and merge fields."],
  ["07", "Handoff into platform", "Move the artefact into Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, or your ESP."],
];

const docsCoverage = [
  ["Getting started", "What to open first after purchase and how to pick the closest workflow."],
  ["Working with MJML", "How to treat source as the editable truth and keep changes maintainable."],
  ["Using compiled HTML", "When to use delivery-ready output for QA, approval, or platform import."],
  ["QA and rendering checks", "Outlook caveats, mobile stacking, image handling, and client pitfalls."],
  ["Platform handoff", "How to separate Template Hedgehog artefacts from ESP responsibilities."],
  ["Compatibility", "How Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, and Customer.io fit into the handoff."],
  ["Licence and updates", "Where product usage, reuse rights, and update expectations fit."],
  ["Troubleshooting", "How to identify common implementation issues before send."],
];

const platformCompatibilityNotes = [
  [
    "Mailchimp",
    "Prepare reviewed compiled HTML before import. Mailchimp still handles lists, audience segments, automations, sending, unsubscribe, and reporting.",
  ],
  [
    "HubSpot",
    "Use Template Hedgehog as source, preview, QA, and compiled-output preparation before HubSpot email production. HubSpot still owns CRM data, workflows, sending, and reporting.",
  ],
  [
    "Salesforce",
    "Hand over MJML source, compiled HTML, and QA notes for use in Salesforce email tooling. Salesforce still owns journeys, audience data, consent, delivery, and reporting.",
  ],
  [
    "NetSuite",
    "Prepare valid HTML structure for NetSuite marketing campaign use. Customers remain responsible for upload, campaign configuration, lists, sending, and reporting unless separately agreed.",
  ],
  [
    "Klaviyo",
    "Prepare production HTML and handoff notes before Klaviyo import. Klaviyo still owns segments, flows, consent, unsubscribe, delivery, and reporting.",
  ],
  [
    "Customer.io",
    "Prepare the email artefact and handoff notes before Customer.io implementation. Customer.io still owns journeys, profiles, data, delivery, and reporting.",
  ],
];

const studioAlphaPath = [
  "Choose workflow",
  "Edit content",
  "Compile MJML",
  "Preview output",
  "Complete QA",
  "Prepare handoff",
  "Export ZIP",
] as const;

function DocsHeroPanel() {
  return (
    <div className="border-y border-[var(--border-subtle)] bg-white px-4 py-5 shadow-[0_22px_65px_rgba(15,23,42,0.06)] sm:px-5">
      <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">
        Source to handoff
      </p>
      <div className="mt-4 grid gap-0">
        {["Source", "Compile", "Preview", "QA", "Handoff"].map((step, index) => (
          <div key={step} className="grid grid-cols-[2.5rem_minmax(0,1fr)] border-t border-[var(--border-subtle)] py-3 first:border-t-0">
            <span className="text-[0.78rem] font-semibold text-[var(--identity-source)]">0{index + 1}</span>
            <div>
              <h2 className="text-[1rem] font-semibold text-[var(--text-primary)]">{step}</h2>
              <p className="mt-1 text-[0.86rem] leading-6 text-[var(--text-secondary)]">
                {[
                  "Start from editable MJML and workflow intent.",
                  "Create production HTML or use the included compiled output.",
                  "Inspect the rendered artefact before it leaves the archive.",
                  "Check links, images, mobile behaviour, tokens, and legal copy.",
                  "Move the package into the sending platform with boundaries clear.",
                ][index]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocsPreface() {
  return (
    <div className="space-y-12">
      <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-6 sm:px-5">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div>
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
              Implementation pathway
            </p>
            <h2 className="mt-2 font-serif text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1] text-[var(--text-primary)]">
              What to do first after purchase.
            </h2>
            <p className="mt-4 text-[1rem] leading-8 text-[var(--text-secondary)]">
              The archive is useful when the route from source to handoff is obvious. Start with the workflow, keep source and output together, and run QA before the ESP takes over.
            </p>
          </div>
          <ol className="grid gap-4 md:grid-cols-2">
            {implementationPath.map(([number, title, copy]) => (
              <li key={number} className="border-t border-[var(--border-subtle)] pt-4">
                <p className="text-[0.76rem] font-semibold text-[var(--identity-source)]">{number}</p>
                <h3 className="mt-2 text-[1.06rem] font-semibold text-[var(--text-primary)]">{title}</h3>
                <p className="mt-2 text-[0.9rem] leading-7 text-[var(--text-secondary)]">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <div>
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
            What these guides cover
          </p>
          <h2 className="mt-2 font-serif text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1] text-[var(--text-primary)]">
            Organised by buyer problem.
          </h2>
          <p className="mt-4 text-[1rem] leading-8 text-[var(--text-secondary)]">
            The details remain technical, but the entry points follow the questions that block a team from using the archive in production.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {docsCoverage.map(([title, copy]) => (
            <article key={title} className="border-t border-[var(--border-subtle)] pt-4">
              <h3 className="text-[1.04rem] font-semibold text-[var(--text-primary)]">{title}</h3>
              <p className="mt-2 text-[0.9rem] leading-7 text-[var(--text-secondary)]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--border-subtle)] bg-white px-4 py-6 sm:px-5">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div>
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">
              Platform boundary
            </p>
            <h2 className="mt-2 font-serif text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1] text-[var(--text-primary)]">
              The archive prepares the artefact. The platform sends it.
            </h2>
            <p className="mt-4 text-[1rem] leading-8 text-[var(--text-secondary)]">
              Use these docs to prepare source, output, preview, QA, and handoff. Do not treat Template Hedgehog as a sending or automation platform.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="border-l border-[var(--identity-source-border)] pl-4">
              <h3 className="text-[1.08rem] font-semibold text-[var(--text-primary)]">Template Hedgehog handles</h3>
              <ul className="mt-3 space-y-2 text-[0.92rem] leading-7 text-[var(--text-secondary)]">
                {["MJML source", "Workflow guidance", "QA guidance", "Compiled HTML", "Preview and handoff package"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="border-l border-[var(--border-subtle)] pl-4">
              <h3 className="text-[1.08rem] font-semibold text-[var(--text-primary)]">Sending platforms handle</h3>
              <ul className="mt-3 space-y-2 text-[0.92rem] leading-7 text-[var(--text-secondary)]">
                {["Audiences and segments", "Automation", "Unsubscribe", "Consent and GDPR workflow", "Reporting and delivery"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-4 text-[0.9rem] leading-7 text-[var(--text-secondary)]">
                Examples: Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, or your ESP.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-6 sm:px-5">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div>
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">
              Template Hedgehog Studio
            </p>
            <h2 className="mt-2 font-serif text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1] text-[var(--text-primary)]">
              Future workspace direction for everything before send.
            </h2>
            <p className="mt-4 text-[1rem] leading-8 text-[var(--text-secondary)]">
              Template Hedgehog Studio is the future workspace concept for choosing workflows, editing content, compiling, previewing, QA, preparing handoff, and exporting ZIPs without adding accounts, cloud storage, integrations, or sending. It is not live product UI. The paid archive is complete without Studio and remains yours either way.
            </p>
            <Link href="/studio" className="mt-5 inline-flex th-btn th-btn-sm th-btn-secondary">
              Join Studio waitlist
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="border-t border-[var(--border-subtle)] pt-4">
              <h3 className="text-[1.04rem] font-semibold text-[var(--text-primary)]">Studio helps you</h3>
              <ul className="mt-3 space-y-2 text-[0.92rem] leading-7 text-[var(--text-secondary)]">
                {studioAlphaPath.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="border-t border-[var(--border-subtle)] pt-4">
              <h3 className="text-[1.04rem] font-semibold text-[var(--text-primary)]">Studio does not replace your ESP</h3>
              <p className="mt-3 text-[0.92rem] leading-7 text-[var(--text-secondary)]">
                Studio does not send emails, manage audiences, manage consent, handle unsubscribe, run automation, provide reporting, or connect to platform APIs. Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, or your ESP handles that work.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function DocsPage() {
  return (
    <DocsLayout
      eyebrow="Implementation confidence centre"
      title="Use the archive without guessing."
      summary="Source-to-handoff guidance for turning Template Hedgehog from downloaded files into a reviewable production email package."
      actions={[
        { href: "/workflows", label: "View workflows", primary: true },
        { href: "/sample-pack", label: "Inspect sample pack" },
      ]}
      heroPanel={<DocsHeroPanel />}
      preface={<DocsPreface />}
      navItems={sections}
    >
      <JsonLd
        id="docs-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
        ])}
      />
      <DocsSection id="intro" title="Archive model">
        <p>
          {TEMPLATE_CONFIG.brandName} is an implementation system for production email. Layout pages show complete
          workflow packages, and component pages let you inspect single blocks when one section needs source-level changes.
        </p>
        <p>
          If you are evaluating before purchase, start with the <Link href="/sample-pack">public sample pack</Link>. It
          shows one complete workflow sample with MJML source, compiled HTML, QA notes, testing notes, implementation
          guidance, workflow context, and licence reference.
        </p>
        <p>
          Template Hedgehog Studio is the future workspace direction. It is intended to help with
          everything before send, but it does not replace the ESP that manages audiences, consent, unsubscribe,
          automation, delivery, and reporting.
        </p>
        <p>
          The intended editing model is straightforward: treat MJML as the source of truth, compile to HTML when your ESP
          or review process needs final markup, and keep screenshots or previews as validation rather than the editable
          asset.
        </p>
      </DocsSection>

      <DocsSection id="workflow" title="Recommended working path">
        <p>
          A safe working pattern for most teams looks like this:
        </p>
        <ol className="list-decimal space-y-2.5 pl-5 marker:font-semibold marker:text-[var(--action-primary)]">
          <li>Start from the closest workflow or layout package, then move to component detail when needed.</li>
          <li>Edit the <span className={inlineCodeClass}>MJML</span> source rather than patching compiled HTML by hand.</li>
          <li>Compile to HTML and test the result in your delivery workflow.</li>
          <li>Run quick visual checks in Gmail, Outlook, and Apple Mail before final send.</li>
        </ol>
        <p>
          Use the compiled HTML panels when you need a delivery-ready snapshot for QA, approval, or an ESP that only
          accepts raw HTML. If you expect the block to be reused, keep your real changes in the MJML source instead.
        </p>
      </DocsSection>

      <DocsSection id="copy-modes" title="Block source and full files">
        <p>
          Component pages expose block-level source and complete files when the sources differ. Use block source when you
          are stacking multiple sections inside one existing <span className={inlineCodeClass}>mj-body</span>. Use the full
          file when you need a complete MJML document that can compile on its own.
        </p>
        <ul className={listClass}>
          <li>Block MJML is source for composing several sections into the same email.</li>
          <li>Complete MJML includes the wrapper, shared classes, and document structure required for independent compilation.</li>
          <li>Block HTML is useful for inspection and controlled assembly, but most platform handoff should use complete compiled HTML.</li>
          <li>Complete compiled HTML is the delivery-ready output for QA, import, and final review.</li>
        </ul>
      </DocsSection>

      <DocsSection id="outlook" title="Outlook rendering caveats">
        <p>
          Desktop Outlook is still the main reason email markup becomes brittle. MJML helps, but it does not make Outlook
          behave like a modern browser.
        </p>
        <ul className={listClass}>
          <li>Keep complex nesting conservative. Deeply layered sections, unusual overlaps, and fancy spacing are more likely to break.</li>
          <li>Test button padding and border radius in Outlook desktop. Small visual differences are common even when the block is valid.</li>
          <li>Avoid relying on background-image tricks for essential content or CTA clarity.</li>
          <li>Expect typography to render slightly heavier or looser than in Gmail and Apple Mail.</li>
          <li>When in doubt, prefer simpler table-safe structure over a more ambitious visual treatment.</li>
        </ul>
      </DocsSection>

      <DocsSection id="customisation" title="Safe MJML customisation patterns">
        <p>
          The safest customisation approach is to change tokens and content first, then structure only when required.
        </p>
        <ul className={listClass}>
          <li>Replace copy, links, imagery, and brand colours before altering block structure.</li>
          <li>Keep CTA labels short so buttons still read cleanly on narrow mobile clients.</li>
          <li>When swapping imagery, preserve the overall aspect ratio where possible to avoid uneven spacing.</li>
          <li>Reuse spacing values consistently instead of introducing one-off padding tweaks across multiple sections.</li>
          <li>If you need a recurring variant, duplicate the MJML block in your own codebase rather than repeatedly editing compiled HTML.</li>
        </ul>
        <p>
          A good default is to maintain your own small token map for colours, spacing, and button styles, then interpolate
          those values into the MJML before compilation.
        </p>
      </DocsSection>

      <DocsSection id="images" title="Image hosting best practices">
        <p>
          Email clients fetch images remotely, so image delivery matters as much as markup quality.
        </p>
        <ul className={listClass}>
          <li>Host production images on a stable HTTPS domain or CDN you control.</li>
          <li>Do not rely on temporary design-tool URLs or expiring preview links.</li>
          <li>Use meaningful <span className={inlineCodeClass}>alt</span> text for content images and empty alt text only for decorative ones.</li>
          <li>Optimise file sizes before send. Heavy images slow down preview loading and can affect clipping in some clients.</li>
          <li>Keep critical message copy out of images so dark mode, blocking, or accessibility settings do not hide it.</li>
        </ul>
      </DocsSection>

      <DocsSection id="layouts-vs-components" title="When to use layouts vs components">
        <p>
          Components are best when you are assembling or updating one block at a time. Layouts are best when you need a
          starting architecture for a complete send.
        </p>
        <ul className={listClass}>
          <li>Start with a component page when the job is small, such as swapping a hero, footer, CTA, or transactional panel.</li>
          <li>Start with a layout page when the whole email structure matters, including content order and message pacing.</li>
          <li>Use the component breakdown on layout pages to identify which blocks should become your editable source modules.</li>
          <li>Once a layout is close, refine its individual sections through the related component pages rather than editing blindly.</li>
        </ul>
      </DocsSection>

      <DocsSection id="esp-handoff" title="Platform handoff guidance">
        <p>
          Some teams hand compiled HTML straight to an ESP. Others move through review, QA, or CRM tooling first. The
          important thing is to separate editable source from delivery output.
        </p>
        <ul className={listClass}>
          <li>Use MJML in version control if developers or marketers will iterate on the email again.</li>
          <li>Use compiled HTML for final import, QA snapshots, or platforms that do not understand MJML.</li>
          <li>Keep a record of the component or layout slug used so future edits start from the right source block.</li>
          <li>After importing into a platform, verify that tracking links, merge tags, and unsubscribe logic did not alter structure unexpectedly.</li>
          <li>Keep audience selection, consent, automation, unsubscribe, reporting, and delivery inside the sending platform.</li>
        </ul>
      </DocsSection>

      <DocsSection id="compatibility" title="Compatibility by platform">
        <p>
          Template Hedgehog is compatible with these platforms as a source-to-handoff system. Compatibility means the
          archive prepares MJML source, compiled HTML, previews, QA notes, and handoff guidance before import. It does
          not mean one-click sync, native account integration, campaign setup, sending, automation, audience management,
          unsubscribe handling, or reporting.
        </p>
        <div className="not-prose mt-6 grid gap-4 md:grid-cols-2">
          {platformCompatibilityNotes.map(([platform, note]) => (
            <article key={platform} className="border-t border-[var(--border-subtle)] pt-4">
              <h3 className="text-[1.05rem] font-semibold text-[var(--text-primary)]">{platform}</h3>
              <p className="mt-2 text-[0.92rem] leading-7 text-[var(--text-secondary)]">{note}</p>
            </article>
          ))}
        </div>
      </DocsSection>

      <DocsSection id="pitfalls" title="Common email client pitfalls">
        <p>
          Even solid MJML can be undermined by delivery context. These are the common issues worth checking before send.
        </p>
        <ul className={listClass}>
          <li>Long CTA labels that wrap awkwardly on mobile.</li>
          <li>Logo or hero images that are too small to survive high-density displays cleanly.</li>
          <li>Dark-mode inversions that reduce contrast on muted text or secondary links.</li>
          <li>Padding values that look balanced in webmail but become too tight in Outlook desktop.</li>
          <li>Edited compiled HTML drifting away from the MJML source, making the next revision harder than it should be.</li>
        </ul>
        <p>
          If you hit one of these issues often, favour the simpler variant in the layout reference. Reliability is usually worth more
          than a slightly more decorative layout treatment.
        </p>
      </DocsSection>
    </DocsLayout>
  );
}
