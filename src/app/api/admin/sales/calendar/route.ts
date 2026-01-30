import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { successResponse, handleApiError } from '@/lib/api-response';
import { z } from 'zod';

// GET /api/admin/sales/calendar - Orders grouped by date
export async function GET(request: NextRequest) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const { searchParams } = new URL(request.url);
        const monthParam = searchParams.get('month'); // YYYY-MM format
        const yearParam = searchParams.get('year');

        let startDate: Date;
        let endDate: Date;

        if (monthParam) {
            const [year, month] = monthParam.split('-').map(Number);
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0, 23, 59, 59);
        } else if (yearParam) {
            startDate = new Date(Number(yearParam), 0, 1);
            endDate = new Date(Number(yearParam), 11, 31, 23, 59, 59);
        } else {
            // Default to current month
            const now = new Date();
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        }

        // Get orders grouped by date
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                id: true,
                orderNumber: true,
                status: true,
                total: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        // Group by date
        const grouped: Record<string, {
            date: string;
            orders: typeof orders;
            totalSales: number;
            orderCount: number;
        }> = {};

        for (const order of orders) {
            const dateKey = order.createdAt.toISOString().slice(0, 10);

            if (!grouped[dateKey]) {
                grouped[dateKey] = {
                    date: dateKey,
                    orders: [],
                    totalSales: 0,
                    orderCount: 0,
                };
            }

            grouped[dateKey].orders.push(order);
            grouped[dateKey].totalSales += order.total / 100;
            grouped[dateKey].orderCount += 1;
        }

        // Convert to array and sort
        const calendarData = Object.values(grouped).map((day) => ({
            ...day,
            orders: day.orders.map((o) => ({
                ...o,
                total: o.total / 100,
            })),
        }));

        return successResponse({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            days: calendarData,
            summary: {
                totalOrders: orders.length,
                totalSales: orders.reduce((a, b) => a + b.total, 0) / 100,
                daysWithOrders: Object.keys(grouped).length,
            },
        });
    } catch (error) {
        return handleApiError(error);
    }
}
