import React from 'react'
import { Reset } from './Reset'
import QtapLogo from '../QtapLogo'
import { Box, Grid, useTheme } from "@mui/material";
import Language from '../dashboard/TopBar/Language';
import SupportChat from '../chat/SupportChat';


export const ResetPage = () => {
  const theme = useTheme()
  return (
    <Box>
      <Box >
        <Grid container spacing={0}
          sx={{
            backgroundImage: theme.palette.mode === 'light' ? "url(/images/Rectangle.png)" : undefined,
            backgroundColor: theme.palette.mode === 'light' ? undefined : theme.palette.background.default,
            backgroundSize: "100% 100%", width: "100%"
          }}>
          <Grid item xs={12} md={6}>
            <QtapLogo inAppNavigationURL={'/'} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              position: "absolute", top: "30px", right: "80px", zIndex: 2000,
              cursor: "pointer", display: "flex", alignItems: "center"
            }}>
              <SupportChat/>

              <Language />
            </Box>

            <Box display="flex" flexDirection="column" justifyContent="center"
              alignItems="center" height="100vh">

              <Box sx={{ width: { lg: "50%", md: "70%", xs: "90%" } }} >
                <Box display="flex" justifyContent="center" >
                  <img src="/assets/qtap.svg" alt="logo Qtap" style={{ width: "250px", height: "40px" }} />
                </Box>


                <Reset sx={{ width: "100%" }} />
              </Box>

            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
