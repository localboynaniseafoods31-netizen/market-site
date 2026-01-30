'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface SalesChartProps {
    data: Array<{
        date: string;
        total: number;
        count: number;
    }>;
}

export default function SalesChart({ data }: SalesChartProps) {
    // Check if data is empty
    if (!data || data.length === 0) {
        return (
            <Card className="p-6 h-[400px] flex items-center justify-center text-muted-foreground">
                No data available for graph
            </Card>
        );
    }

    // Format data for chart
    const chartData = data.map((d) => ({
        name: format(new Date(d.date), 'MMM dd'),
        sales: d.total,
        orders: d.count,
    }));

    // Reverse to show oldest first if data comes in newest first
    const sortedData = [...chartData].reverse();

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Sales Trend (Last 7 Days)</h3>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={sortedData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--background)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                            }}
                            formatter={(value: any) => [`₹${Number(value || 0).toLocaleString()}`, 'Sales']}
                        />
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="var(--primary)"
                            fillOpacity={1}
                            fill="url(#colorSales)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
