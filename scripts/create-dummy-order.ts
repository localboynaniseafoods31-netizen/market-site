import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Creating dummy order...');

    // 1. Get a product (first one)
    const product = await prisma.product.findFirst();
    if (!product) {
        console.error('No products found. Please seed products first.');
        process.exit(1);
    }

    // 2. Get or create a user (dummy customer)
    let user = await prisma.user.findFirst({
        where: { phone: '9988776655' }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                phone: '9988776655',
                name: 'Dummy Customer',
                role: 'USER',
            }
        });
        console.log('Created dummy user: Dummy Customer (9988776655)');
    }

    // 3. Create the order
    const order = await prisma.order.create({
        data: {
            orderNumber: `ORD-${Date.now()}`,
            userId: user.id,
            status: 'PENDING',
            subtotal: product.price * 2,
            deliveryFee: 5000,
            total: (product.price * 2) + 5000,
            deliveryName: 'Dummy Customer',
            deliveryPhone: '9988776655',
            deliveryAddress: '123 Dummy St, Fish Market',
            deliveryCity: 'Vizag',
            deliveryPincode: '530001',
            items: {
                create: [
                    {
                        productId: product.id,
                        quantity: 2,
                        priceAtTime: product.price
                    }
                ]
            }
        }
    });

    console.log(`✅ Created dummy order: ${order.orderNumber}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
