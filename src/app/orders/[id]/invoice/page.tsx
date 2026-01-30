import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

// Force dynamic rendering as it depends on route params and DB data
export const dynamic = 'force-dynamic';

interface InvoicePageProps {
    params: {
        id: string;
    };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
    const { id } = params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true
                }
            },
            user: true
        }
    });

    if (!order) {
        return notFound();
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <main className="min-h-screen bg-slate-50 py-10 px-4 print:bg-white print:p-0">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none">
                {/* Header */}
                <div className="bg-sky-600 p-8 text-white print:bg-white print:text-black print:border-b-2 print:border-sky-600">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold">INVOICE</h1>
                            <p className="mt-2 opacity-90">Ocean Fresh Seafoods</p>
                            <p className="text-sm opacity-80">Premium Quality Delivery</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-semibold">Order #{order.orderNumber}</h2>
                            <p className="mt-1 text-sm opacity-80">Date: {formatDate(order.createdAt)}</p>
                            <div className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.paymentStatus === 'PAID' ? 'bg-green-500 text-white print:text-green-600 print:border print:border-green-600' : 'bg-yellow-500 text-white'
                                }`}>
                                {order.paymentStatus || 'PENDING'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8">
                    {/* Customer & Shipping Info */}
                    <div className="mb-8 p-6 bg-slate-50 rounded-lg print:bg-transparent print:border print:p-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Bill To</h3>
                        <div className="text-slate-800">
                            <p className="font-bold text-lg">{order.deliveryName || order.user?.name || 'Customer'}</p>
                            <p>{order.deliveryAddress}</p>
                            <p>{order.deliveryCity} - {order.deliveryPincode}</p>
                            <p className="mt-2 text-slate-600 flex items-center gap-2">
                                <span>📞 {order.deliveryPhone || order.user?.phone}</span>
                            </p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <table className="w-full mb-8 text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-200 text-slate-500 text-sm uppercase">
                                <th className="py-3">Item</th>
                                <th className="py-3 text-center">Qty</th>
                                <th className="py-3 text-right">Price</th>
                                <th className="py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {order.items.map((item) => (
                                <tr key={item.id} className="border-b border-slate-100">
                                    <td className="py-4">
                                        <div className="font-medium text-slate-900">{item.product.name}</div>
                                        <div className="text-xs text-slate-500">{item.quantity > 1 ? `${item.product.netWeight} x ${item.quantity}` : item.product.netWeight}</div>
                                    </td>
                                    <td className="py-4 text-center">{item.quantity}</td>
                                    <td className="py-4 text-right">₹{(item.priceAtTime / 100).toFixed(2)}</td>
                                    <td className="py-4 text-right font-medium">₹{((item.priceAtTime * item.quantity) / 100).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Summary */}
                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-3">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>₹{(order.subtotal / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Delivery Fee</span>
                                <span>{order.deliveryFee === 0 ? 'Free' : `₹${(order.deliveryFee / 100).toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-slate-900 pt-4 border-t-2 border-slate-200">
                                <span>Total</span>
                                <span>₹{(order.total / 100).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-8 text-center text-slate-500 text-sm print:bg-white print:mt-8">
                    <p>Thank you for choosing Ocean Fresh!</p>
                    <p className="mt-1">For support, contact us at support@oceanfresh.com or +91 99999 88888</p>
                </div>
            </div>
        </main>
    );
}
