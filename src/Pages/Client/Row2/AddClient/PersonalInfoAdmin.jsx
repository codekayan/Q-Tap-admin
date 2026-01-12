import {
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import React, { useState, useRef } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, useTheme } from "@mui/system";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useNavigate } from "react-router";
import { BASE_URL_IMG } from "../../../../utils/constants";
import { useTranslation } from "react-i18next";

export const PersonalInfoAdmin = ({
  personalInfo,
  setPersonalInfo,
  clientData,
}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleChange = (field, value) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      file.size <= 2 * 1024 * 1024 &&
      ["image/jpeg", "image/png"].includes(file.type)
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalInfo((prev) => ({
          ...prev,
          imgPreview: reader.result, // For UI preview
          imgFile: file, // For upload
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a JPEG/PNG image smaller than 2MB.");
    }
  };

  const handleEditImage = () => {
    fileInputRef.current.click();
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      sx={{ marginTop: "10px" }}
    >
      <Box>
        <ArrowBackIosOutlinedIcon
          onClick={() => navigate("/client")}
          sx={{ color: theme.palette.text.gray, cursor: "pointer" }}
        />
      </Box>

      <Grid item xs={12} md={3} sx={{ marginRight: "40px" }}>
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{
              width: { xs: "100%", lg: "150px" },
              height: { xs: "100%", lg: "150px" },
              borderRadius: "50%",
              overflow: "hidden",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={
                personalInfo.imgPreview ||
                (personalInfo.img
                  ? `${BASE_URL_IMG}${personalInfo.img}`
                  : "/images/User.jpg")
              }
              alt="user"
              width="120%"
              height="120%"
              style={{ objectFit: "cover" }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: "18%",
                backgroundColor: "gray",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                cursor: "pointer",
              }}
              onClick={handleEditImage}
            >
              <EditOutlinedIcon sx={{ color: "white", fontSize: "20px" }} />
            </Box>
          </Box>
          <input
            type="file"
            accept="image/jpeg,image/png"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <Typography
            variant="body2"
            sx={{
              fontSize: "15px",
              color: theme.palette.text.gray,
              marginTop: "8px",
            }}
          >
            {personalInfo.name || "User01"}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography
          variant="body2"
          sx={{ fontSize: "15px" }}
          color={theme.palette.text.gray}
          gutterBottom
        >
          {t("personalInfo")}
        </Typography>
        <Divider
          sx={{
            width: "35%",
            borderBottom: "4px solid #ef7d00",
            marginBottom: "18px",
          }}
        />

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <PersonOutlinedIcon sx={{ fontSize: "20px" }} />
              </InputAdornment>
            }
            value={personalInfo.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Full Name"
            sx={{
              borderRadius: "10px",
              marginBottom: "18px",
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
            value={personalInfo.mobile || ""}
            onChange={(e) => handleChange("mobile", e.target.value)}
            placeholder="Mobile Number"
            sx={{
              borderRadius: "10px",
              marginBottom: "18px",
              height: "33px",
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
            value={personalInfo.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
            sx={{
              borderRadius: "10px",
              marginBottom: "18px",
              height: "33px",
              fontSize: "12px",
            }}
          />
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <LanguageOutlinedIcon sx={{ fontSize: "18px" }} />
              </InputAdornment>
            }
            value={personalInfo.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="Website"
            sx={{
              borderRadius: "10px",
              height: "35px",
              fontSize: "12px",
              marginBottom: "18px",
            }}
          />
        </FormControl>

        <Grid container alignItems="center" sx={{ marginBottom: "18px" }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid
              container
              alignItems="center"
              sx={{ color: theme.palette.text.gray_light, marginTop: "5px" }}
            >
              <CalendarMonthOutlinedIcon
                sx={{ marginRight: 1, fontSize: "18px" }}
              />
              <Typography
                variant="body1"
                sx={{ fontSize: "13px", color: theme.palette.text.gray }}
              >
                {t("dateOfBirth")}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <Select
                value={
                  personalInfo.birth_date
                    ? personalInfo.birth_date.split("-")[1]
                    : ""
                }
                onChange={(e) => {
                  const newMonth = e.target.value;
                  const newBirthDate = personalInfo.birth_date
                    ? `${personalInfo.birth_date.split("-")[0]}-${newMonth}-${
                        personalInfo.birth_date.split("-")[2]
                      }`
                    : `2000-${newMonth}-01`;
                  handleChange("birth_date", newBirthDate);
                }}
                displayEmpty
                sx={{
                  borderRadius: "10px",
                  height: "33px",
                  fontSize: "12px",
                  color: theme.palette.text.gray_light,
                  marginRight: "5px",
                }}
              >
                <MenuItem value="" disabled>
                  Month
                </MenuItem>
                {[...Array(12).keys()].map((i) => (
                  <MenuItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                    {String(i + 1).padStart(2, "0")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <Select
                value={
                  personalInfo.birth_date
                    ? personalInfo.birth_date.split("-")[2]
                    : ""
                }
                onChange={(e) => {
                  const newDay = e.target.value;
                  const newBirthDate = personalInfo.birth_date
                    ? `${personalInfo.birth_date.split("-")[0]}-${
                        personalInfo.birth_date.split("-")[1]
                      }-${newDay}`
                    : `2000-01-${newDay}`;
                  handleChange("birth_date", newBirthDate);
                }}
                displayEmpty
                sx={{
                  borderRadius: "10px",
                  height: "33px",
                  fontSize: "12px",
                  color: theme.palette.text.gray_light,
                  marginRight: "5px",
                }}
              >
                <MenuItem value="" disabled>
                  Day
                </MenuItem>
                {[...Array(31).keys()].map((i) => (
                  <MenuItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                    {String(i + 1).padStart(2, "0")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <Select
                value={
                  personalInfo.birth_date
                    ? personalInfo.birth_date.split("-")[0]
                    : ""
                }
                onChange={(e) => {
                  const newYear = e.target.value;
                  const newBirthDate = personalInfo.birth_date
                    ? `${newYear}-${personalInfo.birth_date.split("-")[1]}-${
                        personalInfo.birth_date.split("-")[2]
                      }`
                    : `${newYear}-01-01`;
                  handleChange("birth_date", newBirthDate);
                }}
                displayEmpty
                sx={{
                  borderRadius: "10px",
                  height: "33px",
                  fontSize: "12px",
                  color: theme.palette.text.gray_light,
                }}
              >
                <MenuItem value="" disabled>
                  Year
                </MenuItem>
                {Array.from({ length: 2025 - 1900 + 1 }, (_, i) => (
                  <MenuItem key={i + 1900} value={i + 1900}>
                    {i + 1900}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <FormControl variant="outlined" fullWidth>
          <Select
            value={personalInfo.country || ""}
            onChange={(e) => handleChange("country", e.target.value)}
            displayEmpty
            sx={{
              marginBottom: "18px",
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
            <MenuItem value="Giza">Giza</MenuItem>
            <MenuItem value="Egypt">Egypt</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            id="outlined-password"
            type={showPassword ? "text" : "password"}
            value={personalInfo.password || ""}
            onChange={(e) => handleChange("password", e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ fontSize: "20px" }} />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOff sx={{ fontSize: "20px" }} />
                  ) : (
                    <Visibility sx={{ fontSize: "20px" }} />
                  )}
                </IconButton>
              </InputAdornment>
            }
            placeholder="Password"
            sx={{
              borderRadius: "10px",
              marginBottom: "18px",
              height: "33px",
              fontSize: "12px",
            }}
          />
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            id="outlined-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={personalInfo.confirmPassword || ""}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ fontSize: "20px" }} />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={handleClickShowConfirmPassword}
                  edge="end"
                >
                  {showConfirmPassword ? (
                    <VisibilityOff sx={{ fontSize: "20px" }} />
                  ) : (
                    <Visibility sx={{ fontSize: "20px" }} />
                  )}
                </IconButton>
              </InputAdornment>
            }
            placeholder="Confirm Password"
            sx={{ borderRadius: "10px", height: "33px", fontSize: "12px" }}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};
