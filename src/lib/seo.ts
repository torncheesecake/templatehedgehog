import type { Metadata } from "next";
import {
  buildAbsoluteUrl,
  createPageTitle,
  PRICING_TIERS,
  TEMPLATE_CONFIG,
} from "@/config/template";

type PageType = "website" | "article";

type SeoMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: PageType;
  image?: string;
  noIndex?: boolean;
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

export const DEFAULT_SEO_DESCRIPTION =
  "Template Hedgehog is an Artifexa product for teams shipping production-ready MJML, compiled HTML, lifecycle email, and transactional email systems.";

function ensureAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return buildAbsoluteUrl(pathOrUrl);
}

function normaliseTitle(title: string): string {
  if (title.includes(TEMPLATE_CONFIG.brandName)) {
    return title;
  }

  return createPageTitle(title);
}

export function createSeoMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
  image = "/opengraph-image",
  noIndex = false,
}: SeoMetadataOptions): Metadata {
  const resolvedTitle = normaliseTitle(title);
  const canonicalUrl = ensureAbsoluteUrl(path);
  const imageUrl = ensureAbsoluteUrl(image);

  return {
    metadataBase: new URL(TEMPLATE_CONFIG.siteUrl),
    title: resolvedTitle,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url: canonicalUrl,
      siteName: TEMPLATE_CONFIG.brandName,
      type,
      locale: "en_GB",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${TEMPLATE_CONFIG.brandName} production email system preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export function buildOrganizationJsonLd() {
  const ownerUrl = TEMPLATE_CONFIG.owner.url ?? TEMPLATE_CONFIG.siteUrl;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${TEMPLATE_CONFIG.siteUrl}/#organisation`,
    name: TEMPLATE_CONFIG.owner.name,
    url: ownerUrl,
    brand: {
      "@type": "Brand",
      name: TEMPLATE_CONFIG.brandName,
      url: TEMPLATE_CONFIG.siteUrl,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: TEMPLATE_CONFIG.supportEmail,
      areaServed: "GB",
      availableLanguage: ["en-GB"],
    },
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${TEMPLATE_CONFIG.siteUrl}/#website`,
    name: TEMPLATE_CONFIG.brandName,
    url: TEMPLATE_CONFIG.siteUrl,
    description: DEFAULT_SEO_DESCRIPTION,
    inLanguage: "en-GB",
    publisher: {
      "@id": `${TEMPLATE_CONFIG.siteUrl}/#organisation`,
    },
  };
}

export function buildProductJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${TEMPLATE_CONFIG.siteUrl}/pricing#product`,
    name: TEMPLATE_CONFIG.brandName,
    brand: {
      "@type": "Brand",
      name: TEMPLATE_CONFIG.brandName,
    },
    manufacturer: {
      "@id": `${TEMPLATE_CONFIG.siteUrl}/#organisation`,
    },
    seller: {
      "@id": `${TEMPLATE_CONFIG.siteUrl}/#organisation`,
    },
    category: "DeveloperApplication",
    image: TEMPLATE_CONFIG.urls.openGraphImage,
    description: DEFAULT_SEO_DESCRIPTION,
    offers: PRICING_TIERS.map((tier) => ({
      "@type": "Offer",
      name: `${TEMPLATE_CONFIG.brandName} ${tier.name}`,
      description: tier.position,
      price: String(tier.priceGbp),
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `${TEMPLATE_CONFIG.urls.pricing}#${tier.id}`,
    })),
  };
}

export function buildSoftwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${TEMPLATE_CONFIG.siteUrl}/#software-application`,
    name: TEMPLATE_CONFIG.brandName,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web, MJML, HTML",
    url: TEMPLATE_CONFIG.siteUrl,
    image: TEMPLATE_CONFIG.urls.openGraphImage,
    description: DEFAULT_SEO_DESCRIPTION,
    creator: {
      "@id": `${TEMPLATE_CONFIG.siteUrl}/#organisation`,
    },
    publisher: {
      "@id": `${TEMPLATE_CONFIG.siteUrl}/#organisation`,
    },
    offers: PRICING_TIERS.map((tier) => ({
      "@type": "Offer",
      name: `${TEMPLATE_CONFIG.brandName} ${tier.name}`,
      price: String(tier.priceGbp),
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
      url: `${TEMPLATE_CONFIG.urls.pricing}#${tier.id}`,
    })),
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: ensureAbsoluteUrl(item.path),
    })),
  };
}
