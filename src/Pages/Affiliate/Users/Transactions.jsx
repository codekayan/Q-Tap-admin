import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Paper, IconButton, useTheme } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { BASE_URL } from "../../../utils/constants";



export const Transactions = () => {
    const theme = useTheme();
    const tableData = [
        {
            user: 'First Name', reverence: '#1234567', date: '20/05/2024', time: '5:00 Am', amount: '100', status: 'Done',
            icon: <span class="icon-double-check" style={{ color: "#30AEF8", fontSize: "20px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>
        },
        {
            user: 'First Name', reverence: '#1234567', date: '20/05/2024', time: '6:00 Pm', amount: '200', status: 'Pending',
            icon: <span class="icon-pending" style={{ color: "#AC4182", fontSize: "20px" }}></span>,

        },

        {
            user: 'First Name', reverence: '#1234567', date: '20/05/2024', time: '5:00 Am', amount: '300', status: 'Failed',
            icon: <span class="icon-close" style={{ color: "#AC4182", fontSize: "15px" }}></span>,
        },

        {
            user: 'First Name', reverence: '#1234567', date: '20/05/2024', time: '6:00 Pm', amount: '400', status: 'Pending',
            icon: <span class="icon-pending" style={{ color: "#AC4182", fontSize: "20px" }}></span>,
        },

        {
            user: 'First Name', reverence: '#1234567', date: '20/05/2024', time: '5:00 Am', amount: '500', status: 'Done',
            icon: <span class="icon-double-check" style={{ color: "#30AEF8", fontSize: "20px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>

        }
    ];
    const { t } = useTranslation();
    const [transData, settransData] = useState([]);
    const getTransactions = async () => {
        try {
            const response = await axios.get(

                `${BASE_URL}affiliate_transactions_all`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    },
                }
            );

            if (response.data.success) {
                settransData(response?.data?.transactions);

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
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchClick = () => {
        setShowSearch(!showSearch);
        setSearchQuery(''); // Reset search query when toggling
    };

    // Filter tickets based on search query
    const filteredTransaction = transData.filter(trans =>
        trans.affiliate.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handlePrint = () => {
        // Create a style element for print-specific styles
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                body * {
                    visibility: hidden;
                }
                #print-section, #print-section * {
                    visibility: visible;
                }
                #print-section {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                .no-print {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Trigger print
        window.print();

        // Clean up the style element after printing
        document.head.removeChild(style);
    };
    return (
        <Paper sx={{ padding: "20px", borderRadius: '20px', mt: 2 }}>
            <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1"
                        sx={{ fontSize: "13px", color: theme.palette.text.gray, display: "flex", alignItems: "center" }}
                    >
                        <span class="icon-transfer" style={{ fontSize: "22px", color: "#D8E0E0", marginRight: "10px" }} ></span>
                        {t("transactions")}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {showSearch && (
                            <Box sx={{ width: showSearch ? "100%" : "20%" }}>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name..."
                                    style={{
                                        width: "100%",
                                        padding: "6px 8px",
                                        borderRadius: "6px",
                                        border: "1px solid rgba(0, 0, 0, 0.23)",
                                        fontSize: "12px",
                                        outline: "none",
                                        backgroundColor: "#fff",
                                        "&:hover": {
                                            borderColor: "rgba(0, 0, 0, 0.87)",
                                        },
                                    }}
                                />
                            </Box>
                        )}
                        <IconButton onClick={() => window.print()}>
                            <span
                                className="icon-magnifier"
                                style={{ fontSize: "15px", color: theme.palette.text.gray }}
                            />
                        </IconButton>
                        <IconButton onClick={handlePrint}>
                            <span class="icon-printer" style={{ fontSize: "16px" }} ></span>
                        </IconButton>
                    </Box>
                </Box>

                <Box id="print-section">
                    <TableContainer sx={{ mt: 1, whiteSpace: 'nowrap' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ height: "25px" }}>
                                    {/* Amount */}     {[t("user"), t("date"), t("time"), t("amount"), t("status")].map((header) => (
                                        <TableCell
                                            key={header}
                                            sx={{
                                                fontSize: "12px", padding: "0px 10px", textAlign: "left",
                                                borderBottom: "1px solid #bbb9b9fa", color: theme.palette.text.gray
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody >
                                {filteredTransaction?.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ padding: "0px", textAlign: "left", border: "none", color: theme.palette.text.gray }}>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <Avatar sx={{ mr: 1 }}>
                                                    <PersonOutlineOutlinedIcon sx={{ fontSize: "25px" }} />
                                                </Avatar>

                                                <Box sx={{ fontSize: "12px", }}>
                                                    {row.affiliate?.name || "N/A"}
                                                    <Typography sx={{ fontSize: "11px", marginTop: "5px", color: "#AAAAAA", width: "100%" }}>
                                                        ID: #<span style={{ borderBottom: "1px solid #AAAAAA" }}>{row.affiliate.code || "N/A"}</span></Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        {/* <TableCell sx={{ padding: "0px 10px", textAlign: "left", border: "none" }}>
                                        <span style={{ fontSize: "12px", color: "#AAAAAA", borderBottom: "1px solid #AAAAAA" }}>
                                            {row.Reverence_no}</span>
                                    </TableCell> */}


                                        <TableCell sx={{ padding: "0px 10px", textAlign: "left", color: "#AAAAAA", border: "none" }}>
                                            {row.updated_at?.split('T')[0].split('-').reverse().join('/')}
                                        </TableCell>
                                        <TableCell sx={{ padding: "0px 10px", textAlign: "left", color: "#AAAAAA", border: "none" }}>
                                            {new Date(row.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </TableCell>



                                        {/* Amount */}
                                        <TableCell sx={{
                                            textAlign: "left", fontSize: "22px", color: theme.palette.orangePrimary.main,
                                            border: "none"
                                        }} >
                                            {row.amount}
                                            <span style={{ color: "#AAAAAA", fontSize: "12px" }}>EGP</span>
                                        </TableCell>


                                        <TableCell sx={{ textAlign: "center", border: "none", color: "gray" }}>
                                            <Box display="flex" alignItems="center" justifyContent="start">
                                                {row.status === "Done" && (
                                                    <span className="icon-double-check" style={{ color: "#30AEF8", fontSize: "20px" }}>
                                                        <span className="path1"></span>
                                                        <span className="path2"></span>
                                                        <span className="path3"></span>
                                                        <span className="path4"></span>
                                                    </span>
                                                )}
                                                {row.status === "pending" && (
                                                    <span className="icon-pending" style={{ color: "#AC4182", fontSize: "20px" }}></span>
                                                )}
                                                {row.status === "failed" && (
                                                    <span className="icon-close" style={{ color: "#AC4182", fontSize: "15px" }}></span>
                                                )}
                                                <Box sx={{ ml: 1, color: '#AAAAAA', fontSize: "13px" }}>{t(row.status)}</Box>
                                            </Box>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Paper>
    )
}
