'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, addDays } from 'date-fns';
import { Save, Loader2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface Product {
    id: string;
    name: string;
    price: number; // rupees
    stock: number;
}

interface DailySaleItem {
    productId: string;
    price: number; // rupees
    stock: number;
}

interface DailySaleApiItem {
    productId: string;
    price: number; // paisa in DB
    stock: number;
}

export default function DailySalesPage() {
    const [date, setDate] = useState<Date>(addDays(new Date(), 1));
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [saleItems, setSaleItems] = useState<Record<string, DailySaleItem>>({});

    // Fetch Products & Existing Sale Data
    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchDailySale();
    }, [date]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const fetchDailySale = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/editor/daily-sales?date=${date.toISOString()}`);
            const data = await res.json();

            if (data.success && data.data) {
                // Map existing sale items to state
                const itemsMap: Record<string, DailySaleItem> = {};
                data.data.items.forEach((item: DailySaleApiItem) => {
                    itemsMap[item.productId] = {
                        productId: item.productId,
                        price: item.price / 100,
                        stock: item.stock,
                    };
                });
                setSaleItems(itemsMap);
            } else {
                // Reset if no sale exists
                setSaleItems({});
            }
        } catch (error) {
            console.error('Failed to fetch daily sale', error);
        } finally {
            setLoading(false);
        }
    };

    const handleItemChange = (productId: string, field: 'price' | 'stock', value: number) => {
        setSaleItems(prev => {
            const current = prev[productId] || {
                productId,
                price: products.find(p => p.id === productId)?.price || 0,
                stock: 0
            };

            return {
                ...prev,
                [productId]: {
                    ...current,
                    [field]: value
                }
            };
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Filter out items with 0 stock (assuming 0 stock means not for sale that day)
            // Or send all? Let's send all defined items.
            const items = Object.values(saleItems)
                .filter(item => item.stock > 0)
                .map(item => ({
                    ...item,
                    price: Math.round(item.price * 100)
                }));

            const res = await fetch('/api/editor/daily-sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: date.toISOString(),
                    items,
                }),
            });

            const result = await res.json();

            if (result.success) {
                toast.success('Daily sale submitted for approval');
            } else {
                toast.error(result.error || 'Failed to submit');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Daily Sales Management</h1>
                    <p className="text-muted-foreground">Set prices and stock for {format(date, 'MMM dd, yyyy')}</p>
                </div>

                <div className="flex items-center gap-2">
                    <Input
                        type="date"
                        className="w-auto"
                        value={format(date, 'yyyy-MM-dd')}
                        onChange={(e) => setDate(new Date(e.target.value))}
                    />
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                        Submit for Approval
                    </Button>
                </div>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Base Price</TableHead>
                            <TableHead>Today&apos;s Price (₹)</TableHead>
                            <TableHead>Stock Available</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>₹{product.price}</TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        className="w-24"
                                        value={saleItems[product.id]?.price !== undefined ? saleItems[product.id].price : product.price}
                                        onChange={(e) => handleItemChange(product.id, 'price', Number(e.target.value))}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        className="w-24"
                                        value={saleItems[product.id]?.stock || 0}
                                        onChange={(e) => handleItemChange(product.id, 'stock', Number(e.target.value))}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
