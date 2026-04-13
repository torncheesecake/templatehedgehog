import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPageTitle } from "@/config/template";
import { emailExamples } from "@/data/email-examples";
import { getEmailWorkflowByLegacyExampleSlug } from "@/data/workflows";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteTopBar } from "@/components/site/SiteTopBar";
import { visualSystem } from "@/components/site/visualSystem";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return emailExamples.map((example) => ({ slug: example.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workflow = getEmailWorkflowByLegacyExampleSlug(slug);

  if (!workflow) {
    return {
      title: createPageTitle("Workflow not found"),
    };
  }

  return {
    title: createPageTitle(`${workflow.title} workflow`),
    description: `This legacy example now lives under the ${workflow.title} workflow.`,
  };
}

export default async function ExampleDetailRedirectPage({ params }: Props) {
  const VS = visualSystem;
  const { slug } = await params;
  const workflow = getEmailWorkflowByLegacyExampleSlug(slug);

  if (!workflow) {
    notFound();
  }

  return (
    <main className={VS.templates.content.main}>
      <SiteTopBar ctaHref={`/workflows/${workflow.slug}`} ctaLabel="View workflow" />
      <section className={VS.templates.content.frame}>
        <article className={cn(VS.templates.content.body, VS.templates.content.heroCard)}>
          <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
            Route updated
          </p>
          <h1 className={cn("mt-2 text-[2rem] sm:text-[2.25rem]", VS.headings.page)}>
            This example now lives in workflows
          </h1>
          <p className="mt-3 max-w-3xl text-[1rem] leading-8 text-slate-600">
            Continue with the workflow-first reference for {workflow.title}. It
            includes trigger details, component stack, merge variables, QA
            checks, and handoff guidance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/workflows/${workflow.slug}`}
              className="inline-flex h-11 items-center rounded-[0.82rem] border border-rose-600 bg-rose-600 px-4 text-[0.92rem] font-semibold text-white transition duration-200 hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
            >
              Open workflow
            </Link>
            <Link
              href="/workflows"
              className="inline-flex h-11 items-center rounded-[0.82rem] border border-slate-300 bg-[#FDFDFD] px-4 text-[0.92rem] font-semibold text-slate-900 transition duration-200 hover:border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
            >
              All workflows
            </Link>
          </div>
        </article>
      </section>
      <SiteFooter />
    </main>
  );
}
