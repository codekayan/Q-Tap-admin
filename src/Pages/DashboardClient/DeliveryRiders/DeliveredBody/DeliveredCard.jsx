import React, { useContext } from 'react';
import { Card, Box, Typography, Button, Divider, useTheme, CircularProgress } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { OrderContext } from './DeliveredContext';
import { useTranslation } from 'react-i18next';
import { formateDate } from '../../../../utils/formateDateFn';
import { BASE_URL } from "../../../../utils/constants"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { markOrderDelivered, selectActionError, selectActionStatus, selectPreparedOrders } from '../../../../store/client/deliveryOrderSlic';

export const DeliveredCard = ({ setSelectedOrder, setIsOrderDetailsOpen }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const orders = useSelector(selectPreparedOrders)
  const actionStatus = useSelector(selectActionStatus)
  const actionError = useSelector(selectActionError)
  const dispatch = useDispatch()
  const handleOpen = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true)
  }

  const action = Object.freeze({
    delivered: 'delivered',
    canceled: 'cancelled'
  })
  const handleDeliveryAction = async (order, action) => {

    const data = {
      order_id: order?.id,
      status: action,
      note: "test delivery"
    }


    try {
      dispatch(markOrderDelivered(data)).unwrap()
      // const res = await axios.post(`${BASE_URL}order_delivered`, data, { headers })
    }
    catch (error) {
      console.log(error)
      toast.error("something go wrong check your internet connection and try again")
    }
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          position: 'relative',
          padding: '12px 0',
          cursor: 'pointer',
          alignItems: "center",
          justifyContent: "center",
          marginTop: "-25px", zIndex: "5"
        }}
      >
        <Typography variant="body1" sx={{ color: '#333' }}>
          {t("newOrders")}
        </Typography>
        <Box
          sx={{
            height: '5px',
            width: '100%',
            position: 'absolute',
            bottom: 0,
            borderRadius: '0 0 8px 8px',
            background: `linear-gradient(to right, ${theme.palette.gradient.yellow}, ${theme.palette.gradient.deepOrange})`,
          }}
        />
      </Box> {/*Tabs */}

      {orders?.map((order) => {
        const { dayName, formattedDate, time } = formateDate(order.updated_at)
        return (
          <Card sx={{ marginTop: "15px", marginBottom: "30px", borderRadius: "8px" }} key={order.id}>
            <Box display="flex" justifyContent="space-between"
              sx={{ backgroundColor: theme.palette.secondaryColor.main, padding: "7px 15px", }}>
              <Typography
                variant="body1"
                sx={{
                  color: "white", fontSize: "14px",
                  borderRadius: "10px 10px 0px 0px",
                  display: "flex", alignItems: "center"
                }}
              >
                <Box sx={{ width: "10px", height: "10px", borderRadius: "50%", marginRight: "10px", backgroundColor: theme.palette.orangePrimary.main }}></Box>
                ID #{order.id}
              </Typography>
              <Typography sx={{ fontSize: "13px", color: order.payment_status === "unpaid" ? 'red' : 'green' }}>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <img src="/assets/balance.svg" alt="icon" style={{ width: "16px", height: "16px", marginRight: "5px" }} />
                  <span>{t(order.payment_status)}</span>
                </Box>
              </Typography>

            </Box>
            <Box sx={{ padding: "7px 15px", textAlign: "end" }}>
              <Typography color="textSecondary" fontSize="12px" >{dayName + ',' + formattedDate + ',' + time}</Typography>
              <Divider sx={{ marginTop: "5px" }} />
            </Box>

            <Box sx={{ padding: "0px 15px", }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="#262624" fontSize="12px"  >{t("dineMethod")}</Typography>
                  <Typography color="textSecondary" fontSize="11px" marginLeft={"10px"} marginTop={"3px"}>{order.type},</Typography>
                </Box>

                <Box sx={{
                  backgroundColor: theme.palette.secondaryColor.main, width: "40px", height: "25px", borderRadius: "30px", display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <span class="icon-map-1" style={{ fontSize: "18px" }}>
                    <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span></span>

                </Box>
              </Box>
              <Typography color="textSecondary" fontSize="11px" >
                <span style={{ color: theme.palette.orangePrimary.main, marginLeft: "10px" }}>{t("address")} : </span>
                {order.address}</Typography>

              <Typography color="textSecondary" fontSize="11px" >
                <span style={{ color: theme.palette.orangePrimary.main, marginLeft: "10px" }}>{t("name")} : </span>
                {order.name}</Typography>

              <Typography color="textSecondary" fontSize="11px" >
                <span style={{ color: theme.palette.orangePrimary.main, marginLeft: "10px" }}>{t("mobileNumber")} : </span>
                {order.phone}</Typography>

              <Typography color="#262624" fontSize="12px" marginTop={"7px"}>{t("paymentMethod")}</Typography>
              <Typography color="textSecondary" fontSize="11px" marginLeft={"10px"} marginTop={"3px"}>
                {order.payment_way === 'cash' ?
                  <img src='/assets/cash.svg' alt='cash icon' style={{ width: "15px", height: "15px", marginRight: "6px" }} />
                  : <span class="icon-wallet" style={{ fontSize: "20px", mr: 1 }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span></span>
                } {t(order.payment_way)}</Typography>

              <Box display="flex" justifyContent={"space-between"} alignItems="center">
                <Typography color="#262624" fontSize="12px" marginTop={"7px"}>{t("orderDetail")}</Typography>
                {actionStatus === "loading" ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: 'black',
                      alignItems: "center"
                    }} />
                ) : (
                  <Button onClick={() => handleOpen(order)}
                    disabled={actionStatus === "loading"}>
                    <Typography display={"flex"} sx={{ cursor: "pointer" }}>

                      <span class="icon-file" style={{ fontSize: "16px", color: theme.palette.orangePrimary.main }}></span>
                      <Typography color="textSecondary" fontSize="10px">
                        <span style={{ borderBottom: "1px solid gray" }}>{t("view")}</span>
                      </Typography>
                      <KeyboardArrowRightIcon sx={{ color: theme.palette.orangePrimary.main, fontSize: "16px" }} />
                    </Typography>
                  </Button>
                )}


              </Box>
              <Divider sx={{ margin: "10px 0px" }} />
            </Box>

            <Box sx={{ padding: "0px 15px", }}>
              <Typography color="#2A2A28" fontSize="12px" >{t("total")}
                <span style={{ color: theme.palette.orangePrimary.main }}>{order.total_price}</span>
                <span style={{ color: theme.palette.orangePrimary.main, fontSize: "8px" }}> EGP</span></Typography>

              <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} margin={"20px 0px 15px 0px"}>
                {actionStatus === "loading" ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: 'white',
                      alignItems: "center"
                    }} />
                ) : (<>

                  <Button
                    disabled={actionStatus === "loading"}
                    onClick={() => handleDeliveryAction(order, action.canceled)}>
                    <Typography
                      color="black" fontSize="12px" marginLeft={"15px"} ><span class="icon-close"></span> {t("cancel")}
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => handleDeliveryAction(order, action.delivered)}
                    variant="contained" sx={{
                      background: `linear-gradient(to right, ${theme.palette.gradient.orange}, ${theme.palette.gradient.deepOrange})`, padding: "5px 25px",
                      color: "white", textTransform: "capitalize", borderRadius: "30px", fontSize: "12px"
                    }}
                  >
                    <img src="/assets/balance.svg" alt="icon" style={{ width: "16px", height: "16px", marginRight: "5px" }} /> {t("cashReceived")}

                  </Button>
                </>
                )}

              </Box>
            </Box>
          </Card>
        )
      })}
    </>
  )
}
