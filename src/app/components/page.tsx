import { Suspense } from "react";
import type { Metadata } from "next";
import { emailComponents } from "@/data/email-components";
import { ComponentsGalleryClient } from "@/components/email-components/ComponentsGalleryClient";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Production-ready MJML email components",
  description:
    "Browse production-ready MJML components for lifecycle, transactional, onboarding, support, and operational email systems.",
  path: "/components",
  keywords: [
    "MJML components",
    "HTML email components",
    "production email components",
    "transactional email blocks",
    "lifecycle email components",
  ],
});

export default function ComponentsGalleryPage() {
  const galleryComponents = emailComponents.map((component) => ({
    slug: component.slug,
    title: component.title,
    category: component.category,
    description: component.description,
    tags: component.tags,
    previewImageUrl: component.previewImageUrl,
  }));

  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--th-text-secondary)]">
      <SiteTopBar theme="hero" />
      <JsonLd
        id="components-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Components", path: "/components" },
        ])}
      />
      <Suspense fallback={null}>
        <ComponentsGalleryClient components={galleryComponents} />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
