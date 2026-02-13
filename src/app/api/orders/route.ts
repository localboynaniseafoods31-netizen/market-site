import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { DELIVERY_FEE, DELIVERY_FREE_WEIGHT_THRESHOLD_KG } from '@/config/constants';
import { parseWeight } from '@/lib/utils';
import { checkDeliveryAvailability } from '@/data/deliveryZones';
import { checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        const rateLimit = checkRateLimit(req, {
            key: 'orders:create',
            limit: 20,
            windowMs: 60_000
        });
        if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit);

        const body = await req.json();
        const { items, phone, name, email, address, city, pincode } = body;

        if (!phone || !items || items.length === 0 || !address || !city || !pincode) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const normalizedPincode = String(pincode).replace(/\D/g, '').slice(0, 6);
        const normalizedCity = String(city).trim();
        const normalizedAddress = String(address).trim();
        if (!/^\d{6}$/.test(normalizedPincode)) {
            return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 });
        }

        const deliveryCheck = checkDeliveryAvailability(normalizedPincode);
        if (!deliveryCheck.available || !deliveryCheck.zone) {
            return NextResponse.json({ error: 'Delivery is not available for this pincode' }, { status: 400 });
        }

        const expectedCity = deliveryCheck.zone.locality.trim().toLowerCase();
        if (normalizedCity.toLowerCase() !== expectedCity) {
            return NextResponse.json({ error: `City must match '${deliveryCheck.zone.locality}' for this pincode` }, { status: 400 });
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
            let serverSubtotal = 0;
            let serverWeight = 0;

            for (const item of items) {
                if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                    throw new Error(`Invalid quantity for product: ${item.productId}`);
                }

                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                });

                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }

                if (!product.inStock || product.stock < item.quantity) {
                    throw new Error(`Out of stock: ${product.name}. Available: ${product.stock}`);
                }

                // Deduct stock atomically to prevent lost updates in concurrent checkouts
                const updated = await tx.product.updateMany({
                    where: {
                        id: product.id,
                        inStock: true,
                        stock: { gte: item.quantity }
                    },
                    data: {
                        stock: { decrement: item.quantity }
                    }
                });

                if (updated.count === 0) {
                    throw new Error(`Out of stock: ${product.name}. Available: ${product.stock}`);
                }

                const updatedProduct = await tx.product.findUnique({
                    where: { id: product.id },
                    select: { stock: true, inStock: true }
                });

                if (updatedProduct && updatedProduct.inStock && updatedProduct.stock <= 0) {
                    await tx.product.update({
                        where: { id: product.id },
                        data: { inStock: false }
                    });
                }

                const itemPrice = product.price; // Price from DB (in Paise)
                const lineTotal = itemPrice * item.quantity;
                serverSubtotal += lineTotal;

                // Calculate Weight
                const weightKg = parseWeight(product.netWeight || product.grossWeight);
                serverWeight += weightKg * item.quantity;

                orderItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtTime: itemPrice,
                    name: product.name
                });
            }

            // Recalculate Delivery Fee
            const serverDeliveryFee = serverWeight >= DELIVERY_FREE_WEIGHT_THRESHOLD_KG ? 0 : (DELIVERY_FEE * 100); // Fee in Paise
            const serverTotal = serverSubtotal + serverDeliveryFee;
            const minOrderPaisa = deliveryCheck.zone!.minOrder * 100;

            if (serverTotal < minOrderPaisa) {
                throw new Error(`Minimum order for this area is ₹${deliveryCheck.zone!.minOrder}`);
            }

            // C. Create Order
            const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    userId: user.id,
                    status: 'PENDING',
                    subtotal: serverSubtotal, // Use server calculated values
                    deliveryFee: serverDeliveryFee,
                    total: serverTotal,
                    deliveryName: name,
                    deliveryPhone: phone,
                    deliveryEmail: email, // Save email to order
                    deliveryAddress: normalizedAddress,
                    deliveryCity: normalizedCity,
                    deliveryPincode: normalizedPincode,
                    idempotencyKey: crypto.randomUUID(),
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

            return { order, orderItemsData, user, serverSubtotal, serverDeliveryFee, serverTotal };
        });

        const { order, serverTotal } = result;

        return NextResponse.json({
            success: true,
            orderId: order.id,
            orderNumber: order.orderNumber,
            paymentInitToken: order.idempotencyKey,
            total: serverTotal, // Return server calculated total
            currency: "INR"
        });

    } catch (error: unknown) {
        console.error('Order creation failed:', error);
        const message = error instanceof Error ? error.message : '';

        // Handle specific stock errors
        if (message.includes('Out of stock')) {
            return NextResponse.json({ error: message }, { status: 409 });
        }

        if (message.includes('Product not found')) {
            return NextResponse.json({ error: 'One or more items in your cart are no longer available. Please clear your cart.' }, { status: 400 });
        }

        if (message.includes('Invalid quantity') || message.includes('Minimum order')) {
            return NextResponse.json({ error: message }, { status: 400 });
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
