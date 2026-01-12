import { Button, Box, Divider, IconButton, Modal, Typography, Grid, TextField, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const AddVariant = ({ open, handleClose, onAdd }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const handleAdd = () => {
        if (!name || !price) {
            toast.error(t("plFillAllField"));
            return;
        }
        onAdd({ name, price });
        setName('');
        setPrice('');
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    width: 350,
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 24,
                    mx: 'auto',
                    mt: '20vh',
                    position: 'relative'
                }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body1" sx={{ fontSize: "12px", color: "#424242" }}>
                        {t("variant.add")}
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon sx={{ fontSize: "20px", color: "gray" }} />
                    </IconButton>
                </Box>
                <Divider sx={{ backgroundColor: '#FF6600' }} />
                <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <Grid item xs={10}>
                        <Typography variant='body2' sx={{ fontSize: "10px" }}>{t("option")}</Typography>
                        <TextField
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                            fullWidth
                            placeholder={t("variant.name")}
                            InputProps={{ sx: { height: '30px', fontSize: "10px" } }}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant='body2' sx={{ fontSize: "10px" }}>{t("price.one")}</Typography>
                        <TextField
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            variant="outlined"
                            fullWidth
                            placeholder='0.00'
                            InputProps={{
                                sx: { height: '30px', fontSize: "10px" },
                                endAdornment: <Typography sx={{ fontSize: "10px", color: "gray" }}>EGP</Typography>,
                            }}
                        />
                    </Grid>
                    <Box sx={{ marginTop: "30px", display: "flex", textAlign: "center", justifyContent: "center", alignItems: "center" }}>
                        <Button
                            onClick={handleAdd}
                            variant="contained"
                            sx={{
                                backgroundColor: theme.palette.orangePrimary.main,
                                borderRadius: '25px',
                                color: 'white',
                                textTransform: 'none',
                                padding: '3px 52px',
                                '&:hover': { backgroundColor: '#f18101' },
                            }}
                        >
                            <CheckOutlinedIcon /> {t("save")}
                        </Button>
                    </Box>
                </Grid>
            </Box>
        </Modal>
    );
};