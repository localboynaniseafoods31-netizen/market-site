"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Clock, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="relative w-full min-h-[85vh] md:min-h-[800px] flex items-center overflow-hidden bg-background">
            {/* Background Pattern - Modern mesh gradient */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-sky-100/50 dark:bg-sky-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[250px] h-[250px] md:w-[600px] md:h-[600px] bg-teal-50/50 dark:bg-teal-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] dark:opacity-[0.05] dark:invert" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6 pt-0 md:pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 md:space-y-8"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-card/80 backdrop-blur-md border border-primary/20 shadow-sm text-primary text-xs md:text-sm font-bold tracking-wide uppercase"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                            </span>
                            Premium Selection
                        </motion.div>

                        {/* Heading */}
                        <div className="space-y-3 md:space-y-4 max-w-2xl">
                            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-foreground leading-[1.1] md:leading-[0.95] tracking-tight">
                                Taste the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600">
                                    Ocean's Soul
                                </span>
                            </h1>
                            <p className="text-base md:text-xl text-muted-foreground leading-relaxed font-medium max-w-sm md:max-w-lg mx-auto md:mx-0">
                                Freshness redefined. Chemical-free seafood delivered from the shore to your door in <span className="text-sky-600 font-bold">120 mins</span>.
                            </p>
                        </div>

                        {/* CTA Buttons - Adjusted for mobile */}
                        <div className="flex flex-col w-full sm:flex-row items-center gap-3 md:gap-4 md:w-auto mt-2">
                            <Link href="/category" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto h-12 md:h-16 px-8 rounded-full bg-primary text-primary-foreground text-base md:text-lg font-bold hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/20">
                                    Shop Now <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                </Button>
                            </Link>
                            <Link href="/category/deals" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 md:h-16 px-8 rounded-full border-2 border-border hover:bg-muted hover:text-foreground text-base font-bold transition-all">
                                    View Offers
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Metrics */}
                        <div className="grid grid-cols-3 gap-2 md:gap-8 w-full pt-6 md:pt-4 border-t border-slate-200/60 mt-4 md:mt-0">
                            {[
                                { icon: Clock, label: "120 Mins", sub: "Delivery" },
                                { icon: ShieldCheck, label: "100% Fresh", sub: "Guaranteed" },
                                { icon: TrendingUp, label: "Daily Catch", sub: "Verified" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center md:items-start p-2 md:p-0">
                                    <div className="p-1.5 md:p-2 rounded-full bg-primary/10 text-blue-600 mb-1 md:mb-2">
                                        <item.icon size={16} className="md:w-[20px] md:h-[20px]" />
                                    </div>
                                    <span className="font-bold text-foreground block text-sm md:text-base">{item.label}</span>
                                    <span className="text-[10px] md:text-xs text-muted-foreground font-medium">{item.sub}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Content - Visual Composition (HIDDEN ON MOBILE) */}
                    <div className="hidden md:flex relative w-full h-[500px] md:h-[700px] items-center justify-center">

                        {/* Main Circle Backdrop (Base) */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                            className="absolute z-0 w-[450px] md:w-[600px] h-[450px] md:h-[600px] border border-dashed border-slate-300/50 rounded-full"
                        />

                        {/* Inner White Circle (The "Plate" Background) */}
                        {/* Made slightly transparent to show sunset if overlapping, but mostly opaque for text contrast if needed. 
                            Actually, to see sunset *behind* it, the sunset must be larger or this must be transparent.
                            Given user wants sunset "behind image", let's put sunset ON TOP of this white circle but BEHIND image.
                         */}
                        <div className="absolute z-0 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-gradient-to-tr from-sky-50/80 to-white/90 rounded-full shadow-2xl shadow-sky-100/50 backdrop-blur-sm" />

                        {/* Ocean Depth Background (Now on top of white circle, behind image) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-t from-sky-400/20 via-blue-300/15 to-transparent blur-3xl opacity-80 z-0 pointer-events-none mix-blend-multiply" />

                        {/* Animated Birds - Enhanced for better visibility */}
                        <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden h-full w-full">
                            {/* Bird 1 - Larger, faster, more visible */}
                            <motion.div
                                initial={{ x: "120%", y: -30, opacity: 0 }}
                                animate={{
                                    x: "-30%",
                                    y: [-30, -70, -40, -80, -30],
                                    opacity: [0, 1, 1, 1, 0],
                                }}
                                transition={{
                                    x: { duration: 18, repeat: Infinity, ease: "linear" },
                                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                                    opacity: { duration: 18, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="absolute top-1/4 right-0 w-14 h-14 text-slate-700/80 drop-shadow-lg"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                    <path d="M22.5 12c-2.5 0-4.5-1.5-6-3.5-1.5 2-3.5 3.5-6 3.5s-4.5-1.5-6-3.5c-1 1.5-2 2.5-4 2.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                </svg>
                            </motion.div>

                            {/* Bird 2 - Medium size, different trajectory */}
                            <motion.div
                                initial={{ x: "120%", y: 50, opacity: 0 }}
                                animate={{
                                    x: "-30%",
                                    y: [50, 80, 60, 90, 50],
                                    opacity: [0, 0.9, 0.9, 0.9, 0],
                                }}
                                transition={{
                                    x: { duration: 22, repeat: Infinity, ease: "linear", delay: 3 },
                                    y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                                    opacity: { duration: 22, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="absolute top-1/2 right-0 w-10 h-10 text-slate-600/75 drop-shadow-md"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                    <path d="M22.5 12c-2.5 0-4.5-1.5-6-3.5-1.5 2-3.5 3.5-6 3.5s-4.5-1.5-6-3.5c-1 1.5-2 2.5-4 2.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                </svg>
                            </motion.div>

                            {/* Bird 3 - Smaller, faster, higher trajectory */}
                            <motion.div
                                initial={{ x: "120%", y: -100, opacity: 0 }}
                                animate={{
                                    x: "-30%",
                                    y: [-100, -130, -110, -140, -100],
                                    opacity: [0, 0.85, 0.85, 0.85, 0],
                                }}
                                transition={{
                                    x: { duration: 15, repeat: Infinity, ease: "linear", delay: 7 },
                                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                                    opacity: { duration: 15, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="absolute top-1/3 right-0 w-8 h-8 text-slate-800/70 drop-shadow-md"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                    <path d="M22.5 12c-2.5 0-4.5-1.5-6-3.5-1.5 2-3.5 3.5-6 3.5s-4.5-1.5-6-3.5c-1 1.5-2 2.5-4 2.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                </svg>
                            </motion.div>
                        </div>

                        {/* Main Image Layer */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotate: 10 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative z-10 w-full h-full flex items-center justify-center p-8"
                        >
                            <Image
                                src="/images/hero-desktop.png"
                                alt="Premium Seafood Platter"
                                width={700}
                                height={700}
                                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
                                priority
                            />
                        </motion.div>

                        {/* Floating Glass Cards (Parallax Simulation) */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="absolute top-1/4 right-0 md:-right-4 z-20"
                        >
                            <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                                <div className="bg-sky-100 p-2 rounded-full text-sky-600">
                                    <Star size={20} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Rated</p>
                                    <p className="text-sm font-bold text-slate-800">Tiger Prawns</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="absolute bottom-1/4 left-0 md:-left-8 z-20"
                        >
                            <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full text-green-600">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Safety</p>
                                    <p className="text-sm font-bold text-slate-800">100% Chemical Free</p>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}

// Helper types if needed in future
