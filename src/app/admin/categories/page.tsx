'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    productCount: number;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', slug: '', description: '' });
    const [saving, setSaving] = useState(false);

    const fetchCategories = () => {
        fetch('/api/admin/categories')
            .then((res) => res.json())
            .then((res) => {
                if (res.success) setCategories(res.data);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async () => {
        if (!form.name || !form.slug) return;
        setSaving(true);

        const url = editingId
            ? `/api/admin/categories/${editingId}`
            : '/api/admin/categories';
        const method = editingId ? 'PATCH' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setForm({ name: '', slug: '', description: '' });
            setEditingId(null);
            fetchCategories();
        }
        setSaving(false);
    };

    const handleEdit = (cat: Category) => {
        setEditingId(cat.id);
        setForm({ name: cat.name, slug: cat.slug, description: cat.description || '' });
    };

    const handleDelete = async (id: string, name: string, productCount: number) => {
        if (productCount > 0) {
            alert(`Cannot delete "${name}" - it has ${productCount} products. Move or delete products first.`);
            return;
        }
        if (!confirm(`Delete "${name}"?`)) return;

        const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setCategories(categories.filter((c) => c.id !== id));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Categories</h1>
                <p className="text-muted-foreground">{categories.length} categories</p>
            </div>

            {/* Add/Edit Form */}
            <Card className="p-4">
                <h3 className="font-semibold mb-4">{editingId ? 'Edit Category' : 'Add Category'}</h3>
                <div className="grid gap-4 md:grid-cols-4">
                    <Input
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <Input
                        placeholder="Slug (url-friendly)"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    />
                    <Input
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={saving}>
                            {editingId ? 'Update' : 'Add'}
                        </Button>
                        {editingId && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditingId(null);
                                    setForm({ name: '', slug: '', description: '' });
                                }}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Categories List */}
            <div className="grid gap-4">
                {categories.map((cat) => (
                    <Card key={cat.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Tags className="text-primary" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{cat.name}</h3>
                                    <p className="text-sm text-muted-foreground">/{cat.slug}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                    {cat.productCount} products
                                </span>
                                <Button variant="outline" size="icon" onClick={() => handleEdit(cat)}>
                                    <Pencil size={16} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-red-500"
                                    onClick={() => handleDelete(cat.id, cat.name, cat.productCount)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
