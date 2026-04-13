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
import {
  SectionIntro,
  SectionShell,
  VisualPanel,
} from "@/components/site/SectionPrimitives";
import {
  SystemArchitectureVisual,
  WorkflowFlowDiagram,
} from "@/components/site/ProductVisuals";
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

  const leadComponent = filteredComponents[0];

  return (
    <>
      <SectionShell spacing="hero" tone="canvas" width="content">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:items-start">
          <div>
            <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-600">Components reference</p>
            <h1 className="mt-4 max-w-3xl text-[2.85rem] font-semibold leading-[0.9] text-slate-900 sm:text-[4rem] lg:text-[4.5rem]">
              Production-safe blocks for workflow-driven email builds
            </h1>
            <p className="mt-6 max-w-3xl text-[1.04rem] leading-8 text-slate-600">
              Use this layer when you need targeted block edits. Start from workflows first, then refine individual
              components without breaking message hierarchy.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.92rem] text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                {components.length} components in registry
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                Filter by category, tags, and search
              </span>
            </div>
          </div>

          <div className="grid gap-5">
            <VisualPanel>
              <label
                htmlFor="components-search"
                className="block text-[0.8rem] font-semibold uppercase tracking-[0.09em] text-slate-600"
              >
                Search and filter
              </label>
              <input
                id="components-search"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search title, description, tags, or slug"
                className="mt-3 h-11 w-full rounded-[0.82rem] border border-slate-200 bg-white px-3 text-[0.94rem] text-slate-900 placeholder:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
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
                      className={`inline-flex h-8.5 items-center rounded-[0.7rem] border px-3 text-[0.74rem] font-semibold tracking-[0.02em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 ${
                        isActive
                          ? "border-slate-300 bg-[hsl(var(--th-accent-support)/0.16)] text-slate-900"
                          : "border-slate-200 bg-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-[0.84rem] text-slate-600">
                Showing {filteredComponents.length} {filteredComponents.length === 1 ? "component" : "components"}.
              </p>
              <p aria-live="polite" className="sr-only">
                {resultsAnnouncement}
              </p>
            </VisualPanel>

            <SystemArchitectureVisual
              title="Where components fit"
              subtitle="Workflow to layout to output"
              workflowLabel="onboarding"
              layoutLabel="onboarding-step-system"
              componentLabels={leadComponent ? [leadComponent.slug] : []}
              imageUrl={leadComponent?.previewImageUrl}
              imageAlt={`${leadComponent?.title ?? "Component"} preview`}
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell spacing="feature" tone="soft" border="softBoth" width="content">
        <SectionIntro
          pattern="split"
          tone="light"
          eyebrow="Component context"
          title="Components are one layer of the full workflow system"
          description="Use this catalogue for precise block updates, then return to workflows and layouts to preserve full message structure."
          aside={
            <WorkflowFlowDiagram
              title="Implementation flow"
              subtitle="How teams use this page"
              steps={workflowComponentSteps.map((item) => ({
                label: item.label,
                detail: item.detail,
              }))}
              tone="soft"
            />
          }
        />
      </SectionShell>

      <SectionShell spacing="grid" tone="canvas" width="content">
        <SectionIntro
          pattern="full"
          eyebrow="Browse components"
          title="Find the right block quickly"
          titleClassName="text-[1.78rem] sm:text-[2.08rem]"
          description="Cards are organised for rapid scanning and direct handoff to component detail pages."
        />

        <div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredComponents.map((component) => {
            const previewProfile = getPreviewProfile(component.category);
            const tagLine = component.tags.slice(0, 2).join(" • ");
            const extraTags = component.tags.length - 2;

            return (
              <Link
                key={component.slug}
                href={`/components/${component.slug}`}
                className="group block rounded-[1rem] border border-slate-200 bg-slate-50 p-5 shadow-[0_16px_30px_rgba(0,0,0,0.28)] transition duration-200 hover:border-slate-300 hover:shadow-[0_22px_36px_rgba(0,0,0,0.34)] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
              >
                <div className={`relative overflow-hidden rounded-[0.88rem] border border-slate-200 ${previewProfile.stageClass}`}>
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
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-slate-600">
                    {component.category}
                  </p>

                  <div className="mt-1 flex items-start justify-between gap-3">
                    <h2 className="text-[1.16rem] font-semibold leading-7 text-slate-900">
                      {component.title}
                    </h2>
                    <ArrowUpRight className="mt-1 h-4.5 w-4.5 shrink-0 text-slate-900 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  <p className="mt-2 text-[0.94rem] leading-7 text-slate-600">
                    {component.description}
                  </p>

                  {tagLine ? (
                    <p className="mt-3 text-[0.78rem] font-medium tracking-[0.03em] text-slate-600">
                      {tagLine}
                      {extraTags > 0 ? ` • +${extraTags}` : ""}
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>

        {filteredComponents.length === 0 ? (
          <div className="mt-10 text-center text-[1rem] text-slate-600">
            <p>No components match your search and category filters.</p>
          </div>
        ) : null}

        <div className="mt-14 border-t border-slate-200 pt-10">
          <VisualPanel>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-[1rem] font-semibold tracking-[0.012em] text-slate-600">Next step</p>
                <h2 className="mt-3 max-w-3xl text-[1.9rem] font-semibold leading-[0.96] text-slate-900">
                  Need the full workflow system offline for your team
                </h2>
                <p className="mt-4 max-w-3xl text-[0.98rem] leading-7 text-slate-600">
                  The public reference is for discovery and one-off use. {TEMPLATE_CONFIG.productName} is for teams who
                  want the full archive, compiled HTML, and faster implementation workflow.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link href="/workflows" className={VS.buttons.secondaryDark}>
                  Browse workflows
                </Link>
                <Link href="/pricing" className={VS.buttons.primaryLarge}>
                  Get Hedgehog Core - £79
                </Link>
              </div>
            </div>
          </VisualPanel>
        </div>
      </SectionShell>
    </>
  );
}
