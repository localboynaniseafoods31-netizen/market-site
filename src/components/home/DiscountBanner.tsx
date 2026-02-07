"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Timer, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EnhancedProductCard from "@/components/category/EnhancedProductCard";
import type { Product } from "@/data/seafoodData";
import Image from "next/image";

// Fallback banners (used only if no banners in DB)
const FALLBACK_BANNERS = [
    {
        id: "fallback-1",
        title: "Weekend Splash Sale",
        subtitle: "Flat 20% OFF on Prawns",
        description: "Fresh catch from the coast, delivered in 90 mins.",
        bgColor: "from-sky-500 to-blue-600",
        image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80",
        code: "WEEKEND20",
        link: "/category/deals"
    }
];

interface Banner {
    id: string;
    title: string;
    subtitle: string;
    description?: string | null;
    bgColor: string;
    image: string;
    code?: string | null;
    link?: string;
}

interface DiscountBannerProps {
    deals: Product[];
    banners?: Banner[];
}

export default function DiscountBanner({ deals, banners = [] }: DiscountBannerProps) {
    const [currentBanner, setCurrentBanner] = useState(0);

    // Use DB banners if available, else fallback
    const displayBanners = banners.length > 0 ? banners : FALLBACK_BANNERS;

    // Auto-slide effect
    useEffect(() => {
        if (displayBanners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % displayBanners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [displayBanners.length]);

    const displayDeals = deals;

    return (
        <section className="py-8 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
            <div className="container mx-auto px-4 space-y-8">

                {/* Header for Offers */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
                            <Tag className="w-6 h-6 text-primary fill-primary" />
                            Crazy Offers
                        </h2>
                        <p className="text-muted-foreground text-sm font-medium">Best deals of the day</p>
                    </div>
                </div>

                {/* Banner Slider */}
                <div className="relative w-full h-[220px] md:h-[300px] overflow-hidden rounded-3xl shadow-xl shadow-sky-900/5">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentBanner}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className={`absolute inset-0 w-full h-full bg-gradient-to-r ${displayBanners[currentBanner].bgColor} flex items-center`}
                        >
                            <div className="flex w-full h-full relative">
                                {/* Left Text Content */}
                                <div className="w-2/3 md:w-1/2 h-full p-6 md:p-10 flex flex-col justify-center text-white z-10 pb-10 md:pb-10">
                                    {displayBanners[currentBanner].code && (
                                        <motion.span
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-[10px] md:text-xs font-bold w-fit mb-2 md:mb-3 border border-white/10"
                                        >
                                            PROMO: {displayBanners[currentBanner].code}
                                        </motion.span>
                                    )}
                                    <h3 className="text-xl md:text-4xl font-black leading-tight mb-1 md:mb-2">
                                        {displayBanners[currentBanner].title}
                                    </h3>
                                    <p className="text-white/90 font-medium text-xs md:text-lg mb-3 md:mb-4 line-clamp-2">
                                        {displayBanners[currentBanner].subtitle}
                                    </p>
                                    <Link href={displayBanners[currentBanner].link || "/category/deals"}>
                                        <Button className="w-fit h-8 md:h-10 px-4 md:px-6 bg-white text-slate-900 hover:bg-slate-100 border-none font-bold rounded-full text-xs md:text-sm">
                                            Order Now <ChevronRight size={14} className="md:w-4 md:h-4" />
                                        </Button>
                                    </Link>
                                </div>

                                {/* Right Image Content */}
                                <div className="absolute right-0 top-0 w-1/2 md:w-3/5 h-full">
                                    <Image
                                        src={displayBanners[currentBanner].image}
                                        alt={displayBanners[currentBanner].title}
                                        fill
                                        className="object-cover object-center"
                                        style={{ maskImage: "linear-gradient(to left, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to left, black 60%, transparent 100%)" }}
                                        unoptimized
                                    />
                                </div>
                                {/* Gradient Overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent z-0" />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Slider Indicators */}
                    {displayBanners.length > 1 && (
                        <div className="absolute bottom-4 left-6 md:left-10 flex gap-2 z-20">
                            {displayBanners.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentBanner(idx)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${currentBanner === idx ? "bg-white w-6" : "bg-white/50"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Today's Deals Rail */}
                {displayDeals.length > 0 && (
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                                <Timer className="w-5 h-5 text-primary" />
                                Flash Sale <span className="text-sm font-normal text-muted-foreground">| Limited time offers</span>
                            </h3>
                            <Link href="/category/deals">
                                <Button variant="ghost" size="sm" className="text-primary font-bold hover:text-primary hover:bg-muted">
                                    See All
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                            {displayDeals.map((deal) => (
                                <EnhancedProductCard
                                    key={deal.id}
                                    {...deal}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
