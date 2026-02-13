'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    customer: { phone: string; name: string | null };
    itemCount: number;
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    PROCESSING: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    SHIPPED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const escapeHtml = (input: unknown): string =>
    String(input ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchOrders = () => {
        setLoading(true);
        const url = statusFilter
            ? `/api/admin/orders?status=${statusFilter}`
            : '/api/admin/orders';
        fetch(url)
            .then((res) => res.json())
            .then((res) => {
                if (res.success) setOrders(res.data.orders);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const updateStatus = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        const res = await fetch(`/api/admin/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
            setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
        }
        setUpdatingId(null);
    };

    const downloadInvoice = async (orderId: string, orderNumber: string) => {
        const res = await fetch(`/api/admin/orders/${orderId}/invoice`);
        const data = await res.json();
        if (data.success) {
            // Open invoice data in new tab (in real app, use jsPDF to generate PDF)
            const invoiceWindow = window.open('', '_blank');
            if (invoiceWindow) {
                invoiceWindow.document.write(`
          <html>
          <head><title>Invoice ${escapeHtml(data.data.invoiceNumber)}</title></head>
          <body style="font-family: sans-serif; padding: 20px;">
            <h1>Invoice: ${escapeHtml(data.data.invoiceNumber)}</h1>
            <p>Order: ${escapeHtml(data.data.orderNumber)}</p>
            <p>Date: ${new Date(data.data.orderDate).toLocaleDateString()}</p>
            <hr/>
            <h3>Customer</h3>
            <p>${escapeHtml(data.data.customer.name)}<br/>${escapeHtml(data.data.customer.phone)}<br/>${escapeHtml(data.data.customer.address)}, ${escapeHtml(data.data.customer.city)} - ${escapeHtml(data.data.customer.pincode)}</p>
            <hr/>
            <h3>Items</h3>
            <table style="width:100%; border-collapse: collapse;">
              <tr style="background:#f0f0f0;">
                <th style="padding:8px; text-align:left;">Item</th>
                <th style="padding:8px;">Qty</th>
                <th style="padding:8px;">Rate</th>
                <th style="padding:8px;">Amount</th>
              </tr>
              ${data.data.items.map((item: { name: string; quantity: number; rate: number; amount: number }) => `
                <tr>
                  <td style="padding:8px;">${escapeHtml(item.name)}</td>
                  <td style="padding:8px; text-align:center;">${escapeHtml(item.quantity)}</td>
                  <td style="padding:8px; text-align:right;">₹${escapeHtml(item.rate)}</td>
                  <td style="padding:8px; text-align:right;">₹${escapeHtml(item.amount)}</td>
                </tr>
              `).join('')}
            </table>
            <hr/>
            <p><strong>Subtotal:</strong> ₹${data.data.subtotal}</p>
            <p><strong>Delivery:</strong> ₹${data.data.deliveryFee}</p>
            <p style="font-size:1.2em;"><strong>Total: ₹${data.data.total}</strong></p>
          </body>
          </html>
        `);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Orders</h1>
                    <p className="text-muted-foreground">{orders.length} orders</p>
                </div>
                <select
                    className="h-10 px-4 border rounded-md bg-background"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id} className="p-4 w-full overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="w-full md:w-auto">
                                <p className="font-bold truncate">{order.orderNumber}</p>
                                <p className="text-sm text-muted-foreground break-words">
                                    {order.customer.name || order.customer.phone} • {order.itemCount} items
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <p className="font-bold text-lg">₹{order.total}</p>
                                <select
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]} max-w-[120px]`}
                                    value={order.status}
                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                    disabled={updatingId === order.id}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="PROCESSING">Process</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancel</option>
                                </select>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadInvoice(order.id, order.orderNumber)}
                                >
                                    <FileText size={16} className="mr-1" />
                                    Invoice
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {
                orders.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No orders found</p>
                    </div>
                )
            }
        </div >
    );
}
