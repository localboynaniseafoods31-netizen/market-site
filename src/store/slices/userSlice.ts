import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Address {
    id: string;
    label: string;           // e.g., "Home", "Work"
    fullAddress: string;     // Complete address string
    landmark?: string;
    pincode: string;
    city: string;
    isDefault: boolean;
}

export interface UserState {
    phone: string | null;
    name: string;
    email?: string;          // Optional, for order receipts
    addresses: Address[];
    defaultAddressId: string | null;
    isVerified: boolean;     // Phone verification status (for future)
}

const initialState: UserState = {
    phone: null,
    name: '',
    email: undefined,
    addresses: [],
    defaultAddressId: null,
    isVerified: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setPhone: (state, action: PayloadAction<string>) => {
            state.phone = action.payload;
        },

        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },

        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },

        addAddress: (state, action: PayloadAction<Omit<Address, 'id'>>) => {
            const newAddress: Address = {
                ...action.payload,
                id: `addr_${Date.now()}`,
            };

            // If this is first address or marked as default
            if (state.addresses.length === 0 || action.payload.isDefault) {
                state.addresses.forEach(a => a.isDefault = false);
                newAddress.isDefault = true;
                state.defaultAddressId = newAddress.id;
            }

            state.addresses.push(newAddress);
        },

        updateAddress: (state, action: PayloadAction<Address>) => {
            const index = state.addresses.findIndex(a => a.id === action.payload.id);
            if (index !== -1) {
                state.addresses[index] = action.payload;

                if (action.payload.isDefault) {
                    state.addresses.forEach((a, i) => {
                        if (i !== index) a.isDefault = false;
                    });
                    state.defaultAddressId = action.payload.id;
                }
            }
        },

        removeAddress: (state, action: PayloadAction<string>) => {
            state.addresses = state.addresses.filter(a => a.id !== action.payload);

            if (state.defaultAddressId === action.payload) {
                state.defaultAddressId = state.addresses[0]?.id || null;
                if (state.addresses[0]) {
                    state.addresses[0].isDefault = true;
                }
            }
        },

        setDefaultAddress: (state, action: PayloadAction<string>) => {
            state.addresses.forEach(a => {
                a.isDefault = a.id === action.payload;
            });
            state.defaultAddressId = action.payload;
        },

        setVerified: (state, action: PayloadAction<boolean>) => {
            state.isVerified = action.payload;
        },

        // Hydrate full user from localStorage or API
        setUser: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload };
        },

        clearUser: () => initialState,
    },
});

export const {
    setPhone,
    setName,
    setEmail,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    setVerified,
    setUser,
    clearUser,
} = userSlice.actions;

export default userSlice.reducer;
