import type { Metadata } from "next";
import Link from "next/link";
import { TEMPLATE_CONFIG } from "@/config/template";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { SiteFooter } from "@/components/site/SiteFooter";
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
    "Enterprise email licence",
  ],
});

const faqItems = [
  {
    q: "Do I get MJML and compiled HTML?",
    a: "Yes. The archive includes editable MJML and compiled HTML for each component and layout included in your tier.",
  },
  {
    q: "How are layouts different from components?",
    a: "Components are reusable blocks. Layouts are full emails built by stacking those blocks in sequence.",
  },
  {
    q: "How do I get updates?",
    a: "Use the changelog and version metadata in the archive. Download the latest archive after each release covered by your tier.",
  },
  {
    q: "What if my download link fails after purchase?",
    a: "Return to the success page with your session_id and try again. If unavailable, contact support.",
  },
  {
    q: "Can I use the archive commercially?",
    a: "Yes. Enterprise is the commercial deployment licence for reuse rights, white-label or internal deployment, priority support, and 12 months updates.",
  },
];

export default function SupportPage() {
  return (
    <main className="th-page">
      <SiteTopBar ctaHref="/docs" ctaLabel="Open docs" />
      <JsonLd
        id="support-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Support", path: "/support" },
        ])}
      />
      <section className="th-section th-section-roomy">
        <div className="th-container max-w-6xl">
          <header>
            <p className="th-eyebrow">
              Support
            </p>
            <h1 className="th-heading-page mt-4">
              Need a hand getting this shipped?
            </h1>
            <p className="th-lede">
              Use the guides below for setup, licensing, and download issues. If you are still blocked, contact support directly.
            </p>
            <div className="mt-5">
              <Link
                href="/docs"
                className="inline-flex h-11 items-center rounded-full bg-[var(--action-primary)] px-5 text-[0.9rem] font-semibold !text-[var(--action-text)]"
              >
                Open docs
              </Link>
            </div>
          </header>

          <section className="mt-12 border-t border-[var(--border-subtle)] pt-9">
            <h2 className="th-heading-section">Frequently asked questions</h2>
            <div className="mt-7 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
              {faqItems.map((item) => (
                <details key={item.q} className="group">
                  <summary className="cursor-pointer list-none py-4 text-[0.98rem] font-semibold text-white">
                    {item.q}
                  </summary>
                  <p className="max-w-3xl pb-5 text-[0.95rem] leading-7 text-[var(--th-text-secondary)]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-12 border-t border-[var(--border-subtle)] pt-9">
            <h2 className="th-heading-section">Direct contact</h2>
            <p className="th-copy">
              Email: <a className="font-semibold text-white" href={`mailto:${TEMPLATE_CONFIG.supportEmail}`}>{TEMPLATE_CONFIG.supportEmail}</a>
            </p>
            <p className="mt-3 max-w-3xl text-[0.95rem] leading-7 text-[var(--th-text-muted)]">
              For Enterprise licensing questions, include your deployment context and team scope so we can confirm whether the commercial deployment licence fits.
            </p>
          </section>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
