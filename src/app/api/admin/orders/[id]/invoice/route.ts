import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

// GET /api/admin/orders/[id]/invoice - Generate invoice data
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
                    include: { product: { select: { name: true } } },
                },
            },
        });

        if (!order) {
            return errorResponse('NOT_FOUND', 'Order not found', 404);
        }

        // Generate invoice data (can be used with jsPDF on frontend)
        const invoice = {
            invoiceNumber: `INV-${order.orderNumber}`,
            invoiceDate: new Date().toISOString(),
            orderNumber: order.orderNumber,
            orderDate: order.createdAt.toISOString(),
            status: order.status,

            // Company Info
            company: {
                name: 'Localboynaniseafoods',
                address: 'Bangalore, Karnataka, India',
                phone: '+91-9912163082',
                email: 'hello@localboynaniseafoods.com',
                gstin: 'GSTIN_PLACEHOLDER', // Replace with actual GSTIN
            },

            // Customer Info
            customer: {
                name: order.deliveryName,
                phone: order.deliveryPhone,
                email: order.user.email,
                address: order.deliveryAddress,
                city: order.deliveryCity,
                pincode: order.deliveryPincode,
            },

            // Items
            items: order.items.map((item, idx) => ({
                sno: idx + 1,
                name: item.product.name,
                quantity: item.quantity,
                rate: item.priceAtTime / 100,
                amount: (item.priceAtTime * item.quantity) / 100,
            })),

            // Totals
            subtotal: order.subtotal / 100,
            deliveryFee: order.deliveryFee / 100,
            total: order.total / 100,

            // Payment
            paymentId: order.paymentId,
            paymentStatus: order.paymentStatus || 'pending',
        };

        return successResponse(invoice);
    } catch (error) {
        return handleApiError(error);
    }
}
