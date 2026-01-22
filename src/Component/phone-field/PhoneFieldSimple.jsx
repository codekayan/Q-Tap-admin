import React from "react";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { useTranslation } from "react-i18next";

/**
 * Simple phone input with NO OTP/verification.
 * Keeps the same value shape used elsewhere: phone digits + optional countryCode.
 */
const PhoneFieldSimple = ({ phone, setPhone, countryCode, setCountryCode }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormControl variant="outlined" fullWidth>
        <OutlinedInput
          id="outlined-country-code"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          placeholder={t("countryCode") || "+20"}
          autoComplete="off"
          sx={{
            borderRadius: "50px",
            marginTop: "10px",
            height: "33px",
            fontSize: "10px",
          }}
          startAdornment={
            <InputAdornment position="start">
              <PhoneOutlinedIcon sx={{ fontSize: "16px" }} />
            </InputAdornment>
          }
        />
      </FormControl>

      <FormControl variant="outlined" fullWidth>
        <OutlinedInput
          id="outlined-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("phone") || "Phone"}
          autoComplete="off"
          sx={{
            borderRadius: "50px",
            marginTop: "10px",
            height: "33px",
            fontSize: "10px",
          }}
          startAdornment={
            <InputAdornment position="start">
              <PhoneOutlinedIcon sx={{ fontSize: "16px" }} />
            </InputAdornment>
          }
        />
      </FormControl>
    </>
  );
};

export default PhoneFieldSimple;


