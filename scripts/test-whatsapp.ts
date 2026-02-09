/**
 * Test WhatsApp via Authkey.io
 * Run: npx tsx scripts/test-whatsapp.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const AUTHKEY_API_URL = 'https://console.authkey.io/restapi/requestjson.php';

async function testWhatsApp() {
    const token = process.env.AUTHKEY_TOKEN;
    const templateId = process.env.AUTHKEY_TEMPLATE_ID || '25677';
    const countryCode = process.env.AUTHKEY_COUNTRY_CODE || '91';

    // TEST PHONE - Replace with your number
    const testPhone = '7008748856';

    console.log('📲 WhatsApp Test Configuration:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Token: ${token ? token.slice(0, 4) + '...' : '❌ MISSING'}`);
    console.log(`Template ID: ${templateId}`);
    console.log(`Country Code: ${countryCode}`);
    console.log(`Test Phone: ${testPhone}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Template variable mapping:
    // {{1}} = Customer Name
    // {{2}} = Order Number  
    // {{3}} = Amount (₹X)
    // {{4}} = Invoice filename (for CTA button URL)

    const bodyValues = {
        '1': 'Test Customer',           // {{1}} Customer Name
        '2': 'TEST-ORDER-001',          // {{2}} Order Number
        '3': '₹599',                    // {{3}} Amount
        '4': 'TEST-ORDER-001.pdf'       // {{4}} Invoice filename
    };

    console.log('📋 Body Values being sent:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  {{1}} (Customer Name) = "${bodyValues['1']}"`);
    console.log(`  {{2}} (Order Number)  = "${bodyValues['2']}"`);
    console.log(`  {{3}} (Amount)        = "${bodyValues['3']}"`);
    console.log(`  {{4}} (Invoice PDF)   = "${bodyValues['4']}"`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const payload = {
        country_code: countryCode,
        mobile: testPhone,
        wid: templateId,
        type: 'text',
        bodyValues
    };

    console.log('📤 Sending to Authkey API...\n');
    console.log('Full Payload:', JSON.stringify(payload, null, 2));
    console.log('\n');

    if (!token) {
        console.error('❌ AUTHKEY_TOKEN not set in .env.local');
        return;
    }

    try {
        const res = await fetch(AUTHKEY_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok && data.Message === 'Submitted Successfully') {
            console.log('✅ SUCCESS! WhatsApp message submitted');
            console.log('Response:', JSON.stringify(data, null, 2));
        } else {
            console.log('⚠️ API Response (check for errors):');
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testWhatsApp();
