import { Suspense } from "react";
import type { Metadata } from "next";
import { emailComponents } from "@/data/email-components";
import { ComponentsGalleryClient } from "@/components/email-components/ComponentsGalleryClient";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";
import {
  COMPONENT_COUNT,
  LAYOUT_COUNT,
  STARTER_COMPONENT_COUNT,
  STARTER_LAYOUT_COUNT,
  WORKFLOW_COUNT,
} from "@/lib/pack";

export const metadata: Metadata = createSeoMetadata({
  title: "Production email building blocks",
  description:
    "Explore production email blocks for campaign, lifecycle, transactional, newsletter, ecommerce, and handoff workflows.",
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
    <main className="th-monochrome min-h-screen bg-[var(--bg-canvas)] text-[var(--th-text-secondary)]">
      <SiteTopBar theme="hero" ctaTone="inverse" />
      <JsonLd
        id="components-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Components", path: "/components" },
        ])}
      />
      <Suspense fallback={null}>
        <ComponentsGalleryClient
          components={galleryComponents}
          proofSummary={`Core is the essential starting system: ${STARTER_COMPONENT_COUNT} blocks across ${STARTER_LAYOUT_COUNT} layouts (welcome, onboarding, reset, confirmation) in the simplest inline dialect. Pro standardises recurring production with the complete system: ${COMPONENT_COUNT} blocks, ${LAYOUT_COUNT} layouts, and ${WORKFLOW_COUNT} workflows, authored in a more maintainable stylesheet architecture. Team changes reuse rights, onboarding, and support.`}
        />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
