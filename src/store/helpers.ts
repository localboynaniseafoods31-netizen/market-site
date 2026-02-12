import { Product, getAllProducts } from '@/data/seafoodData';

/**
 * Get a product by its ID
 * Single source of truth for product data including price
 */
export function getProductById(productId: string): Product | undefined {
    return getAllProducts().find(p => p.id === productId);
}

/**
 * Calculate total for cart items using source prices
 * Prices are NEVER stored in cart - always computed from source
 */
export function calculateCartTotal(items: { productId: string; quantity: number }[]): number {
    return items.reduce((sum, item) => {
        const product = getProductById(item.productId);
        if (!product) return sum;
        return sum + product.price * item.quantity;
    }, 0);
}

/**
 * Calculate savings (originalPrice - price) for cart
 */
export function calculateCartSavings(items: { productId: string; quantity: number }[]): number {
    return items.reduce((sum, item) => {
        const product = getProductById(item.productId);
        if (!product || !product.originalPrice) return sum;
        return sum + (product.originalPrice - product.price) * item.quantity;
    }, 0);
}

/**
 * Parse weight string to kilograms
 * e.g., "500g" -> 0.5, "1kg" -> 1, "250gm" -> 0.25
 */
export function parseWeight(weightStr: string): number {
    const lower = weightStr.toLowerCase().replace(/\s/g, '');
    const value = parseFloat(lower);

    if (isNaN(value)) return 0;

    if (lower.includes('kg')) {
        return value;
    } else if (lower.includes('g')) { // Matches 'g', 'gm', 'gms'
        return value / 1000;
    }

    return 0; // Fallback
}
