import { Button, Card, CardContent, Grid, MenuItem, Select, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import React, { useEffect, useState } from 'react'
import LineChart1 from './LineChart1'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { BASE_URL } from "../../../../utils/constants";


export const Row2 = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = React.useState(currentYear);
  const [chartData, setChartData] = useState(null)
  const [showClick, setShowClick] = useState(true)
  const [showSales, setShowSales] = useState(true)
  const theme = useTheme();

  const handleToggleUser = () => {
    setShowSales(!showSales)
  }

  const handleToggleClick = () => {
    setShowClick(!showClick)
  }

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };
  const handleAffiliateChart = async (year) => {
    try {

      const response = await axios.get(

        `${BASE_URL}Sales_clicks/${year}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('affiliateToken')}`
          },

        }
      );

      const clicks = response?.data?.clicksPerMonth;
      const users = response?.data?.users_count_by_month;

      const combined = {
        clicksPerMonth: clicks,
        usersCountByMonth: users
      };
      setChartData(combined)
    } catch (error) {

      console.log(error)

    } finally {
    }
  }

  useEffect(() => {
    handleAffiliateChart(year)
  }, [year])

  const { t } = useTranslation();
  return (

    <Grid item xs={12} sx={{ flexGrow: 1, padding: '0px 20px 20px 20px' }}>

      <Card sx={{ borderRadius: '20px' }}>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center"  >
            <Grid item>
              <Typography variant="body1" sx={{ fontSize: "13px", color: theme.palette.text.gray }}>{t("clicks&sales")}</Typography>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Select
                  value={year}
                  onChange={handleYearChange}
                  MenuProps={{
                    disableScrollLock: true,
                  }}
                  sx={{
                    height: '24px',
                    fontSize: '12px',
                    color: theme.palette.text.gray,
                    '.MuiOutlinedInput-notchedOutline': { border: 0 },
                    '.MuiSelect-icon': { fontSize: '18px' },
                  }}
                >
                  <MenuItem value="2023" sx={{ fontSize: "12px", color: theme.palette.text.gray }}>2023</MenuItem>
                  <MenuItem value="2024" sx={{ fontSize: "12px", color: theme.palette.text.gray }}>2024</MenuItem>
                  <MenuItem value="2025" sx={{ fontSize: "12px", color: theme.palette.text.gray }}>2025</MenuItem>
                </Select>
                <span class="icon-social" style={{ fontSize: "25px", color: "#D8E0E0" }} ></span>
              </Box>
            </Grid>

          </Grid>

          <Box sx={{ display: "flex", flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <Box sx={{ borderRadius: "20px", width: "90%" }}>
              <LineChart1 salesData={chartData} showLine1={showClick} showLine2={showSales} />
            </Box>  {/* LineChart */}

            <Box sx={{ display: "flex", textAlign: "center", alignItems: "center" }}>
              <Box justifyContent="center">

                <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
                  <Box component="span" sx={{
                    background: "linear-gradient(90deg, #45F7FF, #2278F3)", width: '25px',
                    borderRadius: "20px", height: '10px', display: 'inline-block', marginRight: '8px'
                  }} />
                  <Button
                    onClick={handleToggleClick}
                  >
                    <Typography variant="body2" color={theme.palette.text.gray_light} sx={{ fontSize: "9px" }} >{t("clicks")}</Typography>
                  </Button>
                </Box>
                <Box display={"flex"} textAlign={"center"} alignItems={"center"} marginTop="5px">
                  <Box component="span" sx={{
                    background: "linear-gradient(90deg, #FD4845, #843EA1)",
                    width: '25px', borderRadius: "20px", height: '10px', display: 'inline-block', marginRight: '8px'
                  }} />
                  <Button
                    onClick={handleToggleUser}
                    sx={{ margin: 0, padding: '0 !important', }}
                  >
                    <Typography variant="body2" color={theme.palette.text.gray_light} sx={{ fontSize: "9px" }}>{t("sales")}</Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  )
}
