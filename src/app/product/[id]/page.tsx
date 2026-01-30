import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductGrid from "@/components/home/ProductGrid";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";
import type { Product } from "@/data/seafoodData";
// Client component wrapper for tabs? No, we can keep simple tabs client side or just render all since it is text.
// Or we can use a client component for the tabs part.
// Let's make the Page async server component, and extract the interactive part (Tabs) to a client component if needed.
// Actually, `ProductInfo` is likely client side (addToCart), but `ProductPage` can be Server.
// Wait, `activeTab` state was here. I need to move the Tab logic to a new Client Component `ProductTabs`.

import ProductTabs from "@/components/product/ProductTabs"; // I will create this next

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;

    const dbProduct = await prisma.product.findUnique({
        where: { id },
        include: { category: true }
    });

    if (!dbProduct) {
        notFound();
    }

    // Transform to frontend type
    const product: Product = {
        id: dbProduct.id,
        title: dbProduct.name,
        image: dbProduct.image,
        images: dbProduct.images,
        grossWeight: dbProduct.grossWeight,
        netWeight: dbProduct.netWeight,
        price: dbProduct.price,
        originalPrice: dbProduct.originalPrice || undefined,
        deliveryTime: dbProduct.deliveryTime || "120 min",
        category: dbProduct.category.slug,
        subcategory: dbProduct.cutType || undefined,
        inStock: dbProduct.inStock,
        offerPercentage: dbProduct.originalPrice ? Math.round(((dbProduct.originalPrice - dbProduct.price) / dbProduct.originalPrice) * 100) : 0,
        description: dbProduct.description || undefined,
        pieces: dbProduct.pieces || undefined,
        serves: dbProduct.serves || undefined,
        sourcing: dbProduct.sourcing || undefined,
        cutType: dbProduct.cutType || undefined,
        texture: dbProduct.texture || undefined,
    };

    // Fetch related products
    const relatedDbProducts = await prisma.product.findMany({
        where: {
            categoryId: dbProduct.categoryId,
            id: { not: dbProduct.id },
            inStock: true
        },
        include: { category: true },
        take: 4
    });

    const relatedProducts: Product[] = relatedDbProducts.map(p => ({
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
        subcategory: p.cutType || undefined,
        inStock: p.inStock,
        offerPercentage: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
        description: p.description || undefined,
        pieces: p.pieces || undefined,
        serves: p.serves || undefined,
        sourcing: p.sourcing || undefined,
        cutType: p.cutType || undefined,
        texture: p.texture || undefined,
    }));

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://oceanfresh.com"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": product.category.replace("-", " "),
                        "item": `https://oceanfresh.com/category/${product.category}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": product.title,
                        "item": `https://oceanfresh.com/product/${product.id}`
                    }
                ]
            },
            {
                "@type": "Product",
                "name": product.title,
                "description": product.description || `Fresh ${product.title} delivered to your doorstep.`,
                "image": product.image,
                "sku": product.id,
                "offers": {
                    "@type": "Offer",
                    "price": product.price,
                    "priceCurrency": "INR",
                    "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                    "url": `https://oceanfresh.com/product/${product.id}`
                }
            }
        ]
    };

    return (
        <main className="min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container mx-auto px-4 pt-28 md:pt-32 pb-24 md:pb-12 max-w-7xl">
                {/* Breadcrumb / Back Navigation */}
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-8">
                    <Link href={`/category/${product.category}`} className="hover:text-primary flex items-center transition-colors">
                        <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Back
                    </Link>
                    <ChevronRight className="w-2.5 h-2.5 md:w-3 md:h-3 text-muted-foreground/50" />
                    <span className="capitalize">{product.category.replace("-", " ")}</span>
                    <ChevronRight className="w-2.5 h-2.5 md:w-3 md:h-3 text-muted-foreground/50 hidden md:block" />
                    <span className="text-foreground font-medium truncate max-w-[120px] md:max-w-[200px] hidden md:block">{product.title}</span>
                </div>

                {/* Product Hero Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20">
                    <ProductGallery
                        images={product.images || [product.image]}
                        title={product.title}
                    />
                    <ProductInfo product={product} />
                </div>

                {/* Product Details Tabs (Description, Sourcing, Recipes) */}
                <ProductTabs product={product} />

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-border pt-16">
                        <ProductGrid title="You May Also Like" items={relatedProducts} />
                    </div>
                )}
            </div>

            <BottomNav />
            <Footer />
        </main>
    );
}
