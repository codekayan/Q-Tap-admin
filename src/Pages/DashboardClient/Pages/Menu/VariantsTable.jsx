import { Button, Divider, IconButton, Paper, TextField, Typography, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { AddVariant } from './AddVariant';
import DoneIcon from '@mui/icons-material/Done';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const VariantsTable = ({ updateVariants, initialVariants, limitVariants, setLimitVariants }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [openVariant, setOpenVariant] = useState(false);
    const [allVariants, setAllVariants] = useState(initialVariants || []);

    // تحديث الحالة عند تغيير initialVariants
    useEffect(() => {
        setAllVariants(initialVariants || []);
    }, [initialVariants]);

    // تحديث المكون الأب عند تغيير allVariants
    useEffect(() => {
        updateVariants(allVariants);
    }, [allVariants, updateVariants]);

    const handleVariantOpen = () => {
        setOpenVariant(true);
    };

    const handleClose = () => {
        setOpenVariant(false);
    };

    const handleAddVariant = (newVariant) => {
        const updatedVariants = [...allVariants, { ...newVariant, isEditing: false }];
        setAllVariants(updatedVariants);
    };

    const handleDelete = (index) => {
        const updatedVariants = allVariants.filter((_, i) => i !== index);
        setAllVariants(updatedVariants);
        toast.success(t("variant.deleteSucc"));
    };

    const handleEditToggle = (index) => {
        const updatedVariants = [...allVariants];
        updatedVariants[index].isEditing = !updatedVariants[index].isEditing;
        setAllVariants(updatedVariants);
    };

    const handleInputChange = (index, field, value) => {
        const updatedVariants = [...allVariants];
        updatedVariants[index][field] = value;
        setAllVariants(updatedVariants);
    };

    const handleUpdate = (index) => {
        handleEditToggle(index);
        toast.success(t("variant.updateSucc"));
    };

    return (
        <Paper
            sx={{
                borderRadius: "10px", padding: "20px 30px", marginTop: "-20px" , overflowX:'auto'
            }} >

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body1" sx={{ fontSize: "13px", color: theme.palette.text.gray_white }}>
                    {t("variant.one")}
                </Typography>
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
                        <Typography sx={{ fontSize: "10px", color: theme.palette.text.gray_white, marginRight: "5px" }}>{t("limit")}</Typography>
                        <TextField
                            value={limitVariants}
                            onChange={(e) => setLimitVariants(e.target.value)}
                            placeholder='0.0'
                            variant="outlined"
                            fullWidth
                            type="number"
                            InputProps={{
                                sx: { height: '20px', fontSize: "9px", width: "55px" },
                            }}
                        />
                        <DoneIcon sx={{ color: theme.palette.orangePrimary.main, fontSize: "16px" }} />
                    </Box>
                    <Button onClick={handleVariantOpen}>
                        <Typography variant='body1' sx={{ fontSize: "13px", textTransform: "capitalize", color: theme.palette.orangePrimary.main }}>
                            + {t("addOne")}
                        </Typography>
                    </Button>
                    <AddVariant open={openVariant} handleClose={handleClose} onAdd={handleAddVariant} />
                </Box>
            </Box>
            <Divider sx={{ backgroundColor: theme.palette.orangePrimary.main }} />
            <Table sx={{ mt: 3, mb: 5, width: '100%', whiteSpace:'nowrap' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#EBEDF3" }}>
                        <TableCell sx={{ fontSize: "10px", padding: '3px 10px', borderBottom: "none", textAlign: "left", color: "#575756" }}>{t("price.one")}</TableCell>
                        <TableCell sx={{ fontSize: "10px", padding: '3px 10px', borderBottom: "none", textAlign: "left", color: "#575756" }}>{t("option")}</TableCell>
                        <TableCell sx={{ fontSize: "10px", padding: '3px 10px', borderBottom: "none", textAlign: "left", color: "#575756" }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allVariants.map((variant, index) => (
                        <TableRow key={index} sx={{ height: '36px' }}>
                            <TableCell sx={{ textAlign: "left", fontSize: "11px", color: theme.palette.text.gray_white}}>
                                {variant.isEditing ? (
                                    <TextField
                                        value={variant.price}
                                        onChange={(e) => handleInputChange(index, "price", e.target.value)}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    `${parseFloat(variant.price).toFixed(2)} EGP`

                                )}
                            </TableCell>
                            <TableCell sx={{ textAlign: "left", fontSize: "11px", color: theme.palette.text.gray_white }}>
                                {variant.isEditing ? (
                                    <TextField
                                        value={variant.name}
                                        onChange={(e) => handleInputChange(index, "name", e.target.value)}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    variant.name
                                )}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center", fontSize: "12px" }}>
                                {variant.isEditing ? (
                                    <IconButton size="small" color='success' onClick={() => handleUpdate(index)}>
                                        <DoneIcon sx={{ fontSize: "18px" }} />
                                    </IconButton>
                                ) : (
                                    <IconButton size="small" color='success' onClick={() => handleEditToggle(index)}>
                                        <span className="icon-edit" style={{ fontSize: "18px" }} />
                                    </IconButton>
                                )}
                                <IconButton size="small" color='error' onClick={() => handleDelete(index)}>
                                    <span className="icon-delete" style={{ fontSize: "18px" }} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};