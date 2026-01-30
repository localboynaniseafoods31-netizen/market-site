import { notFound } from "next/navigation";
import CategorySidebar from "@/components/category/CategorySidebar";
import CategoryBanner from "@/components/category/CategoryBanner";
import CategoryFilters from "@/components/category/CategoryFilters";
import CategoryProductGrid from "@/components/category/CategoryProductGrid";
import BottomNav from "@/components/layout/BottomNav";
import prisma from "@/lib/prisma";
import type { Product } from "@/data/seafoodData";

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;

    // Fetch categories for sidebar with accurate stock counts
    const categoriesWithCounts = await prisma.category.findMany({
        include: {
            _count: {
                select: {
                    products: {
                        where: { inStock: true }
                    }
                }
            }
        },
        orderBy: { name: 'asc' }
    });

    const sidebarCategories = categoriesWithCounts
        .map(c => ({
            slug: c.slug,
            name: c.name,
            icon: c.icon,
            description: c.description,
            count: c._count.products
        }))
        .filter(c => c.count > 0);

    // Default state (server component doesn't have state, so filters handled differently or simplified for now)
    // For a complex filter UI in server components, we'd usually use searchParams. 
    // For this refactor, we'll fetch all products for the category and let the client-side grid (if smart) or just render all.
    // The previous code had client-side state for sorting/filtering. 
    // To keep it simple in Server Component, we pass all products and let client grid handle display/sort if possible,
    // or we just render them initially sorted.

    const isAll = slug === "all";
    const isDeals = slug === "deals";

    let categoryData;
    let productsData = [];

    if (isAll) {
        categoryData = {
            name: "All Products",
            description: "Explore our complete range of fresh seafood.",
            banner: undefined,
            filters: ["All"]
        };
        productsData = await prisma.product.findMany({
            include: { category: true },
            where: { inStock: true }
        });
    } else if (isDeals) {
        categoryData = {
            name: "Mega Deals",
            description: "Unbeatable offers on premium seafood.",
            banner: {
                image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=1200",
                title: "Flash Sale Live",
                subtitle: "Limited time offers on fresh catch",
                offerText: "Up to 30% OFF",
                ctaText: "Grab Now",
                backgroundColor: "from-rose-600 to-orange-600"
            },
            filters: ["All"]
        };
        // Fetch products with originalPrice > price
        productsData = await prisma.product.findMany({
            include: { category: true },
            where: {
                inStock: true,
                originalPrice: { gt: prisma.product.fields.price }
            }
        });
    } else {
        // Specific Category
        const dbCategory = await prisma.category.findUnique({
            where: { slug }
        });

        if (!dbCategory) {
            notFound();
        }

        categoryData = {
            name: dbCategory.name,
            description: dbCategory.description || "",
            banner: undefined, // Add banner support to DB if needed later
            filters: ["All", "Whole Fish", "Steaks", "Curry Cut"] // Placeholder filters or fetch distinct subcategories
        };

        productsData = await prisma.product.findMany({
            include: { category: true },
            where: {
                categoryId: dbCategory.id,
                inStock: true
            }
        });
    }

    // Transform Types
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
                        "name": categoryData.name,
                        "item": `https://oceanfresh.com/category/${slug}`
                    }
                ]
            },
            {
                "@type": "CollectionPage",
                "name": categoryData.name,
                "description": categoryData.description,
                "url": `https://oceanfresh.com/category/${slug}`,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": products.map((product, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "url": `https://oceanfresh.com/product/${product.id}`,
                        "name": product.title,
                        "image": product.image,
                        "offers": {
                            "@type": "Offer",
                            "price": product.price,
                            "priceCurrency": "INR"
                        }
                    }))
                }
            }
        ]
    };

    return (
        <main className="min-h-screen bg-background ocean-mesh">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Main Layout: Sidebar + Content */}
            <div className="flex">
                {/* Fixed Sidebar - Desktop Only */}
                <CategorySidebar categories={sidebarCategories} />

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 ml-16 md:ml-0">
                    <div className="container mx-auto px-4 pt-36 md:pt-24 pb-24 max-w-7xl">
                        {/* Category Title - Always Shown */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-black text-foreground">{categoryData.name}</h1>
                            <p className="text-muted-foreground mt-1">{categoryData.description}</p>
                        </div>

                        {/* Category Banner */}
                        {categoryData.banner && (
                            <CategoryBanner banner={categoryData.banner} />
                        )}

                        {/* Note: Filters removed from Server Component for simplicity, 
                            ideally this would be a client component or use query params */}

                        {/* Product Grid */}
                        <CategoryProductGrid products={products} />
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav />
        </main>
    );
}
