import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';


const OrderCard = ({ order, isSelected, onClick, isAccepted, isPayment, isServed, isDone, isClose }) => {
    const {t} = useTranslation()
    const theme = useTheme();
    if (!order || !order.id) {
        return null;
    }

    return (
        <Card
            sx={{
                width: "80%",
                margin: "10px 10%",
                marginBottom: "15px",
                borderRadius: "10px",
                backgroundColor: theme.palette.bodyColor.whiteGray_lightBlack,
                cursor: "pointer",
                transition: "all 0.3s ease-in-out, top 0.1s ease-in-out",

            }}
            key={order.id}
            onClick={onClick}
        >
            <CardContent sx={{ padding: 0, width: "100%" }}>
                <Typography
                    variant="body1"
                    sx={{
                        backgroundColor: isAccepted || isSelected ? theme.palette.secondaryColor.main : theme.palette.bodyColor.gray_lightBlack40,
                        padding: "7px",
                        fontSize: "15px",
                        textAlign: "center",
                        borderRadius: "10px 10px 0px 0px",
                        color: "white",
                    }}
                >
                    {t("id")} #{order.id}
                </Typography>

                {isAccepted ? (
                    <>

                        <Box display="flex" justifyContent="space-between">
                            <Typography color="textSecondary" fontSize="12px" padding="10px 20px 5px 20px">
                                {t("chef")}: <span>{order.chef}</span>
                            </Typography>

                            <Typography color={isPayment ? "green" : "red"}
                                fontSize="11px" padding="10px 20px 5px 20px" sx={{ display: "flex", alignItems: "center" }}>
                                <img src="/assets/balance.svg" alt="icon" style={{ width: "18px", marginRight: "6px", height: "18px" }} />
                                {isPayment ? 'Paid' : order.pay}
                            </Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between">
                            <Typography color="textSecondary" fontSize="12px" padding="0px 0px 5px 20px">
                                {t("prTime")}: <span>{order.preparingTime}</span> {t("min")}
                            </Typography>
                            <Typography color="textSecondary" fontSize="12px" padding="0px 10px 5px 10px">
                                {isClose ?
                                    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", color: "black" }}>
                                        <span class="icon-double-check" style={{ fontSize: "20px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>
                                        {t("done")}
                                    </Box>
                                    :
                                    isServed ? (
                                        isDone ?

                                            <Box component="span" sx={{ display: "inline-flex", alignItems: "center", color: "black" }}>
                                                <span class="icon-waiter" style={{ fontSize: "16px", color: theme.palette.orangePrimary.main, marginRight: "6px" }}></span>
                                                {t("served")}
                                            </Box>
                                            : (
                                                <Box component="span" sx={{ display: "inline-flex", alignItems: "center", color: "black" }}>
                                                    <span className="icon-chef" style={{ fontSize: "16px", marginRight: "4px" }}><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                                                    {t("prepared")}
                                                </Box>
                                            )
                                    ) : " "
                                }
                            </Typography>
                        </Box>

                        <Typography color="textSecondary" fontSize="12px" padding="0px 20px 5px 20px">
                            {t("Dine In")}: <span style={{ color: theme.palette.orangePrimary.main }}>{order.table}</span>
                        </Typography>
                        <hr width="90%" />
                        <Typography variant="body2" fontSize="12px" padding="0px 20px">
                            {t("total")} <span style={{ color: theme.palette.orangePrimary.main }}>{order.total?.toFixed(2)}</span>
                            <span style={{ fontSize: "9px", color: "gray" }}>EGP</span>
                        </Typography>
                    </>
                ) : (
                    <>
                        <Typography color="textSecondary" fontSize="12px" padding="10px 20px 5px 20px">
                            {order.order} {/* TODO: what is this */}
                        </Typography>
                        <Typography color="textSecondary" fontSize="12px" padding="0px 18px 5px 20px">
                            {order.created_at}
                        </Typography>
                        <Typography color="textSecondary" fontSize="12px" padding="0px 20px 10px 20px">
                        {order.type === "dinein" ? (  <> {t("Dine In")}, <span style={{ color: theme.palette.orangePrimary.main }}>{order.table_id}</span> </>):<></>}
                        {order.type === 'takeaway' ? ( <span style={{ color: theme.palette.orangePrimary.main }}>{t("Takeaway")}</span>):<></>}
                        {order.type === 'delivery' ? ( <span style={{ color: theme.palette.orangePrimary.main }}>{t("Delivery")}</span>):<></>}
                            
                        </Typography>
                        <hr style={{ width: "80%" }} />
                        <Typography variant="body2" fontSize="12px" padding="0px 20px">
                            {t("total")} {order.total_price?.toFixed(2)}
                            <span style={{ fontSize: "9px", color: "gray" }}>EGP</span>
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );

};

export default OrderCard;
