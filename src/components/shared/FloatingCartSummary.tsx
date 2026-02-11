"use client";

import { useAppSelector, selectCartTotal, selectCartItemCount, useAppDispatch, clearCart } from "@/store";
import { ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function FloatingCartSummary() {
    const total = useAppSelector(selectCartTotal);
    const count = useAppSelector(selectCartItemCount);
    const dispatch = useAppDispatch();
    const pathname = usePathname();

    if (count === 0) return null;
    if (pathname === '/cart' || pathname === '/checkout') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-20 left-4 right-4 z-40 md:bottom-8 md:right-8 md:left-auto md:w-96"
            >
                <div className="flex gap-2">
                    <Link href="/cart" className="flex-1">
                        <div className="bg-primary text-primary-foreground rounded-l-xl rounded-r-sm p-3 shadow-lg flex items-center justify-between backdrop-blur-md bg-opacity-95 h-full">
                            <div className="flex flex-col">
                                <span className="text-xs font-medium opacity-90">{count} ITEM{count > 1 ? 'S' : ''}</span>
                                <div className="font-bold text-sm flex items-center gap-1">
                                    ₹{total / 100}
                                    <span className="text-[10px] font-normal opacity-70">plus taxes</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 font-bold text-sm">
                                View Cart <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(clearCart());
                        }}
                        className="bg-red-600 text-white rounded-r-xl rounded-l-sm p-3 shadow-lg flex items-center justify-center backdrop-blur-md bg-opacity-95"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
