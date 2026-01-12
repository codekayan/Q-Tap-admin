import React from "react";
import { SetupPage } from "./SetupPage";
import { BusinessInfo } from "./BusinessInfo";
import { Box, Grid, useTheme } from "@mui/material";

import Language from "../dashboard/TopBar/Language";
import SupportChat from "../chat/SupportChat";

export const BusinessInfoPage = () => {
  const theme = useTheme();

  return (
    <Grid
      container
      sx={{
        backgroundSize: "100% 100%",
        width: "100%",
        minHeight: "100vh",
        backgroundImage:
          theme.palette.mode === "light"
            ? "url(/images/Rectangle.png)"
            : undefined,
        backgroundColor:
          theme.palette.mode === "light"
            ? undefined
            : theme.palette.background.default,
      }}
    >
      <SetupPage />

      <Grid item xs={12} md={8}>
        <Box
          sx={{
            position: "absolute",
            top: "calc(1rem + 7px)",
            insetInlineEnd: "1rem",
            zIndex: "",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <SupportChat />
          <Language />
        </Box>

        <BusinessInfo />
      </Grid>
    </Grid>
  );
};
