"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";

interface HtmlPreviewFrameProps {
  html: string;
  title?: string;
  className?: string;
  variant?: "default" | "compact" | "component";
}

export function HtmlPreviewFrame({
  html,
  title = "Compiled email preview",
  className = "",
  variant = "default",
}: HtmlPreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [resolvedHeight, setResolvedHeight] = useState<number | null>(null);

  const settings = useMemo(() => {
    if (variant === "compact") {
      return {
        min: 360,
        max: 760,
        fallback: 520,
        wrapperClass:
          "mx-auto block w-full rounded-[0.78rem] bg-white shadow-[0_14px_30px_rgba(20, 19, 43,0.14)] md:w-[760px]",
        frameClass: "max-h-[820px]",
      };
    }

    if (variant === "component") {
      return {
        min: 280,
        max: 920,
        fallback: 460,
        wrapperClass:
          "mx-auto block w-full rounded-[0.78rem] bg-white shadow-[0_14px_30px_rgba(20, 19, 43,0.14)] md:w-[780px] lg:w-[840px] xl:w-[900px]",
        frameClass: "max-h-[940px]",
      };
    }

    return {
      min: 620,
      max: 1240,
      fallback: 900,
      wrapperClass:
        "mx-auto block w-full rounded-[0.78rem] bg-white shadow-[0_14px_30px_rgba(20, 19, 43,0.14)] md:w-[860px] lg:w-[940px] xl:w-[1040px]",
      frameClass: "max-h-[1240px]",
    };
  }, [variant]);

  const applyMeasuredHeight = useCallback(
    (frame: HTMLIFrameElement) => {
      const doc = frame.contentDocument;
      if (!doc) return;

      const body = doc.body;
      const htmlElement = doc.documentElement;
      const bodyHeight = Math.max(body?.scrollHeight ?? 0, body?.offsetHeight ?? 0);
      const fallbackHeight = Math.max(htmlElement?.scrollHeight ?? 0, htmlElement?.offsetHeight ?? 0);
      const measuredHeight = bodyHeight > 0 ? bodyHeight : fallbackHeight;

      if (!Number.isFinite(measuredHeight) || measuredHeight <= 0) {
        setResolvedHeight(settings.fallback);
        return;
      }

      const clampedHeight = Math.min(settings.max, Math.max(settings.min, measuredHeight + 8));
      setResolvedHeight(clampedHeight);
    },
    [settings.fallback, settings.max, settings.min],
  );

  const handleLoad = useCallback(
    (event: SyntheticEvent<HTMLIFrameElement>) => {
      const frame = event.currentTarget;
      applyMeasuredHeight(frame);
      window.setTimeout(() => applyMeasuredHeight(frame), 120);
      window.setTimeout(() => applyMeasuredHeight(frame), 420);
    },
    [applyMeasuredHeight],
  );

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame) return;

    const measure = () => applyMeasuredHeight(frame);
    measure();

    const shortDelay = window.setTimeout(measure, 120);
    const mediumDelay = window.setTimeout(measure, 420);
    const longDelay = window.setTimeout(measure, 1000);

    return () => {
      window.clearTimeout(shortDelay);
      window.clearTimeout(mediumDelay);
      window.clearTimeout(longDelay);
    };
  }, [applyMeasuredHeight, html]);

  return (
    <div className={`mx-auto w-full max-w-[1200px] ${className}`}>
      <div className="overflow-hidden rounded-[1rem] border border-[rgba(222, 210, 204,0.24)] bg-[linear-gradient(158deg,#FDFDFD,#fbf3f0)] shadow-[0_18px_40px_rgba(20, 19, 43,0.12)]">
        <div className="border-b border-[rgba(222, 210, 204,0.24)] bg-white/82 px-4 py-2 text-[0.78rem] font-semibold tracking-[0.01em] text-(--th-body-copy)">
          Rendered email preview
        </div>
        <div className={`${settings.frameClass} overflow-auto p-3.5 sm:p-5`}>
          <iframe
            ref={iframeRef}
            title={title}
            sandbox="allow-same-origin"
            srcDoc={html}
            className={settings.wrapperClass}
            style={{
              height: `${resolvedHeight ?? settings.fallback}px`,
            }}
            onLoad={handleLoad}
          />
        </div>
      </div>
    </div>
  );
}
