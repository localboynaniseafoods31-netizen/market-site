"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Percent, Tag, Sparkles, BadgePercent } from "lucide-react";
import type { CategoryBanner as CategoryBannerType } from "@/data/seafoodData";

interface CategoryBannerProps {
    banner: CategoryBannerType;
}

export default function CategoryBanner({ banner }: CategoryBannerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-48 md:h-56 rounded-2xl overflow-hidden mb-5 mt-7 shadow-lg"
        >
            {/* Background Image */}
            <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.backgroundColor || 'from-slate-900/80 to-slate-900/40'} md:${banner.backgroundColor || 'from-slate-900/70 to-slate-900/40'}`} />

            {/* Texture/Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-soft-light">
                <Image
                    src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop"
                    alt="pattern"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Floating Discount Icons - Lava Lamp Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Top Right - Percent Icon */}
                <motion.div
                    className="absolute top-8 right-12 text-white/20"
                    animate={{
                        y: [0, -30, 0],
                        x: [0, 20, 0],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Percent size={32} strokeWidth={2.5} />
                </motion.div>

                {/* Bottom Left - Tag Icon */}
                <motion.div
                    className="absolute bottom-12 left-16 text-white/15"
                    animate={{
                        y: [0, 35, 0],
                        x: [0, -25, 0],
                        rotate: [0, -360],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                    }}
                >
                    <Tag size={40} strokeWidth={2.5} />
                </motion.div>

                {/* Top Left - Sparkles Icon */}
                <motion.div
                    className="absolute top-16 left-1/4 text-white/10"
                    animate={{
                        y: [0, 25, 0],
                        x: [0, 30, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                >
                    <Sparkles size={28} strokeWidth={2.5} />
                </motion.div>

                {/* Bottom Right - BadgePercent Icon */}
                <motion.div
                    className="absolute bottom-8 right-1/3 text-white/20"
                    animate={{
                        y: [0, -25, 0],
                        x: [0, -20, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5,
                    }}
                >
                    <BadgePercent size={36} strokeWidth={2.5} />
                </motion.div>

                {/* Center - Small Percent Icon */}
                <motion.div
                    className="absolute top-1/2 right-20 text-white/10"
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 15, 0],
                        scale: [1, 1.3, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                >
                    <Percent size={24} strokeWidth={2.5} />
                </motion.div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center pt-8 md:pt-0">
                <div className="container mx-auto px-6 md:px-8">
                    <div className="max-w-xl space-y-4">
                        {/* Offer Badge */}
                        {banner.offerText && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
                                    {banner.offerText}
                                </div>
                            </motion.div>
                        )}

                        {/* Title */}
                        <h1
                            className="text-2xl md:text-5xl font-black text-white leading-tight drop-shadow-md"
                            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                        >
                            {banner.title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-sm md:text-lg text-white/95 font-semibold max-w-md drop-shadow-sm">
                            {banner.subtitle}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
