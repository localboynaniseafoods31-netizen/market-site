import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
        return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    try {
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
