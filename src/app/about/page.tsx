import type { Metadata } from 'next';
import { SITE_NAME } from '@/config';
import Image from 'next/image';

export const metadata: Metadata = {
    title: `About Us - ${SITE_NAME}`,
    description: 'Learn about Ocean Fresh, our mission to deliver sustainable, chemical-free seafood directly from coast to your kitchen.',
    keywords: ['seafood delivery', 'about ocean fresh', 'sustainable fishing', 'fresh fish bangalore']
};

export default function AboutPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About Ocean Fresh",
        "description": "Our mission to deliver sustainable seafood.",
        "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "logo": {
                "@type": "ImageObject",
                "url": "https://oceanfresh.com/logo.png"
            }
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white">
                    Our Story
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-xl md:text-2xl font-light leading-relaxed text-muted-foreground mb-12">
                        Ocean Fresh was born from a simple desire: to bring the taste of the coast to the city, without compromising on freshness or quality.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mb-16 not-prose">
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl">
                            <h3 className="text-2xl font-bold mb-4 text-primary">Farm to Fork</h3>
                            <p className="text-muted-foreground">
                                We cut out the middlemen. Our network of local fishermen brings the catch directly to our cold chain facilities, ensuring zero chemical preservation.
                            </p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-3xl">
                            <h3 className="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">Sustainability First</h3>
                            <p className="text-muted-foreground">
                                We believe in responsible fishing. We support traditional fishing communities and adhere to seasonal fishing bans to let our oceans replenish.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-6">Our Promise</h2>
                    <ul className="space-y-4 list-none pl-0">
                        <li className="flex items-start gap-3">
                            <span className="text-primary font-bold">01.</span>
                            <span>No Ammonia or Formalin. 100% Chemical Free.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary font-bold">02.</span>
                            <span>Freshness Guarantee. If it's not fresh, it's free.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary font-bold">03.</span>
                            <span>Precision Cuts. Cleaned and cut by experts.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
