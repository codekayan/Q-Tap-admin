import { useTheme } from '@emotion/react';
import { Button, Card, CardContent, Divider, Grid, IconButton, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Alarm } from './Alarm';
import { Box } from '@mui/system';
import CheckIcon from '@mui/icons-material/Check';
import { orderPhaseType, orderEndPoint } from './OrderBody';
import Pusher from 'pusher-js';
import { BASE_URL } from "../../../../utils/constants"
const OrderDetailsNew = ({
    order,
    onReject, // open reject form panel
    closeDetails, // close this panel
    updateOrderPhase,
    removeOrder,
    loginUser
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const printRef = useRef();
    const navigate = useNavigate();
    const theme = useTheme();
    const { t } = useTranslation()

    const [preparingTime, setPreparingTime] = useState('');
    const [delivery, setDelivery] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null)
    const [selectedDeliveryId, setSelectedDeliveryId] = useState("")
    useEffect(() => {
        const getDelivery = async () => {
            try {

                if (isLoading) return;
                setIsLoading(true)
                const res = await axios.get(`${BASE_URL}${orderEndPoint.admin.fetch[1]}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('Token')}`
                        },

                    }
                )

                setDelivery(res.data.delivery_riders)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        if (loginUser.user.role === 'admin')
            getDelivery()
    }, [])


    if (!order) {
        return <div>No order selected</div>;
    }



    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };


    const chefAcceptOrderRequest = async () => {
        setIsLoading(true)
        if (isLoading) return;
        if (preparingTime === '') {
            toast.error("please enter Preparing Time")
            setIsLoading(false)
            return;
        }
        const data = {
            "order_id": order.id,
            "status": "accepted",
            "note": "test",
            time: preparingTime
        }
        try {
            setIsLoading(true)
            const res = await axios.post(`${BASE_URL}${orderEndPoint.chef.action.accept}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`
                    },

                }
            )
            toast.done('success')
            // save order to localstorage
            const chefAcceptedOrder = localStorage.getItem('chefAcceptedOrder')
            const chefAcceptedOrderLocal = chefAcceptedOrder ? JSON.parse(chefAcceptedOrder) : [];

            order.phase = orderPhaseType.PREPAREING
            order.chef = loginUser?.user

            const fnorder = JSON.stringify([...chefAcceptedOrderLocal, order])
            localStorage.setItem('chefAcceptedOrder', fnorder)
            updateOrderPhase(order.id, orderPhaseType.PREPAREING)

        } catch (error) {
            console.log('accept error', error)
        } finally {
            closeDetails()
            setIsLoading(false)
        }
    }

    const chefPreparedOrderRequest = async () => {
        try {
            const data = {
                "order_id": order.id,
                "status": "prepared",
                "note": `chef : ${loginUser.user.name} finish order ${order.id}`
            }
            if (isLoading) return;
            setIsLoading(true)
            const res = await axios.post(`${BASE_URL}${orderEndPoint.chef.action.prepared}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`
                    },

                }
            )

            const chefAcceptedOrder = localStorage.getItem('chefAcceptedOrder')
            const chefAcceptedOrderLocal = chefAcceptedOrder ? JSON.parse(chefAcceptedOrder) : [];

            const newChefAcceptedOrder = chefAcceptedOrderLocal.filter((item) => item.id !== order.id)

            const fnorder = JSON.stringify([...newChefAcceptedOrder])
            localStorage.setItem('chefAcceptedOrder', fnorder)

            removeOrder(order.id)
        } catch (error) {
            console.log(error)
        } finally {
            closeDetails()
            setIsLoading(false)
        }
    }
    const cashierReceivePaymentRequest = async () => {
        try {
            const data = {
                "order_id": order.id,
                "status": "payment_received",
                "note": `cashier : ${loginUser.user.name} receive payment of order ${order.id}`
            }
            if (isLoading) return;
            setIsLoading(true)
            const res = await axios.post(`${BASE_URL}${orderEndPoint.cashier.action.receivePayment}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`
                    },

                }
            )
            removeOrder(order.id)
        } catch (error) {
            console.log(error)
        } finally {
            closeDetails()
            setIsLoading(false)
        }
    }

    const waiterServerPreparedOrderRequest = async () => {
        const data = {
            "order_id": order.id,
            "status": "served",
            "note": `waiter : ${loginUser.user.name} finish order ${order.id}`
        }
        try {

            if (isLoading) return;
            setIsLoading(true)
            const res = await axios.post(`${BASE_URL}${orderEndPoint.waiter.action.serve}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`
                    },

                }
            )

            removeOrder(order.id)
        } catch (error) {
            console.log(error)
        } finally {
            closeDetails()
            setIsLoading(false)
        }
    }

    const adminDoneOrderRequest = async () => {
        const data = {
            "order_id": order.id,
            "status": "done",
            "note": `admin : ${loginUser.user.name} make order : ${order.id} done`
        }

        try {

            if (isLoading) return;
            setIsLoading(true)

            const res = await axios.post(`${BASE_URL}${orderEndPoint.admin.action.orderDone}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`
                    },

                }
            )
            order.orders_processing.push({ status: 'close', created_at: new Date().toISOString() })
            updateOrderPhase(order.id, orderPhaseType.CLOSING, order)
            console.log("done res", res)
            closeDetails()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const chooseDelivery = async () => { /* if older delivery must select delivery to the order to make it done */
        try {

            if (isLoading) return;
            setIsLoading(true)

            if (!selectedDelivery) { toast.error('plz select Delivery'); return; }

            const deliveryData = {
                "order_id": order.id,
                "status": "delivery",
                "delivery_rider_id": selectedDelivery.id,
                "note": ` delivery ${selectedDelivery.name} take order ${order.id}`,
            }
            /* after select delivery add it to the order throw request */
            const setDelivery = await axios.post(`${BASE_URL}choose_delivery`,
                deliveryData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`
                    },
                }
            )
             removeOrder(order.id)
             closeDetails()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const adminCloseOrder = async () => {
        removeOrder(order.id)
        closeDetails()
    }

    const getNameById = (id, searchArray) => {
        const item = searchArray.find(obj => obj.id === id);
        return item ? item.name : 'Not Found';  // Default to 'Not Found' if id doesn't exist
    };

    return (
        <Card sx={{ maxWidth: 400, height: "100vh", overflowY: 'auto', zIndex: 1001, width: { xs: '80%', md: "22%" }, backgroundColor: theme.palette.bodyColor.white_333, position: "fixed", top: 0, right: 0, }}>
            <Button sx={{ position: 'absolute', top: '10px', zIndex: 1000 }} onClick={closeDetails}>close</Button>
            <Alarm />

            <CardContent>
                <Box sx={{ padding: '5px 10px' }} ref={printRef}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ backgroundColor: '#73CB3C', padding: '3px 13px', borderRadius: '20px', }}>
                            <Typography variant="body2" sx={{ fontSize: "11px", color: theme.palette.secondaryColor.main }}>
                                {t("id")} #{order.id}</Typography>
                        </Box>

                        <Typography color={false ? "green" : "red"} fontSize="11px" display={"flex"} alignItems={"center"}>
                            <img src="/assets/balance.svg" alt="icon" style={{ width: "18px", marginRight: "6px", height: "18px" }} />
                            {order?.payment_status === "unpaid" ? t("unpaid") : t("paid")}
                        </Typography>
                    </Box>

                    <Divider sx={{ margin: '10px 0' }} />

                    <Typography variant="subtitle1" sx={{ fontSize: "12px" }}>{t("orderDetail")}
                        <span class="icon-edit" style={{ fontSize: "15px", marginLeft: "12px", color: theme.palette.orangePrimary.main }}></span>
                    </Typography>
                    {/* order details - > meal : name , quantity and price */}
                    {order?.meal_id?.map((id, index) => {
                        const item = order?.meals.find(item => item.id == id);
                        return (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "4px 0",
                                    fontSize: "10px", color: "gray",
                                }}
                            >
                                <Typography variant="body2" sx={{ fontSize: "10px", color: "#AAAAAA" }}>
                                    {order?.quantity[index]} x {item?.name} {order?.size[index] && `(size: ${order.size[index]})`}
                                    {order?.extras?.detailed?.[index] && order?.extras?.detailed?.[index]?.length > 0 ? <>{" " + t("extras ")}:{order?.extras?.detailed?.[index]?.map((item) => ` + ${item.name}`)}</> : ""}
                                    {order?.variants?.detailed?.[index] && order?.variants?.detailed?.[index]?.length > 0 ? <>{" " + t("variants ")}:{order?.variants?.detailed?.[index]?.map((item) => ` + ${item.name}`)}</> : ""}
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: "15px",
                                            borderRight: "1px solid #ef7d00",
                                            margin: "0 6px",
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ fontSize: "10px", color: "#AAAAAA" }}>
                                        {order?.size[index] && order.size[index] === 'l' ? item?.price_large : ""}
                                        {order?.size[index] && order.size[index] === 'm' ? item?.price_medium : ""}
                                        {order?.size[index] && order.size[index] === 's' ? item?.price_small : ""}
                                        EGP
                                    </Typography>
                                </Box>
                            </Box>
                        )
                    })}
                    {/* section 2 */}
                    <Typography variant="subtitle1" fontSize="12px" paddingTop="6px">{t("comment")}</Typography>
                    <Typography variant="body2" fontSize="11px" color="#AAAAAA" padding="0px 8px">{order?.comments}</Typography>

                    <Typography variant="subtitle1" fontSize="12px" paddingTop="6px">{t("paymentMethod")}</Typography>
                    <Typography variant="body2" color="#AAAAAA" fontSize="11px" padding="0px 8px">{t(order?.payment_way)}</Typography>

                    <Typography variant="subtitle1" fontSize="12px" paddingTop="6px">{t("dineMethod")} <span style={{ color: theme.palette.orangePrimary.main, fontSize: "11px" }}>{t(order?.type)}: </span></Typography>

                    {/* 
                    **
                    ** options for each dine in method  
                    **
                    */}

                    {order?.type === 'dinein' &&
                        <Typography variant="body2" color="#AAAAAA" fontSize="11px" padding="0px 8px">
                            {t(order?.type)}
                            <Typography sx={{ color: "#AAAAAA", fontSize: "10px" }}>
                                <span style={{ color: theme.palette.orangePrimary.main, fontSize: "11px" }}>{t("table.one")}: </span>
                                {order.type}
                            </Typography>
                            <Typography sx={{ color: "#AAAAAA", fontSize: "10px" }}>
                                <span style={{ color: theme.palette.orangePrimary.main, fontSize: "11px" }}> {t("area")}: </span>
                                {order.phone}
                            </Typography>
                        </Typography>
                    }
                    {/** delivery order*/}
                    {order?.type === 'delivery' && loginUser.user.role === 'admin' && order.phase !== orderPhaseType.CLOSING &&
                        (
                            <>
                                <Typography variant="body2" color="textSecondary" fontSize="12px" padding="0px 8px">
                                    {t(order?.type)}
                                    <Typography sx={{ color: "gray", fontSize: "11px" }}>
                                        <span style={{ color: theme.palette.orangePrimary.main, fontSize: "10px" }}>{t("name")}:</span>
                                        {order?.name}
                                    </Typography>
                                    <Typography sx={{ color: "gray", fontSize: "11px" }}>
                                        <span style={{ color: theme.palette.orangePrimary.main, fontSize: "10px" }}> {t("mobileNumber")} :</span>
                                        {order?.phone}
                                    </Typography>
                                    <Typography sx={{ color: "gray", fontSize: "11px" }}>
                                        <span style={{ color: theme.palette.orangePrimary.main, fontSize: "10px" }}> {t("address")} :</span>
                                        {order?.address}
                                    </Typography>
                                </Typography>
                                {/* choose the delivery */}
                                {!order?.orders_processing?.find(i => i.status === 'delivered') ?
                                    (<>
                                        <Typography variant="subtitle1" fontSize="12px" paddingTop="6px">{t("deliveryRiders")}</Typography>
                                        <Box display="flex" alignItems="center"  >
                                            <TextField
                                                select
                                                onChange={e => {
                                                    const selectedId = e.target.value;
                                                    setSelectedDeliveryId(selectedId)
                                                    const selectedItem = delivery.find(item => item.id.toString() === selectedId);
                                                    setSelectedDelivery(selectedItem);
                                                }
                                                }
                                                placeholder={t("deliveryRiders")}
                                                value={selectedDeliveryId}
                                                SelectProps={{
                                                    native: true,
                                                }}
                                                sx={{
                                                    minWidth: '150px',
                                                    marginRight: '10px',
                                                    '& .MuiInputBase-root': {
                                                        padding: '0px 3px',
                                                        fontSize: '10px',
                                                        height: '30px', borderRadius: "8px", color: "gray"
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        fontSize: '12px',
                                                    },

                                                }}
                                            >
                                                {delivery && delivery?.length > 0 ? (<>

                                                    <option value="" disabled >No delivery to select</option>
                                                    {delivery?.map((item, index) => (
                                                        <option
                                                            key={index}
                                                            value={item.id}
                                                            style={{ fontSize: '12px', color: 'gray' }}
                                                        >
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </>
                                                )
                                                    : (
                                                        <option disabled>No delivery to select</option>
                                                    )}
                                            </TextField>

                                            <IconButton sx={{ backgroundColor: theme.palette.orangePrimary.main, color: 'white', marginRight: '5px', borderRadius: "8px" }}>
                                                <span class="icon-send" style={{ fontSize: "16px", color: "white" }} />
                                            </IconButton>

                                            <IconButton sx={{ backgroundColor: theme.palette.secondaryColor.main, color: 'white', borderRadius: "8px" }}>
                                                <span class="icon-map-1" style={{ fontSize: "16px", color: "white" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span></span>
                                            </IconButton>
                                        </Box>
                                    </>)
                                    :
                                    (<>
                                        <Typography sx={{ color: "gray", fontSize: "11px" }}>
                                            <span style={{ color: theme.palette.orangePrimary.main, fontSize: "22px" }}> {t("delivered")}</span>
                                        </Typography>
                                    </>)}
                            </>
                        )}
                    {/* 
                    **
                    ** options for each PHASE 
                    **
                    */}
                    {order?.phase === orderPhaseType.ACCEPTING && (<>
                        <Typography variant="subtitle1" fontSize="11px" paddingTop="6px" >
                            <span class="icon-chef" style={{ fontSize: "14px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
                            {t("Chef")}
                        </Typography>
                        <Typography variant="subtitle1" fontSize="11px" paddingTop="6px" >
                            {loginUser?.user?.name}
                        </Typography>
                        <Typography variant="subtitle1" fontSize="11px" paddingTop="6px" >
                            <span class="icon-circular-clock" style={{ fontSize: "14px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
                            {t("preparingTime")}</Typography>
                        <TextField
                            placeholder="0.0"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={preparingTime}
                            onChange={(e) => { setPreparingTime(e.target.value) }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <span style={{ fontSize: "8px" }}>{t("min")}</span>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: '100%',
                                '& .MuiInputBase-root': {
                                    height: '28px',
                                    fontSize: '12px',
                                    color: "gray",
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'gray',
                                },
                            }}
                        />
                    </>
                    )}
                    {(order?.phase === orderPhaseType.PAYING || order?.phase === orderPhaseType.PREPAREING) && (
                        <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>

                            <Grid item xs={5}>

                                <Typography variant="subtitle1" fontSize="11px" paddingTop="6px" >
                                    <span class="icon-chef" style={{ fontSize: "14px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
                                    {t("Chef")} :
                                </Typography>
                                <Typography variant="body2" color="textSecondary" fontSize={"10px"} marginLeft={"10px"}>{order?.chef?.name}</Typography>
                            </Grid>


                            <Grid item xs={7}>
                                <Typography variant="subtitle1" fontSize="11px" paddingTop="6px" >
                                    <span class="icon-circular-clock" style={{ fontSize: "14px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
                                    {t("preparingTime")}</Typography>
                                <Typography variant="body2" color="textSecondary" fontSize={"10px"} marginLeft={"10px"}>{preparingTime}
                                    <span style={{ marginLeft: "5px" }}>{t("min")}</span>
                                </Typography>

                            </Grid>
                        </Grid>
                    )}
                    {order?.phase === orderPhaseType.PAYING
                        && (<>
                            <Grid item xs={12} sx={{ marginTop: "-10px" }} >
                                <Typography variant="subtitle1" fontSize="11px" paddingTop="6px" >
                                    <span class="icon-cashier" style={{ fontSize: "14px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
                                    {t("Cashier")}
                                </Typography>
                                <Typography variant="subtitle1" fontSize="11px" paddingTop="6px" >
                                    {loginUser?.user?.name}
                                </Typography>
                            </Grid>
                        </>
                        )
                    }
                    {order?.phase === orderPhaseType.PREPAREING
                        && (<>

                            <Grid item xs={5} sx={{ marginTop: "-10px" }}>
                                <Typography variant="subtitle1" fontSize="11px" paddingTop="6px" >
                                    <span class="icon-cashier" style={{ fontSize: "14px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
                                    {t("Cashier")}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" fontSize={"10px"} marginLeft={"10px"}>{'selectedCashier'}</Typography>
                            </Grid>
                        </>)
                    }

                    {order?.phase === orderPhaseType.SERVRING
                        && (<Grid item xs={7} sx={{ marginTop: "-10px" }}>
                            <Typography variant="subtitle1" fontSize="11px" paddingTop="6px" >
                                <span class="icon-waiter-1" style={{ fontSize: "14px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span></span>
                                {t("Waiter")}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" fontSize={"10px"} marginLeft={"10px"}>{'selectedWaiter'}</Typography>
                        </Grid>)
                    }
                    {/* 
                    **
                    ** payment calculation  
                    **
                    */}
                    <Divider sx={{ margin: '10px 0' }} />

                    <Grid container>
                        <Grid item xs={8}>
                            <Typography variant="body2" fontSize="10px" padding="0px 3px">
                                <span style={{ color: '#9d9d9c' }}>{t("subTotal")}</span> {order?.total_price?.toFixed(2) - order?.tax?.toFixed(2)} EGP
                            </Typography>
                            <Typography variant="body2" fontSize="10px" padding="0px 3px">
                                <span style={{ color: '#9d9d9c' }}>{t("tax")}</span> {order?.tax?.toFixed(2)} EGP
                            </Typography>
                            <Typography variant="body2" fontSize="10px" padding="0px 3px">
                                <span style={{ color: '#9d9d9c' }}>{t("discounts")} -</span> {order?.discount?.toFixed(2)} EGP
                            </Typography>
                            <Typography variant="h6" sx={{ marginTop: '8px', fontSize: "10px" }}>
                                <span style={{ color: '#9d9d9c' }}>{t("total")}</span> {order?.total_price?.toFixed(2)} EGP
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'right', width: "20%" }}>
                            <Typography variant="body2" fontSize="9px" color='#9d9d9c'>{order?.updated_at}</Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ margin: '10px 0' }} />
                    {/* 
                    **
                    ** ACTION button for each phase  
                    **
                    */}

                    {order.phase === orderPhaseType.ACCEPTING && (<>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    onClick={() => { onReject() }}
                                    disabled={isLoading}
                                    sx={{
                                        textTransform: "capitalize",
                                        backgroundColor: theme.palette.secondaryColor.main,
                                        fontSize: "11px",
                                        width: "100%",
                                        borderRadius: "20px",
                                        color: theme.palette.text.black_white,
                                        '&:hover': {
                                            backgroundColor: '#2a2a60',
                                        }
                                    }}
                                >
                                    <span class="icon-close" style={{ fontSize: "10px", marginRight: "6px" }}></span>
                                    {t("reject")}
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    onClick={() => { chefAcceptOrderRequest() }}
                                    sx={{
                                        textTransform: "capitalize",
                                        backgroundColor: theme.palette.orangePrimary.main,
                                        fontSize: "11px",
                                        width: "100%",
                                        borderRadius: "20px",
                                        '&:hover': {
                                            backgroundColor: '#D96A09',
                                        }
                                    }}
                                >
                                    <CheckIcon sx={{ color: "green", fontSize: "18px", marginRight: "3px" }} />
                                    {t("accept")}
                                </Button>
                            </Grid>
                        </Grid>
                    </>)}

                    {order?.phase === orderPhaseType.PAYING && (<>
                        <Grid item xs={12} display={"flex"}>
                            <Button
                                onClick={() => { cashierReceivePaymentRequest() }}
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    textTransform: "capitalize",
                                    backgroundColor: theme.palette.secondaryColor.main,
                                    fontSize: "11px",
                                    width: "90%",
                                    padding: 0,
                                    borderRadius: "20px",
                                    color: theme.palette.text.black_white,
                                    '&:hover': {
                                        backgroundColor: theme.palette.secondaryColor.main,
                                    }
                                }}
                            >
                                <img src="/assets/balance.svg" alt="icon" style={{ color: theme.palette.orangePrimary.main, width: "18px", marginRight: "6px", height: "18px" }} />
                                {t("paymentReceived")}
                            </Button>

                            <Button>
                                <span class="icon-delete" style={{ color: "red", fontSize: "20px" }} />
                            </Button>
                        </Grid>
                    </>)}

                    {order?.phase === orderPhaseType.PREPAREING && (<>
                        <Grid item xs={12} display={"flex"}>
                            <Button
                                onClick={() => { chefPreparedOrderRequest() }}
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    textTransform: "capitalize",
                                    backgroundColor: theme.palette.secondaryColor.main,
                                    fontSize: "11px",
                                    width: "90%",
                                    borderRadius: "20px",
                                    color: theme.palette.text.black_white,
                                    '&:hover': {
                                        backgroundColor: theme.palette.secondaryColor.main,
                                    }
                                }}
                            >
                                <span class="icon-chef" style={{ fontSize: "18px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
                                {t("prepared")}
                            </Button>

                            <Button onClick={handlePrint}>
                                <span class="icon-printer" style={{ color: "gray", fontSize: "22px", marginRight: "3px" }} ></span>
                            </Button>
                        </Grid>
                    </>)}

                    {order?.phase === orderPhaseType.SERVRING && (<>
                        <Grid item xs={12} display={"flex"}>
                            <Button
                                onClick={() => { waiterServerPreparedOrderRequest() }}
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    textTransform: "capitalize",
                                    backgroundColor: theme.palette.secondaryColor.main,
                                    fontSize: "13px",
                                    width: "70%",
                                    borderRadius: "20px",
                                    color: theme.palette.text.black_white,
                                    '&:hover': {
                                        backgroundColor: '#2a2a60',
                                    }
                                }}
                            >
                                <span class="icon-waiter" style={{ fontSize: "16px", color: theme.palette.orangePrimary.main, marginRight: "6px" }}></span>
                                {t("served")}
                            </Button>
                        </Grid>
                    </>)}
                    {order?.phase === orderPhaseType.CHOOSE_DELIVERY && (<>
                        <Grid item xs={12} display={"flex"}>
                            <Button
                                onClick={() => { chooseDelivery() }}
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    textTransform: "capitalize",
                                    backgroundColor: theme.palette.secondaryColor.main,
                                    fontSize: "13px",
                                    width: "70%",
                                    borderRadius: "20px",
                                    color: theme.palette.text.black_white,
                                    '&:hover': {
                                        backgroundColor: theme.palette.secondaryColor.main,
                                    }
                                }}
                            >
                                <span class="icon-double-check" style={{ fontSize: "22px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>

                                {t("done")}
                            </Button>
                        </Grid>
                    </>
                    )}
                    {order?.phase === orderPhaseType.DONING && (<>
                        <Grid item xs={12} display={"flex"}>
                            <Button
                                onClick={() => { adminDoneOrderRequest() }}
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    textTransform: "capitalize",
                                    backgroundColor: theme.palette.secondaryColor.main,
                                    fontSize: "13px",
                                    width: "70%",
                                    borderRadius: "20px",
                                    color: theme.palette.text.black_white,
                                    '&:hover': {
                                        backgroundColor: theme.palette.secondaryColor.main,
                                    }
                                }}
                            >
                                <span class="icon-double-check" style={{ fontSize: "22px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>

                                {t("done")}
                            </Button>
                        </Grid>
                    </>
                    )}

                    {order?.phase === orderPhaseType.CLOSING && (<>
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", textAlign: "center", }}>
                            <Button
                                onClick={() => {
                                    // navigate('/dashboard-client')
                                    adminCloseOrder()
                                }}
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    textTransform: "capitalize",
                                    backgroundColor: theme.palette.secondaryColor.main,
                                    fontSize: "12px",
                                    width: "60%",
                                    borderRadius: "20px",
                                    color: theme.palette.text.black_white,
                                    '&:hover': {
                                        backgroundColor: theme.palette.secondaryColor.main,
                                    }
                                }}
                            >
                                <span class="icon-close-1"
                                    style={{ color: theme.palette.orangePrimary.main, fontSize: "13px", marginRight: "6px" }}></span>
                                {t("close")}
                            </Button>
                        </Grid>
                    </>)}

                </Box>
            </CardContent>
        </Card >
    )
}

export default OrderDetailsNew