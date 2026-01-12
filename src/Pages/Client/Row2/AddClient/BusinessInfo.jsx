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
import { LockKeyhole } from "lucide-react";
import React, { useState, useEffect } from "react";
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
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { timeOptions } from "../../../../Component/Business-info/WorkingHoursDays";
import MapWithPin, { ErrorBoundary } from "../../../../utils/MapWithPin";
import { useSelector, useDispatch } from "react-redux";
import { updateBusinessData, addBranch, selectBranch, clearBusinessData, setBranches } from "../../../../store/register/businessSlice";
import { customErrorLog } from "../../../../utils/customErrorLog";
import { Country, Governorates } from "../../../../utils/city";
import { useColorMode } from "../../../../context/ThemeModeProvider";
import useRegisterChangeThemeMode from "../../../../Hooks/Queries/useRegisterChangeThemeMode";
import useGetGovernAndCityFromQuery from "../../../../Hooks/Queries/public/citys/useGetGovernAndCityFromQuery";

const daysOfWeek = ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"];
const fullDaysOfWeek = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const BusinessInfo = ({ branchErrors }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch()
  const { businessData, branches, selectedBranch } = useSelector((state) => state.registerBranchStore);
  const [branchIndex, setBranchIndex] = useState(selectedBranch || 0);
  const [branchPosition, setBranchPosition] = useState([]);
  const navigate = useNavigate();
  const getFieldError = (errors, branchIndex, field) => {

    const branchKey = "branch" + (branchIndex + 1)
    const error = errors?.[branchKey]?.[field];

    return error ? (
      <span style={{ color: "red" }}>{error}</span>
    ) : null;
  };
  const {
    businessName = '',
    businessPhone = '',
    businessEmail = '',
    pin = "",
    country = '',
    city = '',
    currency = '',
    businessType = '',
    menuLanguage = '',
    tableCount = '',
    mode = 'white',
    design = 'grid',
    workschedules = {
      Saturday: ["9:00 am", "7:00 pm"],
      Sunday: ["9:00 am", "7:00 pm"],
    },
    servingWays = [],
    paymentMethods = [],
    paymentTime = 'after',
    callWaiter = 'inactive',
    latitude = '',
    longitude = ''
  } = branches[branchIndex] || businessData;

  console.log(country)
  const { citysValue, governValue, loadingCities, loadingGovern } = useGetGovernAndCityFromQuery(country)
  // Local state for working hours
  const [selectedDays, setSelectedDays] = useState([]);
  const [currentDay, setCurrentDay] = useState(fullDaysOfWeek[0]); // Default to Saturday
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);

  const updateBranchPosition = (pos) => {
    console.log("selected branch", selectedBranch, "data", pos)
    console.log("all  branch data ", branches,)
    dispatch(updateBusinessData({ longitude: pos.lng }))
    dispatch(updateBusinessData({ latitude: pos.lat }))
  }
  console.log(selectedBranch, latitude, longitude)
  // Initialize local state based on workschedules
  useEffect(() => {
    // Update selectedDays based on workschedules keys
    const newSelectedDays = Object.keys(workschedules).map(
      (day) => daysOfWeek[fullDaysOfWeek.indexOf(day)]
    );
    setSelectedDays(newSelectedDays);

    // Update fromTime and toTime based on currentDay
    setFromTime(workschedules[currentDay]?.[0] || '9:00 am');
    setToTime(workschedules[currentDay]?.[1] || '7:00 pm');
    dispatch(selectBranch(branchIndex))
  }, [workschedules, currentDay, branchIndex]);

  const handleBranchClick = (index) => {
    setBranchIndex(index);
    dispatch(selectBranch(index));
    dispatch(updateBusinessData(branches[index]));
  };

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      dispatch(updateBusinessData({ mode: newMode }));
    }
  };

  const handleDesignChange = (event, newDesign) => {
    if (newDesign !== null) {
      dispatch(updateBusinessData({ design: newDesign }));
    }
  };

  const handleInputChange = (field, value) => {
    dispatch(updateBusinessData({ [field]: value }));
  };

  const handleDayClick = (day) => {
    const fullDay = fullDaysOfWeek[daysOfWeek.indexOf(day)];
    const newSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    setSelectedDays(newSelectedDays);

    const updatedSchedules = { ...workschedules };
    if (newSelectedDays.includes(day)) {
      // Add day with current fromTime/toTime or defaults
      updatedSchedules[fullDay] = [fromTime, toTime];
    } else {
      // Remove day
      delete updatedSchedules[fullDay];
    }

    dispatch(updateBusinessData({ workschedules: updatedSchedules }));
  };

  const handleTimeChange = (event, type) => {
    const newTime = event.target.value;
    if (type === 'from') {
      setFromTime(newTime);
    } else {
      setToTime(newTime);
    }

    // Update workschedules only if the current day is selected
    const dayAbbr = daysOfWeek[fullDaysOfWeek.indexOf(currentDay)];
    if (selectedDays.includes(dayAbbr) || (type === 'from' && newTime === fromTime) || (type === 'to' && newTime === toTime)) {
      const updatedSchedules = {
        ...workschedules,
        [currentDay]: type === 'from' ? [newTime, toTime] : [fromTime, newTime]
      };
      dispatch(updateBusinessData({ workschedules: updatedSchedules }));
    }
  };

  const handleDayToggle = (direction) => {
    const currentIndex = fullDaysOfWeek.indexOf(currentDay);
    const newIndex = (currentIndex + (direction === 'next' ? 1 : -1) + fullDaysOfWeek.length) % fullDaysOfWeek.length;
    setCurrentDay(fullDaysOfWeek[newIndex]);
  };

  const servingWayValues = ["dine_in", "take_away", "delivery"];
  const servingWayLabels = [t("Dine In"), t("Takeaway"), t("Delivery")];

  const handleServingWayChange = (way) => {
    const updatedServingWays = servingWays.includes(way)
      ? servingWays.filter((w) => w !== way)
      : [...servingWays, way];
    dispatch(updateBusinessData({ servingWays: updatedServingWays }));
  };

  const paymentMethodValues = ["cash", "wallet", "card"];
  const paymentMethodLabels = [t("cash"), t("Digit wallet"), t("Card")];
  const paymentMethodImages = ["/assets/cash.svg", "/assets/revenue.svg", "/assets/cardColor.svg"];

  const handlePaymentMethodChange = (method) => {
    const updatedPaymentMethods = paymentMethods.includes(method)
      ? paymentMethods.filter((m) => m !== method)
      : [...paymentMethods, method];
    dispatch(updateBusinessData({ paymentMethods: updatedPaymentMethods }));
  };

  const paymentTimeValues = ["before", "after"];
  const paymentTimeLabels = [t("beforeServing"), t("afterServing")];

  const handlePaymentTimeChange = (time) => {
    dispatch(updateBusinessData({ paymentTime: time }));
  };

  const handleCallWaiterChange = (event) => {
    dispatch(updateBusinessData({ callWaiter: event.target.checked ? "active" : "inactive" }));
  };

  const handlePrint = () => {
    window.print();
  };

  useRegisterChangeThemeMode(mode)

  const selectedBranchLocation = {}

  if (latitude !== "") selectedBranchLocation.latitude = latitude
  if (longitude !== "") selectedBranchLocation.longitude = longitude
  return (
    <Grid container sx={{ marginTop: "0px", }}>
      <Grid item xs={12} >
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box>
            <Typography variant="body2" sx={{ fontSize: "15px" }} color={theme.palette.text.black_white} gutterBottom>
              {t("businessInfoText")}
            </Typography>
            <Divider sx={{ width: "100%", borderBottom: "4px solid #ef7d00", marginBottom: "18px" }} />
          </Box>
          <Box>
            <IconButton>
              <span className="icon-delete" style={{ fontSize: "23px" }}></span>
            </IconButton>
            <IconButton onClick={handlePrint}>
              <img src="/assets/print.svg" alt="icon" style={{ width: "22px", height: "22px" }} />
            </IconButton>
          </Box>
        </Box>
        <Box display="flex" gap={2}>
          {branches.map((branch, i) => (
            <Button
              key={i}
              variant="contained"
              onClick={() => handleBranchClick(i)}
              sx={{
                backgroundColor: branchIndex === i ? theme.palette.orangePrimary.main : "#bdbdbd",
                color: "white",
                borderRadius: "10px",
                padding: "3px 15px",
                display: "flex",
                alignItems: "center",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: branchIndex === i ? theme.palette.orangePrimary.main : "#bdbdbd",
                },
              }}
            >
              <StorefrontOutlinedIcon sx={{ marginRight: "5px", fontSize: "20px" }} />
              {t("branch")} {i + 1} {t("info")}
            </Button>
          ))}
        </Box>
        <Divider sx={{ margin: "12px 0px" }} />
      </Grid>

      <Grid xs={12} md={6} sx={{ paddingX: { xs: '0px', md: '8px' } }} overflow='hidden' >
        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            id="outlined-businessName"
            startAdornment={<InputAdornment position="start"><StorefrontOutlinedIcon sx={{ fontSize: "20px" }} /></InputAdornment>}
            required
            placeholder={t("businessName")}
            sx={{ borderRadius: "10px", marginBottom: "10px !important", height: "33px", fontSize: "12px" }}
            value={businessName}
            onChange={(e) => handleInputChange("businessName", e.target.value)}
          />
        </FormControl>
        {getFieldError(branchErrors, (branchIndex), "businessName")}
        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            id="outlined-businessPhone"
            startAdornment={<InputAdornment position="start"><PhoneOutlinedIcon sx={{ fontSize: "20px" }} /></InputAdornment>}
            required
            placeholder={t("businessPhone")}
            sx={{ borderRadius: "10px", height: "33px", marginBottom: "10px", fontSize: "12px" }}
            value={businessPhone}
            onChange={(e) => handleInputChange("businessPhone", e.target.value)}
          />
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            id="outlined-businessEmail"
            startAdornment={<InputAdornment position="start"><MailOutlinedIcon sx={{ fontSize: "20px" }} /></InputAdornment>}
            required
            placeholder={t("businessEmailNotOptional")}
            type="email"
            sx={{ borderRadius: "10px", marginBottom: "10px", height: "33px", fontSize: "12px" }}
            value={businessEmail}
            onChange={(e) => handleInputChange("businessEmail", e.target.value)}
          />
        </FormControl>
        {/*<InputAdornment position="start"><MailOutlinedIcon sx={{ fontSize: "20px" }} /></InputAdornment> */}
        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            id="outlined-adminPin"
            startAdornment={<InputAdornment position="start"><LockKeyhole size="20px" /></InputAdornment>}
            required
            placeholder={t("pin")}
            type="text"
            sx={{ borderRadius: "10px", marginBottom: "10px", height: "33px", fontSize: "12px" }}
            value={pin}
            onChange={(e) => handleInputChange("pin", e.target.value)}
          />
        </FormControl>
        {getFieldError(branchErrors, branchIndex, "pin")}
        <Box display="flex" justifyContent="space-between" width="100%" marginBottom="10px">
          <FormControl variant="outlined" sx={{ width: "48%" }}>
            <Select
              id="outlined-country"
              value={country}
              onChange={(e) => {
                handleInputChange("country", e.target.value)
                handleInputChange("city", undefined)
              }}
              displayEmpty
              sx={{ borderRadius: "10px", height: "33px", fontSize: "12px", color: "gray" }}
              startAdornment={<InputAdornment position="start"><PinDropOutlinedIcon sx={{ fontSize: "20px" }} /></InputAdornment>}
            >
              <MenuItem value="" disabled>{t("country")}</MenuItem>
              {governValue.map((govern) => (
                <MenuItem key={govern.id} value={govern.id} sx={{ fontSize: "12px", color: "gray" }}>{i18n.language === 'ar' ? govern.name_ar : govern.name_en}</MenuItem>
              ))}

              {/* <MenuItem value="US">United States</MenuItem>
              <MenuItem value="CA">Canada</MenuItem>
              <MenuItem value="UK">United Kingdom</MenuItem> */}
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "48%" }}>
            <Select
              id="outlined-city"
              value={city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              displayEmpty
              sx={{ borderRadius: "10px", height: "33px", fontSize: "12px", color: "gray" }}
              startAdornment={<InputAdornment position="start"><PinDropOutlinedIcon sx={{ fontSize: "20px" }} /></InputAdornment>}
            >
              <MenuItem value={undefined} disabled>{t("city")}</MenuItem>
              {citysValue.map((city) => (
                <MenuItem key={city.id} value={city.id} sx={{ fontSize: "12px", color: "gray" }}>{i18n.language === 'ar' ? city.name_ar : city.name_en}</MenuItem>
              ))}
              {/* <MenuItem value="NY">New York</MenuItem>
              <MenuItem value="LA">Los Angeles</MenuItem>
              <MenuItem value="CHI">Chicago</MenuItem> */}
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" alignItems="center" marginBottom="10px">
          {/* <Button
            variant="contained"
            fullWidth
            sx={{
              textTransform: "capitalize",
              backgroundColor: theme.palette.secondaryColor.main,
              color: "white",
              borderRadius: "10px",
              fontSize: "11px",
              height: "30px",
              "&:hover": { backgroundColor: theme.palette.secondaryColor.main },
            }}
          >
            <span className="icon-map-1" style={{ fontSize: "18px", marginRight: "6px" }}></span>
            {t("pinYourLocation")}
          </Button> */}
          <ErrorBoundary>
            <MapWithPin setPos={updateBranchPosition} isMapOpen={isMapOpen} setIsMapOpen={setIsMapOpen} currentPos={selectedBranchLocation} />
          </ErrorBoundary>
        </Box>

        <FormControl variant="outlined" sx={{ width: "100%", marginBottom: "10px" }}>
          <Select
            id="outlined-Currency"
            value={currency}
            onChange={(e) => handleInputChange("currency", e.target.value)}
            displayEmpty
            sx={{ borderRadius: "10px", height: "33px", fontSize: "12px", color: "gray" }}
            startAdornment={<InputAdornment position="start"><AttachMoneyIcon sx={{ fontSize: "20px" }} /></InputAdornment>}
          >
            <MenuItem value="" disabled>{t("currency")}</MenuItem>
            <MenuItem value="1">USD</MenuItem>
            <MenuItem value="2">GBP</MenuItem>
            <MenuItem value="3">EUR</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ width: "100%", marginBottom: "10px" }}>
          <Select
            id="outlined-BusinessType"
            value={businessType || "Pastry"}
            onChange={(e) => handleInputChange("businessType", e.target.value)}
            displayEmpty
            sx={{ borderRadius: "10px", height: "33px", fontSize: "12px", color: "gray" }}
            startAdornment={<InputAdornment position="start"><CardTravelOutlinedIcon sx={{ fontSize: "20px" }} /></InputAdornment>}
          >
            <MenuItem value="" disabled>{t("businessType")}</MenuItem>
            <MenuItem value="restaurant">{t("restaurant")}</MenuItem>
            <MenuItem value="cafe">{t("cafe")}</MenuItem>
            <MenuItem value="cloud">{t("cloudKitchens")}</MenuItem>
            <MenuItem value="fast">{t("fastFood")}</MenuItem>
            <MenuItem value="truck">{t("foodTruch")}</MenuItem>
            <MenuItem value="Bakery">{t("bakeryStore")}</MenuItem>
            <MenuItem value="Pastry">{t("pastryStore")}</MenuItem>
            <MenuItem value="Fruits">{t("fruitsStore")}</MenuItem>
            <MenuItem value="Retail">{t("retailStore")}</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ width: "100%", marginBottom: "10px" }}>
          <Select
            id="outlined-MenuDefaultLanguage"
            value={menuLanguage || "US"}
            onChange={(e) => handleInputChange("menuLanguage", e.target.value)}
            displayEmpty
            sx={{ borderRadius: "10px", height: "33px", fontSize: "12px", color: "gray" }}
            startAdornment={<InputAdornment position="start"><LanguageOutlinedIcon sx={{ fontSize: "20px" }} /></InputAdornment>}
          >
            <MenuItem value="" disabled>{t("menuDefLang")}</MenuItem>
            <MenuItem value="US">English (US)</MenuItem>
            <MenuItem value="CA">English (CA)</MenuItem>
            <MenuItem value="UK">English (UK)</MenuItem>
          </Select>
        </FormControl>
        {/* {console.log(servingWays)} */}
        {servingWays.includes("dine_in") &&
          <FormControl variant="outlined" sx={{ width: "100%", marginBottom: "10px" }}>
            <Select
              id="outlined-TableCount"
              value={tableCount || ''}
              onChange={(e) => handleInputChange("tableCount", e.target.value)}
              displayEmpty
              sx={{ borderRadius: "10px", height: "33px", fontSize: "12px", color: "gray" }}
              startAdornment={<InputAdornment position="start"><TableBarIcon sx={{ fontSize: "20px" }} /></InputAdornment>}
            >
              <MenuItem value="" disabled>{t("HowManyTablesDoYouHave")}</MenuItem>
              {[...Array(12)].map((_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}

            </Select>
          </FormControl>}


        <Divider sx={{ width: "100%", borderBottom: "1px solid #9d9d9c", marginBottom: "18px" }} />

        <Typography variant="body2" sx={{ fontSize: "14px", color: "gray", display: "flex" }}>
          <SellOutlinedIcon sx={{ color: "gray", fontSize: "20px", marginRight: "6px" }} /> {t("Bundle")}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="flex-start" mb={2}>
          <Button
            variant="outlined"
            sx={{ border: "1px solid gray", textTransform: "capitalize", color: "gray", padding: "1px 25px", borderRadius: "8px" }}
          >
            <CheckOutlinedIcon sx={{ fontSize: "20px", marginRight: "6px", color: theme.palette.orangePrimary.main }} /> {t("pro")}
          </Button>
          <Button
            onClick={() => navigate('/payment')}
            variant="contained"
            sx={{
              backgroundColor: theme.palette.secondaryColor.main,
              textTransform: "capitalize",
              color: "white",
              padding: "3px 30px",
              borderRadius: "8px",
              marginLeft: "10px",
              "&:hover": { backgroundColor: "#322240" },
            }}
          >
            {t("changeBundle")}
          </Button>
        </Box>
      </Grid>

      <Grid xs={12} md={6} sx={{ paddingX: { xs: '0px', md: '8px' } }}>
        <Grid sx={{ display: "flex", flexDirection: "column", marginTop: "10px", width: "100%" }}>
          <Box sx={{ marginTop: "6px", display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Grid container direction="column" > {/* heres_1 */}
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", fontWeight: "500", color: "#AAAAAA", textAlign: "start", margin: "0 0 5px 0px" }}
              >
                {t("defaultMode")}
              </Typography>
              <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={handleModeChange}
                sx={{ backgroundColor: 'transparent', display: "flex", justifyContent: "space-between" }}
              >
                <ToggleButton
                  value="white"
                  sx={{
                    padding: "8px",
                    backgroundColor: mode === "white" ? theme.palette.orangePrimary.main : "transparent",
                    border: `1px solid ${mode === "white" ? theme.palette.orangePrimary.main : "#AAAAAA"} !important`,
                    borderRadius: "8px !important",
                    marginRight: "8px",
                  }}
                >
                  <WbSunnyIcon
                    sx={{ fontSize: "30px", color: mode === "white" ? theme.palette.orangePrimary.main : "#AAAAAA" }}
                  />
                </ToggleButton>
                <ToggleButton
                  value="dark"
                  sx={{
                    padding: "8px",
                    backgroundColor: mode === "dark" ? theme.palette.orangePrimary.main : "transparent",
                    border: `1px solid ${mode === "dark" ? theme.palette.orangePrimary.main : "#AAAAAA"} !important`,
                    borderRadius: "8px !important",
                  }}
                >
                  <NightlightIcon
                    sx={{ fontSize: "30px", color: mode === "dark" ? theme.palette.orangePrimary.main : "#AAAAAA" }}
                  />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                height: "40px",
                width: "2px",
                backgroundColor: theme.palette.orangePrimary.main,
                margin: "30px 15px 0 15px",
              }}
            />

            <Grid container direction="column" >
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", fontWeight: "500", color: "#AAAAAA", textAlign: "start", margin: "0 0 5px 0px" }}
              >
                {t("menus.design")}
              </Typography>
              <ToggleButtonGroup
                value={design}
                exclusive
                onChange={handleDesignChange}
                sx={{ backgroundColor: 'transparent', display: "flex", justifyContent: "space-between" }}
              >
                <ToggleButton
                  value="grid"
                  sx={{
                    padding: "8px",
                    backgroundColor: design === "grid" ? theme.palette.orangePrimary.main : "transparent",
                    border: `1px solid ${design === "grid" ? theme.palette.orangePrimary.main : "#AAAAAA"} !important`,
                    borderRadius: "8px !important",
                    marginRight: "8px",
                  }}
                >
                  <ViewQuiltIcon
                    sx={{ fontSize: "30px", color: design === "grid" ? theme.palette.orangePrimary.main : "#AAAAAA" }}
                  />
                </ToggleButton>
                <ToggleButton
                  value="list"
                  sx={{
                    padding: "8px",
                    backgroundColor: design === "list" ? theme.palette.orangePrimary.main : "transparent",
                    border: `1px solid ${design === "list" ? theme.palette.orangePrimary.main : "#AAAAAA"} !important`,
                    borderRadius: "8px !important",
                  }}
                >
                  <FormatListBulletedIcon
                    sx={{ fontSize: "30px", color: design === "list" ? theme.palette.orangePrimary.main : "#AAAAAA" }}
                  />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Box>

          <Divider sx={{ backgroundColor: "#f4f6fc", height: "2px", margin: "8px 0px" }} flexItem />

          <Box>
            <Grid container alignItems="center" >
              <Grid item container marginBottom={'5px'} xs={12} display={"flex"} justifyContent={"space-between"} flexWrap={'wrap'}> {/* TODO:FEX STYLE */}
                <Grid item xs={6}>
                  <Typography variant="body1" display="flex" alignItems="center" sx={{ fontSize: "12px", color: "gray" }}>
                    <span style={{ marginRight: "4px", fontSize: "12px" }} className="icon-working-hour">
                      <span className="path1"></span><span className="path2"></span><span className="path3"></span>
                      <span className="path4"></span><span className="path5"></span><span className="path6"></span>
                      <span className="path7"></span><span className="path8"></span>
                    </span>
                    {t("workHours")}
                  </Typography>
                </Grid>

                <Grid item xs={6} style={{ justifyContent: 'end' }}>
                  <Box display="flex" alignItems="center" justifyContent={"center"} sx={{ marginInlineStart: 'auto', backgroundColor: theme.palette.secondaryColor.main, borderRadius: "20px", width: "105px", height: "30px" }}>
                    <IconButton onClick={() => handleDayToggle("prev")} sx={{ color: theme.palette.orangePrimary.main }}>
                      <ArrowBackIos sx={{ fontSize: "11px" }} />
                    </IconButton>
                    <Typography sx={{ textTransform: "capitalize", color: "white", fontSize: "10px" }}>
                      {t(currentDay.toLowerCase())}
                    </Typography>
                    <IconButton onClick={() => handleDayToggle("next")} sx={{ color: theme.palette.orangePrimary.main }}>
                      <ArrowForwardIos sx={{ fontSize: "11px" }} />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>

              <Grid item xs={7}>
                <Box display="flex" flexWrap="wrap">
                  {daysOfWeek.map((day) => (
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
                        border: selectedDays.includes(day) ? "1px solid #ef7d00" : "1px solid gray",
                        color: selectedDays.includes(day) ? theme.palette.orangePrimary.main : "gray",
                      }}
                    >
                      {day}
                    </Button>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={5} >
                <Grid container alignItems="end" justifyContent="end">
                  <Grid container item justifyContent="end">
                    <Grid item>
                      <Typography variant="body1" sx={{ fontSize: "11px", color: "gray", mr: 1 }}>{t("from")}</Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        select
                        value={fromTime}
                        onChange={(e) => handleTimeChange(e, "from")}
                        size="small"
                        sx={{ width: "90px", height: "30px" }}
                        inputProps={{ sx: { padding: "2px 10px", fontSize: "12px" } }}
                      >
                        {timeOptions.map((time) => (
                          <MenuItem key={time} value={time} sx={{ color: "gray", fontSize: "12px" }}>
                            <span style={{ fontSize: "10px", color: "gray" }}>{time}</span>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                  <Grid container item justifyContent="end">
                    <Grid item>
                      <Typography variant="body1" sx={{ fontSize: "11px", color: "gray", mr: 1 }}>{t("to")}</Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        select
                        value={toTime}
                        onChange={(e) => handleTimeChange(e, "to")}
                        size="small"
                        sx={{ width: "90px", height: "30px" }}
                        inputProps={{ sx: { padding: "2px 10px", fontSize: "12px" } }}
                      >
                        {timeOptions.map((time) => (
                          <MenuItem key={time} value={time} sx={{ color: "gray", fontSize: "12px" }}>
                            <span style={{ fontSize: "10px", color: "gray" }}>{time}</span>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ backgroundColor: "#f4f6fc", height: "2px", margin: "8px 0px" }} flexItem />

          <Box>
            <Typography variant="body1" sx={{ display: "flex", fontSize: "12px", color: "gray" }}>
              <span className="icon-waiter" style={{ fontSize: "20px", marginRight: "6px" }}></span>
              {t("servingWay")}
            </Typography>
            <Box display="flex">
              {servingWayValues.map((value, index) => (
                <FormControlLabel
                  key={value}
                  control={
                    <Checkbox
                      checked={servingWays.includes(value)}
                      onChange={() => handleServingWayChange(value)}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 20 }, color: "gray", "&.Mui-checked": { color: theme.palette.orangePrimary.main } }}
                    />
                  }
                  label={servingWayLabels[index]}
                  sx={{ "& .MuiTypography-root": { fontSize: "12px", color: "gray" } }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ backgroundColor: "#f4f6fc", height: "2px", margin: "8px 0px" }} flexItem />

          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={callWaiter === "active"}
                  onChange={handleCallWaiterChange}
                  sx={{ "& .MuiSvgIcon-root": { fontSize: 20 }, color: "gray", "&.Mui-checked": { color: theme.palette.orangePrimary.main } }}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <span className="icon-hand-up" style={{ fontSize: "20px", color: "gray", marginRight: "6px" }}></span>
                  <Typography sx={{ fontSize: "14px", color: "gray" }}>{t("activeCallWaiter")}</Typography>
                </Box>
              }
            />
          </Box>

          <Divider sx={{ backgroundColor: "#f4f6fc", height: "2px", margin: "8px 0px" }} flexItem />

          <Box>
            <Typography variant="body1" sx={{ marginTop: "10px", display: "flex", fontSize: "12px", color: "gray" }}>
              {t("paymentMethod")}
            </Typography>
            <Box display="flex" justifyContent="left">
              {paymentMethodValues.map((value, index) => (
                <FormControlLabel
                  key={value}
                  control={
                    <Checkbox
                      checked={paymentMethods.includes(value)}
                      onChange={() => handlePaymentMethodChange(value)}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 20 }, color: "gray", "&.Mui-checked": { color: theme.palette.orangePrimary.main } }}
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center">
                      <img
                        src={paymentMethodImages[index]}
                        alt="card icon"
                        style={{ width: "15px", height: "15px", marginRight: "4px", marginLeft: "-5px" }}
                      />
                      <Typography sx={{ fontSize: "10px", color: "gray" }}>
                        {paymentMethodLabels[index]}
                      </Typography>
                    </Box>
                  }
                  sx={{ "& .MuiTypography-root": { fontSize: "10px", color: "gray" } }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ backgroundColor: "#f4f6fc", height: "2px", margin: "8px 0px" }} flexItem />

          <Box>
            <Typography variant="body1" sx={{ display: "flex", fontSize: "12px", color: "gray" }}>
              {t("paymentTime")}
            </Typography>
            <Box display="flex" justifyContent="left">
              {paymentTimeValues.map((value, index) => (
                <FormControlLabel
                  key={value}
                  control={
                    <Radio
                      checked={paymentTime === value}
                      onChange={() => handlePaymentTimeChange(value)}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 20 }, color: "gray", "&.Mui-checked": { color: theme.palette.orangePrimary.main } }}
                    />
                  }
                  label={paymentTimeLabels[index]}
                  sx={{ "& .MuiTypography-root": { fontSize: "13px", color: "gray" } }}
                />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BusinessInfo;