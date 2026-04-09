"use client";

import { useMemo, useState } from "react";
import { WaitlistForm } from "@/components/WaitlistForm";

type LeadTrack = {
  id: string;
  label: string;
  hint: string;
  source: string;
  buttonLabel: string;
};

const leadTracks: LeadTrack[] = [
  {
    id: "early-access",
    label: "Early access",
    hint: "First release wave with launch notes.",
    source: "homepage-early-access",
    buttonLabel: "Join early access",
  },
  {
    id: "beta-testers",
    label: "Beta testers",
    hint: "Hands-on feedback group before public release.",
    source: "homepage-beta-testers",
    buttonLabel: "Apply for beta",
  },
  {
    id: "launch-notifications",
    label: "Launch notifications",
    hint: "Release alerts for every new premium template.",
    source: "homepage-launch-notifications",
    buttonLabel: "Get launch alerts",
  },
  {
    id: "discount-alerts",
    label: "Discount alerts",
    hint: "Time-limited pricing and bundle updates.",
    source: "homepage-discount-alerts",
    buttonLabel: "Get discount alerts",
  },
];

export function LeadCaptureOptions() {
  const [selectedTrackId, setSelectedTrackId] = useState(leadTracks[0].id);

  const selectedTrack = useMemo(
    () => leadTracks.find((track) => track.id === selectedTrackId) ?? leadTracks[0],
    [selectedTrackId],
  );

  return (
    <div className="rounded-2xl bg-(--hedgehog-core-navy) p-4 sm:p-5">
      <p className="text-[1rem] font-semibold uppercase tracking-[0.09em] text-(--dune-muted)">Choose your buyer track</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {leadTracks.map((track) => {
          const active = track.id === selectedTrackId;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setSelectedTrackId(track.id)}
              className={`rounded-lg border px-3 py-2.5 text-left transition ${
                active
                  ? "border-(--accent-primary) bg-(--hedgehog-core-blue-deep) text-(--text-primary-dark)"
                  : "border-(--hedgehog-core-blue-deep) bg-(--hedgehog-core-navy) text-(--dune-muted) hover:border-(--accent-primary)"
              }`}
            >
              <p className="text-[0.96rem] font-semibold">{track.label}</p>
              <p className="mt-1 text-[0.84rem] leading-6 text-(--dune-muted)">{track.hint}</p>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[0.95rem] text-[#f7e9e3]">Selected: {selectedTrack.label}</p>
      <p className="mt-1 text-[0.9rem] text-(--dune-muted)">{selectedTrack.hint}</p>

      <div className="mt-4">
        <WaitlistForm
          className="max-w-none"
          source={selectedTrack.source}
          buttonLabel={selectedTrack.buttonLabel}
          placeholder="you@company.com"
        />
      </div>
    </div>
  );
}
