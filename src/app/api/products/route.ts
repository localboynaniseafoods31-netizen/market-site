import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api-response';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: {
                    select: { slug: true, name: true },
                },
            },
            where: { inStock: true },
            orderBy: { createdAt: 'desc' },
        });

        // Transform to match frontend expectations
        const formattedProducts = products.map((p) => ({
            id: p.id,
            title: p.name,
            slug: p.slug,
            image: p.image,
            images: p.images,
            grossWeight: p.grossWeight,
            netWeight: p.netWeight,
            price: p.price / 100, // Convert paisa to rupees for frontend
            originalPrice: p.originalPrice ? p.originalPrice / 100 : undefined,
            deliveryTime: p.deliveryTime,
            category: p.category.slug,
            subcategory: p.cutType,
            inStock: p.inStock,
            offerPercentage: p.originalPrice
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                : undefined,
            description: p.description,
            pieces: p.pieces,
            serves: p.serves,
            sourcing: p.sourcing,
            cutType: p.cutType,
            texture: p.texture,
        }));

        return successResponse(formattedProducts);
    } catch (error) {
        return handleApiError(error);
    }
}
