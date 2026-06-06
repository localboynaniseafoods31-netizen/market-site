"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/config/constants";

export default function ThankYouContent() {
    return (
        <div className="min-h-screen bg-background ocean-mesh pt-10 md:pt-16 pb-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[280px] h-[280px] md:w-[500px] md:h-[500px] bg-sky-100/60 dark:bg-sky-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[240px] h-[240px] md:w-[420px] md:h-[420px] bg-teal-50/60 dark:bg-teal-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            <div className="container relative z-10 mx-auto px-4 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="w-16 h-16 mx-auto mb-8 bg-primary/10 rounded-full flex items-center justify-center"
                    >
                        <Heart className="w-8 h-8 text-primary fill-primary/20" />
                    </motion.div>

                    <p className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">
                        With gratitude
                    </p>

                    <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight tracking-tight mb-6">
                        Thank You for{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-600 to-teal-600">
                            Choosing Us
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto mb-4">
                        Your support means the world to us at {SITE_NAME}. We&apos;re honoured to bring the freshness of the coast to your table.
                    </p>

                    <p className="text-base text-muted-foreground/80 max-w-md mx-auto mb-10">
                        We&apos;ll take it from here — sit back, relax, and let the ocean come to you.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto h-12 px-8 rounded-full font-bold"
                            >
                                Back to Home
                            </Button>
                        </Link>
                        <Link href="/category" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto h-12 px-8 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                            >
                                Continue Shopping
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
