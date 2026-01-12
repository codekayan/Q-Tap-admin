
import React, { useState } from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import SettingsIcon from '@mui/icons-material/Settings';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RoomServiceOutlinedIcon from '@mui/icons-material/RoomServiceOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import { useTranslation } from "react-i18next";
import { HandPlatter } from "lucide-react";
const Arr1 = [
    {
        text: "Dashboard",
        icon: <GridViewIcon style={{ fontSize: "18px", marginLeft: "-1px" }}></GridViewIcon>,
        path: "/dashboard-client"
    },

    {
        text: "Orders", icon: <span class="icon-shopping-bag-1" style={{ fontSize: "13px" }} />,
        path: "/order"
    },
    {
        text: "Wallet",
        icon: <span class="icon-wallet1" style={{ width: "34.539", height: "34.544" }}></span>,
        path: "/wallet-client",
    },
    {
        text: "Menu",
        icon: <RoomServiceOutlinedIcon style={{ fontSize: "22px", marginLeft: "-3px" }}></RoomServiceOutlinedIcon>,
        path: "/menu",
    },
    {
        text: "Support",
        icon: <span class="icon-messenger" style={{ width: "34.539", height: "34.544" }}></span>,
        path: "/support-client",
    },
    {
        text: "User | Staff",
        icon: <PersonOutlineIcon style={{ fontSize: "22px", marginLeft: "-4px" }}></PersonOutlineIcon>,
        path: "/user",
    },
    {
        text: "Customers Log",
        icon: <span class="icon-show"></span>,
        path: "/customers-log",
    },
    {
        text: "Setting",
        icon: <SettingsIcon style={{ fontSize: "18px", marginLeft: "-1px" }}></SettingsIcon>,
        path: "/setting-client",
    },
    {
        text: "Plan",
        icon: <HandPlatter size={"18px"} />,
        path: "/client-plan",
    },

];
const Arr2 = [
    {
        text: "Feedback",
        icon: <span class="icon-star" style={{
            background: 'linear-gradient(to right, #FDB913, #F2672E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        }}></span>,
        path: "/feedback"
    },
    {
        text: "Logout",
        icon: <img src="/assets/logout.svg" alt="icon" style={{ width: "16px", height: "16px" }} />,
        path: "/"
    },
    {
        text: "Help",
        icon: <img src="/assets/help.svg" alt="icon" style={{ width: "17px", height: "17px" }} />,
        path: "/help-client"
    },
];

export default function SideBar({ isOpen }) {
    const { t } = useTranslation();
    const lang = localStorage.getItem("i18nextLng")
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    return (
        <Box sx={{
            width: { xs: '60%', md: '200px' },
            backgroundColor: theme.palette.bodyColor.secandary,
            padding: '25px 20px',
            position: 'fixed',
            top: 0,
            insetInlineStart: 0,
            height: '100vh',
            zIndex: 998,
            display: { xs: isOpen ? 'block' : 'none', md: 'block' }
        }}>
            <Box sx={{ display: "felx", justifyContent: "center", textAlign: "center", alignItems: "center", marginTop: "18px" }}>
                <img src="/images/logoDash.jpg" alt="Logo" style={{ width: '110px' }} />
            </Box>

            <List >
                {Arr1.map((item, index) => (
                    <Tooltip
                        ListItem
                        key={index}
                        placement="left-start"
                    >
                        <Box sx={{ display: "block", marginTop: "10px" }}
                        >
                            <ListItemButton
                                sx={{
                                    position: "relative", // اجعل العنصر الأب نسبيًا
                                    justifyContent: "center",
                                    px: 2,
                                    py: .55,
                                    height: item.path === "/order" ? "28px" : "inherit",
                                    width: item.path === "/order" ? "70%" : "inherit",
                                    marginTop: item.path === "/order" ? "8px" : "0px",
                                    marginBottom: item.path === "/order" ? "10px" : "0px",
                                    marginLeft: item.path === "/order" ? "15px" : "0px",
                                    borderRadius: item.path === "/order" ? "20px 0px 20px 20px " : "0px",
                                    background: item.path === "/order"
                                        ? "linear-gradient(90deg, #FDB913, #F2682E)"
                                        : "inherit",
                                    color: item.path === "/order" ? "white" :
                                        location.pathname === item.path
                                            ? theme.palette.mode === "dark"
                                                ? grey[600]
                                                : theme.palette.orangePrimary.main
                                            : theme.palette.text.gray_white,
                                    // textAlign: item.path === "/order" ? "center" : "",
                                    '&:hover': {
                                        backgroundColor: item.path === "/order" ? theme.palette.orangePrimary.main : "inherit",
                                    },
                                }}
                                onClick={() => {
                                    if(localStorage.getItem("Token")){
                                        navigate(item.path);
                                    }else{
                                        navigate('/')
                                    }
                                }}
                            >
                                {/* الأيقونة */}
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        justifyContent: "center",
                                        marginRight: item.path === "/order" ? "3px" : "10px",
                                        color: item.path === "/order" ? "white" :
                                            location.pathname === item.path
                                                ? theme.palette.orangePrimary.main
                                                : theme.palette.text.gray_white,
                                        marginLeft: item.path === "/order" ? "10px" : "",
                                    }}
                                >
                                    {React.cloneElement(item.icon, {
                                        fontSize: "small",
                                        color: location.pathname === item.path ? theme.palette.orangePrimary.main : theme.palette.text.gray_white,
                                    })}
                                </ListItemIcon>

                                {/* النص */}
                                <ListItemText
                                    primary={t(item.text)}
                                    primaryTypographyProps={{ fontSize: "12px" }}
                                    sx={{
                                        color: item.path === "/order" ? "white" :
                                            location.pathname === item.path
                                                ? theme.palette.orangePrimary.main
                                                : theme.palette.text.gray_white,
                                        textAlign: lang == 'ar' ? "start" : '',
                                        marginRight: lang == 'ar' ? "10px" : ''
                                    }}
                                />

                                {/* النقطة الحمراء فقط عند مسار "/order" */}
                                {item.path === "/order" && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: -10,
                                            width: 8,
                                            height: 8,
                                            background: "linear-gradient(to right , red, blue)",
                                            borderRadius: "50%",

                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </Box>
                    </Tooltip>
                ))}
            </List>

            <List sx={{ marginTop: 'clamp(10px, 5vw, 10vh)' }}>
                {Arr2.map((item, index) => (
                    <Tooltip
                        ListItem
                        key={index}
                        placement="left-start"
                    >
                        <Box sx={{ display: "block" }}
                        >
                            <ListItemButton
                                sx={{
                                    justifyContent: "center",
                                    px: 2,
                                    color:
                                        location.pathname === item.path
                                            ? theme.palette.text.gray_white
                                            : "gray",

                                }}
                                onClick={() => {
                                    if (item.text === "Logout") {
                                        localStorage.removeItem("Token");
                                    }
                                    
                                    navigate(item.path);
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        justifyContent: "center",
                                        marginRight: "10px",
                                        color:
                                            location.pathname === item.path
                                                ? theme.palette.mode === "dark"
                                                    ? grey[50]
                                                    : "#ff9800"
                                                : "gray",
                                    }}
                                >
                                    {React.cloneElement(item.icon, { fontSize: "small" })}
                                </ListItemIcon>

                                <ListItemText
                                    primary={t(item.text)}
                                    primaryTypographyProps={{
                                        fontSize: "12px",
                                        style: {
                                            color: item.text.toLowerCase() === "help" ?
                                                "#D8E0E0" : theme.palette.text.gray_white,
                                            textAlign: lang == 'ar' ? "start" : '',
                                            marginRight: lang == 'ar' ? "10px" : ''
                                        }
                                    }}
                                />

                            </ListItemButton>

                        </Box>
                    </Tooltip>
                ))}
            </List>
        </Box>
    );
}