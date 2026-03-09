import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin';

export async function GET(req: Request) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const url = new URL(req.url);
        const limitStr = url.searchParams.get('limit') || '50';
        const pageStr = url.searchParams.get('page') || '1';
        
        const limit = parseInt(limitStr);
        const page = parseInt(pageStr);
        const skip = (page - 1) * limit;

        const quotes = await prisma.bulkQuote.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
        });

        const total = await prisma.bulkQuote.count();

        return NextResponse.json({
            quotes,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("[ADMIN_QUOTES_GET]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

const updateSchema = z.object({
    status: z.enum(['PENDING', 'CONTACTED', 'COMPLETED']),
});

export async function PATCH(req: Request) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return new NextResponse("Quote ID required", { status: 400 });
        }

        const body = await req.json();
        const { status } = updateSchema.parse(body);

        const quote = await prisma.bulkQuote.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(quote);
    } catch (error) {
        console.error("[ADMIN_QUOTE_PATCH]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
