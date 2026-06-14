import { NextResponse } from "next/server";
import { compileMjml } from "@/lib/mjml/compile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MJML_REQUEST_MAX_LENGTH = 500_000;
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

type CompileRequestBody = {
  mjml?: unknown;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "MJML compile failed.";
}

function isLoopbackRequest(request: Request): boolean {
  const hostHeader = request.headers.get("host") ?? "";
  const forwardedHostHeader = request.headers.get("x-forwarded-host") ?? "";
  const url = new URL(request.url);
  const hostCandidates = [url.hostname, hostHeader, forwardedHostHeader]
    .filter(Boolean)
    .map((host) => host.split(":")[0]?.toLowerCase() ?? "");

  return hostCandidates.some((host) => LOCAL_HOSTNAMES.has(host));
}

export async function POST(request: Request) {
  if (!isLoopbackRequest(request)) {
    return NextResponse.json(
      { error: "Studio local compile is only available from localhost." },
      { status: 403 },
    );
  }

  let payload: CompileRequestBody;
  try {
    payload = (await request.json()) as CompileRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const mjml = typeof payload.mjml === "string" ? payload.mjml : "";
  if (!mjml.trim()) {
    return NextResponse.json(
      { error: "MJML source is required." },
      { status: 400 },
    );
  }

  if (mjml.length > MJML_REQUEST_MAX_LENGTH) {
    return NextResponse.json(
      { error: "MJML source is too large." },
      { status: 413 },
    );
  }

  try {
    const html = await compileMjml(mjml, { trusted: false });
    return NextResponse.json({ html }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
