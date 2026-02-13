"use client";

import EnhancedProductCard from "@/components/category/EnhancedProductCard";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { getAllProducts, type Product } from "@/data/seafoodData";

interface CategoryOption {
    id: string;
    name: string;
    slug: string;
}

interface ProductGridProps {
    title?: string;
    segment?: string;
    items?: Product[];
    categories?: CategoryOption[];
}

export default function ProductGrid({ title, segment, items, categories: propCategories }: ProductGridProps) {
    const [activeTab, setActiveTab] = useState(segment || "all");

    // Use passed items or fetch all from central store
    const sourceProducts = items || getAllProducts();

    // Derive filterable tabs: "All" + Passed Categories (or unique from items if not passed)
    const tabs = [
        { name: "All", slug: "all" },
        ...(propCategories?.map(c => ({ name: c.name, slug: c.slug })) || [])
    ];

    const filteredProducts = activeTab === "all"
        ? sourceProducts
        : sourceProducts.filter(p => p.category === activeTab || p.subcategory === activeTab); // Support slug match

    return (
        <section className="py-6">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    {title && (
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl md:text-3xl font-black text-foreground flex items-center gap-2">
                                {title}
                            </h3>
                            <Link href="/category/all" className="text-sm font-bold text-primary hover:underline">
                                View All
                            </Link>
                        </div>
                    )}

                    {!segment && tabs.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.slug}
                                    onClick={() => setActiveTab(tab.slug)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                                        activeTab === tab.slug
                                            ? "bg-primary text-primary-foreground shadow-sm dark:shadow-none"
                                            : "bg-background text-muted-foreground hover:bg-muted border border-border"
                                    )}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                    {filteredProducts.map((product) => (
                        <EnhancedProductCard key={product.id} {...product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <div className="text-4xl text-slate-300">🎣</div>
                        <p className="text-slate-500 font-medium">Coming soon! We&apos;re catching them for you.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
