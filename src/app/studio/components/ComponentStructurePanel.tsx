import { ArrowDown, ArrowUp, Copy, Folder, RotateCcw, Trash2 } from "lucide-react";
import {
  REQUIRED_WORKFLOW_COMPONENTS,
  STUDIO_COMPONENT_MANIFESTS,
  STUDIO_PACK_MANIFESTS,
  type StudioInsertedComponent,
  type StudioStructuredComponentId,
  type StudioStructuredComponentManifest,
  type StudioStructuredContent,
} from "@/lib/studio/v2";
import { getStatusTone, IconPanelButton } from "./studioControls";

export function ComponentStructurePanel({
  availableComponents,
  content,
  onDuplicateComponent,
  onInsertSelectedComponent,
  onRemoveComponent,
  onReorderComponent,
  onResetStructure,
  onSelectComponent,
  onUpdateComponentField,
  selectedComponentId,
}: {
  availableComponents: StudioStructuredComponentManifest[];
  content: StudioStructuredContent;
  onDuplicateComponent: (instanceId: string) => void;
  onInsertSelectedComponent: () => void;
  onRemoveComponent: (instanceId: string) => void;
  onReorderComponent: (instanceId: string, direction: "up" | "down") => void;
  onResetStructure: () => void;
  onSelectComponent: (componentId: StudioStructuredComponentId) => void;
  onUpdateComponentField: (instanceId: string, field: string, value: string) => void;
  selectedComponentId: StudioStructuredComponentId;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[0.82rem] font-semibold text-white">Workflow structure</h3>
          <p className="mt-1 text-[0.72rem] leading-5 text-slate-400">
            Duplicate, remove, and reorder local sections before compiling.
          </p>
          <p className="mt-2 rounded-md border border-amber-300/25 bg-amber-950/20 p-2 text-[0.7rem] leading-5 text-amber-100">
            Structure edits regenerate the MJML source locally. Review the source before export.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedComponentId}
            onChange={(event) => onSelectComponent(event.target.value as StudioStructuredComponentId)}
            className="h-9 rounded-lg border border-white/10 bg-[#06101c] px-3 text-[0.76rem] text-slate-100 outline-none focus:ring-2 focus:ring-[#7dd3fc]"
          >
            {availableComponents.map((component) => (
              <option key={component.id} value={component.id}>
                {component.name}
              </option>
            ))}
          </select>
          <IconPanelButton onClick={onInsertSelectedComponent}>
            <Folder className="h-4 w-4" aria-hidden="true" />
            Insert section
          </IconPanelButton>
          <IconPanelButton onClick={onResetStructure}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset structure
          </IconPanelButton>
        </div>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {availableComponents.map((component) => (
          <div key={component.id} className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
            <p className="text-[0.78rem] font-semibold text-slate-100">{component.name}</p>
            <p className="mt-1 text-[0.7rem] leading-4 text-slate-400">{component.purpose}</p>
            <p className="mt-2 text-[0.68rem] text-slate-500">
              Required: {component.requiredFields.join(", ")} · {STUDIO_PACK_MANIFESTS[component.pack].name}
            </p>
          </div>
        ))}
      </div>
      {content.components.length ? (
        <div className="mt-4 space-y-3">
          {content.components.map((component, componentIndex) => (
            <ComponentCard
              key={component.instanceId}
              component={component}
              componentIndex={componentIndex}
              isLast={componentIndex === content.components.length - 1}
              onDuplicateComponent={onDuplicateComponent}
              onRemoveComponent={onRemoveComponent}
              onReorderComponent={onReorderComponent}
              onUpdateComponentField={onUpdateComponentField}
              siblingComponents={content.components}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ComponentCard({
  component,
  componentIndex,
  isLast,
  onDuplicateComponent,
  onRemoveComponent,
  onReorderComponent,
  onUpdateComponentField,
  siblingComponents,
}: {
  component: StudioInsertedComponent;
  componentIndex: number;
  isLast: boolean;
  onDuplicateComponent: (instanceId: string) => void;
  onRemoveComponent: (instanceId: string) => void;
  onReorderComponent: (instanceId: string, direction: "up" | "down") => void;
  onUpdateComponentField: (instanceId: string, field: string, value: string) => void;
  siblingComponents: StudioInsertedComponent[];
}) {
  const manifest = STUDIO_COMPONENT_MANIFESTS.find((item) => item.id === component.componentId);
  const requiredFields = manifest?.requiredFields ?? [];
  const optionalFields = Object.keys(manifest?.defaultFields ?? {}).filter(
    (field) => !requiredFields.includes(field),
  );
  const missingFields = requiredFields.filter((field) => !String(component.fields[field] ?? "").trim());
  const urlFields = Object.entries(component.fields).filter(([field]) => /url$/i.test(field));
  const invalidUrlFields = urlFields.filter(([, value]) => {
    if (!value.trim()) return false;
    try {
      const parsed = new URL(value);
      return parsed.protocol !== "https:" && parsed.protocol !== "http:" && parsed.protocol !== "mailto:";
    } catch {
      return true;
    }
  });
  const componentStatus: "pass" | "warn" | "fail" = missingFields.length
    ? "fail"
    : invalidUrlFields.length
      ? "warn"
      : "pass";
  const isLastRequired =
    REQUIRED_WORKFLOW_COMPONENTS.includes(component.componentId) &&
    siblingComponents.filter((item) => item.componentId === component.componentId).length <= 1;

  return (
    <div className={`rounded-lg border p-3 ${getStatusTone(componentStatus)}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.82rem] font-semibold text-white">{manifest?.name ?? component.componentId}</p>
          <p className="mt-1 text-[0.72rem] leading-5">{manifest?.purpose ?? "Custom structured section."}</p>
        </div>
        <span className="rounded-md border border-white/10 bg-black/15 px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em]">
          {componentStatus}
        </span>
      </div>
      <div className="mt-3 grid gap-2 text-[0.7rem] leading-5 sm:grid-cols-2">
        <p><span className="font-semibold text-slate-100">Required:</span> {requiredFields.join(", ") || "None"}</p>
        <p><span className="font-semibold text-slate-100">Optional:</span> {optionalFields.join(", ") || "None"}</p>
        <p><span className="font-semibold text-slate-100">Pack:</span> {manifest ? STUDIO_PACK_MANIFESTS[manifest.pack].name : "Unknown"}</p>
        <p><span className="font-semibold text-slate-100">Validation:</span> {missingFields.length ? `Missing ${missingFields.join(", ")}` : invalidUrlFields.length ? `Review ${invalidUrlFields.map(([field]) => field).join(", ")}` : "Ready"}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <IconPanelButton onClick={() => onReorderComponent(component.instanceId, "up")} disabled={componentIndex === 0}>
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
          Up
        </IconPanelButton>
        <IconPanelButton
          onClick={() => onReorderComponent(component.instanceId, "down")}
          disabled={isLast}
        >
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
          Down
        </IconPanelButton>
        <IconPanelButton onClick={() => onDuplicateComponent(component.instanceId)}>
          <Copy className="h-4 w-4" aria-hidden="true" />
          Duplicate
        </IconPanelButton>
        <IconPanelButton onClick={() => onRemoveComponent(component.instanceId)} disabled={isLastRequired}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Remove
        </IconPanelButton>
      </div>
      {isLastRequired ? (
        <p className="mt-2 text-[0.7rem] leading-5 text-amber-100">
          This is the last required {manifest?.name ?? component.componentId} section.
        </p>
      ) : null}
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {Object.entries(component.fields).map(([field, value]) => (
          <label key={field} className="grid gap-1">
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-slate-500">{field}</span>
            <input
              value={value}
              onChange={(event) => onUpdateComponentField(component.instanceId, field, event.target.value)}
              className="h-9 rounded-md border border-white/10 bg-[#071421] px-2 text-[0.74rem] text-slate-100 outline-none focus:ring-2 focus:ring-[#7dd3fc]"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
