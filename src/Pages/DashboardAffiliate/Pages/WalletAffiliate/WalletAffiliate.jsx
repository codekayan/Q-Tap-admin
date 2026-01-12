import { Button, Card, CardContent, Grid, Slider, Typography, Paper } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import React from 'react'
 
import {useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TableTransaction } from './TableTransaction';


const marks = [
    { value: 0 },
    { value: 12.5 },
    { value: 25 },
    { value: 37.5 },
    { value: 50 },
    { value: 62.5 },
    { value: 75 },
    { value: 87.5 },
    { value: 100 },
];

export const WalletAffiliate = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();
    return (
        <Grid container spacing={2} sx={{ padding: "0px 50px" }}>
            <Grid item xs={12} md={5} spacing={4}>
                {/* الكارت */}
                
                <Grid item xs={12} sm={11} >
                    <Card sx={{ borderRadius: '20px'}}>
                        <CardContent
                            sx={{
                                backgroundImage: `url('/images/card.jpg')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                padding: "20px",
                                color: 'white',
                                position: 'relative',
                                height:"220px"
                            }}>

                            <Box display={"flex"} justifyContent={"space-between"} marginBottom={"20px"}>
                                <img src="/assets/settingWhite.svg" alt="icon-setting" style={{ width: '25px' ,height:"25"}} />
                                <span style={{ fontSize: "23px" }} class="icon-bank"></span>
                            </Box>

                            <Box sx={{ marginTop: "40px" }}
                                display={"flex"}
                                flexDirection='column' zIndex={3}>
                                <Typography variant="body2" sx={{ fontSize: "13px" }} color="#ebe5e5">{t("accountNo")}</Typography>
                                <Typography variant="body2" sx={{ fontSize: "18px", marginTop: "5px" }} color="#ebe5e5">8935**** ****4456</Typography>
                                <Typography variant="body2" sx={{ fontSize: "18px", margin: "10px 0px" }} color="#ebe5e5">{t("name")}</Typography>
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>

                {/* Withdrawal */}
                <Grid item xs={12} sm={11}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center", marginTop: "20px",
                    }}
                >
                    <Typography sx={{ display: "flex", fontSize: "13px", color: "#4A4A49", marginBottom: "10px" }}>
                        <span style={{ color: theme.palette.text.gray, fontSize: "22px", marginRight: "5px" }} class="icon-price-tag"></span> 
                        {t("currentBalance")}
                    </Typography>

                    <Typography variant='h1' sx={{ fontSize: "30px", color: theme.palette.orangePrimary.main, marginBottom: "8px" }}>
                        501,420 <span style={{ color: "#AAAAAA", fontSize: "18px" }}>EGP</span>
                    </Typography>
                    <Typography sx={{ fontSize: "13px", color: "gray", marginBottom: "10px" }}>
                        {t("amount")}
                    </Typography>

                    <Paper
                        sx={{
                            width: "75%",
                            height: "50px",
                            borderRadius: "30px",
                            backgroundColor: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 20px",boxShadow:"none",
                        }}
                    >
                        <Typography variant='body1' sx={{ color:theme.palette.secondaryColor.main, fontSize: "18px", flexGrow: 1, textAlign: "center" }}>
                            400,000
                        </Typography>
                        <span style={{ color: 'gray', fontSize: "14px", whiteSpace: "nowrap" }}>
                            EGP
                        </span>
                    </Paper>


                    <Slider
                        defaultValue={50}
                        step={null}
                        marks={marks}
                        min={0}
                        max={100}
                        track="normal"
                        sx={{
                            marginTop: "20px",
                            color: theme.palette.orangePrimary.main,
                            width: "90%",
                            height: 5,
                            "& .MuiSlider-thumb": {
                                width: 12,
                                height: 12,
                                backgroundColor: theme.palette.orangePrimary.main,
                            },
                            "& .MuiSlider-mark": {
                                backgroundColor: "gray",
                                height: 13,
                                width: 2,
                                borderRadius: "50%",
                            },
                            "& .MuiSlider-markActive": {
                                backgroundColor: theme.palette.orangePrimary.main,
                            },
                        }}
                    />

                    <Button
                    onClick={() => navigate('/add-Affiliate')}
                        sx={{
                            fontSize: "14px",
                            width: "60%",
                            color: "white",
                            backgroundColor: theme.palette.secondaryColor.secondary,
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            marginTop: "30px",
                            "&:hover": {
                                backgroundColor: theme.palette.buttons.blueHover,
                            }
                        }}
                    >
                        {t("withdrawal")}
                    </Button>
                </Grid>
            </Grid>

            {/* الجدول  */}
            <Grid item xs={12} md={7}>
                <TableTransaction />
            </Grid>
        </Grid >

    )
}
