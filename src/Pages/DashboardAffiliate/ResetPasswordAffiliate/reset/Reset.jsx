import { Box, Button, InputAdornment, TextField, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from "../../../../utils/constants";

export const Reset = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added for loading state

    const handleSend = async () => {
        try {
            if (email === '') {
                toast.error('Please enter your email');
                return; // Stop execution if email is empty
            }

            const data = {
                email: email,
                user_type: 'qtap_affiliate', // qtap_affiliate or qtap_clients
            };

            setIsLoading(true); // Set loading state

            const response = await axios.post(`${BASE_URL}sendOTP`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            if (response.data.status === true) {

                toast.success('Email sent successfully check your email');
                navigate('/receive-code-affiliate');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error('Failed to send email. Please try again.');
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{
                padding: 2,
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    fontSize: '13px',
                    color: theme.palette.secondaryColor.main,
                    margin: '50px 0px 8px 0px',
                    letterSpacing: '12px',
                    fontFamily: 'serif',
                }}
            >
                {t('resetPassword')}
            </Typography>

            <Box
                sx={{
                    borderBottom: `3px solid ${theme.palette.orangePrimary.main}`,
                    width: { lg: '85%', md: '50%', xs: '50%' },
                    marginBottom: 5,
                }}
            />

            <Typography
                variant="body1"
                sx={{ color: '#AAAAAA', width: '58%', marginBottom: 4, fontSize: '12px', textAlign: 'center' }}
            >
                {t('resetPassReciveInstructions')}
            </Typography>

            <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                placeholder={t('email')}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <MarkunreadOutlinedIcon sx={{ fontSize: '16px' }} />
                        </InputAdornment>
                    ),
                    sx: {
                        border: '1px solid gray',
                        height: '35px',
                        fontSize: '10px',
                        borderRadius: '50px',
                        '& fieldset': { border: 'none' },
                    },
                }}
                sx={{ marginBottom: 2, maxWidth: 400 }}
            />

            <Button
                variant="contained"
                fullWidth
                sx={{
                    maxWidth: 400,
                    borderRadius: '50px',
                    backgroundColor: theme.palette.bluePrimary.main,
                    textTransform: 'none',
                    padding: '8px 0',
                    fontSize: '12px',
                    '&:hover': {
                        backgroundColor: theme.palette.secondaryColor.main,
                    },
                    color: '#fff',
                }}
                endIcon={<ArrowRightOutlinedIcon sx={{ color: 'white', fontSize: '18px' }} />}
                onClick={handleSend}
                disabled={isLoading} // Disable button during loading
            >
                {isLoading ? 'Sending...' : t('send')}
            </Button>
        </Box>
    );
};