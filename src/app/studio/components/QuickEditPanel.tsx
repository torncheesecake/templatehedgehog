import { RotateCcw, Save, Sparkles } from "lucide-react";
import type { StudioStructuredContent } from "@/lib/studio/v2";
import { IconPanelButton } from "./studioControls";

const quickEditFields: Array<[keyof StudioStructuredContent, string]> = [
  ["preheader", "Preheader"],
  ["headline", "Headline"],
  ["ctaLabel", "CTA label"],
  ["ctaUrl", "CTA URL"],
  ["brandName", "Brand name"],
  ["logoUrl", "Logo URL/path"],
  ["heroImageUrl", "Hero image URL/path"],
  ["heroImageAlt", "Hero image alt text"],
  ["supportEmail", "Support email"],
];

export function QuickEditPanel({
  content,
  message,
  onApplyToSource,
  onResetAll,
  onResetField,
  onSave,
  onUpdateField,
  onUpdateSocialLink,
  savedContent,
  structuredDirty,
}: {
  content: StudioStructuredContent;
  message: string;
  onApplyToSource: () => void;
  onResetAll: () => void;
  onResetField: (key: keyof StudioStructuredContent) => void;
  onSave: () => void;
  onUpdateField: <K extends keyof StudioStructuredContent>(key: K, value: StudioStructuredContent[K]) => void;
  onUpdateSocialLink: (index: number, key: "label" | "url", value: string) => void;
  savedContent: StudioStructuredContent;
  structuredDirty: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {quickEditFields.map(([key, label]) => {
          const changed = JSON.stringify(content[key]) !== JSON.stringify(savedContent[key]);

          return (
            <div key={key} className="grid gap-1.5">
              <div className="flex items-center justify-between gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                <label htmlFor={`studio-token-${key}`}>{label}</label>
                {changed ? (
                  <button
                    type="button"
                    onClick={() => onResetField(key)}
                    className="rounded border border-amber-300/30 px-1.5 py-0.5 text-[0.6rem] text-amber-100 hover:bg-amber-950/30"
                  >
                    Changed · reset
                  </button>
                ) : null}
              </div>
              <input
                id={`studio-token-${key}`}
                value={String(content[key] ?? "")}
                onChange={(event) => onUpdateField(key, event.target.value as never)}
                className="h-10 rounded-lg border border-white/10 bg-[#06101c] px-3 text-[0.78rem] text-slate-100 outline-none focus:ring-2 focus:ring-[#7dd3fc]"
              />
            </div>
          );
        })}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
            <label htmlFor="studio-token-bodyCopy">Subheading/body copy</label>
            {content.bodyCopy !== savedContent.bodyCopy ? (
              <button type="button" onClick={() => onResetField("bodyCopy")} className="rounded border border-amber-300/30 px-1.5 py-0.5 text-[0.6rem] text-amber-100 hover:bg-amber-950/30">
                Changed · reset
              </button>
            ) : null}
          </div>
          <textarea
            id="studio-token-bodyCopy"
            value={content.bodyCopy}
            onChange={(event) => onUpdateField("bodyCopy", event.target.value)}
            className="min-h-28 resize-y rounded-lg border border-white/10 bg-[#06101c] p-3 text-[0.78rem] leading-5 text-slate-100 outline-none focus:ring-2 focus:ring-[#7dd3fc]"
          />
        </div>
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
            <label htmlFor="studio-token-footerLegalLine">Footer legal line</label>
            {content.footerLegalLine !== savedContent.footerLegalLine ? (
              <button type="button" onClick={() => onResetField("footerLegalLine")} className="rounded border border-amber-300/30 px-1.5 py-0.5 text-[0.6rem] text-amber-100 hover:bg-amber-950/30">
                Changed · reset
              </button>
            ) : null}
          </div>
          <textarea
            id="studio-token-footerLegalLine"
            value={content.footerLegalLine}
            onChange={(event) => onUpdateField("footerLegalLine", event.target.value)}
            className="min-h-28 resize-y rounded-lg border border-white/10 bg-[#06101c] p-3 text-[0.78rem] leading-5 text-slate-100 outline-none focus:ring-2 focus:ring-[#7dd3fc]"
          />
        </div>
      </div>

      <section className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
        <h3 className="text-[0.82rem] font-semibold text-white">Social links</h3>
        <div className="mt-3 grid gap-2">
          {content.socialLinks.map((link, index) => (
            <div key={`${link.label}-${index}`} className="grid gap-2 md:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Label</span>
                <input
                  value={link.label}
                  onChange={(event) => onUpdateSocialLink(index, "label", event.target.value)}
                  className="h-9 rounded-md border border-white/10 bg-[#06101c] px-2 text-[0.74rem] text-slate-100 outline-none focus:ring-2 focus:ring-[#7dd3fc]"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-slate-500">URL</span>
                <input
                  value={link.url}
                  onChange={(event) => onUpdateSocialLink(index, "url", event.target.value)}
                  className="h-9 rounded-md border border-white/10 bg-[#06101c] px-2 text-[0.74rem] text-slate-100 outline-none focus:ring-2 focus:ring-[#7dd3fc]"
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <IconPanelButton onClick={onSave} disabled={!structuredDirty}>
          <Save className="h-4 w-4" aria-hidden="true" />
          Save structured
        </IconPanelButton>
        <IconPanelButton onClick={onResetAll} disabled={!structuredDirty}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset all fields
        </IconPanelButton>
        <IconPanelButton onClick={onApplyToSource}>
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Apply changes to source
        </IconPanelButton>
      </div>
      {message ? (
        <p className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-[0.74rem] leading-5 text-slate-300">
          {message}
        </p>
      ) : null}
    </div>
  );
}
