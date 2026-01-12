import { Typography } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import React from "react";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#AD4181", "#D8E0E0"];

export const Cart3 = ({ Affiliate_Users }) => {
  const { t } = useTranslation();
  const [affiliates, setAffiliates] = React.useState({});
  const theme = useTheme();
  React.useEffect(() => {
    let isMounted = true; // Flag to prevent setting state if component is unmounted
    const updateAffiliates = () => {
      if (isMounted) {
        if (Affiliate_Users) {
          setAffiliates(Affiliate_Users);
        } else {
          setAffiliates({});
        }
      }
    };
    updateAffiliates();
    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted component
    };
  }, [Affiliate_Users]);

  // تحويل البيانات إلى تنسيق Pie Chart
  const pieData = affiliates.active_percentage
    ? [
      { name: "Affiliated", value: parseFloat(affiliates.active_percentage) },
      { name: "Remaining", value: 100 - parseFloat(affiliates.active_percentage) },
    ]
    : [
      { name: "Affiliated", value: 0 },
      { name: "Remaining", value: 100 },
    ];


  return (
    <Box
      display={"flex"}
      justifyContent="space-between"
      alignItems="center"
      padding={"0px 15px"}
      sx={{ marginTop: "15px" }}
    >
      <Box>
        <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
          <Box
            component="span"
            sx={{
              backgroundColor: COLORS[1],
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
            sx={{ fontSize: "7px" }}
          >
            {t("subscriptions")}
          </Typography>
        </Box>

        <Box
          display={"flex"}
          textAlign={"center"}
          alignItems={"center"}
          marginTop={"10px"}
        >
          <Box
            component="span"
            sx={{
              background: "linear-gradient(to right , #893e9c , #fd4845 )",
              width: "15px",
              borderRadius: "20px",
              height: "6px",
              display: "inline-block",
              marginRight: "7px",
            }}
          />
          <Typography
            variant="body2"
            color={theme.palette.text.gray}
            sx={{ fontSize: "8px" }}
          >
            {t("affiliatedSub")}
          </Typography>
        </Box>
      </Box>
      <PieChart width={120} height={120}>
        <defs>
          <linearGradient id="colorGradient2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fd4845" />
            <stop offset="100%" stopColor="#893e9c" />
          </linearGradient>
        </defs>
        <Pie
          data={pieData}
          cx={55}
          cy={55}
          innerRadius={40}
          outerRadius={60}
          fill="#D8E0E0"
          paddingAngle={0}
          startAngle={0}
          endAngle={450}
        >
          <Cell fill="url(#colorGradient2)" strokeWidth={0.2} cornerRadius={5} />
          <Cell fill="#D8E0E0" />
        </Pie>
        <text
          x={62}
          y={62}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={COLORS[0]}
          fontSize="22"
        >
          {affiliates.active_percentage || "0%"}
        </text>
      </PieChart>
    </Box>
  );
};