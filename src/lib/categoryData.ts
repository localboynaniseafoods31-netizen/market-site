export interface Product {
    id: string;
    title: string;
    image: string;
    grossWeight: string;
    netWeight: string;
    price: number;
    originalPrice?: number;
    deliveryTime?: string;
    category: string;
    subcategory?: string;
    inStock?: boolean;
    offerPercentage?: number;
}

export interface CategoryBanner {
    image: string;
    title: string;
    subtitle: string;
    offerText?: string;
    ctaText?: string;
    backgroundColor?: string;
}

export interface Category {
    slug: string;
    name: string;
    icon: string;
    description: string;
    banner?: CategoryBanner;
    filters: string[];
    products: Product[];
}

// Mock product data
const MARINE_FISH_PRODUCTS: Product[] = [
    {
        id: "mf-1",
        title: "Premium Seer Fish / Vanjaram - Steaks",
        image: "/images/categories/marine_v3.png",
        grossWeight: "500g",
        netWeight: "450g",
        price: 720,
        originalPrice: 900,
        deliveryTime: "120 min",
        category: "marine-fish",
        subcategory: "Steaks",
        inStock: true,
        offerPercentage: 20
    },
    {
        id: "mf-2",
        title: "Black Pomfret - Whole Cleaned",
        image: "/images/categories/marine_v3.png",
        grossWeight: "500g",
        netWeight: "400g",
        price: 600,
        originalPrice: 650,
        deliveryTime: "120 min",
        category: "marine-fish",
        subcategory: "Whole Fish",
        inStock: true,
        offerPercentage: 8
    },
    {
        id: "mf-3",
        title: "King Fish / Surmai - Curry Cut",
        image: "/images/categories/marine_v3.png",
        grossWeight: "500g",
        netWeight: "450g",
        price: 550,
        deliveryTime: "120 min",
        category: "marine-fish",
        subcategory: "Curry Cut",
        inStock: true
    },
    {
        id: "mf-4",
        title: "Mackerel / Bangda - Whole",
        image: "/images/categories/marine_v3.png",
        grossWeight: "500g",
        netWeight: "480g",
        price: 280,
        originalPrice: 320,
        deliveryTime: "120 min",
        category: "marine-fish",
        subcategory: "Whole Fish",
        inStock: true,
        offerPercentage: 13
    }
];

const RIVER_FISH_PRODUCTS: Product[] = [
    {
        id: "rf-1",
        title: "Fresh Rohu - Medium Cuts",
        image: "/images/categories/river_v3.png",
        grossWeight: "1kg",
        netWeight: "900g",
        price: 280,
        originalPrice: 350,
        deliveryTime: "120 min",
        category: "river-fish",
        subcategory: "Curry Cut",
        inStock: true,
        offerPercentage: 20
    },
    {
        id: "rf-2",
        title: "Katla Fish - Steaks",
        image: "/images/categories/river_v3.png",
        grossWeight: "500g",
        netWeight: "450g",
        price: 280,
        deliveryTime: "120 min",
        category: "river-fish",
        subcategory: "Steaks",
        inStock: true
    },
    {
        id: "rf-3",
        title: "Bhetki / Barramundi - Boneless",
        image: "/images/categories/river_v3.png",
        grossWeight: "500g",
        netWeight: "400g",
        price: 450,
        originalPrice: 500,
        deliveryTime: "120 min",
        category: "river-fish",
        subcategory: "Boneless",
        inStock: true,
        offerPercentage: 10
    }
];

const PRAWNS_PRODUCTS: Product[] = [
    {
        id: "pr-1",
        title: "Fresh Tiger Prawns (Cleaned)",
        image: "/images/categories/prawns_v3.png",
        grossWeight: "500g",
        netWeight: "350g",
        price: 450,
        originalPrice: 550,
        deliveryTime: "120 min",
        category: "prawns",
        subcategory: "Cleaned",
        inStock: true,
        offerPercentage: 18
    },
    {
        id: "pr-2",
        title: "Jumbo Prawns - Headless",
        image: "/images/categories/prawns_v3.png",
        grossWeight: "500g",
        netWeight: "400g",
        price: 650,
        deliveryTime: "120 min",
        category: "prawns",
        subcategory: "Headless",
        inStock: true
    },
    {
        id: "pr-3",
        title: "Medium Prawns - Whole",
        image: "/images/categories/prawns_v3.png",
        grossWeight: "500g",
        netWeight: "450g",
        price: 380,
        originalPrice: 420,
        deliveryTime: "120 min",
        category: "prawns",
        subcategory: "Whole",
        inStock: true,
        offerPercentage: 10
    }
];

const CRABS_PRODUCTS: Product[] = [
    {
        id: "cr-1",
        title: "Premium Blue Crabs",
        image: "/images/categories/crabs_v3.png",
        grossWeight: "1kg",
        netWeight: "900g",
        price: 650,
        originalPrice: 800,
        deliveryTime: "120 min",
        category: "crabs",
        inStock: true,
        offerPercentage: 19
    },
    {
        id: "cr-2",
        title: "Mud Crabs - Large",
        image: "/images/categories/crabs_v3.png",
        grossWeight: "500g",
        netWeight: "450g",
        price: 550,
        deliveryTime: "120 min",
        category: "crabs",
        inStock: true
    }
];

const RTC_PRODUCTS: Product[] = [
    {
        id: "rtc-1",
        title: "Marinated Fish Fry Cuts",
        image: "/images/categories/rtc_v3.png",
        grossWeight: "250g",
        netWeight: "250g",
        price: 350,
        originalPrice: 420,
        deliveryTime: "120 min",
        category: "ready-to-cook",
        inStock: true,
        offerPercentage: 17
    },
    {
        id: "rtc-2",
        title: "Prawn Masala - Ready to Cook",
        image: "/images/categories/rtc_v3.png",
        grossWeight: "300g",
        netWeight: "300g",
        price: 420,
        deliveryTime: "120 min",
        category: "ready-to-cook",
        inStock: true
    }
];

// Category definitions
export const CATEGORIES: Category[] = [
    {
        slug: "marine-fish",
        name: "Marine Fish",
        icon: "/images/categories/marine_v3.png",
        description: "Fresh catch from the ocean",
        banner: {
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200",
            title: "Fresh Ocean Catch",
            subtitle: "Premium marine fish delivered fresh daily",
            offerText: "Up to 20% OFF",
            ctaText: "Shop Now",
            backgroundColor: "from-blue-500 to-cyan-500"
        },
        filters: ["All", "Whole Fish", "Steaks", "Curry Cut", "Boneless"],
        products: MARINE_FISH_PRODUCTS
    },
    {
        slug: "river-fish",
        name: "River Fish",
        icon: "/images/categories/river_v3.png",
        description: "Freshwater favorites",
        banner: {
            image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=1200",
            title: "Freshwater Delights",
            subtitle: "Farm-fresh river fish for your daily meals",
            offerText: "Special Combo Deals",
            ctaText: "Explore",
            backgroundColor: "from-teal-500 to-emerald-500"
        },
        filters: ["All", "Whole Fish", "Steaks", "Curry Cut", "Boneless"],
        products: RIVER_FISH_PRODUCTS
    },
    {
        slug: "prawns",
        name: "Prawns & Shrimp",
        icon: "/images/categories/prawns_v3.png",
        description: "Succulent prawns and shrimp",
        banner: {
            image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=1200",
            title: "Premium Prawns",
            subtitle: "Cleaned, deveined, and ready to cook",
            offerText: "18% OFF Today",
            ctaText: "Order Now",
            backgroundColor: "from-orange-500 to-red-500"
        },
        filters: ["All", "Cleaned", "Headless", "Whole", "Jumbo Size"],
        products: PRAWNS_PRODUCTS
    },
    {
        slug: "crabs",
        name: "Crabs & Lobster",
        icon: "/images/categories/crabs_v3.png",
        description: "Fresh crabs and lobster",
        filters: ["All", "Live", "Cleaned", "Meat Only"],
        products: CRABS_PRODUCTS
    },
    {
        slug: "ready-to-cook",
        name: "Ready to Cook",
        icon: "/images/categories/rtc_v3.png",
        description: "Marinated and ready to cook",
        banner: {
            image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523e?q=80&w=1200",
            title: "Ready in Minutes",
            subtitle: "Pre-marinated seafood for quick meals",
            offerText: "Save Time & Money",
            ctaText: "Browse",
            backgroundColor: "from-purple-500 to-pink-500"
        },
        filters: ["All", "Marinated", "Batter Fried", "Tandoori"],
        products: RTC_PRODUCTS
    }
];

// Helper functions
export function getCategoryBySlug(slug: string): Category | undefined {
    return CATEGORIES.find(cat => cat.slug === slug);
}

export function getProductsByCategory(slug: string, filter?: string): Product[] {
    const category = getCategoryBySlug(slug);
    if (!category) return [];

    if (!filter || filter === "All") {
        return category.products;
    }

    return category.products.filter(product => product.subcategory === filter);
}
