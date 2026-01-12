import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import {BASE_URL} from '../../utils/constants'

export const PasswordReset = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState(''); // Fixed: Initialize as string
    const [confirmPassword, setConfirmPassword] = useState(''); // Fixed: Initialize as string
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSend = async () => {
        try {
            // Validate inputs
            if (password === '' || confirmPassword === '' || otp === '') {
                toast.error(t('pleaseEnterAllData'));
                return;
            }

            if (password !== confirmPassword) {
                toast.error(t('passwordsDoNotMatch'));
                return;
            }

            const data = {
                password,
                password_confirmation: confirmPassword,
                otp,
                user_type: 'qtap_clients', // qtap_affiliate or qtap_clients
            };

            setIsLoading(true);

            const response = await axios.post(`${BASE_URL}resetpassword`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            if (response.data.status === true) {
                toast.success(t('passwordChangedSuccess'));
                navigate('/');
            }
        } catch (error) {
            console.error('Error sending data:', error);
            toast.error(t('failedToResetPassword'));
        } finally {
            setIsLoading(false);
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
                    width: { lg: '88%', md: '50%', xs: '50%' },
                    marginBottom: 5,
                }}
            />

            <Typography
                variant="body1"
                sx={{ color: '#AAAAAA', width: '58%', marginBottom: 4, fontSize: '12px', textAlign: 'center' }}
            >
                {t('enterResetPass')}
            </Typography>

            <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: '95%', maxWidth: 400 }}>
                <FormControl sx={{ width: '100%', mb: 2 }} variant="outlined">
                    <OutlinedInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        startAdornment={
                            <InputAdornment position="start">
                                <LockOutlinedIcon sx={{ fontSize: '18px' }} />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <VisibilityOffOutlinedIcon sx={{ fontSize: '18px' }} />
                                    ) : (
                                        <VisibilityOutlinedIcon sx={{ fontSize: '18px' }} />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                        placeholder={t('newPassword')}
                        sx={{ fontSize: '10px', borderRadius: '50px', height: '35px' }}
                    />
                </FormControl>

                <FormControl sx={{ width: '100%', mb: 2 }} variant="outlined">
                    <OutlinedInput
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        startAdornment={
                            <InputAdornment position="start">
                                <LockOutlinedIcon sx={{ fontSize: '18px' }} />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle confirm password visibility"
                                    onClick={handleClickShowConfirmPassword}
                                    edge="end"
                                >
                                    {showConfirmPassword ? (
                                        <VisibilityOffOutlinedIcon sx={{ fontSize: '18px' }} />
                                    ) : (
                                        <VisibilityOutlinedIcon sx={{ fontSize: '18px' }} />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                        placeholder={t('confirmPass')}
                        sx={{ fontSize: '10px', borderRadius: '50px', height: '35px' }}
                    />
                </FormControl>

                <FormControl sx={{ width: '100%', mb: 2 }} variant="outlined">
                    <OutlinedInput
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        id="otp"
                        type="text" // OTP is typically text
                        placeholder={t('otp')}
                        sx={{ fontSize: '12px', borderRadius: '50px', height: '35px' }}
                        inputProps={{ pattern: '[0-9]*', inputMode: 'numeric' }} // Restrict to numeric input
                    />
                </FormControl>

                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        mt: 3,
                        borderRadius: '50px',
                        backgroundColor: theme.palette.bluePrimary.main,
                        textTransform: 'none',
                        fontSize: '12px',
                        height: '35px',
                        '&:hover': {
                            backgroundColor: theme.palette.secondaryColor.main,
                        },
                        color: '#fff',
                    }}
                    onClick={handleSend}
                    disabled={isLoading}
                >
                    {isLoading ? t('saving') : t('save')}
                </Button>
            </Box>
        </Box>
    );
};