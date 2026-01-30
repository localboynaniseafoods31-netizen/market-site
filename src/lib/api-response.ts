import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type ApiResponse<T = unknown> = {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
};

export function successResponse<T>(
    data: T,
    statusOrMessage: number | string = 200,
    paramStatus = 200
): NextResponse<ApiResponse<T>> {
    let status = 200;
    let message: string | undefined;

    if (typeof statusOrMessage === 'number') {
        status = statusOrMessage;
    } else {
        message = statusOrMessage;
        status = paramStatus;
    }

    const response: ApiResponse<T> = { success: true, data };
    if (message) {
        response.message = message;
    }

    return NextResponse.json(response, { status });
}

export function errorResponse(
    code: string,
    message: string,
    status = 400,
    details?: unknown
): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            success: false,
            error: { code, message, details },
        },
        { status }
    );
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
    console.error('[API Error]:', error);

    if (error instanceof ZodError) {
        return errorResponse(
            'VALIDATION_ERROR',
            'Invalid request data',
            400,
            error.issues.map((e) => ({ path: e.path.join('.'), message: e.message }))
        );
    }

    if (error instanceof Error) {
        // Known business errors
        if (error.message === 'OUT_OF_STOCK') {
            return errorResponse('OUT_OF_STOCK', 'Some items are out of stock', 400);
        }
        if (error.message === 'UNAUTHORIZED') {
            return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
        }
        if (error.message === 'FORBIDDEN') {
            return errorResponse('FORBIDDEN', 'Access denied', 403);
        }
        if (error.message === 'NOT_FOUND') {
            return errorResponse('NOT_FOUND', 'Resource not found', 404);
        }
    }

    // Unexpected error
    return errorResponse(
        'INTERNAL_ERROR',
        process.env.NODE_ENV === 'development'
            ? (error as Error)?.message || 'Unknown error'
            : 'Something went wrong',
        500
    );
}
