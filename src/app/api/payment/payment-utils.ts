import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/email';
import { sendOrderConfirmationWhatsApp, sendAdminAlertWhatsApp } from '@/lib/whatsapp';
import { generateInvoicePDF } from '@/lib/invoice-pdf';
import { uploadToR2 } from '@/lib/r2';
import { getAdminContacts } from '@/lib/notification-utils';

type FailedPaymentReason = 'FAILED' | 'ABANDONED';
const invoiceTokenSecret = process.env.AUTH_SECRET || process.env.RAZORPAY_KEY_SECRET || '';

const buildInvoiceToken = (orderId: string, orderNumber: string, total: number): string | null => {
    if (!invoiceTokenSecret) return null;
    return crypto
        .createHmac('sha256', invoiceTokenSecret)
        .update(`${orderId}|${orderNumber}|${total}`)
        .digest('hex');
};

export async function markOrderPaymentFailed(
    dbOrderId: string,
    reason: FailedPaymentReason
) {
    const existingOrder = await prisma.order.findUnique({
        where: { id: dbOrderId },
        include: { items: true, user: true }
    });

    if (!existingOrder) {
        throw new Error('Order not found');
    }

    if (existingOrder.paymentStatus === 'PAID') {
        return { success: false, message: 'Order already paid', order: existingOrder, restocked: false };
    }

    if (
        existingOrder.status === 'CANCELLED'
        && ['FAILED', 'ABANDONED'].includes(existingOrder.paymentStatus || '')
    ) {
        return { success: false, message: 'Order already marked as failed', order: existingOrder, restocked: false };
    }

    const shouldRestock = existingOrder.status !== 'CANCELLED';

    const updatedOrder = await prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
            where: { id: dbOrderId },
            data: {
                status: 'CANCELLED',
                paymentStatus: reason,
                idempotencyKey: null
            },
            include: { items: { include: { product: true } }, user: true }
        });

        if (shouldRestock) {
            for (const item of existingOrder.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { increment: item.quantity },
                        inStock: true
                    }
                });
            }
        }

        return order;
    });

    return { success: true, message: 'Order marked as failed', order: updatedOrder, restocked: shouldRestock };
}

/**
 * Handle successful payment completion
 * Shared by /verify (client-side) and /webhook (server-side)
 */
export async function completeOrderPayment(
    dbOrderId: string,
    paymentId: string,
    req?: Request // Optional: for host resolution
) {
    // 1. Check if already paid to avoid duplicate notifications
    const existingOrder = await prisma.order.findUnique({
        where: { id: dbOrderId },
        include: { items: true }
    });

    if (!existingOrder) {
        throw new Error('Order not found');
    }

    if (existingOrder.paymentStatus === 'PAID') {
        return { success: true, message: 'Already processed', order: existingOrder };
    }

    // 2. Update Order.
    // If the order was previously cancelled as unpaid and stock was restored,
    // deduct stock again before marking payment success.
    const shouldRedeductStock = existingOrder.status === 'CANCELLED'
        && ['FAILED', 'ABANDONED'].includes(existingOrder.paymentStatus || '');

    const order = await prisma.$transaction(async (tx) => {
        if (shouldRedeductStock) {
            for (const item of existingOrder.items) {
                const updated = await tx.product.updateMany({
                    where: {
                        id: item.productId,
                        stock: { gte: item.quantity }
                    },
                    data: {
                        stock: { decrement: item.quantity }
                    }
                });

                if (updated.count === 0) {
                    throw new Error(`Insufficient stock for paid order recovery: ${item.productId}`);
                }

                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                    select: { stock: true, inStock: true }
                });

                if (product && product.inStock && product.stock <= 0) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { inStock: false }
                    });
                }
            }
        }

        return tx.order.update({
            where: { id: dbOrderId },
            data: {
                paymentStatus: 'PAID',
                paymentId: paymentId,
                status: 'CONFIRMED',
                idempotencyKey: null
            },
            include: { items: { include: { product: true } }, user: true }
        });
    });

    // 3. Generate PDF Invoice & Upload to R2
    let invoiceUrl: string | null = null;
    try {
        const pdfBuffer = await generateInvoicePDF({
            orderNumber: order.orderNumber,
            orderDate: order.createdAt,
            customerName: order.deliveryName || order.user?.name || 'Customer',
            customerPhone: order.deliveryPhone || order.user?.phone || '',
            customerEmail: order.user?.email || undefined,
            deliveryAddress: order.deliveryAddress || '',
            deliveryCity: order.deliveryCity || '',
            deliveryPincode: order.deliveryPincode || '',
            items: order.items.map(i => ({
                name: i.product.name,
                quantity: i.quantity,
                weight: i.product.netWeight || undefined,
                price: i.priceAtTime
            })),
            subtotal: order.subtotal,
            deliveryFee: order.deliveryFee,
            total: order.total,
            paymentStatus: order.paymentStatus || 'PAID',
            paymentId: order.paymentId || undefined
        });

        // Upload to R2
        const pdfKey = `invoices/${order.orderNumber}.pdf`;
        invoiceUrl = await uploadToR2(pdfKey, pdfBuffer, 'application/pdf');

        // Update order with invoice URL
        if (invoiceUrl) {
            await prisma.order.update({
                where: { id: order.id },
                data: { invoiceUrl }
            });
        }
    } catch (pdfError) {
        console.error('PDF Generation/Upload failed:', pdfError);
    }

    // Fallback URL
    let finalInvoiceUrl = invoiceUrl;
    if (!finalInvoiceUrl) {
        // Try to construct likely URL or fallback
        const host = req?.headers.get('host') || 'localhost:3000';
        const protocol = req?.headers.get('x-forwarded-proto') || 'http';
        // Note: process.env.NEXT_PUBLIC_APP_URL is best if available
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
        const token = buildInvoiceToken(order.id, order.orderNumber, order.total);
        finalInvoiceUrl = token
            ? `${appUrl}/orders/${order.id}/invoice?t=${encodeURIComponent(token)}`
            : `${appUrl}/orders/${order.id}/invoice`;
    }

    // 4. Send Notifications

    // WhatsApp to Customer (Fire & Forget)
    sendOrderConfirmationWhatsApp(order, finalInvoiceUrl).catch(e => console.error('WhatsApp User failed', e));

    // Dynamic Admin Notifications (DB Admins)
    const { phones, emails } = await getAdminContacts();

    // Admin WhatsApp
    if (phones.length > 0) {
        phones.forEach(phone => {
            sendAdminAlertWhatsApp(order, phone).catch(e => console.error(`WhatsApp Admin (${phone}) failed`, e));
        });
    } else {
        // Fallback to Env Var
        sendAdminAlertWhatsApp(order).catch(e => console.error('WhatsApp Admin (Env) failed', e));
    }

    // Admin Email
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
        date: new Date(order.createdAt),
        invoiceUrl: finalInvoiceUrl
    };

    if (order.user?.email) {
        sendOrderConfirmation(emailProps, order.user.email).catch(console.error);
    }

    // Admin Emails (DB or Env Fallback)
    if (emails.length > 0) {
        emails.forEach(email => {
            sendAdminNotification(emailProps, email).catch(console.error);
        });
    } else {
        sendAdminNotification(emailProps).catch(console.error);
    }

    return { success: true, order, invoiceUrl: finalInvoiceUrl };
}
