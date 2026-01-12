
import React from 'react';
import { Grid, Typography, Divider, FormControl, OutlinedInput, InputAdornment, MenuItem, Select, useTheme } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { Box } from '@mui/system';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTranslation } from 'react-i18next';
import { Governorates, Country } from './../../../utils/city';
import {BASE_URL, BASE_URL_IMG} from '../../../utils/constants'

export const PersonalInfo = ({
  fullName,
  setFullName,
  phone,
  setPhone,
  email,
  setEmail,
  month,
  setMonth,
  day,
  setDay,
  year,
  setYear,
  country,
  setCountry,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  selectedImage,
  setSelectedImage,
  selectedOption,
  setSelectedOption,
  errors
}) => {
  const theme = useTheme();
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };
  const { t } = useTranslation()
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={3} sx={{ marginRight: "40px" }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{
            width: { xs: "100%", lg: "150px" },
            height: { xs: "100%", lg: "150px" },
            borderRadius: '50%',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <img
              src={selectedImage ? (typeof selectedImage === "string" ? `${BASE_URL_IMG}${selectedImage}` : URL.createObjectURL(selectedImage)) : "/images/User.jpg"}
              alt="user"
              width="110%"
              height="110%"
              style={{ objectFit: "cover" }} />
            <Box
              component="label"
              htmlFor="image-upload"
              sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '18%',
                backgroundColor: '#4b4a4a',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <EditOutlinedIcon sx={{ color: "white", fontSize: '20px' }} />
            </Box>
          </Box>
          <Typography variant="body2" sx={{ fontSize: "15px", color: theme.palette.text.gray, marginTop: "8px" }}>
            {fullName || 'User01'}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="body2" sx={{ fontSize: "12px" }} color={theme.palette.text.gray} gutterBottom>
          {t("personalInfo")}
        </Typography>
        <Divider sx={{ width: "30%", borderBottom: "4px solid #ef7d00", marginBottom: "18px" }} />

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            startAdornment={<InputAdornment position="start"><PersonOutlinedIcon sx={{ fontSize: "20px", color: "gray" }} /></InputAdornment>}
            placeholder={t("fullName")}
            required
            sx={{ borderRadius: '6px', marginBottom: "18px", height: '33px', fontSize: "11px" }}
            error={!!errors.fullName}
          />
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            startAdornment={<InputAdornment position="start"><PhoneOutlinedIcon sx={{ fontSize: "20px", color: "gray" }} /></InputAdornment>}
            placeholder={t("mobileNumber")}
            required
            sx={{ borderRadius: '6px', marginBottom: "18px", height: '33px', fontSize: "11px" }}
            error={!!errors.phone}
          />
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            startAdornment={<InputAdornment position="start"><MailOutlinedIcon sx={{ fontSize: "20px", color: "gray" }} /></InputAdornment>}
            placeholder={t("email")}
            required
            sx={{ borderRadius: '6px', marginBottom: "18px", height: '33px', fontSize: "11px" }}
            error={!!errors.email}
          />
        </FormControl>

        <Grid container alignItems="center" sx={{ marginBottom: "18px" }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid container alignItems="center" sx={{ color: "gray", marginTop: "5px" }}>
              <CalendarMonthOutlinedIcon sx={{ marginRight: "6px", fontSize: "13px" }} />
              <Typography variant="body1" sx={{ fontSize: "12px" }}>{t("dateOfBirth")}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <Select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                displayEmpty
                sx={{ borderRadius: '6px', height: '33px', fontSize: "10px", color: "gray", marginRight: "5px" }}
                error={!!errors.birthDate}
              >
                <MenuItem value="" disabled>{t("month")}</MenuItem>
                {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(m => (
                  <MenuItem key={m} value={m} sx={{ fontSize: "10px", color: theme.palette.text.gray }}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <Select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                displayEmpty
                sx={{ borderRadius: '6px', height: '33px', fontSize: "10px", color: "gray", marginRight: "5px" }}
                error={!!errors.birthDate}
              >
                <MenuItem value="" disabled>{t("day")}</MenuItem>
                {[...Array(31).keys()].map(i => (
                  <MenuItem key={i + 1} value={String(i + 1).padStart(2, '0')} sx={{ fontSize: "10px", color: theme.palette.text.gray }}>
                    {String(i + 1).padStart(2, '0')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <Select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                displayEmpty
                sx={{ borderRadius: '6px', height: '33px', fontSize: "10px", color: "gray" }}
                error={!!errors.birthDate}
              >
                <MenuItem value="" disabled>{t("year")}</MenuItem>
                {Array.from({ length: 2025 - 1994 + 1 }, (_, i) => 1994 + i).map(y => (
                  <MenuItem key={y} value={y} sx={{ fontSize: "10px", color: theme.palette.text.gray }}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <FormControl variant="outlined" fullWidth>
          <Select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            displayEmpty
            sx={{ marginBottom: "18px", borderRadius: '6px', height: '33px', fontSize: "10px", color: "gray" }}
            startAdornment={<InputAdornment position="start"><span className="icon-location-pin" style={{ fontSize: "16px", color: "gray" }} /></InputAdornment>}
            error={!!errors.country}
          >
            <MenuItem value="" disabled>{t("country")}</MenuItem>
            {Governorates[Country.EGYPT].map((governorate) => (
              <MenuItem key={governorate} value={governorate} sx={{ fontSize: "10px", color: theme.palette.text.gray }}>
                {governorate}
              </MenuItem>
            ))}
            <MenuItem value="UK" sx={{ fontSize: "10px", color: theme.palette.text.gray }}>United Kingdom</MenuItem>
            <MenuItem value="syria" sx={{ fontSize: "10px", color: theme.palette.text.gray }}>Syria</MenuItem>
            <MenuItem value="US" sx={{ fontSize: "10px", color: theme.palette.text.gray }}>United States</MenuItem>
            <MenuItem value="CA" sx={{ fontSize: "10px", color: theme.palette.text.gray }}>Canada</MenuItem>

          </Select>
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startAdornment={<InputAdornment position="start"><span className="icon-padlock" style={{ fontSize: "16px", color: "gray" }} /></InputAdornment>}
            placeholder={t("password")}
            sx={{ borderRadius: '6px', marginBottom: "18px", height: '33px', fontSize: "10px" }}
            error={!!errors.password}
          />
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            startAdornment={<InputAdornment position="start"><span className="icon-padlock" style={{ fontSize: "16px", color: "gray" }} /></InputAdornment>}
            placeholder={t("confirmPass")}
            sx={{
              marginBottom: "18px", borderRadius: '10px', height: '33px', fontSize: "12px",
              "& input::placeholder": {
                color: theme.palette.text.gray,
              }
            }}
            error={!!errors.confirmPassword}
          />
        </FormControl>

        <FormControl fullWidth>
          <Select
            value={selectedOption || "Winter Campaign"}
            onChange={(e) => setSelectedOption(e.target.value)}
            displayEmpty
            IconComponent={ArrowDropDownIcon}
            sx={{
              backgroundColor: "#1A1A3B",
              borderRadius: "25px",
              color: theme.palette.orangePrimary.main,
              fontSize: "12px",
              height: "32px",
              textAlign: "center",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <MenuItem value="Winter Campaign" sx={{ fontSize: "12px", color: theme.palette.text.gray }}>{t("winterCampaign")}</MenuItem>
            <MenuItem value="Spring Campaign" sx={{ fontSize: "12px", color: theme.palette.text.gray }}>{t("springCampaign")}</MenuItem>
            <MenuItem value="Summer Campaign" sx={{ fontSize: "12px", color: theme.palette.text.gray }}>{t("summerCampaign")}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};