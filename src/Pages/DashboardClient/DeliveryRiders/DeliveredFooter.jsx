
import { Box, useTheme } from '@mui/material'
import React from 'react'

export const DeliveredFooter = () => {
  const theme = useTheme()
  return (
    <Box sx={{position:"fixed" , bottom:"0", width:"100%", height:"15px",
        background: `linear-gradient(to right, ${theme.palette.gradient.orange}, ${theme.palette.gradient.red})`,
    }}
    >
    </Box>
  )
}
