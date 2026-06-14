import type { Metadata } from "next";
import Script from "next/script";
import { Instrument_Sans, Source_Serif_4 } from "next/font/google";
import { TEMPLATE_CONFIG } from "@/config/template";
import { JsonLd } from "@/components/seo/JsonLd";
import { withBasePath } from "@/lib/asset-path";
import {
  buildOrganizationJsonLd,
  buildSoftwareApplicationJsonLd,
  buildWebsiteJsonLd,
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

const GOOGLE_TAG_ID = "G-7DTS6Z1FN1";

// Global, non-route-specific metadata only. Each page owns its own title,
// description, canonical, and Open Graph through createSeoMetadata so there is
// a single owner per URL (the homepage owns "/").
export const metadata: Metadata = {
  metadataBase: new URL(TEMPLATE_CONFIG.siteUrl),
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_TAG_ID}');
          `}
        </Script>
        <JsonLd id="template-hedgehog-organisation" data={buildOrganizationJsonLd()} />
        <JsonLd id="template-hedgehog-website" data={buildWebsiteJsonLd()} />
        <JsonLd id="template-hedgehog-software" data={buildSoftwareApplicationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
