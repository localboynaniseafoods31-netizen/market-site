import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LocationState {
    pincode: string;
    locality: string;
    isServiceable: boolean;
    eta?: string;
    minOrder?: number;
    message?: string;
}

const initialState: LocationState | null = null;

const locationSlice = createSlice({
    name: 'location',
    initialState: initialState as LocationState | null,
    reducers: {
        setLocation: (state, action: PayloadAction<LocationState>) => {
            return action.payload;
        },
        clearLocation: () => null
    }
});

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
