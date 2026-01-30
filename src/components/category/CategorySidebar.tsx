"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/data/seafoodData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LayoutGrid, ChevronRight, ChevronLeft } from "lucide-react";

export interface SidebarCategory {
    slug: string;
    name: string;
    icon: string | null;
    description: string | null;
    count: number;
}

interface CategorySidebarProps {
    categories?: SidebarCategory[];
}

export default function CategorySidebar({ categories: propCategories }: CategorySidebarProps) {
    const pathname = usePathname();
    const currentSlug = pathname.split("/").pop();
    const isAllActive = pathname === "/category/all";
    const [isExpanded, setIsExpanded] = useState(false);

    // Use passed categories or fallback to static data (mapped to match interface)
    const categories = propCategories || CATEGORIES.map(c => ({
        slug: c.slug,
        name: c.name,
        icon: c.icon,
        description: c.description,
        count: c.products.length
    }));

    return (
        <>
            {/* Mobile Sidebar */}
            <aside className={cn(
                "md:hidden fixed left-0 h-[calc(100vh-7rem-4rem)] bg-white border-r border-slate-200 z-40 pb-16 transition-all duration-300 ease-in-out flex flex-col",
                "top-20", // Position below header + search bar
                isExpanded ? "w-64 shadow-2xl" : "w-16"
            )}>
                {/* Toggle Handle */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute -right-3 top-[calc(45%-14px)] bg-white  rounded-full p-1  text-slate-500 hover:text-sky-600 transition-colors"
                >
                    {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>

                <div className="flex-1 overflow-y-auto py-3 mt-7">
                    <nav className="space-y-1 px-1.5">
                        {/* All Categories Option */}
                        <Link
                            href="/category/all"
                            className="block"
                            onClick={() => setIsExpanded(false)}
                        >
                            <div className={cn(
                                "relative flex items-center gap-3 p-2 rounded-xl transition-all overflow-hidden",
                                isAllActive ? "bg-sky-50" : "hover:bg-slate-50"
                            )}>
                                {isAllActive && (
                                    <motion.div
                                        layoutId="activeCategoryMobile"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-900 rounded-r-full"
                                    />
                                )}
                                <div className={cn(
                                    "relative w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center border-2 transition-all",
                                    isAllActive ? "border-sky-300 bg-sky-100 shadow-md" : "border-slate-100 bg-slate-50"
                                )}>
                                    <LayoutGrid size={20} className={isAllActive ? "text-slate-900" : "text-slate-400"} />
                                </div>

                                {/* Expanded Text */}
                                <div className={cn(
                                    "whitespace-nowrap transition-opacity duration-200",
                                    isExpanded ? "opacity-100 delay-100" : "opacity-0 w-0"
                                )}>
                                    <p className={cn(
                                        "text-sm font-bold",
                                        isAllActive ? "text-slate-900" : "text-slate-700"
                                    )}>
                                        All Categories
                                    </p>
                                </div>

                                {/* Collapsed Text (Icon Label) - Only visible when NOT expanded */}
                                {!isExpanded && (
                                    <div className="absolute inset-0 flex items-end justify-center pb-0.5 pointer-events-none">
                                        <p className={cn(
                                            "text-[9px] font-bold bg-white/90 px-1 rounded-sm",
                                            isAllActive ? "text-slate-900" : "text-slate-500"
                                        )}>
                                            All
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Link>

                        {categories.map((category, index) => {
                            const isActive = currentSlug === category.slug;

                            return (
                                <Link
                                    key={category.slug}
                                    href={`/category/${category.slug}`}
                                    className="block"
                                    onClick={() => setIsExpanded(false)}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={cn(
                                            "relative flex items-center gap-3 p-2 rounded-xl transition-all overflow-hidden",
                                            isActive ? "bg-sky-50" : "hover:bg-slate-50"
                                        )}
                                    >
                                        {/* Active indicator */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeCategoryMobile"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-900 rounded-r-full"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        {/* Category icon */}
                                        <div className={cn(
                                            "relative w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden border-2 transition-all",
                                            isActive ? "border-sky-300 shadow-md" : "border-slate-200"
                                        )}>
                                            <Image
                                                src={category.icon || "/images/placeholder.png"}
                                                alt={category.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Expanded Text */}
                                        <div className={cn(
                                            "min-w-0 transition-opacity duration-200",
                                            isExpanded ? "opacity-100 delay-100" : "opacity-0 w-0"
                                        )}>
                                            <p className={cn(
                                                "text-sm font-bold truncate",
                                                isActive ? "text-slate-900" : "text-slate-700"
                                            )}>
                                                {category.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 truncate">
                                                {category.count} Items
                                            </p>
                                        </div>

                                        {/* Collapsed Text (Icon Label) - Only visible when NOT expanded */}
                                        {!isExpanded && (
                                            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-0.5 pointer-events-none">
                                                <p className={cn(
                                                    "text-[8px] font-bold bg-white/80 px-1 rounded-sm truncate max-w-[90%]",
                                                    isActive ? "text-slate-900" : "text-slate-500"
                                                )}>
                                                    {category.name.split(" ")[0]}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside >

            {/* Desktop Sidebar - Full */}
            < aside className="hidden md:block w-64 lg:w-72 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto border-r border-slate-200 bg-white" >
                <div className="p-4 mt-7">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 italic">
                        Explore Shop
                    </h2>

                    <nav className="space-y-1">
                        {/* All Categories Option */}
                        <Link href="/category/all" className="block">
                            <div className={cn(
                                "relative flex items-center gap-3 p-3 rounded-xl transition-all group",
                                isAllActive ? "bg-sky-50 border border-sky-200" : "hover:bg-slate-50 border border-transparent"
                            )}>
                                {isAllActive && (
                                    <motion.div
                                        layoutId="activeCategory"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-900 rounded-r-full"
                                    />
                                )}
                                <div className={cn(
                                    "relative w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all",
                                    isAllActive ? "border-sky-300 bg-sky-100 shadow-md" : "border-slate-200 bg-slate-50 group-hover:border-slate-300"
                                )}>
                                    <LayoutGrid size={24} className={isAllActive ? "text-slate-900" : "text-slate-400"} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={cn(
                                        "font-bold text-sm leading-tight transition-colors",
                                        isAllActive ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
                                    )}>
                                        All Categories
                                    </h3>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                        View everything we offer
                                    </p>
                                </div>
                            </div>
                        </Link>
                        {categories.map((category, index) => {
                            const isActive = currentSlug === category.slug;

                            return (
                                <Link
                                    key={category.slug}
                                    href={`/category/${category.slug}`}
                                    className="block"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={cn(
                                            "relative flex items-center gap-3 p-3 rounded-xl transition-all group",
                                            isActive
                                                ? "bg-sky-50 border border-sky-200"
                                                : "hover:bg-slate-50 border border-transparent"
                                        )}
                                    >
                                        {/* Active indicator bar */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeCategory"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-900 rounded-r-full"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        {/* Category icon */}
                                        <div className={cn(
                                            "relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                                            isActive
                                                ? "border-sky-300 shadow-md"
                                                : "border-slate-200 group-hover:border-slate-300"
                                        )}>
                                            <Image
                                                src={category.icon || "/images/placeholder.png"}
                                                alt={category.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Category info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className={cn(
                                                "font-bold text-sm leading-tight transition-colors",
                                                isActive
                                                    ? "text-slate-900"
                                                    : "text-slate-700 group-hover:text-slate-900"
                                            )}>
                                                {category.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                                {category.description}
                                            </p>
                                        </div>

                                        {/* Product count badge */}
                                        <div className={cn(
                                            "text-xs font-bold px-2 py-1 rounded-full transition-colors",
                                            isActive
                                                ? "bg-sky-100 text-slate-900"
                                                : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                                        )}>
                                            {category.count}
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside >
        </>
    );
}
