import { AppBar, Avatar, Button, CircularProgress, Divider, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Popover, Switch, Toolbar, Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import React, { useState } from 'react'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useTranslation } from 'react-i18next';
import Language from '../../../Component/dashboard/TopBar/Language';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from "../../../utils/constants"
import { deliveryFetchApi } from './Delivered';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectHeaderData } from '../../../store/client/deliveryOrderSlic';
export const DeliveredHeader = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const logedINUserDataString = localStorage.getItem("UserData")
    const logedINUserData = logedINUserDataString ? JSON.parse(logedINUserDataString) : null;
    const [anchorEl, setAnchorEl] = useState(null);
    const { totalDelivered, canceledOrders, deliveredOrders } = useSelector(selectHeaderData)
    const handlePopoverClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    // حالة الـ Switch الأول
    const [checkedAv, setCheckedAv] = useState(logedINUserData?.user?.status_rider === "Available");
    const [statusSwitchloading, setStatusSwitchloading] = useState(false);
    const changeDeliveryStatus = async () => {
        const token = localStorage.getItem('Token');

        if (!token) {
            toast.error("User not logged in");
            return;
        }
        setStatusSwitchloading(true)

        const data = {
            "status_rider": checkedAv ? "Busy" : "Available"
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        try {
            const res = await axios.post(`${BASE_URL}${deliveryFetchApi.action.changeStatus}`, data, { headers })
            if (res.data.success === true) {
                setCheckedAv(!checkedAv);

                localStorage.setItem("UserData", JSON.stringify({ ...logedINUserData, user: res.data.restaurant_staff }))

            }
        } catch (error) {
            console.log(error)
            toast.error(error)
        } finally {
            setStatusSwitchloading(false)
        }
    }
    const handleChangeAv = () => {

        changeDeliveryStatus();
    };


    // حالة الـ Switch الثاني
    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(!checked);
    };
    /// deatils
    const [showDetails, setShowDetails] = useState(false);
    const toggleDetails = () => setShowDetails((prev) => !prev);
    return (
        <Box>
            <AppBar position="static" style={{
                padding: "20px", backgroundColor: theme.palette.secondaryColor.main,
                boxShadow: 'none', borderRadius: "0px 0px 30px 30px",
                position: 'relative', height: "150px", overflow: 'hidden', float: "right"
            }}>
                <Box
                    sx={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '300px',
                        color: theme.palette.orangePrimary.main,
                        opacity: 0.2,
                        zIndex: 1,
                    }}
                >
                    <span class="icon-scooter" ></span>
                </Box>
                <Toolbar style={{ display: 'flex', justifyContent: "end" }}>
                    {/* boxes section ==> ----- Total Delivered Orders / Daily Delivered Orders /Daily Cancaled Orders -----  */}
                    <Grid container spacing={2} alignItems="center" justifyContent="end" sx={{ marginRight: "80px", display: { xs: 'none', md: 'flex', } }} >
                        <Grid item>
                            <Box
                                sx={{
                                    width: "160px",
                                    borderRadius: '10px',
                                    padding: "5px 0px",
                                    textAlign: "left",
                                    border: '2px solid #ef7d00',
                                }}
                            >
                                <Typography variant="subtitle2" color='white'
                                    sx={{ borderBottom: '2px solid #ef7d00', alignItems: "center", paddingLeft: "10px", fontSize: "10px" }}>
                                    {t("totalDeliveredOrders")}
                                </Typography>
                                <Typography variant="h3" sx={{ color: theme.palette.orangePrimary.main, paddingLeft: "10px" }}>
                                    {totalDelivered}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item>
                            <Box
                                sx={{
                                    width: "150px",
                                    padding: '5px 0px',
                                    textAlign: 'left',
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: '2px solid #ef7d00' }}>
                                    <Typography variant="subtitle2" sx={{ color: 'white', fontSize: "10px", }}>
                                        {t("dailyDeliveredOrders")}
                                    </Typography>
                                    <CalendarMonthIcon sx={{ fontSize: "15px" }} />
                                </Box>
                                <Typography variant="h3" color="limegreen">
                                    {deliveredOrders ? deliveredOrders : 0}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box
                                sx={{
                                    width: "150px",
                                    padding: '5px 0px',
                                    textAlign: 'left',
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: '2px solid #ef7d00' }}>
                                    <Typography variant="subtitle2" sx={{ color: 'white', fontSize: "10px", }}>
                                        {t("dailyCancaledOrders")}
                                    </Typography>
                                    <CalendarMonthIcon sx={{ fontSize: "15px" }} />
                                </Box>
                                <Typography variant="h3" color="#E02828">
                                    {canceledOrders ? canceledOrders : 0}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    {showDetails && <DayDeliveredDetails onClose={toggleDetails} totalDeliveredOrders={totalDelivered} canceledOrders={canceledOrders} deliveredOrders={deliveredOrders} />}
                    <Box
                        aria-describedby={id}
                        onClick={handlePopoverClick}
                        sx={{ display: "flex", alignItems: "center", gap: "3px", marginLeft: "10px", cursor: "pointer", position: 'relative', zIndex: 9 }}
                    >
                        <IconButton color="inherit" sx={{
                            backgroundColor: theme.palette.orangePrimary.main,
                            borderRadius: '38%',
                            padding: '5px',
                            '&:hover': {
                                backgroundColor: theme.palette.orangePrimary.main,
                            }
                        }}>
                            <PersonOutlinedIcon sx={{ color: "white" }} />
                        </IconButton>

                        <KeyboardArrowDownOutlinedIcon sx={{ fontSize: "20px", color: theme.palette.orangePrimary.main }} />
                    </Box>
                    {/* id,open,anchorEl,handlePopoverClose,theme,checked,handleChange,userData */}
                    <DS id={id} open={open} anchorEl={anchorEl} handlePopoverClose={handlePopoverClose} theme={theme} checked={checked} handleChange={handleChange} userData={{
                        phone: logedINUserData?.user.phone
                        , name: logedINUserData?.user.name
                    }} />

                </Toolbar>  {/*  top Bar  */}

                <Box sx={{ display: "flex", alignItems: "center", marginLeft: "50px", marginTop: "-20px", flexWrap: 'wrap', position: 'relative', zIndex: '99' }}>
                    <Button
                        onClick={toggleDetails}
                        sx={{ display: { sm: 'block', md: 'none' }, }}
                    >
                        {t('openStatus')}
                    </Button>


                    {

                        statusSwitchloading
                            ? (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: 'white',
                                        alignItems: "center"
                                    }}
                                />
                            ) : (<><Box >
                                {checkedAv ?
                                    <Typography sx={{ display: "flex", textAlign: "center", alignItems: "center" }} >
                                        <Box sx={{ width: "6px", height: "6px", backgroundColor: "#2FD35E", borderRadius: "50%", marginRight: "5px" }}></Box>
                                        <Typography variant="subtitle2" sx={{ color: "#2FD35E", marginRight: "15px" }}> {t("Available")}</Typography>
                                    </Typography>
                                    :
                                    <Typography sx={{ display: "flex", textAlign: "center", alignItems: "center" }}>
                                        <Box sx={{ width: "6px", height: "6px", backgroundColor: "#E02828", borderRadius: "50%", marginRight: "5px" }}></Box>
                                        <Typography variant="subtitle2" sx={{ color: "#E02828", marginRight: "15px" }}> {t("unAvailable")}</Typography>
                                    </Typography>
                                }
                            </Box><Switch defaultChecked
                                checked={checkedAv}
                                onChange={handleChangeAv}
                                sx={{
                                    width: 30,
                                    height: 17,
                                    padding: 0,
                                    display: 'flex',
                                    '& .MuiSwitch-switchBase': {
                                        padding: 0,
                                        '&.Mui-checked': {
                                            transform: 'translateX(15px)',
                                            color: '#fff',
                                            '& + .MuiSwitch-track': {
                                                opacity: 1,
                                                backgroundColor: '#E0E0E0',
                                            },
                                        },
                                    },
                                    '& .MuiSwitch-thumb': {
                                        width: 15,
                                        height: 15,
                                        boxShadow: 'none',
                                        color: theme.palette.orangePrimary.main,
                                    },
                                    '& .MuiSwitch-track': {
                                        borderRadius: 16 / 2,
                                        opacity: 1,
                                        backgroundColor: '#D3D3D3',
                                        height: 13,
                                    },
                                }}
                                /></>)}
                </Box>
            </AppBar>
        </Box>
    )
}




const DayDeliveredDetails = ({ onClose, totalDeliveredOrders, canceledOrders, deliveredOrders }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    return (
        <div
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9000,
                background: theme.palette.secondaryColor.main,
                padding: '1rem',
                borderRadius: "1rem"
            }}
        >
            <Box container spacing={2} alignItems="center" justifyContent="end" sx={{ marginRight: "80px" }} >
                <Grid item>
                    <Box
                        sx={{
                            width: "160px",
                            borderRadius: '10px',
                            padding: "5px 0px",
                            textAlign: "left",
                            border: '2px solid #ef7d00',
                        }}
                    >
                        <Typography variant="subtitle2" color='white'
                            sx={{ borderBottom: '2px solid #ef7d00', alignItems: "center", paddingLeft: "10px", fontSize: "10px" }}>
                            {t("totalDeliveredOrders")}
                        </Typography>
                        <Typography variant="h3" sx={{ color: theme.palette.orangePrimary.main, paddingLeft: "10px" }}>
                            {totalDeliveredOrders}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item>
                    <Box
                        sx={{
                            width: "150px",
                            padding: '5px 0px',
                            textAlign: 'left',
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: '2px solid #ef7d00' }}>
                            <Typography variant="subtitle2" sx={{ color: 'white', fontSize: "10px", }}>
                                {t("dailyDeliveredOrders")}
                            </Typography>
                            <CalendarMonthIcon sx={{ fontSize: "15px" }} />
                        </Box>
                        <Typography variant="h3" color="limegreen">
                            {deliveredOrders}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <Box
                        sx={{
                            width: "150px",
                            padding: '5px 0px',
                            textAlign: 'left',
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: '2px solid #ef7d00' }}>
                            <Typography variant="subtitle2" sx={{ color: 'white', fontSize: "10px", }}>
                                {t("dailyCancaledOrders")}
                            </Typography>
                            <CalendarMonthIcon sx={{ fontSize: "15px" }} />
                        </Box>
                        <Typography variant="h3" color="#E02828">
                            {canceledOrders}
                        </Typography>
                    </Box>
                </Grid>
            </Box>
            <Button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    minWidth: '30px',
                    padding: '0',
                }}
            >
                X
            </Button>
        </div>
    )
};
const DS = ({ id, open, anchorEl, handlePopoverClose, theme, checked, handleChange, userData }) => {
    return (<Popover disableScrollLock
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
    >
        <Box sx={{ width: 200 }}>
            <Box  sx={{ padding: '20px 0px 0px 20px', display: 'flex', alignItems: 'center', flexDirection: 'row', marginBottom: '20px', gap: '10px' }}>
                <Avatar sx={{ bgcolor: theme.palette.orangePrimary.main, width: 40, height: 40 }}>
                    <PersonOutlinedIcon sx={{ color: "white" }} />
                </Avatar>
                <Box>
                    <Typography variant="h6" sx={{ fontSize: "12px" }}>{userData?.name}</Typography>
                    <Typography variant="body2" sx={{ fontSize: "11px" }} color="textSecondary">{userData?.phone}</Typography>
                </Box>
            </Box>
            <Divider />

            <List sx={{ padding: "0px 5px" }}>
                <ListItem>
                    <Box style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>

                        <Box display="flex" alignItems="center" marginRight={"30px"}>
                            <LightModeOutlinedIcon sx={{ color: "#575756", fontSize: "18px", marginRight: "5px" }} />
                            <Switch defaultChecked
                                checked={checked}
                                onChange={handleChange}
                                sx={{
                                    width: 30,
                                    height: 17,
                                    padding: 0,
                                    display: 'flex',
                                    '& .MuiSwitch-switchBase': {
                                        padding: 0, // حجم الـ switch نفسه
                                        '&.Mui-checked': {
                                            transform: 'translateX(14px)',
                                            color: '#fff',
                                            '& + .MuiSwitch-track': {
                                                opacity: 1,
                                                backgroundColor: '#E0E0E0',
                                            },
                                        },
                                    },
                                    '& .MuiSwitch-thumb': {
                                        width: 15, // عرض الدائرة
                                        height: 15, // ارتفاع الدائرة
                                        boxShadow: 'none',
                                        color: theme.palette.orangePrimary.main,
                                    },
                                    '& .MuiSwitch-track': {
                                        borderRadius: 16 / 2,
                                        opacity: 1,
                                        backgroundColor: '#D3D3D3',
                                        height: 13, // ارتفاع الـ track
                                    },
                                }}
                            />
                            <BedtimeOutlinedIcon sx={{ color: "#575756", fontSize: "18px", marginLeft: "5px" }} />
                        </Box>

                        <Language />
                    </Box>
                </ListItem>


                <Divider />

                <ListItem sx={{ cursor: "pointer" }} onClick={handlePopoverClose}>
                    <ListItemIcon>
                        <span class="icon-messenger" style={{ fontSize: "18px", color: theme.palette.orangePrimary.main, }} ></span>
                    </ListItemIcon>
                    <ListItemText primary="Support"
                        primaryTypographyProps={{
                            sx: { color: '#575756', fontSize: '11px', marginLeft: "-20px" }
                        }} />
                </ListItem>
                <Divider />

                <ListItem sx={{ cursor: "pointer" }} onClick={handlePopoverClose}>
                    <ListItemIcon>
                        <img src="/assets/logout.svg" alt="icon" style={{ width: "16px", height: "16px" }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout"
                        primaryTypographyProps={{
                            sx: { color: '#575756', fontSize: '11px', marginLeft: "-20px" }
                        }} />
                </ListItem>
            </List>
        </Box>
    </Popover>)
}
