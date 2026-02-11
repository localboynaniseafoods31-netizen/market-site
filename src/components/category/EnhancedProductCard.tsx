"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/seafoodData";
import {
    useAppDispatch,
    useAppSelector,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    selectProductQuantity,
    selectIsServiceable
} from "@/store";

interface EnhancedProductCardProps extends Product { }

export default function EnhancedProductCard(product: EnhancedProductCardProps) {
    const dispatch = useAppDispatch();
    const quantity = useAppSelector(selectProductQuantity(product.id));
    const isServiceable = useAppSelector(selectIsServiceable);

    const handleAdd = () => {
        if (!isServiceable) {
            // Optional: Show toast or rely on UI state
            return;
        }
        if (product.stock !== undefined && quantity >= product.stock) {
            return;
        }
        if (quantity === 0) {
            dispatch(addToCart({ productId: product.id, quantity: 1, product: product }));
        } else {
            dispatch(incrementQuantity(product.id));
        }
    };

    const handleRemove = () => {
        dispatch(decrementQuantity(product.id));
    };

    const displayPrice = product.price;
    const displayOriginalPrice = product.originalPrice;

    const discountAmount = displayOriginalPrice
        ? displayOriginalPrice - displayPrice
        : 0;

    return (
        <Link href={`/product/${product.id}`} className="group relative bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer">
            {/* Image Section */}
            <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden rounded-t-2xl">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Offer Badge Overlay on Image */}
                {product.offerPercentage && (
                    <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-md uppercase tracking-wider">
                        {product.offerPercentage}% OFF
                    </div>
                )}

                {/* Tag Overlay (Non-Veg Indicator) */}
                <div className="absolute top-3 right-3 z-10 bg-card/90 backdrop-blur-sm p-1.5 rounded shadow-sm border border-border">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-blue-800 shadow-sm" />
                </div>

                {/* Carousel Dots - Interactive look */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 transition-opacity group-hover:opacity-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-card shadow-md border border-border" />
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                </div>
            </div>

            {/* Product Info Section */}
            <div className="p-2.5 md:p-4 flex flex-col flex-1">
                {/* Product Title */}
                <h3 className="font-bold text-foreground text-sm md:text-base leading-tight line-clamp-2 min-h-[2.5rem] mb-1">
                    {product.title}
                </h3>

                {/* Description Placeholder / Tags */}
                <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-1 mb-2">
                    Fresh catch, perfectly cleaned
                </p>

                {/* Weight & Serves Info */}
                <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-muted-foreground font-medium mb-2">
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-sky-500/10 rounded-md text-sky-600 dark:text-sky-400 font-bold border border-sky-500/20">
                        <span>{product.netWeight}</span>
                    </div>
                    <span className="bg-muted px-1.5 py-0.5 rounded-md text-muted-foreground font-bold">{product.serves || "Serves 2"}</span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-sm md:text-base font-bold text-foreground">
                        ₹{product.price / 100}
                    </span>
                    {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through font-medium">
                            ₹{product.originalPrice / 100}
                        </span>
                    )}
                    {product.offerPercentage && (
                        <span className="text-[11px] font-bold text-[#108942]">
                            {product.offerPercentage}% off
                        </span>
                    )}
                </div>

                {/* Spacer to push controls to bottom */}
                <div className="mt-auto pt-2 flex items-center justify-between border-t border-border/50 gap-1.5">
                    {/* Delivery Time (Bottom Left) */}
                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 flex items-center gap-1 truncate">
                            ⚡ 60 min
                        </span>
                        {(product.stock !== undefined && product.stock <= 5 && product.stock > 0) && (
                            <span className="text-[10px] font-bold text-red-500 animate-pulse">
                                Only {product.stock} left!
                            </span>
                        )}
                    </div>

                    {/* Add Controls (Bottom Right) */}
                    <div onClick={(e) => e.preventDefault()} className="flex-shrink-0">
                        {quantity === 0 ? (
                            <Button
                                onClick={(e) => { e.preventDefault(); handleAdd(); }}
                                disabled={(product.stock !== undefined && product.stock === 0) || !isServiceable}
                                size="sm"
                                className="h-8 px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-sm transition-all active:scale-95 border-none disabled:opacity-50 disabled:cursor-not-allowed"
                                title={!isServiceable ? "Not available in your location" : undefined}
                            >
                                {product.stock !== undefined && product.stock === 0 ? "Out" : "Add"} <Plus className="ml-1 w-3 h-3" />
                            </Button>
                        ) : (
                            <div className="flex items-center bg-primary text-primary-foreground rounded-lg h-8 px-0 shadow-sm border border-primary">
                                <button
                                    onClick={(e) => { e.preventDefault(); handleRemove(); }}
                                    className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-white/10 transition-colors"
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-black min-w-[20px] text-center">{quantity}</span>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleAdd(); }}
                                    disabled={product.stock !== undefined && quantity >= product.stock}
                                    className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Out of Stock Overlay */}
            {
                product.inStock === false && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-2xl">
                        <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold text-sm shadow-xl">
                            SOLD OUT
                        </div>
                    </div>
                )
            }
        </Link>
    );
}
