"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  EMAIL_COMPONENT_CATEGORY_FILTER_OPTIONS,
  matchesEmailComponentCategoryFilter,
  normaliseEmailComponentCategoryFilter,
  type EmailComponentCategory,
  type EmailComponentCategoryFilter,
} from "@/data/email-components/categories";
import { TEMPLATE_CONFIG } from "@/config/template";
import { cn } from "@/lib/utils";
import { WorkflowFlowDiagram } from "@/components/site/ProductVisuals";
import { visualSystem } from "@/components/site/visualSystem";

type GalleryComponent = {
  slug: string;
  title: string;
  category: EmailComponentCategory;
  description: string;
  tags: string[];
  previewImageUrl: string;
};

interface ComponentsGalleryClientProps {
  components: GalleryComponent[];
}

type PreviewProfile = {
  stageClass: string;
  imageClass: string;
};

function getPreviewProfile(category: EmailComponentCategory): PreviewProfile {
  if (category === "Headers" || category === "Footers" || category === "Buttons") {
    return {
      stageClass: "h-[13.4rem] sm:h-[14.2rem]",
      imageClass: "object-cover object-top",
    };
  }

  if (category === "Heroes" || category === "Product Sections" || category === "Newsletter Layouts") {
    return {
      stageClass: "h-[16.1rem] sm:h-[17.1rem]",
      imageClass: "object-cover object-[center_22%]",
    };
  }

  return {
    stageClass: "h-[14.7rem] sm:h-[15.7rem]",
    imageClass: "object-cover object-top",
  };
}

function hasDuplicateSlugs(items: GalleryComponent[]): boolean {
  return new Set(items.map((item) => item.slug)).size !== items.length;
}

const workflowComponentSteps = [
  {
    label: "Workflow",
    detail: "Start from a practical use case rather than a blank file.",
  },
  {
    label: "Layout",
    detail: "Choose structure, then adjust components in order.",
  },
  {
    label: "Components",
    detail: "Swap blocks while preserving proven hierarchy.",
  },
  {
    label: "Output",
    detail: "Compile to HTML and hand off to ESP with fewer regressions.",
  },
] as const;

function safeFilterComponents(
  components: GalleryComponent[],
  query: string,
  category: EmailComponentCategoryFilter,
): GalleryComponent[] {
  try {
    const loweredQuery = query.trim().toLowerCase();

    const filtered = components.filter((component) => {
      if (!matchesEmailComponentCategoryFilter(component.category, category)) {
        return false;
      }

      if (!loweredQuery) return true;

      const searchable = [
        component.slug,
        component.title,
        component.description,
        ...component.tags,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(loweredQuery);
    });

    const dedupedBySlug = new Map<string, GalleryComponent>();
    for (const component of filtered) {
      if (!dedupedBySlug.has(component.slug)) {
        dedupedBySlug.set(component.slug, component);
      }
    }

    const deduped = [...dedupedBySlug.values()];

    if (process.env.NODE_ENV !== "production" && hasDuplicateSlugs(deduped)) {
      console.error("[components] Runtime assertion failed: duplicates remained after dedupe.");
    }

    return deduped;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[components] Filtering failed unexpectedly.", error);
    }
    return [];
  }
}

export function ComponentsGalleryClient({ components }: ComponentsGalleryClientProps) {
  const VS = visualSystem;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(() => searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(
    () => searchParams.get("q") ?? "",
  );
  const [activeCategory, setActiveCategory] = useState<EmailComponentCategoryFilter>(() =>
    normaliseEmailComponentCategoryFilter(searchParams.get("category")),
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const nextQuery = debouncedQuery.trim();

    if (nextQuery) {
      params.set("q", nextQuery);
    } else {
      params.delete("q");
    }

    if (activeCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", activeCategory);
    }

    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

    if (currentUrl !== nextUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [activeCategory, debouncedQuery, pathname, router, searchParams]);

  const filteredComponents = useMemo(
    () => safeFilterComponents(components, debouncedQuery, activeCategory),
    [components, debouncedQuery, activeCategory],
  );
  const visibleCategoryOptions = useMemo(
    () =>
      EMAIL_COMPONENT_CATEGORY_FILTER_OPTIONS.filter((option) => {
        if (option.id === "all") {
          return true;
        }

        return components.some((component) =>
          matchesEmailComponentCategoryFilter(component.category, option.id),
        );
      }),
    [components],
  );

  const resultsAnnouncement = useMemo(() => {
    const categoryLabel =
      activeCategory === "all"
        ? "all categories"
        : `${activeCategory.replace(/-/g, " ")} category`;
    const queryPart = debouncedQuery.trim()
      ? ` for "${debouncedQuery.trim()}"`
      : "";
    const count = filteredComponents.length;
    const noun = count === 1 ? "component" : "components";

    return `${count} ${noun} shown in ${categoryLabel}${queryPart}.`;
  }, [activeCategory, debouncedQuery, filteredComponents.length]);

  return (
    <>
      <section className={cn(VS.widths.page, VS.sections.types.hero)}>
        <div className={VS.sections.intros.wideSplit}>
          <header className={VS.sections.intros.fullWidth}>
            <p className={VS.eyebrow.light}>Components catalogue</p>
            <h1 className={cn("mt-4", VS.headings.page)}>
              Production-safe MJML components for real workflows
            </h1>
            <p className={cn("mt-4", VS.widths.bodyWide, VS.body.compact)}>
              Find the exact block you need, copy clean source, and move from preview to delivery without rebuilding
              fragile email HTML from scratch.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.92rem] text-(--th-body-copy)">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                {components.length} components in registry
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-support)" />
                Filter by category, tag, and search
              </span>
            </div>
          </header>

          <aside className={VS.templates.library.railCard}>
            <label
              htmlFor="components-search"
              className="block text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--accent-support)"
            >
              Search components
            </label>
            <input
              id="components-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search title, description, tags, or slug"
              className="mt-2 h-10 w-full rounded-[0.82rem] border border-(--surface-line) bg-(--surface-soft) px-3 text-[0.95rem] text-(--text-primary-dark) placeholder:text-(--th-body-copy) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
            />

            <div
              className="mt-3.5 flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by category"
            >
              {visibleCategoryOptions.map((option) => {
                const isActive = activeCategory === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setActiveCategory(option.id)}
                    aria-pressed={isActive}
                    className={`inline-flex h-8.5 items-center rounded-[0.7rem] border px-3 text-[0.76rem] font-semibold tracking-[0.02em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2 ${
                      isActive
                        ? "border-(--accent-primary) bg-(--accent-primary) text-(--text-primary-dark)"
                        : "border-(--surface-line) bg-transparent text-(--th-body-copy) hover:border-(--accent-support) hover:text-(--text-primary-dark)"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-[0.88rem] text-(--th-body-copy)">
              Showing {filteredComponents.length} {filteredComponents.length === 1 ? "component" : "components"}.
            </p>
            <p aria-live="polite" className="sr-only">
              {resultsAnnouncement}
            </p>
          </aside>
        </div>
      </section>

      <section className={cn("border-y border-(--border-light) bg-(--bg-soft)", VS.sections.types.feature)}>
        <div className={VS.widths.page}>
          <div className={VS.sections.intros.wideSplit}>
            <div>
              <p className="text-[1rem] font-semibold tracking-[0.01em] text-(--text-secondary-light)">
                Component context
              </p>
              <h2 className="mt-3 max-w-[18ch] text-[1.95rem] font-semibold leading-[0.97] text-(--text-primary-light) sm:text-[2.3rem]">
                Components are one layer of the full workflow system
              </h2>
              <p className="mt-4 max-w-[68ch] text-[1rem] leading-8 text-(--text-secondary-light)">
                Use this catalogue to edit individual blocks, then move back to workflow and layout references to keep
                structure, QA behaviour, and handoff decisions aligned.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/workflows" className={VS.buttons.secondaryLight}>
                  Browse workflows
                </Link>
                <Link href="/layouts" className={VS.buttons.secondaryLight}>
                  Browse layouts
                </Link>
              </div>
            </div>

            <WorkflowFlowDiagram
              title="How components fit"
              subtitle="Workflow to layout to output"
              steps={workflowComponentSteps.map((item) => ({
                label: item.label,
                detail: item.detail,
              }))}
              className="border-(--border-light) bg-(--bg-soft-elevated) shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
            />
          </div>
        </div>
      </section>

      <section className={cn(VS.widths.page, VS.sections.types.grid)}>
        <div className={VS.sections.layouts.cards3}>
          {filteredComponents.map((component) => {
            const previewProfile = getPreviewProfile(component.category);
            const tagLine = component.tags.slice(0, 2).join(" • ");
            const extraTags = component.tags.length - 2;

            return (
              <Link
                key={component.slug}
                href={`/components/${component.slug}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
              >
                <article className="rounded-[1rem] border border-(--surface-line) bg-(--surface-soft) p-5 shadow-[0_16px_30px_rgba(0,0,0,0.26)] transition duration-200 hover:-translate-y-[1px] hover:border-(--accent-support) hover:shadow-[0_20px_34px_rgba(0,0,0,0.34)]">
                  <div className={`relative overflow-hidden rounded-[0.9rem] ring-1 ring-(--surface-line) ${previewProfile.stageClass}`}>
                    <Image
                      src={component.previewImageUrl}
                      alt={`${component.title} preview`}
                      fill
                      sizes="(min-width: 1280px) 28vw, (min-width: 640px) 44vw, 92vw"
                      unoptimized
                      className={`transition duration-500 group-hover:scale-[1.01] ${previewProfile.imageClass}`}
                    />
                  </div>

                  <div className="mt-4">
                    <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-(--th-body-copy)">
                      {component.category}
                    </p>

                    <div className="mt-1 flex items-start justify-between gap-3">
                      <h2 className="text-[1.2rem] font-semibold leading-7 text-(--text-primary-dark) group-hover:text-(--text-primary-dark)">
                        {component.title}
                      </h2>
                      <ArrowUpRight className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-support) transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--accent-primary)" />
                    </div>

                    <p className="mt-2 text-[0.98rem] leading-7 text-(--th-body-copy)">
                      {component.description}
                    </p>

                    {tagLine ? (
                      <p className="mt-3 text-[0.8rem] font-medium tracking-[0.03em] text-(--th-body-copy)">
                        {tagLine}
                        {extraTags > 0 ? ` • +${extraTags}` : ""}
                      </p>
                    ) : null}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {filteredComponents.length === 0 ? (
          <div className="mt-10 text-center text-[1rem] text-(--th-body-copy)">
            <p>No components match your search and category filters.</p>
          </div>
        ) : null}

        <div className={cn("section-breath border-t pt-10", VS.dividers.strong)}>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className={VS.eyebrow.light}>Next step</p>
              <h2 className={cn("mt-3 text-[1.7rem] sm:text-[2.15rem]", VS.headings.subsection)}>
                Need the full library offline for your team
              </h2>
              <p className={cn("mt-3", VS.widths.bodyNarrow, VS.body.compact)}>
                The public library is there for discovery and one-off use. {TEMPLATE_CONFIG.productName} is for teams who
                want the whole archive, local source files, compiled HTML, and a faster implementation workflow.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/workflows" className={VS.buttons.secondaryDark}>
                Browse workflows
              </Link>
              <Link href="/pricing" className={VS.buttons.primary}>
                Get Hedgehog Core - £79
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
