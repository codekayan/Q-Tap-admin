import React, { forwardRef } from 'react';
import { Grid, Typography, Button, Divider } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import { useTranslation } from 'react-i18next';


export const orders = [
    {
        id: '3208',
        items: 4,
        state: "Rejected",
        status: 'Unpaid',
        date: 'Sunday, August 4, 2024 3:59 PM',
        table: 'Table 02',
        total: 200.00,
        subTotal: 190.00,
        tax: 10.00,
        discount: 0.00,
        orderDetails: [
            { num: "2", item: 'Negrsco', size: 'M', extras: ['Extra sauce'], price: 50.00 },
            { num: "1", item: 'Tea', price: 10.00 },
        ],
        comment: "Don't add onions Please",
        paymentMethod: 'Cash',
        dineMethod: { type: 'Dine in', table: "T02", area: 'B02' },
        chef: 'afaf',
        cashier: "Ahmed",
        waiter: "Aya",
        preparingTime: 30,
        address: "10 Algaish St, tanta, Dakahlia, EG",
        phone: "+20101234567",
        names: "mohamed ahmed",
    },
    {
        id: '3228',
        items: 7,
        state: "Done",
        status: 'paid',
        date: 'Sunday, August 4, 2024 3:59 PM',
        table: 'Table 02',
        total: 200.00,
        subTotal: 190.00,
        tax: 10.00,
        discount: 0.00,
        orderDetails: [
            { num: "2", item: 'Negrsco', size: 'M', extras: ['Extra sauce'], price: 10.00 },
            { num: "1", item: 'Tea', price: 10.00 },
        ],
        comment: "Don't add onions Please",
        paymentMethod: 'Cash',
        dineMethod: { type: 'Dine in', table: "T02", area: 'B02' },
        chef: 'afaf',
        cashier: "Ahmed",
        waiter: "Aya",
        preparingTime: 30,
        address: "20 Algaish St, Mansoura, Dakahlia, EG",
        phone: "+20101234567",
        names: "afaf nossier",

    },
];

const MainContent = forwardRef(({ order }) => {


    return (
        <Grid container spacing={2} >
            <Grid item xsm={4} xs={12}>
                <OrderDetails order={order} />
            </Grid>

            <Divider orientation="vertical" flexItem sx={{ color: 'gray', height: "250px",  display:{xs:'none',sm:'block'}}} />

            <Grid item sm={4} xs={12}>
                <CommentSection order={order} />
            </Grid>

            <Divider orientation="vertical" flexItem sx={{ color: 'gray', height: "250px", display:{xs:'none',sm:'block'} }} />

            <Grid item sm={3} xs={12}>
                <ChefSection order={order} />
            </Grid>
        </Grid>
    );
});

const OrderDetails = ({ order }) => {
    const theme = useTheme();
    const { t } = useTranslation()
    return (
        <div>
            <Typography variant="h6" sx={{ fontSize: "12px" }}>{t("Order details")}</Typography>
            <Box display={"flex"} justifyContent={"center"}>
                <Box width={"70%"}>
                    {order.meals.map((detail, index) => (
                        <Typography key={index} variant="body2" sx={{ fontSize: "11px", color: "#9d9d9c" }}>
                            {detail?.quantity} x {detail.name} {detail.size && `(size: ${detail?.size})`}
                            {detail.extras && ` + ${detail?.extras.join(', ')}`}
                        </Typography>
                    ))}
                </Box>
                <Box
                    sx={{
                        height: "40px",
                        borderRight: "1px solid #ef7d00",
                        margin: "-3px 6px",
                    }}
                />
                <Box width={"30%"}>
                    {order.meals.map((detail, index) => (
                        <Typography key={index} variant="body2" sx={{ fontSize: "11px", color: "#9d9d9c" }}>
                            {detail.size && detail.size === 'l' ? detail.price_large : ''}
                            {detail.size && detail.size === 'm' ? detail.price_medium : ''}
                            {detail.size && detail.size === 's' ? detail.price_small : ''}
                            {detail.size ? '' : detail.price}
                            EGP
                        </Typography>
                    ))}
                </Box>
            </Box>
        </div>
    );
}

const CommentSection = ({ order }) => {
    const theme = useTheme();

    const { t } = useTranslation()
    return (
        <div>
            <Box sx={{ marginBottom: "6px" }}>
                <Typography variant="h6" sx={{ fontSize: "12px" }}>{t("Comment")}</Typography>
                <Typography variant="body2" sx={{ fontSize: "11px", color: "gray" }}>{order?.comments}</Typography>
            </Box>

            <Box sx={{ marginBottom: "6px" }}>
                <Typography variant="h6" sx={{ fontSize: "12px" }}>{t("Payment Method")}</Typography>
                <Typography variant="body2" sx={{ fontSize: "11px", color: "gray" }}>{order?.payment_way}</Typography>
            </Box>

            <Box sx={{ marginBottom: "6px" }}>
                <Typography variant="h6" sx={{ fontSize: "12px" }}>{t("Dine Method")}</Typography>
                <Typography variant="body2" sx={{ fontSize: "11px", color: "gray" }}>{order?.type}</Typography>
            </Box>

            {order.type === 'delivery' ? <Typography variant="body2" sx={{ fontSize: "11px", color: "gray", padding: "3px" }}>
                <span style={{ color: theme.palette.orangePrimary.main }}>{t("Address")} :</span>{order?.address}
            </Typography> : <></>}

            <Typography variant="body2" sx={{ fontSize: "11px", color: "gray", padding: "3px" }}>
                <Box component="span" sx={{ color: theme.palette.orangePrimary.main }}>{t("Name")}: </Box>{order?.name}
            </Typography>

            <Typography variant="body2" sx={{ fontSize: "11px", color: "gray", padding: "3px" }}>
                <Box component="span" sx={{ color: theme.palette.orangePrimary.main }}>{t("Phone")}: </Box>{order?.phone}
            </Typography>


            {order.type === 'delivery' ? <> <Button variant="contained"
                sx={{
                    fontSize: "11px", backgroundColor: theme.palette.secondaryColor.main, borderRadius: "10px",
                    textTransform: "capitalize", marginRight: "10px", marginTop: "20px",
                    '&:hover': {
                        backgroundColor: theme.palette.secondaryColor.main,
                    }
                }} startIcon={
                    <span class="icon-map-1" style={{}}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span></span>
                }>
                {t("Location")}
            </Button>


                <Button variant="contained"
                    sx={{
                        fontSize: "12px", backgroundColor: theme.palette.orangePrimary.main, borderRadius: "10px",
                        textTransform: "capitalize", marginTop: "20px",
                        '&:hover': {
                            backgroundColor: theme.palette.orangePrimary.main,
                        }
                    }} startIcon={
                        <span class="icon-send"  ></span>
                    }>
                </Button></> : <></>}
        </div>
    )
};

const ChefSection = ({ order, }) => {
    const { t } = useTranslation()
    return (
        <Grid container spacing={2}  >
            {order?.orders_processing?.map((item) => {
                return (<>
                    {item?.stage === "chef" && item?.status === "accepted" && (
                        <> <Grid item xs={5}>

                            <Typography variant="subtitle1" fontSize="11px" paddingTop="6px" >
                                <span class="icon-chef" style={{ fontSize: "14px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
                                {t("Chef")}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" fontSize={"10px"} marginLeft={"10px"}>{item?.user?.name}</Typography>
                        </Grid>


                            <Grid item xs={7}>
                                <Typography variant="subtitle1" fontSize="11px" paddingTop="6px" >
                                    <span class="icon-circular-clock" style={{ fontSize: "14px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
                                    {t("Preparing Time")}</Typography>
                                <Typography variant="body2" color="textSecondary" fontSize={"10px"} marginLeft={"10px"}>30
                                    <span style={{ marginLeft: "5px" }}>Min</span>
                                </Typography>
                            </Grid></>
                    )}
                    {item?.stage === "cashier" && (
                        <Grid item xs={5} sx={{ marginTop: "-10px" }}>
                            <Typography variant="subtitle1" fontSize="11px" paddingTop="6px" >
                                <span class="icon-cashier" style={{ fontSize: "14px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
                                {t("Cashier")}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" fontSize={"10px"} marginLeft={"10px"}>{item?.user?.name}</Typography>
                        </Grid>

                    )}
                    {item?.stage === "waiter" && (
                        <Grid item xs={7} sx={{ marginTop: "-10px" }}>
                            <Typography variant="subtitle1" fontSize="11px" paddingTop="6px" >
                                <span class="icon-waiter-1" style={{ fontSize: "14px", marginRight: "6px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span></span>
                                {t("Waiter")}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" fontSize={"10px"} marginLeft={"10px"}>{item?.user?.name}</Typography>
                        </Grid>
                    )}


                </>)
            })}


            <Divider sx={{ color: 'gray', marginTop: '10px', width: "90%", marginLeft: "15px" }} />
            <Grid item xs={12}>
                <Typography variant="body2" fontSize="10px" padding="0px 3px">
                    <span style={{ color: '#9d9d9c', fontSize: "10px" }}>{t("Sub Total")}:</span> {order.total_price - order.tax} EGP
                </Typography>

                <Typography variant="body2" fontSize="10px" padding="0px 3px">
                    <span style={{ color: '#9d9d9c', fontSize: "10px" }}>{t("Tax")}:</span> {order.tax} EGP
                </Typography>

                <Typography variant="body2" fontSize="10px" padding="0px 3px">
                    <span style={{ color: '#9d9d9c', fontSize: "10px" }}>{t("Discount")}:</span> - {order?.discount} EGP
                </Typography>

                <Typography variant="h6" sx={{ marginTop: '8px', fontSize: "10px" }}>
                    <span style={{ color: '#9d9d9c' }}>{t("Total")}:</span> {order.total_price} EGP
                </Typography>
            </Grid>
        </Grid>
    )
};

export default MainContent;
