import Redis from "ioredis";

let redisClient: Redis | null = null;

function getRedisUrl(): string | null {
  const value = process.env.REDIS_URL?.trim();
  return value ? value : null;
}

export function isRedisConfigured(): boolean {
  return Boolean(getRedisUrl());
}

export function getSharedKeyPrefix(): string {
  const raw = process.env.SHARED_STORE_PREFIX?.trim();
  const prefix = raw && raw.length > 0 ? raw : "template-hedgehog";
  return prefix.replace(/:+$/g, "");
}

export function buildSharedKey(...parts: string[]): string {
  const suffix = parts
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join(":");
  return `${getSharedKeyPrefix()}:${suffix}`;
}

export class SharedRedisNotConfiguredError extends Error {
  constructor() {
    super("Shared Redis persistence is not configured.");
  }
}

export function getRedisClient(): Redis {
  const redisUrl = getRedisUrl();
  if (!redisUrl) {
    throw new SharedRedisNotConfiguredError();
  }

  if (!redisClient) {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });
  }

  return redisClient;
}

