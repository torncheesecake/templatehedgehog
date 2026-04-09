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
          <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
            Route updated
          </p>
          <h1 className={cn("mt-2 text-[2rem] sm:text-[2.25rem]", VS.headings.page)}>
            This example now lives in workflows
          </h1>
          <p className="mt-3 max-w-[64ch] text-[1rem] leading-8 text-(--th-body-copy)">
            Continue with the workflow-first reference for {workflow.title}. It
            includes trigger details, component stack, merge variables, QA
            checks, and handoff guidance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/workflows/${workflow.slug}`}
              className="inline-flex h-11 items-center rounded-[0.82rem] border border-(--accent-primary) bg-(--accent-primary) px-4 text-[0.92rem] font-semibold !text-(--surface-strong) transition duration-200 hover:bg-(--accent-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2"
            >
              Open workflow
            </Link>
            <Link
              href="/workflows"
              className="inline-flex h-11 items-center rounded-[0.82rem] border border-(--dune-muted) bg-[#FDFDFD] px-4 text-[0.92rem] font-semibold text-(--hedgehog-core-navy) transition duration-200 hover:border-(--hedgehog-core-blue-deep) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2"
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
