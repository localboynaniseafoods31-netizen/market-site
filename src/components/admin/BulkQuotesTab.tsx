'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Quote {
    id: string;
    name: string;
    phone: string;
    eventType: string | null;
    requirements: string | null;
    status: 'PENDING' | 'CONTACTED' | 'COMPLETED';
    createdAt: string;
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-none',
    CONTACTED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none',
    COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none',
};

export default function BulkQuotesTab() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchQuotes = () => {
        setLoading(true);
        fetch('/api/admin/quotes')
            .then((res) => res.json())
            .then((res) => {
                if (res.quotes) setQuotes(res.quotes);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        const res = await fetch(`/api/admin/quotes?id=${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
            setQuotes(quotes.map((q) => (q.id === id ? { ...q, status: newStatus as any } : q)));
        }
        setUpdatingId(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (quotes.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border">
                <p>No bulk quotes found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {quotes.map((quote) => (
                <Card key={quote.id} className="p-5 w-full overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Name & Contact */}
                        <div className="w-full md:w-1/4">
                            <h3 className="font-bold text-lg">{quote.name}</h3>
                            <a href={`tel:${quote.phone}`} className="text-sm text-sky-600 hover:underline inline-block mt-1">
                                {quote.phone}
                            </a>
                            <p className="text-xs text-muted-foreground mt-2">
                                {new Date(quote.createdAt).toLocaleString()}
                            </p>
                        </div>
                        
                        {/* Details */}
                        <div className="w-full md:w-2/4 space-y-3">
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase flex mb-1">Event Type</span>
                                <Badge variant="secondary" className="font-medium bg-slate-100">{quote.eventType || 'Not specified'}</Badge>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase flex mb-1">Requirements</span>
                                <p className="text-sm whitespace-pre-wrap bg-slate-50 p-3 flex rounded-lg border border-slate-100">{quote.requirements || 'No details provided'}</p>
                            </div>
                        </div>

                        {/* Status Update */}
                        <div className="w-full md:w-1/4 flex flex-col md:items-end justify-between">
                            <div className="w-full">
                                <span className="text-xs font-bold text-slate-500 uppercase flex mb-1 justify-start md:justify-end">Status</span>
                                <select
                                    className={`px-3 py-1.5 w-full md:w-auto ml-auto rounded-lg text-sm font-bold shadow-sm ${statusColors[quote.status]} cursor-pointer focus:ring-2 focus:ring-primary`}
                                    value={quote.status}
                                    onChange={(e) => updateStatus(quote.id, e.target.value)}
                                    disabled={updatingId === quote.id}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="CONTACTED">Contacted</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
