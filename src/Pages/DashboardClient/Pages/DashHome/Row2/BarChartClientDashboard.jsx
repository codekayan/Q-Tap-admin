import { Paper, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Box, useTheme } from '@mui/system';
import { Grid, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fetchSales, selectSales } from '../../../../../store/client/clientDashBoardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { nFormatter } from '../../../../../utils/formatNumber';
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: '#fff', border: '1px solid #ccc', padding: '0px 5px', fontSize: '10px', borderRadius: '5px' }}>
                <p>{`${payload[0].payload.month_name}: ${payload[0].value} `}</p>
            </div>
        );
    }
    return null;
};


export const BarChartClientDashboard = () => {
    const [year, setYear] = React.useState('2025');
    const { t } = useTranslation()
    const theme = useTheme();
    const dispatch = useDispatch()
    const salesClientData = useSelector(selectSales)
    
    const handleYearChange = (event) => {
        setYear(event.target.value);
    };


    React.useEffect(() => {
        dispatch(fetchSales(year))
    }, [year]);
    return (
        <Paper sx={{ height: "220px", borderRadius: "20px", }}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ padding: "10px 20px", }} >
                <Grid item>
                    <Typography variant="body1" component="div" sx={{ color: "#575756", fontSize: '13px' }}>
                        {t("sales")}
                    </Typography>
                </Grid>
                <Grid item>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Select
                            value={year}
                            onChange={handleYearChange}
                            sx={{
                                height: '24px',
                                color: "#575756", fontSize: '13px',
                                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                                '.MuiSelect-icon': { fontSize: '20px' },
                            }}
                            MenuProps={{
                                disableScrollLock: true,
                            }}
                        >
                            <MenuItem value="2023" sx={{ fontSize: "10px", color: "gray" }}>2023</MenuItem>
                            <MenuItem value="2024" sx={{ fontSize: "10px", color: "gray" }}>2024</MenuItem>
                            <MenuItem value="2025" sx={{ fontSize: "10px", color: "gray" }}>2025</MenuItem>
                        </Select>
                    </Box>
                </Grid>
            </Grid>

            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesClientData ? Object.values(salesClientData) : []} margin={{ top: 5, right: 10, left: -10, bottom: 70 }}>
                    <XAxis
                        dataKey="month_name"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 9 }}
                    />

                    <YAxis
                        tickFormatter={nFormatter}
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                    />

                    <Tooltip contentStyle={{ fontSize: '10px' }}
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }} />
                    <Bar
                        dataKey="total_revenue"
                        fill={theme.palette.orangePrimary.main}
                        background={{
                            fill: '#D8E0E0',
                            radius: [10, 10, 0, 0] // Adding radius to the background
                        }}
                        barSize={12}
                        radius={[10, 10, 0, 0]}
                    />

                </BarChart>
            </ResponsiveContainer>
        </Paper>
    )
}
