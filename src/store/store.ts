import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { setCart, CartItem } from './slices/cartSlice';
import userReducer, { setUser, UserState } from './slices/userSlice';
import orderReducer, { setOrders, Order } from './slices/orderSlice';
import uiReducer from './slices/uiSlice';
import locationReducer, { setLocation, LocationState } from './slices/locationSlice';

// localStorage keys
const CART_STORAGE_KEY = 'oceanfresh_cart';
const USER_STORAGE_KEY = 'oceanfresh_user';
const ORDERS_STORAGE_KEY = 'oceanfresh_orders';
const LOCATION_STORAGE_KEY = 'localboynaniseafoods_location'; // Match key used in LocationHeader

// Safe localStorage access (SSR compatible)
const loadFromStorage = <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};

const saveToStorage = (key: string, data: unknown) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
    }
};

// Create store
export const store = configureStore({
    reducer: {
        cart: cartReducer,
        user: userReducer,
        orders: orderReducer,
        ui: uiReducer,
        location: locationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Allow Date objects in state
        }),
});

// Hydrate store from localStorage (call on client mount)
export const hydrateStore = () => {
    // ... (cart hydration)
    const savedCart = loadFromStorage<CartItem[]>(CART_STORAGE_KEY);
    if (savedCart && Array.isArray(savedCart)) {
        store.dispatch(setCart(savedCart));
    }

    // ... (user hydration)
    const savedUser = loadFromStorage<Partial<UserState>>(USER_STORAGE_KEY);
    if (savedUser) {
        store.dispatch(setUser(savedUser));
    }

    // ... (orders hydration)
    const savedOrders = loadFromStorage<Order[]>(ORDERS_STORAGE_KEY);
    if (savedOrders && Array.isArray(savedOrders)) {
        store.dispatch(setOrders(savedOrders));
    }

    // Hydrate location
    const savedLocation = loadFromStorage<LocationState>(LOCATION_STORAGE_KEY);
    if (savedLocation) {
        store.dispatch(setLocation(savedLocation));
    }
};

// Subscribe to store changes and persist
export const setupPersistence = () => {
    store.subscribe(() => {
        const state = store.getState();

        // Save cart
        saveToStorage(CART_STORAGE_KEY, state.cart.items);

        // Save user
        const userToSave = {
            phone: state.user.phone,
            name: state.user.name,
            email: state.user.email,
            addresses: state.user.addresses,
            defaultAddressId: state.user.defaultAddressId,
        };
        saveToStorage(USER_STORAGE_KEY, userToSave);

        // Save orders
        saveToStorage(ORDERS_STORAGE_KEY, state.orders.orders);

        // Save location
        if (state.location) {
            saveToStorage(LOCATION_STORAGE_KEY, state.location);
        }
    });
};

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
