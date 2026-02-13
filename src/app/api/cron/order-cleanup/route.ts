import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { markOrderPaymentFailed } from '@/app/api/payment/payment-utils';

export async function GET(req: NextRequest) {
    // 1. Auth Check
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
        return new NextResponse('Cron secret not configured', { status: 500 });
    }
    if (authHeader !== `Bearer ${cronSecret}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        console.log('🧹 Starting Order Cleanup...');

        // 2. Find Abandoned Orders (PENDING > 30 mins)
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        const abandonedOrders = await prisma.order.findMany({
            where: {
                status: 'PENDING',
                createdAt: {
                    lt: thirtyMinutesAgo
                },
                // Avoid cancelling orders that might be in a weird state of "Processing" but marked Pending? 
                // No, scheme is strict.
                paymentStatus: {
                    not: 'PAID'
                }
            },
            include: { items: true }
        });

        console.log(`Found ${abandonedOrders.length} abandoned orders.`);

        let cancelledCount = 0;

        for (const order of abandonedOrders) {
            const result = await markOrderPaymentFailed(order.id, 'ABANDONED');
            if (result.success) {
                cancelledCount += 1;
            }
        }

        return NextResponse.json({
            success: true,
            cancelledCount,
            message: `Cancelled ${cancelledCount} abandoned orders`
        });

    } catch (error) {
        console.error('Cleanup Failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
