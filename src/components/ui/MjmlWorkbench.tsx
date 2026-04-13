"use client";

import { useEffect, useState } from "react";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { HtmlPreviewFrame } from "@/components/ui/HtmlPreviewFrame";
import { Toast, type ToastVariant } from "@/components/ui/toast";
import { track } from "@/lib/analytics";
import { copyTextToClipboard } from "@/lib/clipboard";

interface MjmlWorkbenchProps {
  initialMjml: string;
  initialCompiledHtml: string | null;
  title: string;
  description: string;
  showPreviewByDefault?: boolean;
  analyticsSlugPayload: {
    componentSlug?: string;
    layoutSlug?: string;
  };
}

type ToastState = {
  open: boolean;
  message: string;
  variant: ToastVariant;
};

type CompileResponse = {
  html?: string;
  error?: string;
};

export function MjmlWorkbench({
  initialMjml,
  initialCompiledHtml,
  title,
  description,
  showPreviewByDefault = false,
  analyticsSlugPayload,
}: MjmlWorkbenchProps) {
  const canCompileInBrowser = process.env.NODE_ENV !== "production";
  const [mjmlSource, setMjmlSource] = useState(initialMjml);
  const [renderedHtml, setRenderedHtml] = useState(initialCompiledHtml);
  const [isPreviewVisible, setIsPreviewVisible] = useState(showPreviewByDefault);
  const [showCompiledHtml, setShowCompiledHtml] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    variant: "success",
  });
  const [liveMessage, setLiveMessage] = useState("");

  useEffect(() => {
    if (!toast.open) return;
    const timeout = window.setTimeout(() => {
      setToast((previous) => ({ ...previous, open: false }));
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [toast.open]);

  const showToast = (message: string, variant: ToastVariant) => {
    setToast({ open: true, message, variant });
    setLiveMessage(message);
  };

  const handleCopyMjml = async () => {
    if (!mjmlSource.trim()) {
      showToast("Could not copy MJML. Please copy manually.", "error");
      return;
    }

    try {
      const result = await copyTextToClipboard(mjmlSource);
      if (!result.ok) {
        throw new Error("copy_failed");
      }
      track("copy_mjml", {
        ...analyticsSlugPayload,
        sourceType: "mjml",
      });
      showToast("MJML copied to clipboard", "success");
    } catch {
      showToast("Could not copy MJML. Please copy manually.", "error");
    }
  };

  const handleCompile = async () => {
    if (!canCompileInBrowser || isCompiling) return;

    setIsCompiling(true);
    setCompileError(null);

    try {
      const response = await fetch("/api/mjml/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mjml: mjmlSource }),
      });

      const data = (await response.json()) as CompileResponse;
      if (!response.ok || typeof data.html !== "string") {
        const message =
          typeof data.error === "string" && data.error.length > 0
            ? data.error
            : "MJML compile failed.";
        throw new Error(message);
      }

      setRenderedHtml(data.html);
      setShowCompiledHtml(true);
      showToast("Compiled HTML updated", "success");
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "MJML compile failed.";
      setCompileError(message);
      showToast("Compile failed. Check MJML source and try again.", "error");
    } finally {
      setIsCompiling(false);
    }
  };

  const handleReset = () => {
    setMjmlSource(initialMjml);
    setRenderedHtml(initialCompiledHtml);
    setShowCompiledHtml(false);
    setCompileError(null);
    showToast("Original MJML restored", "success");
  };

  return (
    <div className="grid gap-7">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <article className="border-l-2 border-[rgba(111,71,37,0.46)] pl-4 sm:pl-5">
          <h2 className="text-[1.24rem] font-semibold text-slate-900">
            Rendered preview
          </h2>
          <p className="mt-2 text-[0.98rem] leading-7 text-slate-500">
            {description}
          </p>
          <p className="mt-2 text-[0.9rem] text-[#7a5d3f]">
            {renderedHtml
              ? "Compiled HTML is loaded and ready for preview."
              : "HTML preview appears after compile succeeds."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsPreviewVisible((previous) => !previous)}
              className="inline-flex h-10 items-center px-2 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-[#5c3d20] transition hover:text-[#3f2716] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
            >
              {isPreviewVisible ? "Hide preview" : "Show preview"}
            </button>
            <button
              type="button"
              onClick={handleCompile}
              disabled={isCompiling || !canCompileInBrowser}
              className="inline-flex h-10 items-center rounded-[0.8rem] border border-[#d13d4c] bg-[#d13d4c] px-4 text-[0.8rem] font-semibold uppercase tracking-[0.06em] !text-white transition hover:bg-[#b93340] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d13d4c] focus-visible:ring-offset-2"
            >
              {isCompiling
                ? "Compiling..."
                : canCompileInBrowser
                  ? "Compile to HTML"
                  : "Compile disabled in production"}
            </button>
            <button
              type="button"
              onClick={() => setShowCompiledHtml((previous) => !previous)}
              disabled={!renderedHtml}
              className="inline-flex h-10 items-center px-2 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-[#5c3d20] transition hover:text-[#3f2716] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
            >
              {showCompiledHtml ? "Hide compiled HTML" : "Show compiled HTML"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-10 items-center px-2 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-[#5c3d20] transition hover:text-[#3f2716] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
            >
              Reset source
            </button>
          </div>

          {!canCompileInBrowser ? (
            <p className="mt-3 text-[0.9rem] text-[#7a5d3f]">
              Browser compile is intentionally disabled in production. Compile MJML during trusted build steps.
            </p>
          ) : null}

          <div className="mt-4 rounded-[1rem] border border-black/10 bg-white p-3 sm:p-4">
            {isPreviewVisible && renderedHtml ? (
              <HtmlPreviewFrame html={renderedHtml} />
            ) : isPreviewVisible ? (
              <div className="rounded-lg border border-[#bc7963] bg-[#fbe9e2] px-4 py-3 text-[0.95rem] leading-7 text-[#7a2f20]">
                HTML preview unavailable until compile succeeds.
              </div>
            ) : (
              <div className="rounded-lg bg-[rgba(252,241,223,0.6)] px-4 py-3 text-[0.95rem] leading-7 text-slate-500">
                Preview is hidden to keep focus on editing. Show it when you need a visual QA pass.
              </div>
            )}

            {compileError ? (
              <div className="mt-3 rounded-lg border border-[#bc7963] bg-[#fbe9e2] px-4 py-3 text-[0.92rem] leading-7 text-[#7a2f20]">
                {compileError}
              </div>
            ) : null}
          </div>
        </article>

        <article className="border-l-2 border-[rgba(111,71,37,0.46)] pl-4 sm:pl-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[1.24rem] font-semibold text-slate-900">
                {title}
              </h2>
              <p className="mt-2 text-[0.98rem] leading-7 text-slate-500">
                Edit source first. Compile only when you need delivery HTML.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyMjml}
              className="inline-flex h-10 items-center rounded-[0.8rem] border border-[#d13d4c] bg-[#d13d4c] px-4 text-[0.8rem] font-semibold uppercase tracking-[0.06em] !text-white transition hover:bg-[#b93340] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d13d4c] focus-visible:ring-offset-2"
            >
              Copy MJML
            </button>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {liveMessage}
          </p>

          <div className="mt-4 overflow-hidden rounded-[1rem] border border-black/10 bg-white p-0">
            <label htmlFor="mjml-editor" className="sr-only">
              MJML source editor
            </label>
            <textarea
              id="mjml-editor"
              value={mjmlSource}
              onChange={(event) => setMjmlSource(event.target.value)}
              spellCheck={false}
              className="min-h-[640px] w-full resize-y border-0 bg-[#2c2014] p-4 font-mono text-[0.9rem] leading-7 text-[#f4e7cf] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c1894c]"
            />
          </div>
        </article>
      </div>

      {showCompiledHtml && renderedHtml ? (
        <CodeBlock
          code={renderedHtml}
          language="html"
          label="Compiled HTML"
          description="Generated delivery output from your current MJML source."
          copyButtonLabel="Copy HTML"
          successMessage="HTML copied to clipboard"
          errorMessage="Could not copy HTML. Please copy manually."
          analyticsEvent="copy_html"
          analyticsPayload={{
            ...analyticsSlugPayload,
            sourceType: "html",
          }}
        />
      ) : null}

      <Toast open={toast.open} message={toast.message} variant={toast.variant} />
    </div>
  );
}
