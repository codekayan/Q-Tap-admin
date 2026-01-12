import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Box, Typography, Divider, TextField, Paper } from '@mui/material';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {BASE_URL} from  "../../utils/constants";
import { useTheme } from '@mui/system';

const PaymentGatewayForm = forwardRef((props, ref) => {
    const [apiKey, setApiKey] = useState('');
    const [token1, setToken1] = useState('');
    const [token2, setToken2] = useState('');
    const [iframe, setIframe] = useState('');

    const handleSave = async () => {
        if (apiKey === '' || token1 === '' || token2 === '' || iframe === '') {
            toast.error("Please fill all fields");
            return;
        }
        const formData = {
            API_KEY: apiKey,
            IFRAME_ID: token1,
            INTEGRATION_ID: token2,
            HMAC: iframe,
        }
        // console.log("response ftr", formData);

        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
                },
                body: JSON.stringify(formData)
            }

            const response = await fetch(`${BASE_URL}settings/payment`, options);
            // console.log("response payment", response);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (response.ok) {
                toast.success("Payment Gateway Saved Successfully");
                setApiKey('');
                setToken1('');
                setToken2('');
                setIframe('');
            }
            // console.log("data", data);

        } catch (error) {
            toast.error(error.message);
            console.error('Error:', error);
        }
    };

    useImperativeHandle(ref, () => ({
        savePayment: handleSave,
    }));
    const {t} = useTranslation()
    const theme = useTheme();
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
                        color: theme.palette.text.gray,
                        margin: "10px 0px 15px 0px"
                    }}
                >
                    {t("paymentGateway")}
                </Typography>

                <Divider
                    sx={{
                        backgroundColor: 'gray',
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
                        src={
                            localStorage.getItem("themeMode") !== null
                                ? (localStorage.getItem("themeMode") === "dark"
                                    ? "/assets/icons/icons/paymob.svg"
                                    : "/assets/paymob.svg")
                                : "/assets/icons/icons/paymob.svg"
                        }
                        alt="Paymob Logo"
                        style={{
                            display: 'block',
                            margin: '20px auto',
                            textAlign: "center",
                            width: "180px"
                        }}
                    />
                    <Typography variant='body2' sx={{ fontSize: "11px", color: "#4b4a4a", marginBottom: "5px" }}>API_KEY</Typography>
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

                    <Typography variant='body2' sx={{ fontSize: "11px", color: "#4b4a4a", marginBottom: "5px" }}>Token1</Typography>
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

                    <Typography variant='body2' sx={{ fontSize: "11px", color: "#4b4a4a", marginBottom: "5px" }}>Token2</Typography>
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

                    <Typography variant='body2' sx={{ fontSize: "11px", color: "#4b4a4a", marginBottom: "5px" }}>Ifram</Typography>
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
                </Box>

            </Box>
        </Paper>
    );
});

export default PaymentGatewayForm;
