"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface CategoryRailProps {
    categories: {
        id: string; // Prisma ID is string
        name: string;
        image: string; // Mapped from icon
        slug: string;
    }[];
}

export function CategoryRail({ categories }: CategoryRailProps) {
    return (
        <section className="py-6 bg-background/50">
            <div className="container px-4 mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Shop by Category</h2>
                    <Link href="/category/all" className="text-sm font-semibold text-primary hover:text-primary/80">
                        View All
                    </Link>
                </div>
                {/* Scrollable Rail for Mobile, Grid for Desktop */}
                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x md:grid md:grid-cols-5 md:gap-8 md:overflow-visible">
                    {categories.map((cat, index) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="block"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
                            >
                                <div className="w-16 h-16 md:w-28 md:h-28 relative rounded-full overflow-hidden bg-muted border-2 border-transparent group-hover:border-primary transition-all">
                                    <Image
                                        src={cat.image || '/images/placeholder.png'}
                                        alt={cat.name}
                                        fill
                                        className="object-cover p-1 group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <span className="text-xs md:text-sm font-medium text-center text-muted-foreground group-hover:text-primary transition-colors">
                                    {cat.name}
                                </span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
