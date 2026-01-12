
import {
  Avatar,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import { Box, useTheme } from "@mui/system";
import React, { useState, useEffect } from "react";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { useNavigate, useLocation } from "react-router";
import { PersonalInfoAdmin } from "./PersonalInfoAdmin";
import { BusinessInfoAdmin } from "./BusinessInfoAdmin";
import { BASE_URL, BASE_URL_IMG } from "../../../../utils/constants";
import { toast } from "react-toastify";
import { Logout, Settings } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Language from "../../../../Component/dashboard/TopBar/Language";
import { Loader } from "../../../../Component/componetUi/Loader";
import { fetchClients } from "../../../../store/adminSlice";
import { useQuery } from "@tanstack/react-query";

export const AddClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const { clientData, isEditMode } = location.state || {};

  const [anchorElLanguage, setAnchorElLanguage] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const openLanguage = Boolean(anchorElLanguage);

  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [personalInfo, setPersonalInfo] = useState({});
  const [businessInfo, setBusinessInfo] = useState([]);
  const [selectedBranchIndex, setSelectedBranchIndex] = useState(0);

  const fetchClients = async () => {
    const response = await fetch(`${BASE_URL}qtap_clients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["qtap_clients"],
    queryFn: fetchClients,
    staleTime: 1000 * 60 * 5, // كاش لمدة 5 دقائق
  });

  const handleLanguageClick = (event) => {
    setAnchorElLanguage(event.currentTarget);
  };

  const handleLanguageClose = (language) => {
    setAnchorElLanguage(null);
    setSelectedLanguage(language);
  };

  const getLanguageIcon = () => {
    return selectedLanguage === "ar" ? (
      <span className="icon-translation" style={{ color: "#ef7d00", fontSize: "22px" }}></span>
    ) : (
      <LanguageOutlinedIcon sx={{ color: "#ef7d00", fontSize: "22px" }} />
    );
  };

  const [anchorElUser, setAnchorElUser] = useState(null);
  const openUserPopover = Boolean(anchorElUser);

  const handleUserClick = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserClose = () => {
    setAnchorElUser(null);
  };

  const formatTimeTo24Hour = (time) => {
    if (!time) return "09:00";
    const [timePart, period] = time.toLowerCase().split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (period === "pm" && hours !== 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes ? minutes.toString().padStart(2, "0") : "00"}`;
  };

  const fetchClientInfo = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}get_client_info/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setClientInfo(result.qtap_clients);
        setPersonalInfo({
          name: result.qtap_clients.name,
          mobile: result.qtap_clients.mobile,
          email: result.qtap_clients.email,
          birth_date: result.qtap_clients.birth_date,
          country: result.qtap_clients.country,
          payment_method: result.qtap_clients.payment_method,
          img: result.qtap_clients.img,
          imgPreview: result.qtap_clients.img ? `${BASE_URL_IMG}${result.qtap_clients.img}` : null,
          imgFile: null,
        });
        setBusinessInfo(
          result.qtap_clients.brunchs.map((branch) => ({
            id: branch.id,
            business_name: branch.business_name,
            business_country: branch.business_country,
            business_city: branch.business_city,
            latitude: branch.latitude,
            longitude: branch.longitude,
            business_format: branch.business_format,
            menu_design: branch.menu_design,
            default_mode: branch.default_mode,
            payment_time: branch.payment_time,
            call_waiter: branch.call_waiter,
            workschedule: branch.workschedule,
            contact_info: branch.contact_info[0] || {},
            serving_ways: branch.serving_ways,
            payment_services: branch.payment_services,
            currentDay: "Sunday", // Initialize currentDay
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching client info:", error);
      toast.error("Failed to fetch client info.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode && clientData?.id) {
      fetchClientInfo(clientData.id);
    }
  }, [isEditMode, clientData]);

  const handleSave = async () => {
    if (!isEditMode) {
      // Handle new client creation if needed
      return;
    }

    const formData = new FormData();
    formData.append("name", personalInfo.name || "");
    formData.append("mobile", personalInfo.mobile || "");
    formData.append("email", personalInfo.email || "");
    formData.append("birth_date", personalInfo.birth_date || "");
    formData.append("country", personalInfo.country || "");
    formData.append("status", clientInfo.status || "");
    formData.append("user_type", clientInfo.user_type || "");
    formData.append("payment_method", personalInfo.payment_method || "");

    if (personalInfo.imgFile) {
      formData.append("img", personalInfo.imgFile);
    }

    const branches = businessInfo.map((branch) => ({
      id: branch.id,
      business_name: branch.business_name,
      business_country: branch.business_country,
      business_city: branch.business_city,
      latitude: parseFloat(branch.latitude) || 0,
      longitude: parseFloat(branch.longitude) || 0,
      business_format: branch.business_format,
      menu_design: branch.menu_design,
      default_mode: branch.default_mode,
      payment_time: branch.payment_time,
      call_waiter: branch.call_waiter,
      workschedule: branch.workschedule.map((schedule) => ({
        day: schedule.day,
        opening_time: formatTimeTo24Hour(schedule.opening_time),
        closing_time: formatTimeTo24Hour(schedule.closing_time),
      })),
      contact_info: [
        {
          business_email: branch.contact_info.business_email || "",
          business_phone: branch.contact_info.business_phone || "",
          website: branch.contact_info.website || "",
          facebook: branch.contact_info.facebook || "",
          twitter: branch.contact_info.twitter || "",
          instagram: branch.contact_info.instagram || "",
          address: branch.contact_info.address || "",
        },
      ],
      serving_ways: branch.serving_ways.map((way) => ({
        name: way.name,
        tables_number: way.tables_number !== null ? parseInt(way.tables_number) : null,
      })),
      payment_services: branch.payment_services.map((service) => ({
        name: service.name,
      })),
    }));

    // Primary approach: Send brunchs as a JSON string
    // Server must parse this with json_decode($request->brunchs, true) in PHP
    formData.append("brunchs", JSON.stringify(branches));

    // Alternative approach: Send brunchs as individual array elements
    // Uncomment this block if server cannot parse JSON string
    branches.forEach((branch, index) => {
      formData.append(`brunchs[${index}][id]`, branch.id);
      formData.append(`brunchs[${index}][business_name]`, branch.business_name);
      formData.append(`brunchs[${index}][business_country]`, branch.business_country);
      formData.append(`brunchs[${index}][business_city]`, branch.business_city);
      formData.append(`brunchs[${index}][latitude]`, branch.latitude);
      formData.append(`brunchs[${index}][longitude]`, branch.longitude);
      formData.append(`brunchs[${index}][business_format]`, branch.business_format);
      formData.append(`brunchs[${index}][menu_design]`, branch.menu_design);
      formData.append(`brunchs[${index}][default_mode]`, branch.default_mode);
      formData.append(`brunchs[${index}][payment_time]`, branch.payment_time);
      formData.append(`brunchs[${index}][call_waiter]`, branch.call_waiter);
      branch.workschedule.forEach((schedule, sIndex) => {
        formData.append(`brunchs[${index}][workschedule][${sIndex}][day]`, schedule.day);
        formData.append(`brunchs[${index}][workschedule][${sIndex}][opening_time]`, schedule.opening_time);
        formData.append(`brunchs[${index}][workschedule][${sIndex}][closing_time]`, schedule.closing_time);
      });
      branch.contact_info.forEach((contact, cIndex) => {
        formData.append(`brunchs[${index}][contact_info][${cIndex}][business_email]`, contact.business_email);
        formData.append(`brunchs[${index}][contact_info][${cIndex}][business_phone]`, contact.business_phone);
        formData.append(`brunchs[${index}][contact_info][${cIndex}][website]`, contact.website);
        formData.append(`brunchs[${index}][contact_info][${cIndex}][facebook]`, contact.facebook);
        formData.append(`brunchs[${index}][contact_info][${cIndex}][twitter]`, contact.twitter);
        formData.append(`brunchs[${index}][contact_info][${cIndex}][instagram]`, contact.instagram);
        formData.append(`brunchs[${index}][contact_info][${cIndex}][address]`, contact.address);
      });
      branch.serving_ways.forEach((way, wIndex) => {
        formData.append(`brunchs[${index}][serving_ways][${wIndex}][name]`, way.name);
        if (way.tables_number !== null) {
          formData.append(`brunchs[${index}][serving_ways][${wIndex}][tables_number]`, way.tables_number);
        }
      });
      branch.payment_services.forEach((service, pIndex) => {
        formData.append(`brunchs[${index}][payment_services][${pIndex}][name]`, service.name);
      });
    });

    try {
      const response = await fetch(`${BASE_URL}qtap_clients/${clientData.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: formData,
      });
      const result = await response.json();

      if (result.status === "success") {
        refetch()
        toast.success("Client updated successfully!");
        navigate("/client");
      } else {
        const errorMessages = result.errors
          ? Object.values(result.errors).flat().join("; ")
          : result.message || result.error || "Unknown error";
        toast.error(`Failed to update client: ${errorMessages}`);
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("An error occurred while updating client.");
    }
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.bodyColor.secandary, height: "100%", minHeight: '100vh' }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "0px 60px",
          justifyContent: "space-between",
          width: "90%",
          height: "70px",
        }}
      >
        <Box>
          <img src="/assets/qtap.svg" alt="logo" width={"130px"} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Language />
          <Box
            aria-describedby={openUserPopover ? "simple-popover" : undefined}
            onClick={handleUserClick}
            sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}
          >
            <IconButton
              color="inherit"
              sx={{
                backgroundColor: "#ef7d00",
                borderRadius: "30%",
                padding: "5px",
                "&:hover": {
                  backgroundColor: "#ef7d00",
                },
              }}
            >
              <PersonOutlineOutlinedIcon sx={{ fontSize: "20px", color: "white" }} />
            </IconButton>
            <Typography variant="body1" sx={{ fontSize: "13px", color: theme.palette.text.gray }}>
              {localStorage.getItem("userName")}
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: "18px", color: theme.palette.text.gray }} />
          </Box>
          <Popover
            id={openUserPopover ? "simple-popover" : undefined}
            open={openUserPopover}
            anchorEl={anchorElUser}
            onClose={handleUserClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Box sx={{ width: 200, padding: "10px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  marginBottom: "20px",
                  gap: "10px",
                }}
              >
                <Avatar sx={{ bgcolor: "#ef7d00", width: 40, height: 40 }}>
                  <PersonOutlineOutlinedIcon sx={{ fontSize: "22px" }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: "14px", color: theme.palette.text.gray }}>
                    {localStorage.getItem("userName")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "12px" }}
                    color={theme.palette.text.gray}
                  >
                    {localStorage.getItem("userEmail")}
                  </Typography>
                </Box>
              </Box>
              <Divider />

              <List>
                <Box
                  onClick={() => navigate("/dashboard-home")}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "#222240",
                    color: "white",
                    marginBottom: "10px",
                    borderRadius: "30px",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "center",
                    width: "80%",
                    padding: "5px 0px",
                    margin: "0 auto",
                  }}
                >
                  <span
                    className="icon-home-icon-silhouette"
                    style={{ color: "#ef7d00", marginRight: "5px", fontSize: "15px" }}
                  ></span>
                  <span
                    style={{
                      color: "white",
                      fontSize: "12px",
                      textTransform: "capitalize",
                    }}
                  >
                    Home
                  </span>
                </Box>

                <ListItem sx={{ cursor: "pointer" }} onClick={handleUserClose}>
                  <ListItemIcon>
                    <Settings
                      style={{ color: theme.palette.text.gray, fontSize: "20px" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Edit Profile"
                    primaryTypographyProps={{
                      sx: { color: theme.palette.text.gray, fontSize: "12px" },
                    }}
                  />
                </ListItem>

                <ListItem sx={{ cursor: "pointer" }} onClick={handleUserClose}>
                  <ListItemIcon>
                    <span className="icon-price-tag" style={{ fontSize: "20px", color: theme.palette.text.gray }}></span>
                  </ListItemIcon>
                  <ListItemText
                    primary="My Subscription"
                    primaryTypographyProps={{
                      sx: { color: theme.palette.text.gray, fontSize: "12px" },
                    }}
                  />
                </ListItem>

                <ListItem sx={{ cursor: "pointer" }} onClick={handleUserClose}>
                  <ListItemIcon>
                    <HelpOutlineOutlinedIcon sx={{ fontSize: "20px", color: theme.palette.text.gray }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="FAQ"
                    primaryTypographyProps={{
                      sx: { color: theme.palette.text.gray, fontSize: "12px" },
                    }}
                  />
                </ListItem>

                <ListItem sx={{ cursor: "pointer" }} onClick={handleUserClose}>
                  <ListItemIcon>
                    <Logout
                      style={{ color: theme.palette.text.gray, fontSize: "20px" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                      sx: { color: theme.palette.text.gray, fontSize: "12px" },
                    }}
                  />
                </ListItem>
              </List>
            </Box>
          </Popover>
        </Box>
      </Box>

      <Divider
        sx={{ backgroundColor: "#ef7d00", borderBottom: "none", width: "100%", height: "3px" }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <Loader />
        </Box>
      ) : (
        <Box>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5}>
              <PersonalInfoAdmin
                personalInfo={personalInfo}
                setPersonalInfo={setPersonalInfo}
                clientData={clientData}
              />
            </Grid>

            <Box item sx={{ display: { xs: "none", sm: "block" } }}>
              <Divider
                orientation="vertical"
                sx={{
                  backgroundColor: "#f4f6fc",
                  width: "1px",
                  marginTop: "30px",
                  height: "90%",
                }}
              />
            </Box>

            <Grid item xs={12} md={6}>
              <BusinessInfoAdmin
                businessInfo={businessInfo}
                setBusinessInfo={setBusinessInfo}
                selectedBranchIndex={selectedBranchIndex}
                setSelectedBranchIndex={setSelectedBranchIndex}
              />
            </Grid>
          </Grid>

          <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
            <Button
              onClick={handleSave}
              sx={{
                width: "160px",
                textTransform: "capitalize",
                backgroundColor: "#ef7d00",
                color: "white",
                borderRadius: "20px",
                padding: "5px",
                "&:hover": {
                  backgroundColor: "#ef7d10",
                },
              }}
            >
              {loading ? (
                <Loader size={22} />
              ) : (
                <>
                  <CheckOutlinedIcon sx={{ fontSize: "22px", mr: 1 }} />{t("save")}
                </>
              )}

            </Button>
          </Grid>
        </Box>
      )}
    </Box>
  );
};
