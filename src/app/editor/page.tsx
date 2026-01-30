'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { format, addDays } from 'date-fns';

export default function EditorDashboard() {
    const tomorrow = addDays(new Date(), 1);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Editor Dashboard</h1>
                <p className="text-muted-foreground">Manage daily sales and inventory.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Next Sale</h3>
                        <Calendar className="text-primary h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold">{format(tomorrow, 'MMM dd, yyyy')}</p>
                    <div className="flex items-center gap-2 text-sm text-yellow-600">
                        <Clock size={16} />
                        <span>Pending Setup</span>
                        {/* Logic to show actual status will come later */}
                    </div>
                    <Button asChild className="w-full">
                        <Link href="/editor/sales">Manage Sales</Link>
                    </Button>
                </Card>

                <Card className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Today's Status</h3>
                        <CheckCircle className="text-green-600 h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold">Active</p>
                    <p className="text-sm text-muted-foreground">Sales are live for today.</p>
                </Card>
            </div>
        </div>
    );
}
