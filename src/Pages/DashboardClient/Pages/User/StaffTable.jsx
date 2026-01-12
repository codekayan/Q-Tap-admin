import React, { useEffect, useState } from 'react';
import { Button, Divider, IconButton, Paper, Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { staffData } from './userData';
import { AddStaff } from './AddStaff';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BASE_URL,BASE_URL_IMG } from "../../../../utils/constants";
import { Settings } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectSelectedBranch } from '../../../../store/client/clientAdmin';

export const StaffTable = ({ userStaff }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);



    //========================================== get RestStaff data 

    const [RestStaff, setRestStaff] = useState([]);
    const branchID = useSelector(selectSelectedBranch)

    const getRestStaff = async (branchID) => {
        const fetchWithRetry = async (retries, delay) => {
            try {
                const response = await axios.get(`${BASE_URL}restaurant_user_staff/${branchID}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem('Token')}`
                    }
                });

                if (response.data) {
                    setRestStaff(response.data.restaurant_user_staff || []);
                }
            } catch (error) {
                if (error.response?.status === 429 && retries > 0) {
                    console.log(`Retrying... attempts left: ${retries}`);
                    setTimeout(() => fetchWithRetry(retries - 1, delay * 2), delay);
                } else {
                    console.log("error RestStaff data ", error);
                }
            }
        };

        fetchWithRetry(3, 1000); // Retry up to 3 times with an initial delay of 1 second
    };

    useEffect(() => {
        getRestStaff(branchID);
    }, [branchID]);
    //========================================== handle delete RestStaff

    const handleDeleteRestStaff = async (id) => {
        try {

            const response = await axios.delete(`${BASE_URL}restaurant_user_staff/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('Token')}`
                }
            })

            if (response.data) {
                toast.success(t("userStaff.restStaffDeletedSucc"));
                getRestStaff(branchID);
            }
        } catch (error) {
            console.log("error delete RestStaff ", error);
            toast.error(t("restStaffDeletedSucc"));

        }
    }
    // New states for search functionality Search
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchClick = () => {
        setShowSearch(!showSearch);
        setSearchQuery(''); // Reset search query when toggling
    };

    // Filter tickets based on search query
    const filteredRestStaff = RestStaff?.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpen = () => setModalOpen(true);

    const handleClose = () => {
        setModalOpen(false);
        getRestStaff(branchID); // Refresh the staff data after closing the modal
    }

    const handleExport = () => {

        const dataToExport = RestStaff.map((row) => ({
            "Name": row.name,
            "Role": row.role,
            "Orders": row.orders,
            "Status": row.status,
        }));


        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");


        XLSX.writeFile(workbook, "User_Data.xlsx");
    };
    return (
        <Paper sx={{ padding: "15px 30px 50px 30px", marginTop: "20px", borderRadius: "20px" }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                padding="5px 0"
            >
                <Box sx={{ display: "flex", alignItem: "center" }}>
                    <span class="icon-manager" style={{ fontSize: "25px", color: "#D8E0E0", marginRight: "10px" }}></span>
                    <Typography variant='body1' sx={{ fontSize: "16px", color: theme.palette.text.gray }}>Staff</Typography>
                </Box>


                <Box sx={{ display: "flex" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                    >
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
                        <IconButton onClick={handleSearchClick}>
                            <span
                                className="icon-magnifier"
                                style={{ fontSize: "15px", color: theme.palette.text.gray }}
                            />
                        </IconButton>

                    </Box>
                    <Button
                        onClick={handleOpen}
                        sx={{ fontSize: "12px", color: theme.palette.orangePrimary.main, display: "flex", cursor: "pointer", textTransform: "capitalize" }} >Add
                        <span style={{ fontSize: "15px", color: theme.palette.orangePrimary.main, fontWeight: 700, paddingLeft: "6px" }}>+</span>
                    </Button>
                    <AddStaff open={modalOpen} onClose={handleClose} userStaff={userStaff} />

                    <Button onClick={handleExport}
                        variant="text"
                        sx={{ color: theme.palette.orangePrimary.main, textTransform: "capitalize", fontSize: "12px" }}>
                        Export
                        <ArrowForwardIosIcon sx={{ fontSize: "10px", color: theme.palette.orangePrimary.main }} />
                    </Button>

                </Box>
            </Box> {/* Header */}
            <Divider sx={{
                width: "100%", height: "2px", background: "linear-gradient(45deg, #FDB913, #F2672E)", borderRadius: "50px",
            }} />

            <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 5px' }}>
                <TableHead>
                    <TableRow sx={{ height: "20px", borderBottom: "2px solid #f0f0f0" }}>
                        {[t("name"), t("role"), t("Orders"), t("status"), " "].map((header) => (
                            <TableCell
                                key={header}
                                sx={{
                                    fontSize: "12px", padding: header === t("name") ? "3px 0 0 20px" : "3px", width: `${100 / 5}%`, textAlign: "left",
                                    color: theme.palette.text.gray
                                }}
                            >
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {filteredRestStaff?.map((row, index) => (
                        <TableRow
                            key={row.id}
                            sx={{
                                backgroundColor: index % 2 == 0 ? theme.palette.bodyColor.secandaryInput : '',
                                height: "20px",
                                borderRadius: '20px',
                                '& td:first-of-type': {
                                    borderTopLeftRadius: '20px',
                                    borderBottomLeftRadius: '20px',
                                },
                                '& td:last-of-type': {
                                    borderTopRightRadius: '20px',
                                    borderBottomRightRadius: '20px',
                                },
                            }}
                        >
                            <TableCell sx={{ color: theme.palette.text.gray_light, fontSize: '11px', padding: "0px 20px", width: `${100 / 4}%`, textAlign: "Left", borderBottom: "none" }}>
                                {row.name}
                            </TableCell>

                            <TableCell sx={{ color: theme.palette.text.gray_light, fontSize: '11px', padding: "0px 2px", width: `${100 / 5}%`, textAlign: "Left", borderBottom: "none" }}>
                                {row.role}
                            </TableCell>

                            <TableCell sx={{ fontWeight: 900, color: theme.palette.orangePrimary.main, fontSize: '11px', padding: "0px 2px", width: `${100 / 5}%`, textAlign: "Left", borderBottom: "none" }}>
                                {row.orders}
                            </TableCell>


                            <TableCell sx={{ color: theme.palette.text.gray_light, fontSize: '11px', padding: "0px 2px", width: `${100 / 5}%`, textAlign: "Left", borderBottom: "none" }}>
                                <Button sx={{
                                    color: "white", textTransform: "capitalize", fontSize: "10px", padding: "3px 25px", borderRadius: "20px",
                                    backgroundColor: row.status === "active" ? "rgb(69, 201, 131)" : "#f05e5e",
                                    "&:hover": { backgroundColor: row.status === "active" ? "#8DE6B6" : "#d04a4a" }
                                }}>
                                    {row.status}
                                </Button>
                            </TableCell>

                            <TableCell sx={{ padding: "0px 2px", width: `${100 / 5}%`, textAlign: "left", borderBottom: "none" }}>
                                <IconButton onClick={() => handleDeleteRestStaff(row.id)}>
                                    <span class="icon-delete" style={{ fontSize: "17px", color: theme.palette.text.gray_light }} />
                                </IconButton>
                                <IconButton >
                                    <Settings style={{ fontSize: "17px", color: theme.palette.text.gray_light }} />
                                </IconButton>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </Paper>
    );
};

export default StaffTable;

