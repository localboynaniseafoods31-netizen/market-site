"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
    useAppDispatch,
    useAppSelector,
    selectCartItemsWithDetails,
    selectCartTotal,
    selectCartSavings,
    selectCartItemCount,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    selectIsServiceable,
    selectCartWeight,
} from "@/store";
import { DELIVERY_FEE, DELIVERY_FREE_WEIGHT_THRESHOLD_KG } from "@/config/constants";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(selectCartItemsWithDetails);
    const rawCartTotal = useAppSelector(selectCartTotal);
    const rawCartSavings = useAppSelector(selectCartSavings);
    const itemCount = useAppSelector(selectCartItemCount);
    const isServiceable = useAppSelector(selectIsServiceable);

    // Convert to Rupees for display and logic
    const cartTotal = rawCartTotal / 100;
    const cartSavings = rawCartSavings / 100;

    // Weight-based shipping (Free if >= 20kg)
    const cartWeight = useAppSelector(selectCartWeight);
    const deliveryFee = cartWeight >= DELIVERY_FREE_WEIGHT_THRESHOLD_KG ? 0 : DELIVERY_FEE;
    const finalTotal = cartTotal + deliveryFee;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-24 md:pt-32">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="bg-card rounded-3xl p-8 md:p-16 text-center shadow-sm border border-border">
                        <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h1 className="text-2xl font-black text-foreground mb-3">Your cart is empty</h1>
                        <p className="text-muted-foreground mb-8">
                            Looks like you haven't added anything yet. Let's fix that!
                        </p>
                        <Link href="/category">
                            <Button size="lg" className="rounded-full px-8 font-bold bg-slate-900 hover:bg-slate-800">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 md:pt-32 pb-40 md:pb-16 overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-foreground">Your Cart</h1>
                        <p className="text-sm text-muted-foreground">{itemCount} item{itemCount > 1 ? 's' : ''}</p>
                    </div>
                    <button
                        onClick={() => dispatch(clearCart())}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                        Clear All
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {cartItems.map((item: { productId: string; quantity: number; productSnapshot?: { stock?: number }; product?: { title: string; image: string; netWeight: string; serves?: string; price: number; originalPrice?: number; stock?: number } | null; lineTotal: number }) => (
                                <motion.div
                                    key={item.productId}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="bg-card rounded-2xl p-3 md:p-4 shadow-sm border border-border flex gap-3 md:gap-4 relative"
                                >
                                    {/* Product Image */}
                                    <Link href={`/product/${item.productId}`} className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                        <Image
                                            src={item.product?.image || '/images/placeholder.png'}
                                            alt={item.product?.title || 'Product'}
                                            fill
                                            className="object-cover"
                                        />
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/product/${item.productId}`}>
                                            <h3 className="font-bold text-foreground text-sm line-clamp-2 hover:text-sky-600 transition-colors pr-6">
                                                {item.product?.title}
                                            </h3>
                                        </Link>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {item.product?.netWeight} • {item.product?.serves || 'Serves 2'}
                                        </p>

                                        <div className="flex flex-wrap items-center justify-between mt-2 gap-y-2">
                                            {/* Price */}
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-bold text-foreground">₹{item.lineTotal / 100}</span>
                                                {item.product?.originalPrice && (
                                                    <span className="text-xs text-muted-foreground line-through">
                                                        ₹{(item.product.originalPrice * item.quantity) / 100}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => dispatch(decrementQuantity(item.productId))}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="font-bold text-foreground min-w-[24px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => !((item.product?.stock || item.productSnapshot?.stock) !== undefined && item.quantity >= (item.product?.stock ?? item.productSnapshot?.stock ?? 999)) && dispatch(incrementQuantity(item.productId))}
                                                    disabled={(item.product?.stock || item.productSnapshot?.stock) !== undefined && item.quantity >= (item.product?.stock ?? item.productSnapshot?.stock ?? 999)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => dispatch(removeFromCart(item.productId))}
                                        className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border sticky top-28">
                            <h2 className="font-bold text-lg text-foreground mb-4">Order Summary</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium text-foreground">₹{cartTotal}</span>
                                </div>
                                {cartSavings > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>You Save</span>
                                        <span className="font-medium">-₹{cartSavings}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Delivery</span>
                                    <span className="font-medium text-foreground">
                                        {deliveryFee === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `₹${deliveryFee}`
                                        )}
                                    </span>
                                </div>
                                {deliveryFee > 0 && (
                                    <p className="text-xs text-muted-foreground bg-slate-50 p-2 rounded-lg">
                                        Add {(DELIVERY_FREE_WEIGHT_THRESHOLD_KG - cartWeight).toFixed(1)}kg more for free delivery
                                    </p>
                                )}
                            </div>

                            <div className="border-t border-slate-100 mt-4 pt-4">
                                <div className="flex justify-between text-lg font-black">
                                    <span>Total</span>
                                    <span>₹{finalTotal}</span>
                                </div>
                            </div>

                            {isServiceable ? (
                                <Link href="/checkout" className="hidden lg:block mt-6">
                                    <Button size="lg" className="w-full h-14 rounded-full font-bold text-lg bg-slate-900 hover:bg-slate-800">
                                        Checkout <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            ) : (
                                <div className="hidden lg:block mt-6">
                                    <Button disabled size="lg" className="w-full h-14 rounded-full font-bold text-lg bg-slate-900/50 cursor-not-allowed">
                                        Location Unserviceable
                                    </Button>
                                    <p className="text-xs text-red-500 text-center mt-2 font-medium">
                                        We do not deliver to your selected location yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-card border-t border-border p-4 lg:hidden z-40">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-xl font-black text-foreground">₹{finalTotal}</p>
                    </div>
                    {isServiceable ? (
                        <Link href="/checkout">
                            <Button size="lg" className="rounded-full px-8 font-bold bg-slate-900 hover:bg-slate-800">
                                Checkout <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    ) : (
                        <Button disabled size="lg" className="rounded-full px-8 font-bold bg-slate-900/50 cursor-not-allowed">
                            Unserviceable
                        </Button>
                    )}
                </div>
                {!isServiceable && (
                    <p className="text-xs text-red-500 text-center -mt-2 mb-2 font-medium w-full">
                        We do not deliver here yet.
                    </p>
                )}
            </div>
        </div>
    );
}
