import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const baseUrl = 'http://localhost:3000';
    console.log('🧪 Starting Order Flow Test...');

    // 1. Get a product
    const product = await prisma.product.findFirst({
        where: { inStock: true, stock: { gt: 0 } }
    });

    if (!product) {
        console.error('❌ No available products to test with.');
        return;
    }

    console.log(`📦 Testing with Product: ${product.name} (Stock: ${product.stock})`);

    // 2. Prepare Payload
    const payload = {
        phone: '9998887776',
        name: 'Test Automatic User',
        email: 'test@example.com',
        address: '123 Test Lane',
        city: 'Test City',
        pincode: '123456',
        subtotal: product.price,
        deliveryFee: 5000,
        total: product.price + 5000,
        items: [
            {
                productId: product.id,
                quantity: 1,
                priceAtOrder: product.price
            }
        ]
    };

    // 3. Send Request
    console.log('🚀 Sending Order Request...');
    const response = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('❌ Order Failed:', data);
        return;
    }

    console.log(`✅ Order Created: ${data.orderNumber} (ID: ${data.orderId})`);

    // 4. Verify Stock Deduction
    const updatedProduct = await prisma.product.findUnique({
        where: { id: product.id }
    });

    if (updatedProduct) {
        console.log(`📉 Stock Update: ${product.stock} -> ${updatedProduct.stock}`);
        if (updatedProduct.stock === product.stock - 1) {
            console.log('✅ Stock deduction verified!');
        } else {
            console.error('❌ Stock deduction FAILED!');
        }
    }

    // 5. Verify User
    const user = await prisma.user.findUnique({ where: { phone: payload.phone } });
    if (user && user.email === payload.email) {
        console.log('✅ User created/updated with email!');
    } else {
        console.log('❌ User email update failed!');
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
