import React from 'react'
import { Box, Grid, MenuItem, Paper, Select, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next';
import SalesVolumeChartClient from './SalesVolumeChart';
import { fetchSalesByDays, selectSalesByDays } from '../../../../../../store/client/clientDashBoardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { nFormatter } from '../../../../../../utils/formatNumber';

const SalesVolumeCardClient = () => {
    const [year, setYear] = React.useState('30');
    const { t } = useTranslation()
    const theme = useTheme()

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };
    const dispatch = useDispatch()
    const salesVolumeClientData = useSelector(selectSalesByDays)
    React.useEffect(() => {
        dispatch(fetchSalesByDays(year))
    }, [dispatch, year]);

    return (
        <Paper sx={{ borderRadius: "20px", marginTop: "20px", padding: "10px", }}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ padding: "10px 20px", }} >
                <Grid item>
                    <Typography variant="body1" component="div" sx={{ color: theme.palette.text.secondary, fontSize: '13px' }}>
                        {t("salesVolume")}
                    </Typography>
                </Grid>
                <Grid item>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Select
                            value={year}
                            onChange={handleYearChange}
                            sx={{
                                height: '24px',
                                color: theme.palette.text.secondary, fontSize: '13px',
                                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                                '.MuiSelect-icon': { fontSize: '20px' },
                            }}
                            MenuProps={{
                                disableScrollLock: true,
                            }}
                        >
                            <MenuItem value="30" sx={{ fontSize: "10px", color: theme.palette.text.secondary }}>30d</MenuItem>
                            <MenuItem value="40" sx={{ fontSize: "10px", color: theme.palette.text.secondary }}>40d</MenuItem>
                            <MenuItem value="50" sx={{ fontSize: "10px", color: theme.palette.text.secondary }}>50d</MenuItem>
                        </Select>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                <SalesVolumeChartClient salesVolumeClientData={salesVolumeClientData} />

                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: "30px"
                    }}
                >
                    <span class="icon-wallet1" style={{ fontSize: '26px' }} ></span>
                    <Typography variant="h5"
                        sx={{ fontSize: "20px", color: theme.palette.text.default, marginTop: '8px', border: `2px solid${theme.palette.orangePrimary.main}`, padding: "3px 25px", borderRadius: "20px" }}>
                         {(() => {
                            const sum = salesVolumeClientData?.weeks?.map((order) => order.total_revenue || 0)
                                .reduce((acc, curr) => acc + curr, 0);
                            return sum > 0 ? nFormatter(Number.isInteger(sum) ? sum : sum.toFixed(1)) : 0;
                        })()}{" "}
                    </Typography>
                    <Typography variant="body2" color={theme.palette.text.default}>
                        EGP
                    </Typography>
                </Box>
            </Box>
        </Paper>
    )
}
export default SalesVolumeCardClient;
