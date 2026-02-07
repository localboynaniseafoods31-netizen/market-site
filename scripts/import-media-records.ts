/**
 * Import Migrated Images to Media Table
 * 
 * After running migrate-images-to-r2.ts, run this to populate the Media table
 * so images appear in the admin Media Library.
 * 
 * Run: npx tsx scripts/import-media-records.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PrismaClient, MediaType } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('📥 Importing media records to database...\n');

    // Read URL mapping file
    const mappingPath = path.join(process.cwd(), 'scripts', 'image-url-mapping.json');
    if (!fs.existsSync(mappingPath)) {
        console.error('❌ image-url-mapping.json not found. Run migrate-images-to-r2.ts first.');
        return;
    }

    const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
    let imported = 0;

    // Import categories
    console.log('📁 Categories:');
    for (const [filename, url] of Object.entries(mapping.categories as Record<string, string>)) {
        const key = `images/categories/${filename}`;
        const exists = await prisma.media.findUnique({ where: { key } });
        if (!exists) {
            await prisma.media.create({
                data: {
                    filename,
                    key,
                    url: url as string,
                    type: MediaType.CATEGORY_ICON,
                    size: 0, // We don't have size info from the mapping
                    mimeType: filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
                },
            });
            console.log(`   ✅ ${filename}`);
            imported++;
        } else {
            console.log(`   ⏭️  ${filename} (exists)`);
        }
    }

    // Import products
    console.log('\n📁 Products:');
    for (const [filename, url] of Object.entries(mapping.products as Record<string, string>)) {
        const key = `images/products/${filename}`;
        const exists = await prisma.media.findUnique({ where: { key } });
        if (!exists) {
            await prisma.media.create({
                data: {
                    filename,
                    key,
                    url: url as string,
                    type: MediaType.PRODUCT_IMAGE,
                    size: 0,
                    mimeType: filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
                },
            });
            console.log(`   ✅ ${filename}`);
            imported++;
        } else {
            console.log(`   ⏭️  ${filename} (exists)`);
        }
    }

    // Import banners
    console.log('\n📁 Banners:');
    for (const [filename, url] of Object.entries(mapping.banners as Record<string, string>)) {
        const key = `images/banners/${filename}`;
        const exists = await prisma.media.findUnique({ where: { key } });
        if (!exists) {
            await prisma.media.create({
                data: {
                    filename,
                    key,
                    url: url as string,
                    type: MediaType.BANNER,
                    size: 0,
                    mimeType: filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
                },
            });
            console.log(`   ✅ ${filename}`);
            imported++;
        } else {
            console.log(`   ⏭️  ${filename} (exists)`);
        }
    }

    console.log(`\n✅ Imported ${imported} new media records.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
