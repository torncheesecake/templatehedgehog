import type { Metadata } from "next";
import { StudioWorkspace } from "@/app/studio/StudioWorkspace";
import { getStudioWorkspaceData } from "@/data/studio";

export const metadata: Metadata = {
  title: "Template Hedgehog Studio - Private Alpha | Everything before send",
  description:
    "Private-alpha local Studio workspace, included with Pro and Team while it is in alpha, for choosing workflows, editing, compiling, previewing, QA checking, handing off, and exporting Template Hedgehog email systems before send.",
};

export default function StudioPage() {
  return <StudioWorkspace data={getStudioWorkspaceData()} />;
}
