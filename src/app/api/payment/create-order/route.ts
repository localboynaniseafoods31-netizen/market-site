import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getRazorpay, CURRENCY } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.paymentStatus === 'PAID') {
            return NextResponse.json({ error: 'Order already paid' }, { status: 400 });
        }

        // Create Razorpay Order
        const payment_capture = 1;
        const amount = order.total * 100; // Expected in paise (already stored in paise? No, total is in paise usually in your DB, check schema types)
        // Schema says Int. In API response earlier total: order.total / 100 which implied stored in paise.
        // Wait, earlier logic: "total: (product.price * 2) + 5000". Product price 72000 (720 INR).
        // So total is stored in paise. Razorpay expects paise. 
        // So we just use order.total directly. 
        // DOUBLE CHECK: Razorpay docs say amount in smallest currency unit.
        // If DB stores 72000 for 720Rs, then passing 72000 is correct.

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

        // Update Order with Razorpay Order ID
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
            keyId: process.env.RAZORPAY_KEY_ID // Send publishable key to frontend
        });

    } catch (error) {
        console.error('Payment Init Failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
