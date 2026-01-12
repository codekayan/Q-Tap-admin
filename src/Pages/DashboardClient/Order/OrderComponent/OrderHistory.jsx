
import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, useTheme } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Avatar, Box, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Popover, Typography } from "@mui/material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useNavigate } from 'react-router';
import OrderTable from './OrderTable ';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { parseResponseOrderItem } from './OrderBody';
import { BASE_URL } from "../../../../utils/constants"

export const OrderHistory = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [anchorElUser, setAnchorElUser] = useState(null);
    const openUserPopover = Boolean(anchorElUser);
    const { t } = useTranslation();
    const [orders,setOrdera] = useState([])
    const handleUserClick = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleUserClose = () => {
        setAnchorElUser(null);
    };

    useEffect(() => {
        const getOrder = async () => {
            try {
                const loginclient = JSON.parse(localStorage.getItem('UserData'))
                const selectedBranch = localStorage.getItem('selectedBranch')
                if (! loginclient || loginclient.user.role !== "admin") {
                    toast.error("unauth")
                    return ;
                }
                    const res = await axios.get(`${BASE_URL}orders/${selectedBranch}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('Token')}`
                            },

                        }
                    )
                
                const parsedOrder = res.data.orders.map((item)=>parseResponseOrderItem(item))
                setOrdera(parsedOrder)
            } catch (error) {
                console.log('get order', error)
            }
        }

        getOrder()
    }, [])

    return (
        <Box sx={{ backgroundColor: "#f4f6fc" }}>

            <AppBar position="static" style={{ padding: "20px 20px", backgroundColor: theme.palette.secondaryColor.main, zIndex: 3, boxShadow: 'none' }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton
                        onClick={() => { navigate('/order'); }}
                        edge="start" color="inherit" aria-label="back">
                        <ArrowBackIosNewIcon sx={{ fontSize: "18px" }} />
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
                        <Typography variant="body1" sx={{ fontSize: "13px", color: "white" }}>Admin</Typography>
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

                </Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1, fontSize: "20px", textAlign: 'left', color: 'white', marginLeft: "100px" }}>
                    {t("ordersHistory")}
                </Typography>
            </AppBar>  {/*  top Bar  */}

            <OrderTable orders = {orders}/>
            <Box sx={{
                width: "100%", height: "15px", backgroundImage: "linear-gradient(to right, #FDB913, #F2672E)",
                position: "fixed", bottom: 0,
            }}></Box>
        </Box>
    )
}
