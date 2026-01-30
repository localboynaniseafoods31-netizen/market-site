import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { successResponse, handleApiError } from '@/lib/api-response';

// GET /api/admin/dashboard - Dashboard summary data
export async function GET(request: NextRequest) {
    try {
        const adminCheck = await requireAdmin();
        if (!adminCheck.authorized) return adminCheck.response!;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(thisWeekStart.getDate() - 7);

        const thisMonthStart = new Date(today);
        thisMonthStart.setDate(1);

        // Parallel queries for efficiency
        const [
            todayOrders,
            weekOrders,
            monthOrders,
            totalProducts,
            lowStockProducts,
            pendingOrders,
            recentOrders,
            dailySales,
        ] = await Promise.all([
            // Today's sales
            prisma.order.aggregate({
                where: {
                    createdAt: { gte: today },
                    status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
                },
                _sum: { total: true },
                _count: true,
            }),
            // Week's sales
            prisma.order.aggregate({
                where: {
                    createdAt: { gte: thisWeekStart },
                    status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
                },
                _sum: { total: true },
                _count: true,
            }),
            // Month's sales
            prisma.order.aggregate({
                where: {
                    createdAt: { gte: thisMonthStart },
                    status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
                },
                _sum: { total: true },
                _count: true,
            }),
            // Total products
            prisma.product.count(),
            // Low stock products (< 10 units)
            prisma.product.count({
                where: { stock: { lt: 10 } },
            }),
            // Pending orders
            prisma.order.count({
                where: { status: 'PENDING' },
            }),
            // Recent orders (last 10)
            prisma.order.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { phone: true, name: true } },
                    items: { select: { quantity: true } },
                },
            }),
            // Daily sales for last 7 days (for chart)
            prisma.$queryRaw<{ date: Date; total: bigint; count: bigint }[]>`
        SELECT 
          DATE("createdAt") as date,
          SUM(total) as total,
          COUNT(*) as count
        FROM "Order"
        WHERE "createdAt" >= ${thisWeekStart}
        AND status IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED')
        GROUP BY DATE("createdAt")
        ORDER BY date DESC
      `,
        ]);

        return successResponse({
            summary: {
                todaySales: (todayOrders._sum.total || 0) / 100,
                todayOrders: todayOrders._count,
                weekSales: (weekOrders._sum.total || 0) / 100,
                weekOrders: weekOrders._count,
                monthSales: (monthOrders._sum.total || 0) / 100,
                monthOrders: monthOrders._count,
                totalProducts,
                lowStockProducts,
                pendingOrders,
            },
            recentOrders: recentOrders.map((o) => ({
                id: o.id,
                orderNumber: o.orderNumber,
                status: o.status,
                total: o.total / 100,
                customer: o.user.name || o.user.phone,
                itemCount: o.items.reduce((a, b) => a + b.quantity, 0),
                createdAt: o.createdAt,
            })),
            dailySales: dailySales.map((d) => ({
                date: d.date,
                total: Number(d.total) / 100,
                count: Number(d.count),
            })),
        });
    } catch (error) {
        return handleApiError(error);
    }
}
