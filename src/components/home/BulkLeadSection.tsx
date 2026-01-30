"use client";

import { Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BulkLeadSection() {
    return (
        <section className="py-8 px-4">
            <div className="container mx-auto">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
                    {/* Background Decor */}
                    <Building2 className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 rotate-[-15deg]" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold tracking-wider">
                                B2B & INSTITUTIONAL SALES
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                                Running a Hotel or Catering Business?
                            </h2>
                            <p className="text-blue-100 max-w-md">
                                Get premium quality fish and prawns at wholesale rates. We fulfill orders across 10+ cities with guaranteed freshness.
                            </p>

                            <ul className="space-y-2 text-sm text-blue-100/90 hidden md:block">
                                <li className="flex items-center gap-2">✓ Custom Cuts & Cleaning</li>
                                <li className="flex items-center gap-2">✓ Scheduled Dawn Delivery</li>
                                <li className="flex items-center gap-2">✓ Net Weight Billing</li>
                            </ul>
                        </div>

                        <div className="bg-white/95 backdrop-blur-sm p-4 md:p-6 rounded-xl text-foreground shadow-lg">
                            <h3 className="font-bold mb-4 text-center">Request a Quote</h3>
                            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="name" className="text-xs">Business Name</Label>
                                        <Input id="name" placeholder="Ex: Taste of India" className="h-9" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="city" className="text-xs">City</Label>
                                        <Input id="city" placeholder="Bangalore" className="h-9" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                                    <Input id="phone" type="tel" placeholder="+91 98765 43210" className="h-9" />
                                </div>
                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-10 mt-2">
                                    Get Callback <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
