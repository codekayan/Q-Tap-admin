
import React, { useContext, useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  FormControl,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AddAreaModal from './AddAreaModal';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from "../../../../utils/constants"
import { useDispatch, useSelector } from "react-redux";
import { selectAreaData, createTable, updateTable } from "../../../../store/client/clientAdmin"


const AddTableModal = ({ open, onClose, tableData }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const selectedBranch = localStorage.getItem('selectedBranch');

  const dispatch = useDispatch() //
  const areaData = useSelector(selectAreaData)
  const { areas } = areaData;
  
  const [areaMenu, setAreaMenu] = useState('');
  const [size, setSize] = useState('');
  const [name, setName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleCloseAreaModal = () => setModalOpen(false);

  
  // Pre-fill form fields when editing
  useEffect(() => {
    if (tableData) {
      setName(tableData.name || '');
      setSize(tableData.size || '');
      setTableNumber(tableData.table_number || '');
      setAreaMenu(tableData.area_id || '');
    } else {
      setName('');
      setSize('');
      setTableNumber('');
      setAreaMenu('');
    }
  }, [tableData]);

  const handleSave = async () => {
    try {
      const dataFormat = {
        brunch_id: selectedBranch,
        area_id: areaMenu,
        name,
        size,
        table_number: tableNumber,
      };

      const url = tableData
        ? `${BASE_URL}tables/${tableData.id}` // Update existing table
        : `${BASE_URL}tables`; // Add new table

      const method = tableData ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        data: dataFormat,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('Token')}`,
        },
      });

      if (response.data) {
        toast.success(tableData ? t("table.updateSucc") : t("table.addSucc"));
        if (!tableData) {
          dispatch(createTable(response.data.table));
        } else {
          // Use response.data.table for update, not response.data.tables
          dispatch(updateTable(response.data.table));
        }
        onClose();
      }
    } catch (error) {
      // Log the actual error message for easier debugging
      console.error('Error saving table:', error?.response?.data || error.message || error);
      toast.error(t("table.saveErr"));
    }
  };



  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 3,
          boxShadow: 24,
          mx: 'auto',
          mt: '20vh',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ fontSize: '13px', color: theme.palette.bodyColor.gray_white }}>
            {tableData ? t("table.edit") : t("table.add")}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ fontSize: '20px', color: theme.palette.bodyColor.gray_white }} />
          </IconButton>
        </Box>
        <Divider sx={{ backgroundColor: '#FF6600', height: '1px' }} />

        {/* Name Field */}
        <Box sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'left' }}>
          <Typography variant="body2" sx={{ width: '25%', textAlign: 'center' }} color={theme.palette.bodyColor.gray_white} fontSize="12px">
            {t("name")}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                width: '90%',
                '& .MuiInputBase-input': {
                  height: '35px',
                  padding: '0px 14px',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: theme.palette.bodyColor.gray_white,
                },
              }}
              fullWidth
              placeholder={t("table.name")}
            />
          </Box>
        </Box>

        {/* Size Field */}
        <Box sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'left' }}>
          <Typography variant="body2" sx={{ width: '25%', textAlign: 'center' }} color={theme.palette.bodyColor.gray_white} fontSize="12px">
            {t("size.one")}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <TextField
              value={size}
              onChange={(e) => setSize(e.target.value)}
              sx={{
                width: '90%',
                '& .MuiInputBase-input': {
                  height: '35px',
                  padding: '0px 14px',
                  color: theme.palette.bodyColor.gray_white,
                  textAlign: 'left',
                  fontSize: '12px',
                },
              }}
              fullWidth
              placeholder={t("chairs")}
            />
          </Box>
        </Box>
        {/* table number Field */}
        <Box sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'left' }}>
          <Typography variant="body2" sx={{ width: '40%', textAlign: 'center' }} color={theme.palette.bodyColor.gray_white} fontSize="12px">
            {t("Table Number")}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <TextField
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              sx={{
                width: '90%',
                '& .MuiInputBase-input': {
                  height: '35px',
                  padding: '0px 14px',
                  color: theme.palette.bodyColor.gray_white,
                  textAlign: 'left',
                  fontSize: '12px',
                },
              }}
              fullWidth
              placeholder={t("table Number")}
            />
          </Box>
        </Box>

        {/* Area Field */}
        <Box sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'flex-start' }}>
          <Typography variant="body2" sx={{ width: '25%', textAlign: 'center' }} color={theme.palette.bodyColor.gray_white} fontSize="12px">
            {t("area")}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <FormControl sx={{ width: '90%' }}>
              <Select
                sx={{
                  '& .MuiInputBase-input': {
                    height: '35px',
                    padding: '0px 14px',
                    textAlign: 'left',
                    fontSize: '12px',
                    color: theme.palette.bodyColor.gray_white,
                    lineHeight: '35px',
                  },
                }}
                fullWidth
                displayEmpty
                value={areaMenu}
                onChange={(e) => setAreaMenu(e.target.value)}
                placeholder="Select Area"
              >
                {areas?.filter((area) => area?.brunch_id == selectedBranch)
                  .map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Add Area Button */}
        <Box
          onClick={handleOpen}
          sx={{ float: 'right', position: 'relative', top: '-30px', left: '20px', cursor: 'pointer' }}
        >
          <AddOutlinedIcon sx={{ fontSize: '32px', color: theme.palette.orangePrimary.main }} />
        </Box>
        <AddAreaModal open={modalOpen} onClose={handleCloseAreaModal} />

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Button
            variant="contained"
            color="warning"
            onClick={handleSave}
            sx={{
              mt: 4,
              borderRadius: '20px',
              height: '30px',
              width: '50%',
              textTransform: 'capitalize',
            }}
          >
            <CheckOutlinedIcon /> {t("save")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddTableModal;