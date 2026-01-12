import React, { useState, useEffect } from "react";
import { Box, IconButton, MenuItem, Typography, Popover, Button, Menu, useTheme } from "@mui/material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Avatar, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import DarkModeSwitch from "../../../../Component/DarkModeSwitch";
import Language from "../../../../Component/dashboard/TopBar/Language";
import { useDispatch, useSelector } from "react-redux";
import { selectAllBranch, selectBranch, updateSelectedBranch } from "../../../../store/client/clientAdmin";
import { WEBSITE_SERVER_URL } from "../../../../utils/constants";
import { logout } from "../../../../api/Client/logout";
import { useAuthStore } from "../../../../store/zustand-store/authStore";

const styles = (theme) => ({
    button: {
        background: `linear-gradient(90deg, #E67D00,${theme.palette.secondaryColor.main} )`,//${theme.palette.secondaryColor.main}
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '130px',
    },
    menu: {
        marginTop: '10px',
        '& .MuiMenuItem-root': {
            display: 'flex',
            alignItems: 'center',
        },
        '& .MuiMenuItem-root svg': {
            marginRight: '8px',
        },
    },
});

export default function TopBar() {
    const { t } = useTranslation();
    const theme = useTheme();


    const pageTitles = {
        '/dashboard-client': t("dashboard"),
        '/order': t("order"),
        '/wallet-client': t("wallet"),
        '/menu': t("menu"),
        "/support-client": t("support"),
        '/user': t("user"),
        '/customers-log': t("customer"),
        "/setting-client": t("setting"),
        "/notification": t("notification"),
        "/feedback": t("feedback"),
        "/transaction":
            <IconButton onClick={() => navigate('/wallet-client')} >
                <ArrowBackIosIcon sx={{ fontSize: "23px", color: theme.palette.text.black_white }} />
            </IconButton>,
    };

    const navigate = useNavigate();
    const [mode, setMode] = useState('light');
    const [branch, setBranch] = useState(null);
    const lang = localStorage.getItem("i18nextLng")
    const branches = useSelector(selectAllBranch(0))
    // Load branches and selected branch from localStorage on component mount
    const selectedBranch = localStorage.getItem("selectedBranch")

    const {logout} = useAuthStore();
     
    useEffect(() => {
        const storedBranches = localStorage.getItem('branches');
        const storedSelectedBranch = localStorage.getItem('selectedBranch');
        if (storedBranches) {
            const parsedBranches = JSON.parse(storedBranches);

            // If no branch is selected, set the first one as default
            if (!storedSelectedBranch && parsedBranches.length > 0) {
                localStorage.setItem('selectedBranch', parsedBranches[0].id);
            } else if (storedSelectedBranch) {
            }
        }
    }, []);

    const handleToggleMode = () => {
        setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    const BranchOpen = (event) => {
        setBranch(event.currentTarget);
    };
    const dispatch = useDispatch()
    const BranchClose = (branchId, index) => {
        if (branchId) {
            // localStorage.setItem('selectedBranch', branchId);
            dispatch(updateSelectedBranch(branchId))
            localStorage.setItem('branchNumber', index)
        }
        setBranch(null);
    };

    // // Helper function to get branch name
    // const getCurrentBranchName = () => {
    //     if (!branches.length) return 'Branch 1';
    //     const currentBranch = branches.find(b => b.id === selectedBranch);
    //     const branchIndex = branches.findIndex(b => b.id === selectedBranch);
    //     return currentBranch ? `Branch ${branchIndex + 1}` : 'Branch 1';
    // };

    const handleToggle = (event) => {
        setMode(event.target.checked ? 'light' : 'dark');
    };

    const [anchorElUser, setAnchorElUser] = useState(null);
    const openUserPopover = Boolean(anchorElUser);

    const handleUserClick = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleUserClose = () => {
        setAnchorElUser(null);
    };

    const iconColor = mode === 'light' ? '#ff9800' : '#ff9800';
    const location = useLocation();

    const [isLocked, setIsLocked] = useState(true);

    const toggleIcon = () => {
        setIsLocked(!isLocked);
    };
    const clientName = localStorage.getItem("clientName")
    const clientEmail = localStorage.getItem("clientEmail")
    const Token = localStorage.getItem("Token")

    const url = `https://qutap.co/en?clientName=${encodeURIComponent(clientName)}&Token=${encodeURIComponent(Token)}&clientEmail=${encodeURIComponent(clientEmail)}`;

    
    return (
        <Box sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "30px 30px 0px 30px", flexWrap: 'wrap'
        }}>
            <Typography variant="body1" sx={{
                fontSize: "18px", color: theme.palette.text.black, width: "3%",
                borderBottom: `2px solid ${theme.palette.orangePrimary.main}`, width: 'fit-content'
            }}>
                {pageTitles[location.pathname] || 'Dashboard'}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: 'wrap' }}>

                <Button onClick={BranchOpen}
                    sx={{
                        ...styles(theme).button,
                        fontSize: "11px", borderRadius: "20px", color: "white",
                        textTransform: "capitalize", justifyContent: "center",
                    }}>
                    <span className="icon-store" style={{ fontSize: "15px", marginRight: "10px" }}></span>
                    {/* {getCurrentBranchName()} */}
                    <span >
                        {localStorage.getItem("branchNumber") ? `Branch ${parseInt(localStorage.getItem("branchNumber")) + 1}` : `Branch 1`}
                    </span>
                    <KeyboardArrowDownIcon sx={{ color: theme.palette.orangePrimary.main, fontSize: "16px" }} />
                </Button>

                <Menu disableScrollLock
                    anchorEl={branch}
                    open={Boolean(branch)}
                    onClose={() => BranchClose()}
                    MenuProps={{
                        disableScrollLock: true,

                    }}
                    PaperProps={{
                        style: {
                            maxHeight: 200,
                        },
                    }}
                    sx={{
                        '& .MuiPaper-root': {
                            width: "130px ",
                            borderRadius: '10px',
                        },
                    }}
                >
                    {branches.map((branch, index) => (
                        <React.Fragment key={branch.id}>
                            <MenuItem
                                onClick={() => BranchClose(branch.id, index)}
                                sx={{
                                    fontSize: "9px",
                                    color: "#949493",
                                    backgroundColor: selectedBranch === branch.id ? 'rgba(239, 125, 0, 0.1)' : 'transparent'
                                }}
                            >
                                <span className="icon-store" style={{ fontSize: "13px", marginRight: "5px" }}></span>
                                {`Branch ${index + 1}`}
                            </MenuItem>
                            {index < branches.length - 1 && (
                                <Divider sx={{ width: "80%", margin: "auto" }} />
                            )}
                        </React.Fragment>
                    ))}
                </Menu>

                <IconButton onClick={toggleIcon} sx={{ margin: "0 5px" }} >
                    {isLocked ? (
                        <img src="/assets/lock.svg" alt="lock icon" style={{ width: "22px", height: "22px" }} />
                    ) : (
                        <img src="/assets/unlock.svg" alt="lock icon" style={{ width: "22px", height: "22px" }} />
                    )}
                </IconButton>


                <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    <DarkModeSwitch />
                </Box>


                <IconButton sx={{ margin: "0 5px" }}>
                    <span class="icon-bell" style={{ color: theme.palette.orangePrimary.main }}></span>
                </IconButton>

                <Language />

                <Box
                    aria-describedby={openUserPopover ? 'simple-popover' : undefined}
                    onClick={handleUserClick}
                    sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
                    <IconButton color="inherit" sx={{
                        margin: "0 5px",
                        backgroundColor: theme.palette.orangePrimary.main, borderRadius: '30%', padding: '5px',
                        '&:hover': {
                            backgroundColor: theme.palette.orangePrimary.main,
                        }
                    }}>
                        <PersonOutlineOutlinedIcon sx={{ fontSize: "20px", color: "white" }} />
                    </IconButton>
                    <Typography variant="body1" sx={{ fontSize: "13px", color: "#575756" }}>{localStorage.getItem("clientName")}</Typography>
                    <KeyboardArrowDownIcon sx={{ fontSize: "18px", color: "#575756" }} />
                </Box>
                <Popover disableScrollLock
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
                                <Typography variant="h6" sx={{ fontSize: "14px" }}>{localStorage.getItem("UserName")}</Typography>
                                <Typography variant="body2" sx={{ fontSize: "12px" }} color="textSecondary">{localStorage.getItem("UserEmail")}</Typography>
                            </Box>
                        </Box>
                        <Divider />

                        <List sx={{}}>

                            <Box
                                onClick={() => {
                                    try {

                                        window.location.href = WEBSITE_SERVER_URL;
                                        handleUserClose();
                                    } catch (error) {
                                        console.error('Navigation failed:', error);
                                        alert('Failed to navigate to the home page. Please try again.');
                                    }
                                }}
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
                                    {t("home")}
                                </span>
                            </Box>

                            <ListItem sx={{ cursor: "pointer" }} onClick={() => {
                                handleUserClose()
                                navigate("/setting-client")
                            }}>
                                <ListItemIcon sx={{ marginLeft: lang == 'ar' ? "-30px" : '0px' }}>
                                    <img src="/assets/setting.svg" alt="icon" style={{ width: "16px", height: "16px" }} />
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
                                logout() // call logout api to delete the cookies
                                localStorage.removeItem("Token");
                                logout()
                                navigate('/');
                            }}>
                                <ListItemIcon sx={{ marginLeft: lang == 'ar' ? "-30px" : '0px' }}>
                                    <img src="/assets/logout.svg" alt="icon" style={{ width: "16px", height: "16px" }} />
                                </ListItemIcon>
                                <ListItemText

                                    primary="Logout"
                                    primaryTypographyProps={{
                                        sx: { color: '#5D5D5C', fontSize: '12px', marginLeft: lang == 'en' ? "-30px" : '', textAlign: lang == "ar" ? "start" : '' }
                                    }} />
                            </ListItem>
                        </List>
                    </Box>
                </Popover>


            </Box>

        </Box>
    );
}
