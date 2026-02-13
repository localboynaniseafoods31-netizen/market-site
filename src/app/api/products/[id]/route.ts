import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: {
                    select: { slug: true, name: true, dealActive: true, dealPercentage: true },
                },
            },
        });

        if (!product) {
            return errorResponse('NOT_FOUND', 'Product not found', 404);
        }

        const categoryDeal = (product.category.dealActive && (product.category.dealPercentage || 0) > 0)
            ? (product.category.dealPercentage || 0)
            : 0;
        const productDeal = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

        // Transform to match frontend expectations
        const formattedProduct = {
            id: product.id,
            title: product.name,
            slug: product.slug,
            image: product.image,
            images: product.images,
            grossWeight: product.grossWeight,
            netWeight: product.netWeight,
            price: product.price / 100,
            originalPrice: product.originalPrice ? product.originalPrice / 100 : undefined,
            deliveryTime: product.deliveryTime,
            category: product.category.slug,
            subcategory: product.cutType,
            inStock: product.inStock,
            offerPercentage: productDeal > 0 ? productDeal : (categoryDeal > 0 ? categoryDeal : undefined),
            description: product.description,
            pieces: product.pieces,
            serves: product.serves,
            sourcing: product.sourcing,
            cutType: product.cutType,
            texture: product.texture,
        };

        return successResponse(formattedProduct);
    } catch (error) {
        return handleApiError(error);
    }
}
