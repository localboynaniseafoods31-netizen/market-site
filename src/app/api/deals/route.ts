import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch active CrazyDeals for homepage (public API)
export async function GET() {
    try {
        const deals = await prisma.crazyDeal.findMany({
            where: { isActive: true },
            orderBy: { position: 'asc' }
        });

        return NextResponse.json({
            success: true,
            banners: deals.map(d => ({
                id: d.id,
                title: d.title,
                subtitle: d.subtitle,
                description: d.description,
                bgColor: d.bgColor,
                image: d.imageUrl,
                code: d.promoCode,
                link: d.linkUrl
            }))
        });
    } catch (error) {
        console.error('Failed to fetch crazy deals:', error);
        return NextResponse.json({ success: false, banners: [] });
    }
}
