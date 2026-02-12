const rateLimitStore = new Map();
export function getClientIp(request) {
    var _a;
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        const first = (_a = forwardedFor.split(",")[0]) === null || _a === void 0 ? void 0 : _a.trim();
        if (first)
            return first;
    }
    const realIp = request.headers.get("x-real-ip");
    if (realIp)
        return realIp;
    return "unknown";
}
export function checkRateLimit(key, options) {
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
export function buildRateLimitHeaders(result) {
    return {
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.resetAtUnixSeconds),
    };
}
