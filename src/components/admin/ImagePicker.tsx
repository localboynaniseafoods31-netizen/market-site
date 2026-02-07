'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon, Check, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImagePickerProps {
    value?: string;
    onChange: (url: string) => void;
    type?: 'CATEGORY_ICON' | 'PRODUCT_IMAGE' | 'BANNER' | 'OTHER';
    label?: string;
}

interface MediaItem {
    id: string;
    filename: string;
    url: string;
    type: string;
    size: number;
    createdAt: string;
}

export function ImagePicker({ value, onChange, type = 'OTHER', label = 'Select Image' }: ImagePickerProps) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<'library' | 'upload'>('library');
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadMedia = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/media?type=${type}`);
            const data = await res.json();
            setMedia(data.media || []);
        } catch (error) {
            console.error('Failed to load media:', error);
        } finally {
            setLoading(false);
        }
    }, [type]);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            loadMedia();
            setSelected(value || null);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);

            const res = await fetch('/api/admin/media', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setMedia(prev => [data.media, ...prev]);
                setSelected(data.media.url);
                setTab('library');
            } else {
                alert(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleConfirm = () => {
        if (selected) {
            onChange(selected);
            setOpen(false);
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium text-slate-700">{label}</label>}

            <div className="flex items-center gap-3">
                {/* Preview */}
                <div className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                    {value ? (
                        <Image
                            src={value}
                            alt="Selected"
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                            unoptimized
                        />
                    ) : (
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                    )}
                </div>

                {/* Picker Button */}
                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            {value ? 'Change' : 'Select'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Image Library</DialogTitle>
                        </DialogHeader>

                        <Tabs value={tab} onValueChange={(v) => setTab(v as 'library' | 'upload')} className="flex-1 flex flex-col overflow-hidden">
                            <TabsList>
                                <TabsTrigger value="library">Library</TabsTrigger>
                                <TabsTrigger value="upload">Upload New</TabsTrigger>
                            </TabsList>

                            <TabsContent value="library" className="flex-1 overflow-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                                    </div>
                                ) : media.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500">
                                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>No images found</p>
                                        <Button variant="link" onClick={() => setTab('upload')}>
                                            Upload your first image
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-4 gap-3 p-2">
                                        {media.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selected === item.url
                                                        ? 'border-sky-500 ring-2 ring-sky-200'
                                                        : 'border-transparent hover:border-slate-300'
                                                    }`}
                                                onClick={() => setSelected(item.url)}
                                            >
                                                <Image
                                                    src={item.url}
                                                    alt={item.filename}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                                {selected === item.url && (
                                                    <div className="absolute top-1 right-1 bg-sky-500 text-white rounded-full p-1">
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="upload" className="flex-1">
                                <div className="border-2 border-dashed border-slate-200 rounded-lg p-12 text-center">
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                    <p className="text-slate-600 mb-4">
                                        Drag and drop or click to upload
                                    </p>
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/gif"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            'Choose File'
                                        )}
                                    </Button>
                                    <p className="text-xs text-slate-400 mt-4">
                                        PNG, JPG, WebP or GIF (max 5MB)
                                    </p>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleConfirm} disabled={!selected}>
                                <Check className="w-4 h-4 mr-2" />
                                Select Image
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Clear Button */}
                {value && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onChange('')}
                        className="text-red-500 hover:text-red-600"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
