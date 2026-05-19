import type { Metadata } from "next";
import Link from "next/link";
import { TEMPLATE_CONFIG } from "@/config/template";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { cn } from "@/lib/utils";
import { visualSystem } from "@/components/site/visualSystem";
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
    a: "Yes. The pack includes editable MJML and compiled HTML for each component and layout.",
  },
  {
    q: "How are layouts different from components?",
    a: "Components are reusable blocks. Layouts are full emails built by stacking those blocks in sequence.",
  },
  {
    q: "How do I get updates?",
    a: "Use the changelog and version metadata in the pack. Download the latest pack after each release.",
  },
  {
    q: "What if my download link fails after purchase?",
    a: "Return to the success page with your session_id and try again. If unavailable, contact support.",
  },
  {
    q: "Can I use the pack commercially?",
    a: "Yes. Enterprise is the commercial deployment licence for reuse rights, white-label or internal deployment, priority support, and 12 months updates.",
  },
];

export default function SupportPage() {
  const VS = visualSystem;

  return (
    <main className={VS.templates.content.main}>
      <SiteTopBar ctaHref="/docs" ctaLabel="Open docs" />
      <JsonLd
        id="support-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Support", path: "/support" },
        ])}
      />
      <section className={cn(VS.templates.content.frame, "pb-20")}>
        <div className={cn(VS.templates.content.body, "space-y-7")}>
          <article className={VS.templates.content.heroCard}>
            <p className={VS.eyebrow.accent}>
              Support
            </p>
            <h1 className={cn("mt-3 max-w-3xl text-[2.05rem] sm:text-[2.4rem]", VS.headings.page)}>
              Need a hand getting this shipped?
            </h1>
            <p className={cn("mt-3 max-w-3xl", VS.body.onLight)}>
              Use the guides below for setup, licensing, and download issues. This product is operated by {TEMPLATE_CONFIG.owner.name}. If you are still blocked, contact support directly.
            </p>
            <div className="mt-5">
              <Link
                href="/docs"
                className={cn(VS.buttons.primary, "h-10 rounded-full px-4 py-2")}
              >
                Open docs
              </Link>
            </div>
          </article>

          <section className="border-t border-[var(--th-border-dark)] pt-7">
            <h2 className={cn("text-[1.3rem]", VS.headings.subsection)}>Frequently asked questions</h2>
            <div className="mt-4 space-y-3">
              {faqItems.map((item) => (
                <details key={item.q} className="rounded-[0.82rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)]">
                  <summary className="cursor-pointer list-none px-4 py-3 text-[0.95rem] font-semibold text-white">
                    {item.q}
                  </summary>
                  <p className="border-t border-[var(--th-border-dark)] px-4 py-3 text-[0.93rem] leading-7 text-[var(--th-text-secondary)]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="border-t border-[var(--th-border-dark)] pt-7">
            <h2 className={cn("text-[1.3rem]", VS.headings.subsection)}>Direct contact</h2>
            <p className="mt-3 text-[0.98rem] leading-7 text-[var(--th-text-secondary)]">
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
