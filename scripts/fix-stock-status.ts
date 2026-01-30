import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Syncing inStock status...');

    const products = await prisma.product.findMany();

    for (const product of products) {
        if (product.stock > 0 && !product.inStock) {
            await prisma.product.update({
                where: { id: product.id },
                data: { inStock: true }
            });
            console.log(`✅ Fixed ${product.name}: inStock = true`);
        } else if (product.stock <= 0 && product.inStock) {
            await prisma.product.update({
                where: { id: product.id },
                data: { inStock: false }
            });
            console.log(`✅ Fixed ${product.name}: inStock = false`);
        }
    }

    console.log('✅ Sync Complete');
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
