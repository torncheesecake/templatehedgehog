import { createHash } from "node:crypto";
import {
  buildSharedKey,
  getRedisClient,
  SharedRedisNotConfiguredError,
} from "@/lib/shared/redis";

export type RateLimitResult = {
  limited: boolean;
};

export interface RateLimiter {
  consume(key: string): Promise<RateLimitResult>;
}

type RateLimiterConfig = {
  windowMs: number;
  maxRequests: number;
};

class InMemoryRateLimiter implements RateLimiter {
  private readonly entries = new Map<string, number[]>();
  private readonly config: RateLimiterConfig;

  constructor(config: RateLimiterConfig) {
    this.config = config;
  }

  async consume(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const recent =
      this.entries
        .get(key)
        ?.filter((timestamp) => now - timestamp < this.config.windowMs) ?? [];

    recent.push(now);
    this.entries.set(key, recent);

    return { limited: recent.length > this.config.maxRequests };
  }

  clear(): void {
    this.entries.clear();
  }
}

class RedisRateLimiter implements RateLimiter {
  private readonly config: RateLimiterConfig;

  constructor(config: RateLimiterConfig) {
    this.config = config;
  }

  async consume(key: string): Promise<RateLimitResult> {
    const redis = getRedisClient();
    const ttlSeconds = Math.max(1, Math.ceil(this.config.windowMs / 1000));
    const redisKey = buildSharedKey("rate-limit", key);

    const count = await redis.incr(redisKey);
    if (count === 1) {
      await redis.expire(redisKey, ttlSeconds);
    }

    return { limited: count > this.config.maxRequests };
  }
}

function getRateLimiterMode(): "memory" | "redis" {
  if (process.env.NODE_ENV === "production") {
    return "redis";
  }

  const configured = process.env.RATE_LIMIT_STORE_MODE?.trim().toLowerCase();
  if (configured === "memory" || configured === "redis") {
    return configured;
  }
  return "memory";
}

function hashKeyPart(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

const WAITLIST_RATE_LIMIT_CONFIG: RateLimiterConfig = {
  windowMs: 60_000,
  maxRequests: 20,
};
const memoryWaitlistRateLimiter = new InMemoryRateLimiter(
  WAITLIST_RATE_LIMIT_CONFIG,
);
const redisWaitlistRateLimiter = new RedisRateLimiter(
  WAITLIST_RATE_LIMIT_CONFIG,
);

let waitlistRateLimiterOverride: RateLimiter | null = null;

export function getWaitlistRateLimiter(): RateLimiter {
  if (waitlistRateLimiterOverride) {
    return waitlistRateLimiterOverride;
  }

  return getRateLimiterMode() === "redis"
    ? redisWaitlistRateLimiter
    : memoryWaitlistRateLimiter;
}

export function toWaitlistRateLimitKey(ip: string): string {
  return hashKeyPart(ip.trim().toLowerCase() || "unknown");
}

export function isWaitlistRateLimitStorageMisconfigured(error: unknown): boolean {
  return error instanceof SharedRedisNotConfiguredError;
}

export function __setWaitlistRateLimiterForTests(rateLimiter: RateLimiter | null): void {
  waitlistRateLimiterOverride = rateLimiter;
}

export function __resetWaitlistRateLimiterForTests(): void {
  waitlistRateLimiterOverride = null;
  memoryWaitlistRateLimiter.clear();
}
