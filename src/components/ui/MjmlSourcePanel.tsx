"use client";

import { CodeBlock, type CodeLanguage } from "@/components/ui/CodeBlock";
import type { AnalyticsPayload } from "@/lib/analytics";

interface MjmlSourcePanelProps {
  source: string;
  language?: CodeLanguage;
  title?: string;
  description?: string;
  wrapLines?: boolean;
  copyButtonLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  analyticsPayload?: AnalyticsPayload;
  className?: string;
}

export function MjmlSourcePanel({
  source,
  language = "mjml",
  title = "MJML source",
  description = "Starter source for this component.",
  wrapLines = false,
  copyButtonLabel = "Copy MJML",
  successMessage = "MJML copied to clipboard",
  errorMessage = "Could not copy. Please copy manually.",
  analyticsPayload,
  className = "",
}: MjmlSourcePanelProps) {
  const analyticsEvent = language === "html" ? "copy_html" : "copy_mjml";

  return (
    <CodeBlock
      code={source}
      language={language}
      label={title}
      description={description}
      wrapLines={wrapLines}
      copyButtonLabel={copyButtonLabel}
      successMessage={successMessage}
      errorMessage={errorMessage}
      analyticsEvent={analyticsEvent}
      analyticsPayload={analyticsPayload}
      className={className}
    />
  );
}
