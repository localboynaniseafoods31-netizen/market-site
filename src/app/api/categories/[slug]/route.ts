import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter');

        // Handle 'all' and 'deals' special cases
        if (slug === 'all') {
            const products = await prisma.product.findMany({
                include: { category: { select: { slug: true, dealActive: true, dealPercentage: true } } },
                where: { inStock: true },
            });

            return successResponse({
                name: 'All Products',
                description: 'Explore our complete range of fresh seafood.',
                products: products.map(formatProduct),
            });
        }

        if (slug === 'deals') {
            const products = await prisma.product.findMany({
                include: { category: { select: { slug: true, dealActive: true, dealPercentage: true } } },
                where: {
                    inStock: true,
                    OR: [
                        { originalPrice: { gt: prisma.product.fields.price } },
                        { category: { dealActive: true, dealPercentage: { gt: 0 } } }
                    ],
                },
            });

            return successResponse({
                name: 'Mega Deals',
                description: 'Unbeatable offers on premium seafood!',
                products: products.map(formatProduct),
            });
        }

        // Regular category
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                products: {
                    where: {
                        inStock: true,
                        ...(filter && filter !== 'All' ? { cutType: filter } : {}),
                    },
                    include: {
                        category: { select: { slug: true, dealActive: true, dealPercentage: true } },
                    },
                },
            },
        });

        if (!category) {
            return errorResponse('NOT_FOUND', 'Category not found', 404);
        }

        return successResponse({
            id: category.id,
            slug: category.slug,
            name: category.name,
            description: category.description,
            icon: category.icon,
            products: category.products.map((p) => formatProduct(p)),
        });
    } catch (error) {
        return handleApiError(error);
    }
}

type CategoryApiProduct = {
    id: string;
    name: string;
    image: string;
    grossWeight: string;
    netWeight: string;
    price: number;
    originalPrice: number | null;
    deliveryTime: string | null;
    cutType: string | null;
    inStock: boolean;
    category?: {
        slug: string;
        dealActive?: boolean;
        dealPercentage?: number | null;
    };
};

// Helper to format product for frontend
function formatProduct(p: CategoryApiProduct) {
    const categoryDeal = (p.category?.dealActive && (p.category.dealPercentage || 0) > 0)
        ? (p.category.dealPercentage || 0)
        : 0;
    const productDeal = p.originalPrice
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;
    const offerPercentage = productDeal > 0 ? productDeal : (categoryDeal > 0 ? categoryDeal : undefined);

    return {
        id: p.id,
        title: p.name,
        image: p.image,
        grossWeight: p.grossWeight,
        netWeight: p.netWeight,
        price: p.price / 100,
        originalPrice: p.originalPrice ? p.originalPrice / 100 : undefined,
        deliveryTime: p.deliveryTime,
        category: p.category?.slug,
        subcategory: p.cutType,
        inStock: p.inStock,
        offerPercentage,
    };
}
