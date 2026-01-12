import { SetupPage } from "../Business-info/SetupPage";
import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import { Products } from "./Products";

import Language from "../dashboard/TopBar/Language";
import SupportChat from "../chat/SupportChat";

export const ProductsPage = () => {
  const theme = useTheme();
  return (
    <Grid
      container
      sx={{
        backgroundImage:
          theme.palette.mode === "light"
            ? "url(/images/Rectangle.png)"
            : undefined,
        backgroundColor:
          theme.palette.mode === "light"
            ? undefined
            : theme.palette.background.default,
        backgroundSize: "100% 100%",
        width: "100%",
        height: "100vh",
      }}
    >
      <SetupPage />

      <Grid item xs={12} md={8}>
        <Box
          sx={{
            position: "absolute",
            top: "30px",
            insetInlineEnd: "1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            zIndex: "10000",
          }}
        >
          <SupportChat />

          <Language />
        </Box>

        <Products />
      </Grid>
    </Grid>
  );
};
