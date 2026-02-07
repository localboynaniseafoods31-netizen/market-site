import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET: List all banners
export async function GET() {
    const banners = await prisma.saleBanner.findMany({
        orderBy: { position: 'asc' },
    });

    return NextResponse.json({ banners });
}

// POST: Create new banner
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, imageUrl, linkUrl, isActive, position, startDate, endDate } = body;

    if (!title || !imageUrl) {
        return NextResponse.json({ error: 'Title and imageUrl required' }, { status: 400 });
    }

    const banner = await prisma.saleBanner.create({
        data: {
            title,
            imageUrl,
            linkUrl,
            isActive: isActive ?? true,
            position: position ?? 0,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
        },
    });

    return NextResponse.json({ success: true, banner });
}

// PUT: Update banner
export async function PUT(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // Convert dates if provided
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    const banner = await prisma.saleBanner.update({
        where: { id },
        data,
    });

    return NextResponse.json({ success: true, banner });
}

// DELETE: Remove banner
export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await prisma.saleBanner.delete({ where: { id } });

    return NextResponse.json({ success: true });
}
