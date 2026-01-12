import React, { useState } from "react";
import { Grid, Button, IconButton, Typography, Switch, TextField, CircularProgress, } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, styled } from "@mui/system";
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Language from "../dashboard/TopBar/Language";

const ImageContainer = styled(Box)({
    backgroundImage: 'url(/images/logoClient.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    minHeight: "100vh",

    '::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(3px)',
        zIndex: 1,
        minHeight: '100vh',

    },
});

const TextOverlay = styled(Box)({
    textAlign: 'center',
    color: 'white',
    padding: '20px',
    zIndex: 2,
});

export const LoginKitchen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    

    return (
        <Grid item xs={12} md={6} sx={{ height: "100vh ", msOverflow: "hidden !important " }}>
            <ImageContainer >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        zIndex: '4',
                        padding: { xs: "10px 20px ", md: "30px" },
                        alignItems: "center", width: "90%"
                    }}
                >

                    <Box>
                        <IconButton onClick={() => navigate('/logo-cient')}>
                            <ArrowBackIosNewIcon sx={{ color: "white", fontSize: "22px" }} />
                        </IconButton>
                    </Box>

                    <Language />
                </Box>


                <TextOverlay sx={{ width: "90%", }}>
                    <Typography variant="h4" style={{ fontSize: "22px", color: "white" }}>
                        {t("busnessLogo")}
                    </Typography>

                    <Grid container spacing={4} justifyContent="center" marginTop={"50px"}>
                        <Grid item onClick={()=> navigate('/chef-login')} >
                            <img src="/assets/kitchen.svg" alt="" style={{ width: "110px", height: "110px" }} />
                            <Typography
                                style={{ color: "white", textAlign: "center", marginTop: "20px" }}
                            >
                                {t("chef")}
                            </Typography>
                        </Grid>
                        <Grid item onClick={()=> navigate('/waiter-login')}>
                            <img src="/assets/kitchen.svg" alt="" style={{ width: "110px", height: "110px" }} />
                            <Typography
                                style={{ color: "white", textAlign: "center", marginTop: "20px" }}
                            >
                                {t("waiter")}
                            </Typography>
                        </Grid>
                    </Grid>
                    
                    
                </TextOverlay>

                <Box sx={{ width: "90%", zIndex: "4", marginTop: "-30px" }}
                    display="flex" alignItems="center" justifyContent="space-between"  >
                    <Box >
                        <img src="/assets/qtapwhite.svg" alt="logo Qtap" style={{ width: "100px" }} />
                    </Box>
                    <Button
                        startIcon={<ModeCommentIcon sx={{ color: "#f47b2a" }} />}
                        style={{
                            color: "white",
                            textTransform: "capitalize",
                        }}
                    >
                        {t("help")}
                    </Button>
                </Box>

            </ImageContainer>
        </Grid >
    )
}
