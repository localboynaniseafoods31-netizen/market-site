'use client';

import { useEffect, useState } from 'react';
import SalesChart from '@/components/admin/SalesChart';
import SalesTable from '@/components/admin/SalesTable';
import SalesCalendar from '@/components/admin/SalesCalendar';
import { Card } from '@/components/ui/card';
import { Loader2, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SalesData {
    startDate: string;
    endDate: string;
    days: Array<{
        date: string;
        total: number;
        count: number;
    }>;
    summary: {
        totalOrders: number;
        totalSales: number;
        daysWithOrders: number;
    };
}

export default function AdminSalesPage() {
    const [data, setData] = useState<SalesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());
    const [view, setView] = useState<'chart' | 'calendar' | 'table'>('chart');

    useEffect(() => {
        setLoading(true);
        fetch(`/api/admin/sales/calendar?year=${year}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.success) setData(res.data);
            })
            .finally(() => setLoading(false));
    }, [year]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (!data) return <div>Failed to load data</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Sales Analysis</h1>
                    <p className="text-muted-foreground">
                        Yearly Overview: ₹{data.summary.totalSales.toLocaleString()} ({data.summary.totalOrders} orders)
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        className="h-10 px-3 rounded-md border bg-background"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                    >
                        {[2024, 2025, 2026].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>

                    <div className="flex p-1 bg-muted rounded-lg">
                        <Button
                            variant={view === 'chart' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setView('chart')}
                        >
                            Chart
                        </Button>
                        <Button
                            variant={view === 'calendar' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setView('calendar')}
                        >
                            Calendar
                        </Button>
                        <Button
                            variant={view === 'table' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setView('table')}
                        >
                            Table
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {view === 'chart' && <SalesChart data={data.days} />}
                {view === 'calendar' && <SalesCalendar data={data.days} />}
                {view === 'table' && <SalesTable data={data.days} />}
            </div>
        </div>
    );
}
