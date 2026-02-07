
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { uploadToR2 } from '../src/lib/r2';

async function testR2() {
    console.log('🔍 Testing R2 Configuration...');

    const accountId = process.env.R2_ACCOUNT_ID;
    const bucket = process.env.R2_BUCKET_NAME;

    console.log('Account ID:', accountId ? '✅ Set' : '❌ Missing');
    console.log('Bucket:', bucket ? '✅ Set' : '❌ Missing');
    console.log('Access Key:', process.env.R2_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing');
    console.log('Secret Key:', process.env.R2_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing');

    if (!accountId || !bucket) {
        console.error('❌ Missing credentials. Cannot proceed.');
        return;
    }

    try {
        console.log('📤 Attempting to upload test file...');
        const testContent = Buffer.from('This is a test file to verify R2 connectivity.');
        const url = await uploadToR2('test-connectivity.txt', testContent, 'text/plain');

        if (url) {
            console.log('✅ Upload Successful!');
            console.log('🔗 URL:', url);
        } else {
            console.log('❌ Upload returned null (Check R2 setup)');
        }
    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

testR2();
