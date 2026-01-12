import { Box } from '@mui/system'
import React, { useState, useEffect } from 'react'
import { DeliveredHeader } from './DeliveredHeader'
import { DeliveredFooter } from './DeliveredFooter'
import { DeliveredBody } from './DeliveredBody/DeliveredBody'
import axios from 'axios'
import { toast } from 'react-toastify'
import { parseResponseOrderItem } from '../Order/OrderComponent/OrderBody'
import { DeliveredDetails } from './DeliveredBody/DeliveredDetails'
import { BASE_URL } from "../../../utils/constants"
import Pusher from 'pusher-js'
import { useDispatch } from 'react-redux'
import { addPreparedOrder, fetchCanceledOrders, fetchDeliveredOrders, fetchPreparedOrders, fetchTotalDelivered } from '../../../store/client/deliveryOrderSlic'

export const deliveryFetchApi = {
    fetch: {
        getPerepared: 'get_prepared_orders_delivery/',
        delivered: 'Daily_Delivered_Orders/',// take param -> /:id
        totalDelivered: 'Total_Delivered_Orders/',// take param -> /:id
        canceledOrder: 'Daily_Cancaled_Orders/',// take param -> /:id
    },
    action: {
        orederDelivered: 'order_delivered',//has body 
        changeStatus: 'update_delivery_status',//has body 
    }
}

export const Delivered = () => {

    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
    const dispatch = useDispatch();



    const getDeliveryData = async () => {
        const loginclient = JSON.parse(localStorage.getItem('UserData'));
        if (!loginclient) {
            toast.error("User not logged in");
            return;
        }

        const deliveryId = loginclient?.user?.id;

        try {

            dispatch(fetchPreparedOrders()).unwrap()
            dispatch(fetchDeliveredOrders(deliveryId)).unwrap()
            dispatch(fetchTotalDelivered(deliveryId)).unwrap()
            dispatch(fetchCanceledOrders(deliveryId)).unwrap()

        } catch (error) {
            console.error('Error fetching delivery data:', error);
            toast.error('Failed to fetch delivery data');
        }
    };

    useEffect(() => {
        getDeliveryData()
    }, [])
    useEffect(() => {
        const loginclient = JSON.parse(localStorage.getItem('UserData'));
        const deliveryId = loginclient?.user?.id;
        const pusher = new Pusher('63b495891d2c3cff9d36', {
            cluster: 'eu',
        });

        const channel = pusher.subscribe('notify-channel');
        channel.bind('form-submitted', function (data) {
            // console.log('📢 Received from Pusher Delivery:', data);
            // {message : 0:  , type: "done_order"}
            if (data?.type === 'choose_delivery_order') {
                if (data?.message?.[0]?.orders_processing?.some(order => order?.delivery_rider_id === deliveryId))
                    dispatch(addPreparedOrder(data.message)); // assuming `data.message` is the new order
            }
        });

        // Cleanup on component unmount
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    return (

        <Box sx={{ backgroundColor: "#EBEDF3", position: 'relative' }}>
            <DeliveredHeader />
            <DeliveredBody setSelectedOrder={setSelectedOrder} setIsOrderDetailsOpen={setIsOrderDetailsOpen} />
            <DeliveredFooter />
            <DeliveredDetails isOrderDetailsOpen={isOrderDetailsOpen} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} setIsOrderDetailsOpen={setIsOrderDetailsOpen} />

        </Box>
    )
}
