import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧪 Starting Daily Stock Reset Test...');

    // 1. Get a product
    const product = await prisma.product.findFirst();
    if (!product) return;

    console.log(`Initial State: ${product.name} (Stock: ${product.stock}, Default: ${product.defaultStock})`);

    // 2. Simulate Sales (Reduce Stock manually)
    await prisma.product.update({
        where: { id: product.id },
        data: { stock: product.defaultStock - 5 }
    });
    console.log(`📉 Simulated Sales: Stock reduced to ${product.defaultStock - 5}`);

    // 3. Call Cron API
    console.log('🚀 Triggering Cron Job...');
    const response = await fetch('http://localhost:3000/api/cron/daily-reset');
    const data = await response.json();
    console.log('Cron Response:', data);

    // 4. Verify Reset
    const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });

    if (updatedProduct) {
        console.log(`📈 Post-Cron State: Stock is ${updatedProduct.stock}`);
        if (updatedProduct.stock === updatedProduct.defaultStock) {
            console.log('✅ Stock Reset Verified!');
        } else {
            console.error('❌ Stock Reset FAILED');
        }
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
