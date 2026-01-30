'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Pencil, Trash2, Package } from 'lucide-react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    originalPrice: number | null;
    stock: number;
    inStock: boolean;
    category: { name: string; slug: string };
    offerPercentage: number | null;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/admin/products')
            .then((res) => res.json())
            .then((res) => {
                if (res.success) setProducts(res.data);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

        const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setProducts(products.filter((p) => p.id !== id));
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">{products.length} total products</p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus size={18} className="mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Products Grid */}
            <div className="grid gap-4">
                {filteredProducts.map((product) => (
                    <Card key={product.id} className="p-4 w-full overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0 w-full">
                                <h3 className="font-semibold truncate">{product.name}</h3>
                                <p className="text-sm text-muted-foreground">{product.category.name}</p>
                                <div className="flex items-center gap-4 mt-1">
                                    <span className="font-bold text-primary">₹{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-sm line-through text-muted-foreground">
                                            ₹{product.originalPrice}
                                        </span>
                                    )}
                                    {product.offerPercentage && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                            {product.offerPercentage}% OFF
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between w-full sm:w-auto gap-2 mt-2 sm:mt-0">
                                <div className="text-center px-4">
                                    <p
                                        className={`text-lg font-bold ${product.stock < 10 ? 'text-red-500' : 'text-foreground'
                                            }`}
                                    >
                                        {product.stock}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Stock</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/admin/products/${product.id}`}>
                                        <Button variant="outline" size="icon">
                                            <Pencil size={16} />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => handleDelete(product.id, product.name)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Package size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No products found</p>
                </div>
            )}
        </div>
    );
}
