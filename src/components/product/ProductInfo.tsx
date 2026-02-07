'use client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, ShieldCheck, Clock, Share2, Heart, Scale, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/seafoodData";
import { useAppDispatch, addToCart } from "@/store";
import { toast } from "sonner";

interface ProductInfoProps {
    product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const dispatch = useAppDispatch();
    const discount = product.offerPercentage || 0;

    const handleAddToCart = () => {
        dispatch(addToCart({ productId: product.id, quantity: 1 }));
        toast.success(`Added ${product.title} to cart`);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div>
                <div className="flex justify-between items-start mb-2">
                    {product.inStock ? (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                            In Stock
                        </Badge>
                    ) : (
                        <Badge variant="destructive">Out of Stock</Badge>
                    )}

                    <div className="flex gap-2">
                        <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-destructive">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <h1 className="text-2xl md:text-4xl font-black text-foreground mb-2">
                    {product.title}
                </h1>

                {product.description && (
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        {product.description}
                    </p>
                )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-muted/50 p-3 rounded-xl border border-border flex items-center gap-3">
                    <div className="bg-background p-2 rounded-full shadow-sm dark:shadow-none">
                        <Scale className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Net Weight</p>
                        <p className="font-bold text-foreground">{product.netWeight}</p>
                    </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-xl border border-border flex items-center gap-3">
                    <div className="bg-background p-2 rounded-full shadow-sm dark:shadow-none">
                        <Users className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Serves</p>
                        <p className="font-bold text-foreground">{product.serves || "2-3"}</p>
                    </div>
                </div>

                {product.pieces && (
                    <div className="bg-muted/50 p-3 rounded-xl border border-border flex items-center gap-3">
                        <div className="bg-background p-2 rounded-full shadow-sm dark:shadow-none">
                            <CheckCircle2 className="w-4 h-4 text-sky-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Pieces</p>
                            <p className="font-bold text-foreground">{product.pieces}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Sourcing Info */}
            <div className="flex items-center gap-3 p-4 bg-sky-500/10 rounded-xl border border-sky-500/20">
                <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                <p className="text-sm text-sky-800 dark:text-sky-200">
                    <span className="font-bold">Sourcing:</span> {product.sourcing || "Fresh from Daily Catch"}
                </p>
            </div>

            {/* Price & Action */}
            <div className="bg-card rounded-2xl border-2 border-border p-6 md:sticky md:top-24 shadow-sm">
                <div className="flex items-end gap-3 mb-6">
                    <span className="text-3xl font-black text-foreground">₹{product.price}</span>
                    {product.originalPrice && (
                        <>
                            <span className="text-lg text-slate-400 line-through mb-1">₹{product.originalPrice}</span>
                            <span className="text-sm font-bold text-green-600 mb-1 bg-green-50 px-2 py-0.5 rounded-full">
                                {discount}% OFF
                            </span>
                        </>
                    )}
                </div>

                <div className="space-y-3">
                    <Button
                        size="lg"
                        className="w-full h-14 text-lg font-bold rounded-full"
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                    >
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                        <Truck className="w-3 h-3" />
                        Delivery in {product.deliveryTime || "90 mins"}
                    </p>
                </div>
            </div>
        </div>
    );
}
