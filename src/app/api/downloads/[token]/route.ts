import { NextRequest, NextResponse } from "next/server";
import { consumeDownloadToken } from "@/lib/downloadToken";

interface Props {
  params: Promise<{ token: string }>;
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

  const redirectUrl = new URL("/api/download", request.url);
  redirectUrl.searchParams.set("session_id", tokenResult.sessionId);

  return NextResponse.redirect(redirectUrl, 303);
}
