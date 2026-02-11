import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Cart item stores ONLY productId and quantity
// Price is NEVER stored - always fetched from source data
export interface CartItem {
    productId: string;
    quantity: number;
    // Snapshot of product details for items not in static data
    productSnapshot?: {
        title: string;
        price: number;
        originalPrice?: number;
        image: string;
        weight: string;
        stock?: number;
    };
}

interface CartState {
    items: CartItem[];
    // Note: total is computed via selector, not stored
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ productId: string; quantity?: number; product?: any }>) => {
            const { productId, quantity = 1, product } = action.payload;
            const existingItem = state.items.find(item => item.productId === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
                // Update snapshot if provided (to keep prices fresh if re-added)
                if (product) {
                    existingItem.productSnapshot = {
                        title: product.title,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        weight: product.netWeight || product.grossWeight,
                        stock: product.stock,
                    };
                }
            } else {
                state.items.push({
                    productId,
                    quantity,
                    productSnapshot: product ? {
                        title: product.title,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        weight: product.netWeight || product.grossWeight,
                        stock: product.stock,
                    } : undefined
                });
            }
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.productId !== action.payload);
        },

        updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item.productId === productId);

            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(i => i.productId !== productId);
                } else {
                    item.quantity = quantity;
                }
            }
        },

        incrementQuantity: (state, action: PayloadAction<string>) => {
            const item = state.items.find(item => item.productId === action.payload);
            if (item) {
                item.quantity += 1;
            }
        },

        decrementQuantity: (state, action: PayloadAction<string>) => {
            const item = state.items.find(item => item.productId === action.payload);
            if (item) {
                if (item.quantity <= 1) {
                    state.items = state.items.filter(i => i.productId !== action.payload);
                } else {
                    item.quantity -= 1;
                }
            }
        },

        clearCart: (state) => {
            state.items = [];
        },

        // For hydrating from localStorage
        setCart: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
