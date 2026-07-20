import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCT = {
    slug: 'yellow-fin-tuna',
    name: 'Yellow Fin Tuna',
    description:
        'Premium yellow fin tuna — rich in protein and omega-3 fatty acids. Ideal for steaks, grills, and pan-frying.',
    image: 'https://pub-933f2ca73d7840ab9a8608288c2e1996.r2.dev/images/categories/marine_v3.png',
    images: [] as string[],
    grossWeight: '1000g',
    netWeight: '1000g',
    price: 110000, // ₹1100 in paisa
    originalPrice: 130000, // ₹1300 in paisa
    stock: 25,
    defaultStock: 25,
    inStock: true,
    pieces: '4-6 Steaks',
    serves: 'Serves 2-3',
    sourcing: 'Deep Sea Catch',
    cutType: 'Steaks',
    texture: 'Firm & Meaty',
    deliveryTime: '1 Day',
    categorySlug: 'marine-fish',
};

async function main() {
    const total = await prisma.product.count();
    console.log(`Database has ${total} product(s).`);

    const category = await prisma.category.findUnique({
        where: { slug: PRODUCT.categorySlug },
    });

    if (!category) {
        throw new Error(`Category "${PRODUCT.categorySlug}" not found. Create it first or fix the slug.`);
    }

    const existing = await prisma.product.findUnique({ where: { slug: PRODUCT.slug } });

    if (existing) {
        const updated = await prisma.product.update({
            where: { id: existing.id },
            data: {
                name: PRODUCT.name,
                description: PRODUCT.description,
                image: PRODUCT.image,
                images: PRODUCT.images,
                grossWeight: PRODUCT.grossWeight,
                netWeight: PRODUCT.netWeight,
                price: PRODUCT.price,
                originalPrice: PRODUCT.originalPrice,
                stock: PRODUCT.stock,
                defaultStock: PRODUCT.defaultStock,
                inStock: true,
                pieces: PRODUCT.pieces,
                serves: PRODUCT.serves,
                sourcing: PRODUCT.sourcing,
                cutType: PRODUCT.cutType,
                texture: PRODUCT.texture,
                deliveryTime: PRODUCT.deliveryTime,
                categoryId: category.id,
            },
        });
        console.log(`✅ Updated existing product: ${updated.name} (${updated.id})`);
        return;
    }

    const created = await prisma.product.create({
        data: {
            slug: PRODUCT.slug,
            name: PRODUCT.name,
            description: PRODUCT.description,
            image: PRODUCT.image,
            images: PRODUCT.images,
            grossWeight: PRODUCT.grossWeight,
            netWeight: PRODUCT.netWeight,
            price: PRODUCT.price,
            originalPrice: PRODUCT.originalPrice,
            stock: PRODUCT.stock,
            defaultStock: PRODUCT.defaultStock,
            inStock: PRODUCT.inStock,
            pieces: PRODUCT.pieces,
            serves: PRODUCT.serves,
            sourcing: PRODUCT.sourcing,
            cutType: PRODUCT.cutType,
            texture: PRODUCT.texture,
            deliveryTime: PRODUCT.deliveryTime,
            categoryId: category.id,
        },
    });

    console.log(`✅ Created product: ${created.name} (${created.id})`);
}

main()
    .catch((error) => {
        console.error('❌ Failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
