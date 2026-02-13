import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

// Reusing transporter from email.ts logic but keeping it self-contained here or importing
// Ideally, export transporter from lib/email.ts, but for now re-creating to ensure no circular deps or issues
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || 'test',
        pass: process.env.SMTP_PASS || 'test'
    },
});

export async function GET(req: NextRequest) {
    // 1. Auth Check (Basic Cron Security)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
        return new NextResponse('Cron secret not configured', { status: 500 });
    }
    if (authHeader !== `Bearer ${cronSecret}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        console.log('🔄 Starting Daily Stock Reset...');

        // 2. Reset Stock
        // Update all products where stock < defaultStock (Restock)
        // OR just reset everything to defaultStock?
        // Requirement: "we will go with a default amount stock we will restock unless it adjust by admin"
        // This implies resetting to defaultStock.

        // We can do this in a transaction or a batch update
        // Prisma doesn't support "updateMany" with "set to another column value" easily without raw SQL
        // So we might need to fetch and iterate, or use raw SQL.
        // For distinctness and logging, let's fetch & update.

        const products = await prisma.product.findMany();
        const updates = [];

        for (const product of products) {
            // Only update if current stock is different (optional optimization)
            if (product.stock !== product.defaultStock) {
                const update = prisma.product.update({
                    where: { id: product.id },
                    data: {
                        stock: product.defaultStock,
                        inStock: product.defaultStock > 0
                    }
                });
                updates.push(update);
            }
        }

        if (updates.length > 0) {
            await prisma.$transaction(updates);
        }

        // 3. Notify Admin
        const summary = products.map(p => ({
            name: p.name,
            stock: p.defaultStock
        }));

        const html = `
            <h2>Daily Stock Reset Complete</h2>
            <p>The store is live for the day! Here is the starting stock:</p>
            <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                    <tr><th>Product</th><th>Stock</th></tr>
                </thead>
                <tbody>
                    ${summary.map(p => `<tr><td>${p.name}</td><td>${p.stock}</td></tr>`).join('')}
                </tbody>
            </table>
            <br/>
            <p><strong>Total Products:</strong> ${products.length}</p>
            <p><strong>Restocked Items:</strong> ${updates.length}</p>
        `;

        if (!process.env.SMTP_HOST) {
            console.log('📧 MOCK CRON EMAIL:', html);
        } else {
            await transporter.sendMail({
                from: '"Ocean Fresh System" <system@oceanfresh.com>',
                to: process.env.ADMIN_EMAIL || 'admin@oceanfresh.com',
                subject: `Daily Stock Reset - ${new Date().toLocaleDateString()}`,
                html
            });
        }

        return NextResponse.json({
            success: true,
            message: `Reset ${updates.length} products to default stock`,
            totalProducts: products.length
        });

    } catch (error) {
        console.error('Cron Failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
