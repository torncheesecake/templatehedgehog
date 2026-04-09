"use client";

import { useEffect } from "react";
import { track, type AnalyticsPayload, type EventName } from "@/lib/analytics";

interface TrackEventOnMountProps {
  event: EventName;
  payload?: AnalyticsPayload;
}

export function TrackEventOnMount({ event, payload }: TrackEventOnMountProps) {
  useEffect(() => {
    track(event, payload ?? {});
  }, [event, payload]);

  return null;
}
