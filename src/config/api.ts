/**
 * API Configuration & Placeholder Functions
 * All API endpoints and mock implementations
 * TODO: BACKEND - Replace mock functions with real API calls
 */

export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    TIMEOUT: 10000,
} as const;

export const API_ENDPOINTS = {
    // Products
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id: string) => `/products/${id}`,
    PRODUCTS_BY_CATEGORY: (slug: string) => `/products/category/${slug}`,

    // Orders
    ORDERS: '/orders',
    ORDER_BY_ID: (id: string) => `/orders/${id}`,

    // User
    USER: '/user',
    USER_ADDRESSES: '/user/addresses',

    // Auth
    AUTH_VERIFY_PHONE: '/auth/verify-phone',
    AUTH_SEND_OTP: '/auth/send-otp',
} as const;

/**
 * API Response Types
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Mock API Functions
 * TODO: BACKEND - Replace with real fetch calls
 */
export const api = {
    /**
     * Get all products
     * TODO: BACKEND - GET /api/products
     */
    getProducts: async (): Promise<ApiResponse<unknown[]>> => {
        // MOCK: Using static data from seafoodData.ts
        return { success: true, data: [] };
    },

    /**
     * Get product by ID
     * TODO: BACKEND - GET /api/products/:id
     */
    getProductById: async (id: string): Promise<ApiResponse<unknown>> => {
        // MOCK: Using static data
        return { success: true, data: null };
    },

    /**
     * Create order
     * TODO: BACKEND - POST /api/orders
     */
    createOrder: async (orderData: unknown): Promise<ApiResponse<{ orderId: string }>> => {
        // MOCK: Using localStorage
        const orderId = `ORD_${Date.now()}`;
        return { success: true, data: { orderId } };
    },

    /**
     * Get user orders
     * TODO: BACKEND - GET /api/orders
     */
    getOrders: async (): Promise<ApiResponse<unknown[]>> => {
        // MOCK: Using localStorage
        return { success: true, data: [] };
    },

    /**
     * Verify phone number
     * TODO: BACKEND - POST /api/auth/verify-phone
     */
    verifyPhone: async (phone: string, otp: string): Promise<ApiResponse<boolean>> => {
        // MOCK: Always returns success after delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, data: true };
    },

    /**
     * Send OTP
     * TODO: BACKEND - POST /api/auth/send-otp
     */
    sendOtp: async (phone: string): Promise<ApiResponse<boolean>> => {
        // MOCK: Always returns success
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true, data: true };
    },
};
