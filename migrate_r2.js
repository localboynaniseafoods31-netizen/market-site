require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error('Missing R2 environment variables.');
    process.exit(1);
}

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
});

async function uploadFile(filePath, typePrefix) {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);
    
    // Attempt to parse mime type securely enough
    let mimeType = 'application/octet-stream';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.gif') mimeType = 'image/gif';

    const timestamp = Date.now();
    const key = `images/${typePrefix}/${timestamp}-${fileName}`;
    
    const fileContent = fs.readFileSync(filePath);

    try {
        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
            ContentType: mimeType,
        }));
        
        const url = `${publicUrl}/${key}`;
        
        // Try creating media record, assume MEDIA_TYPE "OTHER" is fine if generic enum is unknown
        const typeEnum = typePrefix === 'categories' ? 'CATEGORY_ICON' : 
                         typePrefix === 'products' ? 'PRODUCT_IMAGE' : 
                         typePrefix === 'banners' ? 'BANNER' : 'OTHER';
                         
        await prisma.media.create({
            data: {
                filename: fileName,
                key,
                url,
                type: typeEnum,
                size: fileContent.length,
                mimeType,
            }
        });
        
        return url;
    } catch (err) {
        console.error(`Failed to upload ${filePath}:`, err);
        return null; // Return null if fails
    }
}

async function migrateImages() {
    console.log('Starting migration...');

    // 1. PRODUCTS
    const products = await prisma.product.findMany();
    for (const product of products) {
        let updated = false;
        let newImage = product.image;
        let newImages = [...product.images];

        if (newImage && newImage.startsWith('/images/')) {
            const localPath = path.join(__dirname, 'public', newImage);
            console.log(`Processing main image for product: ${product.name}`);
            if (fs.existsSync(localPath)) {
                const url = await uploadFile(localPath, 'products');
                if (url) { newImage = url; updated = true; }
            } else {
                 console.log(`File not found recursively: ${localPath}`);
                 if(newImage === '/images/placeholder.png') {
                    // Ignore placeholders, we will handle that later
                 }
            }
        }
        
        for (let i = 0; i < newImages.length; i++) {
             if (newImages[i] && newImages[i].startsWith('/images/')) {
                const localPath = path.join(__dirname, 'public', newImages[i]);
                if (fs.existsSync(localPath)) {
                    const url = await uploadFile(localPath, 'products');
                    if (url) { newImages[i] = url; updated = true; }
                }
             }
        }

        if (updated) {
            await prisma.product.update({
                where: { id: product.id },
                data: { image: newImage, images: newImages }
            });
            console.log(`Updated Product: ${product.name}`);
        }
    }

    // 2. CATEGORIES
    const categories = await prisma.category.findMany();
    for (const category of categories) {
        if (category.icon && category.icon.startsWith('/images/')) {
            const localPath = path.join(__dirname, 'public', category.icon);
             console.log(`Processing icon for category: ${category.name}`);
            if (fs.existsSync(localPath)) {
                const url = await uploadFile(localPath, 'categories');
                if (url) {
                    await prisma.category.update({
                        where: { id: category.id },
                        data: { icon: url }
                    });
                    console.log(`Updated Category: ${category.name}`);
                }
            }
        }
    }

    // 3. CRAZY DEALS
    const deals = await prisma.crazyDeal.findMany();
    for (const deal of deals) {
        if (deal.imageUrl && deal.imageUrl.startsWith('/images/')) {
            const localPath = path.join(__dirname, 'public', deal.imageUrl);
             console.log(`Processing deal image: ${deal.title}`);
            if (fs.existsSync(localPath)) {
                const url = await uploadFile(localPath, 'banners');
                if (url) {
                    await prisma.crazyDeal.update({
                        where: { id: deal.id },
                        data: { imageUrl: url }
                    });
                     console.log(`Updated Deal: ${deal.title}`);
                }
            }
        }
    }

    // 4. SALE BANNERS
    const banners = await prisma.saleBanner.findMany();
    for (const banner of banners) {
        if (banner.imageUrl && banner.imageUrl.startsWith('/images/')) {
            const localPath = path.join(__dirname, 'public', banner.imageUrl);
             console.log(`Processing banner image`);
            if (fs.existsSync(localPath)) {
                const url = await uploadFile(localPath, 'banners');
                if (url) {
                    await prisma.saleBanner.update({
                        where: { id: banner.id },
                        data: { imageUrl: url }
                    });
                     console.log(`Updated Banner ${banner.id}`);
                }
            }
        }
    }

    console.log('Migration Complete!');
    process.exit(0);
}

migrateImages().catch(err => {
    console.error(err);
    process.exit(1);
});
