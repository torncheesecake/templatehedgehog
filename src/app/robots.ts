import { MetadataRoute } from "next";
import { buildAbsoluteUrl } from "@/config/template";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/demo/", "/templates/"],
      },
    ],
    sitemap: buildAbsoluteUrl("/sitemap.xml"),
  };
}
