import React, { useState } from 'react'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { Avatar, Box, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Popover, Typography, useTheme } from "@mui/material";

import { useNavigate } from 'react-router';
import { Edit, Logout, Settings } from '@mui/icons-material';



const UserOptions = ({ customSX = {} }) => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const openUserPopover = Boolean(anchorElUser);
    const lang = localStorage.getItem("i18nextLng")

    const handleUserClick = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleUserClose = () => {
        setAnchorElUser(null);
    };
    const navigate = useNavigate();
    const theme = useTheme();
    return (
        <><Box
            aria-describedby={openUserPopover ? 'simple-popover' : undefined}
            onClick={handleUserClick}
            sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", ...customSX, }}>
            <IconButton color="inherit" sx={{
                backgroundColor: theme.palette.orangePrimary.main, borderRadius: '30%', padding: '5px',
                '&:hover': {
                    backgroundColor: theme.palette.orangePrimary.main,
                }
            }}>
                <PersonOutlineOutlinedIcon sx={{ fontSize: "20px", color: "white" }} />
            </IconButton>
            <Typography variant="body1" sx={{ fontSize: "13px", color: theme.palette.text.gray, marginLeft: "3px" }}>{localStorage.getItem('userName')}</Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: "18px", color: theme.palette.text.gray }} />
        </Box>
            <Popover
                id={openUserPopover ? 'simple-popover' : undefined}
                open={openUserPopover}
                anchorEl={anchorElUser}
                onClose={handleUserClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ width: 200, padding: '20px 10px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', marginBottom: '20px', gap: '10px' }}>
                        <Avatar sx={{ bgcolor: theme.palette.orangePrimary.main, width: 40, height: 40 }}>
                            <PersonOutlineOutlinedIcon sx={{ fontSize: "22px" }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontSize: "14px" }}>{localStorage.getItem('userName')}</Typography>
                            <Typography variant="body2" sx={{ fontSize: "12px" }} color="textSecondary">{localStorage.getItem('userEmail')}</Typography>
                        </Box>
                    </Box>
                    <Divider sx={{ marginBottom: "10px" }} />

                    <List >
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
                            <ListItemIcon sx={{ marginLeft: lang == 'ar' ? "-30px" : '0px' }}>
                                <Settings style={{ fontSize: "20px" }} />
                            </ListItemIcon>
                            <ListItemText primary="Edit Profile"
                                primaryTypographyProps={{
                                    sx: { color: '#5D5D5C', fontSize: '12px', marginLeft: lang == 'en' ? "-30px" : '', textAlign: lang == "ar" ? "start" : '' }
                                }} />
                        </ListItem>

                        <ListItem sx={{ cursor: "pointer" }} onClick={handleUserClose}>
                            <ListItemIcon sx={{ marginLeft: lang == 'ar' ? "-30px" : '0px' }}>
                                <span class="icon-price-tag" style={{ fontSize: "20px" }}></span>
                            </ListItemIcon>
                            <ListItemText primary="My Subscription"
                                primaryTypographyProps={{
                                    sx: { color: '#5D5D5C', fontSize: '12px', marginLeft: lang == 'en' ? "-30px" : '', textAlign: lang == "ar" ? "start" : '' }
                                }} />
                        </ListItem>

                        <ListItem sx={{ cursor: "pointer" }} onClick={handleUserClose}>
                            <ListItemIcon sx={{ marginLeft: lang == 'ar' ? "-30px" : '0px' }}>
                                <HelpOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
                            </ListItemIcon>
                            <ListItemText primary="FAQ"
                                primaryTypographyProps={{
                                    sx: { color: '#5D5D5C', fontSize: '12px', marginLeft: lang == 'en' ? "-30px" : '', textAlign: lang == "ar" ? "start" : '' }
                                }} />
                        </ListItem>

                        <ListItem sx={{ cursor: "pointer" }} onClick={() => {
                            localStorage.removeItem("adminToken");
                            localStorage.removeItem("affiliateToken");
                            navigate('/');
                        }}>
                            <ListItemIcon sx={{ marginLeft: lang == 'ar' ? "-30px" : '0px' }}>
                                <Logout style={{ fontSize: "20px" }} />
                            </ListItemIcon>
                            <ListItemText primary="Logout"
                                primaryTypographyProps={{
                                    sx: { color: '#5D5D5C', fontSize: '12px', marginLeft: lang == 'en' ? "-30px" : '', textAlign: lang == "ar" ? "start" : '' }
                                }} />
                        </ListItem>
                    </List>
                </Box>
            </Popover></>
    )
}

export default UserOptions