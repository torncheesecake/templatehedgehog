"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LayoutPreviewStageProps {
  title: string;
  previewImageUrl: string;
  blockCount: number;
  sectionCount: number;
  className?: string;
  preload?: boolean;
}

export function LayoutPreviewStage({
  title,
  previewImageUrl,
  blockCount,
  sectionCount,
  className,
  preload = false,
}: LayoutPreviewStageProps) {
  const [previewFailed, setPreviewFailed] = useState(false);
  const hasPreview = previewImageUrl.trim().length > 0 && !previewFailed;

  return (
    <div
      className={cn(
        "relative h-[19.8rem] overflow-hidden rounded-[0.92rem] border border-[var(--th-border-dark)] bg-[var(--bg-canvas)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-9 border-b border-[var(--th-border-dark)] bg-[var(--bg-surface)]" />
      <p className="absolute left-3 top-2 z-20 text-[0.7rem] font-semibold tracking-[0.01em] text-[var(--th-text-secondary)]">
        Rendered layout preview
      </p>

      <div className="absolute inset-x-3 bottom-3 top-10 overflow-hidden rounded-[0.75rem] border border-[var(--th-border-dark)] bg-[var(--bg-surface)]">
        {hasPreview ? (
          <Image
            src={previewImageUrl}
            alt={`${title} preview`}
            fill
            sizes="(min-width: 1024px) 40vw, 92vw"
            unoptimized
            preload={preload}
            onError={() => setPreviewFailed(true)}
            className="bg-white object-cover object-top"
          />
        ) : (
          <div className="grid h-full place-items-center bg-[var(--bg-canvas)] px-5 text-center">
            <div>
              <ImageOff className="mx-auto h-6 w-6 text-[var(--th-text-secondary)]" />
              <p className="mt-3 text-[0.92rem] font-semibold text-white">
                Preview unavailable
              </p>
              <p className="mt-1 text-[0.85rem] leading-6 text-[var(--th-text-secondary)]">
                You can still review structure, blocks, and source files.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      <p className="absolute bottom-2 left-3 z-20 rounded-[0.6rem] border border-[var(--th-border-dark)] bg-[var(--bg-canvas)]/90 px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.01em] text-white">
        {blockCount} blocks • {sectionCount} sections
      </p>
    </div>
  );
}
