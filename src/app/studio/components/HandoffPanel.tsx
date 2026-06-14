import { ChevronDown } from "lucide-react";
import type { StudioPlatform, StudioWorkflowWorkspace, StudioWorkspaceData } from "@/data/studio";
import { SectionHeading } from "./studioControls";

export function HandoffPanel({
  guidance,
  onCopySteps,
  platformGuidance,
  selectedPlatform,
  onSelectPlatform,
  workflow,
}: {
  guidance: StudioWorkspaceData["platformGuidance"][number];
  onCopySteps: () => void;
  platformGuidance: StudioWorkspaceData["platformGuidance"];
  selectedPlatform: StudioPlatform;
  onSelectPlatform: (platform: StudioPlatform) => void;
  workflow: StudioWorkflowWorkspace;
}) {
  const workflowFocus = getWorkflowHandoffFocus(workflow);

  return (
    <section className="space-y-3">
      <SectionHeading>Handoff mode</SectionHeading>
      <div>
        <label htmlFor="studio-platform" className="text-[0.78rem] font-semibold text-slate-300">
          Target platform
        </label>
        <div className="relative mt-2">
          <select
            id="studio-platform"
            value={selectedPlatform}
            onChange={(event) => onSelectPlatform(event.target.value as StudioPlatform)}
            className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-[#071421] px-3 pr-9 text-[0.8rem] text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
          >
            {platformGuidance.map((item) => (
              <option key={item.platform} value={item.platform}>
                {item.platform}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-[0.74rem] leading-5 text-slate-300">
        <p className="text-[0.82rem] font-semibold text-white">{guidance.platform}</p>
        <p>{guidance.summary}</p>
        <p><span className="font-semibold text-slate-100">Handoff type:</span> {guidance.handoffType}</p>
        <p className="rounded-md border border-[#8b5cf6]/35 bg-[#21113c] p-2 text-[#ddd6fe]">
          Not a direct integration. These are manual handoff steps for your sending platform.
        </p>
        <p><span className="font-semibold text-slate-100">Studio gives you:</span> {guidance.studioHandles}</p>
        <p><span className="font-semibold text-slate-100">Platform handles:</span> {guidance.platformHandles}</p>
        <p><span className="font-semibold text-slate-100">Recommended file:</span> {guidance.recommendedFile}</p>
        <div className="rounded-md border border-[#6ee7b7]/25 bg-[#052116] p-2">
          <p className="font-semibold text-[#bbf7d0]">{workflow.workflow.name} handoff focus</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {workflowFocus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <details className="rounded-md border border-white/10 bg-white/[0.025] p-2">
          <summary className="cursor-pointer font-semibold text-slate-100">Detailed notes</summary>
          <div className="mt-2 space-y-2">
            <p><span className="font-semibold text-slate-100">Upload:</span> {guidance.whatToUpload}</p>
            <p><span className="font-semibold text-slate-100">Paste:</span> {guidance.whatToPaste}</p>
            <p><span className="font-semibold text-slate-100">Known caveats:</span> {guidance.caveats}</p>
          </div>
        </details>
        <div>
          <p className="font-semibold text-slate-100">Manual steps</p>
          <ol className="mt-1 list-decimal space-y-1 pl-4">
            {guidance.manualSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <button
          type="button"
          onClick={onCopySteps}
          className="inline-flex h-8 items-center rounded-md border border-white/10 bg-white/[0.04] px-2.5 text-[0.72rem] font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
        >
          Copy handoff steps
        </button>
        <p className="rounded-md border border-amber-300/30 bg-amber-950/25 p-2 text-amber-100">
          This is not a direct integration. Studio prepares the email system for manual handoff.
        </p>
      </div>
      <div className="grid gap-2">
        {platformGuidance.map((item) => (
          <button
            key={item.platform}
            type="button"
            onClick={() => onSelectPlatform(item.platform)}
            className={`rounded-lg border p-3 text-left text-[0.72rem] leading-5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] ${
              item.platform === selectedPlatform
                ? "border-[#8b5cf6]/50 bg-[#21113c] text-slate-100"
                : "border-white/10 bg-white/[0.025] text-slate-400 hover:bg-white/[0.05]"
            }`}
          >
            <span className="block text-[0.78rem] font-semibold text-slate-100">{item.platform}</span>
            <span>{item.recommendedFile} · {item.handoffType}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function getWorkflowHandoffFocus(workflow: StudioWorkflowWorkspace) {
  if (workflow.slug === "campaign-launch") {
    return [
      "Confirm launch audience, exclusions, and send window in the platform.",
      "Map the CTA to the live launch destination before scheduling.",
      "Use platform tests for product, marketing, and implementation sign-off.",
    ];
  }

  if (workflow.slug === "onboarding") {
    return [
      "Confirm the lifecycle trigger and suppression rules in the platform.",
      "Test with a profile that matches the intended onboarding state.",
      "Keep the CTA tied to one activation step, not a broad product tour.",
    ];
  }

  if (workflow.slug === "password-reset") {
    return [
      "Map the one-time reset token or link inside the platform.",
      "Confirm token expiry, account scoping, and transactional classification.",
      "Run a transactional test event before enabling live account access.",
    ];
  }

  if (workflow.slug === "reporting") {
    return [
      "Confirm every digest item URL and editorial order before import.",
      "Map feeds, dynamic blocks, or newsletter tags inside the platform.",
      "Keep subscription preferences and unsubscribe handling in the platform.",
    ];
  }

  return [
    "Review platform tokens, compliance settings, and test sends before handoff.",
  ];
}
