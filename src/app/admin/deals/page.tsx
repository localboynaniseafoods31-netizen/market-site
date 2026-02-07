'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit2, Loader2, Sparkles, Eye } from 'lucide-react';
import Image from 'next/image';
import { ImagePicker } from '@/components/admin/ImagePicker';

interface CrazyDeal {
    id: string;
    title: string;
    subtitle: string;
    description: string | null;
    bgColor: string;
    imageUrl: string;
    promoCode: string | null;
    linkUrl: string;
    isActive: boolean;
    position: number;
}

const BG_COLOR_OPTIONS = [
    { label: 'Sky Blue', value: 'from-sky-500 to-blue-600' },
    { label: 'Teal', value: 'from-teal-500 to-emerald-600' },
    { label: 'Orange', value: 'from-orange-500 to-amber-600' },
    { label: 'Purple', value: 'from-purple-500 to-pink-600' },
    { label: 'Red', value: 'from-red-500 to-rose-600' },
    { label: 'Green', value: 'from-green-500 to-lime-600' },
];

export default function CrazyDealsPage() {
    const [deals, setDeals] = useState<CrazyDeal[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingDeal, setEditingDeal] = useState<CrazyDeal | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [bgColor, setBgColor] = useState('from-sky-500 to-blue-600');
    const [imageUrl, setImageUrl] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [linkUrl, setLinkUrl] = useState('/category/deals');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        loadDeals();
    }, []);

    const loadDeals = async () => {
        try {
            const res = await fetch('/api/admin/deals');
            const data = await res.json();
            setDeals(data.deals || []);
        } catch (error) {
            console.error('Failed to load deals:', error);
        } finally {
            setLoading(false);
        }
    };

    const openDialog = (deal?: CrazyDeal) => {
        if (deal) {
            setEditingDeal(deal);
            setTitle(deal.title);
            setSubtitle(deal.subtitle);
            setDescription(deal.description || '');
            setBgColor(deal.bgColor);
            setImageUrl(deal.imageUrl);
            setPromoCode(deal.promoCode || '');
            setLinkUrl(deal.linkUrl);
            setIsActive(deal.isActive);
        } else {
            setEditingDeal(null);
            setTitle('');
            setSubtitle('');
            setDescription('');
            setBgColor('from-sky-500 to-blue-600');
            setImageUrl('');
            setPromoCode('');
            setLinkUrl('/category/deals');
            setIsActive(true);
        }
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!title || !subtitle || !imageUrl) {
            alert('Title, subtitle, and image are required');
            return;
        }

        setSaving(true);
        try {
            const method = editingDeal ? 'PUT' : 'POST';
            const body = editingDeal
                ? { id: editingDeal.id, title, subtitle, description: description || null, bgColor, imageUrl, promoCode: promoCode || null, linkUrl, isActive }
                : { title, subtitle, description: description || null, bgColor, imageUrl, promoCode: promoCode || null, linkUrl, isActive, position: deals.length };

            const res = await fetch('/api/admin/deals', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setDialogOpen(false);
                loadDeals();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save');
            }
        } catch (error) {
            alert('Failed to save deal');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (deal: CrazyDeal) => {
        if (!confirm(`Delete "${deal.title}"?`)) return;

        try {
            const res = await fetch(`/api/admin/deals?id=${deal.id}`, { method: 'DELETE' });
            if (res.ok) {
                loadDeals();
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const toggleActive = async (deal: CrazyDeal) => {
        try {
            await fetch('/api/admin/deals', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deal.id, isActive: !deal.isActive }),
            });
            loadDeals();
        } catch (error) {
            console.error('Toggle failed:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Crazy Deals</h1>
                    <p className="text-slate-500">Manage homepage promotional banners</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => openDialog()}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Deal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Title *</Label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Weekend Splash Sale"
                                    />
                                </div>
                                <div>
                                    <Label>Promo Code</Label>
                                    <Input
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        placeholder="e.g., WEEKEND20"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Subtitle *</Label>
                                <Input
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value)}
                                    placeholder="e.g., Flat 20% OFF on Prawns"
                                />
                            </div>
                            <div>
                                <Label>Description (optional)</Label>
                                <Input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g., Fresh catch from the coast"
                                />
                            </div>
                            <div>
                                <Label>Background Color</Label>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    {BG_COLOR_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setBgColor(opt.value)}
                                            className={`h-10 rounded-lg bg-gradient-to-r ${opt.value} text-white text-xs font-bold border-2 transition-all ${bgColor === opt.value ? 'border-slate-900 ring-2 ring-slate-400' : 'border-transparent'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <ImagePicker
                                value={imageUrl}
                                onChange={setImageUrl}
                                type="BANNER"
                                label="Banner Image *"
                            />
                            <div>
                                <Label>Link URL</Label>
                                <Input
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="/category/deals"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch checked={isActive} onCheckedChange={setIsActive} />
                                <Label>Active</Label>
                            </div>

                            {/* Preview */}
                            {imageUrl && (
                                <div className="mt-4">
                                    <Label className="flex items-center gap-2 mb-2">
                                        <Eye className="w-4 h-4" /> Preview
                                    </Label>
                                    <div className={`relative h-40 rounded-xl overflow-hidden bg-gradient-to-r ${bgColor}`}>
                                        <div className="absolute inset-0 p-4 text-white z-10">
                                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">
                                                PROMO: {promoCode || 'CODE'}
                                            </span>
                                            <h3 className="text-lg font-bold mt-1">{title || 'Title'}</h3>
                                            <p className="text-sm opacity-90">{subtitle || 'Subtitle'}</p>
                                        </div>
                                        <div className="absolute right-0 top-0 w-1/2 h-full">
                                            <Image
                                                src={imageUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                                style={{ maskImage: 'linear-gradient(to left, black 60%, transparent 100%)' }}
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {editingDeal ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            ) : deals.length === 0 ? (
                <Card>
                    <CardContent className="py-20 text-center">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                        <h3 className="text-lg font-medium text-slate-700 mb-2">No deals yet</h3>
                        <p className="text-slate-500 mb-4">Create your first promotional deal</p>
                        <Button onClick={() => openDialog()}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Deal
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {deals.map((deal) => (
                        <Card key={deal.id} className={!deal.isActive ? 'opacity-60' : ''}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-40 h-24 relative rounded-lg overflow-hidden bg-gradient-to-r ${deal.bgColor}`}>
                                        <Image
                                            src={deal.imageUrl}
                                            alt={deal.title}
                                            fill
                                            className="object-cover"
                                            style={{ maskImage: 'linear-gradient(to left, black 60%, transparent 100%)' }}
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 p-2 text-white">
                                            <p className="text-[10px] font-bold truncate">{deal.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{deal.title}</h3>
                                        <p className="text-sm text-slate-500">{deal.subtitle}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {deal.promoCode && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                                    {deal.promoCode}
                                                </span>
                                            )}
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${deal.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {deal.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={deal.isActive}
                                            onCheckedChange={() => toggleActive(deal)}
                                        />
                                        <Button variant="ghost" size="sm" onClick={() => openDialog(deal)}>
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(deal)}>
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
