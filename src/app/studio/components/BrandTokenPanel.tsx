import type { StudioBrandTokens, StudioPackId } from "@/lib/studio/v2";
import { STUDIO_PACK_MANIFESTS } from "@/lib/studio/v2";

const brandFields: Array<[keyof StudioBrandTokens, string]> = [
  ["brandName", "Brand"],
  ["primaryColour", "Primary"],
  ["accentColour", "Accent"],
  ["backgroundColour", "Background"],
  ["textColour", "Text"],
  ["fontFamily", "Font"],
  ["logoUrl", "Logo"],
  ["supportEmail", "Support"],
  ["footerCompanyLine", "Company line"],
];

export function BrandTokenPanel({
  brandTokens,
  compileMatchesSource,
  formatDateTime,
  lastCompiledAt,
  lastSavedAt,
  onUpdateBrandToken,
  onUpdateSelectedPack,
  selectedPack,
  storageMessage,
  structuredDirty,
  workflowEntitled,
}: {
  brandTokens: StudioBrandTokens;
  compileMatchesSource: boolean;
  formatDateTime: (value?: string) => string;
  lastCompiledAt: string;
  lastSavedAt: string;
  onUpdateBrandToken: <K extends keyof StudioBrandTokens>(key: K, value: StudioBrandTokens[K]) => void;
  onUpdateSelectedPack: (pack: StudioPackId) => void;
  selectedPack: StudioPackId;
  storageMessage: string;
  structuredDirty: boolean;
  workflowEntitled: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <h2 className="text-[0.9rem] font-semibold text-white">Brand tokens and pack</h2>
      <div className="mt-3 grid gap-2">
        <label className="grid gap-1">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Local pack manifest</span>
          <select
            value={selectedPack}
            onChange={(event) => onUpdateSelectedPack(event.target.value as StudioPackId)}
            className="h-9 rounded-md border border-white/10 bg-[#06101c] px-2 text-[0.74rem] text-slate-100 outline-none focus:ring-2 focus:ring-[#7dd3fc]"
          >
            {Object.values(STUDIO_PACK_MANIFESTS).map((pack) => (
              <option key={pack.id} value={pack.id}>{pack.name}</option>
            ))}
          </select>
        </label>
        {brandFields.map(([key, label]) => (
          <label key={key} className="grid gap-1">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</span>
            <input
              value={String(brandTokens[key])}
              onChange={(event) => onUpdateBrandToken(key, event.target.value as never)}
              className="h-9 rounded-md border border-white/10 bg-[#06101c] px-2 text-[0.74rem] text-slate-100 outline-none focus:ring-2 focus:ring-[#7dd3fc]"
            />
          </label>
        ))}
      </div>
      <dl className="mt-4 grid gap-2 text-[0.74rem] leading-5">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Saved</dt>
          <dd className="text-right text-slate-100">{formatDateTime(lastSavedAt)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Structured</dt>
          <dd className={structuredDirty ? "text-amber-100" : "text-[#bbf7d0]"}>
            {structuredDirty ? "Unsaved" : "Saved"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Compiled</dt>
          <dd className="text-right text-slate-100">{formatDateTime(lastCompiledAt)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Entitlement</dt>
          <dd className={workflowEntitled ? "text-[#bbf7d0]" : "text-red-100"}>
            {workflowEntitled ? "Available locally" : "Needs pack"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Compile matches source</dt>
          <dd className={compileMatchesSource ? "text-[#bbf7d0]" : "text-amber-100"}>
            {compileMatchesSource ? "Yes" : "Needs compile"}
          </dd>
        </div>
      </dl>
      {storageMessage ? (
        <p className="mt-3 rounded-lg border border-amber-300/35 bg-amber-950/25 p-3 text-[0.72rem] leading-5 text-amber-100">
          {storageMessage}
        </p>
      ) : null}
    </div>
  );
}
