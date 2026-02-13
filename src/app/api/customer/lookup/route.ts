import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

const phoneRegex = /^[6-9]\d{9}$/;

export async function GET(req: NextRequest) {
    const rateLimit = checkRateLimit(req, {
        key: 'customer:lookup',
        limit: 10,
        windowMs: 60_000
    });
    if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit);

    const { searchParams } = new URL(req.url);
    const phone = (searchParams.get('phone') || '').replace(/\D/g, '').slice(0, 10);

    if (!phoneRegex.test(phone)) {
        return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    try {
        const session = await auth();
        const role = (session?.user as { role?: string } | undefined)?.role;
        const isAdmin = role === 'ADMIN';
        const isOwnPhone = !!session?.user?.phone && session.user.phone === phone;
        if (!isAdmin && !isOwnPhone) {
            return NextResponse.json({ found: false });
        }

        const user = await prisma.user.findUnique({
            where: { phone },
            include: {
                orders: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ found: false });
        }

        const lastOrder = user.orders[0];

        if (!lastOrder) {
            return NextResponse.json({
                found: true,
                name: user.name,
                address: null
            });
        }

        return NextResponse.json({
            found: true,
            name: user.name,
            address: {
                fullAddress: lastOrder.deliveryAddress,
                city: lastOrder.deliveryCity,
                pincode: lastOrder.deliveryPincode,
                // landmark is not consistently stored in DB schema yet, assumed part of address or missing
            },
        });

    } catch (error) {
        console.error('Customer lookup failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
