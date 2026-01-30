"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Phone, User, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useAppSelector, selectOrderById } from "@/store";
import { getProductById } from "@/store/helpers";

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

const statusSteps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params?.id as string;
    const order = useAppSelector(selectOrderById(orderId));

    if (!order) {
        return (
            <div className="min-h-screen bg-background pt-24 md:pt-32">
                <div className="container mx-auto px-4 max-w-2xl text-center">
                    <h1 className="text-2xl font-bold mb-4">Order not found</h1>
                    <Link href="/orders">
                        <Button>View All Orders</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const currentStepIndex = statusSteps.indexOf(order.status);

    return (
        <div className="min-h-screen bg-background pt-24 md:pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Back */}
                <Link href="/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> All Orders
                </Link>

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-black text-foreground">Order #{order.id.slice(-8)}</h1>
                        <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                    <Badge className={`${statusColors[order.status]} border-0 font-medium text-sm px-3 py-1`}>
                        {statusLabels[order.status]}
                    </Badge>
                </div>

                {/* Status Timeline */}
                {order.status !== 'cancelled' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-4"
                    >
                        <h2 className="font-bold text-foreground mb-4">Order Status</h2>
                        <div className="flex items-center justify-between relative">
                            {/* Progress Bar */}
                            <div className="absolute top-4 left-4 right-4 h-1 bg-muted rounded">
                                <div
                                    className="h-full bg-green-500 rounded transition-all duration-500"
                                    style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                                />
                            </div>

                            {statusSteps.map((step, index) => (
                                <div key={step} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStepIndex
                                        ? 'bg-green-500 text-white'
                                        : 'bg-slate-200 text-muted-foreground'
                                        }`}>
                                        {index < currentStepIndex ? (
                                            <CheckCircle2 className="w-4 h-4" />
                                        ) : (
                                            <span className="text-xs font-bold">{index + 1}</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-2 text-center max-w-[60px]">
                                        {statusLabels[step]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Order Items */}
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-4">
                    <h2 className="font-bold text-foreground mb-4">Items ({order.items.length})</h2>
                    <div className="space-y-4">
                        {order.items.map((item: any) => {
                            const product = getProductById(item.productId);
                            return (
                                <div key={item.productId} className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                                        <Package className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground truncate">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ₹{item.priceAtOrder}</p>
                                    </div>
                                    <p className="font-bold text-foreground">₹{item.priceAtOrder * item.quantity}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹{order.subtotal}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-₹{order.discount}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Delivery</span>
                            <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black pt-2 border-t border-border">
                            <span>Total</span>
                            <span>₹{order.total}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Details */}
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                    <h2 className="font-bold text-foreground mb-4">Delivery Details</h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <p className="text-foreground">{order.name}</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <p className="text-foreground">{order.phone}</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <p className="text-muted-foreground">{order.addressSnapshot}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link href="/orders">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                            <ArrowLeft className="w-6 h-6 text-foreground" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
