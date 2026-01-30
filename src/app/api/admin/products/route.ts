import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { successResponse, handleApiError } from '@/lib/api-response';
import { createProductSchema } from '@/lib/validations';

// GET /api/admin/products - List all products with full details
export async function GET(request: NextRequest) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const products = await prisma.product.findMany({
            include: {
                category: { select: { id: true, slug: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const formattedProducts = products.map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            description: p.description,
            image: p.image,
            images: p.images,
            grossWeight: p.grossWeight,
            netWeight: p.netWeight,
            price: p.price / 100,
            originalPrice: p.originalPrice ? p.originalPrice / 100 : null,
            stock: p.stock,
            inStock: p.inStock,
            pieces: p.pieces,
            serves: p.serves,
            sourcing: p.sourcing,
            cutType: p.cutType,
            texture: p.texture,
            deliveryTime: p.deliveryTime,
            category: p.category,
            offerPercentage: p.originalPrice
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                : null,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));

        return successResponse(formattedProducts);
    } catch (error) {
        return handleApiError(error);
    }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const body = await request.json();
        const input = createProductSchema.parse(body);

        const product = await prisma.$transaction(async (tx) => {
            const newProduct = await tx.product.create({
                data: {
                    ...input,
                    price: input.price * 100, // Convert to paisa
                    originalPrice: input.originalPrice ? input.originalPrice * 100 : null,
                },
                include: { category: { select: { slug: true, name: true } } },
            });

            await tx.auditLog.create({
                data: {
                    userId: adminCheck.userId,
                    action: 'PRODUCT_CREATED',
                    entity: 'Product',
                    entityId: newProduct.id,
                    metadata: { name: newProduct.name, slug: newProduct.slug },
                },
            });

            return newProduct;
        });

        return successResponse({
            id: product.id,
            name: product.name,
            slug: product.slug,
        });
    } catch (error) {
        return handleApiError(error);
    }
}
