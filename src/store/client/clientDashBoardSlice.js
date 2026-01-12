import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from  "../../utils/constants";


// Function to handle Axios errors
const handleAxiosError = (error) => {
    if (error.response) {
        console.error('API Error:', error);
        console.error('API Error:', error.response.data);
        console.error('Status Code:', error.response.status);
        return `Request failed with status code ${error.response.status}: ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
        console.error('Network Error:', error.request);
        return 'Network error: No response received from the server.';
    } else {
        console.error('Request Setup Error:', error.message);
        return `Request setup error: ${error.message}`;
    }
};

// Function to get the client token from localStorage
const getClientToken = () => localStorage.getItem('Token');

// Create an Axios instance with default headers, including the Authorization header
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // Authorization header will be dynamically set in each thunk
    },
});

// Async Thunks for API calls
export const fetchSalesByDays = createAsyncThunk(
    'restaurantData/fetchSalesByDays',
    async (year, { rejectWithValue }) => {
        try {
            const token = getClientToken();
            const response = await axiosInstance.post(
                `/Sales_by_days_restaurant/${year}`, // Removed BASE_URL as it's in axiosInstance
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(handleAxiosError(error));
        }
    }
);

export const fetchSales = createAsyncThunk(
    'restaurantData/fetchSales',
    async (year, { rejectWithValue }) => {
        try {
            const token = getClientToken();
            const response = await axiosInstance.post(
                `/Sales_restaurant/${year}`, // Removed BASE_URL
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(handleAxiosError(error));
        }
    }
);

export const fetchDashboardData = createAsyncThunk(
    'restaurantData/fetchDashboardData',
    async (id, { rejectWithValue }) => {
        try {
            const token = getClientToken();
            const response = await axiosInstance.get(
                `/dashboard/${id}`, // Removed BASE_URL
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(handleAxiosError(error));
        }
    }
);

export const fetchPerformanceData = createAsyncThunk(
    'restaurantData/fetchPerformanceData',
    async (selectedYear, { rejectWithValue }) => {

        try {
            const response = await axiosInstance.post(
                `Performance_restaurant/${selectedYear}`, // Removed BASE_URL
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                    },

                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(handleAxiosError(error));
        }
    }
);

export const fetchWalletData = createAsyncThunk(
    'restaurantData/fetchWalletData',
    async ({ branchId, year }, { rejectWithValue }) => {
        try {
            const token = getClientToken();
            const response = await axiosInstance.get(
                `/wallet_restaurant/${branchId}/${year}`, // Removed BASE_URL
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            /**
             * data: {
                        LastYearRevenue:0
                        Revenue:0
                        RevenueChangePercentage:"0%"
                        Withdrawal:0
                        WithdrawalChangePercentage:"0%"
                        balance:0
                        success:true
                        }
                       
             */
            return response.data;
        } catch (error) {
            return rejectWithValue(handleAxiosError(error));
        }
    }
);

export const fetchCustomerLog = createAsyncThunk(
    'restaurantData/fetchCustomerLog',
    async ({ branchId, dateFormate }, { rejectWithValue }) => {
        try {
            const token = getClientToken();
            const response = await axiosInstance.get(
                `/Customer_log/${branchId}/${dateFormate}`, // Removed BASE_URL
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(handleAxiosError(error));
        }
    }
);

// Initial State
const initialState = {
    salesByDays: {
        data: [],
        loading: false,
        error: null,
    },
    sales: {
        data: null,
        loading: false,
        error: null,
    },
    dashboard: {
        data: null,
        loading: false,
        error: null,
    },
    performance: {
        data: null,
        loading: false,
        error: null,
    },
    wallet: {
        data: [],
        loading: false,
        error: null,
    },
    customerLog: {
        data: null,
        loading: false,
        error: null,
    },
};

// Redux Toolkit Slice
const restaurantDataSlice = createSlice({
    name: 'restaurantData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Sales by Days
        builder.addCase(fetchSalesByDays.pending, (state) => {
            state.salesByDays.loading = true;
            state.salesByDays.error = null;
        });
        builder.addCase(fetchSalesByDays.fulfilled, (state, action) => {
            state.salesByDays.loading = false;
            state.salesByDays.data = action.payload;
        });
        builder.addCase(fetchSalesByDays.rejected, (state, action) => {
            state.salesByDays.loading = false;
            state.salesByDays.error = action.payload;
        });

        // Sales
        builder.addCase(fetchSales.pending, (state) => {
            state.sales.loading = true;
            state.sales.error = null;
        });
        builder.addCase(fetchSales.fulfilled, (state, action) => {
            state.sales.loading = false;
            state.sales.data = action.payload;
        });
        builder.addCase(fetchSales.rejected, (state, action) => {
            state.sales.loading = false;
            state.sales.error = action.payload;
        });

        // Dashboard
        builder.addCase(fetchDashboardData.pending, (state) => {
            state.dashboard.loading = true;
            state.dashboard.error = null;
        });
        builder.addCase(fetchDashboardData.fulfilled, (state, action) => {
            state.dashboard.loading = false;
            state.dashboard.data = action.payload;
        });
        builder.addCase(fetchDashboardData.rejected, (state, action) => {
            state.dashboard.loading = false;
            state.dashboard.error = action.payload;
        });

        // Performance
        builder.addCase(fetchPerformanceData.pending, (state) => {
            state.performance.loading = true;
            state.performance.error = null;
        });
        builder.addCase(fetchPerformanceData.fulfilled, (state, action) => {
            state.performance.loading = false;
            state.performance.data = action.payload;
        });
        builder.addCase(fetchPerformanceData.rejected, (state, action) => {
            state.performance.loading = false;
            state.performance.error = action.payload;
        });

        // Wallet
        builder.addCase(fetchWalletData.pending, (state) => {
            state.wallet.loading = true;
            state.wallet.error = null;
        });
        builder.addCase(fetchWalletData.fulfilled, (state, action) => {
            state.wallet.loading = false;
            state.wallet.data = action.payload;
        });
        builder.addCase(fetchWalletData.rejected, (state, action) => {
            state.wallet.loading = false;
            state.wallet.error = action.payload;
        });

        // Customer Log
        builder.addCase(fetchCustomerLog.pending, (state) => {
            state.customerLog.loading = true;
            state.customerLog.error = null;
        });
        builder.addCase(fetchCustomerLog.fulfilled, (state, action) => {
            state.customerLog.loading = false;
            state.customerLog.data = action.payload;
        });
        builder.addCase(fetchCustomerLog.rejected, (state, action) => {
            state.customerLog.loading = false;
            state.customerLog.error = action.payload;
        });
    },
});

export const selectDashboard = state => state.clientDashBoard.dashboard.data
export const selectCustomerLog = state => state.clientDashBoard.customerLog.data
export const selectPerformance = state => state.clientDashBoard.performance.data
export const selectSales = state => state.clientDashBoard.sales.data
export const selectSalesByDays = state => state.clientDashBoard.salesByDays.data
export const selectWallet = state => state.clientDashBoard.wallet.data
// Export the reducer
export default restaurantDataSlice.reducer;