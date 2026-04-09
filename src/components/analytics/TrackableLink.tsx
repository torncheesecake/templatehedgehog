"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track, type AnalyticsPayload, type EventName } from "@/lib/analytics";

type TrackableLinkProps = Omit<ComponentProps<typeof Link>, "onClick"> & {
  event: EventName;
  payload?: AnalyticsPayload;
};

export function TrackableLink({
  event,
  payload,
  href,
  children,
  ...rest
}: TrackableLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => track(event, payload ?? {})}
      {...rest}
    >
      {children}
    </Link>
  );
}
