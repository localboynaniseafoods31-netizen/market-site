import type { Metadata } from 'next';
import { SITE_NAME } from '@/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone } from 'lucide-react';

export const metadata: Metadata = {
    title: `Contact Us - ${SITE_NAME}`,
    description: 'Get in touch with Localboynaniseafoods for orders, support, or bulk inquiries.',
    keywords: ['contact localboynaniseafoods', 'customer support', 'seafood bulk order']
};

export default function ContactPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "description": "Contact Localboynaniseafoods support team",
        "mainEntity": {
            "@type": "Organization",
            "name": SITE_NAME,
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9912163082",
                "contactType": "customer service",
                "email": "hello@localboynaniseafoods.com"
            }
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-muted-foreground mb-12">
                            Have a question about your order or want to partner with us for bulk supply? We'd love to hear from you.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Phone Support</h3>
                                    <p className="text-muted-foreground">+91 99121 63082</p>
                                    <p className="text-sm text-slate-400">Mon-Sun, 8am - 8pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Email Us</h3>
                                    <p className="text-muted-foreground">hello@localboynaniseafoods.com</p>
                                    <p className="text-sm text-slate-400">Response within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Headquarters</h3>
                                    <p className="text-muted-foreground">
                                        123, Sea View Road, Indiranagar,<br />
                                        Bangalore, Karnataka - 560038
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <Input placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input type="email" placeholder="john@example.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subject</label>
                                <Input placeholder="Order Inquiry" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <Textarea className="min-h-[150px]" placeholder="How can we help you?" />
                            </div>

                            <Button className="w-full text-lg h-12 font-bold" size="lg">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
