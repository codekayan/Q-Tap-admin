import React from 'react'
import Row1 from './Row1/Row1'
import { Row2 } from './Row2/Row2'
import { Box } from '@mui/material'
import {  useSelector } from 'react-redux'
import {  selectDashboard } from '../../../../store/client/clientDashBoardSlice'


export const DashboardClient = () => {
  const dashboardData = useSelector(selectDashboard)
  
  const { users_logs } = dashboardData || {};

  return (
    <Box >
      <Row1 dashboardClientData={dashboardData} />
      <Row2 users_logs={users_logs} />
    </Box>
  )

}
