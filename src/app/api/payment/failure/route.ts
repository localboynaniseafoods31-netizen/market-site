import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOrderStatusUpdateEmail } from '@/lib/email';
import { sendOrderStatusUpdateWhatsApp } from '@/lib/whatsapp';
import { markOrderPaymentFailed } from '../payment-utils';
import { checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        const rateLimit = checkRateLimit(req, {
            key: 'payment:failure',
            limit: 30,
            windowMs: 60_000
        });
        if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit);

        const body = await req.json();
        const { orderId, failureToken } = body;

        if (!orderId || !failureToken) {
            return NextResponse.json({ error: 'Missing orderId or failureToken' }, { status: 400 });
        }

        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });

        if (!existingOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (!existingOrder.idempotencyKey || existingOrder.idempotencyKey !== failureToken) {
            return NextResponse.json({ error: 'Unauthorized cancellation request' }, { status: 403 });
        }

        const result = await markOrderPaymentFailed(orderId, 'FAILED');
        if (!result.success) {
            return NextResponse.json({ success: true, message: result.message });
        }

        const order = result.order;

        const customerName = order.deliveryName || order.user?.name || 'Customer';
        const customerEmail = order.deliveryEmail || order.user?.email;
        const customerPhone = order.deliveryPhone || order.user?.phone;

        if (customerEmail) {
            await sendOrderStatusUpdateEmail(
                customerEmail,
                customerName,
                order.orderNumber,
                'PENDING',
                'PAYMENT_FAILED'
            );
        }

        if (customerPhone) {
            await sendOrderStatusUpdateWhatsApp(
                customerPhone,
                customerName,
                order.orderNumber,
                'Payment Failed'
            );
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@localboynaniseafoods.com';
        await sendOrderStatusUpdateEmail(
            adminEmail,
            'Admin',
            order.orderNumber,
            'PENDING',
            'PAYMENT_FAILED'
        );

        return NextResponse.json({
            success: true,
            message: 'Order marked as failed',
            restocked: result.restocked
        });
    } catch (error) {
        console.error('Payment Failure Handling Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
