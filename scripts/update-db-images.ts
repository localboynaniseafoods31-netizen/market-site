/**
 * Update Category and Product records with R2 image URLs
 * Maps local paths like "/images/categories/marine_v3.png" to R2 URLs
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Mapping from filename patterns to category slugs
const categoryIconMapping: Record<string, string> = {
    'marine': 'marine-fish',
    'river': 'river-fish',
    'prawns': 'prawns',
    'crabs': 'crabs',
    'rtc': 'ready-to-cook',
    'combos': 'combos'
};

const R2_BASE = 'https://pub-933f2ca73d7840ab9a8608288c2e1996.r2.dev';

async function main() {
    console.log('🔄 Updating database records with R2 URLs...\n');

    // Load URL mapping
    const mappingPath = path.join(__dirname, 'image-url-mapping.json');
    const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

    // Update categories
    console.log('📁 Updating Categories:');
    const categories = await prisma.category.findMany();

    for (const category of categories) {
        let newIcon: string | null = null;

        // Find matching icon from mapping
        for (const [filename, url] of Object.entries(mapping.categories)) {
            const baseName = filename.replace('.png', '').replace('_v3', '');
            for (const [pattern, slug] of Object.entries(categoryIconMapping)) {
                if (baseName === pattern && category.slug === slug) {
                    // Use v3 version if available
                    const v3Filename = `${pattern}_v3.png`;
                    newIcon = mapping.categories[v3Filename] || (url as string);
                    break;
                }
            }
            if (newIcon) break;
        }

        if (newIcon && category.icon !== newIcon) {
            await prisma.category.update({
                where: { id: category.id },
                data: { icon: newIcon }
            });
            console.log(`   ✅ ${category.name}: ${newIcon}`);
        } else if (!newIcon) {
            console.log(`   ⚠️ ${category.name}: No matching icon found`);
        } else {
            console.log(`   ℹ️ ${category.name}: Already using R2 URL`);
        }
    }

    // Update products - replace any local paths with R2 paths
    console.log('\n📁 Updating Products:');
    const products = await prisma.product.findMany();

    for (const product of products) {
        let needsUpdate = false;
        let newImage = product.image;
        let newImages = product.images ? [...product.images] : [];

        // Check if image uses local path
        if (product.image.startsWith('/images/')) {
            const filename = path.basename(product.image);

            // Check categories first
            if (mapping.categories[filename]) {
                newImage = mapping.categories[filename];
                needsUpdate = true;
            } else if (mapping.products[filename]) {
                newImage = mapping.products[filename];
                needsUpdate = true;
            }
        }

        // Check images array
        newImages = product.images?.map((img: string) => {
            if (img.startsWith('/images/')) {
                const filename = path.basename(img);
                if (mapping.categories[filename]) {
                    needsUpdate = true;
                    return mapping.categories[filename];
                } else if (mapping.products[filename]) {
                    needsUpdate = true;
                    return mapping.products[filename];
                }
            }
            return img;
        }) || [];

        if (needsUpdate) {
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    image: newImage,
                    images: newImages
                }
            });
            console.log(`   ✅ ${product.name}: Updated to R2 URL`);
        } else if (product.image.startsWith('http')) {
            console.log(`   ℹ️ ${product.name}: Already using R2 URL`);
        } else {
            console.log(`   ⚠️ ${product.name}: No matching image found for ${product.image}`);
        }
    }

    console.log('\n✅ Database update complete!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
