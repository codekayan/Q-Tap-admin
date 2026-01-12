import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CardTravelOutlinedIcon from "@mui/icons-material/CardTravelOutlined";
import TableBarIcon from "@mui/icons-material/TableBar";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightIcon from "@mui/icons-material/Nightlight";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { ArrowForwardIos, ArrowBackIos, Print } from "@mui/icons-material";
import { timeOptions } from "../../../../Component/Business-info/WorkingHoursDays";
import { useTranslation } from 'react-i18next';
import MapWithPin from "../../../../utils/MapWithPin";

const daysOfWeek = ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"];

export const BusinessInfoAdmin = ({
  businessInfo,
  setBusinessInfo,
  selectedBranchIndex,
  setSelectedBranchIndex,
}) => {
  const handleBranchClick = (index) => {
    setSelectedBranchIndex(index);
  };

  const currentBranch = businessInfo[selectedBranchIndex] || {};
  const theme = useTheme()
  const { t, i18n } = useTranslation();
  const handleChange = (field, value) => {
    setBusinessInfo((prev) =>
      prev.map((branch, index) =>
        index === selectedBranchIndex ? { ...branch, [field]: value } : branch
      )
    );
  };

  const handleContactInfoChange = (field, value) => {
    setBusinessInfo((prev) =>
      prev.map((branch, index) =>
        index === selectedBranchIndex
          ? {
            ...branch,
            contact_info: { ...branch.contact_info, [field]: value },
          }
          : branch
      )
    );
  };

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      handleChange("default_mode", newMode);
    }
  };

  const handleDesignChange = (event, newDesign) => {
    if (newDesign !== null) {
      handleChange("menu_design", newDesign);
    }
  };

  const handleDayClick = (day) => {
    const dayMap = {
      Sa: "Saturday",
      Su: "Sunday",
      Mo: "Monday",
      Tu: "Tuesday",
      We: "Wednesday",
      Th: "Thursday",
      Fr: "Friday",
    };
    const fullDay = dayMap[day];
    const currentSchedules = currentBranch.workschedule || [];
    const existingSchedule = currentSchedules.find((s) => s.day === fullDay);

    let updatedSchedules;
    if (existingSchedule) {
      updatedSchedules = currentSchedules.filter((s) => s.day !== fullDay);
    } else {
      updatedSchedules = [
        ...currentSchedules,
        {
          day: fullDay,
          opening_time: "9:00 am",
          closing_time: "5:00 pm",
        },
      ];
    }

    setBusinessInfo((prev) =>
      prev.map((branch, index) =>
        index === selectedBranchIndex
          ? { ...branch, workschedule: updatedSchedules }
          : branch
      )
    );
  };

  const handleTimeChange = (event, type) => {
    const value = event.target.value;
    const currentDay = currentBranch.workschedule.find(
      (s) => s.day === currentBranch.currentDay
    );
    if (currentDay) {
      const updatedSchedules = currentBranch.workschedule.map((schedule) =>
        schedule.day === currentBranch.currentDay
          ? {
            ...schedule,
            [type === "from" ? "opening_time" : "closing_time"]: value,
          }
          : schedule
      );
      setBusinessInfo((prev) =>
        prev.map((branch, index) =>
          index === selectedBranchIndex
            ? { ...branch, workschedule: updatedSchedules }
            : branch
        )
      );
    }
  };

  const handleDayToggle = (direction) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentIndex = days.indexOf(currentBranch.currentDay || "Sunday");
    const newIndex =
      (currentIndex + (direction === "next" ? 1 : -1) + days.length) % days.length;
    setBusinessInfo((prev) =>
      prev.map((branch, index) =>
        index === selectedBranchIndex
          ? { ...branch, currentDay: days[newIndex] }
          : branch
      )
    );
  };

  const handleServingWayChange = (name, checked) => {
    const currentServingWays = currentBranch.serving_ways || [];
    let updatedServingWays;
    if (checked) {
      updatedServingWays = [
        ...currentServingWays,
        { name, tables_number: name === "dine_in" ? 1 : null },
      ];
    } else {
      updatedServingWays = currentServingWays.filter((way) => way.name !== name);
    }
    setBusinessInfo((prev) =>
      prev.map((branch, index) =>
        index === selectedBranchIndex
          ? { ...branch, serving_ways: updatedServingWays }
          : branch
      )
    );
  };

  const handlePaymentServiceChange = (name, checked) => {
    const currentPaymentServices = currentBranch.payment_services || [];
    let updatedPaymentServices;
    if (checked) {
      updatedPaymentServices = [...currentPaymentServices, { name }];
    } else {
      updatedPaymentServices = currentPaymentServices.filter(
        (service) => service.name !== name
      );
    }
    setBusinessInfo((prev) =>
      prev.map((branch, index) =>
        index === selectedBranchIndex
          ? { ...branch, payment_services: updatedPaymentServices }
          : branch
      )
    );
  };

  const handlePaymentTimeChange = (time, checked) => {
    setBusinessInfo((prev) =>
      prev.map((branch, index) =>
        index === selectedBranchIndex
          ? { ...branch, payment_time: checked ? time : branch.payment_time }
          : branch
      )
    );
  };

  const handleCallWaiterChange = (checked) => {
    setBusinessInfo((prev) =>
      prev.map((branch, index) =>
        index === selectedBranchIndex
          ? { ...branch, call_waiter: checked ? "active" : "inactive" }
          : branch
      )
    );
  };

  const handlePrint = () => {
    window.print();
  };
  const [isMapOpen, setIsMapOpen] = useState(false)
  const updateBranchPosition = () => { }
  return (
    <Grid container sx={{ marginTop: "20px", paddingLeft: "20px" }}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography
              variant="body2"
              sx={{ fontSize: "15px" }}
              color={theme.palette.text.gray}
              gutterBottom
            >
              {t("busnessInfo")}
            </Typography>
            <Divider
              sx={{ width: "100%", borderBottom: "4px solid #ef7d00", marginBottom: "18px" }}
            />
          </Box>
          <Box>
            <IconButton>
              <span className="icon-delete" style={{ fontSize: "23px", color: theme.palette.text.gray }}></span>
            </IconButton>
            <IconButton onClick={handlePrint}>
              <Print
                style={{ fontSize: "23px", color: theme.palette.text.gray }}
              />
            </IconButton>
          </Box>
        </Box>
        <Box display="flex" gap={2}>
          {businessInfo.map((branch, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() => handleBranchClick(index)}
              sx={{
                backgroundColor: selectedBranchIndex === index ? "#ef7d00" : "#bdbdbd",
                color: "white",
                borderRadius: "10px",
                padding: "3px 15px",
                display: "flex",
                alignItems: "center",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: selectedBranchIndex === index ? "#ef7d00" : "#bdbdbd",
                },
              }}
            >
              <StorefrontOutlinedIcon sx={{ marginRight: "5px", fontSize: "20px" }} />
              {t("branch")} {index + 1} {t("info")}
            </Button>
          ))}
        </Box>
        <Divider sx={{ margin: "12px 0px" }} />
      </Grid>

      <Grid item xs={12} md={12} display="flex" justifyContent="space-between">
        <Grid md={6} sx={{ marginRight: "40px" }}>
          <FormControl variant="outlined" fullWidth>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <StorefrontOutlinedIcon sx={{ fontSize: "20px" }} />
                </InputAdornment>
              }
              value={currentBranch.business_name || ""}
              onChange={(e) => handleChange("business_name", e.target.value)}
              placeholder="Business Name"
              sx={{
                borderRadius: "10px",
                marginBottom: "10px !important",
                height: "33px",
                fontSize: "12px",
              }}
            />
          </FormControl>

          <FormControl variant="outlined" fullWidth>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <PhoneOutlinedIcon sx={{ fontSize: "20px" }} />
                </InputAdornment>
              }
              value={currentBranch.contact_info?.business_phone || ""}
              onChange={(e) => handleContactInfoChange("business_phone", e.target.value)}
              placeholder="Business Phone"
              sx={{
                borderRadius: "10px",
                height: "33px",
                marginBottom: "10px",
                fontSize: "12px",
              }}
            />
          </FormControl>

          <FormControl variant="outlined" fullWidth>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <MailOutlinedIcon sx={{ fontSize: "20px" }} />
                </InputAdornment>
              }
              value={currentBranch.contact_info?.business_email || ""}
              onChange={(e) => handleContactInfoChange("business_email", e.target.value)}
              placeholder="Business Email"
              type="email"
              sx={{
                borderRadius: "10px",
                marginBottom: "10px",
                height: "33px",
                fontSize: "12px",
              }}
            />
          </FormControl>

          <Box display="flex" justifyContent="space-between" width="100%" marginBottom="10px">
            <FormControl variant="outlined" sx={{ width: "48%" }}>
              <Select
                value={currentBranch.business_country || ""}
                onChange={(e) => handleChange("business_country", e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: "10px",
                  height: "33px",
                  fontSize: "12px",
                  color: theme.palette.text.gray_light,
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <PinDropOutlinedIcon sx={{ fontSize: "20px" }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="" disabled>
                  Country
                </MenuItem>
                <MenuItem value="US">United States</MenuItem>
                <MenuItem value="CA">Canada</MenuItem>
                <MenuItem value="UK">United Kingdom</MenuItem>
                <MenuItem value="Egypt">Egypt</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ width: "48%" }}>
              <Select
                value={currentBranch.business_city || ""}
                onChange={(e) => handleChange("business_city", e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: "10px",
                  height: "33px",
                  fontSize: "12px",
                  color: theme.palette.text.gray_light,
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <PinDropOutlinedIcon sx={{ fontSize: "20px" }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="" disabled>
                  City
                </MenuItem>
                <MenuItem value="NY">New York</MenuItem>
                <MenuItem value="LA">Los Angeles</MenuItem>
                <MenuItem value="CHI">Chicago</MenuItem>
                <MenuItem value="Cairo">Cairo</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" alignItems="center" marginBottom="10px">
            {/* <Button
              variant="contained"
              fullWidth
              sx={{
                textTransform: "capitalize",
                backgroundColor: "#222240",
                color: "white",
                borderRadius: "10px",
                fontSize: "11px",
                height: "30px",
                "&:hover": {
                  backgroundColor: "#222240",
                },
              }}
            >
              <span
                className="icon-map-1"
                style={{ fontSize: "18px", marginRight: "6px" }}
              >
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
                <span className="path5"></span>
                <span className="path6"></span>
                <span className="path7"></span>
                <span className="path8"></span>
                <span className="path9"></span>
                <span className="path10"></span>
                <span className="path11"></span>
                <span className="path12"></span>
                <span className="path13"></span>
                <span className="path14"></span>
                <span className="path15"></span>
              </span>
              Pin Your Location
            </Button> */}
            <MapWithPin setPos={updateBranchPosition} isMapOpen={isMapOpen} setIsMapOpen={setIsMapOpen} />
          </Box>

          <FormControl variant="outlined" sx={{ width: "100%", marginBottom: "10px" }}>
            <Select
              value={currentBranch.currency_id || ""}
              onChange={(e) => handleChange("currency_id", e.target.value)}
              displayEmpty
              sx={{
                borderRadius: "10px",
                height: "33px",
                fontSize: "12px",
                color: theme.palette.text.gray_light,
              }}
              startAdornment={
                <InputAdornment position="start">
                  <AttachMoneyIcon sx={{ fontSize: "20px" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="" disabled>
                Currency
              </MenuItem>
              <MenuItem value="1">USD</MenuItem>
              <MenuItem value="2">CAD</MenuItem>
              <MenuItem value="3">GBP</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "100%", marginBottom: "10px" }}>
            <Select
              value={currentBranch.business_format || ""}
              onChange={(e) => handleChange("business_format", e.target.value)}
              displayEmpty
              sx={{
                borderRadius: "10px",
                height: "33px",
                fontSize: "12px",
                color: theme.palette.text.gray_light,
              }}
              startAdornment={
                <InputAdornment position="start">
                  <CardTravelOutlinedIcon sx={{ fontSize: "20px" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="" disabled>
                Business Type
              </MenuItem>
              <MenuItem value="uk">UK</MenuItem>
              <MenuItem value="ul">UL</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "100%", marginBottom: "10px" }}>
            <Select
              value={currentBranch.language || ""}
              onChange={(e) => handleChange("language", e.target.value)}
              displayEmpty
              sx={{
                borderRadius: "10px",
                height: "33px",
                fontSize: "12px",
                color: theme.palette.text.gray_light,
              }}
              startAdornment={
                <InputAdornment position="start">
                  <LanguageOutlinedIcon sx={{ fontSize: "20px" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="" disabled>
                Menu Default Language
              </MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ar">Arabic</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "100%", marginBottom: "10px" }}>
            <Select
              value={
                currentBranch.serving_ways?.find((way) => way.name === "dine_in")?.tables_number ||
                ""
              }
              onChange={(e) => {
                const value = e.target.value;
                setBusinessInfo((prev) =>
                  prev.map((branch, index) =>
                    index === selectedBranchIndex
                      ? {
                        ...branch,
                        serving_ways: branch.serving_ways.map((way) =>
                          way.name === "dine_in"
                            ? { ...way, tables_number: value }
                            : way
                        ),
                      }
                      : branch
                  )
                );
              }}
              displayEmpty
              sx={{
                borderRadius: "10px",
                height: "33px",
                fontSize: "12px",
                color: theme.palette.text.gray_light,
              }}
              startAdornment={
                <InputAdornment position="start">
                  <TableBarIcon sx={{ fontSize: "20px" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="" disabled>
                How Many Tables Do You Have
              </MenuItem>
              {[...Array(12).keys()].map((i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider
            sx={{ width: "100%", borderBottom: "1px solid #9d9d9c", marginBottom: "18px" }}
          />

          <Typography
            variant="body2"
            sx={{ fontSize: "14px", color: theme.palette.text.gray_light, display: "flex" }}
          >
            <SellOutlinedIcon sx={{ color: theme.palette.text.gray_light, fontSize: "20px", marginRight: "6px" }} />{" "}
            {t("bundle")}
          </Typography>

          <Box display="flex" alignItems="center" justifyContent="flex-start" mb={2}>
            <Button
              variant="outlined"
              sx={{
                border: "1px solid gray",
                textTransform: "capitalize",
                color: theme.palette.text.gray_light,
                padding: "1px 25px",
                borderRadius: "8px",
              }}
            >
              <CheckOutlinedIcon
                sx={{ fontSize: "20px", marginRight: "6px", color: "#ef7d00" }}
              />{" "}
              {t("pro")}
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#222240",
                textTransform: "capitalize",
                color: "white",
                padding: "3px 30px",
                borderRadius: "8px",
                marginLeft: "10px",
                "&:hover": {
                  backgroundColor: "#322240",
                },
              }}
            >
              {t("changeBundle")}
            </Button>
          </Box>
        </Grid>

        <Grid md={6}>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              marginTop: "10px",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", width: "100%" }}>
              <Grid container spacing={1} marginLeft={"2px"} >
                <Typography
                  variant="h3"
                  sx={{ fontSize: "14px", width: "100%", fontWeight: "500", color: theme.palette.text.gray, marginBottom: "6px" }}
                >
                  {t("defaultMode")}
                </Typography>
                <ToggleButtonGroup
                  value={currentBranch.default_mode || "white"}
                  exclusive
                  onChange={handleModeChange}
                  sx={{
                    backgroundColor: "transparent",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%"
                  }}
                >
                  <ToggleButton
                    value="white"
                    sx={{
                      padding: "5px 8px",
                      border: "1px solid !important", // Adds border
                      borderColor: currentBranch.default_mode === "white" ? "#E57C00 !important" : theme.palette.text.gray_light,
                      borderRadius: "8px !important",
                      backgroundColor: currentBranch.default_mode === "white" ? "#E57C00" : "inherit",
                      color: currentBranch.default_mode === "white" ? "#FFFFFF" : theme.palette.text.gray_light,
                      "&:hover": {
                        backgroundColor: currentBranch.default_mode === "white" ? "#E57C00" : theme.palette.action.hover,
                      },
                    }}
                  >
                    <WbSunnyIcon
                      sx={{
                        fontSize: "30px",
                        color: currentBranch.default_mode === "white" ? "#E57C00" : theme.palette.text.gray_light,
                      }}
                    />
                  </ToggleButton>
                  <ToggleButton
                    value="dark"
                    sx={{
                      padding: "5px 8px",
                      border: "1px solid !important", // Adds border
                      borderColor: currentBranch.default_mode === "dark" ? "#E57C00 !important" : theme.palette.text.gray_light,
                      borderRadius: "8px !important",
                      backgroundColor: currentBranch.default_mode === "dark" ? "#E57C00" : "inherit",
                      color: currentBranch.default_mode === "dark" ? "#FFFFFF" : theme.palette.text.gray_light,
                      "&:hover": {
                        backgroundColor: currentBranch.default_mode === "dark" ? "#E57C00" : theme.palette.action.hover,
                      },
                    }}
                  >
                    <NightlightIcon
                      sx={{
                        fontSize: "30px",
                        color: currentBranch.default_mode === "dark" ? "#E57C00" : theme.palette.text.gray_light,
                      }}
                    />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  height: "60px",
                  margin: "0 25px",
                  width: "1px",
                  backgroundColor: "orange",
                }}
              />

              <Grid container spacing={1} >
                <Typography
                  variant="h6"
                  sx={{ fontSize: "14px", width: "100%", fontWeight: "500", color: theme.palette.text.gray, marginBottom: "6px" }}
                >
                  {t("menus.design")}
                </Typography>
                <ToggleButtonGroup
                  value={currentBranch.menu_design || "grid"}
                  exclusive
                  onChange={handleDesignChange}
                  sx={{
                    backgroundColor: "transparent",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%"
                  }}
                >
                  <ToggleButton
                    value="grid"
                    sx={{
                      padding: "7px 8px",
                      border: "1px solid !important", // Adds border
                      borderColor: currentBranch.menu_design === "grid" ? "#E57C00 !important" : theme.palette.text.gray_light,
                      borderRadius: "8px !important",
                      backgroundColor: currentBranch.menu_design === "grid" ? "#E57C00" : "inherit",
                      color: currentBranch.menu_design === "grid" ? "#FFFFFF" : theme.palette.text.gray_light,
                      "&:hover": {
                        backgroundColor: currentBranch.menu_design === "grid" ? "#E57C00" : theme.palette.action.hover,
                      },
                    }}
                  >
                    <ViewQuiltIcon
                      sx={{
                        fontSize: "30px",
                        color: currentBranch.menu_design === "grid" ? "#E57C00" : theme.palette.text.gray_light,
                      }}
                    />
                  </ToggleButton>
                  <ToggleButton
                    value="list"
                    sx={{
                      padding: "6px 8px",
                      border: "1px solid !important", // Adds border
                      borderColor: currentBranch.menu_design === "list" ? "#E57C00 !important" : theme.palette.text.gray_light,
                      borderRadius: "8px !important",
                      backgroundColor: currentBranch.menu_design === "list" ? "#E57C00" : "inherit",
                      color: currentBranch.menu_design === "list" ? "#FFFFFF" : theme.palette.text.gray_light,
                      "&:hover": {
                        backgroundColor: currentBranch.menu_design === "list" ? "#E57C00" : theme.palette.action.hover,
                      },
                    }}
                  >
                    <FormatListBulletedIcon
                      sx={{
                        fontSize: "30px",
                        color: currentBranch.menu_design === "list" ? "#E57C00" : theme.palette.text.gray_light,
                      }}
                    />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Box>

            <Divider
              sx={{ backgroundColor: "#f4f6fc", height: "2px", margin: "8px 0px" }}
              flexItem
            />
            <Box>
              <Grid container spacing={2} alignItems="center" justifyContent={"space-between"}>
                <Grid item xs={12} display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    display="flex"
                    alignItems="center"
                    sx={{ fontSize: "14px", color: theme.palette.text.gray, marginLeft: "3px" }}
                  >
                    <span
                      className="icon-working-hour"
                      style={{ marginRight: "10px", fontSize: "22px", color: theme.palette.text.gray }}
                    >
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                      <span className="path4"></span>
                      <span className="path5"></span>
                      <span className="path6"></span>
                      <span className="path7"></span>
                      <span className="path8"></span>
                    </span>
                    {t("workHours")}
                  </Typography>

                  <Grid item xs={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={"space-between"}
                      sx={{
                        backgroundColor: "#222240",
                        borderRadius: "20px",
                        width: "110px",
                        height: "30px",
                      }}
                    >
                      <IconButton
                        onClick={() => handleDayToggle("prev")}
                        sx={{ color: "#ef7d00" }}
                      >
                        <ArrowBackIos sx={{ fontSize: "11px" }} />
                      </IconButton>
                      <Typography
                        sx={{
                          textTransform: "capitalize",
                          color: "white",
                          fontSize: "10px",
                        }}
                      >
                        {currentBranch.currentDay || "Sunday"}
                      </Typography>

                      <IconButton
                        onClick={() => handleDayToggle("next")}
                        sx={{ color: "#ef7d00" }}
                      >
                        <ArrowForwardIos sx={{ fontSize: "11px" }} />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>

                <Grid item xs={7}>
                  <Box display="flex" flexWrap="wrap">
                    {daysOfWeek.map((day) => {
                      const dayMap = {
                        Sa: "Saturday",
                        Su: "Sunday",
                        Mo: "Monday",
                        Tu: "Tuesday",
                        We: "Wednesday",
                        Th: "Thursday",
                        Fr: "Friday",
                      };
                      const isSelected = (currentBranch.workschedule || []).some(
                        (schedule) => schedule.day === dayMap[day]
                      );
                      return (
                        <Button
                          key={day}
                          onClick={() => handleDayClick(day)}
                          sx={{
                            minWidth: "25px",
                            height: "30px",
                            width: "30px",
                            margin: "3px",
                            borderRadius: "5px",
                            textTransform: "capitalize",
                            fontSize: "12px",
                            border: isSelected ? "1px solid #ef7d00" : "1px solid gray",
                            color: isSelected ? "#ef7d00" : theme.palette.text.gray_light,
                          }}
                        >
                          {day}
                        </Button>
                      );
                    })}
                  </Box>
                </Grid>

                <Grid item xs={3} sx={{ marginRight: "20px" }}>
                  <Grid container spacing={2} alignItems="center" display={"flex"}>
                    <Box display="flex">
                      <Grid item>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "11px", color: theme.palette.text.gray_light, mr: 1 }}
                        >
                          {t("from")}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <TextField
                          select
                          value={
                            currentBranch.workschedule?.find(
                              (s) => s.day === currentBranch.currentDay
                            )?.opening_time || "9:00 am"
                          }
                          onChange={(e) => handleTimeChange(e, "from")}
                          size="small"
                          sx={{ width: "90px", height: "30px" }}
                          inputProps={{ sx: { padding: "2px 10px", fontSize: "12px" } }}
                        >
                          {timeOptions.map((time) => (
                            <MenuItem
                              key={time}
                              value={time}
                              sx={{ color: theme.palette.text.gray_light, fontSize: "12px" }}
                            >
                              <span style={{ fontSize: "10px", color: theme.palette.text.gray_light }}>{time}</span>
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Box>
                    <Box display="flex" marginTop="3px" marginLeft="14px">
                      <Grid item>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "11px", color: theme.palette.text.gray_light, mr: 1 }}
                        >
                          {t("to")}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <TextField
                          select
                          value={
                            currentBranch.workschedule?.find(
                              (s) => s.day === currentBranch.currentDay
                            )?.closing_time || "5:00 pm"
                          }
                          onChange={(e) => handleTimeChange(e, "to")}
                          size="small"
                          sx={{ width: "90px", height: "30px" }}
                          inputProps={{ sx: { padding: "2px 10px", fontSize: "12px" } }}
                        >
                          {timeOptions.map((time) => (
                            <MenuItem
                              key={time}
                              value={time}
                              sx={{ color: theme.palette.text.gray_light, fontSize: "12px" }}
                            >
                              <span style={{ fontSize: "10px", color: theme.palette.text.gray_light }}>{time}</span>
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Box>


            <Divider
              sx={{ backgroundColor: "#f4f6fc", height: "2px", margin: "8px 0px" }}
              flexItem
            />

            <Box>
              <Typography
                variant="body1"
                sx={{ display: "flex", fontSize: "12px", color: theme.palette.text.gray_light, margin: "3px 6px 3px 0" }}
              >
                <span
                  className="icon-waiter"
                  style={{ fontSize: "22px", marginRight: "6px" }}
                ></span>
                {t("servingWay")}
              </Typography>
              <Box display="flex" flexWrap="wrap" justifyContent={"space-between"}>
                {[
                  { name: "dine_in", label: "Dine In" },
                  { name: "take_away", label: "Take Away" },
                  { name: "delivery", label: "Delivery" },
                ].map((way) => (
                  <FormControlLabel
                    key={way.name}
                    control={
                      <Checkbox
                        checked={currentBranch.serving_ways?.some((w) => w.name === way.name) || false}
                        onChange={(e) => handleServingWayChange(way.name, e.target.checked)}
                        sx={{
                          color: theme.palette.text.gray_light,
                          "&.Mui-checked": {
                            color: "#ef7d00",
                          },
                        }} />
                    }
                    label={
                      <Typography sx={{ fontSize: "12px", color: theme.palette.text.gray_light }}>
                        {way.label}
                      </Typography>
                    }
                  />
                ))}
              </Box>
            </Box>
            <Divider
              sx={{ backgroundColor: "#f4f6fc", height: "2px", margin: "8px 0px" }}
              flexItem
            />
            <Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentBranch.call_waiter === "active"}
                    onChange={(e) => handleCallWaiterChange(e.target.checked)}
                    sx={{
                      color: theme.palette.text.gray_light,
                      "&.Mui-checked": {
                        color: "#ef7d00",
                      },
                    }} />
                }
                label={
                  <Typography sx={{ fontSize: "15px", color: "rgb(142, 141, 141)", }}>
                    <span class="icon-hand-up" style={{ fontSize: "22px" }}></span>
                    {t("activeCallWaiter")}
                  </Typography>
                }
              />
            </Box>


            <Divider
              sx={{ backgroundColor: "#f4f6fc", height: "2px", margin: "8px 0px" }}
              flexItem
            />

            <Box>
              <Typography
                variant="body1"
                sx={{ display: "flex", fontSize: "12px", color: theme.palette.text.gray_light, margin: "3px 6px 3px 0" }}
              >
                <span
                  className="icon-payment"
                  style={{ fontSize: "22px", marginRight: "6px" }}
                ></span>
                {t("paymentMethod")}
              </Typography>
              <Box display="flex" flexWrap="wrap" justifyContent={"space-between"}>
                {[
                  { name: "cash", label: "Cash" },
                  { name: "card", label: "Credit Card" },
                  { name: "wallet", label: "Online Payment" },
                ].map((service) => (
                  <FormControlLabel
                    key={service.name}
                    control={
                      <Checkbox
                        checked={
                          currentBranch.payment_services?.some((s) => s.name === service.name) ||
                          false
                        }
                        onChange={(e) => handlePaymentServiceChange(service.name, e.target.checked)}
                        sx={{
                          color: theme.palette.text.gray_light,
                          "&.Mui-checked": {
                            color: "#ef7d00",
                          },
                        }} />
                    }
                    label={
                      <Typography sx={{ fontSize: "12px", color: theme.palette.text.gray_light }}>
                        {service.label}
                      </Typography>
                    }
                  />
                ))}
              </Box>
            </Box>

            <Divider
              sx={{ backgroundColor: "#f4f6fc", height: "2px", margin: "8px 0px" }}
              flexItem
            />

            <Box>
              <Typography
                variant="body1"
                sx={{ display: "flex", fontSize: "12px", color: theme.palette.text.gray_light }}
              >
                <span
                  className="icon-clock"
                  style={{ fontSize: "22px", marginRight: "6px" }}
                ></span>
                {t("paymentTime")}
              </Typography>
              <Box display="flex" flexWrap="wrap">
                {[
                  { time: "before", label: t("beforeServing") },
                  { time: "after", label: t("afterServing") },
                ].map((option) => (
                  <FormControlLabel
                    key={option.time}
                    control={
                      <Radio
                        checked={currentBranch.payment_time === option.time}
                        onChange={(e) => handlePaymentTimeChange(option.time, e.target.checked)}
                        sx={{
                          color: theme.palette.text.gray_light,
                          "&.Mui-checked": {
                            color: "#ef7d00",
                          },
                        }} />
                    }
                    label={
                      <Typography sx={{ fontSize: "14px", color: theme.palette.text.gray_light }}>
                        {option.label}
                      </Typography>
                    }
                  />
                ))}
              </Box>
            </Box>



          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};