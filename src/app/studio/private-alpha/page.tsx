import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { StudioWorkspace } from "@/app/studio/StudioWorkspace";
import { getStudioWorkspaceData } from "@/data/studio";

export const metadata: Metadata = {
  title: "Template Hedgehog Studio private alpha",
  description:
    "Local private-alpha Studio workspace for Template Hedgehog development.",
  robots: {
    index: false,
    follow: false,
  },
};

function isLocalHost(host: string | null) {
  if (!host) return false;
  const normalised = host.toLowerCase();
  return (
    normalised === "localhost"
    || normalised.startsWith("localhost:")
    || normalised === "127.0.0.1"
    || normalised.startsWith("127.0.0.1:")
    || normalised === "::1"
    || normalised.startsWith("[::1]")
  );
}

export default async function StudioPrivateAlphaPage() {
  const requestHeaders = await headers();

  if (!isLocalHost(requestHeaders.get("host"))) {
    redirect("/studio");
  }

  return <StudioWorkspace data={getStudioWorkspaceData()} />;
}
