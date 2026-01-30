"use client";

import Link from "next/link";
import EnhancedProductCard from "@/components/category/EnhancedProductCard";
import { type Product } from "@/data/seafoodData";

interface HighlightSectionProps {
    products: Product[];
}

export function HighlightSection({ products }: HighlightSectionProps) {
    // Take first 4 products with highest discounts as "bestsellers"
    // Using passed products instead of hardcoded import
    const bestsellers = products
        .filter(p => p.offerPercentage && p.offerPercentage > 0)
        .sort((a, b) => (b.offerPercentage || 0) - (a.offerPercentage || 0))
        .slice(0, 4);

    // Fallback to any 4 products if no discounted ones
    const displayProducts = bestsellers.length >= 4
        ? bestsellers
        : products.slice(0, 4);

    return (
        <section id="highlight-section" className="py-6">
            <div className="container px-4 mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Bestsellers</h2>
                    <Link href="/category/all" className="text-xs text-primary font-semibold cursor-pointer hover:underline">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {displayProducts.map((product) => (
                        <EnhancedProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>
        </section>
    );
}

