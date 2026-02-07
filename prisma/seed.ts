import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data (Order matters due to foreign keys)
    await prisma.dailySaleItem.deleteMany();
    await prisma.dailySale.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Database cleared');

    // ==================== CREATE CATEGORIES ====================
    const marineFish = await prisma.category.create({
        data: {
            slug: 'marine-fish',
            name: 'Marine Fish',
            description: 'Fresh catch from the ocean',
            icon: '/images/categories/marine_v3.png',
        },
    });

    const riverFish = await prisma.category.create({
        data: {
            slug: 'river-fish',
            name: 'River Fish',
            description: 'Freshwater favorites',
            icon: '/images/categories/river_v3.png',
        },
    });

    const prawns = await prisma.category.create({
        data: {
            slug: 'prawns',
            name: 'Prawns & Shrimp',
            description: 'Succulent prawns and shrimp',
            icon: '/images/categories/prawns_v3.png',
        },
    });

    const crabs = await prisma.category.create({
        data: {
            slug: 'crabs',
            name: 'Crabs & Lobster',
            description: 'Fresh crabs and lobster',
            icon: '/images/categories/crabs_v3.png',
        },
    });

    const rtc = await prisma.category.create({
        data: {
            slug: 'ready-to-cook',
            name: 'Ready to Cook',
            description: 'Marinated and ready to cook',
            icon: '/images/categories/rtc_v3.png',
        },
    });

    // ==================== MARINE FISH PRODUCTS ====================
    await prisma.product.create({
        data: {
            // id: 'mf-1', // Let uuid generate
            slug: 'premium-seer-fish-vanjaram-steaks',
            name: 'Premium Seer Fish / Vanjaram - Steaks',
            image: '/images/categories/marine_v3.png',
            images: ['/images/categories/marine_v3.png'],
            grossWeight: '500g',
            netWeight: '450g',
            price: 72000,
            originalPrice: 90000,
            stock: 50,
            pieces: '6-8 Pieces',
            serves: 'Serves 2-3',
            sourcing: 'Coastal Andhra Catch',
            cutType: 'Steaks',
            texture: 'Firm & Flaky',
            deliveryTime: '120 min',
            categoryId: marineFish.id,
        },
    });

    await prisma.product.create({
        data: {
            slug: 'black-pomfret-whole-cleaned',
            name: 'Black Pomfret - Whole Cleaned',
            image: '/images/categories/marine_v3.png',
            images: [],
            grossWeight: '500g',
            netWeight: '400g',
            price: 60000,
            originalPrice: 65000,
            stock: 30,
            pieces: '2-3 Whole Fish',
            serves: 'Serves 2',
            sourcing: 'Deep Sea Catch',
            cutType: 'Whole Fish',
            texture: 'Soft & Buttery',
            deliveryTime: '120 min',
            categoryId: marineFish.id,
        },
    });

    await prisma.product.create({
        data: {
            slug: 'king-fish-surmai-curry-cut',
            name: 'King Fish / Surmai - Curry Cut',
            image: '/images/categories/marine_v3.png',
            images: [],
            grossWeight: '500g',
            netWeight: '450g',
            price: 55000,
            stock: 40,
            pieces: '8-10 Pieces',
            serves: 'Serves 3-4',
            cutType: 'Curry Cut',
            deliveryTime: '120 min',
            categoryId: marineFish.id,
        },
    });

    // ==================== USERS & AUTH ====================
    const adminPassword = await bcrypt.hash('BlueWhale#8821!', 10);
    const admin = await prisma.user.create({
        data: {
            username: 'admin',
            password: adminPassword,
            phone: '9876543210',
            email: 'admin@oceanfresh.com',
            name: 'Super Admin',
            role: 'ADMIN',
        },
    });

    const editorPassword = await bcrypt.hash('DolphinSale$7719', 10);
    const editor = await prisma.user.create({
        data: {
            username: 'editor',
            password: editorPassword,
            phone: '9876543211',
            email: 'editor@oceanfresh.com',
            name: 'Sales Manager',
            role: 'EDITOR',
        },
    });

    console.log('✅ Database seeded successfully!');
    console.log(`   - Admin: ${admin.username} / admin123`);
    console.log(`   - Editor: ${editor.username} / editor123`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
