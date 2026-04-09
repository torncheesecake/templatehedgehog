import { Suspense } from "react";
import { emailComponents } from "@/data/email-components";
import { ComponentsGalleryClient } from "@/components/email-components/ComponentsGalleryClient";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { visualSystem } from "@/components/site/visualSystem";

export default function ComponentsGalleryPage() {
  const VS = visualSystem;
  const galleryComponents = emailComponents.map((component) => ({
    slug: component.slug,
    title: component.title,
    category: component.category,
    description: component.description,
    tags: component.tags,
    previewImageUrl: component.previewImageUrl,
  }));

  return (
    <main className={VS.templates.library.main}>
      <SiteTopBar theme="hero" ctaHref="/pricing" ctaLabel="Get Hedgehog Core - £79" />
      {/* Required because the client gallery uses useSearchParams for URL-synchronised filters. */}
      <Suspense fallback={null}>
        <ComponentsGalleryClient components={galleryComponents} />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
