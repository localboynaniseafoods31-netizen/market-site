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
