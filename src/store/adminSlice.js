import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Utility function for fetching with retry logic
const fetchWithRetry = async (url, options, maxRetries = 5, initialDelay = 1000) => {
    let attempt = 0;
    let delay = initialDelay;

    while (attempt < maxRetries) {
        try {
            const response = await axios(url, options);
            return response;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
                attempt++;
            } else {
                throw error;
            }
        }
    }
    throw new Error("Max retries reached. Could not fetch data.");
};

// Initial state for the admin slice
const initialState = {
    salesData: [],
    salesVolumeData: [],
    performanceData: [],
    dashboardData: [],
    depositsData: [],
    withdrawalsData: [],
    walletChartTwoData: [],

    isLoading: {
        salesData: false,
        salesVolumeData: false,
        performanceData: false,
        dashboardData: false,
        depositsData: false,
        withdrawalsData: false,
        walletChartTwoData: false,
    },

    error: {
        salesData: null,
        salesVolumeData: null,
        performanceData: null,
        dashboardData: null,
        depositsData: null,
        withdrawalsData: null,
        walletChartTwoData: null,
    },
};

// Thunks for each API call
export const getSalesDashboard = createAsyncThunk(
    "admin/getSalesDashboard",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetchWithRetry(`${BASE_URL}Sales/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                data: {},
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch sales data");
        }
    }
);

export const getSalesVolumeDashboard = createAsyncThunk(
    "admin/getSalesVolumeDashboard",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetchWithRetry(`${BASE_URL}Sales_by_days/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                data: {},
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch sales volume data");
        }
    }
);

export const getPerformanceDashboard = createAsyncThunk(
    "admin/getPerformanceDashboard",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetchWithRetry(`${BASE_URL}Performance/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                data: {},
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch performance data");
        }
    }
);

export const getDashboard = createAsyncThunk(
    "admin/getDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchWithRetry(`${BASE_URL}dashboard`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                data: {},
            });
            console.log("response.data", response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch dashboard data");
        }
    }
);

export const getDeposits = createAsyncThunk(
    "admin/getDeposits",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetchWithRetry(`${BASE_URL}Deposits/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch deposits data");
        }
    }
);

export const getWithdrawals = createAsyncThunk(
    "admin/getWithdrawals",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetchWithRetry(`${BASE_URL}withdraw/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch withdrawals data");
        }
    }
);

export const getWalletChartTwo = createAsyncThunk(
    "admin/getWalletChartTwo",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetchWithRetry(`${BASE_URL}wallet/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                data: {},
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch wallet chart two data");
        }
    }
);

// Admin slice
const adminSlice = createSlice({
    name: "admin",
    initialState,
    extraReducers: (builder) => {
        // getSalesDashboard
        builder
            .addCase(getSalesDashboard.pending, (state) => {
                state.isLoading.salesData = true;
                state.error.salesData = null;
            })
            .addCase(getSalesDashboard.fulfilled, (state, action) => {
                state.isLoading.salesData = false;
                state.salesData = action.payload;
            })
            .addCase(getSalesDashboard.rejected, (state, action) => {
                state.isLoading.salesData = false;
                state.error.salesData = action.payload;
            });

        // getSalesVolumeDashboard
        builder
            .addCase(getSalesVolumeDashboard.pending, (state) => {
                state.isLoading.salesVolumeData = true;
                state.error.salesVolumeData = null;
            })
            .addCase(getSalesVolumeDashboard.fulfilled, (state, action) => {
                state.isLoading.salesVolumeData = false;
                state.salesVolumeData = action.payload;
            })
            .addCase(getSalesVolumeDashboard.rejected, (state, action) => {
                state.isLoading.salesVolumeData = false;
                state.error.salesVolumeData = action.payload;
            });

        // getPerformanceDashboard
        builder
            .addCase(getPerformanceDashboard.pending, (state) => {
                state.isLoading.performanceData = true;
                state.error.performanceData = null;
            })
            .addCase(getPerformanceDashboard.fulfilled, (state, action) => {
                state.isLoading.performanceData = false;
                state.performanceData = action.payload;
            })
            .addCase(getPerformanceDashboard.rejected, (state, action) => {
                state.isLoading.performanceData = false;
                state.error.performanceData = action.payload;
            });

        // getDashboard
        builder
            .addCase(getDashboard.pending, (state) => {
                state.isLoading.dashboardData = true;
                state.error.dashboardData = null;
            })
            .addCase(getDashboard.fulfilled, (state, action) => {
                state.isLoading.dashboardData = false;
                console.log("action.payload",action.payload)
                state.dashboardData = action.payload;
            })
            .addCase(getDashboard.rejected, (state, action) => {
                state.isLoading.dashboardData = false;
                state.error.dashboardData = action.payload;
            });

        // getDeposits
        builder
            .addCase(getDeposits.pending, (state) => {
                state.isLoading.depositsData = true;
                state.error.depositsData = null;
            })
            .addCase(getDeposits.fulfilled, (state, action) => {
                state.isLoading.depositsData = false;
                state.depositsData = action.payload;
            })
            .addCase(getDeposits.rejected, (state, action) => {
                state.isLoading.depositsData = false;
                state.error.depositsData = action.payload;
            });

        // getWithdrawals
        builder
            .addCase(getWithdrawals.pending, (state) => {
                state.isLoading.withdrawalsData = true;
                state.error.withdrawalsData = null;
            })
            .addCase(getWithdrawals.fulfilled, (state, action) => {
                state.isLoading.withdrawalsData = false;
                state.withdrawalsData = action.payload;
            })
            .addCase(getWithdrawals.rejected, (state, action) => {
                state.isLoading.withdrawalsData = false;
                state.error.withdrawalsData = action.payload;
            });

        // getWalletChartTwo
        builder
            .addCase(getWalletChartTwo.pending, (state) => {
                state.isLoading.walletChartTwoData = true;
                state.error.walletChartTwoData = null;
            })
            .addCase(getWalletChartTwo.fulfilled, (state, action) => {
                state.isLoading.walletChartTwoData = false;
                state.walletChartTwoData = action.payload;
            })
            .addCase(getWalletChartTwo.rejected, (state, action) => {
                state.isLoading.walletChartTwoData = false;
                state.error.walletChartTwoData = action.payload;
            });
    },
});

export const adminReducer = adminSlice.reducer;