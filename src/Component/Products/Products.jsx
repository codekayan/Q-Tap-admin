import { Button, Grid, Typography } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import DoneIcon from '@mui/icons-material/Done';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants'
import { ReactComponent as MenuIcon } from '../../assets/menu.svg';
 
export const ProductCard = ({ handleCardClick, isSelected }) => {

    const { t } = useTranslation()
    const theme = useTheme();


    return <Box onClick={handleCardClick}
        sx={{
            position: 'relative',
            width: "180px", height: "250px",
            backgroundImage: "url(/images/card.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            borderRadius: "10px", margin: "30px", padding: "20px",
            overflow: "hidden"
        }}>
        {isSelected && (
            <DoneIcon
                sx={{
                    color: theme.palette.orangePrimary.main,
                    fontSize: "26px",
                    position: "relative",
                    top: "-10px",
                    right: "-15px",
                    float: "right",
                }}
            />
        )}
        <Box>

            <MenuIcon
                style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    color:"#FFF"
                }}
            />


            <MenuIcon
                style={{
                    width: "130px",
                    height: "130px",
                    objectFit: "cover",
                    position: "absolute",
                    bottom: "-10px",
                    right: '0',
                    opacity: '.1',
                    color:"#FFF",
                    clipPath: 'inset(0 40% 0 0)',
                    transform: "translateX(40%)",
                    
                }}
            />
        </Box>
        <Typography sx={{ fontSize: "18px", letterSpacing: ".2rem", color: "white" }}>{t("digitalMenu")}</Typography>
    </Box>
}
export const Products = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [isSelected, setIsSelected] = useState(false);
    const { t } = useTranslation()
    const handleCardClick = () => {
        setIsSelected(!isSelected);
    };
    const Divider = styled(Box)({
        width: '5%',
        height: '3px',
        backgroundColor: theme.palette.orangePrimary.main,
        borderRadius: "20px",
        marginBottom: "20px"
    });
    const handleNextClick = () => {
        if (isSelected) {
            navigate('/business-info');
        } else {
            toast.error(t("plSelectProduct"));
        }
    };
    const [menus, setMenus] = useState([]);

    const getMenus = async () => {
        try {

            const response = await axios.get(`${BASE_URL}products`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.products) {
                setMenus(response.data.products);
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    };
    useEffect(() => {
        getMenus();
    }, []);

    return (
        <Box marginTop={"50px"} padding={"50px"} flexGrow={1}>
            <Typography variant="body1" sx={{ fontSize: "18px" }}>
                {t("selectProduct")}
            </Typography>
            <Divider />

            {/* <Box onClick={handleCardClick}
                sx={{
                    position: 'relative',
                    width: "160px", height: "220px",
                    backgroundImage: "url(/images/card.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    borderRadius: "10px", margin: "30px", padding: "20px",
                    overflow: "hidden"
                }}>
                {isSelected && (
                    <DoneIcon
                        sx={{
                            color: theme.palette.orangePrimary.main,
                            fontSize: "26px",
                            position: "relative",
                            top: "-10px",
                            right: "-15px",
                            float: "right",
                        }}
                    />
                )}
                <span class="icon-waiter" style={{ color: "white", fontSize: "30px" }}></span>
                <Typography sx={{ fontSize: "18px", color: "white" }}>{t("digitalMenu")}</Typography>
                <span class="icon-waiter" style={{ color: "white", fontSize: "140px", opacity: .1, position: "absolute", top: "58%", left: '38%' }}></span>
            </Box> */}


            <ProductCard handleCardClick={handleCardClick} isSelected={isSelected} />

            <Grid item xs={12}>
                <Button
                    variant="contained"
                    sx={{
                        width: '20%',
                        fontSize: "13px",
                        borderRadius: '50px',
                        backgroundColor: theme.palette.orangePrimary.main,
                        textTransform: 'none',
                        padding: "6px 0",
                        position: "fixed", bottom: "30px",
                        insetInlineStart: "55%",
                        '&:hover': {
                            backgroundColor: theme.palette.orangePrimary.main,
                        },
                        color: "#fff"
                    }}
                    onClick={handleNextClick}
                >
                    {t("next")}
                    <TrendingFlatIcon sx={{ marginLeft: "8px", fontSize: "18px" }} />
                </Button>
            </Grid>
        </Box>
    )
}
