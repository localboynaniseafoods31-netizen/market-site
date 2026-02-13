'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Package, ShoppingBag, TrendingUp, AlertTriangle, Clock, IndianRupee } from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
    summary: {
        todaySales: number;
        todayOrders: number;
        weekSales: number;
        weekOrders: number;
        monthSales: number;
        monthOrders: number;
        totalProducts: number;
        lowStockProducts: number;
        pendingOrders: number;
    };
    recentOrders: Array<{
        id: string;
        orderNumber: string;
        status: string;
        total: number;
        customer: string;
        itemCount: number;
        createdAt: string;
    }>;
    dailySales: Array<{
        date: string;
        total: number;
        count: number;
    }>;
}

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/dashboard')
            .then((res) => res.json())
            .then((res) => {
                if (res.success) setData(res.data);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!data) {
        return <div className="text-center text-muted-foreground">Failed to load dashboard</div>;
    }

    const formatInr = (value: number) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);

    const stats = [
        {
            label: "Today's Sales",
            value: formatInr(data.summary.todaySales),
            sub: `${data.summary.todayOrders} orders`,
            icon: IndianRupee,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
        },
        {
            label: "This Week",
            value: formatInr(data.summary.weekSales),
            sub: `${data.summary.weekOrders} orders`,
            icon: TrendingUp,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            label: 'Pending Orders',
            value: data.summary.pendingOrders.toString(),
            sub: 'Needs attention',
            icon: Clock,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
        },
        {
            label: 'Low Stock',
            value: data.summary.lowStockProducts.toString(),
            sub: 'Products < 10 units',
            icon: AlertTriangle,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your store performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.sub}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Orders */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm text-primary hover:underline">
                        View All
                    </Link>
                </div>
                <div className="space-y-4">
                    {data.recentOrders.map((order) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                        >
                            <div>
                                <p className="font-semibold">{order.orderNumber}</p>
                                <p className="text-sm text-muted-foreground">
                                    {order.customer} • {order.itemCount} items
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">{formatInr(order.total)}</p>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${order.status === 'DELIVERED'
                                        ? 'bg-green-100 text-green-700'
                                        : order.status === 'PENDING'
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'bg-blue-100 text-blue-700'
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/admin/products">
                    <Card className="p-4 hover:border-primary transition-colors cursor-pointer">
                        <Package className="text-primary mb-2" size={24} />
                        <p className="font-semibold">Products</p>
                        <p className="text-sm text-muted-foreground">{data.summary.totalProducts} items</p>
                    </Card>
                </Link>
                <Link href="/admin/orders">
                    <Card className="p-4 hover:border-primary transition-colors cursor-pointer">
                        <ShoppingBag className="text-primary mb-2" size={24} />
                        <p className="font-semibold">Orders</p>
                        <p className="text-sm text-muted-foreground">Manage orders</p>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
