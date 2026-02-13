import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch active CrazyDeals for homepage (public API)
export async function GET() {
    try {
        const now = new Date();
        const [deals, saleBanners] = await Promise.all([
            prisma.crazyDeal.findMany({
                where: { isActive: true },
                orderBy: { position: 'asc' }
            }),
            prisma.saleBanner.findMany({
                where: {
                    isActive: true,
                    OR: [
                        { startDate: null },
                        { startDate: { lte: now } }
                    ],
                    AND: [
                        {
                            OR: [
                                { endDate: null },
                                { endDate: { gte: now } }
                            ]
                        }
                    ]
                },
                orderBy: { position: 'asc' }
            })
        ]);

        const saleBannerItems = saleBanners.map((b) => ({
            id: b.id,
            title: b.title,
            subtitle: b.title,
            description: null,
            bgColor: 'from-slate-700 to-slate-900',
            image: b.imageUrl,
            code: null,
            link: b.linkUrl || '/category/deals'
        }));
        const dealItems = deals.map((d) => ({
            id: d.id,
            title: d.title,
            subtitle: d.subtitle,
            description: d.description,
            bgColor: d.bgColor,
            image: d.imageUrl,
            code: d.promoCode,
            link: d.linkUrl
        }));

        return NextResponse.json({
            success: true,
            banners: [...saleBannerItems, ...dealItems]
        });
    } catch (error) {
        console.error('Failed to fetch crazy deals:', error);
        return NextResponse.json({ success: false, banners: [] });
    }
}
