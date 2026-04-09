import { NextRequest, NextResponse } from "next/server";
import { resolveDownloadDelivery, validateDownloadSession } from "@/lib/download";

export const runtime = "nodejs";

type DownloadLogLevel = "warn" | "error";

function logDownloadEvent(
  level: DownloadLogLevel,
  event: string,
  details: Record<string, unknown>,
) {
  const payload = {
    scope: "api.download",
    event,
    ...details,
  };

  if (level === "error") {
    console.error(payload);
    return;
  }

  console.warn(payload);
}

function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

function emptyStatus(status: number): NextResponse {
  return new NextResponse(null, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

async function handleDownloadRequest(
  request: NextRequest,
  method: "GET" | "HEAD",
): Promise<NextResponse> {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const validation = await validateDownloadSession(sessionId);
  if (!validation.ok) {
    if (validation.status === 400) {
      if (!sessionId?.trim()) {
        logDownloadEvent("warn", "missing_session_id", {
          method,
          status: validation.status,
        });
      } else {
        logDownloadEvent("warn", "invalid_session_id", {
          method,
          status: validation.status,
        });
      }
    } else {
      logDownloadEvent("warn", "session_validation_failed", {
        method,
        status: validation.status,
        message: validation.message,
      });
    }

    return method === "HEAD"
      ? emptyStatus(validation.status)
      : jsonError(validation.message, validation.status);
  }

  const delivery = await resolveDownloadDelivery(method);
  if (!delivery.ok) {
    if (delivery.message.includes("Filesystem download delivery is disabled in production")) {
      logDownloadEvent("error", "download_blocked_bad_config", {
        method,
        status: delivery.status,
        storageMode: process.env.DOWNLOAD_STORAGE_MODE ?? "filesystem",
        nodeEnv: process.env.NODE_ENV ?? "unknown",
      });
    } else if (delivery.status >= 500) {
      logDownloadEvent("error", "storage_provider_error", {
        method,
        status: delivery.status,
        message: delivery.message,
        storageMode: process.env.DOWNLOAD_STORAGE_MODE ?? "filesystem",
      });
    } else {
      logDownloadEvent("warn", "download_delivery_failed", {
        method,
        status: delivery.status,
        message: delivery.message,
      });
    }

    return method === "HEAD"
      ? emptyStatus(delivery.status)
      : jsonError(delivery.message, delivery.status);
  }

  if (method === "HEAD") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": delivery.contentType,
        "Content-Length": String(delivery.contentLength),
        "Content-Disposition": `attachment; filename="${delivery.filename}"`,
      },
    });
  }

  if (!delivery.stream) {
    logDownloadEvent("error", "download_stream_missing", {
      method,
      status: 500,
    });
    return jsonError("Download stream is unavailable.", 500);
  }

  return new NextResponse(delivery.stream, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": delivery.contentType,
      "Content-Length": String(delivery.contentLength),
      "Content-Disposition": `attachment; filename="${delivery.filename}"`,
    },
  });
}

export async function GET(request: NextRequest) {
  return handleDownloadRequest(request, "GET");
}

export async function HEAD(request: NextRequest) {
  return handleDownloadRequest(request, "HEAD");
}
