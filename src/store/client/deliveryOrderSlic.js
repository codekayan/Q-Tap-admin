import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from  "../../utils/constants";
import { parseResponseOrderItem } from '../../Pages/DashboardClient/Order/OrderComponent/OrderBody';



// Thunks for GET requests
export const fetchPreparedOrders = createAsyncThunk(
    'delivery/fetchPreparedOrders',
    async () => {
        const token = localStorage.getItem('Token');
        const res = await axios.get(`${BASE_URL}get_my_orders_delivery/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        return res.data;
    }
);

export const fetchDeliveredOrders = createAsyncThunk(
    'delivery/fetchDeliveredOrders',
    async (id) => {
        const token = localStorage.getItem('Token');
        const res = await axios.get(`${BASE_URL}Daily_Delivered_Orders/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        return res.data;
    }
);

export const fetchTotalDelivered = createAsyncThunk(
    'delivery/fetchTotalDelivered',
    async (id) => {
        const token = localStorage.getItem('Token');
        const res = await axios.get(`${BASE_URL}Total_Delivered_Orders/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        return res.data;
    }
);

export const fetchCanceledOrders = createAsyncThunk(
    'delivery/fetchCanceledOrders',
    async (id) => {
        const token = localStorage.getItem('Token');
        const res = await axios.get(`${BASE_URL}Daily_Cancaled_Orders/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        return res.data;
    }
);
//======================================================================
// Thunks for POST/PUT actions
export const markOrderDelivered = createAsyncThunk(
    'delivery/markOrderDelivered',
    async (data) => {
        const token = localStorage.getItem('Token');
        /* {"order_id":"5","status":"delivered","note":"test delivery"}} */
        const res = await axios.post(`${BASE_URL}order_delivered`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return res.data;
    }
);


const deliverySlice = createSlice({
    name: 'delivery',
    initialState: {
        preparedOrders: [],
        deliveredOrders: 0,
        totalDelivered: 0,
        canceledOrders: 0,
        status: 'idle',
        error: null,
        actionStatus: 'idle',
        actionError: null,
    },
    reducers: {
        addPreparedOrder: (state, action) => {
            // parse then save 
            let parsedOrder = parseResponseOrderItem(action.payload[0])
            state.preparedOrders.push(parsedOrder)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPreparedOrders.fulfilled, (state, action) => {
                if (action.payload.success !== false) {
                    let p = action.payload.prepared_orders?.map(item => parseResponseOrderItem(item))

                    state.preparedOrders = p;
                    state.status = 'succeeded';
                }
            })
            .addCase(fetchDeliveredOrders.fulfilled, (state, action) => {
                state.deliveredOrders = action.payload.total_delivered_orders;
                state.status = 'succeeded';
            })
            .addCase(fetchTotalDelivered.fulfilled, (state, action) => {
                state.totalDelivered = action.payload.Total_Delivered_Orders;
                state.status = 'succeeded';
            })
            .addCase(fetchCanceledOrders.fulfilled, (state, action) => {
                state.canceledOrders = action.payload.total_Cancaled_delivered_orders;
                state.status = 'succeeded';
            })
            /*\
            ***\
            ****| actions success
            *  /
             */
            .addCase(markOrderDelivered.pending, (state) => {
                state.actionStatus = 'loading';
                state.actionError = null;
            })
            .addCase(markOrderDelivered.fulfilled, (state, action) => {


                state.actionStatus = 'succeeded';
                if (action.payload.success) {
                    state.preparedOrders = state.preparedOrders.filter(item =>
                        action.payload.orders_processing.order_id !== item.id
                    )
                    if (action.payload.orders_processing.status === 'cancelled')
                        state.canceledOrders++
                    else
                        state.deliveredOrders++

                }

            }).addCase(markOrderDelivered.rejected, (state, action) => {
                state.actionStatus = 'failed';
                state.actionError = action.error.message || 'Something went wrong while marking as delivered.';
            })
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.status = 'loading';
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.error.message;
                }
            );
    },
});

export default deliverySlice.reducer;
export const { addPreparedOrder } = deliverySlice.actions;
export const selectHeaderData = state => state.DeliveryOrder
export const selectPreparedOrders = state => state.DeliveryOrder.preparedOrders
export const selectActionStatus = state => state.DeliveryOrder.actionStatus
export const selectActionError = state => state.DeliveryOrder.actionError
