import { Box, Divider, Typography, useTheme, Grid, IconButton, TableHead } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import AddArea from './AddArea';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL,BASE_URL_IMG } from "../../../../../utils/constants";
import { useSelector } from 'react-redux';
import { selectSelectedBranch } from '../../../../../store/client/clientAdmin';

export const Table1 = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [deliveryData, setDeliveryData] = useState([]);
  const branchID = useSelector(selectSelectedBranch)
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editData, setEditData] = useState(null); // State to hold data for editing

  const handleOpen = () => {
    setEditData(null); // Clear edit data for adding new
    setModalOpen(true);
  };
  const handleEdit = (row) => {
    setEditData(row); // Set the row data for editing
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
    setEditData(null); // Clear edit data on close
  };
  const handleSearchClick = () => setShowSearch(!showSearch);

  const handleDelete = async (id) => {
    try {
      const response = await axios({
        method: 'DELETE',

        url: `${BASE_URL}delivery_area/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`,
        },
      });

      if (response.data) {
        toast.success(t('delevery deleted successfully'));
        setDeliveryData(response.data.delivery_areas);
        getDeliveryArea();
      }
    } catch (error) {
      console.error('Error deleting delevery:', error);
      toast.error(t('deleting delevery failed'));
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
        setDeliveryData(response.data.delivery_areas);
      }
    } catch (error) {
      console.error('Error fetching delivery Data:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (branchID) {
      getDeliveryArea();
    }
  }, [branchID]);

  const filteredData = (deliveryData || []).filter((row) =>
    row.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: '100%', padding: '10px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ fontSize: '15px', color: theme.palette.bodyColor.gray_white, display: 'flex' }}>
          <span className="icon-scooter-1" style={{ fontSize: '25px', color: '#D8E0E0', marginRight: '6px' }}></span>
          {t('deliveryArea')}
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
                    placeholder={t('Search by country...')}
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
            <span style={{ fontSize: '15px', color: theme.palette.bodyColor.gray_white, fontWeight: 700, paddingLeft: '6px' }}>+</span>
          </Typography>
          <AddArea getDeliveryArea={getDeliveryArea} open={modalOpen} onClose={handleClose} editData={editData} />
        </Box>
      </Box>

      <Divider sx={{ backgroundColor: theme.palette.orangePrimary.main, height: '1px', margin: '8px 0px' }} />

      <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 5px' }}>
        <TableHead>
          <TableRow sx={{ height: '25px', borderBottom: '2px solid #f0f0f0' }}>
            {[t('country'), t('city'), t('phone'), t('cost'), ''].map((header) => (
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
          {filteredData?.map((row, index) => (
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
                <span sx={{ alignItems: 'center', display: 'flex' }}>{row.icon} {row.country}</span>
              </TableCell>
              {/* <TableCell
                sx={{
                  color: theme.palette.secondaryColor.main,
                  fontSize: '11px',
                  padding: '2px',
                  width: `${100 / 6}%`,
                  textAlign: 'center',
                  borderBottom: 'none',
                }}
              >
                {row.state}
              </TableCell> */}
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
                {row.city}
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
                  color: theme.palette.bodyColor.black_white,
                  fontSize: '11px',
                  padding: '2px',
                  width: `${100 / 6}%`,
                  textAlign: 'center',
                  borderBottom: 'none',
                }}
              >
                {row.cost}
                <span style={{ color: 'gray' }}> EGP</span>
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.orangePrimary.main,
                  padding: '2px',
                  width: `${100 / 6}%`,
                  textAlign: 'center',
                  borderBottom: 'none',
                }}
              >
                <IconButton size="small" onClick={() => handleEdit(row)}>
                  <span className="icon-edit" style={{ color: theme.palette.orangePrimary.main, fontSize: '18px' }} />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.id)} size="small" color="error">
                  <span className="icon-delete" style={{ fontSize: '18px' }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};