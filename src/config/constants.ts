/**
 * Application Constants
 * Centralized configuration values
 */

// Delivery
export const DELIVERY_FREE_THRESHOLD = 500;
export const DELIVERY_FEE = 49;
export const DELIVERY_TIMES = [
    'Today 6AM - 8AM',
    'Today 10AM - 12PM',
    'Tomorrow 6AM - 8AM',
] as const;

// Cart
export const MAX_CART_QUANTITY = 10;
export const MIN_CART_QUANTITY = 1;

// Validation
export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const PINCODE_REGEX = /^\d{6}$/;
export const MIN_NAME_LENGTH = 2;
export const MIN_ADDRESS_LENGTH = 10;

// Storage Keys
export const STORAGE_KEYS = {
    CART: 'oceanfresh_cart',
    USER: 'oceanfresh_user',
    ORDERS: 'oceanfresh_orders',
    THEME: 'oceanfresh_theme',
} as const;

// Order Status
export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

// SEO
export const SITE_NAME = 'Localboynaniseafoods';
export const SITE_DESCRIPTION = 'Fresh fish and prawns delivered to your doorstep. Premium seafood, cleaned and ready to cook.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://localboynaniseafoods.com';
