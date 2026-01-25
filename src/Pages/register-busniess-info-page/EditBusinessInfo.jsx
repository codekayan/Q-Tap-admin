import {
  Typography,
  Box,
  useTheme,
  Grid,
  styled,
  Button,
  TextField,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from "@mui/material";
import EditBusinessInfoLayout from "./BusinessInfoLayout";
import { useTranslation } from "react-i18next";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { Controller, useForm } from "react-hook-form";
import { string, z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import {
  updateBusinessData,
  updateBusinessDataByIndex,
} from "../../store/register/businessSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import WorkDays from "./WordDays";
import MapWithPin from "../../utils/MapWithPin";
import { useEffect, useRef, useState } from "react";

import BusinessOptions from "./BusinessOptionsComponent";
import ModeAndDesignBox from "./ModeAndDesignBox";
import useGetGovernAndCityFromQuery from "../../Hooks/Queries/public/citys/useGetGovernAndCityFromQuery";
import { useNavigate, useParams } from "react-router";
import { PhoneFieldReactFormHook } from "./PhoneFieldReactFormHook";
import parsePhoneNumberFromString from "libphonenumber-js";
import { phoneNumberSuperRefineValidation } from "../Client/Row2/AddClient/save-page/saveNewRegisterUserFormSchema";
import useBranchStore from "../../store/zustand-store/register-client-branch-store";
import { useGetCurrencies } from "../../Hooks/Queries/public/currencies/useGetCurrencies";

const EditBusinessInfo = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const addBranch = useBranchStore((state) => state.addBranch);
  const updateBranch = useBranchStore((state) => state.updateBranch);
  const branches = useBranchStore((state) => state.branches);

  const { id } = useParams();

  const [isMapOpen, setIsMapOpen] = useState(false);

  const timeRangeSchema = z
    .array(z.string().min(1))
    .length(2, { message: t("businessInfo.validation.timeRange.both") })
    .refine(([start, end]) => start !== end, {
      message: t("businessInfo.validation.timeRange.same"),
    });

  const workScheduleSchema = z
    .record(z.string(), timeRangeSchema)
    .refine((obj) => Object.keys(obj).length > 0, {
      message: t("businessInfo.validation.workSchedule.required"),
    });

  const PaymentMethodEnum = z.enum(["cash", "card", "wallet"]);

  const schema = z
    .object({
      businessName: z
        .string()
        .min(1, t("businessInfo.validation.businessName.required")),
      website: z.string().optional(),
      businessEmail: z
        .string()
        .min(1, t("businessInfo.validation.businessEmail.required")),
      currency: z
        .string()
        .min(1, t("businessInfo.validation.currency.required")),
      businessType: z
        .string()
        .min(1, t("businessInfo.validation.businessType.required")),

      workschedules: workScheduleSchema,

      businessPhone: z
        .string()
        .min(1, t("businessInfo.validation.businessPhone.required")),
      businessCountryCode: z
        .string()
        .min(1, t("businessInfo.validation.businessCountryCode.required"))
        .regex(
          /^[A-Z]{2}$/,
          t("businessInfo.validation.businessCountryCode.invalid")
        ),

      country: z.object({
        id: z.number(),
        code: z.string(),
        name_en: z.string(),
        name_ar: z.string(),
      }),
      city: z.object({
        id: z.number(),
        name_en: z.string(),
        name_ar: z.string(),
      }),

      latitude: z
        .number({ message: t("businessInfo.validation.location.required") })
        .optional()
        .refine((latitude) => typeof latitude === "number", {
          message: t("businessInfo.validation.location.required"),
          path: ["latitude"],
        }),
      longitude: z
        .number()
        .optional()
        .refine((longitude) => typeof longitude === "number", {
          message: t("businessInfo.validation.location.required"),
          path: ["longitude"],
        }),

      mode: z.string().min(1, t("businessInfo.validation.mode.required")),
      design: z.string().min(1, t("businessInfo.validation.design.required")),

      callWaiter: z
        .enum(["active", "inactive"], {
          required_error: t("businessInfo.validation.callWaiter.required"),
        })
        .default("inactive"),

      paymentMethods: z
        .array(PaymentMethodEnum)
        .min(1, t("businessInfo.validation.paymentMethods.required")),

      paymentTime: z
        .string()
        .refine((val) => val === "before" || val === "after", {
          message: t("businessInfo.validation.paymentTime.invalid"),
        }),
    })
    .superRefine(phoneNumberSuperRefineValidation);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      businessCountryCode: "",
      ...branches?.[id],
      latitude: branches?.[id]?.latitude ?? "",
      longitude: branches?.[id]?.longitude ?? "",
      callWaiter: "inactive",
      workschedules: { Saturday: ["9:00 am", "5:00 pm"] },
    },
  });

  const selectedCountry = watch("country");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const { citysValue, governValue } = useGetGovernAndCityFromQuery(
    selectedCountry || ""
  );
  console.log(errors);

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    console.log("PIN in form data:", data.pin);
    if (id) {
      console.log("updata branch");
      updateBranch(id, data);
    } else {
      console.log("create branch");
      addBranch(data);
    }
    // navigate("/branches", { replace: true });
    navigate(`/serving-ways/?index=${id ? id : -1}`, { replace: true });
  };
  const { data: currencies } = useGetCurrencies();
  const currenciesList = Array.isArray(currencies?.data?.currencies)
    ? currencies?.data?.currencies
    : [];
  return (
    <EditBusinessInfoLayout>
      <Box sx={{ paddingBlock: "20px", paddingInline: "50px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="column"
            gap="1rem"
            textAlign="center"
            spacing={2}
          >
            <Grid container display={"flex"} justifyContent={"space-between"}>
              <Grid item xs={12} md={6} gap={".25rem"}>
                <Stack spacing={2}>
                  <TextField
                    label={t("businessInfo.fields.businessName")}
                    fullWidth
                    {...register("businessName")}
                    error={!!errors.businessName}
                    helperText={
                      errors.businessName?.message &&
                      t(errors.businessName.message)
                    }
                  />

                  <TextField
                    label={t("businessInfo.fields.website")}
                    fullWidth
                    {...register("website")}
                    error={!!errors.website}
                    helperText={
                      errors.website?.message && t(errors.website.message)
                    }
                  />

                  <TextField
                    label={t("businessInfo.fields.businessEmail")}
                    fullWidth
                    {...register("businessEmail")}
                    error={!!errors.businessEmail}
                    helperText={
                      errors.businessEmail?.message &&
                      t(errors.businessEmail.message)
                    }
                  />

                  <FormControl fullWidth error={!!errors.currency}>
                    <Controller
                      name="currency"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          {...field}
                          startAdornment={
                            <InputAdornment position="start">
                              <img
                                src="/assets/revenue.svg"
                                alt="icon"
                                style={{ width: "16px", height: "16px" }}
                              />
                            </InputAdornment>
                          }
                          sx={{
                            "& .MuiSelect-icon": {
                              right: 7,
                              left: "auto",
                            },
                            '[dir="rtl"] & .MuiSelect-icon': {
                              left: 7,
                              right: "auto",
                            },
                          }}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            {t("businessInfo.fields.currency")}
                          </MenuItem>
                          {currenciesList.map((item) => (
                            <MenuItem key={item?.id} value={String(item?.id)}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    <FormHelperText>
                      {errors.currency?.message && t(errors.currency.message)}
                    </FormHelperText>
                  </FormControl>

                  <FormControl fullWidth error={!!errors.businessType}>
                    <Controller
                      name="businessType"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          {...field}
                          startAdornment={
                            <InputAdornment position="start">
                              <img
                                src="/assets/revenue.svg"
                                alt="icon"
                                style={{ width: "16px", height: "16px" }}
                              />
                            </InputAdornment>
                          }
                          sx={{
                            "& .MuiSelect-icon": {
                              right: 7,
                              left: "auto",
                            },
                            '[dir="rtl"] & .MuiSelect-icon': {
                              left: 7,
                              right: "auto",
                            },
                          }}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            {t("businessType")}
                          </MenuItem>
                          <MenuItem value="restaurant">
                            {t("restaurant")}
                          </MenuItem>
                          <MenuItem value="cafe">{t("cafe")}</MenuItem>
                          <MenuItem value="cloud">
                            {t("cloudKitchens")}
                          </MenuItem>
                          <MenuItem value="fast">{t("fastFood")}</MenuItem>
                          <MenuItem value="truck">{t("foodTruch")}</MenuItem>
                          <MenuItem value="Bakery">{t("bakeryStore")}</MenuItem>
                          <MenuItem value="Pastry">{t("pastryStore")}</MenuItem>
                          <MenuItem value="Fruits">{t("fruitsStore")}</MenuItem>
                          <MenuItem value="Retail">{t("retailStore")}</MenuItem>
                        </Select>
                      )}
                    />
                    <FormHelperText>
                      {errors?.businessType?.message}
                    </FormHelperText>
                  </FormControl>

                  <WorkDays
                    setValue={setValue}
                    watch={watch}
                    getValues={getValues}
                    control={control}
                    errors={errors}
                  />
                  {errors.workschedules &&
                    Object.entries(errors.workschedules).map(
                      ([day, errors]) => {
                        console.log("errors.workschedules", errors);
                        return (
                          Array.isArray(errors) &&
                          errors.map((err, idx) => (
                            <p
                              key={`${day}-${idx}`}
                              className="text-red-500 mt-[4px]"
                            >
                              {`${day} :${idx === 0 ? "from" : "to"} ${
                                err.message
                              }`}
                            </p>
                          ))
                        );
                      }
                    )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Stack spacing={2}>
                  <PhoneFieldReactFormHook
                    control={control}
                    errors={errors}
                    countryCodeName="businessCountryCode"
                    phoneName="businessPhone"
                  />

                  <Box display="flex" justifyContent="left" gap={".5rem"}>
                    <FormControl fullWidth error={!!errors.country}>
                      <Controller
                        name="country"
                        control={control}
                        defaultValue={undefined}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value?.id || ""}
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              const selectedGovernorate = governValue.find(
                                (g) => g.id === selectedId
                              );
                              field.onChange(selectedGovernorate); // Store full object
                              setValue("city", "");
                            }}
                            startAdornment={
                              <InputAdornment position="start">
                                <img
                                  src="/assets/revenue.svg"
                                  alt="icon"
                                  style={{ width: "16px", height: "16px" }}
                                />
                              </InputAdornment>
                            }
                            sx={{
                              "& .MuiSelect-icon": {
                                right: 7,
                                left: "auto",
                              },
                              '[dir="rtl"] & .MuiSelect-icon': {
                                left: 7,
                                right: "auto",
                              },
                            }}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              country
                            </MenuItem>
                            {governValue.map((govern) => (
                              <MenuItem key={govern?.id} value={govern?.id}>
                                {govern?.name_en}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      <FormHelperText>{errors.country?.message}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth error={!!errors.city}>
                      <Controller
                        name="city"
                        control={control}
                        defaultValue={undefined}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value?.id || ""}
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              const selectedCity = citysValue.find(
                                (g) => g.id === selectedId
                              );

                              field.onChange(selectedCity); // Store full object
                            }}
                            startAdornment={
                              <InputAdornment position="start">
                                <img
                                  src="/assets/revenue.svg"
                                  alt="icon"
                                  style={{ width: "16px", height: "16px" }}
                                />
                              </InputAdornment>
                            }
                            sx={{
                              "& .MuiSelect-icon": {
                                right: 7,
                                left: "auto",
                              },
                              '[dir="rtl"] & .MuiSelect-icon': {
                                left: 7,
                                right: "auto",
                              },
                            }}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              city
                            </MenuItem>
                            {citysValue.map((city) => (
                              <MenuItem key={city?.id} value={city?.id}>
                                {city?.name_en}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      <FormHelperText>{errors.city?.message}</FormHelperText>
                    </FormControl>
                  </Box>
                  <MapWithPin
                    isMapOpen={isMapOpen}
                    setIsMapOpen={setIsMapOpen}
                    setPos={(pos) => {
                      setValue("latitude", pos.lat, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      setValue("longitude", pos.lng, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    currentPos={{
                      latitude,
                      longitude,
                    }}
                  />
                  {(errors.latitude || errors.longitude) && (
                    <p style={{ color: "#f44336" }}>
                      {errors?.latitude?.message || errors?.longitude?.message}
                    </p>
                  )}

                  <ModeAndDesignBox control={control} errors={errors} />

                  <BusinessOptions control={control} errors={errors} />
                </Stack>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  width: "300px",
                  fontSize: "13px",
                  borderRadius: "50px",
                  backgroundColor: theme.palette.orangePrimary.main,
                  textTransform: "none",
                  padding: "6px 15px",
                  "&:hover": {
                    backgroundColor: theme.palette.orangePrimary.main,
                  },
                  color: "#fff",
                }}
              >
                {t("Done")}
                <TrendingFlatIcon
                  sx={{ marginLeft: "8px", fontSize: "18px" }}
                />
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </EditBusinessInfoLayout>
  );
};

export default EditBusinessInfo;
