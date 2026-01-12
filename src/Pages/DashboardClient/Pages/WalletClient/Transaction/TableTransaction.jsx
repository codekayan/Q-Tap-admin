import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableRow, Box,
    Card,
    CardContent,
    Typography,
    useTheme,
    Divider,
} from '@mui/material';
import MinimizeOutlined from '@mui/icons-material/MinimizeOutlined';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { BASE_URL } from "../../../../../utils/constants";

export const TableTransaction = () => {
    const [transData, settransData] = useState([]);
    const getTransactions = async () => {
        try {
            const response = await axios.get(

                `${BASE_URL}clients_transactions`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("Token")}`,
                    },
                }
            );

            if (response.data.success) {
                settransData(response?.data?.clients_transactions);
                console.log("Fetched transactions:", response?.data.clients_transactions);

            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    useEffect(() => {
        let isMounted = true; // Flag to prevent setting state if component is unmounted
        const fetchTransactions = async () => {
            if (isMounted) {
                await getTransactions();
            }
        };
        fetchTransactions();
        return () => {
            isMounted = false; // Cleanup to prevent multiple requests
        };
    }, []);
    const { t } = useTranslation();
    const theme = useTheme();
    return (
        <Card Card sx={{ borderRadius: 4, height: "100%", overflowX: 'auto' }}>
            <CardContent>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    marginBottom={"10px"}
                    flexWrap={'nowrap'}
                    whiteSpace={'nowrap'}
                >
                    <Box variant="body2" sx={{ fontSize: "13px", display: "flex", padding: "10px" }}>
                        <span class="icon-transfer" style={{ fontSize: "22px", color: "#D8E0E0" }} ></span>
                        {t("transactions")}
                    </Box>
                </Box>
                <Divider sx={{
                    width: "100%", borderRadius: "20px", borderBottom: "none", marginBottom: "10px",
                    background: 'linear-gradient(90deg, #FDB913 0%, #F2672E 100%)', height: "3px"
                }} />
                <Table>
                    <TableHead sx={{
                        height: "30px",
                        borderBottom: "1px solid #EBEDF3",
                        padding: "0px",
                        marginBottom: "0px",
                        width: "100%",

                    }}>
                        <TableRow sx={{ height: "auto" }}>
                            <TableCell sx={{
                                borderBottom: "none",
                                fontSize: "10px",
                                textAlign: "left",
                                padding: "0px 20px",
                                margin: "0px"
                            }}>ID</TableCell>
                            <TableCell sx={{
                                borderBottom: "none",
                                fontSize: "10px",
                                textAlign: "center",
                                padding: "0px",
                                margin: "0px",
                            }}>{t("date")}</TableCell>
                            <TableCell sx={{
                                borderBottom: "none",
                                fontSize: "10px",
                                textAlign: "center",
                                padding: "0px",
                                margin: "0px"
                            }}>{t("time")}</TableCell>
                            <TableCell sx={{
                                borderBottom: "none",
                                fontSize: "10px",
                                textAlign: "center",
                                padding: "0px",
                                margin: "0px"
                            }}>{t("amount")}</TableCell>
                            <TableCell sx={{
                                borderBottom: "none",
                                fontSize: "10px",
                                textAlign: "center",
                                padding: "0px",
                                margin: "0px"
                            }}>{t("status")}</TableCell>
                        </TableRow>
                    </TableHead>


                    <TableBody>
                        {transData.map((transaction, index) => (
                            <>

                                <TableRow key={index}>
                                    <TableCell sx={{
                                        display: "flex", textAlign: "center", justifyContent: "left", color: theme.palette.text.gray_light,
                                        borderBottom: "none", height: "30px", padding: "15px 0px 0px 10px"
                                    }}>
                                        <MinimizeOutlined sx={{ color: theme.palette.orangePrimary.main, fontSize: "15px" }} />
                                        <Typography sx={{ fontSize: "11px", borderBottom: "1px solid #9d9d9c" }}># {transaction.id}</Typography>
                                    </TableCell>

                                    <TableCell sx={{ fontSize: "11px", textAlign: "center", color: theme.palette.text.gray_light, borderBottom: "none", height: "30px", padding: "10px 0px 0px 10px" }}>
                                        {transaction.updated_at?.split('T')[0].split('-').reverse().join('/')}

                                    </TableCell>
                                    <TableCell sx={{ fontSize: "11px", textAlign: "center", color: theme.palette.text.gray_light, borderBottom: "none", height: "30px", padding: "10px 0px 0px 10px" }}>
                                        {new Date(transaction.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "11px", textAlign: "center", color: theme.palette.text.gray_light, borderBottom: "none", height: "30px", padding: "10px 0px 0px 10px" }}>

                                        {transaction.amount}
                                        <span style={{ color: "#AAAAAA", fontSize: "12px", marginLeft: "2px" }}>EGP</span>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center", border: "none", color: "gray" }}>
                                        <Box display="flex" alignItems="center" justifyContent="center">
                                            {transaction.status === "Done" && (
                                                <span className="icon-double-check" style={{ color: "#30AEF8", fontSize: "15px" }}>
                                                    <span className="path1"></span>
                                                    <span className="path2"></span>
                                                    <span className="path3"></span>
                                                    <span className="path4"></span>
                                                </span>
                                            )}
                                            {transaction.status === "pending" && (
                                                <span className="icon-pending" style={{ color: "#AC4182", fontSize: "15px" }}></span>
                                            )}
                                            {transaction.status === "failed" && (
                                                <span className="icon-close" style={{ color: "#AC4182", fontSize: "13px" }}></span>
                                            )}
                                            <Box sx={{ ml: 1, color: '#AAAAAA', fontSize: "13px" }}>{t(transaction.status)}</Box>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </>
                        ))}
                    </TableBody>



                </Table>
            </CardContent>
        </Card>

    )
}
