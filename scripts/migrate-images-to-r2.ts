/**
 * Migration Script: Upload Local Images to R2
 * 
 * This script uploads all existing images from /public/images/ to Cloudflare R2
 * with a proper folder structure, then outputs the URLs for database updates.
 * 
 * R2 Structure:
 * - images/categories/{filename}
 * - images/products/{filename}
 * - images/banners/{filename}
 * 
 * Run: npx tsx scripts/migrate-images-to-r2.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// R2 Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

interface UploadResult {
    localPath: string;
    r2Key: string;
    url: string;
    size: number;
}

async function uploadFile(localPath: string, r2Key: string): Promise<UploadResult> {
    const fileBuffer = fs.readFileSync(localPath);
    const stats = fs.statSync(localPath);

    // Determine content type
    const ext = path.extname(localPath).toLowerCase();
    const contentTypes: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
    };
    const contentType = contentTypes[ext] || 'application/octet-stream';

    await s3Client.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: r2Key,
        Body: fileBuffer,
        ContentType: contentType,
    }));

    const url = `${R2_PUBLIC_URL}/${r2Key}`;

    return {
        localPath,
        r2Key,
        url,
        size: stats.size,
    };
}

async function uploadDirectory(localDir: string, r2Prefix: string): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    if (!fs.existsSync(localDir)) {
        console.log(`⚠️ Directory not found: ${localDir}`);
        return results;
    }

    const files = fs.readdirSync(localDir);

    for (const file of files) {
        const localPath = path.join(localDir, file);
        const stats = fs.statSync(localPath);

        if (stats.isFile()) {
            const r2Key = `${r2Prefix}/${file}`;
            console.log(`📤 Uploading: ${file}...`);

            try {
                const result = await uploadFile(localPath, r2Key);
                results.push(result);
                console.log(`   ✅ ${(result.size / 1024).toFixed(1)}KB -> ${result.url}`);
            } catch (error) {
                console.error(`   ❌ Failed: ${error}`);
            }
        }
    }

    return results;
}

async function main() {
    console.log('🚀 Starting Image Migration to R2\n');
    console.log('━'.repeat(60));

    // Check credentials
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
        console.error('❌ Missing R2 credentials in .env.local');
        process.exit(1);
    }

    const baseDir = path.join(process.cwd(), 'public', 'images');
    const allResults: Record<string, UploadResult[]> = {};

    // 1. Upload Category Images
    console.log('\n📁 CATEGORIES\n');
    allResults.categories = await uploadDirectory(
        path.join(baseDir, 'categories'),
        'images/categories'
    );

    // 2. Upload Product Images
    console.log('\n📁 PRODUCTS\n');
    allResults.products = await uploadDirectory(
        path.join(baseDir, 'products'),
        'images/products'
    );

    // 3. Upload Banner/Hero Images (root level)
    console.log('\n📁 BANNERS\n');
    const bannerFiles = fs.readdirSync(baseDir).filter(f => {
        const fullPath = path.join(baseDir, f);
        return fs.statSync(fullPath).isFile();
    });

    allResults.banners = [];
    for (const file of bannerFiles) {
        const localPath = path.join(baseDir, file);
        const r2Key = `images/banners/${file}`;
        console.log(`📤 Uploading: ${file}...`);

        try {
            const result = await uploadFile(localPath, r2Key);
            allResults.banners.push(result);
            console.log(`   ✅ ${(result.size / 1024).toFixed(1)}KB -> ${result.url}`);
        } catch (error) {
            console.error(`   ❌ Failed: ${error}`);
        }
    }

    // Summary
    console.log('\n' + '━'.repeat(60));
    console.log('📊 MIGRATION SUMMARY\n');

    const totalFiles = Object.values(allResults).flat().length;
    const totalSize = Object.values(allResults).flat().reduce((sum, r) => sum + r.size, 0);

    console.log(`✅ Total files uploaded: ${totalFiles}`);
    console.log(`📦 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

    // Output URL mapping for database updates
    console.log('\n' + '━'.repeat(60));
    console.log('🔗 URL MAPPING (for database updates)\n');

    console.log('// Categories:');
    for (const r of allResults.categories) {
        const filename = path.basename(r.localPath, path.extname(r.localPath));
        console.log(`// ${filename}: "${r.url}"`);
    }

    console.log('\n// Products:');
    for (const r of allResults.products) {
        const filename = path.basename(r.localPath, path.extname(r.localPath));
        console.log(`// ${filename}: "${r.url}"`);
    }

    console.log('\n// Banners:');
    for (const r of allResults.banners) {
        const filename = path.basename(r.localPath, path.extname(r.localPath));
        console.log(`// ${filename}: "${r.url}"`);
    }

    // Save mapping to JSON file
    const mappingFile = path.join(process.cwd(), 'scripts', 'image-url-mapping.json');
    const mapping = {
        categories: Object.fromEntries(
            allResults.categories.map(r => [path.basename(r.localPath), r.url])
        ),
        products: Object.fromEntries(
            allResults.products.map(r => [path.basename(r.localPath), r.url])
        ),
        banners: Object.fromEntries(
            allResults.banners.map(r => [path.basename(r.localPath), r.url])
        ),
    };
    fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));
    console.log(`\n💾 URL mapping saved to: scripts/image-url-mapping.json`);

    console.log('\n✅ Migration Complete!\n');
}

main().catch(console.error);
