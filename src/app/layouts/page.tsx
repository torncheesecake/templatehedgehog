import type { Metadata } from "next";
import { createPageTitle } from "@/config/template";
import { emailLayouts, emailLayoutSystems } from "@/data/email-layouts";
import { LayoutsGallery } from "@/components/email-layouts/LayoutsGallery";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { visualSystem } from "@/components/site/visualSystem";

export const metadata: Metadata = {
  title: createPageTitle("Layouts"),
  description:
    "Reusable MJML email layout recipes with full rendered previews, source access, and implementation guidance.",
};

export default function LayoutsGalleryPage() {
  const VS = visualSystem;

  return (
    <main className={VS.templates.library.main}>
      <SiteTopBar theme="hero" />
      <LayoutsGallery layouts={emailLayouts} systems={emailLayoutSystems} />

      <SiteFooter />
    </main>
  );
}
