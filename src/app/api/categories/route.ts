import prisma from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api-response';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        products: {
                            where: { inStock: true }
                        }
                    },
                },
            },
            orderBy: { name: 'asc' },
        });

        const formattedCategories = categories
            .map((c) => ({
                id: c.id,
                slug: c.slug,
                name: c.name,
                description: c.description,
                icon: c.icon,
                productCount: c._count.products,
            }))
            .filter(c => c.productCount > 0);

        return successResponse(formattedCategories);
    } catch (error) {
        return handleApiError(error);
    }
}
