import type { Metadata } from "next";
import Link from "next/link";
import { TEMPLATE_CONFIG } from "@/config/template";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { FeatureBlock, V2PageHero, V2Section } from "@/components/site/V2Primitives";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Support",
  description:
    `Support guidance for ${TEMPLATE_CONFIG.brandName} purchases, downloads, MJML components, layouts, and commercial licences.`,
  path: "/support",
  keywords: [
    "Template Hedgehog support",
    "MJML email support",
    "email system download support",
    "Team email licence",
  ],
});

const faqItems = [
  {
    q: "Do I get MJML and compiled HTML?",
    a: "Yes. The archive includes editable MJML and compiled HTML for each component and layout included in your tier.",
  },
  {
    q: "Can I inspect a sample before buying?",
    a: "Yes. The public sample pack shows one complete workflow sample with MJML source, compiled HTML, QA notes, testing notes, implementation guide, workflow context, archive structure, and licence reference. It is inspection material, not the paid Core, Pro, or Team archive.",
  },
  {
    q: "How are layouts different from components?",
    a: "Components are reusable blocks. Layouts are full emails built by stacking those blocks in sequence.",
  },
  {
    q: "How do I get updates?",
    a: "Use the changelog and version metadata in the archive. Download the latest archive after each release covered by your tier. When the included update window ends, you keep the archive you bought and can contact support about renewing update access or moving to Team if reuse rights and priority support now matter.",
  },
  {
    q: "Do I lose access after the update window?",
    a: "No. The purchased archive remains yours inside the licence terms. The update window controls future version access and support priority, not whether your existing MJML source, compiled HTML, previews, docs, and QA notes keep working.",
  },
  {
    q: "What if my download link fails after purchase?",
    a: "Return to the success page with your session_id and try again. If the signed link still fails, contact support with your purchase email or Stripe receipt.",
  },
  {
    q: "Is Studio included?",
    a: "Template Hedgehog Studio is the future workspace direction for choosing workflows, editing content, compiling, previewing, QA, preparing handoff, and exporting ZIPs. It is not live product UI. The paid archive is complete without Studio and remains yours either way. Studio will not send emails or manage audiences, consent, unsubscribe, automation, delivery, or reporting.",
  },
  {
    q: "What happens if the archive is inaccessible?",
    a: "Support will check the purchase record, archive tier, and delivery route. If the paid archive cannot be delivered or is materially different from the described tier contents, the issue will be resolved or refunded.",
  },
  {
    q: "What support is not included?",
    a: "Template Hedgehog does not run your ESP account, audience data, automation, consent workflow, unsubscribe handling, deliverability, reporting, or final send. Those stay inside your sending platform.",
  },
];

const supportPaths = [
  {
    title: "Purchase or download problem",
    copy: "Send the purchase email, Stripe receipt if available, selected tier, and the error shown on the success or download page.",
  },
  {
    title: "Archive access problem",
    copy: "Send the archive name, version, and the file or folder you cannot open so support can separate delivery issues from local unzip or permissions issues.",
  },
  {
    title: "Implementation question",
    copy: "Send the workflow, layout, ESP, and the exact handoff issue. Support can point to the right source, compiled HTML, or docs path.",
  },
  {
    title: "Pre-purchase inspection",
    copy: "Use the sample pack to inspect source quality, compiled output, QA notes, workflow context, and licence boundaries before choosing Core, Pro, or Team.",
  },
  {
    title: "Studio waitlist question",
    copy: "Send the workflow, browser, and the before-send step that is blocked: edit, compile, preview, QA, handoff, or export.",
  },
  {
    title: "Licence or reuse question",
    copy: "Ask before buying if the archive will be used for client work, white-label delivery, or internal rollout across multiple teams.",
  },
] as const;

const supportBoundaries = [
  "Support covers purchase verification, download access, archive contents, licence fit, and practical guidance for using MJML, compiled HTML, docs, and QA notes.",
  "Template Hedgehog does not directly manage Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, audience data, consent, automation, unsubscribe, reporting, deliverability, or sending.",
  "If a paid archive cannot be delivered, is inaccessible, or materially differs from the tier description, support will resolve the delivery issue or refund the purchase.",
  "Founder-led support is handled by email. During soft launch, response expectations should be treated as practical, best-effort support rather than a formal SLA.",
] as const;

export default function SupportPage() {
  return (
    <main className="th-page th-monochrome">
      <SiteTopBar theme="hero" ctaHref="/docs" ctaLabel="Open docs" ctaTone="inverse" />
      <JsonLd
        id="support-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Support", path: "/support" },
        ])}
      />

      <V2PageHero
        title="Support for getting the archive into production."
        copy="Start with the docs for implementation guidance. Use direct support for purchase, download, or licence questions that block delivery."
        actions={[
          { href: "/docs", label: "Open docs", primary: true },
          { href: `mailto:${TEMPLATE_CONFIG.supportEmail}`, label: "Email support" },
        ]}
        compact
      />

      <V2Section
        title="Common support paths"
        copy="Most support requests are faster when the purchase record, archive tier, and workflow context are included from the start."
        surface="surface"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {supportPaths.map((item) => (
            <FeatureBlock key={item.title} title={item.title} copy={item.copy} />
          ))}
        </div>
      </V2Section>

      <V2Section
        title="What support covers."
        copy="The boundary is practical: Template Hedgehog helps with the archive and implementation handoff, while the sending platform owns sending operations."
      >
        <div className="grid gap-3">
          {supportBoundaries.map((item) => (
            <div key={item} className="border-t border-[var(--border-subtle)] pt-4 text-[0.96rem] leading-7 text-[var(--text-secondary)]">
              {item}
            </div>
          ))}
        </div>
      </V2Section>

      <V2Section
        title="Studio support boundary."
        copy="Studio support follows the same before-send boundary as the archive. It helps with local workflow preparation, not live sending operations."
        surface="surface"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureBlock
            title="Included with Pro and Team"
            copy="Template Hedgehog Studio is in development as a future before-send workspace for choosing workflows, editing content, compiling, previewing, QA, preparing handoff, and exporting ZIPs. The paid archive is complete without Studio and remains yours either way."
          />
          <FeatureBlock
            title="Your sending platform still sends"
            copy="Studio does not send emails, manage audiences, manage consent, handle unsubscribe, run automation, provide reporting, or connect to platform APIs."
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/studio" className="th-btn th-btn-sm th-btn-secondary">
            Join Studio waitlist
          </Link>
          <Link href="/pricing#pro" className="th-btn th-btn-sm th-btn-primary">
            View Pro
          </Link>
        </div>
      </V2Section>

      <V2Section
        title="Download help and refund expectation."
        copy="If payment succeeds but access fails, the support path is purchase verification first, archive recovery second, refund only if delivery cannot be resolved."
        surface="surface"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureBlock
            title="Download failure"
            copy="Return to the checkout success page and retry the signed link. If it still fails, email the purchase email or Stripe receipt and the error shown."
          />
          <FeatureBlock
            title="Archive inaccessible"
            copy="Send the archive filename, version, operating system, and the file or folder that cannot be opened so the issue can be isolated."
          />
          <FeatureBlock
            title="Refund expectation"
            copy="If the paid archive cannot be delivered, is inaccessible, or materially differs from the described tier contents, support will resolve the issue or refund the purchase."
          />
        </div>
      </V2Section>

      <V2Section title="Frequently asked questions">
        <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          {faqItems.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none text-[1rem] font-semibold text-[var(--text-primary)]">
                {item.q}
              </summary>
              <p className="mt-3 max-w-3xl text-[0.95rem] leading-7 text-[var(--th-text-secondary)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </V2Section>

      <V2Section title="Direct contact" surface="surface">
        <p className="text-[1rem] leading-8 text-[var(--th-text-secondary)]">
          Email <a className="font-semibold text-[var(--action-primary)]" href={`mailto:${TEMPLATE_CONFIG.supportEmail}`}>{TEMPLATE_CONFIG.supportEmail}</a> with your purchase email, intended use, and the blocker you are trying to resolve.
        </p>
        <p className="mt-3 max-w-3xl text-[0.95rem] leading-7 text-[var(--text-secondary)]">
          If you are still judging whether the product is credible enough to buy, read the founder proof before contacting support.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/sample-pack"
            className="th-btn th-btn-sm th-btn-secondary"
          >
            Inspect sample pack
          </Link>
          <Link
            href="/about#founder-proof"
            className="th-btn th-btn-sm th-btn-secondary"
          >
            Read founder proof
          </Link>
          <Link
            href="/services/netsuite-email-templates"
            className="th-btn th-btn-sm th-btn-secondary"
          >
            NetSuite email template services
          </Link>
        </div>
      </V2Section>

      <SiteFooter />
    </main>
  );
}
