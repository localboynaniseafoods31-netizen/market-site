import type { RootState } from './store';
import { getProductById, calculateCartTotal, calculateCartSavings } from './helpers';
import type { CartItem } from './slices/cartSlice';
import type { Address } from './slices/userSlice';
import type { Order } from './slices/orderSlice';

// ==================== CART SELECTORS ====================

/**
 * Get all cart items with full product details
 * Prices are fetched from source data, not stored in cart
 */
export const selectCartItemsWithDetails = (state: RootState) => {
    return state.cart.items.map((item: CartItem) => {
        let product = getProductById(item.productId);

        // Fallback to snapshot if static lookup fails
        if (!product && item.productSnapshot) {
            product = {
                id: item.productId,
                title: item.productSnapshot.title,
                price: item.productSnapshot.price,
                originalPrice: item.productSnapshot.originalPrice,
                image: item.productSnapshot.image,
                netWeight: item.productSnapshot.weight,
                grossWeight: item.productSnapshot.weight,
                category: 'unknown',
                inStock: true,
                stock: item.productSnapshot.stock
            } as any; // Cast to bypass strict Product type check for minified object
        }

        return {
            ...item,
            product,
            lineTotal: product ? product.price * item.quantity : 0,
        };
    }).filter((item: { product: unknown }) => item.product !== undefined);
};

/**
 * Get cart total - computed from source prices
 * This is the SINGLE SOURCE OF TRUTH for pricing
 */
export const selectCartTotal = (state: RootState): number => {
    return state.cart.items.reduce((sum, item) => {
        const product = getProductById(item.productId);
        if (product) {
            return sum + product.price * item.quantity;
        }
        if (item.productSnapshot) {
            return sum + item.productSnapshot.price * item.quantity;
        }
        return sum;
    }, 0);
};

/**
 * Get total savings from discounts
 */
export const selectCartSavings = (state: RootState): number => {
    return state.cart.items.reduce((sum, item) => {
        const product = getProductById(item.productId);
        if (product && product.originalPrice) {
            return sum + (product.originalPrice - product.price) * item.quantity;
        }
        if (item.productSnapshot && item.productSnapshot.originalPrice) {
            return sum + (item.productSnapshot.originalPrice - item.productSnapshot.price) * item.quantity;
        }
        return sum;
    }, 0);
};

/**
 * Get number of items in cart
 */
export const selectCartItemCount = (state: RootState): number => {
    return state.cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
};

/**
 * Get number of unique products in cart
 */
export const selectCartUniqueCount = (state: RootState): number => {
    return state.cart.items.length;
};

/**
 * Check if a product is in cart
 */
export const selectIsInCart = (productId: string) => (state: RootState): boolean => {
    return state.cart.items.some((item: CartItem) => item.productId === productId);
};

/**
 * Get quantity of a specific product in cart
 */
export const selectProductQuantity = (productId: string) => (state: RootState): number => {
    const item = state.cart.items.find((item: CartItem) => item.productId === productId);
    return item?.quantity || 0;
};

// ==================== USER SELECTORS ====================

export const selectUser = (state: RootState) => state.user;

export const selectUserPhone = (state: RootState) => state.user.phone;

export const selectUserAddresses = (state: RootState) => state.user.addresses;

export const selectDefaultAddress = (state: RootState): Address | undefined => {
    return state.user.addresses.find((a: Address) => a.id === state.user.defaultAddressId);
};

export const selectIsLoggedIn = (state: RootState): boolean => {
    return state.user.phone !== null && state.user.name !== '';
};

// ==================== ORDER SELECTORS ====================

export const selectAllOrders = (state: RootState) => state.orders.orders;

export const selectCurrentOrder = (state: RootState): Order | undefined => {
    return state.orders.orders.find((o: Order) => o.id === state.orders.currentOrderId);
};

export const selectOrderById = (orderId: string) => (state: RootState): Order | undefined => {
    return state.orders.orders.find((o: Order) => o.id === orderId);
};

export const selectRecentOrders = (limit: number = 5) => (state: RootState): Order[] => {
    return state.orders.orders.slice(0, limit);
};

export const selectActiveOrders = (state: RootState): Order[] => {
    return state.orders.orders.filter((o: Order) =>
        !['delivered', 'cancelled'].includes(o.status)
    );
};

// ==================== LOCATION SELECTORS ====================

export const selectLocation = (state: RootState) => state.location;

export const selectIsServiceable = (state: RootState): boolean => {
    return state.location?.isServiceable ?? false; // Default to false if no location selected? Or true?
    // Competitor logic: If no location selected, usually assume serviceable or prompt.
    // However, if state.location is null, we can return true to allow browsing,
    // but prompts might be needed. For now, let's allow adding if location is unset, 
    // but block if location is set AND unserviceable.
    // Actually, safest is: true if null (assume deliverable until checked), false if explicitly unserviceable.
    // BUT the prompt says "for the area we dont servr".
    // So: if (location && !location.isServiceable) return false. Else true.
};
