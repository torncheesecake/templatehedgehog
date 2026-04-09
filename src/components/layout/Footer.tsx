import Link from "next/link";
import { TEMPLATE_CONFIG } from "@/config/template";

const footerLinks = {
  Product: [
    { name: "NetSuite Dashboard", href: "/templates/netsuite-executive-dashboard" },
    { name: "Live Demo", href: "#" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Support", href: "/support" },
    { name: "Changelog", href: "/changelog" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refunds" },
    { name: "Licence", href: "/licence" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-secondary">
      {/* Trust Bar */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-8 px-6 py-6 lg:px-8">
          <TrustItem icon="shield" text="Secure Checkout via Stripe" />
          <TrustItem icon="refresh" text="30-Day Money-Back Guarantee" />
          <TrustItem icon="download" text="6 Months of Bug Fixes" />
          <TrustItem icon="code" text="Full Source Code" />
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-white">TH</span>
              </div>
              <span className="text-lg font-bold text-text-primary">
                {TEMPLATE_CONFIG.brandName}
              </span>
            </Link>
            <p className="mt-4 text-sm text-text-secondary">
              A focused executive overview dashboard for NetSuite.
              Built by a senior developer, for developers.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-text-primary">
                {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-text-tertiary">
            &copy; {new Date().getFullYear()} {TEMPLATE_CONFIG.brandName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function TrustItem({ icon, text }: { icon: string; text: string }) {
  const icons: Record<string, React.ReactNode> = {
    shield: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    refresh: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l-2 2" />
      </svg>
    ),
    download: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    code: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-2 text-sm text-text-secondary">
      <span className="text-primary">{icons[icon]}</span>
      <span>{text}</span>
    </div>
  );
}
