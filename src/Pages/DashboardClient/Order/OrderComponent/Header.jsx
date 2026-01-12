import React, { useState } from 'react';
import { AppBar, IconButton, Typography, Box, ListItem, ListItemIcon, ListItemText, List, Divider, Avatar, Popover, Button } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router';
import { SendNotificationModel } from './SendNotificationModel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import RoomServiceOutlinedIcon from '@mui/icons-material/RoomServiceOutlined';
import { useTranslation } from 'react-i18next';


const ImageContainer = styled(Box)({
    backgroundImage: 'url(/images/header.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: "150px",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    '::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    zIndex: 1,
});

const Header = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState(null);
    const openUserPopover = Boolean(anchorElUser);

    const handleUserClick = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleUserClose = () => {
        setAnchorElUser(null);
    };
    const {t} = useTranslation();
    return (
        <ImageContainer>
            <AppBar position="static" style={{
                backgroundColor: 'transparent',
                padding: "0px 40px", zIndex: 3, boxShadow: 'none'
            }}>
                <Box sx={{ display: 'flex', alignItems: "center", justifyContent: 'space-between',margin:{xs:'3px 0px',md:'0px'} ,padding:{xs:'3px 0px',md:'0px'}}} >
                    <IconButton
                        onClick={() => { navigate('/dashboard-client'); }}
                        edge="start" color="inherit" aria-label="back">
                        <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
                    </IconButton>


                    <Box style={{ display: 'flex', alignItems: 'center' }} gap={1}  flexWrap={{ xs:'wrap',md:'nowrap' }}>
                        <Button
                            onClick={() => { navigate('/order-history'); }}
                            sx={{
                                backgroundImage: "linear-gradient(to right, #FDB914, #F2672E)",
                                borderRadius: "0px 10px 10px 10px ", padding: "3px 16px", textTransform: "none", color: "white", fontSize: "12px"
                            }}
                        >
                            <RoomServiceOutlinedIcon sx={{ fontSize: "18px", color: theme.palette.secondaryColor.main }} />
                            {t("addOrders")}
                        </Button>
                        
                        <IconButton
                            onClick={() => { navigate('/order-history'); }}
                            color="inherit"
                            aria-label="Orders History"
                            sx={{ fontSize: "12px" }}>
                            <span class="icon-history" style={{ color: theme.palette.orangePrimary.main, marginRight: "4px", fontSize: "16px" }} ></span>
                            {t("ordersHistory")}
                        </IconButton>


                        <>
                            <IconButton
                                onClick={handleClickOpen}
                                color="inherit" sx={{ fontSize: "12px" }}
                                aria-label="send notification">
                                <span class="icon-bell" style={{ color: theme.palette.orangePrimary.main, marginRight: "4px", fontSize: "16px" }} />
                                {t("sendNotification")}
                            </IconButton>
                            <SendNotificationModel open={open} handleClose={handleClose} />
                        </>

                        <IconButton color="inherit" sx={{ fontSize: "12px" }} aria-label="expand">
                            <span class="icon-expand" style={{ fontSize: "10px", marginRight: "5px", color: theme.palette.orangePrimary.main }}></span>
                            {t("expand")}
                        </IconButton>

                        <Box
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
                            <KeyboardArrowDownIcon sx={{ fontSize: "18px", color: theme.palette.orangePrimary.main }} />
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
                        </Popover>
                    </Box>
                </Box>

                <Typography variant="h6" sx={{
                    flexGrow: 1, fontSize: "20px",
                    textAlign: 'left', color: 'white', marginInlineStart: {xs:'0px',md:"100px"} ,marginBottom:{xs:'20px',md:'0px'}
                }}>
                   {t("liveOrders")}
                </Typography>
            </AppBar>
        </ImageContainer>

    );
};

export default Header;