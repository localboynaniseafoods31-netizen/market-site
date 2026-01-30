import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { requireEditor } from '@/lib/admin';
import { errorResponse, successResponse } from '@/lib/api-response';
import { z } from 'zod';

const dailySaleItemSchema = z.object({
    productId: z.string(),
    price: z.number().min(0),
    stock: z.number().min(0),
});

const createDailySaleSchema = z.object({
    date: z.string(), // ISO Date string
    items: z.array(dailySaleItemSchema),
});

export async function POST(req: NextRequest) {
    try {
        const { authorized, userId } = await requireEditor();
        if (!authorized || !userId) {
            return errorResponse('UNAUTHORIZED', 'Unauthorized', 401);
        }

        const body = await req.json();
        const validation = createDailySaleSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse('VALIDATION_ERROR', 'Invalid data', 400, validation.error);
        }

        const { date, items } = validation.data;
        const targetDate = new Date(date);

        // Check if there's already a sale for this date
        // If draft/rejected, update it. If approved/pending, logic might differ (for now allow update if not approved)
        // Upsert logic for DailySale

        const sale = await prisma.$transaction(async (tx) => {
            // Find existing
            const existing = await tx.dailySale.findFirst({
                where: { date: targetDate },
                include: { items: true }
            });

            if (existing && existing.status === 'APPROVED') {
                // For now, prevent editing approved sales without admin override (or specific logic)
                // But requested workflow allows draft -> approval. 
                // If approved, maybe Editor can't change? Let's assume yes.
                throw new Error('Cannot edit an approved sale. Contact Admin.');
            }

            // Create or Update Sale Header
            const dailySale = await tx.dailySale.upsert({
                where: {
                    date: targetDate,
                    // Prisma allows upsert by unique field
                },
                update: {
                    status: 'PENDING_APPROVAL', // Reset to pending on edit
                    updatedAt: new Date(),
                },
                create: {
                    date: targetDate,
                    status: 'PENDING_APPROVAL',
                    createdById: userId,
                },
            });

            // Handle Items: Delete all previous and recreate (easiest for full update)
            if (existing) {
                await tx.dailySaleItem.deleteMany({
                    where: { dailySaleId: dailySale.id }
                });
            }

            // Create new items
            if (items.length > 0) {
                await tx.dailySaleItem.createMany({
                    data: items.map(item => ({
                        dailySaleId: dailySale.id,
                        productId: item.productId,
                        price: item.price,
                        stock: item.stock,
                    }))
                });
            }

            return dailySale;
        });

        return successResponse(sale, 'Daily Sale submitted for approval');
    } catch (error: any) {
        console.error('Daily Sale Create Error:', error);
        return errorResponse('INTERNAL_ERROR', error.message || 'Failed to create sale', 500);
    }
}

export async function GET(req: NextRequest) {
    try {
        const { authorized } = await requireEditor();
        if (!authorized) return errorResponse('UNAUTHORIZED', 'Unauthorized', 401);

        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get('date');

        if (!dateStr) return errorResponse('VALIDATION_ERROR', 'Date required', 400);

        const date = new Date(dateStr);

        const sale = await prisma.dailySale.findFirst({
            where: { date },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        return successResponse(sale || null);
    } catch (error) {
        return errorResponse('INTERNAL_ERROR', 'Failed to fetch sale', 500);
    }
}
