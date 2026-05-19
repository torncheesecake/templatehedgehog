import { createHash } from "node:crypto";
import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";
import {
  buildSharedKey,
  getRedisClient,
  SharedRedisNotConfiguredError,
} from "@/lib/shared/redis";

export type WaitlistEntry = {
  email: string;
  createdAt: string;
  source?: string;
};

export interface WaitlistStore {
  getByEmail(email: string): Promise<WaitlistEntry | null>;
  insertIfAbsent(entry: WaitlistEntry): Promise<boolean>;
}

export type WaitlistStorageMode = "memory" | "redis" | "file";

export class WaitlistStorageNotConfiguredError extends Error {
  constructor() {
    super("Waitlist shared storage is not configured.");
  }
}

class InMemoryWaitlistStore implements WaitlistStore {
  private readonly entries = new Map<string, WaitlistEntry>();

  async getByEmail(email: string): Promise<WaitlistEntry | null> {
    return this.entries.get(email) ?? null;
  }

  async insertIfAbsent(entry: WaitlistEntry): Promise<boolean> {
    if (this.entries.has(entry.email)) {
      return false;
    }
    this.entries.set(entry.email, entry);
    return true;
  }

  clear(): void {
    this.entries.clear();
  }
}

function hashEmail(email: string): string {
  return createHash("sha256").update(email).digest("hex");
}

function getEntryKey(email: string): string {
  return buildSharedKey("waitlist", "email", hashEmail(email));
}

class RedisWaitlistStore implements WaitlistStore {
  async getByEmail(email: string): Promise<WaitlistEntry | null> {
    const redis = getRedisClient();
    const entryKey = getEntryKey(email);
    const raw = await redis.get(entryKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as WaitlistEntry;
      if (
        typeof parsed.email !== "string"
        || typeof parsed.createdAt !== "string"
      ) {
        return null;
      }

      return {
        email: parsed.email,
        createdAt: parsed.createdAt,
        source: typeof parsed.source === "string" ? parsed.source : undefined,
      };
    } catch {
      return null;
    }
  }

  async insertIfAbsent(entry: WaitlistEntry): Promise<boolean> {
    const redis = getRedisClient();
    const entryKey = getEntryKey(entry.email);
    const result = await redis.set(
      entryKey,
      JSON.stringify(entry),
      "NX",
    );
    return result === "OK";
  }
}

function getWaitlistFilePath(): string {
  return process.env.WAITLIST_FILE_PATH
    ?? path.join(process.cwd(), ".data", "waitlist.jsonl");
}

class FileWaitlistStore implements WaitlistStore {
  private async readEntries(): Promise<WaitlistEntry[]> {
    try {
      const raw = await readFile(getWaitlistFilePath(), "utf8");
      return raw
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as WaitlistEntry)
        .filter((entry) => (
          typeof entry.email === "string"
          && typeof entry.createdAt === "string"
        ));
    } catch (error) {
      if (
        error instanceof Error
        && "code" in error
        && error.code === "ENOENT"
      ) {
        return [];
      }
      throw error;
    }
  }

  async getByEmail(email: string): Promise<WaitlistEntry | null> {
    const entries = await this.readEntries();
    return entries.find((entry) => entry.email === email) ?? null;
  }

  async insertIfAbsent(entry: WaitlistEntry): Promise<boolean> {
    const existing = await this.getByEmail(entry.email);
    if (existing) {
      return false;
    }

    const filePath = getWaitlistFilePath();
    await mkdir(path.dirname(filePath), { recursive: true });
    await appendFile(filePath, `${JSON.stringify(entry)}\n`, "utf8");
    return true;
  }
}

const memoryStore = new InMemoryWaitlistStore();
const redisStore = new RedisWaitlistStore();
const fileStore = new FileWaitlistStore();

let waitlistStoreOverride: WaitlistStore | null = null;

function getStorageMode(): WaitlistStorageMode {
  const raw = process.env.WAITLIST_STORAGE_MODE?.toLowerCase();
  if (raw === "memory" || raw === "redis" || raw === "file") {
    return raw;
  }

  if (process.env.NODE_ENV === "production") {
    return process.env.REDIS_URL ? "redis" : "file";
  }

  return "memory";
}

export function getWaitlistStore(): WaitlistStore {
  if (waitlistStoreOverride) {
    return waitlistStoreOverride;
  }

  if (getStorageMode() === "memory") {
    return memoryStore;
  }

  if (getStorageMode() === "file") {
    return fileStore;
  }

  try {
    getRedisClient();
    return redisStore;
  } catch (error) {
    if (error instanceof SharedRedisNotConfiguredError) {
      throw new WaitlistStorageNotConfiguredError();
    }
    throw error;
  }
}

export function __setWaitlistStoreForTests(store: WaitlistStore | null): void {
  waitlistStoreOverride = store;
}

export function __resetWaitlistStoreForTests(): void {
  waitlistStoreOverride = null;
  memoryStore.clear();
}
