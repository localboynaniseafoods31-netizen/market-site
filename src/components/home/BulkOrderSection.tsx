"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoveRight, PartyPopper, PhoneCall } from "lucide-react";
import Image from "next/image";
import { RequestQuoteDialog } from "./RequestQuoteDialog";

export default function BulkOrderSection() {
    return (
        <section className="container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-[2.5rem] bg-sky-50/80 border border-sky-100 min-h-[450px] flex items-center shadow-lg shadow-sky-100/50"
            >
                {/* Modern Abstract Shapes */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-sky-200/40 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4" />

                <div className="relative z-10 w-full grid md:grid-cols-12 items-center gap-8 p-8 md:p-12 lg:p-16">

                    {/* Content Side */}
                    <div className="md:col-span-7 space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider mb-4 border border-sky-200/50">
                                <PartyPopper size={14} /> Celebration Ready
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] text-slate-900 tracking-tight">
                                Big Events Need <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">Serious Flavor.</span>
                            </h2>
                        </div>

                        <p className="text-slate-600 text-lg leading-relaxed font-medium max-w-xl">
                            From intimate house parties to grand weddings, we deliver fresh, clean, and custom-cut seafood in bulk. Priority sizing and timely delivery guaranteed.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <RequestQuoteDialog>
                                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95">
                                    Get Custom Quote <MoveRight className="ml-2 w-5 h-5" />
                                </Button>
                            </RequestQuoteDialog>

                            <Button variant="ghost" size="lg" className="text-slate-600 hover:text-orange-700 hover:bg-orange-50 rounded-full px-6 h-14 font-bold border border-slate-200/60 hover:border-orange-200">
                                <PhoneCall className="mr-2" size={18} /> Talk to Sales
                            </Button>
                        </div>

                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                                ))}
                            </div>
                            <p className="text-sm font-bold text-slate-500">Trusted by 50+ Event Planners</p>
                        </div>
                    </div>

                    {/* Image Side - Distinct Layout */}
                    <div className="md:col-span-5 relative h-[300px] md:h-[450px] w-full">
                        <div className="absolute inset-0 bg-sky-200 rounded-[2rem] rotate-3 opacity-20 transform translate-x-4 translate-y-4"></div>
                        <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=1200&auto=format&fit=crop"
                                alt="Seafood Banquet"
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                priority
                            />
                            {/* Overlay Gradient for Text readability if needed, though mainly image focus here */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                            {/* Floating Badge */}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50">
                                <p className="text-xs font-bold text-slate-400 uppercase">Starting at</p>
                                <p className="text-lg font-black text-slate-900">₹450<span className="text-xs font-medium text-slate-500">/kg</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
