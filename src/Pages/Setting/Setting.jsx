import React, { useRef, useState } from "react";
import { Box, Tab, Tabs, Button, useTheme } from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import { Features } from "./Features";
import OurClients from "./OurClients";
import { FAQ } from "./FAQ";
import { Videos } from "./Videos";
import Content from "./Content";
import Payment from "./Payment";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { useTranslation } from "react-i18next";

export const Setting = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();
  const featuresRef = useRef();
  const videosRef = useRef();
  const faqRef = useRef();
  const contentRef = useRef();
  const ourClientsRef = useRef();
  const paymentRef = useRef();
  const { t } = useTranslation()

  const tabData = [
    {
      label: t("features"),
      icon: (
        <span class="icon-new-features" style={{ fontSize: "18px" }}></span>
      ),
      content: <Features ref={featuresRef} />,
    },

    {
      label: t("ourClients"),

      icon: (
        <img
          src="/assets/Clients.svg"
          alt="icon"
          style={{ width: "18px", height: "18px" }}
        />
      ),
      content: <OurClients ref={ourClientsRef} />,
    },

    {
      label: t("videos"),
      icon: <PlayArrowOutlinedIcon sx={{ fontSize: "22px" }} />,
      content: <Videos ref={videosRef} />,
    },

    {
      label: t("faq"),
      icon: <span class="icon-question" style={{ fontSize: "18px" }}></span>,
      content: <FAQ ref={faqRef} />,
    },

    {
      label: t("content"),
      icon: <ContentPasteIcon sx={{ fontSize: "18px" }} />,
      content: <Content ref={contentRef} />,
    },
    {
      label: t("payment"),
      icon: <PaymentOutlinedIcon style={{ width: "18px", height: "18px" }} />,
      content: <Payment ref={paymentRef} />,
    },
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // recieve handleSave from child component
  const handleSave = () => {
    if (selectedTab === 0 && featuresRef.current) {
      featuresRef.current.saveFeatures();
    }
    if (selectedTab === 1 && ourClientsRef.current) {
      ourClientsRef.current.saveClients();
    }
    if (selectedTab === 2 && videosRef.current) {
      videosRef.current.saveVideos();
    }
    if (selectedTab === 3 && faqRef.current) {
      faqRef.current.saveFaq();
    }
    if (selectedTab === 4 && contentRef.current) {
      contentRef.current.saveContent();
    }
    if (selectedTab === 5 && paymentRef.current) {
      paymentRef.current.savePayment();
    }
  };

  return (
    <Box sx={{ padding: "0px 30px" }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: { backgroundColor: theme.palette.orangePrimary.main, height: "3px" },
          }}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          sx={{
            overflowX: 'auto', // Enable horizontal scroll
            scrollSnapType: 'x mandatory', // Snap on horizontal scroll
            scrollBehavior: 'smooth', // Smooth scrolling
            color:theme.palette.text.gray
          }}
        >
          {tabData.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box display="flex" alignItems="center">
                  {tab.icon}
                  <Box marginLeft={"6px"} fontSize={"14px"}>
                    {tab.label}
                  </Box>
                </Box>
              }
              sx={{
                scrollSnapAlign: 'start',
                textTransform: "capitalize",
                color: selectedTab === index ? theme.palette.orangePrimary.main : "#575756",
                "&.Mui-selected": { color: "#575756" },
              }}
            />
          ))}
        </Tabs>

        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: theme.palette.orangePrimary.main,
            height: "25px",
            width: "12%",
            minWidth: "85px",
            borderRadius: "20px",
            textTransform: "capitalize",
            color: "white",
            "&:hover": {
              backgroundColor: "#ef7d04",
            },
          }}
        >
          ✔ {t("save")}
        </Button>
      </Box>

      <Box mt={1}>{tabData[selectedTab].content}</Box>
    </Box>
  );
};
