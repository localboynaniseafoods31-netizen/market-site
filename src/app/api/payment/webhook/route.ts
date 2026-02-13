import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { completeOrderPayment, markOrderPaymentFailed } from '../payment-utils';
import { sendOrderStatusUpdateEmail } from '@/lib/email';
import { sendOrderStatusUpdateWhatsApp } from '@/lib/whatsapp';
import { CURRENCY } from '@/lib/razorpay';
import { checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

function secureCompare(a: string, b: string) {
    const aBuf = Buffer.from(a, 'utf8');
    const bBuf = Buffer.from(b, 'utf8');
    if (aBuf.length !== bBuf.length) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: NextRequest) {
    try {
        const rateLimit = checkRateLimit(req, {
            key: 'payment:webhook',
            limit: 300,
            windowMs: 60_000
        });
        if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit);

        const bodyText = await req.text(); // Webhook signature verification needs raw body
        const signature = req.headers.get('x-razorpay-signature');
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // 1. Validation
        if (!signature || !secret) {
            return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
        }

        // 2. Verify Signature
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(bodyText)
            .digest('hex');

        if (!secureCompare(expectedSignature, signature)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const payload = JSON.parse(bodyText);
        const event = payload.event;
        const entity = payload?.payload?.payment?.entity;
        if (!entity) {
            return NextResponse.json({ success: true, message: 'Event ignored' });
        }
        const razorpayOrderId = entity.order_id;
        const razorpayPaymentId = entity.id;

        // 3. Handle Events
        if (event === 'payment.captured') {
            console.log(`Webhook: Payment Captured for ${razorpayOrderId}`);

            const order = await prisma.order.findUnique({
                where: { razorpayOrderId }
            });

            if (!order) {
                console.error(`Webhook: Order not found for ${razorpayOrderId}`);
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }

            if (entity.amount !== order.total || entity.currency !== CURRENCY) {
                console.error(`Webhook: Amount/Currency mismatch for ${razorpayOrderId}`);
                return NextResponse.json({ error: 'Payment details mismatch' }, { status: 400 });
            }

            // Use shared logic to complete order (idempotent)
            await completeOrderPayment(order.id, razorpayPaymentId, req);

            return NextResponse.json({ success: true, message: 'Order completed via webhook' });

        } else if (event === 'payment.failed') {
            console.log(`Webhook: Payment Failed for ${razorpayOrderId}`);

            const existingOrder = await prisma.order.findUnique({
                where: { razorpayOrderId },
                include: { user: true }
            });

            if (!existingOrder) {
                console.error(`Webhook: Order not found for ${razorpayOrderId}`);
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }

            const failedResult = await markOrderPaymentFailed(existingOrder.id, 'FAILED');
            if (!failedResult.success) {
                return NextResponse.json({ success: true, message: failedResult.message });
            }
            const order = failedResult.order;

            // Notify User
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

            return NextResponse.json({ success: true, message: 'Order marked as failed' });
        }

        return NextResponse.json({ success: true, message: 'Event ignored' });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
