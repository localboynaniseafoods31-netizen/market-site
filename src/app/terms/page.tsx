import type { Metadata } from 'next';
import { SITE_NAME } from '@/config';

export const metadata: Metadata = {
    title: `Terms of Service - ${SITE_NAME}`,
    description: 'Terms and Conditions for using Localboynaniseafoods website.',
    robots: 'noindex, follow'
};

export default function TermsPage() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">Last updated: December 31, 2025</p>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <h3>1. Agreement to Terms</h3>
                    <p>
                        By accessing our website and placing an order, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
                    </p>

                    <h3>2. Returns & Refunds</h3>
                    <p>
                        Due to the perishable nature of seafood, we have a specific return policy:
                    </p>
                    <ul>
                        <li>Complaints must be registered within 2 hours of delivery.</li>
                        <li>We guarantee freshness. If the product is spoiled, we will offer a full refund or free replacement.</li>
                        <li>We do not accept returns based on personal taste preference if the quality is standard.</li>
                    </ul>

                    <h3>3. Pricing & Availability</h3>
                    <p>
                        Prices for our products are subject to change without notice due to daily market rates. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice.
                    </p>

                    <h3>4. Delivery</h3>
                    <p>
                        Delivery times are estimates and may vary based on traffic and weather conditions. We strive to deliver within the promised time slot.
                    </p>
                </div>
            </div>
        </main>
    );
}
