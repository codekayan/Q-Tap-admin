import { useForm, Controller } from "react-hook-form";
import {
    Grid,
    Typography,
    Divider,
    FormControl,
    OutlinedInput,
    InputAdornment,
    MenuItem,
    Select,
    FormHelperText,
    IconButton,
    Box
} from "@mui/material";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { PhoneFieldReactFormHook } from "../../../../register-busniess-info-page/PhoneFieldReactFormHook";
import { useGetEgyptGovern } from "../../../../../Hooks/Queries/public/citys/useGetEgyptGovern";



export default function PersonalInfoForm({ control, watch, setValue, getValues, errors, trigger }) {
    const YEAR_SELECT_START_FROM = 1950;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const { data: governs, isPending: loadingGovern } = useGetEgyptGovern()


    const [preview, setPreview] = useState("/images/User.jpg");

    return (

        <Grid container>
            <Grid item xs={12} md={3} >
                <div className="md:ms-2 flex-col">


                    <div className="md:my-2">
                        <ArrowBackIosOutlinedIcon
                            onClick={() => navigate('/payment')}
                            sx={{ color: "#4b4a4a", cursor: "pointer", marginInlineStart: { xs: '0px', md: '0px' } }}
                        />
                    </div>
                    <Controller
                        name="image"
                        control={control}
                        render={({ field }) => (
                            <div className="flex-col gap-4">
                                <Box
                                    sx={{
                                        width: "150px",
                                        height: "150px",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        position: "relative",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginX: { xs: "auto", md: "0px" },
                                    }}
                                >
                                    <img
                                        src={preview}
                                        alt="user"
                                        style={{ width: "110%", height: "110%" }}
                                    />

                                    {/* Edit overlay */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 0,
                                            width: "100%",
                                            height: "18%",
                                            backgroundColor: "#4b4a4a",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            color: "white",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <EditOutlinedIcon sx={{ color: "white", fontSize: "20px" }} />
                                        <input

                                            accept="image/*"
                                            style={{
                                                display: "block",
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                opacity: 0,
                                                cursor: "pointer",
                                            }}
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                console.log("image file ", file)
                                                field.onChange(file || null); // ✅ trigger RHF even if no file
                                                if (file) {
                                                    setPreview(URL.createObjectURL(file));
                                                }
                                                trigger("image");
                                            }}
                                        />
                                    </Box>
                                </Box>
                                {
                                    errors.image &&
                                    <p className="text-red-500 mt-[4px]" > {errors.image.message}</p>

                                }
                            </div>
                        )}
                    />
                </div>
            </Grid>
            <Grid item xs={12} md={9} >
                <Typography
                    variant="body2"
                    sx={{ fontSize: "15px" }}
                    gutterBottom
                >
                    {t("personalInfo")}
                </Typography>

                <Divider
                    sx={{
                        width: "35%",
                        borderBottom: "4px solid #ef7d00",
                        marginBottom: "18px"
                    }}
                />

                {/* Full Name */}
                <Controller
                    name="fullName"
                    control={control}
                    rules={{ required: t("fullNameRequired") }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.fullName} sx={{ mb: 2 }}>
                            <OutlinedInput
                                {...field}
                                placeholder={t("fullName")}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <PersonOutlinedIcon sx={{ fontSize: 20 }} />
                                    </InputAdornment>
                                }
                                sx={{ borderRadius: "10px", height: "33px", fontSize: "12px" }}
                            />
                            {errors.fullName && (
                                <FormHelperText>{errors.fullName.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />

                {/* Phone */}
                <div className="pb-2">
                    <PhoneFieldReactFormHook
                        control={control}
                        errors={errors}
                        countryCodeName={"countryCode"}
                        phoneName={"phone"}
                    />
                </div>
                {/* Email */}
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: t("emailRequired"),
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: t("emailInvalid")
                        }
                    }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.email} sx={{ mb: 2 }}>
                            <OutlinedInput
                                {...field}
                                placeholder={t("email")}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <MailOutlinedIcon sx={{ fontSize: 20 }} />
                                    </InputAdornment>
                                }
                                sx={{ borderRadius: "10px", height: "33px", fontSize: "12px" }}
                            />
                            {errors.email && (
                                <FormHelperText>{errors.email.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />

                {/* Website */}
                <Controller
                    name="website"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <OutlinedInput
                                {...field}
                                placeholder={t("websiteNoOptional")}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <LanguageOutlinedIcon sx={{ fontSize: 18 }} />
                                    </InputAdornment>
                                }
                                sx={{ borderRadius: "10px", height: "33px", fontSize: "12px" }}
                            />
                            {errors.website && (
                                <FormHelperText>{errors?.website?.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />

                {/* Birth Date Selects */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    {["month", "day", "year"].map((name, idx) => (
                        <Grid item xs={4} key={name}>
                            <Controller
                                name={name}
                                control={control}
                                rules={{ required: t(`${name}Required`) }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors[name]}>
                                        <Select
                                            {...field}
                                            displayEmpty
                                            sx={{
                                                borderRadius: "10px",
                                                height: "33px",
                                                fontSize: "12px",
                                                color: "gray"
                                            }}
                                        >
                                            <MenuItem value="" disabled>
                                                {t(name)}
                                            </MenuItem>
                                            {name === "month" &&
                                                [...Array(12).keys()].map((i) => (
                                                    <MenuItem
                                                        key={i + 1}
                                                        value={String(i + 1).padStart(2, "0")}
                                                    >
                                                        {String(i + 1).padStart(2, "0")}
                                                    </MenuItem>
                                                ))}
                                            {name === "day" &&
                                                [...Array(31).keys()].map((i) => (
                                                    <MenuItem
                                                        key={i + 1}
                                                        value={String(i + 1).padStart(2, "0")}
                                                    >
                                                        {String(i + 1).padStart(2, "0")}
                                                    </MenuItem>
                                                ))}
                                            {name === "year" &&
                                                Array.from(
                                                    {
                                                        length:
                                                            new Date().getFullYear() -
                                                            YEAR_SELECT_START_FROM +
                                                            1
                                                    },
                                                    (_, i) => (
                                                        <MenuItem
                                                            key={i + YEAR_SELECT_START_FROM}
                                                            value={(i + YEAR_SELECT_START_FROM) + ""}
                                                        >
                                                            {i + YEAR_SELECT_START_FROM}
                                                        </MenuItem>
                                                    )
                                                )}
                                        </Select>
                                        {errors[name] && (
                                            <FormHelperText>{errors[name].message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Country */}
                <Controller
                    name="country"
                    control={control}
                    rules={{ required: t("countryRequired") }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.country} sx={{ mb: 2 }}>
                            <Select
                                {...field}
                                displayEmpty
                                sx={{
                                    borderRadius: "10px",
                                    height: "33px",
                                    fontSize: "12px",
                                    color: "gray"
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <PinDropOutlinedIcon sx={{ fontSize: 20 }} />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="" disabled>
                                    {t("country")}
                                </MenuItem>
                                {!loadingGovern &&
                                    (governs.data.data || [])?.map(govern => (
                                        <MenuItem
                                            key={govern.id}
                                            value={govern.id + ""}
                                            sx={{ fontSize: "12px", color: "gray" }}
                                        >
                                            {i18n.language === "ar"
                                                ? govern.name_ar
                                                : govern.name_en}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                            {errors.country && (
                                <FormHelperText>{errors.country.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />

                {/* Password */}
                <Controller
                    name="password"
                    control={control}
                    rules={{ required: t("passwordRequired") }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.password} sx={{ mb: 2 }}>
                            <OutlinedInput
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder={t("password")}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ fontSize: 20 }} />
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                sx={{ borderRadius: "10px", height: "33px", fontSize: "12px" }}
                            />
                            {errors.password && (
                                <FormHelperText>{errors.password.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />

                {/* Confirm Password */}
                <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                        required: t("confirmPasswordRequired"),
                        validate: (value, allValues) =>
                            value === allValues.password || t("passwordMismatch")
                    }}
                    render={({ field }) => (
                        <FormControl
                            fullWidth
                            error={!!errors.confirmPassword}
                            sx={{ mb: 2 }}
                        >
                            <OutlinedInput
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={t("confirmPass")}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ fontSize: 20 }} />
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowConfirmPassword((prev) => !prev)
                                            }
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                sx={{ borderRadius: "10px", height: "33px", fontSize: "12px" }}
                            />
                            {errors.confirmPassword && (
                                <FormHelperText>
                                    {errors.confirmPassword.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    )}
                />
            </Grid>
        </Grid>
    );
}
