import type { Metadata } from 'next';
import { SITE_NAME } from '@/config';
import { Truck, Clock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: `Shipping Policy - ${SITE_NAME}`,
    description: 'Delivery areas, times, and shipping fees for Localboynaniseafoods.',
};

export default function ShippingPage() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">Shipping Policy</h1>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl">
                        <Truck className="w-8 h-8 text-primary mb-4" />
                        <h3 className="font-bold text-lg mb-2">Express Delivery</h3>
                        <p className="text-muted-foreground text-sm">90-120 minutes delivery for instant orders in available locations.</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl">
                        <Clock className="w-8 h-8 text-primary mb-4" />
                        <h3 className="font-bold text-lg mb-2">Scheduled Slots</h3>
                        <p className="text-muted-foreground text-sm">Choose your preferred morning or evening delivery slot for pre-orders.</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl">
                        <MapPin className="w-8 h-8 text-primary mb-4" />
                        <h3 className="font-bold text-lg mb-2">Service Areas</h3>
                        <p className="text-muted-foreground text-sm">Typically 10-15km radius from our nearest distribution hub.</p>
                    </div>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <h3>Delivery Fee</h3>
                    <p>
                        <strong>Free Delivery:</strong> On all orders above ₹499.
                    </p>
                    <p>
                        <strong>Standard Charge:</strong> A nominal fee of ₹40 applies for orders below ₹499 to cover efficient logistics and cold-chain maintenance.
                    </p>

                    <h3>Delivery Timings</h3>
                    <ul>
                        <li><strong>Morning Slot:</strong> 7:00 AM - 11:00 AM</li>
                        <li><strong>Evening Slot:</strong> 4:00 PM - 8:00 PM</li>
                    </ul>

                    <h3>Packaging</h3>
                    <p>
                        All orders are vacuum sealed and packed in insulated boxes with ice gel packs to ensure temperature control until it reaches you.
                    </p>
                </div>
            </div>
        </main>
    );
}
