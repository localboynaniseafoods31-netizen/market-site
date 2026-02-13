import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

// GET /api/orders/[id] - Get single order
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return errorResponse('UNAUTHORIZED', 'Please login', 401);
        }

        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: { select: { name: true, image: true, slug: true } } },
                },
            },
        });

        if (!order) {
            return errorResponse('NOT_FOUND', 'Order not found', 404);
        }

        // Check ownership (unless admin)
        const isAdmin = (session.user as { role?: string }).role === 'ADMIN';
        if (order.userId !== session.user.id && !isAdmin) {
            return errorResponse('FORBIDDEN', 'Access denied', 403);
        }

        return successResponse({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            subtotal: order.subtotal / 100,
            deliveryFee: order.deliveryFee / 100,
            total: order.total / 100,
            createdAt: order.createdAt,
            paymentId: order.paymentId,
            items: order.items.map((item) => ({
                productId: item.productId,
                productSlug: item.product.slug,
                name: item.product.name,
                image: item.product.image,
                quantity: item.quantity,
                price: item.priceAtTime / 100,
                total: (item.priceAtTime * item.quantity) / 100,
            })),
            delivery: {
                name: order.deliveryName,
                phone: order.deliveryPhone,
                address: order.deliveryAddress,
                city: order.deliveryCity,
                pincode: order.deliveryPincode,
            },
        });
    } catch (error) {
        return handleApiError(error);
    }
}
