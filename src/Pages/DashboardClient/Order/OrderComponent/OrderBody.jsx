import React, { useEffect, useState } from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import Header from './Header';
import OrderCard from './OrderCard';
import Footer from './Footer';
import RejectionModal from './RejectionModal';
import OrderDetails from './OrderDetails';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import OrderDetailsNew from './OrderDetailsNew';
import Pusher from 'pusher-js';
import { toast } from 'react-toastify';
import { BASE_URL } from "../../../../utils/constants"



export const parseResponseOrderItem = (item, phase = '') => {
    if (!item) return null;

    item.meal_id = (typeof item.meal_id === "string" ? JSON.parse(item.meal_id) : item.meal_id)
    item.quantity = (typeof item.quantity === "string" ? JSON.parse(item.quantity) : item.quantity)
    item.size = (typeof item.size === "string" ? JSON.parse(item.size) : item.size)
    item.discount_code = (typeof item.discount_code === "string" ? JSON.parse(item.discount_code) : item.discount_code)
    item.extras = (typeof item.extras === "string" ? JSON.parse(item.extras) : item.extras)
    item.variants = (typeof item.variants === "string" ? JSON.parse(item.variants) : item.variants)
    item.phase = phase;


    return item
}

export const OrderBody = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);// used to show details panel
    const [modalOpen, setModalOpen] = useState(false); // used to show reject panel
    const [orders, setOrders] = useState([])
    const [client, setClient] = useState(null)


    const { t } = useTranslation()
    const theme = useTheme();


    useEffect(() => {
        const loginclient = JSON.parse(localStorage.getItem('UserData'))
        setClient(loginclient)
        const handleClient = async () => {
            try {

                const res = await axios.get(`${BASE_URL}${orderEndPoint[loginclient.user.role].fetch[0]}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('Token')}`
                        },

                    }
                )


                // each request has its response data :
                ///-------------------------------------------
                // chef data.new_orders ==> updata: it now inside data direct
                // cashier data.accepted_orders
                // admin data.served_orders
                // admin data.delivery_riders\
                //waiter data.prepared_orders
                let orders = []

                if (loginclient.user.role === 'chef') {
                    orders = res.data.map((item) => parseResponseOrderItem(item, orderPhaseType.ACCEPTING))
                    const savedOrder = localStorage.getItem('chefAcceptedOrder')
                    const parsedSavedOrder = savedOrder ? JSON.parse(savedOrder) : []
                    setOrders([...orders, ...parsedSavedOrder])

                } else if (loginclient.user.role === 'cashier') {

                    orders = res.data.accepted_orders.map((item) => item ? { ...parseResponseOrderItem(item, orderPhaseType.PAYING), chef: item.user } : undefined)
                    orders = orders.filter(order => order !== undefined);

                    setOrders(orders)

                } else if (loginclient.user.role === 'waiter') {


                    orders = res.data.prepared_orders.map((item) => item ? { ...parseResponseOrderItem(item, orderPhaseType.SERVRING) } : undefined)
                    orders = orders.filter(order => order !== undefined);

                    setOrders(orders)

                } else if (loginclient.user.role === 'admin') {
                    if (res.data.success !== false) {
                        orders = res.data.served_orders.map((item) => item ? { ...parseResponseOrderItem(item, orderPhaseType.DONING) } : undefined)
                        orders = orders.filter(order => order !== undefined);
                        orders = orders.filter(order => !order.orders_processing.some(item => item.status === 'done'));
                    }



                    try {
                        /* Admin sees two types of orders: 
                                1 - those served by the waiter 
                                2 - those prepared by the chef for delivery. The admin can assign a delivery person to them.
                                3 - those delivered by delivery rider
                         */
                        const res = await adminFetchGetPreparedOrdersDelivery()
                        const res2 = await adminFetchGetDeliveredOrders()
                        let delivryorders = []
                        let deliveredOrder = []
                        if (res.data.success !== false) {
                            delivryorders = res.data.prepared_orders.map((item) => item ? { ...parseResponseOrderItem(item, orderPhaseType.CHOOSE_DELIVERY) } : undefined)
                            delivryorders = delivryorders.filter(order => order !== undefined);
                            delivryorders = delivryorders.filter(order => order.type === "delivery" && !order.orders_processing.some(item => item.status === 'done'));
                        }
                        if (res2.data.success !== false)
                            deliveredOrder = res2.data.delivered_orders.map((item) => item ? { ...parseResponseOrderItem(item, orderPhaseType.DONING) } : undefined)

                        setOrders([...delivryorders, ...deliveredOrder, ...orders].sort((a, b) => a.id - b.id));

                    }

                    catch (error) {
                        toast.error(t("errorGetingData"))
                    }
                }



            } catch (error) {

                toast.error(t("errorGetingData"))
            }
        }

        handleClient()

    }, [])

    const adminFetchGetDeliveredOrders = async () => {
        try {
            const res = await axios.post(`${BASE_URL}get_delivered_orders`, {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`
                    },

                }
            )

            return res;

        } catch (err) {
            throw err
        }
    }
    const adminFetchGetPreparedOrdersDelivery = async () => {
        try {
            const res = await axios.get(`${BASE_URL}get_prepared_orders_delivery`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`
                    },

                }
            )

            return res;
        } catch (err) {
            throw err
        }
    }
    //live update 
    // pusher
    useEffect(() => {
        if (!client) return;
        const pusher = new Pusher('63b495891d2c3cff9d36', {
            cluster: 'eu',
        });
        const channel = pusher.subscribe('notify-channel');
        // console.log("📢 Pusher decleared:")
        channel.bind('form-submitted', function (data) {
            // ✅ Show toast or handle state
            console.log("📢 Received from Pusher: -", data);
            const selectedBranch = localStorage.getItem('selectedBranch')
            if (data.message?.brunch_id !== Number(selectedBranch) && data.message?.[0]?.brunch_id !== Number(selectedBranch)) {
                return;
            }
            /**
             * if order new     
             *      1 - show to all the chef
             * if one chef accept the order 
             *      1- show the order to online cashier
             *      2- delete it from other chef
             * if cashier receive payment
             *      1- delete the order from other online cashier
             * if chef prepare the order
             *      1- show the order to online waiter
             *      2- if order is delivery show it to the admin to assign delivery person to it
             * if waiter serve the order 
             *      1- delete the order from other waiter
             *      2- add order to admin done
             */
            if (data.type === "add_order") {
                toast.info(`📢 pusher new order add`);
                if (client?.user?.role === "chef") {
                    setOrders((prev => [...prev, parseResponseOrderItem(data.message, orderPhaseType.ACCEPTING)]))
                }
            }

            if (data.type === 'accepted_order') {

                toast.info(`📢 pusher accepted_order`);
                if (client?.user?.role === "chef" && client?.user?.id !== data?.message?.orders_processing?.[0]?.user?.id) {
                    removeOrder(data?.message.id)
                } else if (client?.user?.role === "cashier") {
                    setOrders((prev => [...prev, parseResponseOrderItem(data.message, orderPhaseType.PAYING)]))
                }
            }

            if (data.type === 'payment_received_order') {

                toast.info(`📢 pusher payment_recived_order`);
                if (client?.user?.role === "cashier") {
                    //id here is id of request not the order the order id is in order_id
                    removeOrder(data.message.order_id)
                }
            }

            if (data.type === "prepared_order") {
                toast.info(`📢 pusher prepared_order`);
                if (client?.user?.role === "waiter") {
                    setOrders((prev => [...prev, parseResponseOrderItem(data.message?.[0], orderPhaseType.SERVRING)]))
                }

                if (client?.user?.role === "admin" && data.message?.[0]?.type === 'delivery') {
                    setOrders((prev => [...prev, parseResponseOrderItem(data.message?.[0], orderPhaseType.DONING)]))
                }
            }

            if (data.type === 'served_order') {
                toast.info(`📢 pusher served_order`);
                if (client?.user?.role === "waiter") {
                    removeOrder(data.message.id)
                } else if (client?.user?.role === "admin") {
                    setOrders((prev => [...prev, parseResponseOrderItem(data.message, orderPhaseType.DONING)]))
                }
            }
            if (data.type === 'delivered_order') {
                toast.info(`📢 pusher done_order`);
                if (client?.user?.role === "admin") {
                    setOrders((prev => [...prev, parseResponseOrderItem(data.message?.[0], orderPhaseType.DONING)]))
                }
            }
            if (data.type === 'done_order') { toast.info(`📢 pusher done_order`); }


        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [client]);

    // Function to update the phase of a specific order
    const updateOrderPhase = (orderId, newPhase, newOrder = null) => {
        setOrders(prevOrders =>
            prevOrders.map(order => {
                if (newOrder) {
                    return order?.id === orderId ? { ...newOrder, phase: newPhase } : order;
                }
                return order?.id === orderId ? { ...order, phase: newPhase } : order;

            }

            )
        );
    };

    // Function to remove a specific order
    const removeOrder = (orderId) => {
        setOrders(prevOrders =>
            prevOrders.filter(order => order.id !== orderId)
        );
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleCloseOrderDetailsOnMobile = () => {
        setSelectedOrder(null)
    }

    return (<Box sx={{
        width: { xs: "100%", md: selectedOrder ? "78%" : "100%" }, transition: "width 0.3s ease-in-out",
        backgroundColor: theme.palette.bodyColor.whiteGray_lightBlack, minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
        <Header />
        {orders?.length === 0 ? <p>no data</p> : <> <Grid container>
            <Grid container item xs={12} sx={{ display: "flex" }}>
                <Grid item xs={12} md={4} sx={{ marginBottom: '20px' }}>
                    <Box
                        sx={{
                            position: "relative", color: theme.palette.text.white_black,
                            backgroundColor: theme.palette.bodyColor.white_333, width: "80%", zIndex: 1000, textTransform: "capitalize",
                            margin: "-20px 10% 5% 10%", height: "45px", borderBottom: "4px solid #ef7d00",
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center", fontSize: "14px",
                            fontFamily: "sans-serif",
                            "&.Mui-selected": {
                                color: theme.palette.orangePrimary.main,
                            },
                            marginRight: "60px",
                            borderRadius: "5px",
                        }} >
                        {t("newOrder")}
                    </Box>


                    {orders.map((order) => (
                        order?.phase === orderPhaseType.ACCEPTING && (
                            <OrderCard
                                key={order.id}
                                order={order}
                                isSelected={selectedOrder?.id === order.id}
                                onClick={() => handleOrderClick(order)}

                            />
                        )
                    ))}

                </Grid>

                <Grid item xs={12} md={4} sx={{ marginBottom: '20px' }}>
                    <Box
                        sx={{
                            position: "relative", color: theme.palette.text.white_black,
                            backgroundColor: theme.palette.bodyColor.white_333, width: "80%", zIndex: 1000, textTransform: "capitalize",
                            margin: "-20px 10% 5% 10%", height: "45px", borderBottom: "4px solid #ef7d00",
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center", fontSize: "14px",
                            fontFamily: "sans-serif",
                            "&.Mui-selected": {
                                color: theme.palette.orangePrimary.main,
                            },
                            marginRight: "60px",
                            borderRadius: "5px",
                        }} >
                        {t("accepted")}
                    </Box>
                    {orders.map((order) => (
                        (
                            order?.phase === orderPhaseType.PAYING ||
                            order?.phase === orderPhaseType.PREPAREING ||
                            order?.phase === orderPhaseType.SERVRING ||
                            order?.phase === orderPhaseType.DONING ||
                            order?.phase === orderPhaseType.CHOOSE_DELIVERY
                        )
                        && (
                            <OrderCard
                                key={order.id}
                                order={order}
                                isSelected={selectedOrder?.id === order.id}
                                onClick={() => handleOrderClick(order)}
                            />
                        )
                    ))}
                </Grid>

                <Grid item xs={12} md={4} sx={{ marginBottom: '20px' }}>
                    <Box
                        sx={{
                            position: "relative", color: theme.palette.text.white_black,
                            backgroundColor: theme.palette.bodyColor.white_333, width: "80%", zIndex: 1000, textTransform: "capitalize",
                            margin: "-20px 10% 5% 10%", height: "45px", borderBottom: "4px solid #ef7d00",
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center", fontSize: "14px",
                            fontFamily: "sans-serif",
                            "&.Mui-selected": {
                                color: theme.palette.orangePrimary.main,
                            },
                            marginRight: "60px",
                            borderRadius: "5px",
                        }} >
                        {t("done")}
                    </Box>
                    {orders.map((order) => order?.phase === orderPhaseType.CLOSING && (
                        (
                            <OrderCard
                                key={order.id}
                                order={order}
                                isSelected={selectedOrder?.id === order.id}
                                onClick={() => handleOrderClick(order)}

                            />
                        )
                    ))}
                </Grid>
            </Grid>

            {selectedOrder && (
                <Box   >
                    <Box>
                        {/* <OrderDetails
                                order={selectedOrder}
                                onReject={handleModalOpen}
                                closeDetails={handleCloseOrderDetailsOnMobile}// show x button on mobile to close this details panel
                                orderPhaseType={orderPhase}
                            /> */}
                        <OrderDetailsNew
                            order={selectedOrder}
                            onReject={handleModalOpen}
                            closeDetails={handleCloseOrderDetailsOnMobile}// show x button on mobile to close this details panel
                            // order control function
                            updateOrderPhase={updateOrderPhase}
                            removeOrder={removeOrder}
                            loginUser={client}
                        />
                    </Box>
                </Box>
            )}
        </Grid>

            <Box sx={{ marginTop: 'auto' }}>
                <Footer selectedOrder={selectedOrder} />
            </Box>
            <Box sx={{ height: '40px' }}>

            </Box>
            <RejectionModal open={modalOpen} onClose={handleModalClose} selectedOrder={selectedOrder} removeOrder={removeOrder} /></>}

    </Box>)


};

export default OrderBody;

export const orderEndPoint = {
    chef: {
        fetch: ['get_new_orders'],
        action: {
            accept: 'accept_order',//has body 
            prepared: 'order_prepared'
        }
    },
    cashier: {
        fetch: ['get_accepted_orders'],
        action: {
            receivePayment: 'payment_received',//has body 
        }
    },
    waiter: {
        fetch: ['get_prepared_orders'],
        action: {
            serve: 'order_served',//has body 
        }
    },
    admin: {
        fetch: ['get_served_orders', 'get_delivery_available', 'get_prepared_orders_delivery'],
        action: {
            orderDone: 'order_done',
            chooseDelivery: 'choose_delivery',
            orders: 'orders'
        }
    },
    delivery: {
        fetch: {
            getPerepared: 'get_prepared_orders_delivery',
            delivered: 'Daily_Delivered_Orders/',// take param -> /:id
            totalDelivered: 'Total_Delivered_Orders/',// take param -> /:id
            canceledOrder: 'Daily_Cancaled_Orders/8',// take param -> /:id
        },
        action: {
            orederDelivered: 'order_delivered',//has body 
            changeStatus: 'update_delivery_status',//has body 
        }
    }
}
/* 
backend :
--------
neworder 
accepted
payment
recive
prepared
served
delivred done
*/
export const orderPhaseType = Object.freeze({
    ACCEPTING: 'accept',//accept the order',
    PAYING: 'pay',//pay the order',
    PREPAREING: 'perpare',//prepare the order',
    SERVRING: 'served',//order ready to serve',
    CHOOSE_DELIVERY: 'chooseDelivery',
    DONING: 'done',//order served'
    CLOSING: 'close'
})