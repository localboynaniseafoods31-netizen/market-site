import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { completeOrderPayment } from '../payment-utils';
import { CURRENCY, getRazorpay } from '@/lib/razorpay';
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
            key: 'payment:verify',
            limit: 40,
            windowMs: 60_000
        });
        if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit);

        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = body;

        const secret = process.env.RAZORPAY_KEY_SECRET;

        // 1. Validation
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !secret) {
            return NextResponse.json({ error: 'Missing parameters or check env' }, { status: 400 });
        }

        // 2. Verify Signature
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (!secureCompare(generated_signature, razorpay_signature)) {
            return NextResponse.json({ error: 'Invalid signature', success: false }, { status: 400 });
        }

        // 3. Complete Order
        // Search by razorpay_order_id first to get DB ID
        const order = await prisma.order.findUnique({
            where: { razorpayOrderId: razorpay_order_id }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const payment = await getRazorpay().payments.fetch(razorpay_payment_id);
        const isOrderLinked = payment.order_id === razorpay_order_id;
        const isAmountValid = payment.amount === order.total;
        const isCurrencyValid = payment.currency === CURRENCY;
        const isCaptured = payment.status === 'captured';

        if (!isOrderLinked || !isAmountValid || !isCurrencyValid || !isCaptured) {
            return NextResponse.json(
                { error: 'Payment validation mismatch', success: false },
                { status: 400 }
            );
        }

        const result = await completeOrderPayment(order.id, razorpay_payment_id, req);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            invoiceUrl: result.invoiceUrl
        });

    } catch (error) {
        console.error('Payment Verify Failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
