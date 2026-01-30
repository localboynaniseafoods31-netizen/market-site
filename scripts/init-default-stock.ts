import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Initializing Default Stock...');

    const products = await prisma.product.findMany();

    for (const product of products) {
        // Set defaultStock = current stock initially
        // or a fixed number if stock is low? Let's use current stock + 10 as a seed
        const defaultStock = product.stock > 0 ? product.stock : 20;

        await prisma.product.update({
            where: { id: product.id },
            data: { defaultStock }
        });

        console.log(`Updated ${product.name}: Default Stock = ${defaultStock}`);
    }

    console.log('✅ Default Stock Initialized');
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
