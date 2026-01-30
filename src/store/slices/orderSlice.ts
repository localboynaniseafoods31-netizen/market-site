import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
    productId: string;
    quantity: number;
    priceAtOrder: number;    // Price snapshot at order time (for history)
    title: string;           // Snapshot for display
}

export interface Order {
    id: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    status: OrderStatus;
    addressId: string;
    addressSnapshot: string; // Full address at order time
    phone: string;
    name: string;
    createdAt: string;       // ISO date string
    updatedAt: string;
    estimatedDelivery?: string;
    notes?: string;
}

interface OrderState {
    orders: Order[];
    currentOrderId: string | null;
}

const initialState: OrderState = {
    orders: [],
    currentOrderId: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        createOrder: (state, action: PayloadAction<Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>>) => {
            const newOrder: Order = {
                ...action.payload,
                id: `ORD_${Date.now()}`,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            state.orders.unshift(newOrder); // Add to beginning
            state.currentOrderId = newOrder.id;
        },

        updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: OrderStatus }>) => {
            const order = state.orders.find(o => o.id === action.payload.orderId);
            if (order) {
                order.status = action.payload.status;
                order.updatedAt = new Date().toISOString();
            }
        },

        cancelOrder: (state, action: PayloadAction<string>) => {
            const order = state.orders.find(o => o.id === action.payload);
            if (order && order.status === 'pending') {
                order.status = 'cancelled';
                order.updatedAt = new Date().toISOString();
            }
        },

        setCurrentOrder: (state, action: PayloadAction<string | null>) => {
            state.currentOrderId = action.payload;
        },

        // Hydrate from localStorage
        setOrders: (state, action: PayloadAction<Order[]>) => {
            state.orders = action.payload;
        },

        clearOrders: (state) => {
            state.orders = [];
            state.currentOrderId = null;
        },
    },
});

export const {
    createOrder,
    updateOrderStatus,
    cancelOrder,
    setCurrentOrder,
    setOrders,
    clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
