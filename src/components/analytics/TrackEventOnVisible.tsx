"use client";

import { useEffect, useRef } from "react";
import { track, type AnalyticsPayload, type EventName } from "@/lib/analytics";

interface TrackEventOnVisibleProps {
  targetId: string;
  event: EventName;
  payload?: AnalyticsPayload;
  threshold?: number;
  rootMargin?: string;
}

export function TrackEventOnVisible({
  targetId,
  event,
  payload,
  threshold = 0.35,
  rootMargin = "0px",
}: TrackEventOnVisibleProps) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current || typeof window === "undefined") {
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasTrackedRef.current) {
          return;
        }

        hasTrackedRef.current = true;
        track(event, payload ?? {});
        observer.disconnect();
      },
      { threshold, rootMargin },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [event, payload, rootMargin, targetId, threshold]);

  return null;
}

