import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { errorResponse } from '@/lib/api-response';

// Admin middleware helper
export async function requireAdmin(): Promise<{
    authorized: boolean;
    userId?: string;
    response?: NextResponse;
}> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            authorized: false,
            response: errorResponse('UNAUTHORIZED', 'Please login', 401),
        };
    }

    if ((session.user as any).role !== 'ADMIN') {
        return {
            authorized: false,
            response: errorResponse('FORBIDDEN', 'Admin access required', 403),
        };
    }

    return {
        authorized: true,
        userId: session.user.id,
    };
}

// Editor middleware helper (Allows Admin OR Editor)
export async function requireEditor(): Promise<{
    authorized: boolean;
    userId?: string;
    response?: NextResponse;
}> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            authorized: false,
            response: errorResponse('UNAUTHORIZED', 'Please login', 401),
        };
    }

    const role = (session.user as any).role;
    if (role !== 'ADMIN' && role !== 'EDITOR') {
        return {
            authorized: false,
            response: errorResponse('FORBIDDEN', 'Editor or Admin access required', 403),
        };
    }

    return {
        authorized: true,
        userId: session.user.id,
    };
}
