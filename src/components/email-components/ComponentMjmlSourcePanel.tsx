"use client";

import { useMemo, useState } from "react";
import { MjmlSourcePanel } from "@/components/ui/MjmlSourcePanel";

type MjmlSourceMode = "snippet" | "standalone";

interface ComponentMjmlSourcePanelProps {
  snippetSource: string;
  standaloneSource: string;
  componentSlug: string;
}

type ModeConfig = {
  title: string;
  description: string;
  copyLabel: string;
  successMessage: string;
  source: string;
};

function normaliseSource(source: string): string {
  return source.replace(/\r\n/g, "\n").trim();
}

export function ComponentMjmlSourcePanel({
  snippetSource,
  standaloneSource,
  componentSlug,
}: ComponentMjmlSourcePanelProps) {
  const normalisedSnippet = useMemo(() => normaliseSource(snippetSource), [snippetSource]);
  const normalisedStandalone = useMemo(
    () => normaliseSource(standaloneSource),
    [standaloneSource],
  );
  const hasTwoModes = normalisedSnippet.length > 0
    && normalisedSnippet !== normalisedStandalone;

  const [mode, setMode] = useState<MjmlSourceMode>(hasTwoModes ? "snippet" : "standalone");
  const activeMode: MjmlSourceMode = hasTwoModes ? mode : "standalone";

  const modeConfig: Record<MjmlSourceMode, ModeConfig> = {
    snippet: {
      title: "MJML snippet",
      description:
        "Component block only. Use this when assembling an email from multiple reusable sections inside a project that already includes the shared MJML classes.",
      copyLabel: "Copy snippet",
      successMessage: "MJML snippet copied to clipboard",
      source: normalisedSnippet,
    },
    standalone: {
      title: "Standalone MJML",
      description:
        "Full file with framework and wrapper so this block compiles independently.",
      copyLabel: "Copy standalone MJML",
      successMessage: "Standalone MJML copied to clipboard",
      source: normalisedStandalone,
    },
  };

  const selected = modeConfig[activeMode];

  return (
    <div className="min-w-0 space-y-3">
      {hasTwoModes ? (
        <div
          role="group"
          aria-label="MJML copy mode"
          className="inline-flex rounded-[0.88rem] border border-[var(--th-border-dark)] bg-[var(--bg-canvas)] p-[0.35rem]"
        >
          <button
            type="button"
            onClick={() => setMode("snippet")}
            aria-pressed={activeMode === "snippet"}
            data-active={activeMode === "snippet"}
            className="inline-flex h-10 items-center rounded-[0.62rem] px-4 text-[0.94rem] font-semibold text-[var(--th-text-muted)] transition-colors hover:bg-[var(--bg-accent-soft)] hover:text-[var(--text-primary)] data-[active=true]:bg-[var(--action-primary)] data-[active=true]:!text-[var(--action-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
          >
            Snippet
          </button>
          <button
            type="button"
            onClick={() => setMode("standalone")}
            aria-pressed={activeMode === "standalone"}
            data-active={activeMode === "standalone"}
            className="inline-flex h-10 items-center rounded-[0.62rem] px-4 text-[0.94rem] font-semibold text-[var(--th-text-muted)] transition-colors hover:bg-[var(--bg-accent-soft)] hover:text-[var(--text-primary)] data-[active=true]:bg-[var(--action-primary)] data-[active=true]:!text-[var(--action-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)] focus-visible:ring-offset-2"
          >
            Standalone
          </button>
        </div>
      ) : null}

      {activeMode === "snippet" ? (
        <p className="rounded-[0.82rem] border border-[var(--border-strong)] bg-[var(--bg-accent-soft)] px-3.5 py-2.5 text-[0.88rem] leading-6 text-[var(--text-primary)]">
          Snippet assembly: place this block inside the same <code className="font-semibold">&lt;mj-body&gt;</code> as your
          other snippets, then stack sections in send order.
        </p>
      ) : null}

      <MjmlSourcePanel
        source={selected.source}
        title={selected.title}
        description={selected.description}
        copyButtonLabel={selected.copyLabel}
        successMessage={selected.successMessage}
        analyticsPayload={{
          componentSlug,
          sourceType: "mjml",
          copyMode: activeMode,
        }}
      />
    </div>
  );
}
