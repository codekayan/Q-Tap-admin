
import { Menu, MenuItem, Typography } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import React, { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { useTranslation } from "react-i18next";
import { getPerformanceDashboard } from "../../../store/adminSlice";
import { useDispatch, useSelector } from "react-redux";

export const Cart4 = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const { t } = useTranslation();
  const theme = useTheme();

  const performanceData = useSelector((state) => state.admins?.performanceData);
  const dispatch = useDispatch();

  // Calculate totals from performanceData
  const { subscriptionsTotal, ordersTotal } = React.useMemo(() => {
    if (!performanceData) return { subscriptionsTotal: 0, ordersTotal: 0 };

    let subsTotal = 0;
    let ordsTotal = 0;

    Object.entries(performanceData).forEach(([key, value]) => {
      if (key.startsWith('Subscriptions_')) {
        subsTotal += Number(value);
      } else if (key.startsWith('Orders_')) {
        ordsTotal += Number(value);
      }
    });

    return {
      subscriptionsTotal: subsTotal / 2,
      ordersTotal: ordsTotal / 2
    };
  }, [performanceData]);

  // Prepare chart data
  const subscriptionsData = [
    { name: "Subscriptions", value: subscriptionsTotal },
    { name: "Remaining", value: Math.max(0, 100 - subscriptionsTotal) }
  ];

  const ordersData = [
    { name: "Orders", value: ordersTotal },
    { name: "Remaining", value: Math.max(0, 100 - ordersTotal) }
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (year) => {
    if (year) {
      setSelectedYear(year);
    }
    setAnchorEl(null);
  };

  const years = ["2021-2022", "2022-2023", "2023-2024", "2024-2025"];
  React.useEffect(() => {
    let isMounted = true; // Flag to prevent setting state if component is unmounted
    const fetchPerformanceDashboard = () => {
      if (isMounted) {
        dispatch(getPerformanceDashboard(selectedYear));
      }
    };
    fetchPerformanceDashboard();
    return () => {
      isMounted = false; // Cleanup to prevent multiple requests
    };
  }, [selectedYear]);

  return (
    <>
      <Box display={"flex"} justifyContent="center" alignItems="center">
        <Box sx={{ display: "flex", marginTop: "10px" }}>
          {/* Subscriptions Pie Chart */}
          <PieChart width={120} height={120}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fdb913" />
                <stop offset="100%" stopColor="#f2672e" />
              </linearGradient>
            </defs>
            <Pie
              data={subscriptionsData}
              cx={60}
              cy={60}
              innerRadius={30}
              outerRadius={45}
              fill="#D8E0E0"
              paddingAngle={0}
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="url(#colorGradient)" strokeWidth={.2} cornerRadius={5} />
              <Cell fill="#D8E0E0" />
            </Pie>
            <rect
              x={45}
              y={45}
              width={40}
              height={40}
              fill="url(#colorGradient)"
              rx={50} strokeWidth={.2} cornerRadius={5}
            />
            <text
              x={65}
              y={65}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="14"
            >
              {Math.floor(subscriptionsTotal)}%
            </text>
          </PieChart>

          {/* Orders Pie Chart */}
          <PieChart width={120} height={120}>
            <defs>
              <linearGradient id="colorGradient2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fd4845" />
                <stop offset="100%" stopColor="#893e9c" />
              </linearGradient>
            </defs>
            <Pie
              data={ordersData}
              cx={60}
              cy={60}
              innerRadius={30}
              outerRadius={45}
              fill="#D8E0E0"
              paddingAngle={0}
            >
              <Cell fill="url(#colorGradient2)" strokeWidth={.2} cornerRadius={5} />
              <Cell fill="#D8E0E0" />
            </Pie>
            <rect
              x={45}
              y={45}
              width={40}
              height={40}
              fill="url(#colorGradient2)"
              rx={50}
            />
            <text
              x={65}
              y={65}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="14"
            >
              {Math.floor(ordersTotal)}%
            </text>
          </PieChart>
        </Box>
      </Box>

      <Box display={"flex"} justifyContent={"space-between"} paddingRight={"10px"}>
        <Box justifyContent="left" sx={{ paddingLeft: "20px", marginTop: "20px" }}>
          {/* Subscriptions Legend */}
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <Box
              component="span"
              sx={{
                background: "linear-gradient(to right , #f2672e , #fdb913 )",
                width: "15px",
                borderRadius: "20px",
                height: "6px",
                display: "inline-block",
                marginRight: "8px",
              }}
            />
            <Typography
              variant="body2"
              color={theme.palette.text.gray}
              sx={{ fontSize: "9px" }}
            >
              {t("subscriptions")}
            </Typography>
          </Box>

          {/* Orders Legend */}
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <Box
              component="span"
              sx={{
                background: "linear-gradient(to right , #893e9c , #fd4845 )",
                width: "15px",
                borderRadius: "20px",
                height: "6px",
                display: "inline-block",
                marginRight: "8px",
              }}
            />
            <Typography
              variant="body2"
              color={theme.palette.text.gray}
              sx={{ fontSize: "9px" }}
            >
              {t("order")}
            </Typography>
          </Box>
        </Box>

        {/* Year Selector */}
        <Box>
          <Typography
            variant="body2"
            color={theme.palette.text.gray}
            onClick={handleClick}
            sx={{
              cursor: "pointer",
              display: "flex",
              textAlign: "end",
              alignItems: "end",
              fontSize: "10px",
              marginTop: "30px",
              marginLeft: "20px",
            }}
          >
            {selectedYear}{" "}
            <KeyboardArrowDownOutlinedIcon
              sx={{ fontSize: "12px", marginLeft: "4px", color: theme.palette.text.gray }}
            />
          </Typography>
          <Menu
            disableScrollLock
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleClose(null)}
          >
            {years.map((year) => (
              <MenuItem
                key={year}
                color={theme.palette.text.gray}
                sx={{ fontSize: "10px" }}
                onClick={() => handleClose(year)}
              >
                {year}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    </>
  );
};