'use client';

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    // Ensure we have at least one image
    const displayImages = images.length > 0 ? images : ["/images/placeholder.png"];

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % displayImages.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image Container */}
            <div
                className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 group"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
            >
                <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-5 h-5 text-slate-600" />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={displayImages[selectedImage]}
                            alt={`${title} - View ${selectedImage + 1}`}
                            fill
                            className={cn(
                                "object-contain p-8 transition-transform duration-700 ease-out",
                                isZoomed ? "scale-125" : "scale-100"
                            )}
                            priority
                            unoptimized
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows for Mobile/Tablet */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity md:hidden"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity md:hidden"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {displayImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={cn(
                                "relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                                selectedImage === idx
                                    ? "border-sky-500 ring-2 ring-sky-100"
                                    : "border-slate-100 hover:border-slate-300"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover p-1"
                                unoptimized
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

