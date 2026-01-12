import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, TextField, Paper, Button, useTheme } from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from "../../../../utils/constants"

const PaymentGatewayForm = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [apiKey, setApiKey] = useState('');
    const [token1, setToken1] = useState('');
    const [token2, setToken2] = useState('');
    const [iframe, setIframe] = useState('');

    const handleSave = async () => {
        if (apiKey === '' || token1 === '' || token2 === '' || iframe === '') {
            toast.error(t("plFillAllField"));
            return;
        }
        const formData = {
            API_KEY: apiKey,
            Token1: token1,
            Token2: token2,
            Ifram: iframe,
            brunch_id: localStorage.getItem("selectedBranch")
        }

        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("Token")}`
                },
                body: JSON.stringify(formData)
            }

            const response = await fetch(`${BASE_URL}payment`, options);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (response.ok) {
                toast.success(t("paymentGatwaySavedSucc"));
                setApiKey('');
                setToken1('');
                setToken2('');
                setIframe('');
            }

        } catch (error) {
            toast.error(error.message);
            console.error('Error:', error);
        }
    };


    return (
        <Paper elevation={3} style={{ padding: '20px 30px', borderRadius: "10px", marginTop: '16px' }}>
            <Box
                sx={{
                    maxWidth: '100%',
                    padding: "0px"
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: "left",
                        fontSize: "15px",
                        color: theme.palette.bodyColor.gray_white,
                        margin: "10px 0px 15px 0px"
                    }}
                >
                    {t("paymentGatway")}
                </Typography>

                <Divider
                    sx={{
                        backgroundColor: theme.palette.bodyColor.gray_white,
                        height: '1px',
                        margin: '8px 0px',
                    }}
                />
                <Box
                    sx={{
                        width: "90%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        margin: "0 auto"
                    }}>
                    <img
                        src="/images/Payment.png"
                        alt="Paymob Logo"
                        style={{
                            display: 'block',
                            margin: '20px auto',
                            textAlign: "center",
                            width: "180px"
                        }}
                    />
                    <Typography variant='body2' sx={{ fontSize: "11px", color: theme.palette.bodyColor.gray_white, marginBottom: "5px" }}>API_KEY</Typography>
                    <TextField
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{
                            marginBottom: '20px',
                            '& .MuiOutlinedInput-root': {
                                height: "35px",
                                borderRadius: "10px",
                            },
                            '& .MuiOutlinedInput-input': {
                                padding: "10px",
                            }
                        }}
                    />

                    <Typography variant='body2' sx={{ fontSize: "11px", color: theme.palette.bodyColor.gray_white, marginBottom: "5px" }}>Token1</Typography>
                    <TextField
                        value={token1}
                        onChange={(e) => setToken1(e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{
                            marginBottom: '20px',
                            '& .MuiOutlinedInput-root': {
                                height: "35px",
                                borderRadius: "10px",
                            },
                            '& .MuiOutlinedInput-input': {
                                padding: "10px",
                            }
                        }}
                    />

                    <Typography variant='body2' sx={{ fontSize: "11px", color: theme.palette.bodyColor.gray_white, marginBottom: "5px" }}>Token2</Typography>
                    <TextField
                        value={token2}
                        onChange={(e) => setToken2(e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{
                            marginBottom: '20px',
                            '& .MuiOutlinedInput-root': {
                                height: "35px",
                                borderRadius: "10px",
                            },
                            '& .MuiOutlinedInput-input': {
                                padding: "10px",
                            }
                        }}
                    />

                    <Typography variant='body2' sx={{ fontSize: "11px", color:theme.palette.bodyColor.gray_white, marginBottom: "5px" }}>Ifram</Typography>
                    <TextField
                        value={iframe}
                        onChange={(e) => setIframe(e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{
                            marginBottom: '20px',
                            '& .MuiOutlinedInput-root': {
                                height: "35px",
                                borderRadius: "10px",
                            },
                            '& .MuiOutlinedInput-input': {
                                padding: "10px",
                            }
                        }}
                    />
                    <Box textAlign="center" mt={2}>
                        <Button sx={{
                            fontSize: "13px", padding: "3px 50px",
                            borderRadius: "20px", backgroundColor: theme.palette.orangePrimary.main, color: "white", textTransform: "capitalize",
                            '&:hover': {
                                backgroundColor: "#ef7d16",
                            }
                        }}
                            onClick={handleSave}
                            startIcon={<CheckOutlinedIcon />}>{t("save")}</Button>
                    </Box>
                </Box>

            </Box>
        </Paper>
    );
};

export default PaymentGatewayForm;
