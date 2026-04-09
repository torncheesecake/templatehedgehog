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
}

export function LayoutPreviewStage({
  title,
  previewImageUrl,
  blockCount,
  sectionCount,
  className,
}: LayoutPreviewStageProps) {
  const [previewFailed, setPreviewFailed] = useState(false);
  const hasPreview = previewImageUrl.trim().length > 0 && !previewFailed;

  return (
    <div
      className={cn(
        "relative h-[19.8rem] overflow-hidden rounded-[0.92rem] border border-[rgba(222, 210, 204,0.36)] bg-[radial-gradient(circle_at_88%_0%,hsl(var(--th-accent)/0.1),transparent_44%),linear-gradient(180deg,#fdfdfd_0%,#fbf3f0_100%)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-9 border-b border-[rgba(222, 210, 204,0.34)] bg-[rgba(253,253,253,0.88)]" />
      <p className="absolute left-3 top-2 z-20 text-[0.7rem] font-semibold tracking-[0.01em] text-(--th-body-copy)">
        Rendered layout preview
      </p>

      <div className="absolute inset-x-3 bottom-3 top-10 overflow-hidden rounded-[0.75rem] border border-[rgba(222,210,204,0.34)] bg-[#ffffff] shadow-[0_12px_24px_rgba(20, 19, 43,0.12)]">
        {hasPreview ? (
          <Image
            src={previewImageUrl}
            alt={`${title} preview`}
            fill
            sizes="(min-width: 1024px) 40vw, 92vw"
            unoptimized
            onError={() => setPreviewFailed(true)}
            className="object-contain object-top"
          />
        ) : (
          <div className="grid h-full place-items-center bg-[linear-gradient(180deg,#fdfdfd_0%,#fbf3f0_100%)] px-5 text-center">
            <div>
              <ImageOff className="mx-auto h-6 w-6 text-(--hedgehog-core-blue-deep)" />
              <p className="mt-3 text-[0.92rem] font-semibold text-(--hedgehog-core-navy)">
                Preview unavailable
              </p>
              <p className="mt-1 text-[0.85rem] leading-6 text-(--th-body-copy)">
                You can still review structure, blocks, and source files.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[rgba(20, 19, 43,0.16)] via-transparent to-transparent" />
      <p className="absolute bottom-2 left-3 z-20 rounded-full bg-[rgba(253,253,253,0.9)] px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.01em] text-(--th-body-copy)">
        {blockCount} blocks • {sectionCount} sections
      </p>
    </div>
  );
}
