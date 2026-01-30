"use client";

import { motion } from "framer-motion";
import EnhancedProductCard from "./EnhancedProductCard";
import type { Product } from "@/data/seafoodData";

interface CategoryProductGridProps {
    products: Product[];
}

export default function CategoryProductGrid({ products }: CategoryProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="py-20 text-center space-y-4">
                <div className="text-6xl opacity-20">🐟</div>
                <h3 className="text-xl font-bold text-slate-900">No products found</h3>
                <p className="text-slate-500">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                    <EnhancedProductCard {...product} />
                </motion.div>
            ))}
        </div>
    );
}
