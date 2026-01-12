import React, { useContext, useRef } from 'react';
import { Box, Typography, IconButton, Grid, Paper, Divider, useTheme } from '@mui/material';
import { OrderContext } from './DeliveredContext';
import { useTranslation } from 'react-i18next';
import { formateDate } from '../../../../utils/formateDateFn';



export const DeliveredDetails = ({ selectedOrder, isOrderDetailsOpen, setSelectedOrder, setIsOrderDetailsOpen }) => {
  const printRef = useRef();
  // const { open, selectedOrder, handleClose } = useContext(OrderContext);

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };
  const { t } = useTranslation();
  const theme = useTheme();

  const closePanel = () => {
    setIsOrderDetailsOpen(false)
    setSelectedOrder(null)
  }
  let dayName = null, formattedDate = null, time = null;

  if (selectedOrder?.created_at) {
    ({ dayName, formattedDate, time } = formateDate(selectedOrder.created_at));
  }
  return (
    isOrderDetailsOpen && selectedOrder && (
      <Paper className='detailsheres'
        ref={printRef}
        sx={{
          width: "90%",
          backgroundColor: "white",
          borderRadius: "10px",
          minWidth: { md: '600' },
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 111,
        }}
      >
        <Box sx={{ padding: '10px 20px' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box sx={{ alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: 'gray', fontSize: "11px" }}>
                {dayName + formattedDate + time}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", textAlign: "center", alignItems: "center" }}>
              <IconButton onClick={handlePrint} >
                <span className='icon-printer' style={{ fontSize: "18px" }} />
              </IconButton>

              <IconButton onClick={closePanel}>
                <span className="icon-close-1" style={{ fontSize: "12px" }}></span>
              </IconButton>
            </Box>
          </Box>  {/*Header */}
          <Divider />
          {/* section --- dine method & order details --- */}
          <Grid container spacing={3} sx={{ marginTop: '0px', justifyContent: "space-around", whiteSpace: 'wrap' }}>

            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="#262624" fontSize="12px"  >{t("dineMethod")}</Typography>
                  <Typography color="textSecondary" fontSize="11px" marginLeft={"10px"} marginTop={"3px"}>{t(selectedOrder?.type)},</Typography>
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
                <span style={{ color: theme.palette.orangePrimary.main, marginLeft: "10px" }}>{t("address")} </span>
                {selectedOrder.address}</Typography>

              <Typography color="textSecondary" fontSize="11px" >
                <span style={{ color: theme.palette.orangePrimary.main, marginLeft: "10px" }}>{t("name")} : </span>
                {selectedOrder.name}</Typography>

              <Typography color="textSecondary" fontSize="11px" >
                <span style={{ color: theme.palette.orangePrimary.main, marginLeft: "10px" }}>{t("mobileNumber")} : </span>
                {selectedOrder.phone}</Typography>

              <Typography color="#262624" fontSize="12px" marginTop={"15px"}>{t("paymentMethod")}</Typography>
              <Typography color="textSecondary" fontSize="11px" marginLeft={"10px"} marginTop={"3px"}>
                {selectedOrder.payment_way === 'cash' ?
                  <img src='/assets/cash.svg' alt='cash icon' style={{ width: "15px", height: "15px", marginRight: "6px" }} />
                  : <span class="icon-wallet" style={{ fontSize: "20px", mr: 1 }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span></span>
                }
                {t(selectedOrder.payment_way)}</Typography>
              <Typography color="#262624" fontSize="12px" marginTop={"15px"}>{t("paymentStatus")}</Typography>
              <Box display="flex" alignItems="center" marginLeft={"10px"} marginTop={"6px"}>
                <img src="/assets/balance.svg" alt="icon" style={{ width: "16px", height: "16px", marginRight: "5px" }} />
                <Typography sx={{ color: selectedOrder.payment_status === "unpaid" ? 'red' : 'green' }} fontSize="11px"  >
                  {t(selectedOrder.payment_status)}</Typography>
              </Box>


            </Grid>
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                background: "#D8E0E0",
                width: '1px', marginTop: "20px", transform: 'scaleX(0.5)',
                display: { xs: 'none', md: 'block' }
              }}
            />
            <Grid item xs={12} md={5} sx={{ padding: "0px 15px", whiteSpace: 'wrap' }} >
              <Box>
                <Typography color="#262624" fontSize="12px" marginBottom={"10px"} >{t("orderDetail")}</Typography>
                {selectedOrder.meals.map((mealItem, index) => (
                  <Grid container alignItems="center" key={index}   >
                    <Grid item xs={8}>
                      <Typography variant="body2" sx={{ color: 'gray', fontSize: "11px", marginBottom: "7px" }}>
                        <span style={{ color: theme.palette.orangePrimary.main }}> {selectedOrder.quantity?.[index]}x</span>
                        <span style={{ color: "black" }}> {mealItem.name}</span> (Size:{selectedOrder.size?.[index]}), Variants + Extra
                      </Typography>
                    </Grid>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        background: 'linear-gradient(to Bottom, #f57c00, #fbc02d)',
                        width: '1px', transform: 'scaleX(0.5)'
                      }}
                    />

                    <Grid item xs={3}>
                      <Typography variant="body2" align="right" sx={{ color: "gray", fontSize: "11px", marginBottom: "7px" }}>
                        {mealItem.price} EGP
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Box>
              <Divider style={{ color: "#D8E0E0", marginTop: "15px", marginBottom: "10px" }} />

              <Typography variant="body1"  >
                <Typography variant="body2" component="span" sx={{ color: theme.palette.orangePrimary.main, fontSize: "12px" }}>
                  <span style={{ color: "#262624", fontSize: "12px" }}>{t("total")}: </span>
                  {selectedOrder.total_price} <span style={{ color: theme.palette.orangePrimary.main, fontSize: "8px" }}>EGP</span>
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </Box>


        <Grid container sx={{
          marginTop: '10px', padding: "5px 30px", color: "white", justifyContent: "space-between",
          borderRadius: "0px 0px 8px 8px", backgroundColor: theme.palette.secondaryColor.main
        }}>

          <Typography variant="body2" sx={{ fontSize: "14px", display: "flex", alignItems: "center" }}  >
            <Box sx={{ width: "10px", height: "10px", backgroundColor: theme.palette.orangePrimary.main, borderRadius: "50%", marginRight: "6px" }}></Box>
            ID #{selectedOrder.id}
          </Typography>

          <Typography variant="body2" sx={{ fontSize: "12px", display: "flex", alignItems: "center" }} >
            {"selectedOrder.icon"} {t(selectedOrder.payment_status)}
          </Typography>
        </Grid> {/* footer */}


      </Paper >
    )
  );
};
