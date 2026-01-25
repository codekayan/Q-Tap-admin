import { useForm, Controller } from "react-hook-form";
import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  MenuItem,
  Select,
  Divider,
  Typography,
  Box,
  Button,
  useTheme,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormGroup,
  IconButton,
} from "@mui/material";

import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import LockKeyhole from "@mui/icons-material/Lock"; // replace with correct import
import { useTranslation } from "react-i18next";
import useGetGovernAndCityFromQuery from "../../../../../Hooks/Queries/public/citys/useGetGovernAndCityFromQuery";
import MapWithPin from "../../../../../utils/MapWithPin";
import { useEffect, useState } from "react";

import { InputLabel, FormHelperText } from "@mui/material";

import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightIcon from "@mui/icons-material/Nightlight";

import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
//
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import TableBarOutlinedIcon from "@mui/icons-material/TableBarOutlined";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CardTravelOutlinedIcon from "@mui/icons-material/CardTravelOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { PhoneFieldReactFormHook } from "../../../../register-busniess-info-page/PhoneFieldReactFormHook";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { useNavigate } from "react-router";
import WorkDays from "../../../../register-busniess-info-page/WordDays";
import BusinessOptions from "../../../../register-busniess-info-page/BusinessOptionsComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBranch,
  updateBusinessData,
} from "../../../../../store/register/businessSlice";
import useBranchStore from "../../../../../store/zustand-store/register-client-branch-store";
import { usePlanPricing } from "../../../../../Hooks/Queries/clientDashBoard/plan/usePlanPricing";
import { timeOptions } from "../../../../../Component/Business-info/WorkingHoursDays";
import { useGetCurrencies } from "../../../../../Hooks/Queries/public/currencies/useGetCurrencies";
import { array, string } from "zod";

//{ control, watch, setValue, errors }
export default function BranchForm({
  control,
  watch,
  setValue,
  getValues,
  errors,
  reset,
  pricing_id,
}) {
  const theme = useTheme();
  const branches = useBranchStore((state) => state.branches);
  const updateBranch = useBranchStore((state) => state.updateBranch);
  console.log("branches", branches);
  const [branchIndex, setBranchIndex] = useState(0);

  console.log(branches, "  -  ", branchIndex);

  const { t, i18n } = useTranslation();

  const handleBranchClick = (nextIndex) => {
    // 1️⃣ Get current form values
    const formValues = getValues();

    // 2️⃣ Save current branch to the store
    updateBranch(branchIndex, formValues.branches[branchIndex]);

    // 3️⃣ Update the selected branch index first
    setBranchIndex(nextIndex);
  };

  useEffect(() => {
    const formValues = getValues();

    // 4️⃣ Get fresh branches array from store
    const freshBranches = useBranchStore.getState().branches;
    console.log("freshBranches", freshBranches);
    console.log("formValues", formValues);
    
    freshBranches.forEach((branch, i) => {
      console.log(`Branch ${i} pin from store:`, branch.pin);
    });
    
    // 5️⃣ Reset the form with updated branches
    // The Controllers now use the updated selectedBranch
    reset(
      {
        ...formValues,
        branches: freshBranches.map((branch, i) => ({
          ...branch,
          pin: branch.pin ?? "", // force empty string if pin missing
        })),
      },
      { keepErrors: true, keepDirty: true }
    );
  }, [branchIndex]);

  return (
    <>
      <Typography
        variant="body2"
        sx={{ fontSize: "15px" }}
        color={theme.palette.text.black_white}
        gutterBottom
      >
        {t("businessInfoText")}
      </Typography>
      <Divider
        sx={{
          width: "35%",
          borderBottom: "4px solid #ef7d00",
          marginBottom: "18px",
        }}
      />
      <Box display="flex" gap={2}>
        {/* TODO : save data of branch when switch */}
        {branches.map((branch, i) => (
          <Button
            key={i}
            variant="contained"
            onClick={() => handleBranchClick(i)}
            sx={{
              backgroundColor:
                branchIndex === i
                  ? theme.palette.orangePrimary.main
                  : "#bdbdbd",
              color: "white",
              borderRadius: "10px",
              padding: "3px 15px",
              display: "flex",
              alignItems: "center",
              textTransform: "none",
              "&:hover": {
                backgroundColor:
                  branchIndex === i
                    ? theme.palette.orangePrimary.main
                    : "#bdbdbd",
              },
            }}
          >
            <StorefrontOutlinedIcon
              sx={{ marginRight: "5px", fontSize: "20px" }}
            />
            {t("branch")} {i + 1} {t("info")}
          </Button>
        ))}
      </Box>
      {errors?.branches &&
        Array.isArray(errors.branches) &&
        errors.branches.map((branchError, index) => {
          if (!branchError) return null; // skip branches without errors

          return (
            <p key={index} style={{ color: "red" }}>
              Branch {index + 1} has errors:{" "}
              {Object.entries(branchError).map(([field, errorObj]) => (
                <span key={field}>
                  {errorObj?.message && `${field}: ${errorObj.message} `}
                </span>
              ))}
            </p>
          );
        })}
      <Divider sx={{ margin: "12px 0px" }} />
      <div className="flex flex-wrap w-full">
        <div className="w-full md:w-1/2 md:pe-1">
          <BranchFormColumnOneSectionOne
            control={control}
            errors={errors}
            i18n={i18n}
            setValue={setValue}
            t={t}
            watch={watch}
            selectedBranch={branchIndex}
          />
          <BranchFormColumnOneSectionTwo
            control={control}
            errors={errors}
            i18n={i18n}
            setValue={setValue}
            t={t}
            watch={watch}
            selectedBranch={branchIndex}
            pricing_id={pricing_id}
          />
        </div>
        <div className="w-full md:w-1/2 md:ps-1">
          <BranchFormColumnTwo
            control={control}
            errors={errors}
            i18n={i18n}
            setValue={setValue}
            t={t}
            watch={watch}
            getValues={getValues}
            selectedBranch={branchIndex}
          />
        </div>
      </div>
    </>
  );
}
const methods = [
  {
    text: "cash",
    icon: (
      <span
        className="icon-wallet"
        style={{ marginRight: "2px", fontSize: "20px" }}
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
      </span>
    ),
  },
  {
    text: "wallet",
    icon: (
      <span
        className="icon-wallet"
        style={{ marginRight: "2px", fontSize: "20px" }}
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
      </span>
    ),
  },
  {
    text: "card",
    icon: (
      <img
        src="/assets/cardColor.svg"
        alt="card icon"
        style={{
          width: "15px",
          height: "15px",
          marginRight: "4px",
          marginLeft: "-5px",
        }}
      />
    ),
  },
];
export const BranchFormColumnTwo = ({
  t,
  i18n,
  control,
  watch,
  setValue,
  getValues,
  errors,
  selectedBranch,
}) => {
  const theme = useTheme();
  const selectedServingWays = watch("servingWays");
  const servingWayValues = ["dine_in", "take_away", "delivery"];
  const servingWayLabels = ["Dine In", "Take Away", "Delivery"];

  return (
    <>
      {/* mode & menu design */}
      <div className="flex  w-full  ">
        <div className="w-full">
          <Typography
            variant="body2"
            sx={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#AAAAAA",
              textAlign: "start",
              margin: "0 0 5px 0px",
            }}
          >
            {t("defaultMode")}
          </Typography>
          <Controller
            name={`branches.${selectedBranch}.mode`}
            control={control}
            render={({ field }) => {
              const error = errors.branches?.[selectedBranch]?.mode?.message;
              return (
                <>
                  <ToggleButtonGroup
                    value={field.value}
                    exclusive
                    onChange={(e, newValue) => {
                      if (newValue !== null) {
                        field.onChange(newValue);
                      }
                    }}
                    sx={{
                      backgroundColor: "transparent",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <ToggleButton
                      value="white"
                      sx={{
                        padding: "8px",
                        backgroundColor:
                          field.value === "white"
                            ? theme.palette.orangePrimary.main
                            : "transparent",
                        border: `1px solid ${
                          field.value === "white"
                            ? theme.palette.orangePrimary.main
                            : "#AAAAAA"
                        } !important`,
                        borderRadius: "8px !important",
                        marginRight: "8px",
                      }}
                    >
                      <WbSunnyIcon
                        sx={{
                          fontSize: "30px",
                          color:
                            field.value === "white"
                              ? theme.palette.orangePrimary.main
                              : "#AAAAAA",
                        }}
                      />
                    </ToggleButton>
                    <ToggleButton
                      value="dark"
                      sx={{
                        padding: "8px",
                        backgroundColor:
                          field.value === "dark"
                            ? theme.palette.orangePrimary.main
                            : "transparent",
                        border: `1px solid ${
                          field.value === "dark"
                            ? theme.palette.orangePrimary.main
                            : "#AAAAAA"
                        } !important`,
                        borderRadius: "8px !important",
                      }}
                    >
                      <NightlightIcon
                        sx={{
                          fontSize: "30px",
                          color:
                            field.value === "dark"
                              ? theme.palette.orangePrimary.main
                              : "#AAAAAA",
                        }}
                      />
                    </ToggleButton>
                  </ToggleButtonGroup>
                  {error && <p className="text-red-500 mt-[4px]">{error}</p>}
                </>
              );
            }}
          />
        </div>

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
        <div className="w-full">
          <Typography
            variant="body2"
            sx={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#AAAAAA",
              textAlign: "start",
              margin: "0 0 5px 0px",
            }}
          >
            {t("menus.design")}
          </Typography>

          <Controller
            name={`branches.${selectedBranch}.design`}
            control={control}
            defaultValue="grid" // Or leave undefined if optional
            render={({ field }) => {
              const error = errors.branches?.[selectedBranch]?.design?.message;
              return (
                <>
                  <ToggleButtonGroup
                    value={field.value}
                    exclusive
                    onChange={(_, newValue) => {
                      if (newValue !== null) {
                        field.onChange(newValue);
                      }
                    }}
                    sx={{
                      backgroundColor: "transparent",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <ToggleButton
                      value="grid"
                      sx={{
                        padding: "8px",
                        backgroundColor:
                          field.value === "grid"
                            ? theme.palette.orangePrimary.main
                            : "transparent",
                        border: `1px solid ${
                          field.value === "grid"
                            ? theme.palette.orangePrimary.main
                            : "#AAAAAA"
                        } !important`,
                        borderRadius: "8px !important",
                        marginRight: "8px",
                      }}
                    >
                      <ViewQuiltIcon
                        sx={{
                          fontSize: "30px",
                          color:
                            field.value === "grid"
                              ? theme.palette.orangePrimary.main
                              : "#AAAAAA",
                        }}
                      />
                    </ToggleButton>

                    <ToggleButton
                      value="list"
                      sx={{
                        padding: "8px",
                        backgroundColor:
                          field.value === "list"
                            ? theme.palette.orangePrimary.main
                            : "transparent",
                        border: `1px solid ${
                          field.value === "list"
                            ? theme.palette.orangePrimary.main
                            : "#AAAAAA"
                        } !important`,
                        borderRadius: "8px !important",
                      }}
                    >
                      <FormatListBulletedIcon
                        sx={{
                          fontSize: "30px",
                          color:
                            field.value === "list"
                              ? theme.palette.orangePrimary.main
                              : "#AAAAAA",
                        }}
                      />
                    </ToggleButton>
                  </ToggleButtonGroup>
                  {error && <p className="text-red-500 mt-[4px]">{error}</p>}
                </>
              );
            }}
          />
        </div>
      </div>
      {/* WorkDays */}
      <div>
        {/* TODO: add name {`branches.${selectedBranch}.mode`} */}
        <WorkDaysBranchVersion
          setValue={setValue}
          watch={watch}
          getValues={getValues}
          control={control}
          errors={errors}
          selectedBranch={selectedBranch}
        />
      </div>
      <Divider
        sx={{ backgroundColor: "#f4f6fc", height: "2px", margin: "8px 0px" }}
        flexItem
      />
      <Typography
        variant="body1"
        sx={{ display: "flex", fontSize: "12px", color: "gray" }}
      >
        <span
          className="icon-waiter"
          style={{ fontSize: "20px", marginRight: "6px" }}
        ></span>
        {t("servingWay")}
      </Typography>
      <Box display="flex">
        {servingWayValues.map((value, index) => (
          <Controller
            key={value}
            name={`branches.${selectedBranch}.servingWays`}
            control={control}
            render={({ field }) => {
              const { value: currentValues = [], onChange } = field;
              const isChecked = currentValues.includes(value);

              const handleChange = () => {
                if (isChecked) {
                  onChange(currentValues.filter((v) => v !== value));
                } else {
                  onChange([...currentValues, value]);
                }
              };

              return (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={handleChange}
                        sx={{
                          "& .MuiSvgIcon-root": { fontSize: 20 },
                          color: "gray",
                          "&.Mui-checked": {
                            color: theme.palette.orangePrimary.main,
                          },
                        }}
                      />
                    }
                    label={servingWayLabels[index]}
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "12px",
                        color: "gray",
                      },
                    }}
                  />
                </>
              );
            }}
          />
        ))}
      </Box>
      {errors.branches?.[selectedBranch]?.servingWays && (
        <p className="text-red-500 mt-[4px]">
          {errors.branches?.[selectedBranch]?.servingWays?.message}
        </p>
      )}
      {/* 1. Active Checkbox */}
      <FormControl error={!!errors.active}>
        <Controller
          name={`branches.${selectedBranch}.callWaiter`}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value === "active"}
                  onChange={(e) => {
                    const newValue = e.target.checked ? "active" : "inactive";
                    field.onChange(newValue);
                  }}
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: 22 },
                    color: "gray",
                    "&.Mui-checked": {
                      color: theme.palette.orangePrimary.main,
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <span
                    className="icon-hand-up"
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      marginRight: "6px",
                    }}
                  ></span>
                  <Typography sx={{ fontSize: "14px", color: "gray" }}>
                    {t("activeCallWaiter")}
                  </Typography>
                </Box>
              }
            />
          )}
        />
        <FormHelperText>{errors.active?.message}</FormHelperText>
      </FormControl>

      {/* 2. Pricing Way Checkboxes */}
      <FormControl error={!!errors.pricingWay}>
        <Typography
          variant="body1"
          sx={{ display: "flex", fontSize: "14px", color: "gray" }}
        >
          {t("paymentMethod")}
        </Typography>
        <Controller
          name={`branches.${selectedBranch}.paymentMethods`}
          control={control}
          defaultValue={[]}
          render={({ field }) => {
            return (
              <>
                <FormGroup>
                  <Box display="flex" justifyContent="space-between">
                    {methods.map((method) => (
                      <FormControlLabel
                        key={method.text}
                        control={
                          <Checkbox
                            value={method.text}
                            checked={field.value.includes(method.text)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              const updated = isChecked
                                ? [...field.value, method.text]
                                : field.value.filter(
                                    (val) => val !== method.text
                                  );
                              field.onChange(updated);
                            }}
                            sx={{
                              "& .MuiSvgIcon-root": { fontSize: 22 },
                              color: "gray",
                              "&.Mui-checked": {
                                color: theme.palette.orangePrimary.main,
                              },
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {method.icon}
                            <span>{t(`${method.text}`)}</span>
                          </Box>
                        }
                        sx={{
                          "& .MuiTypography-root": {
                            fontSize: "10px",
                            color: "gray",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </FormGroup>
                {errors.branches?.[selectedBranch]?.paymentMethods && (
                  <FormHelperText error sx={{ marginLeft: 2 }}>
                    {errors.branches?.[selectedBranch]?.paymentMethods
                      ?.message ||
                      errors.branches?.[selectedBranch]?.paymentMethods?.[0]
                        ?.message}
                  </FormHelperText>
                )}
              </>
            );
          }}
        />
      </FormControl>

      {/* 3. Pay Time Radio Buttons */}
      <Typography
        variant="body1"
        sx={{ display: "flex", fontSize: "14px", color: "gray" }}
      >
        {t("paymentTime")}
      </Typography>
      <FormControl error={!!errors.payTime}>
        <Controller
          name={`branches.${selectedBranch}.paymentTime`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <>
              <RadioGroup {...field} row>
                <Box display="flex" justifyContent="left">
                  {[
                    { value: "before", text: "beforeServing" },
                    { value: "after", text: "afterServing" },
                  ].map((item) => (
                    <FormControlLabel
                      key={item.value}
                      value={item.value}
                      control={
                        <Radio
                          sx={{
                            "& .MuiSvgIcon-root": { fontSize: 20 },
                            color: "gray",
                            "&.Mui-checked": {
                              color: theme.palette.orangePrimary.main,
                            },
                          }}
                        />
                      }
                      label={t(`${item.text}`)}
                      sx={{
                        "& .MuiTypography-root": {
                          fontSize: "13px",
                          color: "gray",
                        },
                      }}
                    />
                  ))}
                </Box>
              </RadioGroup>
              {errors.paymentTime && (
                <FormHelperText error sx={{ marginLeft: 2 }}>
                  {errors.paymentTime.message}
                </FormHelperText>
              )}
            </>
          )}
        />
        {errors.branches?.[selectedBranch]?.paymentTime && (
          <FormHelperText error sx={{ marginLeft: 2 }}>
            {errors.branches?.[selectedBranch]?.paymentTime?.message}
          </FormHelperText>
        )}
      </FormControl>
    </>
  );
};
export const BranchFormColumnOneSectionTwo = ({
  t,
  i18n,
  control,
  watch,
  setValue,
  errors,
  selectedBranch,
  pricing_id,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data, error, isPending: isLoading } = usePlanPricing();
  const pricing_array = data?.data?.data || [];
  const servingWays = watch(`branches.${selectedBranch}.servingWays`);
  const selectedPlan = pricing_array.find((plan) => plan.id === pricing_id);
  const { data: currencies } = useGetCurrencies();
  const currenciesList = Array.isArray(currencies?.data?.currencies)
    ? currencies?.data?.currencies
    : [];

  console.log("currenciesList", currencies);
  return (
    <>
      {/* Currency */}
      <Controller
        name={`branches.${selectedBranch}.currency`}
        control={control}
        render={({ field }) => (
          <FormControl
            variant="outlined"
            sx={{ width: "100%", marginBottom: "10px" }}
            error={!!errors.branches?.[selectedBranch]?.currency}
          >
            <Select
              {...field}
              value={field.value || ""}
              displayEmpty
              sx={{
                borderRadius: "10px",
                height: "33px",
                fontSize: "12px",
                color: "gray",
              }}
              startAdornment={
                <InputAdornment position="start">
                  <AttachMoneyIcon sx={{ fontSize: "20px" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="" disabled>
                {t("currency")}
              </MenuItem>
              {currenciesList.map((item) => (
                <MenuItem key={item?.id} value={String(item?.id)}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            {errors.branches?.[selectedBranch]?.currency && (
              <FormHelperText>
                {errors.branches?.[selectedBranch]?.currency.message}
              </FormHelperText> // Show error message here
            )}
          </FormControl>
        )}
      />

      {/* Business Type */}
      <Controller
        name={`branches.${selectedBranch}.businessType`}
        control={control}
        render={({ field }) => (
          <FormControl
            variant="outlined"
            sx={{ width: "100%", marginBottom: "10px" }}
            error={!!errors.branches?.[selectedBranch]?.businessType}
          >
            <Select
              {...field}
              value={field.value || ""}
              displayEmpty
              sx={{
                borderRadius: "10px",
                height: "33px",
                fontSize: "12px",
                color: "gray",
              }}
              startAdornment={
                <InputAdornment position="start">
                  <CardTravelOutlinedIcon sx={{ fontSize: "20px" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="" disabled>
                {t("businessType")}
              </MenuItem>
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
            {errors.branches?.[selectedBranch]?.businessType && (
              <FormHelperText>
                {errors.branches?.[selectedBranch]?.businessType.message}
              </FormHelperText> // Show error message here
            )}
          </FormControl>
        )}
      />

      {/* Menu Default Language */}
      <Controller
        name={`branches.${selectedBranch}.menuLanguage`}
        control={control}
        render={({ field }) => (
          <FormControl
            variant="outlined"
            sx={{ width: "100%", marginBottom: "10px" }}
            error={!!errors.branches?.[selectedBranch]?.menuLanguage}
          >
            <Select
              {...field}
              value={field.value || ""}
              displayEmpty
              sx={{
                borderRadius: "10px",
                height: "33px",
                fontSize: "12px",
                color: "gray",
              }}
              startAdornment={
                <InputAdornment position="start">
                  <LanguageOutlinedIcon sx={{ fontSize: "20px" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="" disabled>
                {t("menuDefLang")}
              </MenuItem>
              <MenuItem value="US">English (US)</MenuItem>
              <MenuItem value="CA">English (CA)</MenuItem>
              <MenuItem value="UK">English (UK)</MenuItem>
            </Select>
            {errors.branches?.[selectedBranch]?.menuLanguage && (
              <FormHelperText>
                {errors.branches?.[selectedBranch]?.menuLanguage.message}
              </FormHelperText> // Show error message here
            )}
          </FormControl>
        )}
      />
      {/* number of tables */}
      {servingWays?.includes("dine_in") && (
        <Controller
          name={`branches.${selectedBranch}.numberOfTable`}
          control={control}
          render={({ field }) => (
            <FormControl
              variant="outlined"
              sx={{ width: "100%", marginBottom: "10px" }}
              error={!!errors.branches?.[selectedBranch]?.numberOfTable}
            >
              <Select
                {...field}
                value={field.value || ""}
                displayEmpty
                sx={{
                  borderRadius: "10px",
                  height: "33px",
                  fontSize: "12px",
                  color: "gray",
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <TableBarOutlinedIcon sx={{ fontSize: "20px" }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="" disabled>
                  {t("HowManyTablesDoYouHave") + t("optional")}
                </MenuItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((number) => (
                  <MenuItem key={number} value={number.toString()}>
                    {number}
                  </MenuItem>
                ))}
              </Select>
              {errors.branches?.[selectedBranch]?.numberOfTable && (
                <FormHelperText>
                  {errors.branches?.[selectedBranch]?.numberOfTable.message}
                </FormHelperText> // Show error message here
              )}
            </FormControl>
          )}
        />
      )}
      <Divider
        sx={{
          width: "100%",
          borderBottom: "1px solid #9d9d9c",
          marginBottom: "18px",
        }}
      />

      <Typography
        variant="body2"
        sx={{ fontSize: "14px", color: "gray", display: "flex" }}
      >
        <SellOutlinedIcon
          sx={{ color: "gray", fontSize: "20px", marginRight: "6px" }}
        />{" "}
        {t("Bundle")}
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        mb={2}
      >
        <Button
          variant="outlined"
          sx={{
            border: "1px solid gray",
            textTransform: "capitalize",
            color: "gray",
            padding: "1px 25px",
            borderRadius: "8px",
          }}
        >
          <CheckOutlinedIcon
            sx={{
              fontSize: "20px",
              marginRight: "6px",
              color: theme.palette.orangePrimary.main,
            }}
          />{" "}
          {selectedPlan ? selectedPlan.name : t("pro")}
        </Button>
        <Button
          onClick={() => navigate("/payment")}
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
    </>
  );
};
export const BranchFormColumnOneSectionOne = ({
  t,
  i18n,
  control,
  watch,
  setValue,
  errors,
  selectedBranch,
}) => {
  const selectedCountry = watch(`branches.${selectedBranch}.country`);
  const latitude = watch(`branches.${selectedBranch}.latitude`);
  const longitude = watch(`branches.${selectedBranch}.longitude`);

  const { citysValue, governValue } = useGetGovernAndCityFromQuery(
    selectedCountry || ""
  );
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <div>
      {/* Business Name */}
      <Controller
        name={`branches.${selectedBranch}.businessName`}
        control={control}
        rules={{ required: t("businessNameRequired") }}
        render={({ field }) => (
          <FormControl
            variant="outlined"
            fullWidth
            error={!!errors.branches?.[selectedBranch]?.businessName}
          >
            <OutlinedInput
              {...field}
              id="outlined-businessName"
              startAdornment={
                <InputAdornment position="start">
                  <StorefrontOutlinedIcon sx={{ fontSize: "20px" }} />
                </InputAdornment>
              }
              placeholder={t("businessName")}
              sx={{
                borderRadius: "10px",
                marginBottom: "10px !important",
                height: "33px",
                fontSize: "12px",
              }}
            />
            {errors.branches?.[selectedBranch]?.businessName && (
              <FormHelperText>
                {errors.branches?.[selectedBranch]?.businessName?.message}
              </FormHelperText> // Show error message here
            )}
          </FormControl>
        )}
      />

      {/* Business Phone */}
      {/* <Controller
                name="businessPhone"
                control={control}
                rules={{ required: t("businessPhoneRequired") }}
                render={({ field }) => (
                    <FormControl variant="outlined" fullWidth>
                        <OutlinedInput
                            {...field}
                            id="outlined-businessPhone"
                            startAdornment={
                                <InputAdornment position="start">
                                    <PhoneOutlinedIcon sx={{ fontSize: "20px" }} />
                                </InputAdornment>
                            }
                            placeholder={t("businessPhone")}
                            sx={{
                                borderRadius: "10px",
                                height: "33px",
                                marginBottom: "10px",
                                fontSize: "12px"
                            }}
                        />
                    </FormControl>
                )}
            />
            {errors.businessPhone && <span>{errors.businessPhone.message}</span>} */}
      <div className="pb-2">
        <PhoneFieldReactFormHook
          control={control}
          errors={errors}
          countryCodeName={`branches.${selectedBranch}.businessCountryCode`}
          phoneName={`branches.${selectedBranch}.businessPhone`}
        />
      </div>
      {/* Business Email */}
      <Controller
        name={`branches.${selectedBranch}.businessEmail`}
        control={control}
        rules={{
          required: t("businessEmailRequired"),
          pattern: { value: /^\S+@\S+$/, message: t("invalidEmail") },
        }}
        render={({ field }) => (
          <FormControl
            variant="outlined"
            fullWidth
            error={!!errors.branches?.[selectedBranch]?.businessEmail}
          >
            <OutlinedInput
              {...field}
              id="outlined-businessEmail"
              startAdornment={
                <InputAdornment position="start">
                  <MailOutlinedIcon sx={{ fontSize: "20px" }} />
                </InputAdornment>
              }
              placeholder={t("businessEmailNotOptional")}
              type="email"
              sx={{
                borderRadius: "10px",
                marginBottom: "10px",
                height: "33px",
                fontSize: "12px",
              }}
            />
            {errors.branches?.[selectedBranch]?.businessEmail && (
              <FormHelperText>
                {errors.branches?.[selectedBranch]?.businessEmail?.message}
              </FormHelperText> // Show error message here
            )}
          </FormControl>
        )}
      />

      {/* Pin */}
      <Controller
        name={`branches.${selectedBranch}.pin`}
        control={control}
        rules={{ required: t("pinRequired") }}
        render={({ field }) => (
          <FormControl
            variant="outlined"
            fullWidth
            error={!!errors.branches?.[selectedBranch]?.pin}
          >
            <OutlinedInput
              {...field}
              id="outlined-adminPin"
              startAdornment={
                <InputAdornment position="start">
                  <LockKeyhole size="20px" />
                </InputAdornment>
              }
              placeholder={t("pin")}
              sx={{
                borderRadius: "10px",
                marginBottom: "10px",
                height: "33px",
                fontSize: "12px",
              }}
            />
            {errors.branches?.[selectedBranch]?.pin && (
              <FormHelperText>
                {errors.branches?.[selectedBranch]?.pin?.message}
              </FormHelperText> // Show error message here
            )}
          </FormControl>
        )}
      />

      <div className="flex">
        {/* Country */}
        <Controller
          name={`branches.${selectedBranch}.country`}
          control={control}
          render={({ field }) => (
            <FormControl
              variant="outlined"
              fullWidth
              error={errors?.branches?.[selectedBranch]?.country}
            >
              <Select
                {...field}
                displayEmpty
                value={field.value?.id || ""}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedGovernorate = governValue.find(
                    (g) => String(g.id) === selectedId
                  );
                  field.onChange(selectedGovernorate); // Store full object
                  setValue(`branches.${selectedBranch}.city`, "");
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <span className="icon-location" />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: "10px",
                  height: "33px",
                  fontSize: "12px",
                  color: "gray",
                }}
              >
                <MenuItem value="" disabled>
                  {t("country")}
                </MenuItem>
                {governValue.map((govern) => (
                  <MenuItem
                    key={govern.id}
                    value={String(govern?.id)}
                    sx={{ fontSize: "12px", color: "gray" }}
                  >
                    {i18n.language === "ar" ? govern.name_ar : govern.name_en}
                  </MenuItem>
                ))}
              </Select>

              {errors.branches?.[selectedBranch]?.country && (
                <FormHelperText>
                  {errors.branches?.[selectedBranch]?.country?.message}
                </FormHelperText> // Show error message here
              )}
            </FormControl>
          )}
        />

        {/* City */}
        <Controller
          name={`branches.${selectedBranch}.city`}
          control={control}
          render={({ field }) => (
            <FormControl
              variant="outlined"
              fullWidth
              error={!!errors?.branches?.[selectedBranch]?.city}
            >
              <Select
                {...field}
                displayEmpty
                value={field.value?.id || ""}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedCity = citysValue.find(
                    (g) => String(g.id) === selectedId
                  );

                  field.onChange(selectedCity); // Store full object
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <span className="icon-location" />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: "10px",
                  height: "33px",
                  fontSize: "12px",
                  color: "gray",
                }}
              >
                <MenuItem value="" disabled>
                  {t("city")}
                </MenuItem>
                {citysValue.map((city) => (
                  <MenuItem key={city.id} value={String(city?.id)}>
                    {i18n.language === "ar" ? city.name_ar : city.name_en}
                  </MenuItem>
                ))}
              </Select>

              {errors.branches?.[selectedBranch]?.city && (
                <FormHelperText>
                  {errors.branches?.[selectedBranch]?.city?.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>
      <div className="py-2">
        <MapWithPin
          isMapOpen={isMapOpen}
          setIsMapOpen={setIsMapOpen}
          setPos={(pos) => {
            setValue(`branches.${selectedBranch}.latitude`, pos.lat, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue(`branches.${selectedBranch}.longitude`, pos.lng, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          currentPos={{
            latitude,
            longitude,
          }}
        />
        {errors.branches?.[selectedBranch]?.latitude && (
          <>
            <p className="text-red-500 mt-[4px]">
              {errors.branches?.[selectedBranch]?.latitude.message}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
const daysOfWeek = [
  { symbol: "Sa", value: "Saturday" },
  { symbol: "Su", value: "Sunday" },
  { symbol: "Mo", value: "Monday" },
  { symbol: "Tu", value: "Tuesday" },
  { symbol: "We", value: "Wednesday" },
  { symbol: "Th", value: "Thursday" },
  { symbol: "Fr", value: "Friday" },
];

const WorkDaysBranchVersion = ({
  watch,
  setValue,
  getValues,
  control,
  errors,
  selectedBranch,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [currentDay, setCurrentDay] = useState("Saturday");

  const handleSelectedDayChange = (action) => {
    const currentIndex = daysOfWeek.findIndex(
      (day) => day.value === currentDay
    );
    const nextIndex =
      action === "prev"
        ? (currentIndex - 1 + daysOfWeek.length) % daysOfWeek.length
        : (currentIndex + 1) % daysOfWeek.length;

    const nextDay = daysOfWeek[nextIndex].value;
    setCurrentDay(nextDay);

    // If no value exists for next day, initialize it
    const values = getValues(
      `branches.${selectedBranch}.workschedules.${nextDay}`
    );
    if (!values) {
      setValue(`branches.${selectedBranch}.workschedules.${nextDay}`, [
        "9:00 am",
        "5:00 pm",
      ]); // empty times or defaults
    }
  };

  const handleDayToggle = (day) => {
    const current = getValues(
      `branches.${selectedBranch}.workschedules.${day}`
    );
    if (current) {
      const prev = getValues(`branches.${selectedBranch}.workschedules`) || {};

      const updated = { ...prev };
      delete updated[day];
      setValue(`branches.${selectedBranch}.workschedules`, updated);
    } else {
      setValue(`branches.${selectedBranch}.workschedules.${day}`, [
        "9:00 am",
        "5:00 pm",
      ]);
    }
  };

  const selectedDaysWatch = watch(`branches.${selectedBranch}.workschedules`);

  console.log("selectedDaysWatch", selectedDaysWatch);

  const isSelected = (day) =>
    Object.keys(selectedDaysWatch || {}).includes(day);

  function DirectionIcon({ dirCond = "ltr" }) {
    const [dir, setDir] = useState(
      document.documentElement.getAttribute("dir") || "ltr"
    );

    useEffect(() => {
      const observer = new MutationObserver(() => {
        setDir(document.documentElement.getAttribute("dir") || "ltr");
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["dir"],
      });
      return () => observer.disconnect();
    }, []);

    return dir === dirCond ? (
      <ArrowForwardIos sx={{ fontSize: "11px" }} />
    ) : (
      <ArrowBackIos sx={{ fontSize: "11px" }} />
    );
  }
  return (
    <Grid container spacing={2} alignItems="center" sx={{ marginTop: "40px" }}>
      {/* Title */}
      <Grid item xs={12}>
        <Typography
          variant="body1"
          display="flex"
          alignItems="center"
          sx={{ fontSize: "15px", ml: 2 }}
        >
          <span
            className="icon-working-hour"
            style={{ marginInlineEnd: "10px", fontSize: "20px" }}
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
      </Grid>

      {/* Days */}
      <Grid item xs={12}>
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent={{ xs: "center", md: "flex-start" }}
        >
          {daysOfWeek.map((day) => (
            <Button
              key={day.value}
              onClick={() => handleDayToggle(day.value)}
              sx={{
                minWidth: "25px",
                height: "45px",
                width: "45px",
                m: 0.5,
                borderRadius: "5px",
                textTransform: "capitalize",
                fontSize: "14px",
                border: isSelected(day.value)
                  ? "1px solid #ef7d00"
                  : "1px solid gray",
                color: isSelected(day.value) ? "#ef7d00" : "gray",
              }}
            >
              {day.symbol}
            </Button>
          ))}
        </Box>
      </Grid>

      {/* Time Selectors */}
      <Grid item xs={12}>
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent={{ xs: "center", md: "flex-end" }}
          gap={1}
        >
          {/* Day Navigation */}
          <Box
            display="flex"
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.secondaryColor.main,
              borderRadius: "20px",
              height: "30px",
              px: 1,
            }}
          >
            <IconButton
              onClick={() => handleSelectedDayChange("prev")}
              sx={{
                color: "#ef7d00",
                p: 0.5,
                transform: { xs: "none", md: "scaleX(1)" },
                "& svg": {
                  transform: (theme) =>
                    theme.direction === "rtl" ? "scaleX(-1)" : "none",
                },
              }}
            >
              <DirectionIcon dirCond="rtl" />
            </IconButton>
            <Typography
              sx={{
                width: "60px",
                textTransform: "capitalize",
                color: "white",
                fontSize: "10px",
                textAlign: "center",
              }}
            >
              {t(currentDay.toLowerCase())}
            </Typography>
            <IconButton
              onClick={() => handleSelectedDayChange("next")}
              sx={{
                color: "#ef7d00",
                p: 0.5,
                "& svg": {
                  transform: (theme) =>
                    theme.direction === "rtl" ? "scaleX(-1)" : "none",
                },
              }}
            >
              <DirectionIcon />
            </IconButton>
          </Box>

          {/* From Label & Select */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body1"
              sx={{ fontSize: "11px", color: "gray" }}
            >
              {t("from")}
            </Typography>
            <Controller
              name={`branches.${selectedBranch}.workschedules.${currentDay}.0`}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  size="small"
                  sx={{ width: "90px", height: "30px" }}
                  inputProps={{ sx: { p: "2px 10px", fontSize: "12px" } }}
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 150 } },
                  }}
                >
                  {timeOptions.map((t) => (
                    <MenuItem key={`${t}-from`} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </Box>

          {/* To Label & Select */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body1"
              sx={{ fontSize: "11px", color: "gray" }}
            >
              {t("to")}
            </Typography>
            <Controller
              name={`branches.${selectedBranch}.workschedules.${currentDay}.1`}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  size="small"
                  sx={{ width: "90px", height: "30px" }}
                  inputProps={{ sx: { p: "2px 10px", fontSize: "12px" } }}
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 150 } },
                  }}
                >
                  {timeOptions.map((t) => (
                    <MenuItem key={`${t}-to`} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
