import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { updateOrderStatusSchema } from '@/lib/validations';

// PATCH /api/admin/orders/[id] - Update order status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const { id } = await params;
        const body = await request.json();
        const { status } = updateOrderStatusSchema.parse(body);

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
                items: { include: { product: true } }
            }
        });
        if (!order) {
            return errorResponse('NOT_FOUND', 'Order not found', 404);
        }

        const updatedOrder = await prisma.$transaction(async (tx) => {
            const updated = await tx.order.update({
                where: { id },
                data: { status },
            });

            await tx.auditLog.create({
                data: {
                    userId: adminCheck.userId,
                    action: 'ORDER_STATUS_UPDATED',
                    entity: 'Order',
                    entityId: id,
                    metadata: { oldStatus: order.status, newStatus: status },
                },
            });

            return updated;
        });

        // Send Notifications (Fire & Forget)
        const customerEmail = order.user?.email;
        const customerPhone = order.user?.phone || order.deliveryPhone;
        const customerName = order.user?.name || order.deliveryName || 'Customer';

        // 1. Email Notification
        if (customerEmail) {
            import('@/lib/email').then(({ sendOrderStatusUpdateEmail }) => {
                sendOrderStatusUpdateEmail(
                    customerEmail,
                    customerName,
                    order.orderNumber,
                    order.status as string,
                    status
                ).catch(err => console.error('Failed to send status email:', err));
            });
        }

        // 2. WhatsApp Notification
        if (customerPhone) {
            import('@/lib/whatsapp').then(({ sendOrderStatusUpdateWhatsApp }) => {
                sendOrderStatusUpdateWhatsApp(
                    customerPhone,
                    customerName,
                    order,
                    status
                ).catch(err => console.error('Failed to send status whatsapp:', err));
            });
        }

        return successResponse({
            id: updatedOrder.id,
            orderNumber: updatedOrder.orderNumber,
            status: updatedOrder.status,
        });
    } catch (error) {
        return handleApiError(error);
    }
}

// GET /api/admin/orders/[id] - Get single order (admin)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { phone: true, name: true, email: true } },
                items: {
                    include: { product: { select: { name: true, image: true, slug: true } } },
                },
            },
        });

        if (!order) {
            return errorResponse('NOT_FOUND', 'Order not found', 404);
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
            paymentStatus: order.paymentStatus,
            customer: {
                phone: order.user.phone,
                name: order.user.name,
                email: order.user.email,
            },
            delivery: {
                name: order.deliveryName,
                phone: order.deliveryPhone,
                address: order.deliveryAddress,
                city: order.deliveryCity,
                pincode: order.deliveryPincode,
            },
            items: order.items.map((item) => ({
                productId: item.productId,
                productSlug: item.product.slug,
                name: item.product.name,
                image: item.product.image,
                quantity: item.quantity,
                price: item.priceAtTime / 100,
                total: (item.priceAtTime * item.quantity) / 100,
            })),
        });
    } catch (error) {
        return handleApiError(error);
    }
}
