import type { Metadata } from "next";
import { Instrument_Sans, Source_Serif_4 } from "next/font/google";
import { TEMPLATE_CONFIG } from "@/config/template";
import { JsonLd } from "@/components/seo/JsonLd";
import { withBasePath } from "@/lib/asset-path";
import {
  buildOrganizationJsonLd,
  buildSoftwareApplicationJsonLd,
  buildWebsiteJsonLd,
  createSeoMetadata,
  DEFAULT_SEO_DESCRIPTION,
} from "@/lib/seo";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: `${TEMPLATE_CONFIG.brandName} | Production-ready email systems`,
    description: DEFAULT_SEO_DESCRIPTION,
    path: "/",
    keywords: [
      "production-ready email systems",
      "MJML email templates",
      "compiled HTML email",
      "transactional email system",
      "lifecycle email workflows",
      "developer email system",
    ],
  }),
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
    <html lang="en-GB" className={`${instrumentSans.variable} ${sourceSerif.variable}`}>
      <body className="antialiased">
        <JsonLd id="template-hedgehog-organisation" data={buildOrganizationJsonLd()} />
        <JsonLd id="template-hedgehog-website" data={buildWebsiteJsonLd()} />
        <JsonLd id="template-hedgehog-software" data={buildSoftwareApplicationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
