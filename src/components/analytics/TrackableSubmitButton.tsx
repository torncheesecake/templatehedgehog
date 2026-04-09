"use client";

import { track, type AnalyticsPayload, type EventName } from "@/lib/analytics";

interface TrackableSubmitButtonProps {
  label: string;
  event: EventName;
  payload?: AnalyticsPayload;
  disabled?: boolean;
  className?: string;
}

export function TrackableSubmitButton({
  label,
  event,
  payload,
  disabled = false,
  className = "",
}: TrackableSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={() => track(event, payload ?? {})}
      className={className}
    >
      {label}
    </button>
  );
}
