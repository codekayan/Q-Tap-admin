import React from 'react';
import { Card, CardContent, Grid, Paper, Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import  {ChartPie}  from './ChartPie';
import { TableTransaction } from './TableTransaction';



export const Transaction = () => {
  const theme = useTheme();
  return (
    <Grid container spacing={3} padding={"0px 0px 60px 20px"}  >

      <Grid item xs={12}  lg={6} >

        <Card
          sx={{
            borderRadius: '20px',
            backgroundImage: `
        linear-gradient(${theme.palette.secondaryColor.main}, rgba(28, 31, 57, 0.8)),
        url('/images/bg-paymob.jpg')`  ,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            padding: "20px 15px",
          }}>
          <CardContent>
            <Box sx={{ display: "flex", textAlign: "center", alignItems: "center", justifyContent: "space-between" }}>
            <img src='/assets/paymob.svg' alt='paymob' style={{width:"150px" ,height:"40px",marginBottom:"10px"}} />
              <span class="icon-share" style={{ fontSize: "30px" }} />
            </Box>

            
            <Typography variant="subtitle1" sx={{ fontSize: "12px", fontFamily: "sans-serif", letterSpacing: "1px", color: "#9d9d9c" }}>MID</Typography>
            <Typography variant="body1" sx={{ fontSize: "18px", fontFamily: "sans-serif", letterSpacing: "2px" }}>893544</Typography>
            <Typography variant="subtitle1" sx={{ fontSize: "15px", fontFamily: "sans-serif", color: "#9d9d9c", letterSpacing: "2px" }}>Name</Typography>
            <Typography variant="h6" sx={{ fontSize: "18px", fontFamily: "sans-serif", letterSpacing: "2px" }}>TypeName</Typography>
          </CardContent>
        </Card>

        {/* Total Withdrawals Card */}
        <Paper sx={{
          padding: '30px 20px', marginTop: "6%", borderRadius: '20px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',overflowX:'auto'
        }}>

          <Box display="flex"  justifyContent="space-between">
            <Box>
            <img src="/assets/withd.svg" alt="icon" style={{ width: "26px", height: "26px" }} />
              <Typography variant="h6" sx={{ fontSize: "15px", color: "#575756" }}>
                Total Withdrawals
              </Typography>
              <Typography variant="h6" sx={{ fontSize: "33px", marginTop: "30px", color: theme.palette.orangePrimary.main }}>
                501,420
                <span style={{ color: "gray", fontSize: "15px" }}> EGP</span>
              </Typography>


              <Typography variant="body2" sx={{ margin: "0px 0px 30px 0px", color: "#D8E0E0" }} >
                All Financial Year
              </Typography>
            </Box>

            <Box display="flex" >
              <ChartPie />
            </Box>   

          </Box>


        </Paper>
      </Grid>

      {/* right Side */}
      <Grid item xs={12}  lg={6}  >
        <TableTransaction />
      </Grid>

    </Grid>
  )
}
