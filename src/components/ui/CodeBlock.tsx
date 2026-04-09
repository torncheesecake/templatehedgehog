"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Loader2 } from "lucide-react";
import { Toast, type ToastVariant } from "@/components/ui/toast";
import { track, type AnalyticsPayload, type EventName } from "@/lib/analytics";
import { copyTextToClipboard } from "@/lib/clipboard";

export type CodeLanguage = "mjml" | "html";

interface CodeBlockProps {
  code: string;
  language: CodeLanguage;
  label: string;
  description?: string;
  wrapLines?: boolean;
  copyButtonLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  analyticsEvent?: EventName;
  analyticsPayload?: AnalyticsPayload;
  className?: string;
}

type ToastState = {
  open: boolean;
  message: string;
  variant: ToastVariant;
};

const codeFormatCache = new Map<string, string>();
const codeHighlightCache = new Map<string, string>();

let prettierStandalonePromise: Promise<typeof import("prettier/standalone")> | null = null;
let prettierHtmlPluginPromise: Promise<typeof import("prettier/plugins/html")> | null = null;
let shikiPromise: Promise<typeof import("shiki")> | null = null;

const SHIKI_THEME = "github-dark-default";

function normaliseSource(source: string): string {
  return source.replace(/\r\n/g, "\n").trim();
}

function escapeHtml(source: string): string {
  return source
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function fallbackHighlightedHtml(code: string): string {
  return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
}

async function getFormattedCode(code: string): Promise<string> {
  const cacheKey = code;
  const cached = codeFormatCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    prettierStandalonePromise ??= import("prettier/standalone");
    prettierHtmlPluginPromise ??= import("prettier/plugins/html");
    const [prettierStandalone, prettierHtmlPlugin] = await Promise.all([
      prettierStandalonePromise,
      prettierHtmlPluginPromise,
    ]);

    const htmlPlugin = (
      prettierHtmlPlugin as unknown as { default?: unknown }
    ).default ?? prettierHtmlPlugin;
    const formatted = await prettierStandalone.format(code, {
      parser: "html",
      plugins: [htmlPlugin],
      printWidth: 110,
      tabWidth: 2,
      useTabs: false,
      htmlWhitespaceSensitivity: "ignore",
    });
    const normalised = normaliseSource(formatted);
    codeFormatCache.set(cacheKey, normalised);
    return normalised;
  } catch {
    const normalised = normaliseSource(code);
    codeFormatCache.set(cacheKey, normalised);
    return normalised;
  }
}

async function getHighlightedHtml(code: string): Promise<string> {
  const cacheKey = `${SHIKI_THEME}::${code}`;
  const cached = codeHighlightCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    shikiPromise ??= import("shiki");
    const shiki = await shikiPromise;
    const highlighted = await shiki.codeToHtml(code, {
      lang: "html",
      theme: SHIKI_THEME,
    });
    codeHighlightCache.set(cacheKey, highlighted);
    return highlighted;
  } catch {
    const fallback = fallbackHighlightedHtml(code);
    codeHighlightCache.set(cacheKey, fallback);
    return fallback;
  }
}

export function CodeBlock({
  code,
  language,
  label,
  description,
  wrapLines = false,
  copyButtonLabel = "Copy code",
  successMessage = "Code copied to clipboard",
  errorMessage = "Could not copy code. Please copy manually.",
  analyticsEvent,
  analyticsPayload,
  className = "",
}: CodeBlockProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    variant: "success",
  });
  const [liveMessage, setLiveMessage] = useState("");
  const initialCode = useMemo(() => normaliseSource(code), [code]);
  const [formattedCode, setFormattedCode] = useState(initialCode);
  const [highlightedHtml, setHighlightedHtml] = useState(() => fallbackHighlightedHtml(initialCode));
  const [isPreparing, setIsPreparing] = useState(false);

  useEffect(() => {
    if (!toast.open) return;

    const timeout = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [toast.open]);

  useEffect(() => {
    let cancelled = false;
    const prepare = async () => {
      setIsPreparing(true);
      const nextFormatted = await getFormattedCode(initialCode);
      const nextHighlighted = await getHighlightedHtml(nextFormatted);

      if (!cancelled) {
        setFormattedCode(nextFormatted);
        setHighlightedHtml(nextHighlighted);
        setIsPreparing(false);
      }
    };

    prepare().catch(() => {
      if (!cancelled) {
        setFormattedCode(initialCode);
        setHighlightedHtml(fallbackHighlightedHtml(initialCode));
        setIsPreparing(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [initialCode, language]);

  const showToast = (message: string, variant: ToastVariant) => {
    setToast({ open: true, message, variant });
    setLiveMessage(message);
  };

  const handleCopy = async () => {
    if (isCopying || isPreparing) return;
    if (!formattedCode.trim()) {
      showToast(errorMessage, "error");
      return;
    }

    setIsCopying(true);
    try {
      const result = await copyTextToClipboard(formattedCode);
      if (result.ok) {
        showToast(successMessage, "success");
        if (analyticsEvent) {
          track(analyticsEvent, analyticsPayload ?? {});
        }
      } else {
        showToast(errorMessage, "error");
      }
    } catch {
      showToast(errorMessage, "error");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <>
      <article
        className={`dune-strip overflow-hidden ${className}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(222, 210, 204,0.2)] px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[1.1rem] font-semibold text-(--foreground)">
              {label}
            </h2>
            {description ? (
              <p className="mt-1 text-[0.9rem] text-(--dune-muted)">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            disabled={isCopying || isPreparing}
            className="dune-button-solid inline-flex h-10 items-center gap-2 px-4 text-[0.8rem] font-semibold uppercase tracking-[0.06em] transition disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-offset-2"
          >
            {isCopying || isPreparing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {isCopying ? "Copying" : "Formatting"}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden="true" />
                {copyButtonLabel}
              </>
            )}
          </button>
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {liveMessage}
        </p>
        <div
          tabIndex={0}
          aria-label={`${label} code block`}
          className="th-code-scroll max-h-[620px] overflow-auto rounded-b-[1rem] border-t border-[hsl(var(--th-accent)/0.18)] bg-[#0b1324] focus:outline-none focus-visible:ring-2 focus-visible:ring-(--dune-focus) focus-visible:ring-inset"
        >
          <div
            className="th-code-surface p-5 sm:p-6"
            data-wrap-lines={wrapLines ? "true" : "false"}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </div>
      </article>
      <Toast open={toast.open} message={toast.message} variant={toast.variant} />
    </>
  );
}
