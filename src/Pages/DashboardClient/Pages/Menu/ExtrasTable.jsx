import { Button, Divider, FormControl, IconButton, MenuItem, Paper, Select, TextField, Typography, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { AddExtras } from './AddExtras';
import DoneIcon from '@mui/icons-material/Done';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const ExtrasTable = ({ updateExtras, initialExtras, variants }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [openExtras, setOpenExtras] = useState(false);
    const [allExtras, setAllExtras] = useState(initialExtras || []);


    
    // تحديث الحالة عند تغيير initialExtras
    useEffect(() => {
        setAllExtras(initialExtras || []);
    }, [initialExtras]);

    // تحديث المكون الأب عند تغيير allExtras
    useEffect(() => {
        updateExtras(allExtras);
    }, [allExtras, updateExtras]);

    const handleExtrasOpen = () => {
        setOpenExtras(true);
    };

    const handleClose = () => {
        setOpenExtras(false);
    };

    const handleAddExtra = (newExtra) => {
        const updatedExtras = [...allExtras, { ...newExtra, isEditing: false }];
        setAllExtras(updatedExtras);
    };

    const handleDelete = (index) => {
        const updatedExtras = allExtras.filter((_, i) => i !== index);
        setAllExtras(updatedExtras);
        toast.success(t("extra.deleteSucc"));
    };

    const handleEditToggle = (index) => {
        const updatedExtras = [...allExtras];
        updatedExtras[index].isEditing = !updatedExtras[index].isEditing;
        setAllExtras(updatedExtras);
    };

    const handleInputChange = (index, field, value) => {
        const updatedExtras = [...allExtras];
        updatedExtras[index][field] = value;
        setAllExtras(updatedExtras);
    };

    const handleUpdate = (index) => {
        handleEditToggle(index);
        toast.success(t("extra.updateSucc"));
    };

    return (
        <Paper sx={{ borderRadius: "10px", padding: "20px 30px", marginTop: "-20px" ,overflowX:'auto' }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body1" sx={{ fontSize: "13px", color: theme.palette.text.gray_white }}>
                    {t("extra.many")}
                </Typography>
                <Button onClick={handleExtrasOpen}>
                    <Typography variant='body1' sx={{ fontSize: "13px", textTransform: "capitalize", color: theme.palette.orangePrimary.main }}>
                        + {t("addOne")}
                    </Typography>
                </Button>
                <AddExtras open={openExtras} handleClose={handleClose} onAdd={handleAddExtra} variants={variants} />
            </Box>
            <Divider sx={{ backgroundColor: theme.palette.orangePrimary.main }} />

            <Table sx={{ mt: 3, mb: 5,whiteSpace:'nowrap' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#EBEDF3" }}>
                        <TableCell sx={{ fontSize: "10px", textAlign: "left", color: "#575756", padding: "3px 10px" }}>{t("price.one")}</TableCell>
                        <TableCell sx={{ fontSize: "10px", textAlign: "left", color: "#575756", padding: "3px 10px" }}>{t("name")}</TableCell>
                        <TableCell sx={{ fontSize: "10px", textAlign: "center", color: "#575756", padding: "3px 10px" }}>{t("action")}</TableCell>
                        <TableCell sx={{ fontSize: "10px", textAlign: "center", color: "#575756", padding: "3px 10px" }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allExtras.map((extra, index) => (
                        <TableRow key={index} sx={{ height: '36px' }}>
                            <TableCell sx={{ textAlign: "left", fontSize: "11px", color: theme.palette.text.gray_white }}>
                                {extra.isEditing ? (
                                    <TextField
                                        value={extra.price}
                                        onChange={(e) => handleInputChange(index, "price", e.target.value)}
                                        variant="outlined"
                                        size='small'
                                        sx={{ width: "90px", height: "30px", "& .MuiInputBase-root": { height: "30px", fontSize: "10px" } }}
                                    />
                                ) : (
                                    `${parseFloat(extra.price).toFixed(2)} EGP`
                                )}
                            </TableCell>
                            <TableCell sx={{ textAlign: "left", fontSize: "11px", color: theme.palette.text.gray_white }}>
                                {extra.isEditing ? (
                                    <TextField
                                        value={extra.name}
                                        onChange={(e) => handleInputChange(index, "name", e.target.value)}
                                        variant="outlined"
                                        size='small'
                                        sx={{ width: "90px", height: "30px", "& .MuiInputBase-root": { height: "30px", fontSize: "10px" } }}
                                    />
                                ) : (
                                    extra.name
                                )}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center", fontSize: "10px", color: theme.palette.text.gray_white, padding: '3px 10px', width: '25%' }}>
                                <FormControl size="small" sx={{ minWidth: 110 }}>
                                    <Select
                                        value={extra.variants_id || ''}
                                        onChange={(e) => handleInputChange(index, "variants_id", e.target.value)}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        sx={{
                                            fontSize: '12px',
                                            height: '32px',
                                            lineHeight: "30px",
                                            borderRadius: "10px",
                                            color: theme.palette.text.gray_white,
                                            '& .MuiSelect-select': {
                                                padding: '5px',
                                                fontSize: "10px",
                                                textAlign: 'center',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            },
                                            '& .MuiSelect-select:focus': {
                                                backgroundColor: 'transparent'
                                            }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: { borderRadius: "10px" }
                                            }
                                        }}
                                    >
                                        <MenuItem
                                            value=''
                                            disabled
                                            sx={{
                                                color: "gray", fontSize: "12px", textAlign: 'center', display: 'flex',
                                                justifyContent: 'center'
                                            }}>
                                            {t("selectVariant")}
                                        </MenuItem>
                                        {variants.map((variant) => (
                                            <MenuItem
                                                key={variant.name}
                                                value={variant.name}
                                                sx={{
                                                    color: "gray", fontSize: "12px", textAlign: 'center', display: 'flex',
                                                    justifyContent: 'center'
                                                }}>
                                                {variant.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center", fontSize: "12px" }}>
                                {extra.isEditing ? (
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