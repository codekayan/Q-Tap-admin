import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, IconButton, Divider, MenuItem, FormControl, Select, Button, Grid, Checkbox, FormControlLabel, useTheme } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL,BASE_URL_IMG } from "../../../../utils/constants";

const iconsArray = [
    { name: 'Dashboard', icon: <img src="/assets/dashboard.svg" alt="icon" style={{ width: "16px", height: "16px" }} /> },
    { name: 'Support', icon: <span class="icon-messenger" style={{ width: "34.539", height: "34.544" }}></span> },
    { name: 'Orders', icon: <span class="icon-shopping-bag" style={{ width: "34.539", height: "34.544" }}></span> },
    { name: 'Users', icon: <PersonOutlineOutlinedIcon sx={{ fontSize: "18px", color: "gray" }} /> },
    { name: 'Wallet', icon: <span class="icon-wallet1" style={{ width: "34.539", height: "34.544" }}></span> },
    { name: 'Customers Log', icon: <span class="icon-show"></span> },
    { name: 'Menu', icon: <img src="/assets/menu.svg" alt="menu icon" style={{ width: "17px", height: "17px" }} /> },
    { name: 'Setting', icon: <img src="/assets/setting.svg" alt="icon" style={{ width: "16px", height: "16px" }} /> },
];

export const AddUser = ({ open, onClose }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [pin, setPin] = useState(['', '', '', '', '', '']);

    const [isSubmitting, setIsSubmitting] = useState(false);



    const handlePinChange = (index, value) => {
        if (/^\d?$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);
            if (value && index < 5) {
                document.getElementById(`pin-input-${index + 1}`).focus();
            }
        }
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        const pinString = pin.join('');
        if (!name || pinString.length !== 6) {
            toast.error(t('pleaseFillAllFields'));
            setIsSubmitting(false);
            return;
        }

        const staffData = {
            name,
            pin: pinString,
            brunch_id: localStorage.getItem("selectedBranch"),
        };

        try {
            const token = localStorage.getItem('Token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };


            const response = await axios.post(`${BASE_URL}restaurant_user_staff`, staffData, config)

            
            if (response.data.success !== false) {
                if (response.status === 200) {
                    toast.success(t('add user success'));
                    onClose();
                } else {
                    toast.error(t('failed to add used'));
                }

            } else {
                if (response.data.errors) {
                    toast.error(t('pinAlreadyBeenTakend'));
                    // onClose();
                }
            }
        } catch (error) {
            console.error('API Error:', error);
            toast.error(t('errorSavingUser') + ': ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: 400,
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 24,
                    mx: 'auto',
                    mt: '10vh',
                    position: 'relative',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontSize: '13px', color: theme.palette.text.gray }}>
                        {t('userAdd')}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <span className="icon-close-1" style={{ fontSize: '15px', color: theme.palette.text.gray }} />
                    </IconButton>
                </Box>
                <Divider sx={{ backgroundColor: theme.palette.orangePrimary.main }} />

                <Box sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'left' }}>
                    <Typography variant="body2" sx={{ width: '22%', textAlign: 'center' }} color={theme.palette.text.gray_light} fontSize="10px">
                        {t('name')}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <TextField
                            sx={{
                                width: '90%',
                                '& .MuiInputBase-input': {
                                    height: '30px',
                                    padding: '0px 14px',
                                    textAlign: 'left',
                                    fontSize: '10px',
                                    color: 'gray',
                                },
                            }}
                            fullWidth
                            placeholder={t('tableName')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>
                </Box>

                <Box sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'flex-start' }}>
                    <Typography variant="body2" sx={{ width: '22%', textAlign: 'center' }} color={theme.palette.text.gray_light} fontSize="10px">
                        {t('pin')}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Grid container spacing={1} sx={{ width: '90%' }}>
                            {pin.map((digit, index) => (
                                <Grid item xs={2} key={index}>
                                    <TextField
                                        variant="outlined"
                                        value={digit}
                                        onChange={(e) => handlePinChange(index, e.target.value)}
                                        inputProps={{
                                            maxLength: 1,
                                            style: { textAlign: 'center', width: '14px', height: '6px' },
                                            id: `pin-input-${index}`,
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>


                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Button
                        variant="contained"
                        color="warning"
                        sx={{
                            mt: 4,
                            borderRadius: '20px',
                            height: '30px',
                            width: '50%',
                            textTransform: 'capitalize',
                        }}
                        onClick={handleSave}
                        disabled={isSubmitting}
                    >
                        <CheckOutlinedIcon /> {t('save')}
                    </Button>
                </Box>

                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover />
            </Box>
        </Modal>
    );
};