"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
    {
        question: "Is your seafood guaranteed fresh?",
        answer: "Yes! We source directly from coastal fishermen daily. Our cold chain technology ensures the fish remains at 0-4°C from the catch point to your doorstep, guaranteeing absolute freshness without any ammonia or harmful chemicals."
    },
    {
        question: "Do you deliver to my area?",
        answer: "We currently serve major metro areas including Bangalore, Hyderabad, and Chennai. Check your pincode at the top of the page to confirm delivery availability in your specific neighborhood."
    },
    {
        question: "What is your return policy?",
        answer: "We have a no-questions-asked fresh guarantee. If you are not satisfied with the freshness or quality of the product delivered, please contact us within 2 hours of delivery for a full refund or replacement."
    },
    {
        question: "Is the fish cleaned and cut?",
        answer: "Yes, we offer custom cleaning and cutting services. You can choose from Whole Cleaned, Curry Cut, Steaks, or Fillets depending on the fish type. All items are weighed BEFORE cleaning."
    },
    {
        question: "How long does delivery take?",
        answer: "We offer express delivery within 90-120 minutes for most locations. You can also schedule your delivery for a specific time slot that works for you."
    }
];

export default function FAQSection() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQS.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="bg-background py-16 md:py-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                        Frequently Asked <span className="text-primary">Questions</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Everything you need to know about our seafood and service.
                    </p>
                </div>

                <div className="bg-muted/30 rounded-2xl p-6 md:p-10 border border-border">
                    <Accordion type="single" collapsible className="w-full">
                        {FAQS.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b-slate-200 dark:border-slate-800">
                                <AccordionTrigger className="text-left text-lg font-bold hover:text-primary transition-colors py-5">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
