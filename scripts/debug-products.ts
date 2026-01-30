import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Listing all products...');
    const products = await prisma.product.findMany();
    console.log(products.map(p => ({ id: p.id, name: p.name, stock: p.stock })));
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
