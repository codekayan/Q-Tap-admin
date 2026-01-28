import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { SignUpPage } from "./signup/SignUPage";
import { LoginPage } from "./login/LoginPage";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const QtapHome = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const hasInitialized = useRef(false);

  const [selectedTab, setSelectedTab] = useState(() => {
    if (searchParams.get("signUp") === "true") return "signup";
    if (sessionStorage.getItem("affiliate_code")) return "signup";
    return "login";
  });

  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const params = new URLSearchParams(window.location.search);
    if (params.has("affiliate_code")) {
      const code = params.get("affiliate_code");
      sessionStorage.setItem("affiliate_code", code);
      setSelectedTab("signup");

      // Check if we already reported this affiliate click
      const clickKey = `affiliate_clicked_${code}`;
      if (!sessionStorage.getItem(clickKey)) {
        // Call API to increase count
        axios
          .get(`${BASE_URL}home_affiliate/${code}`)
          .then(() => {
            sessionStorage.setItem(clickKey, "true"); // Mark as reported
          })
          .catch(() => {
            // silently fail
          });
      }
    }
  }, []);

  return (
    <Box
      sx={{
        // 🔴 CHANGED: Use minHeight instead of fixed height for natural page flow
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingY: "20px", // 🔴 ADDED: Vertical padding for better spacing
      }}
    >
      <Box
        className="hereMore"
        sx={{
          // 🔴 REMOVED: height: "100%" - no fixed height constraint
          width: "100%",
          display: "flex",
          flexDirection: "column",
          maxWidth: "500px",
          // 🔴 REMOVED: overflow: "auto" - no internal scrollbar
          paddingX: "20px", // 🔴 ADDED: Horizontal padding
        }}
      >
        {/* Logo Section */}
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            paddingTop: "5vh",
            paddingBottom: "5vh",
            // 🔴 REMOVED: flexShrink: 0 - not needed without fixed container
          }}
        >
          <img
            src="/assets/qtap.svg"
            alt="logo Qtap"
            style={{ width: "250px", height: "60px" }}
          />
        </Box>

        {/* Tab Navigation */}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          sx={{
            margin: "60px 0px 50px 0px",
            // 🔴 REMOVED: flexShrink: 0 - not needed without fixed container
          }}
        >
          <Box
            component="div"
            sx={{
              width: "30%",
              textDecoration: "none",
              flex: "1",
            }}
            onClick={() => setSelectedTab("login")}
          >
            <Typography
              className="hereChange"
              variant="body1"
              sx={{
                borderBottom:
                  selectedTab === "login"
                    ? `3px solid ${theme.palette.orangePrimary.main}`
                    : "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "11px",
                paddingBottom: "10px",
                cursor: "pointer",
              }}
            >
              {t("logIn")}
            </Typography>
          </Box>

          <Box
            component="div"
            sx={{
              width: "30%",
              textDecoration: "none",
              flex: "1",
            }}
            onClick={() => setSelectedTab("signup")}
          >
            <Typography
              variant="body1"
              sx={{
                borderBottom:
                  selectedTab === "signup"
                    ? `3px solid ${theme.palette.orangePrimary.main}`
                    : "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "11px",
                paddingBottom: "10px",
                cursor: "pointer",
              }}
            >
              {t("signUp")}
            </Typography>
          </Box>
        </Box>

        {/* Content Section - Now flows naturally with page scroll */}
        <Box
          sx={{
            // 🔴 REMOVED: flexGrow: 1 - not needed without fixed container
            marginBottom: "10px",
            paddingX: "10px",
          }}
        >
          {selectedTab === "login" && <LoginPage />}
          {selectedTab === "signup" && <SignUpPage />}
        </Box>
      </Box>
    </Box>
  );
};

export default QtapHome;
