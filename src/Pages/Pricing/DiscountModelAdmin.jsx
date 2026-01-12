
import { Divider, IconButton, InputAdornment, Modal, Typography, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import DoneIcon from '@mui/icons-material/Done';
import { Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BASE_URL, BASE_URL_IMG } from "../../utils/constants";
import { useGetPlanDiscountCoupons } from '../../Hooks/Queries/admin/plan-discount-coupon/useGetPlanDiscountCoupons';
import { useUpdatePlanDiscountCoupon } from '../../Hooks/Queries/admin/plan-discount-coupon/actions/useUpdatePlanDiscountCoupon';
import { useCreatePlanDiscountCoupon } from '../../Hooks/Queries/admin/plan-discount-coupon/actions/useCreatePlanDiscountCoupon';
import { useDeletePlanDiscountCoupon } from '../../Hooks/Queries/admin/plan-discount-coupon/actions/useDeletePlanDiscountCoupon';
import { useQueryClient } from '@tanstack/react-query';

export const DiscountModelAdmin = ({ open, handleClose }) => {
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [editDiscount, setEditDiscount] = useState(null);
    // const [editDiscountFields, setEditDiscountFields] = useState(null);

    const { t } = useTranslation();
    const theme = useTheme();

    // const queryClient = useQueryClient();
    //  queryClient.invalidateQueries({ queryKey: ["todos"] })
    const { data, refetch, isLoading } = useGetPlanDiscountCoupons()
    const discounts = data?.data?.data || []

    const { mutate: createPlanDiscountCoupon, isPending: isCreatingPlanDiscountCouponPending } = useCreatePlanDiscountCoupon()
    const { mutate: deletePlanDiscountCoupon, isPending: isDeletePlanDiscountCouponPending } = useDeletePlanDiscountCoupon()
    const { mutate: updatePlanDiscountCoupon, isPending: isUpdatePlanDiscountCouponPending } = useUpdatePlanDiscountCoupon()


    const handleAdd = async () => {
        const formData = {
            code: code,
            discount: discount,
            status: "active"
        };
        createPlanDiscountCoupon({ data: formData }, {
            onSuccess: () => {
                toast.success(t("discount.addSucc"));
                setCode('');
                setDiscount('');
                refetch();
            },
            onError: (error) => {
                console.error('Error adding discount:', error);
                const errorMessage = error.response?.data?.message || t("discount.addErr");
                toast.error(errorMessage);
            },
        })
    };

    const handleDelete = async (index, discountId) => {

        deletePlanDiscountCoupon({ coupon_id: discountId }, {
            onSuccess: () => {
                toast.success(t("discount.deleteSucc"));
                refetch();
            },
            onError: (error) => {
                // const errorMessage = error.response?.data?.message || t("discount.addErr");
                // toast.error(errorMessage);

                console.error('Error deleting discount:', error);
                toast.error(t("discount.deleteErr"));
            },
        })
    };

    const handleEditToggle = (discount) => {
        setEditDiscount(discount)
    };

    const handleInputChange = (index, field, value) => {
        console.log('field', field)
        setEditDiscount(prev => ({
            ...prev,
            [field]: value,
        }))
    };

    const handleUpdate = async (discountId) => {
        const formData = {
            code: editDiscount.code,
            discount: editDiscount.discount,
            status: editDiscount.status
        };
        updatePlanDiscountCoupon({ coupon_id: discountId, data: formData }, {
            onSuccess: () => {
                toast.success(t("discount.updateSucc"));
                setEditDiscount(null)
                refetch();
            },
            onError: (error) => {
                // const errorMessage = error.response?.data?.message || t("discount.addErr");
                // toast.error(errorMessage);

                console.error('Error deleting discount:', error);
                toast.error(t("discount.deleteErr"));
            },
        })
      
    };

  

    return (
        <Modal open={open} onClose={handleClose} disableScrollLock>
            <Box sx={{
                width: 400,
                height: "400px",
                bgcolor: 'background.paper',
                borderRadius: 3,
                boxShadow: 24,
                mx: 'auto',
                mt: '20vh',
                position: 'relative'
            }}>
                <Box sx={{ padding: "20px" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body1" sx={{ fontSize: "12px", color: theme.palette.text.gray }}>
                            {t("discount.codes")}
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <span className="icon-close-1" style={{ fontSize: "12px" }}></span>
                        </IconButton>
                    </Box>
                    <Divider sx={{ backgroundColor: '#F58125', height: '1px' }} />

                    <Box sx={{ marginTop: "10px" }}>
                        <Grid container spacing={2} sx={{ mb: 2, marginTop: "12px" }}>
                            <Grid item xs={6}>
                                <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray }}>{t("code")}</Typography>
                                <TextField
                                    fullWidth
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Please enter code"
                                    InputProps={{
                                        sx: { height: 33, lineHeight: "25px", borderRadius: "6px", fontSize: "10px", color: theme.palette.text.gray }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray }}>{t("discount.one")}</Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    placeholder="Please enter discount"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        sx: { height: 33, lineHeight: "25px", borderRadius: "6px", fontSize: "10px", color: theme.palette.text.gray }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Button
                                onClick={handleAdd}
                                variant="contained"
                                sx={{
                                    backgroundColor: theme.palette.orangePrimary.main,
                                    borderRadius: '25px',
                                    color: 'white',
                                    width: "30%",
                                    textTransform: 'none',
                                    fontSize: "12px",
                                    padding: '2px 10px',
                                    '&:hover': {
                                        backgroundColor: theme.palette.orangePrimary.main,
                                    },
                                }}
                                disabled={isCreatingPlanDiscountCouponPending}
                            >
                                + Add
                            </Button>
                        </Box>
                    </Box>
                </Box>

                <Table sx={{ p: 0, mt: 2, mb: 5, width: '100%', tableLayout: 'fixed', overflowY: "auto", borderRadius: "10px" }}>
                    <TableHead sx={{ backgroundColor: theme.palette.bodyColor.secandary }}>
                        <TableRow >
                            <TableCell sx={{ fontSize: "10px", padding: '0px', borderBottom: "none", textAlign: "center", color: theme.palette.text.gray }}>{t("code")}</TableCell>
                            <TableCell sx={{ fontSize: "10px", padding: '0px', borderBottom: "none", textAlign: "center", color: theme.palette.text.gray }}>{t("discount.one")}</TableCell>
                            <TableCell sx={{ fontSize: "10px", padding: '0px', borderBottom: "none", textAlign: "center", color: theme.palette.text.gray }}>{t("date")}</TableCell>
                            <TableCell sx={{ fontSize: "10px", padding: '0px', borderBottom: "none", textAlign: "center", color: theme.palette.text.gray }}>{t("status")}</TableCell>
                            <TableCell sx={{ fontSize: "10px", padding: '0px', borderBottom: "none", textAlign: "center", color: theme.palette.text.gray }}>{t("action")}</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {discounts.map((discount, index) => (
                            <TableRow key={index} sx={{ height: '36px' }}>
                                <TableCell sx={{ textAlign: "center", fontSize: "10px", color: theme.palette.text.gray, padding: '0px', borderBottom: "none" }}>
                                    {editDiscount?.id === discount?.id ? (
                                        <TextField
                                            value={editDiscount.code}
                                            onChange={(e) => handleInputChange(index, "code", e.target.value)}
                                            size="small"
                                            sx={{ fontSize: "5px", width: "70px", borderRadius: "7px" }}
                                        />
                                    ) : (
                                        discount.code
                                    )}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center", fontSize: "10px", color: theme.palette.text.gray, padding: '0px', borderBottom: "none" }}>
                                    {editDiscount?.id === discount?.id ? (
                                        <TextField
                                            value={editDiscount.discount}
                                            onChange={(e) => handleInputChange(index, "discount", e.target.value)}
                                            size="small"
                                            sx={{ fontSize: "5px", width: "60px", borderRadius: "7px" }}
                                        />
                                    ) : (
                                        discount.discount.split(".")[0] + '%'
                                    )}
                                </TableCell>

                                <TableCell sx={{ textAlign: "center", fontSize: "10px", color: theme.palette.text.gray, padding: '0px', borderBottom: "none" }}>
                                    {discount.created_at ? discount.created_at.split('T')[0].split('-').reverse().join('/') : discount.date}
                                </TableCell>

                                <TableCell sx={{ textAlign: "center", fontSize: "10px", color: theme.palette.text.gray, padding: '0px', borderBottom: "none" }}>
                                    {editDiscount?.id === discount?.id ? (
                                        <Select
                                            value={editDiscount.status}
                                            onChange={(e) => handleInputChange(index, "status", e.target.value)}
                                            size="small"
                                            sx={{ fontSize: "10px", width: "70px", borderRadius: "7px" }}
                                        >
                                            <MenuItem value="active" sx={{ fontSize: "10px" }}>{t("active")}</MenuItem>
                                            <MenuItem value="inactive" sx={{ fontSize: "10px" }}>{t("inactive")}</MenuItem>
                                        </Select>
                                    ) : (
                                        <Box sx={{
                                            color: "white",
                                            backgroundColor: discount.status === 'active' ? "#479947" : "#f05e5e",
                                            width: "55px", padding: "0px",
                                            borderRadius: '12px',
                                            display: 'inline-block',
                                        }}>

                                            {discount.status}
                                        </Box>
                                    )}
                                </TableCell>

                                <TableCell sx={{ fontSize: "10px", textAlign: "center", padding: '0px', borderBottom: "none" }}>
                                    {editDiscount?.id === discount?.id ? (
                                        <IconButton size="small" onClick={() => handleUpdate(discount.id)} color="success">
                                            <DoneIcon sx={{ fontSize: "18px" }} />
                                        </IconButton>
                                    ) : (
                                        <IconButton size="small" onClick={() => handleEditToggle(discount)} color="success">
                                            <span className="icon-edit" sx={{ fontSize: "10px", color: "black" }}></span>
                                        </IconButton>
                                    )}

                                    <IconButton size="small" disabled={isDeletePlanDiscountCouponPending} onClick={() => handleDelete(index, discount.id)} color="error">
                                        <span className="icon-delete" sx={{ fontSize: "10px" }}></span>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Modal>
    );
};