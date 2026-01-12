import React, { useEffect } from "react";
import { Box, Grid, MenuItem, Paper, Select, Typography, useTheme } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LineChart2 from "../LineChart2";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../../utils/constants";
import { toNumberSafe } from "../../../utils/toNumberSafeFn";

export const Revenue = () => {
  const [year, setYear] = React.useState("2025");
  const [revenueData, setRevenueData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation()
  const theme = useTheme();
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };
  const getRvenueData = async () => {
    try {
      setLoading(true)

      const response = await fetch(`${BASE_URL}Sales/${year}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      const data = await response.json();
      if (response.ok) {
        setRevenueData(data);
        setLoading(false)

      }
    } catch (error) {
      console.log("error", error);
      setLoading(false)
    }
  }
  useEffect(() => {
    let isMounted = true; // Flag to prevent setting state if component is unmounted
    const fetchRevenueData = async () => {
      if (isMounted) {
        await getRvenueData();
      }
    };
    fetchRevenueData();
    return () => {
      isMounted = false; // Cleanup to prevent multiple requests
    };
  }, [year]);
  return (

    <Paper
      sx={{
        padding: "30px 30px",
        minHeight: "250px",
        height: "fit-content",
        width: "100%",
        borderRadius: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        // overflow:'auto'
      }}
    >
      <Grid width={"85%"} display={"flex"} flexDirection="column" >
        <Grid container display={"flex"} flexDirection="column" >
          <Box display={"flex"} justifyContent="space-between">
            <Typography
              variant="body1"
              sx={{ fontSize: "18px", color: theme.palette.text.gray }}
            >
              {t("Revenue")}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Select
                value={year}
                onChange={handleYearChange}
                sx={{
                  height: "24px",
                  fontSize: "14px",
                  marginRight: "-30px",
                  ".MuiOutlinedInput-notchedOutline": { border: 0 },
                  ".MuiSelect-icon": { fontSize: "20px" },
                }}
              >
                <MenuItem value="2023" sx={{ fontSize: "10px", color: theme.palette.text.gray }}>
                  2023
                </MenuItem>
                <MenuItem value="2024" sx={{ fontSize: "10px", color: theme.palette.text.gray }}>
                  2024
                </MenuItem>
                <MenuItem value="2025" sx={{ fontSize: "10px", color: theme.palette.text.gray }}>
                  2025
                </MenuItem>
              </Select>
            </Box>
          </Box>
          <span
            style={{ color: "rgb(175, 175, 173)", fontSize: "8px", marginTop: "-5px" }}
          >
            {t("affiliateMarketing")}
          </span>

          <Typography
            variant="body1"
            sx={{ fontSize: "28px", marginTop: "15px", color: theme.palette.orangePrimary.main }}
          >
            {(() => {
              const sum = Object.values(revenueData)
                .map((order) => order.total_revenue || 0)
                .reduce((acc, curr) => acc + curr, 0);

              return toNumberSafe(sum);
            })()}{" "}
            <span style={{ fontSize: "15px", color: theme.palette.text.gray }}>EGP</span>
          </Typography>
        </Grid>

        <Grid
          sx={{
            height: "170px",
            width: "110%",
            maxWidth: "430px",
            marginTop: "15px",
            marginLeft: "-40px",
          }}
        >
          <LineChart2 revenueData={revenueData} />
        </Grid>
      </Grid>

      <Grid width={"25%"}>
        <Box sx={{ position: "relative", top: "-58px", left: "60px" }}>
          <span
            class="icon-social"
            style={{ fontSize: "30px", color: "#D8E0E0" }}
          >
            {" "}
          </span>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "5px",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "14px",
              alignItems: "center",
              display: "flex",
              color: theme.palette.text.gray,
            }}
          >
            <PersonOutlinedIcon sx={{ fontSize: "18px", color: theme.palette.text.gray, marginBottom: "5px" }} />{" "}
            {t("users")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.gray,
              marginBottom: "10px",
              fontSize: "20px",
              border: "1px solid #575756",
              padding: "4px 20px",
              borderRadius: "30px",
            }}
          >
            50,000?!
          </Typography>
          <Box marginTop="20px" justifyContent="left">
            <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(to right, rgb(163, 215, 255), #2DA0F6)",
                  width: "20px",
                  borderRadius: "20px",
                  height: "8px",
                  display: "inline-block",
                  marginRight: "8px",
                }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "9px" }}
              >
                {t("Revenue")}
              </Typography>
            </Box>
            <Box
              display={"flex"}
              textAlign={"center"}
              alignItems={"center"}
              marginTop="5px"
            >
              <Box
                component="span"
                sx={{
                  backgroundImage: "linear-gradient(to right, rgb(250, 160, 214), #AD4081)",
                  width: "20px",
                  borderRadius: "20px",
                  height: "8px",
                  display: "inline-block",
                  marginRight: "8px",
                }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "9px" }}
              >
                {t("users")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Paper>
  );
};
