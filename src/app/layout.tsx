import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Roboto_Serif, Space_Mono } from "next/font/google";
import { TEMPLATE_CONFIG } from "@/config/template";
import { withBasePath } from "@/lib/asset-path";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const robotoSerif = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

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
      <body className={`${manrope.variable} ${robotoSerif.variable} ${spaceMono.variable} ${jetBrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
