"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { BrandSignature } from "@/components/site/BrandSignature";
import { OperationalRail } from "@/components/site/OperationalRail";
import {
  EMAIL_COMPONENT_CATEGORY_FILTER_OPTIONS,
  matchesEmailComponentCategoryFilter,
  normaliseEmailComponentCategoryFilter,
  type EmailComponentCategory,
  type EmailComponentCategoryFilter,
} from "@/data/email-components/categories";

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

function safeFilterComponents(
  components: GalleryComponent[],
  query: string,
  category: EmailComponentCategoryFilter,
): GalleryComponent[] {
  const loweredQuery = query.trim().toLowerCase();
  return components.filter((component) => {
    if (!matchesEmailComponentCategoryFilter(component.category, category)) return false;
    if (!loweredQuery) return true;
    const searchable = [component.slug, component.title, component.description, ...component.tags].join(" ").toLowerCase();
    return searchable.includes(loweredQuery);
  });
}

export function ComponentsGalleryClient({ components }: ComponentsGalleryClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const visibleCategoryOptions = useMemo(
    () => EMAIL_COMPONENT_CATEGORY_FILTER_OPTIONS.filter((option) => option.id === "all" || components.some((component) => matchesEmailComponentCategoryFilter(component.category, option.id))),
    [components],
  );

  const featuredComponent = filteredComponents[0];
  const preferredFeaturedSlugOrder = [
    "dual-image-feature-grid",
    "quad-image-showcase",
    "hero-overlay-modern",
    "hero-image-left",
  ] as const;

  const featuredFromPreference = preferredFeaturedSlugOrder
    .map((slug) => filteredComponents.find((component) => component.slug === slug))
    .find(Boolean);

  const featured = featuredFromPreference ?? featuredComponent;
  const remainingComponents = filteredComponents.filter((component) => component.slug !== featured?.slug);

  return (
    <>
      <section className="border-b border-[var(--th-border-dark)] bg-[var(--bg-canvas)] py-12 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <BrandSignature index="03" label="Components" />
          <h1 className="mt-3 text-[2rem] font-semibold leading-tight text-white sm:text-[2.4rem]">Production-ready MJML email components</h1>
          <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-[var(--th-text-secondary)]">
            Reusable blocks for lifecycle, transactional, onboarding, support, and operational email systems.
          </p>

          <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <input
              id="components-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search title, description, tags, or slug"
              className="h-11 w-full rounded-[0.8rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)] px-3 text-[0.94rem] text-white placeholder:text-[var(--th-text-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
            />
            <div className="flex flex-wrap gap-2">
              {visibleCategoryOptions.map((option) => {
                const isActive = activeCategory === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setActiveCategory(option.id)}
                    aria-pressed={isActive}
                    className={`inline-flex h-9 items-center rounded-[0.68rem] border px-3 text-[0.76rem] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2 ${
                      isActive
                        ? "border-[var(--action-primary)] bg-[hsl(var(--th-accent-support)/0.18)] text-white"
                        : "border-[var(--th-border-dark)] bg-[var(--bg-surface)] text-[var(--th-text-secondary)] hover:border-[var(--border-subtle)]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg-surface)] py-12 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          {featured ? (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start">
              <Link href={`/components/${featured.slug}`} className="block overflow-hidden rounded-[1.2rem]">
                <div className="relative h-[19rem] sm:h-[24rem]">
                  <Image
                    src={featured.previewImageUrl}
                    alt={`${featured.title} preview`}
                    fill
                    sizes="(max-width: 1280px) 90vw, 58vw"
                    unoptimized
                    preload
                    className="object-cover object-top"
                  />
                </div>
              </Link>
              <div>
                <p className="text-[0.84rem] text-[var(--th-text-secondary)]">Featured component</p>
                <h2 className="mt-2 text-[1.7rem] font-semibold leading-tight text-white">{featured.title}</h2>
                <p className="mt-3 text-[0.98rem] leading-8 text-[var(--th-text-secondary)]">{featured.description}</p>
                <OperationalRail
                  className="mt-6"
                  steps={[
                    { label: "Select", detail: "Start from a production-useful module, not a utility fragment." },
                    { label: "Adapt", detail: "Adjust copy, media, and CTA while preserving proven hierarchy." },
                    { label: "Deploy", detail: "Move into layout output with consistent production behaviour." },
                  ]}
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {remainingComponents.map((component) => (
              <Link
                key={component.slug}
                href={`/components/${component.slug}`}
                className="group grid gap-4 rounded-[0.95rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)] p-3.5 transition hover:border-[var(--border-subtle)] sm:grid-cols-[8.5rem_minmax(0,1fr)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[0.76rem] bg-white sm:h-full sm:min-h-[8rem]">
                  <Image
                    src={component.previewImageUrl}
                    alt={`${component.title} preview`}
                    fill
                    sizes="(max-width: 768px) 90vw, 220px"
                    unoptimized
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.78rem] uppercase tracking-[0.08em] text-[var(--th-text-secondary)]">{component.category}</p>
                  <div className="mt-1 flex items-start justify-between gap-3">
                    <h3 className="text-[1.02rem] font-semibold leading-7 text-white">{component.title}</h3>
                    <ArrowUpRight className="mt-1 h-4.5 w-4.5 shrink-0 text-[var(--th-text-secondary)]" />
                  </div>
                  <p className="mt-2 line-clamp-3 text-[0.88rem] leading-6 text-[var(--th-text-secondary)]">
                    {component.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
