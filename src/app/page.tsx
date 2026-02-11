import type { Metadata } from 'next';
import HeroSection from "@/components/home/HeroSection";
import { CategoryRail } from "@/components/product/CategoryRail";
import { HighlightSection } from "@/components/home/HighlightSection";
import ProductGrid from "@/components/home/ProductGrid";
import DiscountBanner from "@/components/home/DiscountBanner";
import BottomNav from "@/components/layout/BottomNav";
import BulkOrderSection from "@/components/home/BulkOrderSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/layout/Footer";
import { SITE_NAME, SITE_DESCRIPTION } from '@/config';

export const metadata: Metadata = {
    title: `${SITE_NAME} - Premium Seafood Delivery`,
    description: SITE_DESCRIPTION,
    openGraph: {
        title: `${SITE_NAME} - Premium Seafood Delivery`,
        description: SITE_DESCRIPTION,
        type: 'website',
    },
};

import prisma from "@/lib/prisma";
import type { Product } from "@/data/seafoodData";

export default async function V2Page() {

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "name": SITE_NAME,
                "url": "https://localboynaniseafoods.com",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://localboynaniseafoods.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "Organization",
                "name": SITE_NAME,
                "url": "https://localboynaniseafoods.com",
                "logo": "https://localboynaniseafoods.com/logo.jpeg",
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-9876543210",
                    "contactType": "customer service"
                }
            }
        ]
    };

    // Fetch Data
    const categoriesData = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { products: { where: { inStock: true } } }
            }
        }
    });

    const productsData = await prisma.product.findMany({
        include: { category: true },
        where: { inStock: true } // Only show in-stock products on home
    });

    // Transform Data
    const categories = categoriesData
        .filter(c => c._count.products > 0)
        .map(c => ({
            id: c.id,
            name: c.name,
            image: c.icon || '/images/placeholder.png', // Fallback
            slug: c.slug
        }));

    const products: Product[] = productsData.map(p => ({
        id: p.id,
        title: p.name,
        image: p.image,
        images: p.images,
        grossWeight: p.grossWeight,
        netWeight: p.netWeight,
        price: p.price,
        originalPrice: p.originalPrice || undefined,
        deliveryTime: p.deliveryTime || "120 min",
        category: p.category.slug,
        subcategory: p.cutType || undefined, // Map cutType to subcategory
        inStock: p.inStock,
        offerPercentage: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
        description: p.description || undefined,
        pieces: p.pieces || undefined,
        serves: p.serves || undefined,
        sourcing: p.sourcing || undefined,
        cutType: p.cutType || undefined,
        texture: p.texture || undefined,
        stock: p.stock,
    }));

    // Filter Deals
    const deals = products.filter(p => (p.offerPercentage || 0) > 0);

    // Fetch CrazyDeals for banners
    const crazyDealsData = await prisma.crazyDeal.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' }
    });

    const banners = crazyDealsData.map(d => ({
        id: d.id,
        title: d.title,
        subtitle: d.subtitle,
        description: d.description,
        bgColor: d.bgColor,
        image: d.imageUrl,
        code: d.promoCode,
        link: d.linkUrl
    }));

    return (
        <main className="min-h-screen bg-background ocean-mesh">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Dynamic Hero Section */}
            <HeroSection />

            {/* Promotional Space */}
            <DiscountBanner deals={deals} banners={banners} />

            {/* Shop Experience Sections */}
            <div className="space-y-12 pb-20">

                {/* Visual Category Rail */}
                <CategoryRail categories={categories} />

                {/* Hot & Trending Deals */}
                <HighlightSection products={products} />

                {/* Bulk & Festival Section (New) */}
                <BulkOrderSection />

                {/* Full Explorer with Tabs */}
                <section className="container mx-auto px-4 bg-muted/30 py-16 rounded-[3rem]">
                    <div className="max-w-7xl mx-auto">
                        <ProductGrid title="Explore Our Full Menu" items={products} categories={categories} />
                    </div>
                </section>

                {/* Trust & Social Proof (New) */}
                <TestimonialsSection />

                {/* FAQ Section (New) */}
                <FAQSection />
            </div>

            {/* Global Footer (New) */}
            <Footer />

            {/* Mobile-Only Navigation Tab Bar */}
            <BottomNav />
        </main>
    );
}
