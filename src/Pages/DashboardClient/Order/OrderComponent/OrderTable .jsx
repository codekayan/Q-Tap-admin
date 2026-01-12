import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, IconButton, TextField, Button,
    useTheme
} from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import OrderHistoryDetails from './OrderHistoryDetails/OrderHistoryDetails';
import { useTranslation } from 'react-i18next';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';

const OrderTable = ({ orders }) => {
    const theme = useTheme();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleRowClick = (order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedOrder(null);
    };
    const handleExport = () => {
        const headers = ["id", "created", "method", "items", "price", "payment", "status"];
        const csvRows = [
            headers.join(','),
            ...orders.map(row =>
                [row.id, row.created, row.method, row.items, row.price, row.payment, row.status].join(',')
            )
        ];
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'orders.csv';
        link.click();
        URL.revokeObjectURL(url);
    };
    const { t } = useTranslation();
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            marginTop="-20px"
        >

            <TableContainer component={Paper} style={{ width: '90%' }}>

                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    width="100%"
                    padding="10px 0"
                >
                    <IconButton>
                        <span class="icon-magnifier" style={{ fontSize: "15px" }}></span>
                    </IconButton>

                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder={t("from")}
                        style={{ marginRight: '8px', width: "90px" }}
                        InputProps={{
                            startAdornment: <CalendarMonthOutlinedIcon sx={{ fontSize: "15px", marginRight: "5px", color: "#c7c3c3" }} />,
                            endAdornment: <ArrowDropDownIcon sx={{ color: "#615f5f", fontSize: "18px" }} />,
                            style: { fontSize: '10px', height: "25px", padding: '0px 6px', borderRadius: "6px" },
                        }}
                        InputLabelProps={{
                            style: { fontSize: '10px' },
                        }}
                    />
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder={t("to")}
                        style={{ marginRight: '8px', width: "90px" }}
                        InputProps={{
                            startAdornment: <CalendarMonthOutlinedIcon sx={{ fontSize: "15px", marginRight: "5px", color: "#c7c3c3" }} />,
                            endAdornment: <ArrowDropDownIcon sx={{ color: "#615f5f", fontSize: "18px" }} />,
                            style: { fontSize: '10px', height: "25px", padding: '0px 6px', borderRadius: "6px" },
                        }}
                    />
                    <Button
                        variant="text"
                        style={{ color: theme.palette.orangePrimary.main, fontSize: "11px", textTransform: "capitalize" }}
                        onClick={handleExport}
                    >
                        {t("export")}
                        <ArrowForwardIosIcon sx={{ fontSize: "11px", color: "black" }} />
                    </Button>
                </Box>

                <Table>
                    <TableHead sx={{ borderBottom: "none", backgroundColor: "#f4f6fc", padding: "5px", marginTop: "20px" }}>
                        <TableRow sx={{ height: '40px' }}>
                            <TableCell sx={{ padding: '5px 0px', fontSize: "12px", color: "#575756", textAlign: "center" }}>{t("id")}</TableCell>
                            <TableCell sx={{ padding: '5px 0px', fontSize: "12px", color: "#575756", textAlign: "center" }}>{t("created")}</TableCell>
                            <TableCell sx={{ padding: '5px 0px', fontSize: "12px", color: "#575756", textAlign: "center" }}>{t("dineMethod")}</TableCell>
                            <TableCell sx={{ padding: '5px 0px', fontSize: "12px", color: "#575756", textAlign: "center" }}>{t("item.many")}</TableCell>
                            <TableCell sx={{ padding: '5px 0px', fontSize: "12px", color: "#575756", textAlign: "center" }}>{t("price.one")}</TableCell>
                            <TableCell sx={{ padding: '5px 0px', fontSize: "12px", color: "#575756", textAlign: "center" }}>{t("payment")}</TableCell>
                            <TableCell sx={{ padding: '5px 0px', fontSize: "12px", color: "#575756", textAlign: "center" }}>{t("status")}</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {orders.map((order) => (
                            <TableRow
                                key={order.id}
                                onClick={() => handleRowClick(order)}
                                sx={{ cursor: "pointer" }}
                            >
                                <TableCell sx={{ textAlign: "center" }}>
                                    <Typography variant="body2" sx={{
                                        backgroundColor: '#78c2a4', color: 'black',
                                        padding: '4px 1px', borderRadius: '20px', fontSize: "12px"
                                    }}>
                                        ID {order.id}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ textAlign: "center", color: "gray" }}>
                                    <Typography variant="body2" sx={{ fontSize: "12px" }} >{order.created_at}</Typography>
                                </TableCell>

                                <TableCell sx={{ textAlign: "center", color: "gray", }}>
                                    <Typography variant="body2" sx={{ fontSize: "12px" }}>
                                        {order.type},
                                        <span style={{ color: '#ff9800' }}> {order.type}</span>
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ textAlign: "center", color: "gray", fontSize: "12px" }}>{order.meals?.length}</TableCell>

                                <TableCell sx={{ textAlign: "center", color: "gray", fontSize: "12px" }}>{order.total_price}</TableCell>

                                <TableCell style={{ color: order.payment_status === 'paid' ? '#4CAF50' : '#f44336', textAlign: "center" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img src="/assets/balance.svg" alt="icon" style={{ width: "18px", marginRight: "6px", height: "18px" }} />
                                        {t(order.payment_status)}
                                    </Box>
                                </TableCell>

                                <TableCell style={{ textAlign: "center" }}>
                                    {/* confirmed / pending*/} {/* pending', 'confirmed', 'delivered', 'rejected', 'cancelled' */}
                                    {/* {order.status === 'confirmed' ?
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span class="icon-double-check" style={{ fontSize: "20px", marginRight: "5px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>

                                            <Typography variant="body2" sx={{ fontSize: "12px" }}>
                                                {t("done") + " " + order.status}
                                            </Typography>
                                        </Box>
                                        :
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span class="icon-close" style={{ fontSize: "14px", marginRight: "5px" }}></span>
                                            <Typography variant="body2" sx={{ fontSize: "12px" }}>
                                                {t("rejected") + " "}{order.status}
                                            </Typography>
                                        </Box>

                                    } */}
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {order.status === 'pending' && (<>
                                            <AccessTimeIcon />
                                            <Typography variant="body2" sx={{ fontSize: "12px" }}>
                                                {t("pending")}
                                            </Typography>
                                        </>)}
                                        {order.status === 'confirmed' && (
                                            <>
                                                <span class="icon-double-check" style={{ fontSize: "20px", marginRight: "5px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>

                                                <Typography variant="body2" sx={{ fontSize: "12px" }}>
                                                    {t("cofirmed")}
                                                </Typography>
                                            </>
                                        )}
                                        {order.status === 'delivered' && (
                                            <>
                                                <LocalShippingIcon />
                                                <Typography variant="body2" sx={{ fontSize: "12px" }}>
                                                    {t("delivered")}
                                                </Typography>
                                            </>
                                        )}
                                        {order.status === 'rejected' && (
                                            <>
                                                <span class="icon-close" style={{ fontSize: "14px", marginRight: "5px" }}></span>
                                                <Typography variant="body2" sx={{ fontSize: "12px" }}>
                                                    {t("rejected")}
                                                </Typography>
                                            </>
                                        )}
                                        {order.status === 'cancelled' && (
                                            <>
                                                <CancelIcon />
                                                <Typography variant="body2" sx={{ fontSize: "12px" }}>
                                                    {t("cancelled")}
                                                </Typography>
                                            </>
                                        )}


                                    </Box>




                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* عرض تفاصيل الطلب */}
            {selectedOrder && isDetailsOpen && (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    padding="10px"
                    position="fixed"
                    width="90%"
                    top='50%'
                    left='50%'
                    maxHeight='90vh'
                    className='details'
                    overflow='auto'
                    sx={{
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <OrderHistoryDetails order={selectedOrder} onClose={handleCloseDetails} />
                </Box>
            )}
        </Box>
    );
}

export default OrderTable;
