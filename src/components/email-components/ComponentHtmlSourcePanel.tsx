"use client";

import { useMemo, useState } from "react";
import { MjmlSourcePanel } from "@/components/ui/MjmlSourcePanel";

type HtmlSourceMode = "snippet" | "standalone";

interface ComponentHtmlSourcePanelProps {
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

export function ComponentHtmlSourcePanel({
  snippetSource,
  standaloneSource,
  componentSlug,
}: ComponentHtmlSourcePanelProps) {
  const normalisedSnippet = useMemo(() => normaliseSource(snippetSource), [snippetSource]);
  const normalisedStandalone = useMemo(
    () => normaliseSource(standaloneSource),
    [standaloneSource],
  );
  const hasTwoModes = normalisedSnippet.length > 0
    && normalisedSnippet !== normalisedStandalone;

  const [mode, setMode] = useState<HtmlSourceMode>(hasTwoModes ? "snippet" : "standalone");
  const activeMode: HtmlSourceMode = hasTwoModes ? mode : "standalone";

  const modeConfig: Record<HtmlSourceMode, ModeConfig> = {
    snippet: {
      title: "Compiled HTML snippet",
      description:
        "Component-only compiled markup for block-level inspection and HTML assembly workflows.",
      copyLabel: "Copy HTML snippet",
      successMessage: "HTML snippet copied to clipboard",
      source: normalisedSnippet,
    },
    standalone: {
      title: "Compiled standalone HTML",
      description:
        "Full compiled document including doctype, head, and body for QA or ESP handoff.",
      copyLabel: "Copy standalone HTML",
      successMessage: "Standalone HTML copied to clipboard",
      source: normalisedStandalone,
    },
  };

  const selected = modeConfig[activeMode];

  return (
    <div className="space-y-3">
      {hasTwoModes ? (
        <div
          role="group"
          aria-label="Compiled HTML copy mode"
          className="th-toggle-shell"
        >
          <button
            type="button"
            onClick={() => setMode("snippet")}
            aria-pressed={activeMode === "snippet"}
            data-active={activeMode === "snippet"}
            className="th-toggle-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
          >
            Snippet
          </button>
          <button
            type="button"
            onClick={() => setMode("standalone")}
            aria-pressed={activeMode === "standalone"}
            data-active={activeMode === "standalone"}
            className="th-toggle-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
          >
            Standalone
          </button>
        </div>
      ) : null}

      <MjmlSourcePanel
        source={selected.source}
        language="html"
        title={selected.title}
        description={selected.description}
        copyButtonLabel={selected.copyLabel}
        successMessage={selected.successMessage}
        analyticsPayload={{
          componentSlug,
          sourceType: "html",
          copyMode: activeMode,
        }}
      />
    </div>
  );
}
