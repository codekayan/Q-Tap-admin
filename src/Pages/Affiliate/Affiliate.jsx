import React from 'react';
import { Box, Grid } from '@mui/material';
import { Revenue } from './Revenue/Revenue';
import { Users } from './Users/Users';
import Campaigns from './Campaigns/Campaigns';
import { Transactions } from './Users/Transactions';




export const Affiliate = () => {
  console.log("afff")
  return (
    <Box sx={{ padding: 2 }}>
      <Box>
        <Grid container spacing={2}>

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Revenue />
              </Grid>

              <Grid item xs={12}>
                <Campaigns />
              </Grid>

            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Users />
          </Grid>

        </Grid>
      </Box>
      <Transactions />
    </Box>
  )
}
