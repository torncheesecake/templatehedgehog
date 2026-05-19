import { NextRequest, NextResponse } from "next/server";
import { consumeDownloadToken } from "@/lib/downloadToken";

interface Props {
  params: Promise<{ token: string }>;
}

function getPublicBaseUrl(request: NextRequest): string {
  const configuredBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, "");
  }

  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "http";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return request.nextUrl.origin;
}

// GET /api/downloads/[token]
// Validates a signed, short-lived, single-use token and redirects to gated download.
export async function GET(request: NextRequest, { params }: Props) {
  const { token } = await params;

  if (!token?.trim()) {
    return NextResponse.json(
      { error: "Download token is required." },
      { status: 400 },
    );
  }

  const tokenResult = await consumeDownloadToken(token);
  if (!tokenResult.ok) {
    return NextResponse.json(
      { error: tokenResult.message },
      { status: tokenResult.status },
    );
  }

  const redirectUrl = new URL("/api/download", getPublicBaseUrl(request));
  redirectUrl.searchParams.set("session_id", tokenResult.sessionId);

  return NextResponse.redirect(redirectUrl, 303);
}
