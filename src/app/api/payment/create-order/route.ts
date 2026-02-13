import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getRazorpay, CURRENCY } from '@/lib/razorpay';
import { checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        const rateLimit = checkRateLimit(req, {
            key: 'payment:create-order',
            limit: 30,
            windowMs: 60_000
        });
        if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit);

        const body = await req.json();
        const { orderId, paymentInitToken } = body;

        if (!orderId || !paymentInitToken) {
            return NextResponse.json({ error: 'Order ID and payment token required' }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        if (!order.idempotencyKey || order.idempotencyKey !== String(paymentInitToken)) {
            return NextResponse.json({ error: 'Unauthorized payment init request' }, { status: 403 });
        }

        if (order.paymentStatus === 'PAID') {
            return NextResponse.json({ error: 'Order already paid' }, { status: 400 });
        }

        if (order.status === 'CANCELLED') {
            return NextResponse.json({ error: 'Order is cancelled' }, { status: 400 });
        }

        // Reuse existing pending Razorpay order for idempotency
        if (order.paymentStatus === 'PENDING' && order.razorpayOrderId && order.idempotencyKey) {
            return NextResponse.json({
                id: order.razorpayOrderId,
                currency: CURRENCY,
                amount: order.total,
                keyId: process.env.RAZORPAY_KEY_ID,
                failureToken: order.idempotencyKey
            });
        }

        const payment_capture = 1;

        const options = {
            amount: order.total,
            currency: CURRENCY,
            receipt: orderId,
            payment_capture,
            notes: {
                orderNumber: order.orderNumber,
                userId: order.userId
            }
        };

        const razorpayOrder = await getRazorpay().orders.create(options);
        const failureToken = order.idempotencyKey;

        await prisma.order.update({
            where: { id: orderId },
            data: {
                razorpayOrderId: razorpayOrder.id,
                paymentStatus: 'PENDING'
            }
        });

        return NextResponse.json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
            keyId: process.env.RAZORPAY_KEY_ID,
            failureToken
        });

    } catch (error) {
        console.error('Payment Init Failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
