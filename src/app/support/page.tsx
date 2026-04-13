import type { Metadata } from "next";
import Link from "next/link";
import { createPageTitle, TEMPLATE_CONFIG } from "@/config/template";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { cn } from "@/lib/utils";
import { visualSystem } from "@/components/site/visualSystem";

export const metadata: Metadata = {
  title: createPageTitle("Support"),
  description:
    `Support guidance for ${TEMPLATE_CONFIG.brandName} components, layouts, and library delivery.`,
};

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
    a: "Yes, under the pack licence terms shown on the pricing page.",
  },
];

export default function SupportPage() {
  const VS = visualSystem;

  return (
    <main className={VS.templates.content.main}>
      <SiteTopBar ctaHref="/docs" ctaLabel="Open docs" />
      <section className={cn(VS.templates.content.frame, "pb-20")}>
        <div className={cn(VS.templates.content.body, "space-y-8")}>
          <article className={VS.templates.content.heroCard}>
            <p className={VS.eyebrow.accent}>
              Support
            </p>
            <h1 className={cn("mt-3 max-w-3xl text-[2.05rem] sm:text-[2.4rem]", VS.headings.page)}>
              Need a hand getting this shipped?
            </h1>
            <p className={cn("mt-3 max-w-3xl", VS.body.onLight)}>
              Use the guides below for setup, licensing, and download issues. If you are still blocked, contact support directly.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/docs"
                className={cn(VS.buttons.primary, "h-10 rounded-full px-4 py-2")}
              >
                Open docs
              </Link>
              <Link
                href="/changelog"
                className={cn(VS.buttons.secondaryLight, "h-10 rounded-full bg-slate-50 px-4 py-2 text-slate-900")}
              >
                View changelog
              </Link>
              <Link
                href="/pricing"
                className={cn(VS.buttons.secondaryLight, "h-10 rounded-full bg-slate-50 px-4 py-2 text-slate-900")}
              >
                View pricing
              </Link>
            </div>
          </article>

          <section className={VS.templates.content.sectionCard}>
            <h2 className={cn("text-[1.3rem]", VS.headings.subsection)}>Frequently asked questions</h2>
            <div className="mt-4 space-y-3">
              {faqItems.map((item) => (
                <details key={item.q} className="rounded-[0.82rem] border border-slate-200 bg-slate-50">
                  <summary className="cursor-pointer list-none px-4 py-3 text-[0.95rem] font-semibold text-slate-900">
                    {item.q}
                  </summary>
                  <p className="border-t border-slate-200 px-4 py-3 text-[0.93rem] leading-7 text-slate-600">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className={VS.templates.content.sectionCard}>
            <h2 className={cn("text-[1.3rem]", VS.headings.subsection)}>Direct contact</h2>
            <p className="mt-3 text-[0.98rem] leading-7 text-slate-600">
              Email: <a className="font-semibold text-slate-900" href={`mailto:${TEMPLATE_CONFIG.supportEmail}`}>{TEMPLATE_CONFIG.supportEmail}</a>
            </p>
          </section>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
