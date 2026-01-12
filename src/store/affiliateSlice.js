import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const initialState = {
    data: [],
    isLoading: false,
    error: null
}


export const getAffiliateData = createAsyncThunk("affiliate-data", async (id) => {
    const response = await axios.get(`${BASE_URL}get_affiliate_info/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
    });
    return response
})

const affiliateSlice = createSlice({
    name: "affiliateSlice",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getAffiliateData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.isLoading = false

        })
        builder.addCase(getAffiliateData.pending, (state) => {
            state.isLoading = true

        })
    }
})



export const affiliateReducer = affiliateSlice.reducer



// const getClientData = async (id) => {
//     try {

//         const response = await axios.get(`${BASE_URL}get_client_info/${id}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
//             }
//         });

//         if (response.data) {
//             setClients(Array.isArray(response.data) ? response.data : [response.data]);
//         }
//     } catch (error) {
//         console.error('Error fetching client data:', error);
//     }
// };