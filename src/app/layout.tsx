import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Roboto_Serif, Space_Mono } from "next/font/google";
import { TEMPLATE_CONFIG } from "@/config/template";
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
  title: `${TEMPLATE_CONFIG.brandName} | Premium MJML Components for Developers`,
  description:
    "A premium MJML component library for developers who need reliable email building blocks, rendered previews, and cleaner handoff.",
  icons: {
    icon: "/icon-uxwing.svg",
    shortcut: "/icon-uxwing.svg",
    apple: "/icon-uxwing.svg",
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
