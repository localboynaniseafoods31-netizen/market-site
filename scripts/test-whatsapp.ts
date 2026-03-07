/**
 * Test WhatsApp via Authkey.io
 * Run: npx tsx scripts/test-whatsapp.ts [type] [phone]
 * Types: placed, delivered, cancelled, shipped, all
 * Phone: Optional, defaults to env or hardcoded
 */

import dotenv from 'dotenv';
import path from 'path';

// Load env before imports
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import {
    sendOrderConfirmationWhatsApp,
    sendOrderDeliveredWhatsApp,
    sendOrderCancelledWhatsApp,
    sendOrderShippedWhatsApp
} from '../src/lib/whatsapp';

async function testWhatsApp() {
    const args = process.argv.slice(2);
    const type = args[0] || 'placed';
    const phone = args[1] || '7008748856'; // Default test phone

    console.log(`🧪 Testing WhatsApp Template: ${type.toUpperCase()}`);
    console.log(`📱 Phone: ${phone}`);

    const dummyOrder = {
        orderNumber: 'TEST-ORD-001',
        total: 59900, // ₹599.00
        user: { name: 'Test User', phone: phone },
        items: [
            { quantity: 1, product: { name: 'Premium Surmai' } },
            { quantity: 2, product: { name: 'Prawns Large' } }
        ]
    };

    try {
        let res;
        switch (type.toLowerCase()) {
            case 'placed':
                console.log('Sending Order Confirmation...');
                res = await sendOrderConfirmationWhatsApp(dummyOrder);
                break;
            case 'delivered':
                console.log('Sending Order Delivered...');
                res = await sendOrderDeliveredWhatsApp(phone, 'Test User', dummyOrder.items);
                break;
            case 'cancelled':
                console.log('Sending Order Cancelled...');
                res = await sendOrderCancelledWhatsApp(phone, 'Test User', dummyOrder.items);
                break;
            case 'shipped':
                console.log('Sending Order Shipped...');
                res = await sendOrderShippedWhatsApp(phone, 'Test User', dummyOrder.items);
                break;
            case 'all':
                console.log('Sending ALL templates sequentially...');
                await sendOrderConfirmationWhatsApp(dummyOrder);
                await new Promise(r => setTimeout(r, 2000));
                await sendOrderDeliveredWhatsApp(phone, 'Test User', dummyOrder.items);
                await new Promise(r => setTimeout(r, 2000));
                await sendOrderCancelledWhatsApp(phone, 'Test User', dummyOrder.items);
                await new Promise(r => setTimeout(r, 2000));
                await sendOrderShippedWhatsApp(phone, 'Test User', dummyOrder.items);
                console.log('✅ Sent all templates');
                return;
            default:
                console.error('❌ Unknown type. Use: placed, delivered, cancelled, shipped, all');
                return;
        }

        if (res && res.success) {
            console.log('✅ Success:', res.data);
        } else {
            console.log('❌ Failed or No Response:', res);
        }

    } catch (error) {
        console.error('❌ Error executing test:', error);
    }
}

testWhatsApp();
