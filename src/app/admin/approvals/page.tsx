'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PendingSale {
    id: string;
    date: string;
    createdBy: { name: string };
    items: Array<{
        product: { name: string; price: number };
        price: number;
        stock: number;
    }>;
}

export default function AdminApprovalsPage() {
    const [sales, setSales] = useState<PendingSale[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingSales();
    }, []);

    const fetchPendingSales = async () => {
        try {
            const res = await fetch('/api/admin/approvals');
            const data = await res.json();
            if (data.success) {
                setSales(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
        try {
            const res = await fetch('/api/admin/approvals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success(`Sale ${action === 'APPROVE' ? 'Approved' : 'Rejected'}`);
                fetchPendingSales();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Pending Approvals</h1>

            {sales.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                    No pending sales approvals.
                </Card>
            ) : (
                <div className="grid gap-6">
                    {sales.map((sale) => (
                        <Card key={sale.id} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        Sale for {format(new Date(sale.date), 'MMMM dd, yyyy')}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Submitted by: {sale.createdBy?.name || 'Unknown'}
                                    </p>
                                </div>
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                    Pending Review
                                </Badge>
                            </div>

                            <div className="bg-muted match-braces rounded-lg p-4 mb-4 text-sm">
                                <div className="grid grid-cols-4 font-medium mb-2 opacity-70">
                                    <div>Product</div>
                                    <div>Base Price</div>
                                    <div>Sale Price</div>
                                    <div>Stock</div>
                                </div>
                                {sale.items.map((item, idx) => (
                                    <div key={idx} className="grid grid-cols-4 py-1 border-t border-border/50">
                                        <div>{item.product.name}</div>
                                        <div className="text-muted-foreground">₹{item.product.price / 100}</div>
                                        <div className={item.price !== item.product.price ? 'font-bold text-blue-600' : ''}>
                                            ₹{item.price / 100}
                                        </div>
                                        <div className="font-bold">{item.stock}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="destructive" onClick={() => handleAction(sale.id, 'REJECT')}>
                                    <X className="mr-2 h-4 w-4" /> Reject
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleAction(sale.id, 'APPROVE')}>
                                    <Check className="mr-2 h-4 w-4" /> Approve
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
