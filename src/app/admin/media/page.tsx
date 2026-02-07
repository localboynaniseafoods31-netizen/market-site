'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Trash2, Image as ImageIcon, Loader2, Filter, Search } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
    id: string;
    filename: string;
    key: string;
    url: string;
    type: string;
    size: number;
    mimeType: string;
    createdAt: string;
}

export default function MediaLibraryPage() {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [filter, setFilter] = useState<string>('ALL');
    const [search, setSearch] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadMedia();
    }, [filter]);

    const loadMedia = async () => {
        setLoading(true);
        try {
            const url = filter === 'ALL'
                ? '/api/admin/media'
                : `/api/admin/media?type=${filter}`;
            const res = await fetch(url);
            const data = await res.json();
            setMedia(data.media || []);
        } catch (error) {
            console.error('Failed to load media:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        for (const file of Array.from(files)) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', filter === 'ALL' ? 'OTHER' : filter);

                const res = await fetch('/api/admin/media', {
                    method: 'POST',
                    body: formData,
                });

                const data = await res.json();
                if (data.success) {
                    setMedia(prev => [data.media, ...prev]);
                } else {
                    alert(`Failed to upload ${file.name}: ${data.error}`);
                }
            } catch (error) {
                console.error(`Upload failed for ${file.name}:`, error);
            }
        }

        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (item: MediaItem) => {
        if (!confirm(`Delete "${item.filename}"? This cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/media?id=${item.id}`, { method: 'DELETE' });
            if (res.ok) {
                setMedia(prev => prev.filter(m => m.id !== item.id));
            } else {
                alert('Failed to delete');
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };

    const filteredMedia = media.filter(m =>
        m.filename.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Media Library</h1>
                    <p className="text-slate-500">Manage images for categories, products, and banners</p>
                </div>
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        multiple
                        className="hidden"
                        onChange={handleUpload}
                    />
                    <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Images
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-slate-500" />
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Images</SelectItem>
                                    <SelectItem value="CATEGORY_ICON">Category Icons</SelectItem>
                                    <SelectItem value="PRODUCT_IMAGE">Product Images</SelectItem>
                                    <SelectItem value="BANNER">Banners</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search by filename..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="text-sm text-slate-500">
                            {filteredMedia.length} images
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Media Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            ) : filteredMedia.length === 0 ? (
                <Card>
                    <CardContent className="py-20 text-center">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                        <h3 className="text-lg font-medium text-slate-700 mb-2">No images found</h3>
                        <p className="text-slate-500 mb-4">Upload your first image to get started</p>
                        <Button onClick={() => fileInputRef.current?.click()}>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMedia.map((item) => (
                        <Card key={item.id} className="group overflow-hidden">
                            <div className="relative aspect-square bg-slate-100">
                                <Image
                                    src={item.url}
                                    alt={item.filename}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                {/* Overlay with actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => copyUrl(item.url)}
                                    >
                                        Copy URL
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(item)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-2">
                                <p className="text-xs font-medium truncate" title={item.filename}>
                                    {item.filename}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {formatBytes(item.size)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
