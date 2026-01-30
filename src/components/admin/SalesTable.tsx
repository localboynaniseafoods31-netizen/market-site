'use client';

import { Card } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

interface SalesTableProps {
    data: Array<{
        date: string;
        total: number;
        count: number;
    }>;
}

export default function SalesTable({ data }: SalesTableProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="p-6 text-center text-muted-foreground">
                No sales data available.
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold">Daily Sales Log</h3>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Orders</TableHead>
                            <TableHead className="text-right">Total Revenue</TableHead>
                            <TableHead className="text-right">Avg. Order Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((day) => (
                            <TableRow key={day.date}>
                                <TableCell className="font-medium">
                                    {format(parseISO(day.date), 'MMMM dd, yyyy')}
                                </TableCell>
                                <TableCell className="text-right">{day.count}</TableCell>
                                <TableCell className="text-right font-bold text-primary">
                                    ₹{day.total.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    ₹{Math.round(day.total / day.count).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
