import { promises as fs } from "node:fs";
import { MJML_PACK_ABSOLUTE_PATH } from "@/lib/pack";

export type PackStorageMode = "filesystem" | "provider";

export type PackSizeInfo = {
  storageMode: PackStorageMode;
  available: boolean;
  bytes: number | null;
  formatted: string;
  message?: string;
};

function getPackStorageMode(): PackStorageMode {
  const rawMode = (process.env.DOWNLOAD_STORAGE_MODE ?? "filesystem")
    .trim()
    .toLowerCase();

  if (rawMode === "provider") {
    return "provider";
  }

  return "filesystem";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kiloBytes = bytes / 1024;
  if (kiloBytes < 1024) {
    return `${kiloBytes.toFixed(1)} KB`;
  }

  const megaBytes = kiloBytes / 1024;
  return `${megaBytes.toFixed(2)} MB`;
}

export async function getPackSizeInfo(): Promise<PackSizeInfo> {
  const storageMode = getPackStorageMode();

  if (storageMode !== "filesystem") {
    return {
      storageMode,
      available: false,
      bytes: null,
      formatted: "Unavailable",
      message: "Pack size is unavailable when using provider storage mode.",
    };
  }

  try {
    const stat = await fs.stat(MJML_PACK_ABSOLUTE_PATH);
    if (!stat.isFile()) {
      return {
        storageMode,
        available: false,
        bytes: null,
        formatted: "Unavailable",
        message: "Pack file is unavailable.",
      };
    }

    return {
      storageMode,
      available: true,
      bytes: stat.size,
      formatted: formatBytes(stat.size),
    };
  } catch {
    return {
      storageMode,
      available: false,
      bytes: null,
      formatted: "Unavailable",
      message: "Pack file is unavailable.",
    };
  }
}
