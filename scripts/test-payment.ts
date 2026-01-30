import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'test_secret';

async function main() {
    console.log('🧪 Starting Razorpay Verification Test...');

    // 1. Get a pending order (Mocking one if none exists, or creating one)
    // For this test, let's create a dummy order first to treat as "Pending Payment"
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error('No user found');
        return;
    }

    const order = await prisma.order.create({
        data: {
            orderNumber: `TEST-PAY-${Date.now()}`,
            userId: user.id,
            status: 'PENDING',
            total: 50000,
            subtotal: 45000,
            deliveryFee: 5000,
            deliveryName: 'Test Payer',
            deliveryPhone: '9999999999',
            deliveryAddress: 'Virtual Address',
            deliveryCity: 'Cyber City',
            deliveryPincode: '500000',
            razorpayOrderId: `order_test_${Date.now()}` // Mock Razorpay ID
        }
    });

    console.log(`Created Mock Pending Order: ${order.orderNumber} (RZP ID: ${order.razorpayOrderId})`);

    // 2. Mock Razorpay Params
    const razorpay_order_id = order.razorpayOrderId!;
    const razorpay_payment_id = `pay_test_${Date.now()}`;

    // Generate valid signature
    const razorpay_signature = crypto
        .createHmac('sha256', KEY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

    // 3. Call Verify API
    const payload = {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    };

    console.log('🚀 Sending Verification Request...');
    const response = await fetch('http://localhost:3000/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Response:', data);

    // 4. Check DB
    const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } });
    if (updatedOrder?.paymentStatus === 'PAID' && updatedOrder.status === 'CONFIRMED') {
        console.log('✅ Payment Verification Successful! Order Confirmed.');
    } else {
        console.error('❌ Verification Failed. Status:', updatedOrder?.status, updatedOrder?.paymentStatus);
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
