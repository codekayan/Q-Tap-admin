import React, { useState } from 'react';
import { Box, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { useTranslation } from 'react-i18next';
import { Menu, Close } from '@mui/icons-material';
import { BASE_URL_IMG } from "../../../utils/constants"

const SideBar = ({ setSelectedCategory, allMenuData, selectedCategory }) => {

    const theme = useTheme();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenSideBar = () => {
        setIsOpen(!isOpen);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    return (
        <>
            <Button
                sx={{
                    position: 'absolute',
                    display: { sm: 'none', xs: isOpen ? 'none' : 'block' },
                    zIndex: 1201,
                    top: '30px',
                    backgroundColor: 'red',
                    minWidth:'0px',
                    minHeight:'0px',
                    padding:'0'
                }}
                onClick={handleOpenSideBar}
            >
                <Menu />
            </Button>
            <Box className="fixHere"
            sx={{
                position: { xs: isOpen ? 'fixed' : 'relative', sm: 'fixed' },
                display: { xs: isOpen ? 'flex' : 'none', sm: 'flex'},
                flexDirection:'column',
                start: 0,
                top: 0,
                height: '100vh',
                overflowY: 'auto',
                zIndex: 1201,
                bgcolor:theme.palette.bodyColor.white_333,
                width: '100px'
            }}>
                <Button
                    sx={{
                        zIndex: 1201,
                        display: { sm: 'none', xs: 'block' },
                        alignItems: 'center',
                        marginX: 'auto'
                    }}
                    onClick={handleOpenSideBar}
                >
                    <Close />
                </Button>
                <Box sx={{ textAlign: "center", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                    <IconButton sx={{
                        backgroundColor: theme.palette.orangePrimary.main,
                        width: "40px",
                        height: "40px",
                        "&:hover": {
                            backgroundColor: theme.palette.orangePrimary.main,
                        }
                    }}>
                        <span className="icon-home" style={{ color: "white", fontSize: "20px" }}></span>
                    </IconButton>
                </Box>
                <Box sx={{
                    width: "100%",
                    height: "30px",
                    background: `linear-gradient(90deg, ${theme.palette.orangePrimary.main} 0%, #FE9E2F 100%)`,
                    display: "flex",
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Typography variant='body2' sx={{ fontSize: "10px", color: "white" }}>{t("categories")}</Typography>
                </Box>

                <List sx={{ padding: "10px 12px", }}>
                    {/* Popular Button */}
                    <ListItem
                        onClick={() => handleCategoryClick('Popular')}
                        sx={{
                            flexDirection: 'column',
                            background: selectedCategory === 'Popular' ? theme.palette.orangePrimary.main :theme.palette.bodyColor.white_lightBlack,
                            mb: 2,
                            paddingBottom: "5px",
                            width: "100%",
                            borderRadius: "20px",
                            cursor: "pointer",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <ListItemIcon sx={{
                            minWidth: 0,
                            display: 'flex',
                            backgroundColor: selectedCategory === 'Popular' ? 'white' : '',
                            padding: "5px",
                            borderRadius: "50%",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <span class="icon-fire" style={{ fontSize: "20px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>
                        </ListItemIcon>
                        <ListItemText
                            primary={t("Popular")}
                            primaryTypographyProps={{
                                sx: {
                                    fontSize: '8px',
                                    textAlign: 'center',
                                    color: selectedCategory === 'Popular' ? 'white' : 'white',
                                }
                            }}
                        />
                        <KeyboardArrowRightOutlinedIcon sx={{
                            color: selectedCategory === 'Popular' ? 'white' : theme.palette.orangePrimary.main,
                            fontSize: "10px",
                            borderRadius: "50%",
                            border: `1px solid ${selectedCategory === 'Popular' ? 'white' : theme.palette.orangePrimary.main}`
                        }} />
                    </ListItem>

                    {/* Dynamic Categories */}
                    {allMenuData?.map((item, index) => {
                        const isActive = selectedCategory === item.name;
                        return (
                            <ListItem
                                key={item.id}
                                onClick={() => handleCategoryClick(item.name)}
                                sx={{
                                    flexDirection: 'column',
                                    background: isActive ? theme.palette.orangePrimary.main : theme.palette.bodyColor.white_lightBlack ,
                                    mb: 2,
                                    paddingBottom: "5px",
                                    width: "100%",
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <ListItemIcon sx={{
                                    minWidth: 0,
                                    display: 'flex',
                                    backgroundColor: isActive ? 'white' : '',
                                    padding: "5px",
                                    borderRadius: "50%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <img
                                        src={`${BASE_URL_IMG}${item.image}`}
                                        alt={item.name}
                                        style={{ width: "20px", height: "20px" }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={t(item.name)}
                                    primaryTypographyProps={{
                                        sx: {
                                            fontSize: '8px',
                                            textAlign: 'center',
                                            color: isActive ? 'white' : 'black',
                                        }
                                    }}
                                />
                                <KeyboardArrowRightOutlinedIcon sx={{
                                    color: isActive ? 'white' : theme.palette.orangePrimary.main,
                                    fontSize: "10px",
                                    borderRadius: "50%",
                                    border: `1px solid ${isActive ? 'white' : theme.palette.orangePrimary.main}`
                                }} />
                            </ListItem>
                        );
                    })}
                </List>
                <img src="/images/qtap.PNG" alt="logo" style={{ width: "80%", paddingInlineStart: "12px", position: 'absolute', bottom: "20px" }} />
            </Box>
        </>
    );
};

export default SideBar;