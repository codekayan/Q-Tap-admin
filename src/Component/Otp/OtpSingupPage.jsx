import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import { OtpSignUp } from "./OtpSignUp";
import Language from "../dashboard/TopBar/Language";
import { SetupPage } from "../Business-info/SetupPage";
import SupportChat from "../chat/SupportChat";

export const OtpSignupPage = () => {
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
        minHeight: "100vh",
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

        <OtpSignUp />
      </Grid>
    </Grid>
  );
};
