"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/seafoodData";

interface ProductTabsProps {
    product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState("description");

    return (
        <div className="mb-20">
            <div className="border-b border-slate-200 mb-6">
                <div className="flex gap-8 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab("description")}
                        className={cn(
                            "pb-4 border-b-2 font-bold whitespace-nowrap transition-colors",
                            activeTab === "description"
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Product Description
                    </button>
                    <button
                        onClick={() => setActiveTab("sourcing")}
                        className={cn(
                            "pb-4 border-b-2 font-bold whitespace-nowrap transition-colors",
                            activeTab === "sourcing"
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Sourcing & Quality
                    </button>
                    <button
                        onClick={() => setActiveTab("recipes")}
                        className={cn(
                            "pb-4 border-b-2 font-bold whitespace-nowrap transition-colors",
                            activeTab === "recipes"
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Recipes & Tips
                    </button>
                </div>
            </div>

            <div className="prose max-w-none text-muted-foreground min-h-[200px]">
                {activeTab === "description" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <p className="text-lg leading-relaxed mb-6">{product.description || "No specific description available."}</p>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">Texture</h4>
                                <p className="text-sm">{product.texture || "Fresh & Tender"}</p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">Cut Type</h4>
                                <p className="text-sm">{product.cutType || product.subcategory || "Standard Cut"}</p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">Best For</h4>
                                <p className="text-sm">Curries, Fry, Grill</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "sourcing" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h3 className="text-lg font-bold text-foreground mb-3">Why Choose Ocean Fresh?</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                <span>We source directly from the coast daily within 24 hours of catch.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                <span>0% Chemical or Ammonia usage - 100% Natural preservation.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                <span>Maintained at 0-4°C throughout the supply chain.</span>
                            </li>
                        </ul>
                    </div>
                )}

                {activeTab === "recipes" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/20">
                            <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-2">🧑‍🍳 Chef's Tip</h4>
                            <p className="text-orange-700 dark:text-orange-300">
                                For {product.title}, marinate with turmeric, chili powder, and lemon juice for 15 minutes before cooking to enhance the flavor and reduce fishy odor.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
