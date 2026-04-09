import { Product, Review } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    slug: "netsuite-executive-dashboard",
    name: "NetSuite Executive Overview Dashboard",
    tagline:
      "A complete React dashboard designed for NetSuite data. Runs immediately with realistic mock data — swap in your NetSuite API connection when you're ready.",
    description: `An executive overview dashboard built with React 18, Next.js 14, and Tailwind CSS. Designed for businesses running NetSuite who need a clean, modern view of their key metrics.

## How It Works

The template runs out of the box with **realistic mock data** shaped to match NetSuite records — sales orders, revenue figures, customer records, and financial summaries. The data layer is cleanly separated so you can swap in real NetSuite API calls without rewriting any UI components.

We include **integration guides** with REST API patterns and SuiteScript examples showing how to connect to your NetSuite instance. These are well-documented patterns based on the NetSuite REST API (SuiteTalk) documentation — not a plug-and-play connector, but a clear path to get your data flowing.

## What's Included

- **4 pages** — Executive Overview, Sales Performance, Financial Summary, Settings
- **18 components** built with Tailwind CSS
- **Mock data layer** with typed interfaces matching NetSuite record shapes
- **Integration guide** — REST API patterns and SuiteScript examples for connecting to NetSuite
- **Dark and light mode** with system preference detection
- **Basic role system** — Admin and Viewer roles with route protection
- **3 chart types** — Line, bar, and pie charts powered by Recharts

## Pages

- **Executive Dashboard** — High-level KPIs with trend indicators, revenue chart, and recent activity
- **Sales Performance** — Pipeline overview, conversion rates, and top customers table
- **Financial Summary** — Revenue vs expenses, cash flow basics, and period comparisons
- **Settings** — User preferences, theme toggle, and basic role management

## Technical Highlights

- TypeScript throughout — zero \`any\` types
- Cleanly separated data layer (swap mock data for real API calls)
- Recharts for data visualisation (line, bar, pie)
- Data table with sorting and filtering
- React Hook Form + Zod for settings forms
- Responsive down to 320px
- Lighthouse score 95+

## Update Policy

Your purchase includes 6 months of bug fixes and patch updates. Major framework upgrades (e.g. React 19, Next.js 15) may be released as a new version at a discounted upgrade price.`,
    priceGbp: 29900,
    comparePrice: null,
    category: "erp",
    tags: [
      "netsuite",
      "erp",
      "executive-dashboard",
      "dark-mode",
      "charts",
      "tables",
    ],
    features: [
      {
        icon: "database",
        title: "NetSuite-Ready Data Layer",
        description:
          "Runs with realistic mock data out of the box. Typed interfaces match NetSuite records — swap in real API calls when ready",
      },
      {
        icon: "file-text",
        title: "Integration Guide Included",
        description:
          "REST API patterns and SuiteScript examples for connecting to your NetSuite instance. A clear path, not a black box",
      },
      {
        icon: "layout",
        title: "4 Focused Pages",
        description:
          "Executive overview, sales performance, financial summary, and settings — everything an exec needs",
      },
      {
        icon: "bar-chart",
        title: "Charts & KPIs",
        description:
          "Line, bar, and pie charts powered by Recharts, plus KPI cards with trend indicators",
      },
      {
        icon: "moon",
        title: "Dark & Light Mode",
        description:
          "Full theme support with system preference detection and manual toggle",
      },
      {
        icon: "smartphone",
        title: "Fully Responsive",
        description:
          "Works on every screen size from 320px mobile to 4K desktop",
      },
    ],
    techStack: [
      "React 18",
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "Recharts",
      "React Hook Form",
      "Zod",
    ],
    previewImages: [
      "/images/templates/netsuite-1.jpg",
      "/images/templates/netsuite-2.jpg",
      "/images/templates/netsuite-3.jpg",
    ],
    liveDemoUrl: "#",
    filePath: "templates/netsuite-executive-dashboard-v1.0.0.zip",
    fileSizeBytes: 3_200_000,
    version: "1.0.0",
    status: "published",
    pageCount: 4,
    componentCount: 18,
    reviewCount: 3,
    averageRating: 4.7,
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-02-10T00:00:00Z",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "1",
    customerName: "James Chen",
    customerRole: "Senior Developer",
    customerCompany: "Meridian Consulting",
    rating: 5,
    title: "Saved us weeks of setup",
    body: "We needed a clean executive dashboard for our NetSuite client. This template gave us a solid starting point with proper TypeScript and well-structured components. The API integration patterns saved us from reinventing the wheel. Good value for the price.",
    verified: true,
    createdAt: "2026-01-28T00:00:00Z",
  },
  {
    id: "r2",
    productId: "1",
    customerName: "Sarah Mitchell",
    customerRole: "Technical Lead",
    customerCompany: "Apex Digital",
    rating: 5,
    title: "Clean code, well thought out",
    body: "I've tried templates from ThemeForest and the code quality difference is noticeable. Everything is properly typed, the component structure makes sense, and the dark mode implementation is solid. Extended it with a couple of extra pages for our client in under a week.",
    verified: true,
    createdAt: "2026-02-05T00:00:00Z",
  },
  {
    id: "r3",
    productId: "1",
    customerName: "David Park",
    customerRole: "Freelance Developer",
    customerCompany: "",
    rating: 4,
    title: "Great starting point for NetSuite projects",
    body: "The SuiteScript examples and REST API patterns are genuinely useful — not just placeholder code. Used it as a base for a client's executive reporting dashboard. Would be nice to see more chart types in future updates.",
    verified: true,
    createdAt: "2026-02-12T00:00:00Z",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

export function getPublishedProducts(): Product[] {
  return products.filter((p) => p.status === "published");
}
