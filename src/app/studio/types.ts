import type { StudioSourceOrigin } from "@/lib/studio/v2";

export type PreviewMode = "desktop" | "mobile";

export type InlineEditableField =
  | "headline"
  | "bodyCopy"
  | "ctaLabel"
  | "ctaUrl"
  | "footerLegalLine"
  | "supportEmail";

export type CompileStatus = "ready" | "compiling" | "success" | "error";

export type CompileState = {
  status: CompileStatus;
  message: string;
  lastCompiledAt?: string;
  lastFailedAt?: string;
  durationMs?: number;
  sourceSnapshot?: string;
};

export type StudioLocalSnapshot = {
  version?: 1;
  id: string;
  name: string;
  createdAt: string;
  workflowSlug: string;
  source: string;
  compiledHtml: string;
  structuredContent: unknown;
  brandTokens: unknown;
  qaState: Record<string, unknown>;
  platform: string;
  sourceOrigin: StudioSourceOrigin;
  lastCompiledAt?: string;
  compileState?: CompileState;
};

export type SourceStats = {
  lines: number;
  characters: number;
};

export const sourceOriginLabel: Record<StudioSourceOrigin, string> = {
  library: "Library source",
  generated: "Generated MJML",
  manual: "Manual MJML",
};
