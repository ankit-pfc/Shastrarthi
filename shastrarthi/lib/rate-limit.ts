import { NextRequest } from "next/server";

type RateLimitEntry = {
    count: number;
    windowStartedAt: number;
};

type RateLimitOptions = {
    windowMs: number;
    maxRequests: number;
};

export type RateLimitResult = {
    allowed: boolean;
    limit: number;
    remaining: number;
    retryAfterSeconds: number;
    resetAtUnixSeconds: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

export function getClientIp(request: NextRequest): string {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        const first = forwardedFor.split(",")[0]?.trim();
        if (first) return first;
    }

    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp;

    return "unknown";
}

export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
    const now = Date.now();
    const existing = rateLimitStore.get(key);

    if (!existing || now - existing.windowStartedAt >= options.windowMs) {
        rateLimitStore.set(key, { count: 1, windowStartedAt: now });
        return {
            allowed: true,
            limit: options.maxRequests,
            remaining: Math.max(0, options.maxRequests - 1),
            retryAfterSeconds: 0,
            resetAtUnixSeconds: Math.ceil((now + options.windowMs) / 1000),
        };
    }

    if (existing.count >= options.maxRequests) {
        const retryAfterMs = options.windowMs - (now - existing.windowStartedAt);
        return {
            allowed: false,
            limit: options.maxRequests,
            remaining: 0,
            retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
            resetAtUnixSeconds: Math.ceil((existing.windowStartedAt + options.windowMs) / 1000),
        };
    }

    existing.count += 1;
    rateLimitStore.set(key, existing);
    return {
        allowed: true,
        limit: options.maxRequests,
        remaining: Math.max(0, options.maxRequests - existing.count),
        retryAfterSeconds: 0,
        resetAtUnixSeconds: Math.ceil((existing.windowStartedAt + options.windowMs) / 1000),
    };
}

export function buildRateLimitHeaders(result: RateLimitResult): HeadersInit {
    return {
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.resetAtUnixSeconds),
    };
}
