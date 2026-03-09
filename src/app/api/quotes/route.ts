import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendAdminQuoteAlert } from '@/lib/email';
import { z } from 'zod';

const quoteSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Valid phone number required"),
    eventType: z.string().optional().nullable(),
    requirements: z.string().optional().nullable(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = quoteSchema.parse(body);

        // Save to Database
        const quote = await prisma.bulkQuote.create({
            data: {
                name: data.name,
                phone: data.phone,
                eventType: data.eventType || null,
                requirements: data.requirements || null,
            }
        });

        // Send Email Alert to Admin
        await sendAdminQuoteAlert({
            name: quote.name,
            phone: quote.phone,
            eventType: quote.eventType,
            requirements: quote.requirements,
            date: quote.createdAt,
        });

        return NextResponse.json({ success: true, quote });
    } catch (error: any) {
        console.error("[QUOTE_CREATE]", error);
        
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid input metrics", { status: 400 });
        }

        return new NextResponse("Internal server error", { status: 500 });
    }
}
