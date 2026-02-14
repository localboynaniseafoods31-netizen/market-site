import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { successResponse, handleApiError } from '@/lib/api-response';
import { createCategorySchema } from '@/lib/validations';

// GET /api/admin/categories - List all categories with product counts
export async function GET(request: NextRequest) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const categories = await prisma.category.findMany({
            include: {
                _count: { select: { products: true } },
            },
            orderBy: { name: 'asc' },
        });

        const formattedCategories = categories.map((c) => ({
            id: c.id,
            slug: c.slug,
            name: c.name,
            description: c.description,
            icon: c.icon,
            dealPercentage: c.dealPercentage,
            dealActive: c.dealActive,
            productCount: c._count.products,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
        }));

        return successResponse(formattedCategories);
    } catch (error) {
        return handleApiError(error);
    }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const body = await request.json();

        // Sanitize slug to ensure it meets regex requirements
        if (body.slug && typeof body.slug === 'string') {
            body.slug = body.slug
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9-]/g, '-') // Replace invalid chars with hyphen
                .replace(/-+/g, '-')         // Replace multiple hyphens with single
                .replace(/^-|-$/g, '');      // Trim leading/trailing hyphens
        }

        const input = createCategorySchema.parse(body);

        const category = await prisma.$transaction(async (tx) => {
            const newCategory = await tx.category.create({
                data: input,
            });

            await tx.auditLog.create({
                data: {
                    userId: adminCheck.userId,
                    action: 'CATEGORY_CREATED',
                    entity: 'Category',
                    entityId: newCategory.id,
                    metadata: { name: newCategory.name, slug: newCategory.slug },
                },
            });

            return newCategory;
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
