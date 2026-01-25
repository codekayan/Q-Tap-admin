import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { updatePersonalData } from "../../store/register/personalSlice";
import { useDispatch } from "react-redux";
import { useGetEgyptGovern } from "../../Hooks/Queries/public/citys/useGetEgyptGovern";
import { YEAR_SELECT_START_FROM } from "../../utils/utils";

import { passwordSchema } from "../../Pages/Client/Row2/AddClient/save-page/saveNewRegisterUserFormSchema";
import PhoneFieldSimple from "../phone-field/PhoneFieldSimple";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data } = useGetEgyptGovern();
  const governorates = data?.data?.data;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [email, setEmail] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // const [user_type, setUserType] = useState('');

  const [apiError, setApiError] = useState("");
  const [isLoading] = useState(false);
  const [apiSuccess, setApiSuccess] = useState("");

  const { t, i18n } = useTranslation();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const theme = useTheme();
  const isValidPassword = (password) => {
    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      console.log("❌ Errors:", result.error.errors);
      return false;
    } else {
      console.log("✅ Valid password:", result.data);
      return true;
    }
  };
  // call api to register
  const handleSignUp = async () => {
    setApiError("");
    setApiSuccess("");
    // inputs validate
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      setApiError(t("fieldAreRequired"));
      return;
    }
    if (!isValidPassword(password)) {
      setApiError(t("passTooShortOrDontHaveNumber"));
      return;
    }
    if (password !== confirmPassword) {
      setApiError(t("PasswordsDoNotMatch"));
      return;
    }
    if (!day || !month || !year) {
      setApiError(t("BirthDateFieldMustBeValid"));
      return;
    }


    // if (!user_type) {
    //     setApiError(t("userTypeRequired"));
    //     return;
    // }

    // resive data from user
 

    console.log("countryCode", countryCode);
    const personalContextData = {
      fullName,
      phone,
      countryCode,
      email,
      month,
      day,
      year,
      password,
      confirmPassword,
      user_type: "qtap_clients",
    };
    dispatch(updatePersonalData(personalContextData));
    navigate("/product");
    return;
  };

  return (
    <Box width="100%" maxWidth="400px" mx="auto" px={2}>
      <FormControl variant="outlined" fullWidth>
        <OutlinedInput
          id="outlined-fullname"
          startAdornment={
            <InputAdornment position="start">
              <PersonOutlinedIcon
                sx={{
                  // ,
                  fontSize: "16px",
                }}
              />
            </InputAdornment>
          }
          autoComplete="off"
          className="hereProblem1"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t("fullName")}
          sx={{
            // ,
            borderRadius: "50px",
            marginTop: "10px",
            height: "33px",
            fontSize: "10px",
          }}
        />
      </FormControl>

      <PhoneFieldSimple
        countryCode={countryCode}
        phone={phone}
        setCountryCode={setCountryCode}
        setPhone={setPhone}
      />

      <FormControl required variant="outlined" fullWidth>
        <OutlinedInput
          id="outlined-email"
          type="email"
          startAdornment={
            <InputAdornment position="start">
              <EmailOutlinedIcon
                sx={{
                  // ,
                  fontSize: "16px",
                }}
              />
            </InputAdornment>
          }
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("email")}
          sx={{
            // ,
            borderRadius: "50px",
            marginTop: "10px",
            height: "33px",
            fontSize: "10px",
          }}
        />
      </FormControl>

      <Grid container alignItems="center" sx={{ marginTop: "10px" }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Grid
            container
            alignItems="center"
            sx={{
              // ,
              marginTop: "5px",
              marginBottom: "2px",
            }}
          >
            <CalendarMonthOutlinedIcon
              sx={{ marginRight: 1, fontSize: "15px" }}
            />
            <Typography variant="body1" sx={{ fontSize: "11px" }}>
              {t("dateOfBirth")}
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth>
            <Select
              id="outlined-country"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: "50px",
                height: "33px",
                fontSize: "10px",
                // ,
                marginRight: "5px",
                "& .MuiSelect-icon": {
                  right: 7,
                  left: "auto",
                },
                '[dir="rtl"] & .MuiSelect-icon': {
                  left: 7,
                  right: "auto",
                },
              }}
            >
              <MenuItem
                value=""
                disabled
                sx={{
                  fontSize: "10px",
                  //
                }}
              >
                {t("month")}
              </MenuItem>
              <MenuItem value="01" sx={{ fontSize: "10px" }}>
                01
              </MenuItem>
              <MenuItem value="02" sx={{ fontSize: "10px" }}>
                02
              </MenuItem>
              <MenuItem value="03" sx={{ fontSize: "10px" }}>
                03
              </MenuItem>
              <MenuItem value="04" sx={{ fontSize: "10px" }}>
                04
              </MenuItem>
              <MenuItem value="05" sx={{ fontSize: "10px" }}>
                05
              </MenuItem>
              <MenuItem value="06" sx={{ fontSize: "10px" }}>
                06
              </MenuItem>
              <MenuItem value="07" sx={{ fontSize: "10px" }}>
                07
              </MenuItem>
              <MenuItem value="08" sx={{ fontSize: "10px" }}>
                08
              </MenuItem>
              <MenuItem value="09" sx={{ fontSize: "10px" }}>
                09
              </MenuItem>
              <MenuItem value="10" sx={{ fontSize: "10px" }}>
                10
              </MenuItem>
              <MenuItem value="11" sx={{ fontSize: "10px" }}>
                11
              </MenuItem>
              <MenuItem value="12" sx={{ fontSize: "10px" }}>
                12
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth>
            <Select
              id="outlined-country"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: "50px",
                height: "33px",
                fontSize: "10px",
                marginRight: "5px",
                "& .MuiSelect-icon": {
                  right: 7,
                  left: "auto",
                },
                '[dir="rtl"] & .MuiSelect-icon': {
                  left: 7,
                  right: "auto",
                },
              }}
            >
              <MenuItem value="" disabled sx={{ fontSize: "10px" }}>
                {t("day")}
              </MenuItem>

              {[...Array(31).keys()].map((i) => {
                const dayStr = String(i + 1).padStart(2, "0");
                return (
                  <MenuItem
                    key={dayStr}
                    value={dayStr}
                    sx={{ fontSize: "10px" }}
                  >
                    {dayStr}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth>
            <Select
              id="outlined-country"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: "50px",
                height: "33px",
                fontSize: "10px",
                "& .MuiSelect-icon": {
                  right: 7,
                  left: "auto",
                },
                '[dir="rtl"] & .MuiSelect-icon': {
                  left: 7,
                  right: "auto",
                },
              }}
            >
              <MenuItem value="" disabled sx={{ fontSize: "10px" }}>
                {t("year")}
              </MenuItem>
              {Array.from(
                {
                  length: new Date().getFullYear() - YEAR_SELECT_START_FROM + 1,
                },
                (_, i) => (
                  <MenuItem
                    key={i + YEAR_SELECT_START_FROM}
                    value={i + YEAR_SELECT_START_FROM}
                  >
                    {i + YEAR_SELECT_START_FROM}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>


      <FormControl variant="outlined" fullWidth>
        <OutlinedInput
          id="outlined-password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <span class="icon-padlock" style={{ fontSize: "18px" }}></span>
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
                  <VisibilityOffOutlinedIcon sx={{ fontSize: "18px" }} />
                ) : (
                  <span class="icon-show" style={{ fontSize: "16px" }}></span>
                )}
              </IconButton>
            </InputAdornment>
          }
          placeholder={t("password")}
          sx={{
            borderRadius: "50px",
            marginTop: "10px",
            height: "33px",
            fontSize: "10px",
          }}
        />
      </FormControl>

      <FormControl variant="outlined" fullWidth>
        <OutlinedInput
          id="outlined-confirm-password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <span class="icon-padlock" style={{ fontSize: "18px" }}></span>
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={handleClickShowConfirmPassword}
                edge="end"
              >
                {showPassword ? (
                  <VisibilityOffOutlinedIcon sx={{ fontSize: "18px" }} />
                ) : (
                  <span class="icon-show" style={{ fontSize: "16px" }}></span>
                )}
              </IconButton>
            </InputAdornment>
          }
          placeholder={t("confirmPass")}
          sx={{
            borderRadius: "50px",
            marginTop: "10px",
            height: "33px",
            fontSize: "10px",
          }}
        />
      </FormControl>

      <FormControlLabel
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "90%",
          marginTop: "20px",
          padding: "15px 25px 0 25px",
        }}
        control={
          <Checkbox
            sx={{
              color: "#c2bbbb",
              transform: "scale(0.7)",
            }}
          />
        }
        label={
          <Typography sx={{ fontSize: "10px" }}>
            {" "}
            {t("registerAgree")}
          </Typography>
        }
      />
      {apiError && (
        <Typography
          className="text-red-500"
          sx={{ fontSize: "13px", textAlign: "center" }}
        >
          {apiError}
        </Typography>
      )}
      {apiSuccess && (
        <Typography
          sx={{
            color: theme.palette.text.green,
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          {apiSuccess}
        </Typography>
      )}
      <Button
        disabled={isLoading}
        variant="contained"
        fullWidth
        sx={{
          marginTop: 2,
          borderRadius: "50px",
          backgroundColor: theme.palette.orangePrimary.main,
          color: theme.palette.text.fixedWhite,
          height: "35px",
          textTransform: "capitalize",
          "&:hover": {
            backgroundColor: theme.palette.orangePrimary.main,
          },
        }}
        onClick={() => {
          handleSignUp();
        }}
      >
        {t("signUp")}
      </Button>
    </Box>
  );
};

export default SignUp;
