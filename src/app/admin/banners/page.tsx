'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit2, Loader2, GripVertical, ExternalLink, Megaphone } from 'lucide-react';
import Image from 'next/image';
import { ImagePicker } from '@/components/admin/ImagePicker';

interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl: string | null;
    isActive: boolean;
    position: number;
    startDate: string | null;
    endDate: string | null;
}

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            const res = await fetch('/api/admin/banners');
            const data = await res.json();
            setBanners(data.banners || []);
        } catch (error) {
            console.error('Failed to load banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const openDialog = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            setTitle(banner.title);
            setImageUrl(banner.imageUrl);
            setLinkUrl(banner.linkUrl || '');
            setIsActive(banner.isActive);
        } else {
            setEditingBanner(null);
            setTitle('');
            setImageUrl('');
            setLinkUrl('');
            setIsActive(true);
        }
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!title || !imageUrl) {
            alert('Title and image are required');
            return;
        }

        setSaving(true);
        try {
            const method = editingBanner ? 'PUT' : 'POST';
            const body = editingBanner
                ? { id: editingBanner.id, title, imageUrl, linkUrl: linkUrl || null, isActive }
                : { title, imageUrl, linkUrl: linkUrl || null, isActive, position: banners.length };

            const res = await fetch('/api/admin/banners', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setDialogOpen(false);
                loadBanners();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save');
            }
        } catch (error) {
            alert('Failed to save banner');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (banner: Banner) => {
        if (!confirm(`Delete "${banner.title}"?`)) return;

        try {
            const res = await fetch(`/api/admin/banners?id=${banner.id}`, { method: 'DELETE' });
            if (res.ok) {
                loadBanners();
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const toggleActive = async (banner: Banner) => {
        try {
            await fetch('/api/admin/banners', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: banner.id, isActive: !banner.isActive }),
            });
            loadBanners();
        } catch (error) {
            console.error('Toggle failed:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Sale Banners</h1>
                    <p className="text-slate-500">Manage promotional banners for homepage</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => openDialog()}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Banner
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label>Title</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Summer Sale 50% Off"
                                />
                            </div>
                            <ImagePicker
                                value={imageUrl}
                                onChange={setImageUrl}
                                type="BANNER"
                                label="Banner Image"
                            />
                            <div>
                                <Label>Link URL (optional)</Label>
                                <Input
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="e.g., /category/marine-fish"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch checked={isActive} onCheckedChange={setIsActive} />
                                <Label>Active</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {editingBanner ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            ) : banners.length === 0 ? (
                <Card>
                    <CardContent className="py-20 text-center">
                        <Megaphone className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                        <h3 className="text-lg font-medium text-slate-700 mb-2">No banners yet</h3>
                        <p className="text-slate-500 mb-4">Create your first promotional banner</p>
                        <Button onClick={() => openDialog()}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Banner
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {banners.map((banner) => (
                        <Card key={banner.id} className={!banner.isActive ? 'opacity-60' : ''}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <GripVertical className="w-5 h-5 text-slate-300 cursor-grab" />
                                    <div className="w-32 h-20 relative rounded-lg overflow-hidden bg-slate-100">
                                        <Image
                                            src={banner.imageUrl}
                                            alt={banner.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{banner.title}</h3>
                                        {banner.linkUrl && (
                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                <ExternalLink className="w-3 h-3" />
                                                {banner.linkUrl}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {banner.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={banner.isActive}
                                            onCheckedChange={() => toggleActive(banner)}
                                        />
                                        <Button variant="ghost" size="sm" onClick={() => openDialog(banner)}>
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(banner)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
