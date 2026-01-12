import React, { useState } from "react";
import QtapLogo from "../Component/QtapLogo";
import QtapHome from "../Component/QtapHome";
import { Box, Grid, useTheme } from "@mui/material";

import Language from "../Component/dashboard/TopBar/Language";
import QtapHomeAdmin from "../Component/QtapHomeAdmin";
import SupportChat from "../Component/chat/SupportChat";

export const HomePageAdmin = () => {
  const theme = useTheme()
  return (
    <Box
      sx={{

        backgroundSize: "100% 100%",
        width: "100%",
        backgroundImage: theme.palette.mode === 'light' ? "url(/images/Rectangle.png)" : undefined,
        backgroundColor: theme.palette.mode === 'light' ? undefined : theme.palette.background.default,

      }}
    >
      <Grid container spacing={0}>
        <Grid item xs={12} md={6}>
          <QtapLogo />
        </Grid>

        <Grid item xs={12} md={6}>
          {/* language component */}
          <Box
            sx={{
              position: "absolute",
              top: "30px",
              right: "80px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              zIndex: "2000",
            }}
          >
            <SupportChat/>
            <Language />

          </Box>
          {/* login component */}
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="calc(100vh - 70px)"
            marginTop='70px'
          >
            <Box sx={{ width: { lg: "43%", md: "60%", xs: "90%" } }}>
              <QtapHomeAdmin />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePageAdmin;