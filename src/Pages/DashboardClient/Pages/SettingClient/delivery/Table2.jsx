import { Box, Divider, Typography, useTheme, Grid, IconButton, TableHead } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import AddRider from './AddRider';
import LoginIcon from '@mui/icons-material/Login';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL,BASE_URL_IMG } from "../../../../../utils/constants";

export const Table2 = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [modalOpen, setModalOpen] = useState(false);
    const [riderData, setRiderData] = useState([]);
    const [deliveryAreas, setDeliveryAreas] = useState([]);
    const selectedBranch = localStorage.getItem("selectedBranch")
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editData, setEditData] = useState(null);

    const handleOpen = () => {
        setEditData(null);
        setModalOpen(true);
    };
    const handleEdit = (row) => {
        setEditData(row);
        setModalOpen(true);
    };
    const handleClose = () => {
        setModalOpen(false);
        setEditData(null);
    };
    const handleSearchClick = () => setShowSearch(!showSearch);

    const handleDelete = async (id) => {
        try {
            const response = await axios({
                method: 'DELETE',

                url: `${BASE_URL}delivery/${id}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('Token')}`,
                },
            });

            if (response.data) {
                toast.success(t('rider deleted successfully'));
                getRiderData();
            }
        } catch (error) {
            console.error('Error deleting rider:', error);
            toast.error(t('deleting rider failed'));
        }
    };

    const getRiderData = async () => {
        const token = localStorage.getItem('Token');
        if (!token) {
            console.error('No token found. User might not be authenticated.');
            return;
        }

        try {

            const response = await axios.get(`${BASE_URL}delivery`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data) {
                setRiderData(response.data.delivery_riders || []);
            }
        } catch (error) {
            console.error('Error fetching rider Data:', error.response?.data || error.message);
        }
    };

    const getDeliveryArea = async () => {
        const token = localStorage.getItem('Token');
        if (!token) {
            console.error('No token found. User might not be authenticated.');
            return;
        }

        try {
            const response = await axios.get(

                `${BASE_URL}delivery_area`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data) {
                setDeliveryAreas(response.data.delivery_areas || []);
                console.log('Fetched delivery Data:', response.data.delivery_areas);
            }
        } catch (error) {
            console.error('Error fetching delivery Data:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (selectedBranch) {
            getRiderData();
            getDeliveryArea(); // Fetch delivery areas to map city names
        }
    }, [selectedBranch]);

    const filteredData = (Array.isArray(riderData) ? riderData : []).filter((row) =>
        row.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Helper function to get city name from delivery_areas_id
    const getCityName = (deliveryAreasId) => {
        const area = deliveryAreas.find((area) => area.id === deliveryAreasId);
        return area ? area.city : 'Unknown';
    };

    return (
        <Box sx={{ maxWidth: '100%', padding: '10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontSize: '15px', color: theme.palette.bodyColor.gray_white, display: 'flex' }}>
                    <span className="icon-rider" style={{ fontSize: '25px', color: theme.palette.bodyColor.gray_white, marginRight: '6px' }}></span>
                    {t('deliveryRiders')}
                </Typography>
                <Box display="flex" alignItems="center">
                    <Grid item xs>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                            {showSearch && (
                                <Box sx={{ width: '100%' }}>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t('Search by name...')}
                                        style={{
                                            width: '100%',
                                            padding: '6px 8px',
                                            borderRadius: '6px',
                                            border: '1px solid rgba(0, 0, 0, 0.23)',
                                            fontSize: '12px',
                                            outline: 'none',
                                            backgroundColor: '#fff',
                                        }}
                                    />
                                </Box>
                            )}
                            <IconButton onClick={handleSearchClick}>
                                <span className="icon-magnifier" style={{ fontSize: '15px', color: theme.palette.bodyColor.gray_white }} />
                            </IconButton>
                        </Box>
                    </Grid>
                    <Typography
                        onClick={handleOpen}
                        variant="body2"
                        sx={{
                            fontSize: '13px',
                            color: theme.palette.orangePrimary.main,
                            display: 'flex',
                            cursor: 'pointer',
                            marginLeft: '20px',
                        }}
                    >
                        {t('add')}
                        <span style={{ fontSize: '15px', color: '#424242', fontWeight: 700, paddingLeft: '6px' }}>+</span>
                    </Typography>
                    <AddRider open={modalOpen} onClose={handleClose} getRiderData={getRiderData} editData={editData} />
                </Box>
            </Box>

            <Divider sx={{ backgroundColor: theme.palette.orangePrimary.main, height: '1px', margin: '8px 0px' }} />

            <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 5px' }}>
                <TableHead>
                    <TableRow sx={{ height: '25px', borderBottom: '2px solid #f0f0f0' }}>
                        {[t('name'), t('city'), t('mobileNumber'), t('orders'), t('status'), ''].map((header) => (
                            <TableCell
                                key={header}
                                sx={{ fontSize: '11px', padding: '0px', width: `${100 / 6}%`, textAlign: 'center' }}
                            >
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredData.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                backgroundColor: index % 2 == 0 ? theme.palette.bodyColor.secandaryInput : '',
                                height: '25px',
                                borderRadius: '20px',
                                '&:nth-of-type(odd)': { borderRadius: '20px' },
                                '&:nth-of-type(even)': { borderRadius: '20px' },
                                '& td:first-of-type': { borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' },
                                '& td:last-of-type': { borderTopRightRadius: '20px', borderBottomRightRadius: '20px' },
                            }}
                        >
                            <TableCell
                                sx={{
                                    color: theme.palette.bodyColor.black_white,
                                    fontSize: '11px',
                                    padding: '2px 20px',
                                    width: `${100 / 6}%`,
                                    textAlign: 'center',
                                    borderBottom: 'none',
                                }}
                            >
                                {row.name}
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: theme.palette.bodyColor.black_white,
                                    fontSize: '11px',
                                    padding: '2px',
                                    width: `${100 / 6}%`,
                                    textAlign: 'center',
                                    borderBottom: 'none',
                                }}
                            >
                                {getCityName(row.delivery_areas_id)}
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: theme.palette.bodyColor.black_white,
                                    fontSize: '11px',
                                    padding: '2px',
                                    width: `${100 / 6}%`,
                                    textAlign: 'center',
                                    borderBottom: 'none',
                                }}
                            >
                                {row.phone}
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: theme.palette.orangePrimary.main,
                                    fontSize: '13px',
                                    fontWeight: '900',
                                    padding: '2px',
                                    width: `${100 / 6}%`,
                                    textAlign: 'center',
                                    borderBottom: 'none',
                                }}
                            >
                                {row.orders}
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontSize: '11px',
                                    padding: '2px',
                                    width: `${100 / 6}%`,
                                    textAlign: 'center',
                                    borderBottom: 'none',
                                    color: row.status_rider === 'Available' ? 'green' : row.status_rider === 'Busy' ? 'red' : 'defaultColor',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor:
                                            row.status_rider === 'Available' ? 'green' : row.status_rider === 'Busy' ? 'red' : 'defaultColor',
                                        marginRight: '5px',
                                    }}
                                ></span>
                                {t(row.status_rider)}
                            </TableCell>
                            <TableCell
                                sx={{ padding: '2px', width: `${100 / 6}%`, textAlign: 'center', borderBottom: 'none' }}
                            >
                                <IconButton size="small" onClick={() => handleEdit(row)}>
                                    <span className="icon-edit" style={{ color: theme.palette.orangePrimary.main, fontSize: '18px' }} />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                                    <span className="icon-delete" style={{ fontSize: '18px' }} />
                                </IconButton>
                                <IconButton size="small" sx={{ marginLeft: '15px' }}>
                                    <LoginIcon sx={{ color: '#ef7d00' }} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};