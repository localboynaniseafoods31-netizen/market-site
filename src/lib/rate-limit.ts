import { NextRequest, NextResponse } from 'next/server';

type RateLimitRecord = {
    count: number;
    resetAt: number;
};

type RateLimitStore = Map<string, RateLimitRecord>;

declare global {
    var __rateLimitStore__: RateLimitStore | undefined;
}

const getStore = (): RateLimitStore => {
    if (!globalThis.__rateLimitStore__) {
        globalThis.__rateLimitStore__ = new Map<string, RateLimitRecord>();
    }
    return globalThis.__rateLimitStore__;
};

const getClientIp = (req: NextRequest): string => {
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) return forwardedFor.split(',')[0].trim();

    const cfIp = req.headers.get('cf-connecting-ip');
    if (cfIp) return cfIp.trim();

    const realIp = req.headers.get('x-real-ip');
    if (realIp) return realIp.trim();

    return 'unknown';
};

export type RateLimitOptions = {
    key: string;
    limit: number;
    windowMs: number;
};

export type RateLimitResult = {
    allowed: boolean;
    remaining: number;
    resetInMs: number;
};

export const checkRateLimit = (req: NextRequest, options: RateLimitOptions): RateLimitResult => {
    const now = Date.now();
    const ip = getClientIp(req);
    const store = getStore();
    const key = `${options.key}:${ip}`;

    const existing = store.get(key);

    if (!existing || now >= existing.resetAt) {
        store.set(key, {
            count: 1,
            resetAt: now + options.windowMs
        });
        return {
            allowed: true,
            remaining: options.limit - 1,
            resetInMs: options.windowMs
        };
    }

    if (existing.count >= options.limit) {
        return {
            allowed: false,
            remaining: 0,
            resetInMs: Math.max(0, existing.resetAt - now)
        };
    }

    existing.count += 1;
    store.set(key, existing);

    return {
        allowed: true,
        remaining: options.limit - existing.count,
        resetInMs: Math.max(0, existing.resetAt - now)
    };
};

export const rateLimitExceededResponse = (result: RateLimitResult) => {
    return NextResponse.json(
        { error: 'Too many requests. Please retry shortly.' },
        {
            status: 429,
            headers: {
                'Retry-After': String(Math.ceil(result.resetInMs / 1000)),
                'X-RateLimit-Remaining': String(result.remaining),
            }
        }
    );
};
