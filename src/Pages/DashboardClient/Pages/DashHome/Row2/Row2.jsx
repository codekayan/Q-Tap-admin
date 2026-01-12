import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

import { UsersLog } from './UsersLog'
import { BarChartClientDashboard } from './BarChartClientDashboard'
import SalesVolumeCardClient from './SalesVolumeCardClient/SalesVolumeCard'


export const Row2 = ({ users_logs }) => {
  return (
    <Box sx={{ paddingTop: '20px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <BarChartClientDashboard />
          <SalesVolumeCardClient />
        </Grid>

        <Grid item xs={12} md={5}>
          <UsersLog users_logs={users_logs} />
        </Grid>


      </Grid>
    </Box>
  )
}
