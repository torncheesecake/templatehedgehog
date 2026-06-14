import type { MetadataRoute } from "next";
import { TEMPLATE_CONFIG } from "@/config/template";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${TEMPLATE_CONFIG.brandName} - Production email workflow`,
    short_name: TEMPLATE_CONFIG.brandName,
    description:
      "Editable MJML source, compiled HTML, previews, QA notes, workflow examples, and handoff guidance for production email.",
    start_url: "/",
    scope: "/",
    display: "minimal-ui",
    background_color: "#ffffff",
    theme_color: "#050505",
    icons: [
      {
        src: "/icon-uxwing.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/brand/hedgehog-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
