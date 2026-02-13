import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { requireAdmin } from '@/lib/admin';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { updateProductSchema } from '@/lib/validations';

// GET /api/admin/products/[id] - Get single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const { id } = await params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: { select: { id: true, slug: true, name: true } } },
        });

        if (!product) {
            return errorResponse('NOT_FOUND', 'Product not found', 404);
        }

        return successResponse({
            ...product,
            price: product.price / 100,
            originalPrice: product.originalPrice ? product.originalPrice / 100 : null,
        });
    } catch (error) {
        return handleApiError(error);
    }
}

// PATCH /api/admin/products/[id] - Update product
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const { id } = await params;
        const body = await request.json();
        const input = updateProductSchema.parse(body);

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return errorResponse('NOT_FOUND', 'Product not found', 404);
        }

        // Convert prices to paisa if provided
        const updateData: Prisma.ProductUncheckedUpdateInput = { ...input };
        if (input.price !== undefined) {
            updateData.price = input.price * 100;
        }
        if (input.originalPrice !== undefined) {
            updateData.originalPrice = input.originalPrice ? input.originalPrice * 100 : null;
        }
        const effectivePrice = updateData.price ?? existing.price;
        const effectiveOriginalPrice = updateData.originalPrice ?? existing.originalPrice;
        if (effectiveOriginalPrice !== null && effectiveOriginalPrice <= effectivePrice) {
            return errorResponse('VALIDATION_ERROR', 'Original price must be greater than price', 400);
        }

        const product = await prisma.$transaction(async (tx) => {
            const updated = await tx.product.update({
                where: { id },
                data: updateData,
            });

            await tx.auditLog.create({
                data: {
                    userId: adminCheck.userId,
                    action: 'PRODUCT_UPDATED',
                    entity: 'Product',
                    entityId: id,
                    metadata: {
                        changes: Object.keys(input),
                        oldPrice: existing.price / 100,
                        newPrice: updated.price / 100,
                    },
                },
            });

            return updated;
        });

        return successResponse({
            id: product.id,
            name: product.name,
            price: product.price / 100,
            stock: product.stock,
        });
    } catch (error) {
        return handleApiError(error);
    }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const { id } = await params;

        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return errorResponse('NOT_FOUND', 'Product not found', 404);
        }

        await prisma.$transaction(async (tx) => {
            await tx.product.delete({ where: { id } });

            await tx.auditLog.create({
                data: {
                    userId: adminCheck.userId,
                    action: 'PRODUCT_DELETED',
                    entity: 'Product',
                    entityId: id,
                    metadata: { name: product.name, slug: product.slug },
                },
            });
        });

        return successResponse({ deleted: true, id });
    } catch (error) {
        return handleApiError(error);
    }
}
