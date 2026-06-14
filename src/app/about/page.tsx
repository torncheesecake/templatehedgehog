import type { Metadata } from "next";
import Link from "next/link";
import { TEMPLATE_CONFIG } from "@/config/template";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  FeatureBlock,
  FounderProof,
  V2PageHero,
  V2Section,
  WorkflowAssembly,
} from "@/components/site/V2Primitives";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "About",
  description:
    `${TEMPLATE_CONFIG.brandName} is built from hands-on HTML email production work: editable MJML, compiled HTML, QA notes, and handoff-ready systems.`,
  path: "/about",
  keywords: [
    "Template Hedgehog",
    "production email systems",
    "MJML product",
    "HTML email workflow",
  ],
});

export default function AboutPage() {
  return (
    <main className="th-page th-monochrome">
      <SiteTopBar theme="hero" ctaTone="inverse" />
      <JsonLd
        id="about-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <V2PageHero
        title="Built from real email production work."
        copy={`${TEMPLATE_CONFIG.brandName} exists because production email is rarely just a visual template. Teams need editable MJML, compiled HTML, previews, QA notes, and handoff context that stay connected from first build to final send.`}
        actions={[
          { href: "/workflows?view=product", label: "Browse workflows", primary: true },
          { href: "/pricing", label: "See what is included" },
        ]}
        compact
      >
        <WorkflowAssembly compact tone="light" />
      </V2PageHero>

      <V2Section
        title="Why I built Template Hedgehog."
        copy="The useful proof starts with origin: what production problem the product comes from, why the files are structured this way, and what pressure the archive is designed to remove."
      >
        <FounderProof />
      </V2Section>

      <V2Section
        title="What the product optimises for."
        copy="The archive is built around workflow outcomes first. Counts still matter, but only after the buyer understands how source, output, QA, and handoff fit together."
        surface="surface"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureBlock
            title="Start from a real send"
            copy="The useful starting point is the message journey: onboarding, reset, receipt, launch, digest, alert, or support route. Components are chosen after the workflow is clear."
          />
          <FeatureBlock
            title="Keep source and output together"
            copy="MJML source supports editing and reuse. Compiled HTML supports delivery, QA, ESP upload, and developer handoff. Template Hedgehog ships both."
          />
          <FeatureBlock
            title="Make QA visible"
            copy="The product records responsive risks, client caveats, copy pressure, image handling, and handoff notes so teams are not guessing at the end of the build."
          />
          <FeatureBlock
            title="Turn repeated work into a system"
            copy="The aim is not a gallery of attractive blocks. The aim is a reusable production archive that reduces rebuilding, review friction, and fragile one-off edits."
          />
        </div>
      </V2Section>

      <V2Section surface="gradient">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <h2 className="max-w-3xl font-serif text-[clamp(2rem,5vw,4.2rem)] font-semibold leading-[0.96] !text-[var(--colour-high-priority)]">
              Inspect the workflow before judging the archive.
            </h2>
            <p className="mt-4 max-w-2xl text-[1rem] leading-8 !text-[var(--text-on-structural-muted)]">
              Browse the public workflow proof, then use pricing to decide whether Core, Pro, or Team fits the way you will use the files.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/workflows?view=product"
              className="th-btn th-btn-primary-on-dark"
            >
              Browse workflows
            </Link>
            <Link
              href="/pricing"
              className="th-btn th-btn-secondary-on-dark"
            >
              Compare editions
            </Link>
          </div>
        </div>
      </V2Section>

      <SiteFooter />
    </main>
  );
}
