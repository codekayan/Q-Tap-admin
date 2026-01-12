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

export const AddRole = ({ open, onClose, onSave }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [role, setRole] = useState('');

    const [checkedItems, setCheckedItems] = useState({
        Dashboard: true,
        Orders: false,
        Wallet: false,
        Menu: false,
        Support: false,
        Users: false,
        'Customers Log': false,
        Setting: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheck = (name) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [name]: !prevState[name],
        }));
    };



    const handleSave = async () => {
        setIsSubmitting(true);
        if (!role) {
            toast.error(t('pleaseFillAllFields'));
            setIsSubmitting(false);
            return;
        }
        const roleData = {
            name: role,
            menu: checkedItems['Menu'] ? '1' : '0',
            users: checkedItems['Users'] ? '1' : '0',
            orders: checkedItems['Orders'] ? '1' : '0',
            wallet: checkedItems['Wallet'] ? '1' : '0',
            setting: checkedItems['Setting'] ? '1' : '0',
            support: checkedItems['Support'] ? '1' : '0',
            dashboard: checkedItems['Dashboard'] ? '1' : '0',
            customers_log: checkedItems['Customers Log'] ? '1' : '0',
            brunch_id: localStorage.getItem("selectedBranch"),
        };
        
        try {
            const token = localStorage.getItem('Token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };


            const roleResponse = await axios.post(`${BASE_URL}roles`, roleData, config);

            if (roleResponse.status === 200) {
                toast.success(t('add role success'));
                onClose();
            } else {
                toast.error(t('failed to add role'));
            }
        } catch (error) {
            console.error('API Error:', error);
            toast.error( (error.response?.data?.errors.name[0] || t('errorSavingUser')));
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
                        {t('Add Role')}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <span className="icon-close-1" style={{ fontSize: '15px', color: theme.palette.text.gray_light }} />
                    </IconButton>
                </Box>
                <Divider sx={{ backgroundColor: theme.palette.orangePrimary.main }} />



                <Box sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'flex-start' }}>
                    <Typography variant="body2" sx={{ width: '25%', textAlign: 'center' }} color={theme.palette.text.gray} fontSize="10px">
                        {t('role')}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <FormControl sx={{ width: '90%' }}>
                            <Select
                                sx={{
                                    '& .MuiInputBase-input': {
                                        height: '30px',
                                        padding: '1px 14px',
                                        textAlign: 'left',
                                        fontSize: '10px',
                                        color:theme.palette.text.gray_light,
                                        lineHeight: '30px',
                                    },
                                }}
                                fullWidth
                                displayEmpty
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="Select Role"
                            >
                                <MenuItem value="" disabled sx={{ fontSize: '10px', color: theme.palette.text.gray_light }}>
                                    {t('selectRole')}
                                </MenuItem>
                                <MenuItem value="chef" sx={{ fontSize: '10px', color: theme.palette.text.gray_light }}>
                                    {t('Chef')}
                                </MenuItem>
                                <MenuItem value="cashier" sx={{ fontSize: '10px', color: theme.palette.text.gray_light }}>
                                    {t('Cashier')}
                                </MenuItem>
                                <MenuItem value="waiter" sx={{ fontSize: '10px', color: theme.palette.text.gray_light }}>
                                    {t('Waiter')}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Grid container justifyContent="center" alignItems="center" spacing={2} width="100%" marginTop="10px" marginLeft="6%">
                    {iconsArray.map((item, index) => (
                        <Grid item xs={6} key={index}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkedItems[item.name]}
                                        onChange={() => handleCheck(item.name)}
                                        icon={<Box sx={{ border: '1px solid gray', width: '16px', height: '16px', borderRadius: '4px' }} />}
                                        checkedIcon={
                                            <Box
                                                sx={{
                                                    border: '1px solid #ef7d00',
                                                    backgroundColor: theme.palette.orangePrimary.main,
                                                    color: 'white',
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Typography variant="caption" sx={{ color: 'white' }}>
                                                    ✔
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{
                                            padding: '5px',
                                            '& .MuiSvgIcon-root': { fontSize: 18 },
                                        }}
                                    />
                                }
                                label={
                                    <Box display="flex" alignItems="center">
                                        <Typography>{item.icon}</Typography>
                                        <Typography variant="body2" sx={{ marginLeft: '6px', fontSize: '11px', color: theme.palette.text.gray_light }}>
                                            {t(item.name)}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </Grid>
                    ))}
                </Grid>

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
                        <CheckOutlinedIcon /> {isSubmitting ? t('loading...') : t('save')}
                    </Button>
                </Box>

                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover />
            </Box>
        </Modal>
    );
};