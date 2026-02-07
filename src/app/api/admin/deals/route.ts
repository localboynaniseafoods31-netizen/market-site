import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: List all CrazyDeals
export async function GET() {
    try {
        const deals = await prisma.crazyDeal.findMany({
            orderBy: { position: 'asc' }
        });
        return NextResponse.json({ success: true, deals });
    } catch (error) {
        console.error('Failed to fetch crazy deals:', error);
        return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
    }
}

// POST: Create new CrazyDeal
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, subtitle, description, bgColor, imageUrl, promoCode, linkUrl, isActive, position } = body;

        if (!title || !subtitle || !imageUrl) {
            return NextResponse.json({ error: 'Title, subtitle, and image are required' }, { status: 400 });
        }

        const deal = await prisma.crazyDeal.create({
            data: {
                title,
                subtitle,
                description: description || null,
                bgColor: bgColor || 'from-sky-500 to-blue-600',
                imageUrl,
                promoCode: promoCode || null,
                linkUrl: linkUrl || '/category/deals',
                isActive: isActive ?? true,
                position: position ?? 0
            }
        });

        return NextResponse.json({ success: true, deal });
    } catch (error) {
        console.error('Failed to create crazy deal:', error);
        return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 });
    }
}

// PUT: Update CrazyDeal
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const deal = await prisma.crazyDeal.update({
            where: { id },
            data
        });

        return NextResponse.json({ success: true, deal });
    } catch (error) {
        console.error('Failed to update crazy deal:', error);
        return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
    }
}

// DELETE: Delete CrazyDeal
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.crazyDeal.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete crazy deal:', error);
        return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 });
    }
}
