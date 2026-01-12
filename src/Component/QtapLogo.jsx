import { Typography, Box, Button } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import { useTranslation } from "react-i18next";
import { WEBSITE_SERVER_URL } from "../utils/constants";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

/* 2 backgroundColor


text 
:theme.palette.text.fixedWhite
*/
const QtapLogo = ({
  outSideAppNavigationURL = null,
  inAppNavigationURL = null,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [direction, setDirection] = useState("ltr"); // Default to LTR

  useEffect(() => {
    const getDirection = () => {
      // Multiple fallbacks to ensure we get the right direction
      return (
        document.documentElement.dir ||
        document.body.dir ||
        document.documentElement.getAttribute("dir") ||
        getComputedStyle(document.documentElement).direction ||
        "ltr"
      );
    };

    // Initial check
    setDirection(getDirection());

    // Delayed check to ensure DOM is fully loaded
    const timeoutId = setTimeout(() => {
      setDirection(getDirection());
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);
  const getBorderRadius = () => {
    return direction === "rtl" ? "8% 0% 0% 8%" : "0% 8% 8% 0%";
  };
  const ImageContainer = styled(Box)({
    backgroundImage: "url(/images/Qtop1.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    height: "100vh",
    alignItems: "center",
    position: "relative",
    borderRadius: getBorderRadius(),
    "::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      zIndex: 1,
      borderRadius: getBorderRadius(),
    },
  });
  const TextOverlay = styled(Box)({
    position: "absolute",
    zIndex: 2,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "start",
    color: theme.palette.text.fixedWhite,
    padding: "20px",
  });
  const Divider = styled(Box)({
    width: "18%",
    height: "4px",
    backgroundColor: theme.palette.orangePrimary.main,
    margin: "40px 0px 20px 0px",
    borderRadius: "20px",
  });

  return (
    <ImageContainer
      sx={{
        position: "relative",
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center", // centers text vertically
        justifyContent: "center", // centers text horizontally
      }}
    >
      {/* Top Buttons Row */}
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          left: 0,
          right: 0,
          px: 3, // padding on sides
          display: "flex",
          justifyContent: "space-between", // push buttons apart
          zIndex: 8,
        }}
      >
        <Button
          disableRipple
          sx={{
            color: theme.palette.text.fixedWhite,
            "&:hover": {
              backgroundColor: "transparent",
              color: theme.palette.text.fixedDarkOrange,
            },
          }}
          onClick={() => {
            window.location.href = WEBSITE_SERVER_URL;
          }}
        >
          {i18n.dir() === "ltr" ? (
            <ChevronLeftOutlinedIcon sx={{ fontSize: "33px" }} />
          ) : (
            <ChevronRightOutlined sx={{ fontSize: "33px" }} />
          )}
        </Button>
      </Box>

      {/* Centered Text */}
      <TextOverlay
        className="flex flex-col items-start"
        sx={{ width: "80%", textAlign: "center", zIndex: 7 }}
      >
        <Typography
          variant="h1"
          sx={{
            width: "80%",
            fontSize: "29px",
            fontWeight: "600",
            wordSpacing: "3px",
          }}
        >
          {t("qtapLogoPageTitle")}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="body1"
          sx={{
            fontSize: "11px",
            width: "70%",
            color: `${theme.palette.text.fixedWhite} !important`,
          }}
        >
          {t("qtapLogoPageParagraph")}
        </Typography>
      </TextOverlay>
    </ImageContainer>
  );
};

export default QtapLogo;
