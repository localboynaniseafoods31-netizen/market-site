import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables BEFORE importing modules that use them
dotenv.config(); // Loads .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true }); // Overrides with .env.local

async function testIntegrations() {
    // Dynamic imports to ensure process.env is populated first
    const { generateInvoicePDF } = await import('../src/lib/invoice-pdf');
    const { uploadToR2 } = await import('../src/lib/r2');
    const { sendOrderConfirmation } = await import('../src/lib/email');
    const { sendOrderConfirmationWhatsApp } = await import('../src/lib/whatsapp');

    console.log('🚀 Starting Integration Tests (R2, SMTP, WhatsApp)...');
    console.log('-------------------------------------------');

    // 1. Check Env
    const requiredEnv = [
        'R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME',
        'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'ADMIN_EMAIL',
        'WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID'
    ];

    const missing = requiredEnv.filter(name => !process.env[name]);
    if (missing.length > 0) {
        console.error('❌ Missing environment variables:');
        missing.forEach(name => {
            const val = process.env[name];
            console.error(`  - ${name}: ${val === undefined ? 'UNDEFINED' : 'EMPTY'}`);
        });
        // We continue even if some are missing to test what we can
    }

    try {
        // 2. Test PDF Generation & R2 Upload
        console.log('\n📝 [1/3] Generating Test PDF & Uploading to R2...');
        const testData = {
            id: `test_${Date.now()}`,
            orderNumber: `TEST-${Date.now()}`,
            orderDate: new Date(),
            customerName: 'Test User',
            customerPhone: process.env.ADMIN_PHONE || '919876543210', // Send to admin for safety
            customerEmail: process.env.ADMIN_EMAIL,
            deliveryAddress: '123 Test Street, Seafood City',
            deliveryCity: 'Ocean Side',
            deliveryPincode: '560001',
            items: [
                { name: 'Fresh Tiger Prawns', quantity: 1, weight: '500g', price: 45000 },
                { name: 'Rohu Medium Cut', quantity: 2, weight: '1kg', price: 28000 }
            ],
            subtotal: 101000,
            deliveryFee: 5000,
            total: 106000,
            paymentStatus: 'PAID',
            paymentId: 'pay_test_123'
        };

        let r2Url = '';
        try {
            const pdfBuffer = await generateInvoicePDF(testData);
            const r2Key = `tests/test-invoice-${testData.orderNumber}.pdf`;
            const url = await uploadToR2(r2Key, pdfBuffer);
            if (url) {
                r2Url = url;
                console.log('✅ R2 Upload Successful! URL:', r2Url);
            } else {
                console.error('❌ R2 Upload Failed (No URL returned)');
            }
        } catch (e) {
            console.error('❌ R2/PDF Step Failed:', e);
        }

        // 3. Test SMTP (Email)
        console.log('\n📧 [2/3] Sending Test Email...');
        try {
            const emailProps = {
                orderNumber: testData.orderNumber,
                customerName: testData.customerName,
                customerEmail: testData.customerEmail,
                items: testData.items.map(i => ({
                    name: i.name,
                    quantity: i.quantity,
                    price: i.price / 100
                })),
                subtotal: testData.subtotal / 100,
                deliveryFee: testData.deliveryFee / 100,
                total: testData.total / 100,
                date: testData.orderDate,
                invoiceUrl: r2Url
            };

            if (process.env.ADMIN_EMAIL) {
                await sendOrderConfirmation(emailProps, process.env.ADMIN_EMAIL);
                // The helper logs success/fail
            } else {
                console.log('⚠️ No ADMIN_EMAIL defined, skipping email send.');
            }
        } catch (e) {
            console.error('❌ Email Step Failed:', e);
        }

        // 4. Test WhatsApp
        console.log('\n💬 [3/3] Sending Test WhatsApp...');
        try {
            // Mocking the Order object structure expected by the helper
            const whatsappOrder = {
                id: testData.id,
                orderNumber: testData.orderNumber,
                total: testData.total,
                user: {
                    phone: testData.customerPhone
                },
                deliveryPhone: testData.customerPhone
            };

            await sendOrderConfirmationWhatsApp(whatsappOrder, r2Url);
            // The helper logs success/fail
        } catch (e) {
            console.error('❌ WhatsApp Step Failed:', e);
        }

        console.log('\n-------------------------------------------');
        console.log('🏁 Integration Test Complete. Check logs above for ✅ or ❌.');

    } catch (error) {
        console.error('❌ Fatal Test Error:', error);
        process.exit(1);
    }
}

testIntegrations();
