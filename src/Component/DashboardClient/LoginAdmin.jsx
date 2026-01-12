import React, { useState } from "react";
import { Grid, Button, IconButton, Typography, Switch, TextField, CircularProgress, } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, styled } from "@mui/system";
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Language from "../dashboard/TopBar/Language";
import { handleClientLoginRedux, selectIsLoading } from "../../store/client/userSlic";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/zustand-store/authStore";

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

export const LoginAdmin = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [pin, setPin] = useState()
    const isLoading = useSelector(selectIsLoading)

    const { login } = useAuthStore()

    const dispatch = useDispatch()
    const handleLogin = async () => {
        const data = { pin, role: 'admin', brunch_id: localStorage.getItem('selectedBranch') }
        dispatch(handleClientLoginRedux(data))
            .unwrap()
            .then((res) => {
                login(res.token, res.user, res.selected_brunch_id)
                if (sessionStorage.getItem("redirectBack") !== null && sessionStorage.getItem("redirectBack") !== "null" && sessionStorage.getItem("redirectBack") !== "") {
                    window.location.href =
                        `${sessionStorage.getItem("redirectBack")}` +
                        `?token=${localStorage.getItem("Token")}` +
                        `&name=${localStorage.getItem("UserName")}` +
                        `&email=${localStorage.getItem("UserEmail")}`;

                    sessionStorage.removeItem("redirectBack")
                } else {
                    navigate("/dashboard-client")
                }
            })
            .catch(() => {
                toast.error(t('loginFaild'));
                navigate('/');
            });
    }

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
                        <Grid item >
                            <img src="/assets/admin.svg" alt="" style={{ width: "110px", height: "110px" }} />
                            <Typography
                                style={{ color: "white", textAlign: "center", marginTop: "20px" }}
                            >
                                {t("admin")}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Grid item xs={12} md={4}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                style={{ gap: '20px', marginTop: "30px" }}
                            >
                                {/* Insert PIN Input */}
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    style={{
                                        border: '1px solid #fff',
                                        borderRadius: '40px',
                                        padding: '3px 15px',
                                        width: '48%',
                                        height: "35px",
                                    }}
                                >
                                    <span class="icon-padlock" style={{ fontSize: "18px", color: 'white', marginRight: '30px' }} />
                                    <TextField
                                        variant="outlined"
                                        placeholder={t("insertPin")}
                                        onChange={(e) => setPin(e.target.value)}
                                        InputProps={{
                                            style: {
                                                border: 'none',
                                                color: "white", fontSize: "12px"
                                            },
                                            disableUnderline: true,
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none',
                                                    color: "white"
                                                },
                                            },
                                        }}
                                    />
                                </Box>

                                {/* Login Button */}
                                <Button
                                    variant="contained"
                                    style={{
                                        background: 'linear-gradient(to left, #f47b2a, #f4b02a)',
                                        color: 'white',
                                        borderRadius: '25px',
                                        width: '40%',
                                        padding: '8px',
                                        fontSize: '13px',
                                        textTransform: 'none',
                                    }}
                                    onClick={() => handleLogin()}

                                >
                                    {isLoading ? <CircularProgress size={24} /> : t("logIn")}
                                </Button>

                                {/* Stay Logged In */}
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    style={{ gap: '2px', color: 'white' }}
                                >
                                    <Switch
                                        style={{
                                            color: '#f47b2a',
                                        }}
                                    />
                                    <Typography sx={{ fontSize: "12px" }} >{t("stayLogIn")}</Typography>
                                </Box>
                            </Box>
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
