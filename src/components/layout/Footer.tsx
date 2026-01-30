"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & App */}
                    <div className="space-y-6">
                        <div className="text-2xl font-black text-blue-600">Ocean Fresh</div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Premium seafood delivered fresh from the ocean to your doorstep in 120 minutes. Chemical-free and expertly cleaned.
                        </p>
                        <div className="space-y-3">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Experience Our App</h4>
                            <div className="flex gap-3">
                                <div className="h-10 w-32 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] cursor-pointer hover:bg-slate-800 transition-colors">
                                    Google Play
                                </div>
                                <div className="h-10 w-32 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] cursor-pointer hover:bg-slate-800 transition-colors">
                                    App Store
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6 uppercase text-sm tracking-widest">Useful Links</h4>
                        <ul className="space-y-4">
                            {[
                                { name: "About Us", href: "/about" },
                                { name: "Contact Us", href: "/contact" },
                                { name: "Sustainability", href: "/about" },
                                { name: "Blog", href: "#" },
                                { name: "Sitemap", href: "/sitemap.xml" },
                                { name: "Staff Login", href: "/login" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-blue-600 text-sm transition-colors">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support & Policies */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6 uppercase text-sm tracking-widest">Support</h4>
                        <ul className="space-y-4">
                            {[
                                { name: "FAQ", href: "/#faq" },
                                { name: "Privacy Policy", href: "/privacy" },
                                { name: "Terms & Conditions", href: "/terms" },
                                { name: "Shipping Policy", href: "/shipping" },
                                { name: "Refund Policy", href: "/terms" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-blue-600 text-sm transition-colors">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6 uppercase text-sm tracking-widest">Keep In Touch</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-muted-foreground text-sm">
                                <Phone size={18} className="text-blue-600" />
                                <span>1800-OCEAN-FRESH</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground text-sm">
                                <Mail size={18} className="text-blue-600" />
                                <span>hello@oceanfresh.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground text-sm">
                                <MapPin size={18} className="text-blue-600" />
                                <span>Bangalore, Karnataka, India</span>
                            </div>

                            <div className="pt-4">
                                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">Follow Us</h4>
                                <div className="flex gap-4">
                                    {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                                        <Link key={idx} href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-blue-600 hover:text-white transition-all">
                                            <Icon size={16} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cities Served (Mock) */}
                <div className="py-8 border-t border-border">
                    <h4 className="text-xs font-bold text-foreground uppercase mb-4 tracking-widest">Cities We Serve</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {["Bangalore", "Hyderabad", "Chennai", "Mumbai", "Pune", "Delhi", "Gurgaon", "Noida", "Kolkata"].map((city) => (
                            <span key={city} className="text-muted-foreground text-xs hover:text-muted-foreground cursor-pointer">{city}</span>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-muted-foreground text-xs text-center md:text-left">
                        © 2024 Ocean Fresh Seafood Pvt Ltd. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-6 w-10 bg-muted rounded opacity-50" />
                        <div className="h-6 w-10 bg-muted rounded opacity-50" />
                        <div className="h-6 w-10 bg-muted rounded opacity-50" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
