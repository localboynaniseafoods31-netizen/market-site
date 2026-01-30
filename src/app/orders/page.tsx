"use client";

import Link from "next/link";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useAppSelector, selectAllOrders, type Order } from "@/store";

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-foreground',
    preparing: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export default function OrdersPage() {
    const orders = useAppSelector(selectAllOrders);

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-24 md:pt-32">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="bg-card rounded-3xl p-8 md:p-16 text-center shadow-sm border border-border">
                        <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                            <Package className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h1 className="text-2xl font-black text-foreground mb-3">No orders yet</h1>
                        <p className="text-muted-foreground mb-8">
                            Once you place an order, it will appear here.
                        </p>
                        <Link href="/category">
                            <Button size="lg" className="rounded-full px-8 font-bold bg-slate-900 hover:bg-slate-800">
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 md:pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-2xl md:text-3xl font-black text-foreground mb-6">Your Orders</h1>

                <div className="space-y-4">
                    {orders.map((order: Order, index: number) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link href={`/orders/${order.id}`}>
                                <div className="bg-card rounded-2xl p-4 md:p-6 shadow-sm border border-border hover:border-slate-200 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                            <p className="font-bold text-foreground mt-1">
                                                Order #{order.id.slice(-8)}
                                            </p>
                                        </div>
                                        <Badge className={`${statusColors[order.status]} border-0 font-medium`}>
                                            {statusLabels[order.status]}
                                        </Badge>
                                    </div>

                                    <div className="text-sm text-muted-foreground mb-3">
                                        {order.items.length} item{order.items.length > 1 ? 's' : ''} • ₹{order.total}
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-border">
                                        <p className="text-xs text-muted-foreground truncate max-w-[60%]">
                                            {order.addressSnapshot}
                                        </p>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
