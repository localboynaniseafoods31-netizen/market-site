import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkProductionDb() {
    console.log('🔍 Checking Production Database...');

    try {
        const userCount = await prisma.user.count();
        console.log(`📊 Total Users: ${userCount}`);

        const admin = await prisma.user.findUnique({
            where: { username: 'admin' },
            select: { id: true, username: true, role: true, password: true }
        });

        if (admin) {
            console.log('✅ Admin user found');
            const testPass = 'BlueWhale#8821!';
            const match = await bcrypt.compare(testPass, admin.password || '');
            console.log(`🔑 Password "BlueWhale#8821!" match: ${match}`);

            if (!match) {
                console.log('⚠️ Password mismatch! Resetting admin password to ensure sync...');
                const newHash = await bcrypt.hash(testPass, 10);
                await prisma.user.update({
                    where: { username: 'admin' },
                    data: { password: newHash }
                });
                console.log('✅ Admin password reset successfully');
            }
        } else {
            console.log('❌ Admin user NOT FOUND! Re-running seed logic for admin...');
            const adminPassword = await bcrypt.hash('BlueWhale#8821!', 10);
            await prisma.user.create({
                data: {
                    username: 'admin',
                    password: adminPassword,
                    phone: '9876543210',
                    email: 'admin@localboynaniseafoods.com',
                    name: 'Super Admin',
                    role: 'ADMIN',
                },
            });
            console.log('✅ Admin user created');
        }

    } catch (err) {
        console.error('❌ Error checking database:', err);
    } finally {
        await prisma.$disconnect();
    }
}

checkProductionDb();
