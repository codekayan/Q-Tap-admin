import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material'
import React from 'react'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import { Cart1 } from './Cart1';
import Cart2 from './Cart2';
import { Cart3 } from './Cart3';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Cart4 } from './Cart4';
import { useTranslation } from 'react-i18next';
import { getDashboard } from '../../../store/adminSlice';
import { useDispatch, useSelector } from 'react-redux';

export const Row1 = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const dashboardData = useSelector((state) => state.admins?.dashboardData);
    const dispatch = useDispatch();

    const { Affiliate_Users, Client, Total_Orders } = dashboardData;
    React.useEffect(() => {
        let isMounted = true; // Flag to prevent setting state if component is unmounted
        const fetchDashboardData = async () => {
            if (isMounted) {
                dispatch(getDashboard());
            }
        };
        fetchDashboardData();
        return () => {
            isMounted = false; // Cleanup to prevent multiple requests
        };
    }, []);
    return (
        <Box sx={{ flexGrow: 1, padding: '0px 20px 20px 20px' }}>
            <Grid className="mainContainer" container spacing={3}>
                <Grid item xs={12} md={6} lg={3} >
                    <Card sx={{ borderRadius: '20px', height: '250px', backgroundColor: theme.palette.bodyColor.secandary }}>
                        <CardContent sx={{ overflowX: 'auto' }}>
                            <Box display={"flex"} justifyContent={"space-between"}>
                                <Typography variant="subtitle1" color={theme.palette.text.gray}>{t("client")}</Typography>
                                <PersonAddAlt1OutlinedIcon sx={{ color: "#D8E0E0 ", fontSize: '27px' }} />
                            </Box>
                            <Typography variant="body2" sx={{ color: theme.palette.orangePrimary.main, fontSize: "20px" }}>{Client?.number_branches_clients}</Typography>

                            <Cart1 Client={Client} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={{ borderRadius: '20px', height: '250px', backgroundColor: theme.palette.bodyColor.secandary }}>
                        <CardContent>
                            <Box display={"flex"} justifyContent={"space-between"}>
                                <Typography variant="subtitle1" color={theme.palette.text.gray}>{t("totalOrders")}</Typography>
                                <span class="icon-shopping-bag" style={{ color: theme.palette.text.secondary, fontSize: "22px" }}></span>
                            </Box >
                            <Typography variant="body2" sx={{ color: theme.palette.orangePrimary.main, fontSize: "20px" }}>
                                {(() => {
                                    const orders = Total_Orders && typeof Total_Orders === 'object' && Total_Orders !== null
                                        ? Object.values(Total_Orders)
                                        : [];
                                    const sum = orders
                                        .map(order => order.total_order || 0)
                                        .reduce((acc, curr) => acc + curr, 0);
                                    return sum > 0 ? sum : 0;
                                })()}
                            </Typography>

                            <Cart2 Total_Orders={Total_Orders} />

                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={{ borderRadius: '20px', height: '250px', backgroundColor: theme.palette.bodyColor.secandary }}>
                        <CardContent>
                            <Box display={"flex"} justifyContent={"space-between"}>
                                <Typography variant="subtitle1" color={theme.palette.text.gray}>{t("affiliateUsers")}</Typography>
                                <span class="icon-social" style={{ color: "#D8E0E0", fontSize: "22px" }}></span>
                            </Box >
                            <Typography variant="body2" sx={{ color: theme.palette.orangePrimary.main, fontSize: "20px" }}>{Affiliate_Users?.totalAffiliates}</Typography>
                            <Cart3 Affiliate_Users={Affiliate_Users} />

                        </CardContent>
                    </Card>
                </Grid>


                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={{ borderRadius: '20px', height: '250px', backgroundColor: theme.palette.bodyColor.secandary }}>
                        <CardContent>
                            <Box display={"flex"} justifyContent={"space-between"}>
                                <Typography variant="subtitle1" color={theme.palette.text.gray}>{t("performance")}</Typography>
                                <TrendingUpIcon sx={{ color: "#d4d0d0 ", padding: "3px", fontSize: '23px', border: "1px solid #d4d0d0", borderRadius: "6px" }} />
                            </Box>
                            <Cart4 />
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </Box>
    )
}