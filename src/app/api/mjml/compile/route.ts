import { NextResponse } from "next/server";

const MJML_REQUEST_MAX_LENGTH = 500_000;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CompileRequestBody = {
  mjml?: unknown;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "MJML compile failed.";
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error:
          "MJML compile API is disabled in production. Compile MJML during trusted build steps.",
      },
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
    const { compileMjml } = await import("@/lib/mjml/compile");
    const html = await compileMjml(mjml, { trusted: false });
    return NextResponse.json({ html }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
