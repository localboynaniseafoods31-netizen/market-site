"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const reviews = [
    {
        id: 1,
        name: "Arjun Mehta",
        location: "Bangalore",
        text: "The quality of the Seer fish was exceptional. Arrived perfectly chilled and cleaned. Definitely my new go-to for seafood!",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun"
    },
    {
        id: 2,
        name: "Priya Sharma",
        location: "HSR Layout",
        text: "Ordered tiger prawns for a party. They were huge and so fresh. The delivery was right on time. Highly recommended!",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
    },
    {
        id: 3,
        name: "Vikram Singh",
        location: "Indiranagar",
        text: "Finally found a place that delivers river fish that doesn't smell. The Rohu was very fresh and the curry came out great.",
        rating: 4,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram"
    }
];

export default function TestimonialsSection() {
    return (
        <section className="bg-gradient-to-b from-background via-muted/20 to-muted/40 py-20 relative">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-foreground">What Our Chefs Say</h2>
                    <p className="text-muted-foreground text-lg">Join 10,000+ happy customers who trust Ocean Fresh for their daily catch.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-card p-8 rounded-3xl shadow-sm border border-border relative group hover:shadow-xl transition-shadow"
                        >
                            <Quote className="absolute top-6 right-8 text-muted group-hover:text-primary/10 transition-colors" size={48} />

                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}
                                    />
                                ))}
                            </div>

                            <p className="text-muted-foreground leading-relaxed mb-8 italic">"{review.text}"</p>

                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                                    <Image src={review.avatar} alt={review.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">{review.name}</h4>
                                    <p className="text-sm text-muted-foreground">{review.location}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
