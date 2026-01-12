
import { Box, Button, MenuItem, styled, TextField, ToggleButton, ToggleButtonGroup, Typography, Grid, InputAdornment, Select, FormControl, useTheme, IconButton, Checkbox, FormControlLabel, Radio, CircularProgress, OutlinedInput, InputLabel } from '@mui/material';
import React, { useState, useEffect } from 'react';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { useNavigate } from 'react-router';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { useTranslation } from 'react-i18next';
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import { toast } from 'react-toastify';
import { timeOptions } from './WorkingHoursDays';
import { Country, Governorates } from '../../utils/city';

import { useSelector, useDispatch } from "react-redux";
import { updateBusinessData, } from "../../store/register/businessSlice";
import MapWithPin from '../../utils/MapWithPin';
import useRegisterChangeThemeMode from '../../Hooks/Queries/useRegisterChangeThemeMode';
import { useGetEgyptGovern } from '../../Hooks/Queries/public/citys/useGetEgyptGovern';
import { useGetEgyptCityByGovernID } from '../../Hooks/Queries/public/citys/useGetEgyptCityByGovernID';
import useGetGovernAndCityFromQuery from '../../Hooks/Queries/public/citys/useGetGovernAndCityFromQuery';
import PhoneField from '../phone-field/PhoneField';

// تحديد الأيام بأحرف مختصرة للعرض
const daysOfWeek = ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'];
// تحديد الأيام الكاملة للـ context
const fullDaysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const BusinessInfo = () => {
    const theme = useTheme();
    const Divider = styled(Box)({
        width: '5%',
        height: '3px',
        backgroundColor: theme.palette.orangePrimary.main,
        borderRadius: "20px",
        marginBottom: "20px"
    });
    const dispatch = useDispatch();
    const { businessData, branches, selectedBranch } = useSelector((state) => state.registerBranchStore);
    const [isMapOpen, setIsMapOpen] = useState(false)
    const [pos, setPos] = useState(null)

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    // Initialize all state values from context
    const dataSource = selectedBranch !== null && branches[selectedBranch] ? branches[selectedBranch] : businessData;
    const [mode, setMode] = useState(theme.palette.mode === "light" ? 'white' : "dark");
    const [design, setDesign] = useState(dataSource.design || 'grid');
    const [format, setFormat] = useState(dataSource.format || '');
    const [currency, setCurrency] = useState(dataSource.currency || '');
    const [country, setCountry] = useState(dataSource.country || '');
    const [city, setCity] = useState(dataSource.city || '');
    const [businessName, setBusinessName] = useState(dataSource.businessName || '');
    const [website, setWebsite] = useState(dataSource.website || '');
    const [businessEmail, setBusinessEmail] = useState(dataSource.businessEmail || '');
    const [businessPhone, setBusinessPhone] = useState(dataSource.businessPhone || '');
    const [businessPhoneCountry, setBusinessPhoneCountry] = useState('');
    const [selectedDays, setSelectedDays] = useState(
        dataSource.workschedules
            ? Object.keys(dataSource.workschedules).map((day) => daysOfWeek[fullDaysOfWeek.indexOf(day)])
            : ['Sa', 'Su']
    );
    const [currentDay, setCurrentDay] = useState('Saturday');
    const [fromTime, setFromTime] = useState(
        dataSource.workschedules?.[currentDay]?.[0] || '9:00 am'
    );
    const [toTime, setToTime] = useState(
        dataSource.workschedules?.[currentDay]?.[1] || '7:00 pm'
    );
    const [paymentMethods, setPaymentMethods] = useState(dataSource.paymentMethods || []);
    const [paymentTime, setPaymentTime] = useState(dataSource.paymentTime || 'after');
    const [activeWaiter, setActiveWaiter] = useState(dataSource.callWaiter || 'inactive');


    const { citysValue, governValue, loadingCities, loadingGovern } = useGetGovernAndCityFromQuery(country)

    console.log(citysValue)

    // تحديث fromTime و toTime عند تغيير currentDay
    useEffect(() => {
        const schedules = dataSource.workschedules || {};
        if (schedules[currentDay]) {
            setFromTime(schedules[currentDay][0]);
            setToTime(schedules[currentDay][1]);
        } else {
            setFromTime('9:00 am');
            setToTime('7:00 pm');
        }
        console.log(schedules)
    }, [currentDay, dataSource.workschedules]);

    // Update context whenever values change (excluding workschedules)
    useEffect(() => {
        const updatedData = {
            mode,
            design,
            format,
            currency,
            country,
            city,
            businessName,
            website,
            businessEmail,
            businessPhone,
            callWaiter: activeWaiter,
            paymentTime,
            paymentMethods,
            latitude: pos?.lat,
            longitude: pos?.lng,

        };
        console.log("use effect to updata business data")
        dispatch(updateBusinessData(updatedData));
    }, [mode, design, format, currency, country, city, businessName, website,
        businessEmail, businessPhone, activeWaiter, paymentTime, paymentMethods, pos]);

    // const { toggleColorMode, setTheme, mode: ThemeMode } = useColorMode();
    // useEffect(() => {
    //     if ((mode === "white" && ThemeMode !== "light")) {
    //         setTheme("light")

    //     } else if (mode === "dark" && ThemeMode !== "dark") {
    //         setTheme("dark")
    //     }
    // }, [mode])
    // Handlers
    const handleModeChange = (event, newMode) => {
        if (newMode !== null) {
            setMode(newMode);
        }
    };

    const handleDesignChange = (event, newDesign) => {
        if (newDesign !== null) {
            setDesign(newDesign);
        }
    };

    const handleDayClick = (day) => {
        const newSelectedDays = selectedDays.includes(day)
            ? selectedDays.filter((d) => d !== day)
            : [...selectedDays, day];
        setSelectedDays(newSelectedDays);

        // تحديث workschedules
        const updatedSchedules = { ...dataSource.workschedules };
        const fullDay = fullDaysOfWeek[daysOfWeek.indexOf(day)];
        if (newSelectedDays.includes(day)) {
            updatedSchedules[fullDay] = updatedSchedules[fullDay] || [fromTime, toTime];
        } else {
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

        // تحديث workschedules فقط إذا كان اليوم محددًا
        const dayAbbr = daysOfWeek[fullDaysOfWeek.indexOf(currentDay)];
        if (selectedDays.includes(dayAbbr)) {
            const updatedSchedules = {
                ...dataSource.workschedules,
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

    const handleNextClick = () => {
        // Required fields validation
        if (!businessName.trim()) {
            toast.error(t("plEntBusinessName"));
            return;
        }
        if (!businessPhone.trim()) {
            toast.error(t("plEntBusinessPhone"));
            return;
        }
        if (!country) {
            toast.error(t("plSelectCountry"));
            return;
        }
        if (!city) {
            toast.error(t("plSelectCity"));
            return;
        }
        if (!currency) {
            toast.error(t("plSelectCurrency"));
            return;
        }
        if (!format) {
            toast.error(t("plSelectBusinessFormat"));
            return;
        }

        // إضافة الفرع الحالي إلى branches
        // addBranch();
        navigate('/serving-ways');
    };
    useRegisterChangeThemeMode(mode)
    return (
        <Box marginTop={"50px"} padding={"20px 0 0 40px "} style={{}}>
            <Typography variant="body1" sx={{ fontSize: "18px" }}>
                {t("busnessInfo")}
            </Typography>
            <Divider />

            <Box sx={{ padding: "20px 50px" }}>
                <Grid container display="flex" justifyContent="space-between" alignItems="center" flexDirection='column' gap='1rem' textAlign="center" spacing={2}>
                    <Grid container display={"flex"} justifyContent={"space-between"} >
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder={t("businessName")}
                                value={businessName}
                                autoComplete="off"
                                onChange={(e) => setBusinessName(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <StorefrontOutlinedIcon sx={{ fontSize: "18px", }} />
                                        </InputAdornment>
                                    ),
                                    sx: { height: "40px", borderRadius: "10px", fontSize: "10px" }
                                }}
                                sx={{ marginBottom: "15px", marginTop: "10px" }}
                            />
                            <TextField
                                fullWidth
                                placeholder={t("website")}
                                value={website}
                                autoComplete="off"
                                onChange={(e) => setWebsite(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LanguageOutlinedIcon sx={{ fontSize: "18px", }} />
                                        </InputAdornment>
                                    ),
                                    sx: { height: "40px", borderRadius: "10px", fontSize: "10px" }
                                }}
                                sx={{ marginBottom: "15px" }}
                            />
                            <TextField
                                fullWidth
                                placeholder={t("businessEmail")}
                                value={businessEmail}
                                autoComplete="off"
                                onChange={(e) => setBusinessEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailOutlinedIcon sx={{ fontSize: "18px" }} />
                                        </InputAdornment>
                                    ),
                                    sx: { height: "40px", borderRadius: "10px", fontSize: "10px" }
                                }}
                                sx={{ marginBottom: "15px" }}
                            />
                            <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px' }}>
                                <Select
                                    id="outlined-currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    displayEmpty
                                    sx={{ borderRadius: '10px', height: '40px', marginBottom: "10px", fontSize: "10px" }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <img src="/assets/revenue.svg" alt="icon" style={{ width: "16px", height: "16px" }} />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="" disabled>
                                        {t("currency")}
                                    </MenuItem>
                                    <MenuItem value="US">United States</MenuItem>
                                    <MenuItem value="CA">Canada</MenuItem>
                                    <MenuItem value="UK">United Kingdom</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px' }}>
                                <Select
                                    id="outlined-format"
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    displayEmpty
                                    sx={{ borderRadius: '10px', height: '40px', marginBottom: "10px", fontSize: "10px" }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <span className="icon-briefcase" style={{ fontSize: "18px" }}></span>
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="" disabled>
                                        {t("businessFormat")}
                                    </MenuItem>
                                    <MenuItem value="ul">UL</MenuItem>
                                    <MenuItem value="uk">UK</MenuItem>
                                </Select>
                            </FormControl>
                            <Box>
                                <Grid container spacing={2} alignItems="center" sx={{ marginTop: "40px" }}>
                                    <Typography variant="body1" display="flex" alignItems="center"
                                        sx={{ fontSize: '15px', marginLeft: "20px" }}>
                                        <span className="icon-working-hour" style={{ marginRight: "10px", fontSize: "20px" }}>
                                            <span className="path1"></span><span className="path2"></span><span className="path3"></span>
                                            <span className="path4"></span><span className="path5"></span><span className="path6"></span>
                                            <span className="path7"></span><span className="path8"></span>
                                        </span>
                                        {t("workHours")}
                                    </Typography>
                                    <Grid item xs={12} display={"flex"} justifyContent={"space-between"}>
                                        <Grid item xs={7}>
                                            <Box display="flex" flexWrap="wrap">
                                                {daysOfWeek.map((day) => (
                                                    <Button
                                                        key={day}
                                                        onClick={() => handleDayClick(day)}
                                                        sx={{
                                                            minWidth: '25px',
                                                            height: "45px",
                                                            width: "45px",
                                                            margin: '3px',
                                                            borderRadius: '5px',
                                                            textTransform: "capitalize",
                                                            fontSize: "14px",
                                                            border: selectedDays.includes(day) ? '1px solid #ef7d00' : '1px solid gray',
                                                            color: selectedDays.includes(day) ? '#ef7d00' : 'gray',
                                                        }}
                                                    >
                                                        {day}
                                                    </Button>
                                                ))}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Grid container spacing={2} alignItems="center" justifyContent="end">
                                                <Grid item xs={3} display="flex" justifyContent="end" alignItems="center">
                                                    <Box display="flex" alignItems="center"
                                                        sx={{
                                                            backgroundColor: theme.palette.secondaryColor.main,
                                                            borderRadius: '20px',
                                                            height: "30px",
                                                            padding: "0 5px",
                                                        }}>
                                                        <IconButton onClick={() => handleDayToggle('prev')} sx={{ color: '#ef7d00' }}>
                                                            <ArrowBackIos sx={{ fontSize: "11px" }} />
                                                        </IconButton>
                                                        <Typography sx={{ width: "60px", textTransform: "capitalize", color: 'white', fontSize: "10px" }}>
                                                            {t(currentDay.toLowerCase())}
                                                        </Typography>
                                                        <IconButton onClick={() => handleDayToggle('next')} sx={{ color: '#ef7d00' }}>
                                                            <ArrowForwardIos sx={{ fontSize: "11px" }} />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                                <Box display={"flex"} sx={{ margin: "10px 10px 0 0" }}>
                                                    <Grid item>
                                                        <Typography variant='body1' sx={{ fontSize: '11px', color: "gray", mr: 1 }}>{t("from")}</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            select
                                                            value={fromTime}
                                                            onChange={(e) => handleTimeChange(e, 'from')}
                                                            size="small"
                                                            sx={{ width: "90px", height: "30px" }}
                                                            inputProps={{ sx: { padding: '2px 10px', fontSize: '12px' } }}
                                                            SelectProps={{
                                                                MenuProps: {
                                                                    PaperProps: {
                                                                        style: {
                                                                            maxHeight: 150, // <-- 👈 الارتفاع الثابت للقائمة المنسدلة (يمكنك تعديله)
                                                                        },
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            {timeOptions.map((time) => (
                                                                <MenuItem key={time} value={time} sx={{ color: "gray", fontSize: "12px" }}>
                                                                    <span style={{ fontSize: "10px", color: "gray" }}>{time}</span>
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Grid>
                                                </Box>
                                                <Box display={"flex"} sx={{ margin: "3px 10px" }}>
                                                    <Grid item>
                                                        <Typography variant='body1' sx={{ fontSize: '11px', color: "gray", mr: 1 }}>{t("to")}</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            select
                                                            value={toTime}
                                                            onChange={(e) => handleTimeChange(e, 'to')}
                                                            size="small"
                                                            sx={{ width: "90px", height: "30px" }}
                                                            inputProps={{ sx: { padding: '2px 10px', fontSize: '12px' } }}
                                                            SelectProps={{
                                                                MenuProps: {
                                                                    PaperProps: {
                                                                        style: {
                                                                            maxHeight: 150, // <-- 👈 الارتفاع الثابت للقائمة المنسدلة (يمكنك تعديله)
                                                                        },
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            {timeOptions.map((time) => (
                                                                <MenuItem key={time} value={time} sx={{ color: "gray", fontSize: "12px" }}>
                                                                    <span style={{ fontSize: "10px", color: "gray" }}>{time}</span>
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Grid>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={5} >


                            <PhoneField
                                countryCode={businessPhoneCountry}
                                phone={businessPhone}
                                setPhone={setBusinessPhone}
                                setCountryCode={setBusinessPhoneCountry}
                                isRounded={false}
                            />
                            {/* <TextField
                                fullWidth
                                placeholder={t("businessPhone")}
                                value={businessPhone}
                                onChange={(e) => setBusinessPhone(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneOutlinedIcon sx={{ fontSize: "18px" }} />
                                        </InputAdornment>
                                    ),
                                    sx: { height: "40px", borderRadius: "10px", fontSize: "10px" }
                                }}
                                sx={{ marginTop: "15px" }}
                            /> */}
                            <Box sx={{ marginTop: "15px", marginBottom: "10px" }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl variant="outlined" fullWidth>
                                            <Select
                                                id="outlined-country"
                                                value={country}
                                                onChange={(e) => {
                                                    console.log("Selected:", e.target.value);
                                                    setCountry(e.target.value);
                                                    setCity("");
                                                }}
                                                sx={{
                                                    borderRadius: '10px',
                                                    height: '40px',
                                                    marginBottom: "10px",
                                                    fontSize: "10px"
                                                }}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <PinDropOutlinedIcon sx={{ fontSize: "18px" }} />
                                                    </InputAdornment>
                                                }
                                            >
                                                <MenuItem value="" disabled>
                                                    {t("Select country") || "Select country"}
                                                </MenuItem>

                                                {loadingGovern ? (
                                                    <MenuItem disabled>
                                                        <CircularProgress size={20} /> &nbsp; Loading cities...
                                                    </MenuItem>
                                                ) : (
                                                    governValue.map(item => (
                                                        <MenuItem key={item.id} value={item.id} sx={{ fontSize: "12px" }}>
                                                            {i18n.language === 'ar' ? item.name_ar : item.name_en}
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl variant="outlined" fullWidth>
                                            <Select
                                                id="outlined-city"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                displayEmpty
                                                sx={{ borderRadius: '10px', height: '40px', marginBottom: "10px", fontSize: "10px" }}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <PinDropOutlinedIcon sx={{ fontSize: "18px" }} />
                                                    </InputAdornment>
                                                }
                                            >
                                                <MenuItem value="" disabled sx={{ fontSize: "12px", }}>
                                                    {t("city")}
                                                </MenuItem>
                                                {loadingCities ? (
                                                    <MenuItem disabled>
                                                        <CircularProgress size={20} /> &nbsp; Loading cities...
                                                    </MenuItem>
                                                ) :
                                                    citysValue.map((city) => (
                                                        <MenuItem key={city?.id} value={city.id} sx={{ fontSize: "12px", }}>{city.name_en}</MenuItem>
                                                    ))}
                                                {/* <MenuItem value="NY" sx={{ fontSize: "12px", color: "gray" }}>New York</MenuItem>
                                                <MenuItem value="LA" sx={{ fontSize: "12px", color: "gray" }}>Los Angeles</MenuItem>
                                                <MenuItem value="CHI" sx={{ fontSize: "12px", color: "gray" }}>Chicago</MenuItem> */}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>
                            {/* <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: theme.palette.bluePrimary.main,
                                    borderRadius: "10px",
                                    textTransform: "capitalize",
                                    marginBottom: 2,
                                    width: '100%',
                                    fontSize: "11px",
                                    '&:hover': {
                                        backgroundColor: theme.palette.secondaryColor.main,
                                    },
                                }}
                            >
                                <span className="icon-map-1" style={{ fontSize: "18px", marginRight: "5px" }}>
                                    <span className="path1"></span><span className="path2"></span><span className="path3"></span>
                                    <span className="path4"></span><span className="path5"></span><span className="path6"></span>
                                    <span className="path7"></span><span className="path8"></span><span className="path9"></span>
                                    <span className="path10"></span><span className="path11"></span><span className="path12"></span>
                                    <span className="path13"></span><span className="path14"></span><span className="path15"></span>
                                </span>
                                {t("pinYourLocation")}
                            </Button> */}

                            <MapWithPin
                                isMapOpen={isMapOpen}
                                setIsMapOpen={setIsMapOpen}
                                setPos={setPos}
                                currentPos={{ latitude: pos?.lat, longitude: pos?.lng, }}
                            />

                            <Box sx={{ marginTop: "6px", display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                                <Grid container direction="column" spacing={1} sx={{ marginLeft: "2px" }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontSize: "14px", fontWeight: "500", color: "#AAAAAA", textAlign: "start", marginBottom: "4px" }}
                                    >
                                        {t("defaultMode")}
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={mode}
                                        exclusive
                                        onChange={handleModeChange}
                                        sx={{ display: "flex", justifyContent: "space-between" }}
                                    >
                                        <ToggleButton
                                            value="white"
                                            sx={{
                                                padding: "12px",
                                                backgroundColor: mode === "white" ? theme.palette.orangePrimary.main : "transparent",
                                                border: `1px solid ${mode === "white" ? theme.palette.orangePrimary.main : "#AAAAAA"} !important`,
                                                borderRadius: "8px !important",
                                                marginRight: "8px",
                                            }}
                                        >
                                            <WbSunnyIcon
                                                sx={{ fontSize: "35px", color: mode === "white" ? theme.palette.orangePrimary.main : "#AAAAAA" }}
                                            />
                                        </ToggleButton>
                                        <ToggleButton
                                            value="dark"
                                            sx={{
                                                padding: "12px",
                                                backgroundColor: mode === "dark" ? theme.palette.orangePrimary.main : "transparent",
                                                border: `1px solid ${mode === "dark" ? theme.palette.orangePrimary.main : "#AAAAAA"} !important`,
                                                borderRadius: "8px !important",
                                            }}
                                        >
                                            <NightlightIcon
                                                sx={{ fontSize: "35px", color: mode === "dark" ? theme.palette.orangePrimary.main : "#AAAAAA" }}
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
                                        margin: "auto 20px",
                                    }}
                                />
                                <Grid container direction="column" spacing={1}>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontSize: "14px", fontWeight: "500", color: "#AAAAAA", textAlign: "start", marginBottom: "4px" }}
                                    >
                                        {t("menus.design")}
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={design}
                                        exclusive
                                        onChange={handleDesignChange}
                                        sx={{ display: "flex", justifyContent: "space-between" }}
                                    >
                                        <ToggleButton
                                            value="grid"
                                            sx={{
                                                padding: "12px",
                                                backgroundColor: design === "grid" ? theme.palette.orangePrimary.main : "transparent",
                                                border: `1px solid ${design === "grid" ? theme.palette.orangePrimary.main : "#AAAAAA"} !important`,
                                                borderRadius: "8px !important",
                                                marginLeft: "8px",
                                            }}
                                        >
                                            <GridViewIcon
                                                sx={{ fontSize: "35px", color: design === "grid" ? theme.palette.orangePrimary.main : "#AAAAAA" }}
                                            />
                                        </ToggleButton>
                                        <ToggleButton
                                            value="list"
                                            sx={{
                                                padding: "12px",
                                                backgroundColor: design === "list" ? theme.palette.orangePrimary.main : "transparent",
                                                border: `1px solid ${design === "list" ? theme.palette.orangePrimary.main : "#AAAAAA"} !important`,
                                                borderRadius: "8px !important",
                                            }}
                                        >
                                            <ListIcon
                                                sx={{ fontSize: "35px", color: design === "list" ? theme.palette.orangePrimary.main : "#AAAAAA" }}
                                            />
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                            </Box>
                            <Box sx={{ marginTop: "20px" }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: "flex-start", textAlign: 'left', width: '100%' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={activeWaiter === 'active'}
                                                onChange={() => setActiveWaiter(activeWaiter === 'active' ? 'inactive' : 'active')}
                                                sx={{
                                                    '& .MuiSvgIcon-root': { fontSize: 22 },
                                                    color: "gray",
                                                    '&.Mui-checked': { color: theme.palette.orangePrimary.main }
                                                }}
                                            />
                                        }
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <span className="icon-hand-up" style={{ fontSize: "20px", color: 'gray', marginRight: "6px" }}></span>
                                                <Typography sx={{ fontSize: "14px", color: "gray" }}>
                                                    {t("activeCallWaiter")}
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{
                                            display: 'flex',
                                            alignItems: "center",
                                            '& .MuiTypography-root': { fontSize: "15px", color: "gray" }
                                        }}
                                    />
                                </Box>
                                <Box sx={{ margin: "18px 0px" }}>
                                    <Typography variant="body1" sx={{ display: "flex", fontSize: "14px", color: "gray" }}>
                                        {t("paymentMethod")}
                                    </Typography>
                                    <Box display="flex" justifyContent="space-between">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={paymentMethods.includes("cash")}
                                                    onChange={() => setPaymentMethods(paymentMethods.includes("cash") ? paymentMethods.filter(method => method !== "cash") : [...paymentMethods, "cash"])}
                                                    sx={{
                                                        '& .MuiSvgIcon-root': { fontSize: 22 },
                                                        color: "gray",
                                                        '&.Mui-checked': { color: theme.palette.orangePrimary.main }
                                                    }}
                                                />
                                            }
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <img
                                                        src="/assets/cash.svg"
                                                        alt="cash icon"
                                                        style={{ width: '15px', height: '15px', marginRight: '4px', marginLeft: '-5px' }}
                                                    />
                                                    <span>{t("cash")}</span>
                                                </Box>
                                            }
                                            sx={{ '& .MuiTypography-root': { fontSize: "13px", color: "gray" } }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={paymentMethods.includes("wallet")}
                                                    onChange={() => setPaymentMethods(paymentMethods.includes("wallet") ? paymentMethods.filter(method => method !== "wallet") : [...paymentMethods, "wallet"])}
                                                    sx={{
                                                        '& .MuiSvgIcon-root': { fontSize: 22 },
                                                        color: "gray",
                                                        '&.Mui-checked': { color: theme.palette.orangePrimary.main }
                                                    }}
                                                />
                                            }
                                            label={
                                                <span style={{ display: 'flex', fontSize: "13px", alignItems: 'center' }}>
                                                    <span className="icon-wallet" style={{ marginRight: '2px', fontSize: "20px" }}>
                                                        <span className="path1"></span><span className="path2"></span><span className="path3"></span>
                                                        <span className="path4"></span><span className="path5"></span><span className="path6"></span>
                                                        <span className="path7"></span><span className="path8"></span><span className="path9"></span>
                                                        <span className="path10"></span><span className="path11"></span><span className="path12"></span>
                                                    </span>
                                                    {t("digitalWaller")}
                                                </span>
                                            }
                                            sx={{ '& .MuiTypography-root': { fontSize: "10px", color: "gray" } }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={paymentMethods.includes("card")}
                                                    onChange={() => setPaymentMethods(paymentMethods.includes("card") ? paymentMethods.filter(method => method !== "card") : [...paymentMethods, "card"])}
                                                    sx={{
                                                        '& .MuiSvgIcon-root': { fontSize: 22 },
                                                        color: "gray",
                                                        '&.Mui-checked': { color: theme.palette.orangePrimary.main }
                                                    }}
                                                />
                                            }
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <img
                                                        src="/assets/cardColor.svg"
                                                        alt="card icon"
                                                        style={{ width: '15px', height: '15px', marginRight: '4px', marginLeft: '-5px' }}
                                                    />
                                                    <span>{t("card")}</span>
                                                </Box>
                                            }
                                            sx={{ '& .MuiTypography-root': { fontSize: "13px", color: "gray" } }}
                                        />
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography variant="body1" sx={{ display: "flex", fontSize: "14px", color: "gray" }}>
                                        {t("paymentTime")}
                                    </Typography>
                                    <Box display="flex" justifyContent="left">
                                        <FormControlLabel
                                            control={
                                                <Radio
                                                    checked={paymentTime === 'before'}
                                                    onChange={() => setPaymentTime('before')}
                                                    sx={{
                                                        '& .MuiSvgIcon-root': { fontSize: 20 },
                                                        color: "gray",
                                                        '&.Mui-checked': { color: theme.palette.orangePrimary.main }
                                                    }}
                                                />
                                            }
                                            label={t("beforeServing")}
                                            sx={{ '& .MuiTypography-root': { fontSize: "13px", color: "gray" } }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Radio
                                                    checked={paymentTime === 'after'}
                                                    onChange={() => setPaymentTime('after')}
                                                    sx={{
                                                        '& .MuiSvgIcon-root': { fontSize: 20 },
                                                        color: "gray",
                                                        '&.Mui-checked': { color: theme.palette.orangePrimary.main }
                                                    }}
                                                />
                                            }
                                            label={t("afterServing")}
                                            sx={{ '& .MuiTypography-root': { fontSize: "13px", color: "gray" } }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>



                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            sx={{
                                width: '300px',
                                fontSize: "13px",
                                borderRadius: '50px',
                                backgroundColor: theme.palette.orangePrimary.main,
                                textTransform: 'none',
                                padding: "6px 15px",
                                '&:hover': { backgroundColor: theme.palette.orangePrimary.main },
                                color: "#fff",
                            }}
                            onClick={handleNextClick}
                        >
                            {t("next")}
                            <TrendingFlatIcon sx={{ marginLeft: "8px", fontSize: "18px" }} />
                        </Button>
                    </Grid>
                </Grid>
            </Box >
        </Box >
    );
};

export default BusinessInfo;