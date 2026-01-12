import React, { useState, useContext, useEffect } from 'react';
import {
    Grid,
    Divider,
    Box,
    Typography,
    Button,
    Checkbox,
    FormControlLabel,
    ToggleButton,
    ToggleButtonGroup,
    FormControl,
    MenuItem,
    Select,
    Paper,
    Radio,
} from '@mui/material';
import { styled, useTheme } from '@mui/system';
import StraightIcon from '@mui/icons-material/Straight';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Days from '../Menu/Days';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BASE_URL, BASE_URL_IMG } from "../../../../utils/constants"
import { useDispatch, useSelector } from 'react-redux';
import { selectGetInfoData, selectSelectedBranch, updateBranchMenu } from '../../../../store/client/clientAdmin';
import { printFormData } from '../../../../utils/utils';
import { timeOptions } from '../../../../Component/Business-info/WorkingHoursDays';



const ImageBox = styled(Box)(({ imageUrl }) => ({
    width: '120px',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
    backgroundColor: imageUrl ? 'transparent' : '#F1F2F2',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '50%',
}));

const Menu = () => {
    const dispatch = useDispatch()

    const dataRexud = useSelector(selectGetInfoData)
    const qtap_clients = dataRexud?.qtap_clients;

    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();
    const branchID = useSelector(selectSelectedBranch)
    console.log("branchID menu >>", branchID) // debug log

    const existBranch = qtap_clients?.brunchs?.find((branch) => branch?.id == branchID) || {};
    const [mode, setMode] = useState(existBranch?.default_mode?.toLowerCase() || 'white');
    const [design, setDesign] = useState(existBranch?.menu_design?.toLowerCase() || 'grid');
    const [logoImage, setLogoImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [servingWays, setServingWays] = useState(
        existBranch?.serving_ways?.map((way) => way.name) || []
    );
    const [tablesNumber, setTablesNumber] = useState(
        existBranch?.serving_ways?.find((way) => way.name === 'dine_in')?.tables_number || '12'
    );
    const [paymentServices, setPaymentServices] = useState(
        existBranch?.payment_services?.map((service) => service.name) || []
    );
    const [callWaiter, setCallWaiter] = useState(existBranch?.call_waiter || 'active');
    const [paymentTime, setPaymentTime] = useState(existBranch?.payment_time || 'before');
    const [selectedButtons, setSelectedButtons] = useState(
        existBranch?.workschedule?.map((day) => day.day) || []
    );

    // Initialize workSchedules from API
    const [workSchedules, setWorkSchedules] = useState(
        existBranch?.workschedule?.filter((day) => day.day) || []
    );
    useEffect(() => {
        const existBranch = qtap_clients?.brunchs?.find((branch) => branch?.id == branchID) || {};
        setMode(existBranch?.default_mode?.toLowerCase() || 'white');
        setDesign(existBranch?.menu_design?.toLowerCase() || 'grid');
        setLogoImage(null);
        setBannerImage(null);
        setServingWays(
            existBranch?.serving_ways?.map((way) => way.name) || []
        );
        setTablesNumber(
            existBranch?.serving_ways?.find((way) => way.name === 'dine_in')?.tables_number || '12'
        );
        setPaymentServices(
            existBranch?.payment_services?.map((service) => service.name) || []
        );
        setCallWaiter(existBranch?.call_waiter || 'active');
        setPaymentTime(existBranch?.payment_time || 'before');
        setSelectedButtons(
            existBranch?.workschedule?.map((day) => day.day) || []
        );

        setWorkSchedules(
            existBranch?.workschedule?.filter((day) => day.day) || []
        );
    }, [branchID])

    // Helper function to format API time (e.g., "9am" to "9:00 am")
    const formatTime = (time) => {
        if (!time) return '9:00 am'; // Default fallback
        const match = time.match(/(\d+)(am|pm)/i);
        if (match) {
            return `${match[1]}:00 ${match[2].toLowerCase()}`;
        }
        return time; // Return as-is if format doesn't match
    };

    // Initialize times state as an object mapping each day to its start and end times
    const [times, setTimes] = useState(() => {
        const initialTimes = {};
        Days.forEach((day) => {
            const schedule = existBranch?.workschedule?.find((s) => s.day === day.day);
            initialTimes[day.day] = {
                startTime: schedule ? formatTime(schedule.opening_time) : '9:00 am',
                endTime: schedule ? formatTime(schedule.closing_time) : '5:00 pm',
            };
        });
        return initialTimes;
    });
    const { t } = useTranslation();

    // Handle save
    const handleSave = async (id) => {
        /* 
         */
        setIsLoading(true)
        const finalWorkSchedules = workSchedules.reduce((acc, schedule) => {
            acc[schedule.day] = [schedule.opening_time, schedule.closing_time];
            return acc;
        }, {})
        const formData = new FormData();

        formData.append('brunch_id', branchID);
        formData.append('default_mode', mode);
        formData.append('menu_design', design);
        formData.append('tables_number', tablesNumber);
        formData.append('call_waiter', callWaiter);
        formData.append('payment_time', paymentTime);

        // Append payment services
        paymentServices.forEach(service => {
            formData.append('payment_services[]', service);
        });

        // Append serving ways
        servingWays.forEach(way => {
            formData.append('serving_ways[]', way);
        });


        for (const [day, times] of Object.entries(finalWorkSchedules)) {
            formData.append(`workschedules[${day}][]`, times[0]);
            formData.append(`workschedules[${day}][]`, times[1]);
        }

        if (logoImage) {
            formData.append('logo', logoImage);
        }
        if (bannerImage) {
            formData.append('cover', bannerImage);
        }
        /* 
         */
        try {

            const response = await fetch(`${BASE_URL}clients_update_menu/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                },
                body: formData,
            });
            const data = await response.json()
            if (response.ok) {
                toast.success(t("menus.updateSucc"));
                dispatch(updateBranchMenu(data.data))//TODO: UPDATA Should return new object

            } else {
                toast.error(t("menus.updateErr"));
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(t("menus.occuredErr"));
        } finally {
            setIsLoading(false)
        }
    };

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setLogoImage(file);
        }
    };

    const handleBannerUpload = (event) => {
        const file = event.target.files[0];
        if (file) {

            setBannerImage(file);
        }
    };

    const handleDesignChange = (event, newDesign) => {
        if (newDesign !== null) {
            setDesign(newDesign);
        }
    };

    const handleServingWayChange = (way) => {
        if (servingWays.includes(way)) {
            setServingWays(servingWays.filter((w) => w !== way));
        } else {
            setServingWays([...servingWays, way]);
        }
    };

    const handlePaymentServiceChange = (service) =>
        setPaymentServices(
            paymentServices.includes(service)
                ? paymentServices.filter((s) => s !== service)
                : [...paymentServices, service]
        );

    const handleButtonClick = (day) => {
        if (selectedButtons?.includes(day)) {
            // Remove the day from selectedButtons
            setSelectedButtons(selectedButtons.filter((d) => d !== day));
            // Remove the corresponding entry from workSchedules
            setWorkSchedules(workSchedules.filter((schedule) => schedule.day !== day));
        } else {
            // Add the day to selectedButtons
            setSelectedButtons([...selectedButtons, day]);
            // Add a new entry to workSchedules
            setWorkSchedules([
                ...workSchedules,
                {
                    day,
                    opening_time: times[day].startTime,
                    closing_time: times[day].endTime,
                },
            ]);
        }
    };

    const handleTimeChange = (day) => (event) => {
        const { name, value } = event.target;
        // Update times for the specific day
        setTimes((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [name]: value,
            },
        }));

        // Update workSchedules for the selected day
        const updatedSchedules = workSchedules.map((schedule) => {
            if (schedule.day === day) {
                return {
                    ...schedule,
                    opening_time: name === 'startTime' ? value : schedule.opening_time,
                    closing_time: name === 'endTime' ? value : schedule.closing_time,
                };
            }
            return schedule;
        });

        // If the day is selected but not in workSchedules, add it
        if (selectedButtons.includes(day) && !workSchedules.some((s) => s.day === day)) {
            updatedSchedules.push({
                day,
                opening_time: name === 'startTime' ? value : times[day].startTime,
                closing_time: name === 'endTime' ? value : times[day].endTime,
            });
        }

        setWorkSchedules(updatedSchedules);
    };

    return (
        <Paper style={{ padding: '20px 30px', borderRadius: '10px', marginTop: '16px' }}>
            <Grid container spacing={2}>
                {/* First Column */}
                <Grid item xs={12} lg={3} direction="column" sx={{ padding: '30px' }}>
                    <Box
                        mb={5}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: '20px',
                        }}
                    >
                        <ImageBox imageUrl={logoImage ? URL.createObjectURL(logoImage) : `${BASE_URL_IMG}${existBranch?.logo}`}>
                            {!logoImage && !existBranch?.logo && (
                                <span className="icon-image-gallery" style={{ fontSize: '40px', color: '#AAAAAA' }}></span>
                            )}
                        </ImageBox>
                        <Typography variant="subtitle1" sx={{ fontSize: '8px', color: '#AAAAAA', mb: 1, mt: 1 }}>
                            {t("logo500")}
                        </Typography>
                        <Button sx={{
                            backgroundColor: theme.palette.secondaryColor.main,
                            color: '#fff',
                            padding: '1px 30px',
                            textTransform: 'capitalize',
                            borderRadius: '20px',
                            fontSize: '9px',
                            textAlign: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: theme.palette.secondaryColor.main,
                            },
                        }} variant="contained" component="label">
                            <StraightIcon sx={{ color: theme.palette.orangePrimary.main, fontSize: '16px' }} /> {t("upload")}
                            <input type="file" accept="image/*" hidden onChange={handleLogoUpload} />
                        </Button>
                    </Box>

                    <Box
                        mb={4}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                width: '250px',
                                height: '125px',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                backgroundImage: bannerImage ? `url(${URL.createObjectURL(bannerImage)})` : existBranch?.cover ? `url(${BASE_URL_IMG}${existBranch.cover})` : 'none',
                                backgroundColor: bannerImage ? 'transparent' : '#F1F2F2',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {!bannerImage && !existBranch?.logo && (
                                <span className="icon-image-gallery" style={{ fontSize: '40px', color: '#AAAAAA' }}></span>
                            )}
                        </Box>
                        <Typography variant="subtitle1" align="center" sx={{ fontSize: '8px', color: '#AAAAAA', mt: 1 }}>
                            {t("banner1000x500")}
                        </Typography>
                        <Button variant="contained" component="label" sx={{
                            backgroundColor: theme.palette.secondaryColor.main,
                            color: '#fff',
                            padding: '1px 30px',
                            textTransform: 'capitalize',
                            borderRadius: '20px',
                            fontSize: '9px',
                            textAlign: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: theme.palette.secondaryColor.main,
                            }, mt: 1
                        }}>
                            <StraightIcon sx={{ color: theme.palette.orangePrimary.main, fontSize: '16px' }} /> {t("upload")}
                            <input type="file" accept="image/*" hidden onChange={handleBannerUpload} />
                        </Button>
                    </Box>
                </Grid>

                <Divider orientation="vertical" flexItem />

                {/* Second Column */}
                <Grid item xs={12} lg={4}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '20px',
                        }}
                    >
                        {/* Default Mode and Menu Design */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <Grid container spacing={1}>
                                <Typography
                                    variant="h3"
                                    sx={{ fontSize: '13px', width: '100%', fontWeight: '500', color: theme.palette.bodyColor.gray_white }}
                                >
                                    {t("defaultMode")}
                                </Typography>
                                <ToggleButtonGroup
                                    value={mode}
                                    exclusive
                                    onChange={(e, newValue) => { // Get value from second parameter
                                        setMode(newValue);
                                    }}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '90%',
                                    }}
                                >
                                    <ToggleButton
                                        value="white"
                                        sx={{
                                            padding: '5px 8px',
                                            border: '1px solid rgb(223, 223, 223) !important', // Use !important to override MUI defaults
                                            borderRadius: '5px !important', // Ensure border radius is applied
                                            backgroundColor: mode === 'white' ? theme.palette.orangePrimary.main : 'AAAAAA',
                                            color: mode === 'white' ? '#FFFFFF' : theme.palette.bodyColor.gray_white,
                                        }}
                                    >
                                        <WbSunnyIcon
                                            sx={{ fontSize: '30px', color: mode === 'white' ? theme.palette.orangePrimary.main : '#AAAAAA' }}
                                        />
                                    </ToggleButton>

                                    <ToggleButton
                                        value="dark"
                                        sx={{
                                            padding: '5px 8px',
                                            border: '1px solid rgb(223, 223, 223) !important', // Use !important to override MUI defaults
                                            borderRadius: '5px !important', // Ensure border radius is applied
                                            backgroundColor: mode === 'dark' ? theme.palette.orangePrimary.main : 'inherit',
                                            color: mode === 'dark' ? '#FFFFFF' : theme.palette.bodyColor.gray_white,
                                        }}
                                    >
                                        <NightlightIcon
                                            sx={{ fontSize: '30px', color: mode === 'dark' ? theme.palette.orangePrimary.main : '#AAAAAA' }}
                                        />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>

                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{ height: '50px', marginRight: '25px', width: '1px', backgroundColor: theme.palette.orangePrimary.main }}
                            />

                            <Grid container spacing={1}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontSize: '13px', width: '100%', fontWeight: '500', color: theme.palette.text.gray_white }}
                                >
                                    {t("menus.design")}
                                </Typography>
                                <ToggleButtonGroup value={design} exclusive onChange={handleDesignChange}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '90%',
                                    }}>
                                    <ToggleButton
                                        value="grid"
                                        sx={{
                                            padding: '5px 8px',
                                            border: '1px solid rgb(223, 223, 223) !important', // Use !important to override MUI defaults
                                            borderRadius: '5px !important', // Ensure border radius is applied
                                            backgroundColor: design === 'grid' ? theme.palette.orangePrimary.main : 'inherit',
                                            color: design === 'grid' ? theme.palette.orangePrimary.main : 'inherit',
                                        }}
                                    >
                                        <span
                                            className="icon-grid"
                                            style={{ fontSize: '30px', color: design === 'grid' ? theme.palette.orangePrimary.main : '#AAAAAA' }}
                                        />
                                    </ToggleButton>
                                    <ToggleButton
                                        value="list"
                                        sx={{
                                            padding: '5px 8px',
                                            border: '1px solid rgb(223, 223, 223) !important', // Use !important to override MUI defaults
                                            borderRadius: '5px !important', // Ensure border radius is applied
                                            backgroundColor: design === 'list' ? theme.palette.orangePrimary.main : 'inherit',
                                            color: design === 'list' ? theme.palette.orangePrimary.main : 'inherit',
                                        }}
                                    >
                                        <span
                                            className="icon-list"
                                            style={{ fontSize: '30px', color: design === 'list' ? theme.palette.orangePrimary.main : '#AAAAAA' }}
                                        />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                        </Box>
                        <Divider
                            sx={{ backgroundColor: '#f4f6fc', height: '2px', margin: '25px 0 12px 0' }}
                            flexItem
                        />

                        {/* Serving Ways */}
                        <Box sx={{ width: '100%' }}>
                            <Typography
                                variant="body1"
                                sx={{ display: 'flex', fontSize: '15px', color: theme.palette.bodyColor.gray_white, alignItems: 'center' }}
                            >
                                <span className="icon-waiter" style={{ fontSize: '18px', marginRight: '10px' }}></span>{' '}
                                {t("servingWay")}
                            </Typography>
                            <Box display="flex" justifyContent="space-between">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={servingWays.includes('dine_in')}
                                            onChange={() => handleServingWayChange('dine_in')}
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 22 },
                                                color: theme.palette.bodyColor.gray_white,
                                                '&.Mui-checked': {
                                                    color: theme.palette.orangePrimary.main,
                                                },
                                            }}
                                        />
                                    }
                                    label={t("Dine In")}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: '13px',
                                            color: theme.palette.bodyColor.gray_white,
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={servingWays.includes('take_away')}
                                            onChange={() => handleServingWayChange('take_away')}
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 22 },
                                                color: theme.palette.bodyColor.gray_white,
                                                '&.Mui-checked': {
                                                    color: theme.palette.orangePrimary.main,
                                                },
                                            }}
                                        />
                                    }
                                    label={t("Takeaway")}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: '13px',
                                            color: theme.palette.bodyColor.gray_white,
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={servingWays.includes('delivery')}
                                            onChange={() => handleServingWayChange('delivery')}
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 22 },
                                                color: theme.palette.bodyColor.gray_white,
                                                '&.Mui-checked': {
                                                    color: theme.palette.orangePrimary.main,
                                                },
                                            }}
                                        />
                                    }
                                    label={t("Delivery")}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: '13px',
                                            color: theme.palette.bodyColor.gray_white,
                                        },
                                    }}
                                />
                            </Box>
                        </Box>

                        <Divider
                            sx={{ backgroundColor: '#f4f6fc', height: '2px', margin: '18px 0 12px 0' }}
                            flexItem
                        />

                        {/* Activate Call Waiter */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'left',
                                width: '100%',
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={callWaiter === 'active'}
                                        onChange={(e) => setCallWaiter(e.target.checked ? 'active' : 'inactive')}
                                        sx={{
                                            '& .MuiSvgIcon-root': { fontSize: 22 },
                                            color: theme.palette.bodyColor.gray_white,
                                            '&.Mui-checked': {
                                                color: theme.palette.orangePrimary.main,
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <span
                                            className="icon-hand-up"
                                            style={{ fontSize: 16, color: theme.palette.secondaryColor.main, marginRight: '10px' }}
                                        ></span>
                                        <Typography sx={{ fontSize: '15px', color: theme.palette.bodyColor.gray_white }}>
                                            {t("activeCallWaiter")}
                                        </Typography>
                                    </Box>
                                }
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    '& .MuiTypography-root': {
                                        fontSize: '15px',
                                        color: theme.palette.bodyColor.gray_white,
                                    },
                                }}
                            />
                        </Box>

                        <Divider
                            sx={{ backgroundColor: '#f4f6fc', height: '2px', margin: '25px 0 15px 0' }}
                            flexItem
                        />

                        {/* Payment Method */}
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="body1" sx={{ display: 'flex', fontSize: '15px', color: theme.palette.bodyColor.gray_white }}>
                                {t("paymentMethod")}
                            </Typography>
                            <Box display="flex" justifyContent="space-between">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={paymentServices.includes('cash')}
                                            onChange={() => handlePaymentServiceChange('cash')}
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 22, borderRadius: '10px' },
                                                color: theme.palette.bodyColor.gray_white,
                                                '&.Mui-checked': {
                                                    color: theme.palette.orangePrimary.main,
                                                },
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
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: '11px',
                                            color: theme.palette.bodyColor.gray_white,
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={paymentServices.includes('wallet')}
                                            onChange={() => handlePaymentServiceChange('wallet')}
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 22 },
                                                color: theme.palette.bodyColor.gray_white,
                                                '&.Mui-checked': {
                                                    color: theme.palette.orangePrimary.main,
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <span
                                                className="icon-wallet"
                                                style={{ fontSize: 20, marginRight: '4px', marginLeft: '-5px' }}
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
                                            <span>{t("digitalWaller")}</span>
                                        </Box>
                                    }
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: '11px',
                                            color: theme.palette.bodyColor.gray_white,
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={paymentServices.includes('card')}
                                            onChange={() => handlePaymentServiceChange('card')}
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 22 },
                                                color: theme.palette.bodyColor.gray_white,
                                                '&.Mui-checked': {
                                                    color: theme.palette.orangePrimary.main,
                                                },
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
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: '11px',
                                            color: theme.palette.bodyColor.gray_white,
                                        },
                                    }}
                                />
                            </Box>
                        </Box>

                        <Divider
                            sx={{ backgroundColor: '#f4f6fc', height: '2px', margin: '18px 0 12px 0' }}
                            flexItem
                        />

                        {/* Payment Time */}
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="body1" sx={{ display: 'flex', fontSize: '15px', color: theme.palette.bodyColor.gray_white }}>
                                {t("paymentTime")}
                            </Typography>
                            <Box display="flex" justifyContent="left">
                                <FormControlLabel
                                    control={
                                        <Radio
                                            checked={paymentTime === 'before'}
                                            onChange={() => setPaymentTime('before')}
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 22 },
                                                color: theme.palette.bodyColor.gray_white,
                                                '&.Mui-checked': {
                                                    color: theme.palette.orangePrimary.main,
                                                },
                                            }}
                                        />
                                    }
                                    label={t("beforeServing")}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: '13px',
                                            color: theme.palette.bodyColor.gray_white,
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    control={
                                        <Radio
                                            checked={paymentTime === 'after'}
                                            onChange={() => setPaymentTime('after')}
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 22 },
                                                color: theme.palette.bodyColor.gray_white,
                                                '&.Mui-checked': {
                                                    color: theme.palette.orangePrimary.main,
                                                },
                                            }}
                                        />
                                    }
                                    label={t("afterServing")}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: '13px',
                                            color: theme.palette.bodyColor.gray_white,
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Divider orientation="vertical" flexItem />

                {/* Third Column */}
                <Grid item xs={12} lg={4} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
                    {/* Working Hours Title */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'left',
                            marginBottom: 1,
                            padding: '10px 0px',
                            width: '100%',
                        }}
                    >
                        <span className="icon-working-hour">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                            <span className="path5"></span>
                            <span className="path6"></span>
                            <span className="path7"></span>
                            <span className="path8"></span>
                        </span>
                        <Typography variant="h6" sx={{ fontSize: '13px', color: theme.palette.bodyColor.gray_white, marginLeft: '5px' }}>
                            {t("workHours")}
                        </Typography>
                    </Box>

                    {/* Days and Time Selectors */}
                    <Box
                        sx={{
                            padding: '0 10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        {Days.map((item) => (
                            <Box
                                key={item.day}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderRadius: 2,
                                    marginBottom: '20px',
                                    width: '100%',
                                }}
                            >
                                {/* Day Button (Aligned Left) */}
                                <Button
                                    sx={{
                                        color: selectedButtons.includes(item.day) ? '#FFA500' : '#9d9d9c',
                                        minWidth: 32,
                                        height: 30,
                                        borderRadius: 2,
                                        fontSize: '13px',
                                        border: `1px solid ${selectedButtons.includes(item.day) ? theme.palette.orangePrimary.main : '#9d9d9c'}`,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: '10px',
                                    }}
                                    onClick={() => handleButtonClick(item.day)}
                                    value={existBranch?.workschedule?.find((day) => day.day === item.day)?.day}
                                >
                                    {item.value}
                                </Button>

                                {/* Time Selectors (Centered in Remaining Space) */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flex: 1,
                                    }}
                                >
                                    {/* To Time */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                                        <Typography sx={{ fontSize: '11px', color: '#BDBDBD', marginRight: 1 }}>
                                            {t("to")}
                                        </Typography>
                                        <FormControl variant="outlined" size="small" sx={{ minWidth: 70 }}>
                                            <Select
                                                name="endTime"
                                                value={times[item.day]?.endTime || '5:00 pm'}
                                                onChange={handleTimeChange(item.day)}
                                                sx={{ fontSize: '10px', color: theme.palette.bodyColor.gray_white }}
                                                MenuProps={{
                                                    disableScrollLock: true,
                                                }}
                                            >
                                                {timeOptions.map((time) => (
                                                    <MenuItem key={time} value={time} sx={{ color: "gray", fontSize: "12px" }}>
                                                        <span style={{ fontSize: "10px", color: "gray" }}>{time}</span>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    {/* From Time */}
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: '11px', color: '#BDBDBD', marginRight: 1 }}>
                                            {t("from")}
                                        </Typography>
                                        <FormControl variant="outlined" size="small" sx={{ minWidth: 70 }}>
                                            <Select
                                                name="startTime"
                                                value={times[item.day]?.startTime || '9:00 am'}
                                                onChange={handleTimeChange(item.day)}
                                                sx={{ fontSize: '10px', color: theme.palette.bodyColor.gray_white }}
                                                MenuProps={{
                                                    disableScrollLock: true,
                                                }}
                                            >
                                                {timeOptions.map((time) => (
                                                    <MenuItem key={time} value={time} sx={{ color: "gray", fontSize: "12px" }}>
                                                        <span style={{ fontSize: "10px", color: "gray" }}>{time}</span>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>

            <Box textAlign="center" mt={2}>
                <Button
                    variant="contained"
                    sx={{
                        fontSize: '13px',
                        padding: '3px 50px',
                        borderRadius: '20px',
                        backgroundColor: theme.palette.orangePrimary.main,
                        color: 'white',
                        textTransform: 'capitalize',
                        '&:hover': {
                            backgroundColor: theme.palette.orangePrimary.main,
                        },
                    }}
                    startIcon={<CheckOutlinedIcon />}
                    onClick={() => handleSave(qtap_clients?.id)}
                    disabled={isLoading}
                >
                    {t("save")}
                </Button>
            </Box>
        </Paper >
    );
};

export default Menu;