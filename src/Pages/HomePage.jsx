import React, { useEffect, useState, useRef } from "react";
import QtapLogo from "../Component/QtapLogo";
import QtapHome from "../Component/QtapHome";
import { Box, Grid, useTheme } from "@mui/material";

import Language from "../Component/dashboard/TopBar/Language";
import { getUserDataFromCookies } from "../api/Client/getUserDataFromCookies";
import { useNavigate } from "react-router";
import SupportChat from "../Component/chat/SupportChat";

export const HomePage = () => {
  const [selectedTab, setSelectedTab] = useState("login");
  const navigate = useNavigate();
  const theme = useTheme();
  const hasChecked = useRef(false);

  // Check if user is already logged in using same logic as ProtectedRouteClient
  const isAlreadyAuthenticated = () => {
    try {
      const userDataString = localStorage.getItem('UserData');
      if (!userDataString) return false;
      const userData = JSON.parse(userDataString);
      return userData?.user?.user_type === "qtap_clients" && userData?.user?.role === "admin";
    } catch {
      return false;
    }
  };

  useEffect(() => {
    // Prevent multiple checks
    if (hasChecked.current) return;
    hasChecked.current = true;

    // If already authenticated with valid UserData, go to dashboard
    if (isAlreadyAuthenticated()) {
      navigate("/dashboard-client", { replace: true });
      return;
    }

    // Otherwise check cookies API
    const checkLogin = async () => {
      try {
        const res = await getUserDataFromCookies();
        if (res?.data?.authenticated && res?.data?.user) {
          // Save to UserData (same key as ProtectedRouteClient checks)
          localStorage.setItem('UserData', JSON.stringify({ user: res.data.user }));
          navigate("/dashboard-client", { replace: true });
        }
      } catch {
        // Clear any stale data
        localStorage.removeItem('UserData');
      }
    };

    checkLogin();
  }, [navigate]);

  return (
    <Box
      className="h-full testest"
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
      <Grid container spacing={0}>
        <Grid item xs={12} md={6}>
          <QtapLogo />
        </Grid>

        <Grid item xs={12} md={6}>
          {/* language component */}
          <Box
            className="flex flex-1 mt-[20px] justify-end ps-2"
            sx={{
              cursor: "pointer",
              alignItems: "center",
              zIndex: "2000",
            }}
          >
            <SupportChat />
            <Language />
          </Box>
          {/* login component */}
          <Box
            className="flex flex-1 justify-center items-center mx-[2%] md:mx-[10%] lg:mx-[15%]"
            // 🔴 REMOVED: maxHeight="calc(100vh - 70px)" - this was preventing natural scroll
            sx={{
              minHeight: "calc(100vh - 120px)", // 🔴 ADDED: minHeight instead of maxHeight for natural flow
            }}
          >
            <Box
              // 🔴 REMOVED: className="flex flex-col justify-center items-center" - conflicted with natural scroll
              sx={{
                flexGrow: "1",
                display: "flex",
                flexDirection: "column", // 🔴 ADDED: Explicit flex direction
                justifyContent: "center", // 🔴 ADDED: Center content vertically
                alignItems: "center", // 🔴 ADDED: Center content horizontally
                width: "100%", // 🔴 ADDED: Full width
              }}
            >
              <QtapHome
                setSelectedTab={setSelectedTab}
                selectedTab={selectedTab}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
