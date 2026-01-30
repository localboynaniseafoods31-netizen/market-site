import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { successResponse, handleApiError } from '@/lib/api-response';

// GET /api/admin/orders - Get all orders (admin only)
export async function GET(request: NextRequest) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 20;

        const where = status ? { status: status as any } : {};

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: { select: { phone: true, name: true, email: true } },
                    items: {
                        include: { product: { select: { name: true, image: true } } },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.order.count({ where }),
        ]);

        const formattedOrders = orders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            total: order.total / 100,
            createdAt: order.createdAt,
            customer: {
                phone: order.user.phone,
                name: order.user.name || order.deliveryName,
                email: order.user.email,
            },
            delivery: {
                name: order.deliveryName,
                phone: order.deliveryPhone,
                address: order.deliveryAddress,
                city: order.deliveryCity,
                pincode: order.deliveryPincode,
            },
            itemCount: order.items.length,
            items: order.items.map((item) => ({
                name: item.product.name,
                image: item.product.image,
                quantity: item.quantity,
                price: item.priceAtTime / 100,
            })),
        }));

        return successResponse({
            orders: formattedOrders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return handleApiError(error);
    }
}
