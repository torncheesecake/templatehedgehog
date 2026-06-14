import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { FeatureBlock, V2PageHero, V2Section } from "@/components/site/V2Primitives";
import { buildBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";
import {
  PACK_LAST_UPDATED,
  PACK_VERSION,
  formatVersionDate,
} from "@/lib/versioning";

const samplePackHref = "/resources/template-hedgehog-sample-pack.zip";

const sampleContents = [
  ["README.md", "What the sample is, what it is not, and how to inspect it."],
  ["layouts/sample-onboarding-system/source.mjml", "Editable MJML source for one complete workflow sample."],
  ["layouts/sample-onboarding-system/compiled.html", "Compiled HTML generated from the included MJML source."],
  ["layouts/sample-onboarding-system/qa-notes.md", "Practical review notes for copy, links, images, mobile, and ESP handoff."],
  ["layouts/sample-onboarding-system/implementation-guide.md", "Step-by-step implementation route from source to platform upload."],
  ["layouts/sample-onboarding-system/testing-proof.md", "What to test locally and what still needs ESP seed testing."],
  ["workflows/sample-onboarding-workflow.md", "Workflow context, trigger, fields, variants, QA risks, and handoff notes."],
  ["docs/archive-structure.md", "How Core, Pro, and Team archives are organised."],
  ["docs/licence-reference.md", "Plain-language summary of tier fit, rights, and update windows."],
] as const;

const proofItems = [
  {
    title: "Source and output stay together",
    copy: "The sample includes editable MJML and compiled HTML so buyers can inspect the real source-to-handoff model before paying.",
  },
  {
    title: "QA is part of the package",
    copy: "The sample includes QA and testing notes rather than treating rendering, links, images, and platform handoff as afterthoughts.",
  },
  {
    title: "The archive is structured for use",
    copy: "The folder structure mirrors the paid archive model: source, output, workflow notes, implementation guidance, and licence context stay connected.",
  },
] as const;

const boundaryItems = [
  "The sample pack is public inspection material, not the paid Core, Pro, or Team archive.",
  "The sample includes one onboarding workflow, not the complete component, layout, or workflow set.",
  "Sample copy, links, sender details, images, merge fields, and legal text must be replaced before production use.",
  "Your ESP still handles audiences, consent, unsubscribe, automation, delivery, reporting, and final seed testing.",
] as const;

export const metadata: Metadata = createSeoMetadata({
  title: "Free MJML sample pack to inspect",
  description:
    "Inspect the Template Hedgehog public sample pack before buying: MJML source, compiled HTML, QA notes, implementation guide, workflow context, and licence reference.",
  path: "/sample-pack",
  keywords: [
    "Template Hedgehog sample pack",
    "MJML sample archive",
    "compiled HTML email sample",
    "email QA sample pack",
  ],
});

function SampleTree() {
  return (
    <div className="overflow-hidden border-y border-[var(--border-subtle)] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
      <div className="border-b border-[var(--border-subtle)] px-4 py-3">
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">
          Public sample contents
        </p>
      </div>
      <div className="divide-y divide-[var(--border-subtle)]">
        {sampleContents.map(([path, detail]) => (
          <div key={path} className="grid gap-2 px-4 py-3 sm:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]">
            <code className="break-words text-[0.82rem] font-semibold text-[var(--identity-source)]">
              {path}
            </code>
            <p className="text-[0.88rem] leading-6 text-[var(--text-secondary)]">
              {detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SamplePackPage() {
  return (
    <main className="th-page th-monochrome">
      <SiteTopBar theme="hero" ctaTone="inverse" />
      <JsonLd
        id="sample-pack-breadcrumb"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Sample pack", path: "/sample-pack" },
        ])}
      />

      <V2PageHero
        title="Inspect the sample pack before buying."
        copy={`Download one complete public workflow sample from Template Hedgehog v${PACK_VERSION}, last updated ${formatVersionDate(PACK_LAST_UPDATED)}. It shows the artefact style, folder structure, source files, compiled output, QA notes, implementation guidance, and licence context before you choose Core, Pro, or Team.`}
        actions={[
          { href: samplePackHref, label: "Download sample ZIP", primary: true },
          { href: "/pricing#pro", label: "Compare editions" },
        ]}
        compact
      >
        <SampleTree />
      </V2PageHero>

      <V2Section
        title="What the sample proves."
        copy="The sample is designed to answer the practical buyer question: will the paid archive be easy to inspect, adapt, QA, and hand off?"
        surface="surface"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {proofItems.map((item) => (
            <FeatureBlock key={item.title} title={item.title} copy={item.copy} />
          ))}
        </div>
      </V2Section>

      <V2Section
        title="What the sample is not."
        copy="The sample should reduce uncertainty without blurring the paid licence or implying Template Hedgehog replaces your sending platform."
      >
        <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          {boundaryItems.map((item) => (
            <p key={item} className="py-4 text-[0.96rem] leading-7 text-[var(--text-secondary)]">
              {item}
            </p>
          ))}
        </div>
      </V2Section>

      <V2Section surface="gradient">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <h2 className="max-w-3xl font-serif text-[clamp(2rem,5vw,4.2rem)] font-semibold leading-[0.96] !text-[var(--colour-high-priority)]">
              Inspect the sample, then choose the archive.
            </h2>
            <p className="mt-4 max-w-2xl text-[1rem] leading-8 !text-[var(--text-on-structural-muted)]">
              Use the sample to check source quality, compiled output, QA notes, and handoff structure. Buy Core for the essential starting system, Pro for recurring production, or Team when reuse rights and support matter.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={samplePackHref} className="th-btn th-btn-primary-on-dark">
              Download sample ZIP
              <Download className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/pricing#pro" className="th-btn th-btn-secondary-on-dark">
              Compare editions
            </Link>
          </div>
        </div>
      </V2Section>

      <SiteFooter />
    </main>
  );
}
