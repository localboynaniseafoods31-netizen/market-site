import { handlers } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

export const GET = handlers.GET;

export async function POST(req: NextRequest) {
    const rateLimit = checkRateLimit(req, {
        key: 'auth:signin',
        limit: 15,
        windowMs: 60_000
    });
    if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit);
    return handlers.POST(req);
}
