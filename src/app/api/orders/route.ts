import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, subtotal, deliveryFee, total, phone, name, email, address, city, pincode } = body;

        if (!phone || !items || items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Transaction: Check Stock -> Deduct Stock -> Create Order
        const result = await prisma.$transaction(async (tx) => {
            // A. Find or Create User
            let user = await tx.user.findUnique({ where: { phone } });

            if (!user) {
                user = await tx.user.create({
                    data: { phone, name, email, role: 'USER' },
                });
            } else if ((name && !user.name) || (email && !user.email)) {
                user = await tx.user.update({
                    where: { id: user.id },
                    data: { name: name || undefined, email: email || undefined },
                });
            }

            // B. Validate Stock & Prepare Items
            const orderItemsData = [];

            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                });

                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }

                if (!product.inStock || product.stock < item.quantity) {
                    throw new Error(`Out of stock: ${product.name}. Available: ${product.stock}`);
                }

                // Deduct Stock
                await tx.product.update({
                    where: { id: product.id },
                    data: {
                        stock: product.stock - item.quantity,
                        // Auto-mark as out of stock if 0
                        inStock: (product.stock - item.quantity) > 0
                    }
                });

                orderItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtTime: item.priceAtOrder, // Ensure frontend sends this or fetch fresh price
                    name: product.name // For email consistency
                });
            }

            // C. Create Order
            const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    userId: user.id,
                    status: 'PENDING',
                    subtotal,
                    deliveryFee,
                    total,
                    deliveryName: name,
                    deliveryPhone: phone,
                    deliveryEmail: email, // Save email to order
                    deliveryAddress: address,
                    deliveryCity: city,
                    deliveryPincode: pincode,
                    // Payment tracking can be added here later
                    items: {
                        create: orderItemsData.map(i => ({
                            productId: i.productId,
                            quantity: i.quantity,
                            priceAtTime: i.priceAtTime,
                        }))
                    },
                },
                include: { items: true }
            });

            return { order, orderItemsData, user };
        });

        const { order, orderItemsData, user } = result;

        // 2. Send Emails (Non-blocking)
        const emailProps = {
            orderNumber: order.orderNumber,
            customerName: name || user.name || 'Customer',
            customerEmail: email || user.email || undefined,
            items: orderItemsData.map(i => ({
                name: i.name,
                quantity: i.quantity,
                price: i.priceAtTime
            })),
            subtotal: subtotal / 100, // Assuming converting from paise
            deliveryFee: deliveryFee / 100,
            total: total / 100,
            date: new Date()
        };

        // Fire and forget email tasks to avoid slowing down response
        if (email || user.email) {
            sendOrderConfirmation(emailProps, email || user.email!).catch(e => console.error('Email failed', e));
        }
        sendAdminNotification(emailProps).catch(e => console.error('Admin alert failed', e));

        return NextResponse.json({
            success: true,
            orderId: order.id,
            orderNumber: order.orderNumber
        });

    } catch (error: any) {
        console.error('Order creation failed:', error);

        // Handle specific stock errors
        if (error.message.includes('Out of stock')) {
            return NextResponse.json({ error: error.message }, { status: 409 });
        }

        if (error.message.includes('Product not found')) {
            return NextResponse.json({ error: 'One or more items in your cart are no longer available. Please clear your cart.' }, { status: 400 });
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
