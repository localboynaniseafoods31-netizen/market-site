'use client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, ShieldCheck, Clock, Share2, Heart, Scale, Users, CheckCircle2, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/seafoodData";
import { useAppDispatch, addToCart, incrementQuantity, decrementQuantity, useAppSelector, selectProductQuantity } from "@/store";
import { toast } from "sonner";

interface ProductInfoProps {
    product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const dispatch = useAppDispatch();
    const cartQuantity = useAppSelector(selectProductQuantity(product.id));
    const discount = product.offerPercentage || 0;
    const stock = product.stock;

    const handleAddToCart = () => {
        if (stock !== undefined && cartQuantity >= stock) {
            toast.error(`Only ${stock} items available in stock`);
            return;
        }
        dispatch(addToCart({ productId: product.id, quantity: 1, product: product }));
        toast.success(`Added ${product.title} to cart`);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div>
                <div className="flex justify-between items-start mb-2">
                    {product.inStock && (stock === undefined || stock > 0) ? (
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
                    <span className="text-3xl font-black text-foreground">₹{product.price / 100}</span>
                    {product.originalPrice && (
                        <>
                            <span className="text-lg text-slate-400 line-through mb-1">₹{product.originalPrice / 100}</span>
                            <span className="text-sm font-bold text-green-600 mb-1 bg-green-50 px-2 py-0.5 rounded-full">
                                {discount}% OFF
                            </span>
                        </>
                    )}
                </div>

                <div className="space-y-3">
                    {(stock !== undefined && stock <= 5 && stock > 0) && (
                        <p className="text-red-500 font-bold text-sm animate-pulse mb-2">
                            Only {stock} items left in stock!
                        </p>
                    )}
                    {cartQuantity > 0 ? (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-full h-14 px-2 w-full">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 shrink-0 rounded-full hover:bg-emerald-200 hover:text-emerald-700 text-emerald-600"
                                onClick={() => dispatch(decrementQuantity(product.id))}
                            >
                                <Minus className="h-5 w-5" />
                            </Button>
                            <div className="flex flex-col items-center justify-center flex-1">
                                <span className="font-bold text-lg text-emerald-700 leading-none">{cartQuantity}</span>
                                <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider mt-0.5">In Cart</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 shrink-0 rounded-full hover:bg-emerald-200 hover:text-emerald-700 text-emerald-600"
                                onClick={() => {
                                    if (stock !== undefined && cartQuantity >= stock) {
                                        toast.error(`Only ${stock} items available`);
                                        return;
                                    }
                                    dispatch(incrementQuantity(product.id));
                                }}
                                disabled={stock !== undefined && cartQuantity >= stock}
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="lg"
                            className="w-full h-14 text-lg font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleAddToCart}
                            disabled={!product.inStock || (stock !== undefined && (stock === 0 || cartQuantity >= stock))}
                        >
                            {product.inStock && (stock === undefined || stock > 0)
                                ? (stock !== undefined && cartQuantity >= stock ? "Limit Reached" : "Add to Cart")
                                : "Out of Stock"}
                        </Button>
                    )}
                    <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                        <Truck className="w-3 h-3" />
                        Delivery in {product.deliveryTime || "90 mins"}
                    </p>
                </div>
            </div>
        </div>
    );
}
