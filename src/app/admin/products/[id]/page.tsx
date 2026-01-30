'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;
    const isNew = productId === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [form, setForm] = useState({
        name: '',
        slug: '',
        description: '',
        image: '/images/categories/marine_v3.png',
        images: [] as string[],
        grossWeight: '',
        netWeight: '',
        price: 0,
        originalPrice: 0,
        stock: 0,
        pieces: '',
        serves: '',
        sourcing: '',
        cutType: '',
        texture: '',
        deliveryTime: '120 min',
        categoryId: '',
    });

    useEffect(() => {
        // Fetch categories
        fetch('/api/admin/categories')
            .then((res) => res.json())
            .then((res) => {
                if (res.success) setCategories(res.data);
            });

        // Fetch product if editing
        if (!isNew) {
            fetch(`/api/admin/products/${productId}`)
                .then((res) => res.json())
                .then((res) => {
                    if (res.success) {
                        const p = res.data;
                        setForm({
                            name: p.name || '',
                            slug: p.slug || '',
                            description: p.description || '',
                            image: p.image || '',
                            images: p.images || [],
                            grossWeight: p.grossWeight || '',
                            netWeight: p.netWeight || '',
                            price: p.price || 0,
                            originalPrice: p.originalPrice || 0,
                            stock: p.stock || 0,
                            pieces: p.pieces || '',
                            serves: p.serves || '',
                            sourcing: p.sourcing || '',
                            cutType: p.cutType || '',
                            texture: p.texture || '',
                            deliveryTime: p.deliveryTime || '120 min',
                            categoryId: p.category?.id || '',
                        });
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [productId, isNew]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const url = isNew ? '/api/admin/products' : `/api/admin/products/${productId}`;
        const method = isNew ? 'POST' : 'PATCH';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            router.push('/admin/products');
        } else {
            const data = await res.json();
            alert(data.error?.message || 'Failed to save');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">{isNew ? 'Add Product' : 'Edit Product'}</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium">Product Name *</label>
                            <Input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Slug *</label>
                            <Input
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm font-medium">Category *</label>
                        <select
                            className="w-full h-10 px-3 border rounded-md bg-background text-foreground"
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pricing */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="text-sm font-medium">Price (₹) *</label>
                            <Input
                                type="number"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Original Price (₹)</label>
                            <Input
                                type="number"
                                value={form.originalPrice || ''}
                                onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) || 0 })}
                                placeholder="For discount"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Stock *</label>
                            <Input
                                type="number"
                                value={form.stock}
                                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                                required
                            />
                        </div>
                    </div>

                    {/* Weight */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium">Gross Weight *</label>
                            <Input
                                value={form.grossWeight}
                                onChange={(e) => setForm({ ...form, grossWeight: e.target.value })}
                                placeholder="e.g., 500g"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Net Weight *</label>
                            <Input
                                value={form.netWeight}
                                onChange={(e) => setForm({ ...form, netWeight: e.target.value })}
                                placeholder="e.g., 450g"
                                required
                            />
                        </div>
                    </div>

                    {/* Image */}
                    <div>
                        <label className="text-sm font-medium">Image URL *</label>
                        <Input
                            value={form.image}
                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                            required
                        />
                    </div>

                    {/* Additional Details */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium">Pieces</label>
                            <Input
                                value={form.pieces}
                                onChange={(e) => setForm({ ...form, pieces: e.target.value })}
                                placeholder="e.g., 6-8 Pieces"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Serves</label>
                            <Input
                                value={form.serves}
                                onChange={(e) => setForm({ ...form, serves: e.target.value })}
                                placeholder="e.g., Serves 2-3"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Cut Type</label>
                            <Input
                                value={form.cutType}
                                onChange={(e) => setForm({ ...form, cutType: e.target.value })}
                                placeholder="e.g., Steaks"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Delivery Time</label>
                            <Input
                                value={form.deliveryTime}
                                onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
                                placeholder="e.g., 120 min"
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={saving} className="w-full">
                        {saving ? (
                            <Loader2 className="animate-spin mr-2" size={18} />
                        ) : (
                            <Save className="mr-2" size={18} />
                        )}
                        {isNew ? 'Create Product' : 'Save Changes'}
                    </Button>
                </Card>
            </form>
        </div>
    );
}
