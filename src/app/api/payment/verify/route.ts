import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/email';
import { sendOrderConfirmationWhatsApp, sendAdminAlertWhatsApp } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
    try {
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

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid signature', success: false }, { status: 400 });
        }

        // 3. Update Order
        const order = await prisma.order.update({
            where: { razorpayOrderId: razorpay_order_id },
            data: {
                paymentStatus: 'PAID',
                paymentId: razorpay_payment_id,
                status: 'CONFIRMED' // Auto-confirm on payment
            },
            include: { items: { include: { product: true } }, user: true }
        });

        // 4. Send Notifications (WhatsApp + Email)

        // WhatsApp (Primary - Fire & Forget)
        sendOrderConfirmationWhatsApp(order).catch(e => console.error('WhatsApp User failed', e));
        sendAdminAlertWhatsApp(order).catch(e => console.error('WhatsApp Admin failed', e));

        // Email (Backup / Official Record)
        const emailProps = {
            orderNumber: order.orderNumber,
            customerName: order.user?.name || order.deliveryName || 'Customer',
            customerEmail: order.user?.email || undefined,
            items: order.items.map(i => ({
                name: i.product.name,
                quantity: i.quantity,
                price: i.priceAtTime
            })),
            subtotal: order.subtotal / 100,
            deliveryFee: order.deliveryFee / 100,
            total: order.total / 100,
            date: new Date(order.createdAt)
        };

        if (order.user?.email) {
            sendOrderConfirmation(emailProps, order.user.email).catch(console.error);
        }

        // Admin Email Notification (Backup)
        sendAdminNotification(emailProps).catch(console.error);

        return NextResponse.json({ success: true, orderId: order.id });

    } catch (error) {
        console.error('Payment Verify Failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
