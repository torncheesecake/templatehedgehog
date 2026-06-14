"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { WorkflowAssembly } from "@/components/site/V2Primitives";
import { withBasePath } from "@/lib/asset-path";
import {
  EMAIL_COMPONENT_CATEGORY_FILTER_OPTIONS,
  matchesEmailComponentCategoryFilter,
  normaliseEmailComponentCategoryFilter,
  type EmailComponentCategory,
  type EmailComponentCategoryFilter,
} from "@/data/email-components/categories";
import { cn } from "@/lib/utils";

type GalleryComponent = {
  slug: string;
  title: string;
  category: EmailComponentCategory;
  description: string;
  tags: string[];
  previewImageUrl: string;
};

type ProductionGroup = {
  id: string;
  title: string;
  role: string;
  copy: string;
  href: string;
  match: (component: GalleryComponent) => boolean;
};

interface ComponentsGalleryClientProps {
  components: GalleryComponent[];
  proofSummary: string;
}

const productionGroups: ProductionGroup[] = [
  {
    id: "campaign",
    title: "Campaign structure",
    role: "Launch and acquisition",
    copy: "Hero, CTA, product, and proof blocks for planned campaign sends.",
    href: "/workflows/campaign-launch",
    match: (component) => hasAnySignal(component, ["hero", "launch", "campaign", "announcement", "promotion", "feature", "cta"]) || component.category === "Heroes",
  },
  {
    id: "onboarding",
    title: "Lifecycle onboarding",
    role: "Activation and retention",
    copy: "Blocks that help welcome, guide, remind, and move users through product actions.",
    href: "/workflows/onboarding",
    match: (component) => hasAnySignal(component, ["onboarding", "welcome", "activation", "trial", "lifecycle", "app", "usage"]),
  },
  {
    id: "transactional",
    title: "Transactional confidence",
    role: "Account, billing, and support",
    copy: "Operational blocks where trust, clarity, and fallback links matter more than decoration.",
    href: "/workflows/password-reset",
    match: (component) => component.category === "Transactional Components" || hasAnySignal(component, ["password", "security", "verification", "account", "support", "invoice", "billing", "order", "shipping", "payment", "receipt"]),
  },
  {
    id: "newsletter",
    title: "Newsletter rhythm",
    role: "Recurring editorial sends",
    copy: "Repeatable structures for digests, updates, resources, and link-heavy content.",
    href: "/workflows/newsletter-digest",
    match: (component) => component.category === "Newsletter Layouts" || hasAnySignal(component, ["newsletter", "digest", "editorial", "blog", "roundup", "resource", "updates"]),
  },
  {
    id: "ecommerce",
    title: "Ecommerce proof",
    role: "Product and purchase moments",
    copy: "Product grids, summaries, status blocks, and proof sections for commercial sends.",
    href: "/workflows/order-confirmation",
    match: (component) => component.category === "Product Sections" || hasAnySignal(component, ["product", "grid", "order", "shipping", "receipt", "invoice", "review", "rating", "showcase", "catalogue"]),
  },
  {
    id: "handoff",
    title: "Headers and footers",
    role: "Brand, legal, and support",
    copy: "Opening and closing blocks that keep identity, compliance, and support context attached.",
    href: "/workflows/newsletter-digest",
    match: (component) => component.category === "Headers" || component.category === "Footers" || hasAnySignal(component, ["header", "footer", "legal", "privacy", "unsubscribe", "brand"]),
  },
];

const featuredBlockSlugs = [
  "hero-overlay-modern",
  "welcome-email-hero",
  "password-reset-card",
  "weekly-digest-list",
  "order-confirmation-summary",
  "footer-onboarding-legal",
] as const;

function getSignals(component: GalleryComponent): string[] {
  return [
    component.slug,
    component.title,
    component.category,
    component.description,
    ...component.tags,
  ].map((value) => value.toLowerCase());
}

function hasAnySignal(component: GalleryComponent, signals: string[]): boolean {
  const searchable = getSignals(component).join(" ");
  return signals.some((signal) => searchable.includes(signal));
}

function getProductionPlacement(component: GalleryComponent): string {
  switch (component.category) {
    case "Headers":
      return "Starts the send with sender identity and utility context.";
    case "Heroes":
      return "Leads a campaign, announcement, or onboarding message.";
    case "Buttons":
      return "Turns a decision point into a clear next action.";
    case "Footers":
      return "Closes the send with legal, support, and preference context.";
    case "Product Sections":
      return "Structures products, proof, offers, or feature comparisons.";
    case "Transactional Components":
      return "Supports account, billing, security, and support workflows.";
    case "Newsletter Layouts":
      return "Gives recurring content sends a repeatable editorial rhythm.";
    case "Content Blocks":
    default:
      return "Adds explanation, proof, guidance, or supporting detail between key actions.";
  }
}

function getProductionReason(component: GalleryComponent): string {
  if (hasAnySignal(component, ["password", "security", "verification", "account"])) {
    return "Use it when the reader needs a trusted account action with minimal ambiguity.";
  }

  if (hasAnySignal(component, ["newsletter", "digest", "editorial", "blog", "resource"])) {
    return "Use it when content volume needs structure without rebuilding the send every week.";
  }

  if (hasAnySignal(component, ["launch", "campaign", "announcement", "promotion", "feature", "cta"])) {
    return "Use it when the email needs a clear message hierarchy and one obvious action.";
  }

  if (hasAnySignal(component, ["onboarding", "welcome", "activation", "trial", "lifecycle"])) {
    return "Use it when the workflow needs to move users towards activation or retention.";
  }

  if (hasAnySignal(component, ["order", "shipping", "invoice", "receipt", "billing", "payment"])) {
    return "Use it when operational detail needs to be readable, trustworthy, and easy to hand off.";
  }

  return "Use it to assemble a production-safe email section without starting from a blank file.";
}

function getPrimaryProductionGroup(component: GalleryComponent): ProductionGroup {
  return productionGroups.find((group) => group.match(component)) ?? productionGroups[0];
}

function getPrimaryGroupComponents(group: ProductionGroup, components: GalleryComponent[]): GalleryComponent[] {
  return components.filter((component) => getPrimaryProductionGroup(component).id === group.id);
}

function safeFilterComponents(
  components: GalleryComponent[],
  query: string,
  category: EmailComponentCategoryFilter,
): GalleryComponent[] {
  const loweredQuery = query.trim().toLowerCase();

  return components.filter((component) => {
    if (!matchesEmailComponentCategoryFilter(component.category, category)) return false;
    if (!loweredQuery) return true;
    return getSignals(component).join(" ").includes(loweredQuery);
  });
}

function ProductionBlockCard({
  component,
  featured = false,
}: {
  component: GalleryComponent;
  featured?: boolean;
}) {
  const group = getPrimaryProductionGroup(component);

  return (
    <Link
      href={`/components/${component.slug}`}
      className={cn(
        "group block border-t border-[var(--border-subtle)] pt-5 transition hover:border-[var(--identity-source-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2",
        featured ? "lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-8 lg:border-y lg:bg-white lg:p-5 lg:shadow-[0_22px_65px_rgba(15,23,42,0.08)]" : "",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] ring-1 ring-[var(--border-subtle)] transition group-hover:shadow-[0_20px_48px_rgba(49,59,114,0.11)]",
          featured ? "aspect-[16/11] lg:aspect-[16/10]" : "aspect-[16/10]",
        )}
      >
        <Image
          src={component.previewImageUrl}
          alt={`${component.title} production block preview`}
          fill
          sizes={featured ? "(max-width: 1280px) 92vw, 640px" : "(max-width: 768px) 92vw, 360px"}
          unoptimized
          priority={featured}
          className="object-cover object-top transition duration-300 group-hover:scale-[1.012]"
        />
      </div>

      <div className={cn("pt-4", featured ? "lg:pt-0" : "")}>
        <p className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">
          {group.title}
        </p>
        <h3 className={cn("mt-2 font-semibold text-[var(--text-primary)] group-hover:text-[var(--identity-source)]", featured ? "font-serif text-[clamp(1.8rem,3.8vw,2.8rem)] leading-[1]" : "text-[1.1rem]")}>
          {component.title}
        </h3>
        <p className="mt-3 text-[0.94rem] leading-7 text-[var(--text-secondary)]">
          {component.description}
        </p>
        <dl className={cn("mt-4 grid gap-4", featured ? "sm:grid-cols-2" : "")}>
          <div className="border-l border-[var(--border-subtle)] pl-3">
            <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
              Where it is used
            </dt>
            <dd className="mt-1 text-[0.88rem] leading-6 text-[var(--text-secondary)]">
              {getProductionPlacement(component)}
            </dd>
          </div>
          <div className="border-l border-[var(--border-subtle)] pl-3">
            <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
              Why use it
            </dt>
            <dd className="mt-1 text-[0.88rem] leading-6 text-[var(--text-secondary)]">
              {getProductionReason(component)}
            </dd>
          </div>
        </dl>
        <span className="mt-5 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-[var(--action-primary)]">
          View production block
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export function ComponentsGalleryClient({ components, proofSummary }: ComponentsGalleryClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hedgehogMarkUrl = withBasePath("/brand/hedgehog-mark.svg");

  const [searchInput, setSearchInput] = useState(() => searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(() => searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState<EmailComponentCategoryFilter>(() =>
    normaliseEmailComponentCategoryFilter(searchParams.get("category")),
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(searchInput), 150);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const nextQuery = debouncedQuery.trim();
    if (nextQuery) params.set("q", nextQuery);
    else params.delete("q");
    if (activeCategory === "all") params.delete("category");
    else params.set("category", activeCategory);
    const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    if (currentUrl !== nextUrl) router.replace(nextUrl, { scroll: false });
  }, [activeCategory, debouncedQuery, pathname, router, searchParams]);

  const filteredComponents = useMemo(
    () => safeFilterComponents(components, debouncedQuery, activeCategory),
    [components, debouncedQuery, activeCategory],
  );

  const activeCategoryLabel = EMAIL_COMPONENT_CATEGORY_FILTER_OPTIONS.find((option) => option.id === activeCategory)?.label ?? "All";

  const visibleCategoryOptions = useMemo(
    () => EMAIL_COMPONENT_CATEGORY_FILTER_OPTIONS.filter((option) => option.id === "all" || components.some((component) => matchesEmailComponentCategoryFilter(component.category, option.id))),
    [components],
  );

  const featuredBlocks = useMemo(
    () => featuredBlockSlugs
      .map((slug) => components.find((component) => component.slug === slug))
      .filter((component): component is GalleryComponent => Boolean(component)),
    [components],
  );

  const visibleFeatured = featuredBlocks.find((component) => filteredComponents.some((filtered) => filtered.slug === component.slug))
    ?? filteredComponents[0];

  const featuredSlug = visibleFeatured?.slug ?? "";
  const groupedComponents = productionGroups
    .map((group) => {
      const primaryMatches = getPrimaryGroupComponents(group, filteredComponents)
        .filter((component) => component.slug !== featuredSlug)
        .sort((left, right) => left.title.localeCompare(right.title, "en-GB"));

      return {
        ...group,
        components: primaryMatches.slice(0, 6),
        total: primaryMatches.length,
      };
    })
    .filter((group) => group.components.length > 0);

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-14 sm:py-16">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-8 top-6 hidden h-28 w-28 bg-black/[0.08] lg:block"
          style={{
            WebkitMaskImage: `url('${hedgehogMarkUrl}')`,
            maskImage: `url('${hedgehogMarkUrl}')`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-end">
            <div>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[var(--identity-source)]">
                Production blocks
              </p>
              <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[0.94] text-[var(--text-primary)]">
                Reusable blocks for real email workflows.
              </h1>
              <p className="mt-5 max-w-2xl text-[1.04rem] leading-8 text-[var(--text-secondary)]">
                Components are production sections that sit inside a workflow: source, compiled HTML, preview, QA notes, and handoff context travel together so teams can build without starting from a blank email.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/workflows" className="th-btn th-btn-primary">
                  View workflows
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="#production-blocks" className="th-btn th-btn-secondary text-[var(--text-primary)]">
                  Explore production blocks
                </Link>
              </div>
            </div>
            <WorkflowAssembly compact />
          </div>

          <div className="mt-10 grid gap-4 border-y border-[var(--border-subtle)] py-5 md:grid-cols-4">
            {[
              ["MJML source", "Editable block source for local assembly."],
              ["Compiled HTML", "Output ready for ESP handoff and QA."],
              ["Preview", "Rendered artefact for visual inspection."],
              ["QA and handoff", "Checks for links, images, mobile, and legal copy."],
            ].map(([title, copy]) => (
              <article key={title} className="border-l border-[var(--border-subtle)] pl-3">
                <h2 className="text-[0.9rem] font-semibold text-[var(--text-primary)]">{title}</h2>
                <p className="mt-1 text-[0.84rem] leading-6 text-[var(--text-secondary)]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <div>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                Production grouping
              </p>
              <h2 className="mt-2 font-serif text-[clamp(2rem,4.4vw,3.35rem)] font-semibold leading-[1] text-[var(--text-primary)]">
                Start with the send purpose.
              </h2>
              <p className="mt-4 text-[1rem] leading-8 text-[var(--text-secondary)]">
                The same block can be copied as source, compiled into HTML, and reviewed before handoff. The useful question is where it belongs in the workflow.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {productionGroups.map((group) => {
                const total = getPrimaryGroupComponents(group, components).length;

                return (
                  <Link
                    key={group.id}
                    href={group.href}
                    className="group border-t border-[var(--border-subtle)] pt-4 transition hover:border-[var(--identity-source-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
                  >
                    <p className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">{group.role}</p>
                    <h3 className="mt-2 text-[1.08rem] font-semibold text-[var(--text-primary)] group-hover:text-[var(--identity-source)]">{group.title}</h3>
                    <p className="mt-2 text-[0.9rem] leading-7 text-[var(--text-secondary)]">{group.copy}</p>
                    <p className="mt-3 text-[0.78rem] font-semibold text-[var(--text-meta)]">{total} relevant blocks</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="production-blocks" className="border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start">
            <div>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                Curated block
              </p>
              <h2 className="mt-2 font-serif text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1] text-[var(--text-primary)]">
                A production artefact, not a thumbnail.
              </h2>
              <p className="mt-4 text-[1rem] leading-8 text-[var(--text-secondary)]">
                Featured blocks show how a single section carries intent, preview proof, implementation context, and a route into a larger workflow.
              </p>
            </div>

            {visibleFeatured ? <ProductionBlockCard component={visibleFeatured} featured /> : null}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-10">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <details className="group border-y border-[var(--border-subtle)] bg-white px-4 py-4 shadow-[0_18px_45px_rgba(0,0,0,0.04)] sm:px-5" open={Boolean(debouncedQuery || activeCategory !== "all")}>
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                  Refine blocks
                </p>
                <p className="mt-1 text-[0.92rem] leading-6 text-[var(--text-secondary)]">
                  Search and filters are here when the workflow purpose is already clear.
                </p>
              </div>
              <span className="text-[0.84rem] font-semibold text-[var(--identity-source)]">
                {filteredComponents.length} shown, {activeCategoryLabel}
              </span>
            </summary>

            <div className="mt-5 grid gap-5 border-t border-[var(--border-subtle)] pt-5 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:items-start">
              <div>
                <label htmlFor="components-search" className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                  Search by use case or block
                </label>
                <input
                  id="components-search"
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Reset, digest, footer, CTA, invoice..."
                  className="mt-2 h-11 w-full border-0 border-b border-[var(--border-subtle)] bg-transparent px-0 text-[0.96rem] text-[var(--text-primary)] placeholder:text-[var(--text-meta)] focus:outline-none focus-visible:border-[var(--action-primary)]"
                />
              </div>

              <fieldset className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <legend className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                    Narrow by technical block type
                  </legend>
                  <p className="text-[0.82rem] font-semibold text-[var(--text-secondary)]">
                    Supporting taxonomy
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {visibleCategoryOptions.map((option) => {
                    const isActive = activeCategory === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setActiveCategory(option.id)}
                        aria-pressed={isActive}
                        className={`inline-flex min-h-10 items-center border px-3.5 text-[0.84rem] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2 ${
                          isActive
                            ? "border-black bg-black !text-white"
                            : "border-[var(--border-subtle)] bg-white text-[var(--text-primary)] hover:border-black"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </details>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <div>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                Production blocks
              </p>
              <h2 className="mt-2 font-serif text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1] text-[var(--text-primary)]">
                Organised by workflow purpose.
              </h2>
            </div>
            <p className="text-[1rem] leading-8 text-[var(--text-secondary)]">
              {proofSummary}
            </p>
          </div>

          {groupedComponents.length > 0 ? (
            <div className="space-y-14">
              {groupedComponents.map((group) => (
                <section key={group.id} aria-labelledby={`${group.id}-heading`}>
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
                    <div>
                      <p className="text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--identity-source)]">{group.role}</p>
                      <h3 id={`${group.id}-heading`} className="mt-1 text-[1.45rem] font-semibold text-[var(--text-primary)]">{group.title}</h3>
                      <p className="mt-2 max-w-2xl text-[0.95rem] leading-7 text-[var(--text-secondary)]">{group.copy}</p>
                    </div>
                    <p className="text-[0.82rem] font-semibold text-[var(--text-meta)]">
                      Showing {group.components.length} of {group.total}
                    </p>
                  </div>
                  <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                    {group.components.map((component) => (
                      <ProductionBlockCard key={`${group.id}-${component.slug}`} component={component} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-8">
              <h3 className="text-[1.2rem] font-semibold text-[var(--text-primary)]">No blocks match this refinement.</h3>
              <p className="mt-2 text-[0.95rem] leading-7 text-[var(--text-secondary)]">
                Clear the search or return to all block types to see the full production system.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
