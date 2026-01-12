import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Modal, IconButton, Divider, MenuItem, useTheme } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import { BASE_URL, BASE_URL_IMG } from "../../utils/constants";
import axios from 'axios';

const AddBundle = ({ open, onClose, editData = null, refetch }) => {
    const [text, setText] = useState('');
    const [features, setFeatures] = useState([]);
    const [bundleName, setBundleName] = useState('');
    const [monthlyPrice, setMonthlyPrice] = useState('');
    const [yearlyPrice, setYearlyPrice] = useState('');
    const [description, setDescription] = useState('');
    const [orderLimit, setOrderLimit] = useState('unlimited');
    const [numberOfOrders, setNumberOfOrders] = useState(0);
    const theme = useTheme();
    console.log(editData)
    const { t } = useTranslation()
    // Populate form when editing
    useEffect(() => {
        if (editData) {
            setBundleName(editData.name || '');
            setMonthlyPrice(editData.monthly_price || '');
            setYearlyPrice(editData.yearly_price || '');
            setDescription(editData.description || '');
            setFeatures(JSON.parse(editData.feature) || []);
        }
    }, [editData]);

    const handleAddFeature = () => {
        if (text.trim()) {
            setFeatures((prevFeatures) => [...prevFeatures, text]);
            setText('');
        }
    };

    const handleSave = () => {
        const token = localStorage.getItem('adminToken');

        const bundleData = {
            name: bundleName,
            monthly_price: parseFloat(monthlyPrice),
            yearly_price: parseFloat(yearlyPrice),
            description: description,
            feature: features,
            is_active: "active",
            orders_limit: Number(numberOfOrders)
        };

        const url = editData
            ? `${BASE_URL}pricing/${editData.id}`
            : `${BASE_URL}pricing`;

        const method = editData ? 'put' : 'post';

        axios({
            method: method,
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: bundleData
        })
            .then(async response => {
                console.log(response)
                return response;
            })
            .then(data => {
                toast.success(editData ? t("bundleUpdateSucc") : t("bundleCreateSucc"));
                refetch();
                onClose();
            })
            .catch(error => {
                console.error('Error saving bundle:', error);
                toast.error(t("plFillAllField"));
            });
    };

    return (
        <Box>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="add-bundle-modal"
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box
                    sx={{
                        width: "60%",
                        bgcolor: 'background.paper',
                        padding: "20px 30px",
                        position: 'relative',
                        boxShadow: 24,
                        borderRadius: "20px",
                    }}
                >
                    <Box display={"flex"} justifyContent={"space-between"} textAlign={"center"} alignItems={"center"}>
                        <Typography variant="body2" sx={{ color: theme.palette.text.gray, fontSize: "14px" }}  >
                            {t("newBundle")}
                        </Typography>
                        <IconButton onClick={onClose} >
                            <span class="icon-close-1" style={{ fontSize: "15px" }}></span>
                        </IconButton>
                    </Box>
                    <Divider />

                    <Box sx={{ display: 'flex', gap: '50px', p: "20px 50px" }}>
                        <Box sx={{ flex: 1 }}>

                            <Typography variant='body2' sx={{ marginBottom: "4px", fontSize: "10px", color: theme.palette.text.gray }}>{t("name")}</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={bundleName}
                                onChange={(e) => setBundleName(e.target.value)}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    sx: {
                                        borderRadius: "20px",
                                        height: "30px", fontSize: "11px", color: "gray",
                                    }
                                }}
                            />

                            <Typography variant='body2' sx={{ marginBottom: "4px", fontSize: "10px", color: theme.palette.text.gray }}>{t("price.one")}</Typography>
                            <Box sx={{ display: 'flex', gap: '5px', mb: 2, alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type='number'
                                    value={monthlyPrice}
                                    onChange={(e) => setMonthlyPrice(e.target.value)}
                                    InputProps={{
                                        sx: {
                                            borderRadius: "20px",
                                            height: "30px",
                                            fontSize: "11px",
                                            color: "gray",
                                            flexGrow: 1,
                                        }
                                    }}
                                />
                                <Typography variant='body2' sx={{ fontSize: "8px", color: "gray", whiteSpace: "nowrap" }}>
                                    {t("perMonth")}
                                </Typography>

                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type='number'
                                    value={yearlyPrice}
                                    onChange={(e) => setYearlyPrice(e.target.value)}
                                    InputProps={{
                                        sx: {
                                            borderRadius: "20px",
                                            height: "30px",
                                            fontSize: "12px",
                                            color: "gray",
                                            flexGrow: 1,
                                        }
                                    }}
                                />
                                <Typography variant='body2' sx={{ fontSize: "8px", color: "gray", whiteSpace: "nowrap" }}>
                                    {t("perYear")}
                                </Typography>
                            </Box>

                            <Typography variant='body2' sx={{ marginBottom: "4px", fontSize: "10px", color: theme.palette.text.gray }}>{t("discription")}</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    sx: {
                                        borderRadius: "20px",
                                        fontSize: "11px",
                                        color: "gray",
                                    }
                                }}
                            />
                            <Typography variant='body2' sx={{ marginBottom: "4px", fontSize: "10px", color: theme.palette.text.gray }}>{t("ordersLimit")}</Typography>

                            <TextField
                                select
                                fullWidth
                                value={orderLimit}
                                onChange={(e) => setOrderLimit(e.target.value)}
                                InputProps={{
                                    sx: {
                                        borderRadius: "20px",
                                        fontSize: "11px",
                                        color: "gray",
                                        height: "30px",
                                    }
                                }}
                            >
                                <MenuItem value="unlimited" sx={{ fontSize: "11px", color: "gray", padding: "3px 10px" }}>{t("Unlimited")}</MenuItem>
                                <Divider sx={{ width: "90%", marginLeft: "10px" }} />
                                <MenuItem value="specific" sx={{ fontSize: "11px", color: "gray", padding: "3px 10px" }}>{t("specificNumber")}</MenuItem>
                            </TextField>
                            {orderLimit === "specific" &&
                                <>
                                    <Typography variant='body2' sx={{ marginTop: "4px", fontSize: "10px", color: theme.palette.text.gray }}>{t("numberOfOrders")}</Typography>
                                    <TextField
                                        fullWidth
                                        value={numberOfOrders}
                                        onChange={(e) => setNumberOfOrders(e.target.value)}
                                        InputProps={{
                                            sx: {
                                                marginTop: "10px",
                                                borderRadius: "20px",
                                                fontSize: "11px",
                                                color: "gray",
                                                height: "30px",
                                            }
                                        }}
                                    />
                                </>
                            }

                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Typography variant='body2' sx={{ marginBottom: "4px", fontSize: "10px", color: theme.palette.text.gray }}>{t("features")}</Typography>
                            <Box sx={{ border: '1px solid gray', borderRadius: '15px', height: '270px', padding: "10px 12px" }}>

                                <Box height={"50px"}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '4px' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <DoneOutlinedIcon sx={{ fontSize: "12px", color: theme.palette.orangePrimary.main }} />
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                placeholder="Feature 01"
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                InputProps={{
                                                    sx: {
                                                        fontSize: '10px',
                                                        border: 'none', color: "#575756"
                                                    }
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none', color: "#575756"
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <IconButton onClick={handleAddFeature}>
                                            <AddOutlinedIcon sx={{ fontSize: "15px", color: "#575756" }} />
                                        </IconButton>
                                    </Box>
                                    <Divider sx={{ margin: "-10px 1px" }} />
                                </Box>

                                <Box>
                                    {features.map((feature, index) => (
                                        <React.Fragment key={index}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: '10px',
                                                        color: "gray",
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <DoneOutlinedIcon sx={{ fontSize: "12px", color: theme.palette.orangePrimary.main, mr: 0.5 }} />
                                                    {feature}
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ margin: "3px" }} />
                                        </React.Fragment>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            sx={{
                                backgroundColor: '#f57c00',
                                color: 'white',
                                borderRadius: '20px',
                                mt: 4,
                                textTransform: "capitalize",
                                p: "3px 50px",
                                '&:hover': {
                                    backgroundColor: '#f57c00',
                                }
                            }}
                        >
                            <DoneOutlinedIcon sx={{ fontSize: "20px", mr: 1 }} /> {t("save")}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default AddBundle;
