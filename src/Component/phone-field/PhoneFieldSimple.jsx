import React from "react";
import { FormControl, InputAdornment, OutlinedInput, Select, MenuItem } from "@mui/material";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { useTranslation } from "react-i18next";
import { COUNTRIES_CODES } from "../../utils/constant-variables/countries-codes";

/**
 * Simple phone input with NO OTP/verification.
 * Displays phone with country code selector on the left side (professional style)
 * Uses all available country codes from COUNTRIES_CODES constant
 */
const PhoneFieldSimple = ({ phone, setPhone, countryCode, setCountryCode }) => {
  const { t } = useTranslation();

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    // Allow only numbers
    value = value.replace(/[^0-9]/g, "");
    setPhone(value);
  };

  return (
    <FormControl variant="outlined" fullWidth sx={{ marginTop: "10px" }}>
      <OutlinedInput
        id="outlined-phone-with-code"
        value={phone}
        onChange={handlePhoneChange}
        placeholder={t("phone") || "123 456 789"}
        autoComplete="off"
        sx={{
          borderRadius: "10px",
          height: "33px",
          fontSize: "10px",
        }}
        startAdornment={
          <InputAdornment position="start" sx={{ paddingLeft: "8px" }}>
            <Select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              displayEmpty
              variant="standard"
              disableUnderline
              sx={{
                fontSize: "10px",
                fontWeight: "600",
                color: "inherit",
                minWidth: "55px",
                textAlign: "center",
                "& .MuiSelect-icon": {
                  display: "none",
                },
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <MenuItem value="" disabled sx={{ fontSize: "10px" }}>
                {t("countryCode")}
              </MenuItem>
              {COUNTRIES_CODES.map((item) => (
                <MenuItem
                  key={item.code}
                  value={item.label}
                  sx={{ fontSize: "10px" }}
                >
                  {item.code}
                </MenuItem>
              ))}
            </Select>
            <span style={{ color: "#999", marginLeft: "8px", fontSize: "10px" }}>
              |
            </span>
            <PhoneOutlinedIcon sx={{ fontSize: "16px", marginLeft: "8px" }} />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default PhoneFieldSimple;


