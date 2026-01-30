"use client";

import { Home, Search, ShoppingBag, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FloatingCartSummary from "@/components/shared/FloatingCartSummary";
import { useAppSelector, selectCartItemCount } from "@/store";

export default function BottomNav() {
    const pathname = usePathname();
    const cartCount = useAppSelector(selectCartItemCount);

    const isActive = (path: string) => pathname === path;

    if (pathname.startsWith('/admin')) return null;

    return (
        <>
            <FloatingCartSummary />
            <div className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-md border-t border-border flex items-center justify-around px-2 z-50 md:hidden pb-safe">
                <Link href="/" className={`flex flex-col items-center gap-1 p-2 ${isActive('/') ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                    <Home className="w-5 h-5" />
                    <span className="text-[10px]">Home</span>
                </Link>

                <Link href="/category" className={`flex flex-col items-center gap-1 p-2 ${isActive('/category') ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                    <UtensilsCrossed className="w-5 h-5" />
                    <span className="text-[10px]">Menu</span>
                </Link>

                <Link href="/cart" className={`flex flex-col items-center gap-1 p-2 ${isActive('/cart') ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                    <div className="relative">
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary text-primary-foreground text-[9px] flex items-center justify-center rounded-full font-bold">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px]">Cart</span>
                </Link>


            </div>
        </>
    );
}
