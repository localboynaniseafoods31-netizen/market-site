"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    { id: "all", name: "All", image: "https://images.unsplash.com/photo-1534043464124-3866f9196e19?w=150&h=150&fit=crop" },
    { id: "sea", name: "Sea Fish", image: "https://images.unsplash.com/photo-1529231812765-51d07c2a445d?w=150&h=150&fit=crop" },
    { id: "river", name: "River Fish", image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=150&h=150&fit=crop" },
    { id: "prawns", name: "Prawns", image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=150&h=150&fit=crop" },
    { id: "shellfish", name: "Shellfish", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=150&h=150&fit=crop" },
    { id: "dry", name: "Dry Fish", image: "https://images.unsplash.com/photo-1577308856961-8e9ec50d0c67?w=150&h=150&fit=crop" },
];

export default function CategoryScroller() {
    return (
        <section className="py-6 border-b border-dashed border-border/60">
            <div className="container px-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    Shop by Category
                    <span className="text-xs font-normal text-muted-foreground ml-auto">View All</span>
                </h3>

                <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar -mx-4 px-4">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.id}`}
                            className="flex flex-col items-center gap-2 min-w-[80px] snap-start"
                        >
                            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-1 border-2 border-transparent hover:border-primary transition-all duration-200 ring-2 ring-primary/5 hover:ring-primary/20 bg-white shadow-sm overflow-hidden relative">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover rounded-full hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <span className="text-xs font-medium text-center text-foreground/90 leading-tight max-w-[80px]">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
