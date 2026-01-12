import React, { Suspense } from "react";
import { Card, CardContent, Typography, Grid, Box, useTheme } from "@mui/material";

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTranslation } from "react-i18next";

export default function Dashboard({ dashboardClientData }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const LazyChart1 = React.lazy(() => import('./Chart1'));
    const LazyChart2 = React.lazy(() => import('./Chart2'));
    const LazyChart3 = React.lazy(() => import("./Cart3"));
    return (
        <Grid container spacing={2} >

            <Grid item xs={12} md={6} >
                <Card sx={{ padding: "0px 10px", borderRadius: '20px', height: "230px" }}>
                    <CardContent>
                        <Box display={"flex"} justifyContent={"space-between"}>
                            <Typography variant="subtitle1" color="text.secondary">{t("totalOrders")}</Typography>
                            <span class="icon-shopping-bag" style={{ color: "#D8E0E0", fontSize: "25px" }}></span>
                        </Box >
                        <Typography variant="body2" sx={{ color: theme.palette.orangePrimary.main, fontSize: "20px" }}>{dashboardClientData?.total_orders}</Typography>

                        <Suspense fallback={<div>Loading chart...</div>}>
                            <LazyChart1 dashboardClientData={dashboardClientData} />
                        </Suspense>
                    </CardContent>
                </Card>
            </Grid>

            {/* Card 2: Customers */}
            <Grid item xs={12} md={3}>
                <Card sx={{ padding: "0px 10px", borderRadius: '20px', height: "230px" }}>
                    <CardContent>
                        <Box display={"flex"} justifyContent={"space-between"}>
                            <Typography variant="subtitle1" color="text.secondary">{t("customersVisit")}</Typography>
                            <span class="icon-show" style={{ color: "#D8E0E0", fontSize: "25px" }}></span>
                        </Box >
                        <Typography variant="body2" sx={{ color: theme.palette.orangePrimary.main, fontSize: "20px" }}>{dashboardClientData?.Customers_Visits_count}</Typography>
                        {/* <Chart2 dashboardClientData={dashboardClientData} /> */}
                        <Suspense fallback={<div>Loading chart...</div>}>
                            <LazyChart2 dashboardClientData={dashboardClientData} />
                        </Suspense>
                    </CardContent>
                </Card>
            </Grid>


            {/* Card 3: Performance */}
            <Grid item xs={12} md={3}>
                <Card sx={{ padding: "0px 10px", borderRadius: '20px', height: "230px" }}>
                    <CardContent>
                        <Box display={"flex"} justifyContent={"space-between"}>
                            <Typography variant="subtitle1" color="text.secondary">{t("performance")}</Typography>
                            <TrendingUpIcon sx={{ color: "#d4d0d0 ", padding: "3px", fontSize: '23px', border: "1px solid #d4d0d0", borderRadius: "6px" }} />
                        </Box>
                        {/* <Cart3 dashboardClientData={dashboardClientData} /> */}
                         <Suspense fallback={<div>Loading chart...</div>}>
                            <LazyChart3 dashboardClientData={dashboardClientData} />
                        </Suspense>
                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    );
}
