"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
    DrawerFooter,
} from "@/components/ui/drawer";

interface CategoryFiltersProps {
    filters: string[];
    onFilterChange: (filter: string) => void;
    onSortChange?: (sort: string) => void;
}

const SORT_OPTIONS = [
    { label: "Recommended", value: "recommended" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Newest First", value: "newest" },
];

export default function CategoryFilters({ filters, onFilterChange, onSortChange }: CategoryFiltersProps) {
    const [activeFilter, setActiveFilter] = useState("All");
    const [activeSort, setActiveSort] = useState("recommended");
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Ensure "All" is only present once
    const allFilters = ["All", ...filters.filter(f => f !== "All")];

    const handleSortSelect = (value: string) => {
        setActiveSort(value);
        setIsSortOpen(false);
        if (onSortChange) onSortChange(value);
    };

    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
        onFilterChange(filter);
    };

    return (
        <div className="sticky top-[60px] z-30 bg-background/95 backdrop-blur-sm py-2 mb-6 -mx-4 px-4 md:static md:bg-transparent md:p-0 md:m-0 md:mb-6">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pr-4">
                {/* Sort Button with Drawer */}
                <Drawer open={isSortOpen} onOpenChange={setIsSortOpen}>
                    <DrawerTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full gap-2 border-slate-300 h-10 px-4 font-bold text-slate-700 bg-white flex-shrink-0"
                        >
                            <ArrowUpDown size={14} />
                            {activeSort === 'recommended' ? 'Sort' : SORT_OPTIONS.find(o => o.value === activeSort)?.label}
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                                <DrawerTitle>Sort By</DrawerTitle>
                            </DrawerHeader>
                            <div className="p-4 space-y-2">
                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSortSelect(option.value)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-xl text-left transition-colors",
                                            activeSort === option.value
                                                ? "bg-sky-50 text-sky-900 font-bold"
                                                : "bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium"
                                        )}
                                    >
                                        {option.label}
                                        {activeSort === option.value && <Check size={18} className="text-sky-600" />}
                                    </button>
                                ))}
                            </div>
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button variant="ghost">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>

                {/* Divide line */}
                <div className="h-6 w-[1px] bg-slate-200 flex-shrink-0" />

                {allFilters.map((filter, index) => {
                    const isActive = activeFilter === filter;

                    return (
                        <motion.button
                            key={filter}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleFilterClick(filter)}
                            className={cn(
                                "relative px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex-shrink-0",
                                isActive
                                    ? "text-primary-foreground"
                                    : "bg-background text-muted-foreground hover:bg-muted border border-border hover:border-border/80"
                            )}
                        >
                            {filter}
                            {isActive && (
                                <motion.div
                                    layoutId="activeFilterPill"
                                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-lg shadow-primary/20 dark:shadow-none"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
