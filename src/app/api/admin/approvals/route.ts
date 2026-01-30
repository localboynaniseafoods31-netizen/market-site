import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
    try {
        const { authorized } = await requireAdmin();
        if (!authorized) return errorResponse('UNAUTHORIZED', 'Unauthorized', 401);

        const sales = await prisma.dailySale.findMany({
            where: { status: 'PENDING_APPROVAL' },
            include: {
                createdBy: { select: { name: true, email: true } },
                items: { include: { product: true } }
            },
            orderBy: { date: 'asc' }
        });

        return successResponse(sales);
    } catch (error) {
        return errorResponse('INTERNAL_ERROR', 'Failed to fetch pending approvals', 500);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { authorized, userId } = await requireAdmin();
        if (!authorized || !userId) return errorResponse('UNAUTHORIZED', 'Unauthorized', 401);

        const body = await req.json();
        const { id, action } = body; // action: 'APPROVE' | 'REJECT'

        if (!id || !['APPROVE', 'REJECT'].includes(action)) {
            return errorResponse('VALIDATION_ERROR', 'Invalid action', 400);
        }

        const status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

        const updatedSale = await prisma.dailySale.update({
            where: { id },
            data: {
                status,
                approvedById: userId,
                updatedAt: new Date(),
            }
        });

        return successResponse(updatedSale, `Sale ${status.toLowerCase()}`);
    } catch (error) {
        return errorResponse('INTERNAL_ERROR', 'Failed to process approval', 500);
    }
}
