import { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Purchase Complete",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center lg:px-8">
      {/* Success Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-light">
        <svg
          className="h-8 w-8 text-success"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      <h1 className="mt-6 text-3xl font-bold text-text-primary">
        Purchase Complete!
      </h1>
      <p className="mt-2 text-lg text-text-secondary">
        Thank you for your purchase.
      </p>

      {/* Download Card */}
      <div className="mt-8 rounded-xl border border-border bg-surface p-6 text-left">
        <h2 className="font-semibold text-text-primary">
          Your download is ready
        </h2>

        <div className="mt-4">
          <Button size="lg" className="w-full">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download Template
          </Button>
        </div>

        <p className="mt-3 text-sm text-text-secondary">
          Download link also sent to your email. Link expires in 72 hours — you
          can always re-download from your purchase confirmation page.
        </p>
      </div>

      {/* Getting Started */}
      <div className="mt-6 rounded-xl border border-border bg-surface-secondary p-6 text-left">
        <h3 className="font-semibold text-text-primary">Getting Started</h3>
        <ol className="mt-3 space-y-2 text-sm text-text-secondary">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              1
            </span>
            Unzip the downloaded file
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              2
            </span>
            Run <code className="rounded bg-surface-tertiary px-1.5 py-0.5 font-mono text-xs">npm install</code>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              3
            </span>
            Run <code className="rounded bg-surface-tertiary px-1.5 py-0.5 font-mono text-xs">npm run dev</code>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              4
            </span>
            Read the docs at <code className="rounded bg-surface-tertiary px-1.5 py-0.5 font-mono text-xs">/docs</code> in the project
          </li>
        </ol>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="outline" href="/success">
          Open purchase summary
        </Button>
        <Button variant="ghost" href="/components">
          Browse components
        </Button>
      </div>

      <p className="mt-8 text-sm text-text-tertiary">
        Need help?{" "}
        <a href="/support" className="text-primary hover:text-primary-hover">
          Contact support
        </a>
      </p>
    </div>
  );
}
