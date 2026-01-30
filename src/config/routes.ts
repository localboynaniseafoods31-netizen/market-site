/**
 * Centralized Route Configuration
 * All application routes defined in one place
 */

export const ROUTES = {
    // Main Pages
    HOME: '/v2',

    // Category

    CATEGORY: '/category',
    CATEGORY_DETAIL: (slug: string) => `/category/${slug}` as const,
    CATEGORY_ALL: '/category/all',

    // Product
    PRODUCT: (id: string) => `/product/${id}` as const,

    // Cart & Checkout
    CART: '/cart',
    CHECKOUT: '/checkout',

    // Orders
    ORDERS: '/orders',
    ORDER_DETAIL: (id: string) => `/orders/${id}` as const,

    // Auth (placeholder for future)
    LOGIN: '/login',
    REGISTER: '/register',
} as const;

/**
 * Protected routes that require authentication
 * TODO: BACKEND - Implement proper auth check
 */
export const PROTECTED_ROUTES = [
    '/v2/checkout',
    '/v2/orders',
] as const;

/**
 * Check if a route is protected
 */
export function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}
