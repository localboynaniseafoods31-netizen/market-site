// Redux Store Exports
export { store, hydrateStore, setupPersistence } from './store';
export type { RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './hooks';

// Slice Actions
export {
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
} from './slices/cartSlice';

export {
    setPhone,
    setName,
    setEmail,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    setUser,
    clearUser,
} from './slices/userSlice';

export {
    createOrder,
    updateOrderStatus,
    cancelOrder,
    setCurrentOrder,
} from './slices/orderSlice';

export {
    setPageLoading,
    startLoading,
    stopLoading,
    openCartDrawer,
    closeCartDrawer,
    toggleCartDrawer,
    openLocationDrawer,
    closeLocationDrawer,
    setSearchQuery,
    openSearch,
    closeSearch,
    resetUi,
} from './slices/uiSlice';

// Selectors
export {
    selectCartItemsWithDetails,
    selectCartTotal,
    selectCartSavings,
    selectCartItemCount,
    selectCartUniqueCount,
    selectIsInCart,
    selectProductQuantity,
    selectUser,
    selectUserPhone,
    selectUserAddresses,
    selectDefaultAddress,
    selectIsLoggedIn,
    selectAllOrders,
    selectCurrentOrder,
    selectOrderById,
    selectRecentOrders,
    selectActiveOrders,
    selectCartWeight,
} from './selectors';

// Types
export type { CartItem } from './slices/cartSlice';
export type { Address, UserState } from './slices/userSlice';
export type { Order, OrderItem, OrderStatus } from './slices/orderSlice';
export type { LocationState } from './slices/locationSlice';

export { setLocation, clearLocation } from './slices/locationSlice';
export { selectLocation, selectIsServiceable } from './selectors';

