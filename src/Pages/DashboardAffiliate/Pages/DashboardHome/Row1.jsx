import { Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { BASE_URL } from "../../../../utils/constants";

export const Row1 = () => {
    const {t} = useTranslation()
    const [salesData,setSalesData] = useState(null)
    const handleAffiliateSalesData = async () => {
        try {
    
          const response = await axios.get(

            `${BASE_URL}get_sales_affiliate`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('affiliateToken')}`
              },
    
            }
          );
    
          setSalesData(response.data)
        } catch (error) {
    
          console.log(error)
    
        } finally {
        }
      }
    useEffect(()=>{
        handleAffiliateSalesData()
    },[])
    return (
        <Box sx={{ flexGrow: 1, padding: '0px 20px 20px 20px' }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} lg={3}>
                    <Card sx={{ 
                        backgroundImage: "url('/images/card3.jpg')", 
                        backgroundSize: "cover",   
                        backgroundPosition: "center", 
                        borderRadius: '20px',color:"white" }}>
                        <CardContent>
                            <Box display={"flex"} justifyContent={"space-between"}>
                                <Typography variant="subtitle1" sx={{fontSize:"12px"}}>{t("sales")}</Typography>

                                <TrendingUpIcon sx={{ color: "#d4d0d0 ",padding: "3px", fontSize: '23px', border: "1px solid #d4d0d0", borderRadius: "6px" }} />
                            </Box>
                            <Typography variant="h4" marginTop="6px" sx={{fontSize:"28px"}}>{salesData?.salesAmount}</Typography>

                            <Box display={"flex"} justifyContent="center" alignItems="center" marginTop="20px">
                                <Typography variant="body1"
                                    sx={{ fontSize: "25px" }} >{salesData?.salesAmountChangePercent}%</Typography>
                                    <img src='/assets/up.svg' alt="up icon"  style={{ width: '22px',height:"22px" }} />
                            </Box>
                            <Divider sx={{ margin: "10px 0px",height:"1px" ,backgroundColor:"#a19c9c"}} />

                            <Typography variant="subtitle2" color=" #d4d0d0" sx={{fontSize:"12px"}}>{t("daily")}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                    <Card sx={{ borderRadius: '20px' ,
                        backgroundImage: "url('/images/card2.jpg')", 
                        backgroundSize: "cover",   
                        backgroundPosition: "center", color:"white"
                    }}>
                        <CardContent>
                            <Box display={"flex"} justifyContent={"space-between"}>
                                <Typography variant="subtitle1" sx={{fontSize:"12px"}}>{t("salesAmount")}</Typography>
                                <span class="icon-price-tag" style={{fontSize:"25px",color:"#d4d0d0 "}}></span>
                            </Box>
                            <Typography variant="h4" marginTop="5px"sx={{fontSize:"28px"}}>{salesData?.salesCount}
                                <span style={{ fontSize: "14px",marginLeft:"5px" }}>EGP</span>
                                </Typography>

                            <Box display={"flex"} justifyContent="center" alignItems="center" marginTop="20px">
                                <Typography variant="body1"
                                    sx={{  fontSize: "25px" }} >{salesData?.salesCountChangePercent}%</Typography>
                                <img src='/assets/down.svg' alt="up icon"  style={{ width: '22px',height:"22px" }} />
                            </Box>
                            <Divider sx={{ margin: "10px 0px",height:"1px" ,backgroundColor:"#a19c9c"}} />
                            <Typography variant="subtitle2" color="#d4d0d0" sx={{fontSize:"12px"}}>{t("daily")}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={12} lg={6}>
                    <Card sx={{ borderRadius: '20px' }}>
                        <CardContent
                            sx={{
                                backgroundImage: `url('/images/card.jpg')`, 
                                backgroundSize: 'cover',
                                backgroundPosition: 'center', 
                                padding: '20px',  
                                color: 'white',  
                                position: 'relative', 
                            }}>

                            <Typography variant="subtitle1" color="white" sx={{fontSize:"13px"}} >{t("commission")}</Typography>
                            <Box
                                display={"flex"}
                                flexDirection='column'
                                justifyContent={"center"}
                                alignItems={"center"}>
                                <Typography variant="h4" sx={{ fontSize: "95px" }} color="#d4d0d0">10%</Typography>
                                <Typography variant="subtitle2" color="#d4d0d0"  sx={{fontSize:"11px"}}>{t("youEarn10OfEachSale")}</Typography>

                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}