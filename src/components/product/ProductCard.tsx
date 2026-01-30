"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Clock, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    id: string;
    title: string;
    image: string;
    grossWeight: string;
    netWeight: string;
    price: number;
    originalPrice?: number;
    deliveryTime?: string;
}

export default function ProductCard({
    title,
    image,
    grossWeight,
    netWeight,
    price,
    originalPrice,
    deliveryTime = "90 mins",
    className,
}: ProductCardProps & { className?: string }) {
    const [quantity, setQuantity] = useState(0);

    return (
        <Card className={cn("overflow-hidden border-none shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow duration-300 rounded-2xl bg-white flex flex-col justify-between", className)}>
            {/* Image Section */}
            <div className="relative h-48 bg-muted/20">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                />
                {deliveryTime && (
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm text-primary">
                        <Clock size={10} /> {deliveryTime}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <CardContent className="p-3">
                <h3 className="font-bold text-sm md:text-base text-foreground line-clamp-2 leading-tight min-h-[2.5em]">
                    {title}
                </h3>

                <div className="flex gap-2 mt-1.5 text-[10px] sm:text-xs text-muted-foreground bg-muted/30 p-1.5 rounded-lg w-fit">
                    <span>Gross: {grossWeight}</span>
                    <span className="w-px h-3 bg-border self-center" />
                    <span>Net: {netWeight}</span>
                </div>

                <div className="flex items-end justify-between mt-3 gap-2">
                    <div className="flex flex-col">
                        {originalPrice && (
                            <span className="text-[10px] text-muted-foreground line-through">₹{originalPrice}</span>
                        )}
                        <span className="font-bold text-base md:text-lg text-primary">₹{price}</span>
                    </div>

                    {quantity === 0 ? (
                        <Button
                            size="sm"
                            className="h-8 px-4 font-bold text-xs uppercase tracking-wide rounded-lg bg-white border border-primary text-primary hover:bg-primary hover:text-white transition-colors shadow-sm"
                            onClick={() => setQuantity(1)}
                        >
                            ADD <Plus size={14} className="ml-1" />
                        </Button>
                    ) : (
                        <div className="flex items-center h-8 bg-primary text-primary-foreground rounded-lg shadow-md overflow-hidden animate-in fade-in zoom-in duration-200">
                            <button
                                className="h-full px-2.5 hover:bg-primary/80 transition-colors"
                                onClick={() => setQuantity(q => Math.max(0, q - 1))}
                            >
                                <Minus size={14} />
                            </button>
                            <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                            <button
                                className="h-full px-2.5 hover:bg-primary/80 transition-colors"
                                onClick={() => setQuantity(q => q + 1)}
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
