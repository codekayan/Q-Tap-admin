import { Button, Box, Divider, IconButton, Modal, Typography, TextField, Grid, MenuItem, Select, FormControl, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const AddExtras = ({ open, handleClose, onAdd, variants }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [variantsId, setVariantsId] = useState("");

    const handleAdd = () => {
        if (!name || !price || !variantsId) {
            toast.error(t("plFillAllField"));
            return;
        }
        onAdd({ name, price, variants_id: variantsId });
        setName('');
        setPrice('');
        setVariantsId('');
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
                        {t("extra.add")}
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon sx={{ fontSize: "20px", color: "gray" }} />
                    </IconButton>
                </Box>
                <Divider sx={{ backgroundColor: '#FF6600' }} />
                <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <Grid item xs={10}>
                        <Typography variant='body2' sx={{ fontSize: "10px" }}>{t("name")}</Typography>
                        <TextField
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            variant="outlined"
                            fullWidth
                            placeholder='Extra Name'
                            InputProps={{ sx: { height: '30px', fontSize: "10px" } }}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant='body2' sx={{ fontSize: "10px" }}>{t("price.one")}</Typography>
                        <TextField
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            variant="outlined"
                            fullWidth
                            placeholder='0.00'
                            InputProps={{
                                sx: { height: '30px', fontSize: "10px" },
                                endAdornment: <Typography sx={{ fontSize: "10px", color: "gray" }}>EGP</Typography>,
                            }}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant='body2' sx={{ fontSize: "10px" }}>{t("variant.one")}</Typography>
                        <FormControl fullWidth size="small" sx={{ minWidth: 90 }}>
                            <Select
                                value={variantsId}
                                onChange={(e) => setVariantsId(e.target.value)}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                sx={{
                                    fontSize: '10px',
                                    height: '30px',
                                    borderRadius: "5px",
                                    color: "gray",
                                    '& .MuiSelect-select': {
                                        padding: '5px',
                                        fontSize: "12px",
                                        textAlign: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    },
                                    '& .MuiSelect-select:focus': {
                                        backgroundColor: 'transparent'
                                    }
                                }}
                            >
                                <MenuItem value="" disabled>{t("selectVariant")}</MenuItem>
                                {variants.map((variant) => (
                                    <MenuItem
                                        key={variant.name}
                                        value={variant.name}
                                        sx={{ color: "gray", fontSize: "10px", textAlign: 'center' }}
                                    >
                                        {variant.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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