import { MetadataRoute } from "next";
import { TEMPLATE_CONFIG } from "@/config/template";
import { emailComponents } from "@/data/email-components";
import { emailLayouts } from "@/data/email-layouts";
import { emailWorkflows } from "@/data/workflows";
import { PACK_LAST_UPDATED } from "@/lib/versioning";

export const dynamic = "force-static";

const SITE_URL = TEMPLATE_CONFIG.siteUrl;
const lastModified = new Date(PACK_LAST_UPDATED);

function buildEntry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    buildEntry("/", 1, "weekly"),
    buildEntry("/components", 0.95, "weekly"),
    buildEntry("/layouts", 0.9, "weekly"),
    buildEntry("/workflows", 0.88, "weekly"),
    buildEntry("/docs", 0.8, "monthly"),
    buildEntry("/pricing", 0.8, "weekly"),
    buildEntry("/pack", 0.75, "weekly"),
    buildEntry("/changelog", 0.65, "monthly"),
  ];

  const componentPages: MetadataRoute.Sitemap = emailComponents.map((component) =>
    buildEntry(`/components/${component.slug}`, 0.85, "weekly"),
  );

  const layoutPages: MetadataRoute.Sitemap = emailLayouts.map((layout) =>
    buildEntry(`/layouts/${layout.slug}`, 0.78, "weekly"),
  );

  const workflowPages: MetadataRoute.Sitemap = emailWorkflows.map((workflow) =>
    buildEntry(`/workflows/${workflow.slug}`, 0.8, "weekly"),
  );

  return [...staticPages, ...componentPages, ...layoutPages, ...workflowPages];
}
