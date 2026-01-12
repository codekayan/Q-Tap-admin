import React, { useState } from "react";
import { Avatar, Box, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Popover, Typography, useTheme } from "@mui/material";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Switch from '@mui/material/Switch';
import { useLocation, useNavigate } from "react-router";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { useTranslation } from "react-i18next";
import DarkModeSwitch from "../../../../Component/DarkModeSwitch";
import UserOptions from "../../../../Component/UserOptions";
import Language from "../../../../Component/dashboard/TopBar/Language";


export default function TopBar() {
    const [mode, setMode] = useState('light');
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useTheme();
    const pageTitles = {
        '/dashboard-affiliate': t("Dashboard"),
        '/wallet-affiliate':
            <IconButton onClick={() => navigate('/dashboard-affiliate')} >
                <ArrowBackIosIcon sx={{ fontSize: "23px", color: "black" }} />
            </IconButton>,

    };
    const handleToggle = (event) => {
        setMode(event.target.checked ? 'light' : 'dark');
    };

    const handleToggleMode = () => {
        setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    const [anchorElUser, setAnchorElUser] = useState(null);
    const openUserPopover = Boolean(anchorElUser);

    const handleUserClick = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleUserClose = () => {
        setAnchorElUser(null);
    };


    const location = useLocation();
    return (
        <Box sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "30px 60px 0px 60px ",
        }}>
            <Typography variant="body1" sx={{ fontSize: "15px", color: theme.palette.secondaryColor.main }}>
                {pageTitles[location.pathname] || 'Dashboard'}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

                <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    <DarkModeSwitch />
                    <Language />
                    <UserOptions />
                </Box>

                {/* <Box
                    aria-describedby={openUserPopover ? 'simple-popover' : undefined}
                    onClick={handleUserClick}
                    sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
                    <IconButton color="inherit" sx={{
                        backgroundColor: theme.palette.orangePrimary.main, borderRadius: '30%', padding: '5px',
                        '&:hover': {
                            backgroundColor: theme.palette.orangePrimary.main,
                        }
                    }}>
                        <PersonOutlineOutlinedIcon sx={{ fontSize: "20px", color: "white" }} />
                    </IconButton>
                    <Typography variant="body1" sx={{ fontSize: "13px", color: "#575756" }}>User01</Typography>
                    <KeyboardArrowDownIcon sx={{ fontSize: "18px", color: "#575756" }} />
                </Box> */}
                {/* <Popover disableScrollLock
                    id={openUserPopover ? 'simple-popover' : undefined}
                    open={openUserPopover}
                    anchorEl={anchorElUser}
                    onClose={handleUserClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Box sx={{ width: 200, padding: '10px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', marginBottom: '20px', gap: '10px' }}>
                            <Avatar sx={{ bgcolor: theme.palette.orangePrimary.main, width: 40, height: 40 }}>
                                <PersonOutlineOutlinedIcon sx={{ fontSize: "22px" }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ fontSize: "14px" }}>User01</Typography>
                                <Typography variant="body2" sx={{ fontSize: "12px" }} color="textSecondary">Mail@mail.com</Typography>
                            </Box>
                        </Box>
                        <Divider />

                        <List>
                            <Box
                                onClick={() => navigate('/')}
                                sx={{
                                    cursor: "pointer",
                                    backgroundColor: theme.palette.secondaryColor.main,
                                    color: "white",
                                    marginBottom: "10px",
                                    borderRadius: "30px",
                                    display: "flex",
                                    alignItems: "center",
                                    textAlign: "center",
                                    justifyContent: "center",
                                    width: "80%",
                                    padding: "5px 0px",
                                    margin: "0 auto",
                                }}>

                                <span class="icon-home-icon-silhouette" style={{ color: theme.palette.orangePrimary.main, marginRight: "5px", fontSize: "15px" }} ></span>
                                <span style={{ color: "white", fontSize: "12px", textTransform: "capitalize" }}>
                                    Home
                                </span>
                            </Box>

                            <ListItem sx={{ cursor: "pointer" }} oonClick={handleUserClose}>
                                <ListItemIcon>
                                    <img src="/assets/setting.svg" alt="icon" style={{ width: "16px", height: "16px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Edit Profile"
                                    primaryTypographyProps={{
                                        sx: { color: '#5D5D5C', fontSize: '12px', marginLeft: "-30px" }
                                    }} />
                            </ListItem>

                            <ListItem sx={{ cursor: "pointer" }} onClick={handleUserClose}>
                                <ListItemIcon>
                                    <span class="icon-price-tag" style={{ fontSize: "20px" }}></span>
                                </ListItemIcon>
                                <ListItemText primary="My Subscription"
                                    primaryTypographyProps={{
                                        sx: { color: '#5D5D5C', fontSize: '12px', marginLeft: "-30px" }
                                    }} />
                            </ListItem>

                            <ListItem sx={{ cursor: "pointer" }} onClick={handleUserClose}>
                                <ListItemIcon>
                                    <HelpOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
                                </ListItemIcon>
                                <ListItemText primary="FAQ"
                                    primaryTypographyProps={{
                                        sx: { color: '#5D5D5C', fontSize: '12px', marginLeft: "-30px" }
                                    }} />
                            </ListItem>

                            <ListItem sx={{ cursor: "pointer" }} onClick={handleUserClose}>
                                <ListItemIcon>
                                    <img src="/assets/logout.svg" alt="icon" style={{ width: "16px", height: "16px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Logout"
                                    primaryTypographyProps={{
                                        sx: { color: '#5D5D5C', fontSize: '12px', marginLeft: "-30px" }
                                    }} />
                            </ListItem>
                        </List>
                    </Box>
                </Popover> */}

            </Box>
        </Box>
    );
}
