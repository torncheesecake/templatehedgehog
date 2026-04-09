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
    <section className={VS.templates.library.frame}>
      <div className={VS.templates.library.heroGrid}>
        <header className={VS.templates.library.heroLead}>
          <p className={VS.eyebrow.light}>
            Components catalogue
          </p>
          <h1 className={cn("mt-4", VS.headings.page)}>
            Production-safe MJML components for real email workflows
          </h1>
          <p className={cn("mt-4", VS.widths.bodyWide, VS.body.compact)}>
            Find the block you need, copy clean source, and move from preview to delivery without rebuilding fragile
            email HTML from scratch.
          </p>
        </header>

        <aside className={VS.templates.library.railCard}>
          <label
            htmlFor="components-search"
            className="block text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--accent-primary)"
          >
            Search components
          </label>
          <input
            id="components-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search title, description, tags, or slug"
            className="mt-2 h-10 w-full rounded-[0.82rem] border border-[rgba(222, 210, 204,0.28)] bg-white px-3 text-[0.95rem] text-(--hedgehog-core-navy) placeholder:text-(--th-body-copy) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
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
                      ? "border-(--accent-primary) bg-(--accent-primary) text-(--surface-strong)"
                      : "border-[rgba(222, 210, 204,0.24)] bg-transparent text-(--accent-primary) hover:border-(--accent-primary) hover:text-(--accent-secondary)"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[0.88rem] text-(--hedgehog-core-blue-deep)">
            Showing {filteredComponents.length} {filteredComponents.length === 1 ? "component" : "components"}.
          </p>
          <p aria-live="polite" className="sr-only">
            {resultsAnnouncement}
          </p>
        </aside>
      </div>

      <div className="mt-8 grid gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
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
              <div className={`relative overflow-hidden rounded-[1rem] ring-1 ring-[rgba(222, 210, 204,0.34)] ${previewProfile.stageClass}`}>
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
                  <h2 className="text-[1.2rem] font-semibold leading-7 text-(--hedgehog-core-navy) group-hover:text-(--hedgehog-core-navy)">
                    {component.title}
                  </h2>
                  <ArrowUpRight className="mt-1 h-4.5 w-4.5 shrink-0 text-(--accent-primary) transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--accent-secondary)" />
                </div>

                <p className="mt-2 text-[0.98rem] leading-7 text-(--th-body-copy)">
                  {component.description}
                </p>

                {tagLine ? (
                  <p className="mt-3 text-[0.8rem] font-medium tracking-[0.03em] text-(--hedgehog-core-blue-deep)">
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
        <div className="mt-10 text-center text-[1rem] text-(--th-body-copy)">
          <p>No components match your search and category filters.</p>
        </div>
      ) : null}

      <div className={cn("section-breath border-t pt-8", VS.dividers.strong)}>
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
            <Link
              href="/docs"
              className={VS.buttons.secondaryLight}
            >
              Read docs
            </Link>
            <Link
              href="/pricing"
              className={VS.buttons.primary}
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
