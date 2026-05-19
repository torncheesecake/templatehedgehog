import type { Metadata } from "next";
import { emailLayouts, emailLayoutSystems } from "@/data/email-layouts";
import { LayoutsGallery } from "@/components/email-layouts/LayoutsGallery";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Production email layouts",
  description:
    "Reusable MJML email layout recipes with rendered previews, source access, compiled HTML, and implementation guidance.",
  path: "/layouts",
  keywords: [
    "MJML email layouts",
    "production email layouts",
    "compiled HTML email layouts",
    "transactional email layouts",
    "lifecycle email layouts",
  ],
});

export default function LayoutsGalleryPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--th-text-secondary)]">
      <SiteTopBar theme="hero" />
      <JsonLd
        id="layouts-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Layouts", path: "/layouts" },
        ])}
      />
      <LayoutsGallery layouts={emailLayouts} systems={emailLayoutSystems} />
      <SiteFooter />
    </main>
  );
}
