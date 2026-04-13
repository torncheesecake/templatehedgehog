import type { Metadata } from "next";
import { TEMPLATE_CONFIG } from "@/config/template";
import { withBasePath } from "@/lib/asset-path";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(TEMPLATE_CONFIG.siteUrl),
  title: `${TEMPLATE_CONFIG.brandName} | Workflow-first MJML system for developers`,
  description:
    "A workflow-first MJML system for developers who need production-ready email builds, cleaner QA handoff, and reusable implementation structure.",
  icons: {
    icon: withBasePath("/icon-uxwing.svg"),
    shortcut: withBasePath("/icon-uxwing.svg"),
    apple: withBasePath("/icon-uxwing.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
