import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    // Loading states
    isPageLoading: boolean;
    loadingKeys: string[]; // For tracking multiple loading states

    // Modal/drawer states
    isCartDrawerOpen: boolean;
    isLocationDrawerOpen: boolean;

    // Search
    searchQuery: string;
    isSearchOpen: boolean;
}

const initialState: UiState = {
    isPageLoading: false,
    loadingKeys: [],
    isCartDrawerOpen: false,
    isLocationDrawerOpen: false,
    searchQuery: '',
    isSearchOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Page loading
        setPageLoading: (state, action: PayloadAction<boolean>) => {
            state.isPageLoading = action.payload;
        },

        // Granular loading states
        startLoading: (state, action: PayloadAction<string>) => {
            if (!state.loadingKeys.includes(action.payload)) {
                state.loadingKeys.push(action.payload);
            }
        },
        stopLoading: (state, action: PayloadAction<string>) => {
            state.loadingKeys = state.loadingKeys.filter(key => key !== action.payload);
        },

        // Cart drawer
        openCartDrawer: (state) => {
            state.isCartDrawerOpen = true;
        },
        closeCartDrawer: (state) => {
            state.isCartDrawerOpen = false;
        },
        toggleCartDrawer: (state) => {
            state.isCartDrawerOpen = !state.isCartDrawerOpen;
        },

        // Location drawer
        openLocationDrawer: (state) => {
            state.isLocationDrawerOpen = true;
        },
        closeLocationDrawer: (state) => {
            state.isLocationDrawerOpen = false;
        },

        // Search
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        openSearch: (state) => {
            state.isSearchOpen = true;
        },
        closeSearch: (state) => {
            state.isSearchOpen = false;
            state.searchQuery = '';
        },

        // Reset UI state
        resetUi: () => initialState,
    },
});

export const {
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
} = uiSlice.actions;

export default uiSlice.reducer;
