'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Category {
    id: string;
    name: string;
    image: string;
    slug: string;
    description: string;
}

export default function CategoriesGrid({ categories }: { categories: Category[] }) {
    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <h1 className="text-3xl md:text-5xl font-black text-foreground mb-3">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                        Explore Our Menu
                    </span>
                </h1>
                <p className="text-muted-foreground">Choose a category to find your perfect catch</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                {categories.map((cat, index) => (
                    <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="block group"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative overflow-hidden rounded-3xl bg-card shadow-lg border border-border p-4 flex flex-col items-center hover:shadow-xl hover:border-sky-500/30 transition-all duration-300"
                        >
                            <div className="relative w-32 h-32 md:w-48 md:h-48 mb-4">
                                <div className="absolute inset-0 bg-sky-500/5 rounded-full scale-90 group-hover:scale-100 group-hover:bg-sky-500/10 transition-all duration-500" />
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {cat.name}
                            </h3>
                            <p className="text-xs md:text-sm text-slate-500 font-medium">{cat.description}</p>

                            <div className="mt-4 px-4 py-1.5 rounded-full bg-muted text-foreground text-xs font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                View Products
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
