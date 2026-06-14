import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Code2,
  FileCode2,
  PackageOpen,
  ShieldCheck,
} from "lucide-react";
import { LeadCaptureForm } from "@/components/conversion/LeadCaptureForm";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Template Hedgehog Studio",
  description:
    "Join the Template Hedgehog Studio waitlist. Studio is a future production workspace concept for authoring, reviewing, compiling, QA checking, and handing off production email before it reaches an ESP.",
  path: "/studio",
  keywords: [
    "Template Hedgehog Studio",
    "email production workspace",
    "MJML workflow tool",
    "email QA workflow",
    "email handoff workspace",
  ],
});

const workflowSteps = [
  {
    title: "Author",
    copy: "Start from workflow-ready MJML and structured content, not an empty email file.",
    icon: Code2,
  },
  {
    title: "Review",
    copy: "Keep audience, trigger, copy intent, preview state, and risk notes together.",
    icon: ClipboardCheck,
  },
  {
    title: "Compile",
    copy: "Turn source into production-safe HTML before it moves into the sending platform.",
    icon: FileCode2,
  },
  {
    title: "QA",
    copy: "Check structure, mobile behaviour, client risk, fallbacks, and handoff gaps.",
    icon: ShieldCheck,
  },
  {
    title: "Handoff",
    copy: "Prepare source, compiled output, preview, QA notes, and guidance as one package.",
    icon: PackageOpen,
  },
];

const currentProductItems = [
  "Production-ready MJML source",
  "Compiled HTML",
  "Rendered previews",
  "QA notes",
  "Workflow examples",
  "Implementation guidance",
];

const studioIdeas = [
  "Choose a workflow and edit the email content in one place.",
  "Compile MJML and inspect the output before platform upload.",
  "Track QA checks against the same source and preview.",
  "Prepare a clean handoff package for Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, or another ESP.",
];

const platformResponsibilities = [
  "Audiences and segments",
  "Automation and journeys",
  "Consent and unsubscribe",
  "Sending and deliverability",
  "Reporting and analytics",
];

function StudioConceptPanel() {
  return (
    <div className="overflow-hidden border-y border-black bg-black text-white shadow-[0_28px_70px_rgba(0,0,0,0.18)]">
      <div className="flex items-center gap-2 border-b border-white/15 px-5 py-4">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <div className="ml-4">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.09em] text-white">
            Future workspace concept
          </p>
          <p className="mt-1 text-[0.84rem] leading-6 text-white/70">
            Concept preview only. Not live product UI.
          </p>
        </div>
      </div>
      <div className="grid gap-0 lg:grid-cols-[0.84fr_1.16fr]">
        <div className="border-b border-white/15 p-5 lg:border-b-0 lg:border-r">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-white/70">
            Source
          </p>
          <pre className="mt-4 overflow-hidden whitespace-pre-wrap text-[0.82rem] leading-6 text-white/78">
{`<mjml>
  <mj-body css-class="launch">
    <mj-section>
      <mj-column>
        <mj-text>Launch email updates</mj-text>
        <mj-button href="{{cta_url}}">
          Review workflow
        </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`}
          </pre>
        </div>
        <div className="bg-white p-5 text-black">
          <div className="border border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.07em] text-neutral-700">
                Handoff state
              </p>
              <span className="text-[0.8rem] font-semibold">concept</span>
            </div>
            <div className="grid gap-0 md:grid-cols-2">
              {["Compiled HTML", "Preview", "QA notes", "Platform handoff"].map((item) => (
                <div key={item} className="border-b border-neutral-200 px-4 py-5 last:border-b-0 md:border-r md:last:border-r-0">
                  <p className="font-serif text-[1.14rem] font-semibold">{item}</p>
                  <p className="mt-2 text-[0.9rem] leading-6 text-neutral-700">
                    Kept with the workflow before send.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <main className="th-monochrome min-h-screen bg-white text-black">
      <SiteTopBar ctaHref="/pricing#pro" ctaLabel="View the archive" ctaTone="inverse" />

      <section className="border-b border-[var(--border-subtle)] py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:px-12">
          <div className="min-w-0">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-[var(--text-secondary)]">
              Future product direction
            </p>
            <h1 className="mt-4 max-w-[11ch] text-wrap font-serif text-[clamp(3rem,6.8vw,5.8rem)] font-semibold leading-[0.98] text-black">
              Template Hedgehog Studio.
            </h1>
            <p className="mt-6 max-w-2xl text-[1.04rem] leading-8 text-[var(--text-secondary)]">
              A planned production workspace for modern email teams: author, review, compile, QA, and hand off email systems before they reach Mailchimp, HubSpot, Salesforce, NetSuite, Klaviyo, Customer.io, or another ESP.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#studio-waitlist" className="th-btn th-btn-primary">
                Join Studio waitlist
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
              <Link href="/pricing" className="th-btn th-btn-secondary">
                View the current archive
              </Link>
            </div>
            <p className="mt-5 max-w-xl text-[0.92rem] leading-7 text-[var(--text-secondary)]">
              Studio is not live product UI and does not replace the current Template Hedgehog archive. The archive is the product you can inspect and buy today.
            </p>
          </div>
          <StudioConceptPanel />
        </div>
      </section>

      <section className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-[var(--text-secondary)]">
              Why it exists
            </p>
            <h2 className="mt-3 font-serif text-[clamp(2.2rem,4.8vw,4rem)] font-semibold leading-[1] text-black">
              Email production breaks between source and send.
            </h2>
            <p className="mt-5 text-[1rem] leading-8 text-[var(--text-secondary)]">
              Template Hedgehog already gives teams production-ready artefacts. Studio is the future workspace idea for keeping the same artefacts connected while a send is being prepared.
            </p>
          </div>
          <div className="mt-10 grid gap-0 border-y border-[var(--border-subtle)] md:grid-cols-5">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="border-b border-[var(--border-subtle)] p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[0.88rem] font-semibold text-[var(--text-secondary)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon className="h-5 w-5 text-black" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-serif text-[1.28rem] font-semibold text-black">{step.title}</h3>
                  <p className="mt-2 text-[0.93rem] leading-7 text-[var(--text-secondary)]">{step.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
          <div>
            <h2 className="font-serif text-[clamp(2.1rem,4.4vw,3.7rem)] font-semibold leading-[1] text-black">
              The archive is live. Studio is the future workflow layer.
            </h2>
            <p className="mt-5 text-[1rem] leading-8 text-[var(--text-secondary)]">
              Today, Template Hedgehog sells production-ready MJML and HTML email systems. Studio would make that source-to-handoff process easier to run inside one workspace.
            </p>
          </div>
          <div className="grid gap-4">
            <article className="border-y border-[var(--border-subtle)] bg-white p-5">
              <h3 className="font-serif text-[1.35rem] font-semibold text-black">What you can buy today</h3>
              <ul className="mt-4 grid gap-2 text-[0.95rem] leading-7 text-[var(--text-secondary)] sm:grid-cols-2">
                {currentProductItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="border-y border-[var(--border-subtle)] bg-white p-5">
              <h3 className="font-serif text-[1.35rem] font-semibold text-black">What Studio is intended to help with</h3>
              <ul className="mt-4 space-y-2 text-[0.95rem] leading-7 text-[var(--text-secondary)]">
                {studioIdeas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-on-structural)] bg-black py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:px-12">
          <div>
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-white/65">
              Product boundary
            </p>
            <h2 className="mt-3 font-serif text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[1] !text-white">
              Studio would sit before your sending platform.
            </h2>
            <p className="mt-5 text-[1rem] leading-8 !text-white/75">
              It would not send email, manage subscribers, run automations, process consent, unsubscribe people, or report campaign performance.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="border-y border-white/20 p-5">
              <h3 className="font-serif text-[1.35rem] font-semibold !text-white">Template Hedgehog Studio</h3>
              <ul className="mt-4 space-y-2 text-[0.95rem] leading-7 !text-white/72">
                {workflowSteps.map((step) => (
                  <li key={`studio-${step.title}`}>{step.title}</li>
                ))}
              </ul>
            </article>
            <article className="border-y border-white/20 p-5">
              <h3 className="font-serif text-[1.35rem] font-semibold !text-white">Email platforms</h3>
              <ul className="mt-4 space-y-2 text-[0.95rem] leading-7 !text-white/72">
                {platformResponsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="studio-waitlist" className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start lg:px-12">
          <div>
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-[var(--text-secondary)]">
              Studio waitlist
            </p>
            <h2 className="mt-3 font-serif text-[clamp(2.15rem,4.6vw,3.8rem)] font-semibold leading-[1] text-black">
              Register interest in the future workspace.
            </h2>
            <p className="mt-5 text-[1rem] leading-8 text-[var(--text-secondary)]">
              Join if you want updates on the Studio direction, private review opportunities, and notes about source-to-handoff email production.
            </p>
          </div>
          <LeadCaptureForm
            source="studio_waitlist"
            submitLabel="Join Studio waitlist"
            description="We will only use this for Studio updates and practical production-email notes. No claim that Studio is available today."
            successMessage="Saved. You are on the Studio waitlist."
            showChecklistLink={false}
          />
        </div>
      </section>

      <SiteFooter flush showPrimaryCta ctaTone="inverse" />
    </main>
  );
}
