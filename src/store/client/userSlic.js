// clientAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from "../../utils/constants"

const initialState = {
    loading: false,
    user: null,
    token: null,
    branches: [],
    error: null,
};

export const handleClientLoginRedux = createAsyncThunk(
    'clientAuth/login',
    async ({ pin, role, brunch_id }, { rejectWithValue }) => {
        try {
            const data = {
                email: localStorage.getItem('clientEmail'),
                password: localStorage.getItem('clientPassword'),
                user_type: 'qtap_clients',
                role,
                pin,
                brunch_id,
            };

            const response = await axios.post(`${BASE_URL}login`, data, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });

            console.log("response login",response)

            localStorage.removeItem('clientPassword');
            localStorage.removeItem('clientEmail');
            localStorage.setItem('Token', response.data.token);
            localStorage.setItem('UserData', JSON.stringify(response.data));
            localStorage.setItem('UserName', response.data.user.name);
            localStorage.setItem('UserEmail', response.data.user.email);

            if (response?.data?.brunches?.length > 0) {
                localStorage.setItem('branches', JSON.stringify(response.data.brunches));
            }

            return { ...response.data, selected_brunch_id: brunch_id };
        } catch (error) {
            console.log("error login", error)
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const clientAuthSlice = createSlice({
    name: 'clientAuth',
    initialState,
    reducers: {
        logoutClient: (state) => {
            state.user = null;
            state.token = null;
            state.branches = [];
            state.error = null;
            localStorage.removeItem('Token');
            localStorage.removeItem('UserData');
            localStorage.removeItem('clientName');
            localStorage.removeItem('clientEmail');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleClientLoginRedux.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleClientLoginRedux.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.selectedBranch = action.payload.selected_brunch_id;
                state.branches = action.payload.brunches || [];

            })
            .addCase(handleClientLoginRedux.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logoutClient } = clientAuthSlice.actions;
export default clientAuthSlice.reducer;

export const selectIsLoading = state => state.UserData.loading