import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { createCategorySchema } from '@/lib/validations';

// GET /api/admin/categories/[id] - Get single category
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const { id } = await params;

        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                products: {
                    select: { id: true, name: true, price: true, stock: true, image: true },
                },
                _count: { select: { products: true } },
            },
        });

        if (!category) {
            return errorResponse('NOT_FOUND', 'Category not found', 404);
        }

        return successResponse({
            ...category,
            products: category.products.map((p) => ({
                ...p,
                price: p.price / 100,
            })),
        });
    } catch (error) {
        return handleApiError(error);
    }
}

// PATCH /api/admin/categories/[id] - Update category
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const { id } = await params;
        const body = await request.json();
        const input = createCategorySchema.partial().parse(body);

        const existing = await prisma.category.findUnique({ where: { id } });
        if (!existing) {
            return errorResponse('NOT_FOUND', 'Category not found', 404);
        }

        const category = await prisma.$transaction(async (tx) => {
            const updated = await tx.category.update({
                where: { id },
                data: input,
            });

            await tx.auditLog.create({
                data: {
                    userId: adminCheck.userId,
                    action: 'CATEGORY_UPDATED',
                    entity: 'Category',
                    entityId: id,
                    metadata: { changes: Object.keys(input) },
                },
            });

            return updated;
        });

        return successResponse({
            id: category.id,
            name: category.name,
            slug: category.slug,
        });
    } catch (error) {
        return handleApiError(error);
    }
}

// DELETE /api/admin/categories/[id] - Delete category
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const { id } = await params;

        const category = await prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { products: true } } },
        });

        if (!category) {
            return errorResponse('NOT_FOUND', 'Category not found', 404);
        }

        if (category._count.products > 0) {
            return errorResponse(
                'HAS_PRODUCTS',
                'Cannot delete category with products. Move or delete products first.',
                400
            );
        }

        await prisma.$transaction(async (tx) => {
            await tx.category.delete({ where: { id } });

            await tx.auditLog.create({
                data: {
                    userId: adminCheck.userId,
                    action: 'CATEGORY_DELETED',
                    entity: 'Category',
                    entityId: id,
                    metadata: { name: category.name, slug: category.slug },
                },
            });
        });

        return successResponse({ deleted: true, id });
    } catch (error) {
        return handleApiError(error);
    }
}
