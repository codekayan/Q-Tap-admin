import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from  "../../utils/constants";

// Async Thunk for fetching discounts
export const fetchDiscounts = createAsyncThunk(
    'discounts/fetchDiscounts',
    async (selectedBranch, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}meals_discount`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                },
                params: {
                    brunch_id: selectedBranch,
                },
            });

            if (response.data) {
                return response.data.discounts || [];
            } else {
                return []; // Return an empty array if response.data is null or undefined
            }
        } catch (error) {
            console.error('Error fetching discounts:', error);
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue('An unexpected error occurred while fetching discounts');
        }
    }
);

const initialState = {
    discounts: [],
    loading: 'idle',
    error: null,
};

const discountsSlice = createSlice({
    name: 'discounts',
    initialState,
    reducers: {
        addDiscounts: (state, action) => {
            state.discounts = [...state.discounts, action.payload];
        },
        deleteDiscounts: (state, action) => {
            state.discounts = state.discounts.filter(
                (dis) => { return dis.id !== action.payload }
            )
        },
        updataDiscounts: (state, action) => {
            const index = state.discounts.findIndex(
                (area) => area.id === action.payload.id
            );
            if (index !== -1) {
                state.discounts[index] = action.payload;
            }
        },
        setDiscounts: (state, action) => {
            state.discounts = action.payload;
        },
        setDiscountContent: (state, action) => {
            state.discountContent = action.payload;
        },
        clearDiscountsError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiscounts.pending, (state) => {
                state.loading = 'loading';
                state.error = null;
            })
            .addCase(fetchDiscounts.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.discounts = action.payload;
            })
            .addCase(fetchDiscounts.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
            });
    },
});

export default discountsSlice.reducer;

export const { setDiscounts, setDiscountContent, clearDiscountsError,
    addDiscounts, deleteDiscounts, updataDiscounts } = discountsSlice.actions;

// Selector functions
export const selectDiscounts = (state) => state.DiscountMenu.discounts;
export const selectDiscountsLoading = (state) => state.DiscountMenu.loading;
export const selectDiscountsError = (state) => state.DiscountMenu.error;