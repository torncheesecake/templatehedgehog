import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const execFileAsync = promisify(execFile);

const CONTENT_MAX_LENGTH = 1_500_000;
const ALLOWED_EXTENSIONS = new Set([".mjml", ".html"]);

type OpenInZedRequestBody = {
  fileName?: unknown;
  content?: unknown;
};

function sanitiseFileName(value: unknown): string {
  const raw = String(value ?? "").trim();
  const baseName = path.basename(raw).replace(/[^a-zA-Z0-9._-]/g, "-");
  return baseName || "template-hedgehog-preview.mjml";
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Opening local editor files is only available in development." },
      { status: 403 },
    );
  }

  let body: OpenInZedRequestBody;
  try {
    body = (await request.json()) as OpenInZedRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const fileName = sanitiseFileName(body.fileName);
  const extension = path.extname(fileName).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return NextResponse.json(
      { error: "Only MJML and HTML preview files can be opened in Zed." },
      { status: 400 },
    );
  }

  const content = typeof body.content === "string" ? body.content : "";
  if (!content.trim()) {
    return NextResponse.json(
      { error: "Code content is required." },
      { status: 400 },
    );
  }

  if (content.length > CONTENT_MAX_LENGTH) {
    return NextResponse.json(
      { error: "Code content is too large for local preview opening." },
      { status: 413 },
    );
  }

  const outputDir = path.join(process.cwd(), ".next", "template-hedgehog-zed");
  const absolutePath = path.join(outputDir, fileName);

  try {
    await mkdir(outputDir, { recursive: true });
    await writeFile(absolutePath, content, "utf8");

    if (process.platform === "darwin") {
      await execFileAsync("open", ["-a", "Zed", absolutePath]);
    } else {
      await execFileAsync("zed", [absolutePath]);
    }

    return NextResponse.json(
      { message: "Opened this code block in Zed." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not open Zed. Confirm Zed is installed, or install the Zed CLI if you are not on macOS.",
      },
      { status: 500 },
    );
  }
}
