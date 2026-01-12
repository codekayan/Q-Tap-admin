import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, IconButton, Divider, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { FormControl, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL,BASE_URL_IMG } from "../../../../../utils/constants";

const AddRider = ({ open, onClose, getRiderData, editData }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+20');
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState('Available');
  const [deliveryAreasId, setDeliveryAreasId] = useState('');
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const selectedBranch = localStorage.getItem("selectedBranch")

  // Fetch delivery areas
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
      }
    } catch (error) {
      console.error('Error fetching delivery Data:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (open) {
      getDeliveryArea(); // Fetch delivery areas when modal opens
    }
  }, [open]);

  // Populate form with edit data when editData changes
  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      setPin(editData.pin || '');
      setStatus(editData.status_rider || 'Available');
      setDeliveryAreasId(editData.delivery_areas_id || '');

      // Handle phone number splitting
      if (editData.phone) {
        const phone = editData.phone;
        // List of valid country codes to check against
        const validCountryCodes = ['+20', '+1', '+39', '+33'];
        let foundCountryCode = '+20'; // Default fallback
        let number = phone;

        // Check if phone starts with any valid country code
        for (const code of validCountryCodes) {
          if (phone.startsWith(code)) {
            foundCountryCode = code;
            number = phone.substring(code.length);
            break;
          }
        }

        setCountryCode(foundCountryCode);
        setPhoneNumber(number);
      } else {
        setCountryCode('+20');
        setPhoneNumber('');
      }
    } else {
      // Reset form for adding new
      setName('');
      setPhoneNumber('');
      setCountryCode('+20');
      setPin('');
      setStatus('Available');
      setDeliveryAreasId('');
    }
  }, [editData]);

  const handleSubmit = async () => {
    try {
      if (!name || !phoneNumber || !pin || !status || !deliveryAreasId) {
        toast.error(t('plFillAllField'));
        return;
      }

      const formData = {
        brunch_id: selectedBranch,
        delivery_areas_id: deliveryAreasId,
        name,
        phone: `${countryCode}${phoneNumber}`,
        pin,
        status_rider: status,
      };


      const token = localStorage.getItem('Token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      let response;
      if (editData) {
        // Update existing rider
        response = await axios({
          method: 'PUT',

          url: `${BASE_URL}delivery/${editData.id}`,
          data: formData,
          headers,
        });
      } else {
        // Add new rider
        response = await axios({
          method: 'POST',

          url: `${BASE_URL}delivery`,
          data: formData,
          headers,
        });
      }
      if (response.data.success === false) {
        if (response.data.message.pin)

          toast.error(response.data.message.pin[0]);
        else
          toast.error(t(editData ? 'updating rider failed' : 'adding rider failed'));
      }
      else if (response.data) {
        toast.success(t(editData ? 'rider updated successfully' : 'rider added successfully'));

        onClose();
        getRiderData();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t(editData ? 'updating rider failed' : 'adding rider failed'));
    }
  };

  return (
    <Modal
      disableScrollLock
      open={open}
      onClose={onClose}
      aria-labelledby="add-rider-modal"
      aria-describedby="add-rider-description"
    >
      <Box
        sx={{
          width: 400,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 3,
          boxShadow: 24,
          mx: 'auto',
          mt: '5vh',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ fontSize: '13px', color: '#424242' }}>
            {t(editData ? 'editDeliveryRider' : 'addDeliveryRider')}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ fontSize: '20px', color: 'gray' }} />
          </IconButton>
        </Box>

        <Divider sx={{ backgroundColor: '#FF6600', height: '1px' }} />

        <Box
          sx={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="body2" sx={{ width: '20%', textAlign: 'center' }} color="#424242" fontSize="12px">
            {t('name')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <TextField
              sx={{
                width: '90%',
                '& .MuiInputBase-input': {
                  height: '35px',
                  padding: '0px 14px',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: 'gray',
                },
              }}
              fullWidth
              placeholder={t('riderFullName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
        </Box>

        <Box
          sx={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="body2" sx={{ width: '33%', textAlign: 'center' }} color="#424242" fontSize="12px">
            {t('deliveryArea')}
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
                    color: 'gray',
                    lineHeight: '35px',
                  },
                }}
                fullWidth
                displayEmpty
                value={deliveryAreasId}
                onChange={(e) => setDeliveryAreasId(e.target.value)}
                placeholder={t('selectDeliveryArea')}
              >
                <MenuItem value="" disabled sx={{ fontSize: '12px', color: 'gray' }}>
                  {t('selectDeliveryArea')}
                </MenuItem>
                {deliveryAreas.map((area) => (
                  <MenuItem key={area.id} value={area.id} sx={{ fontSize: '12px', color: 'gray' }}>
                    {area.city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box
          sx={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="body2" sx={{ width: '20%', textAlign: 'center' }} color="#424242" fontSize="12px">
            {t('phone')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              width: '90%',
              maxWidth: '400px',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            <FormControl sx={{ width: '35%' }}>
              <Select
                sx={{
                  '& .MuiInputBase-input': {
                    height: '35px',
                    padding: '0px 14px',
                    textAlign: 'left',
                    fontSize: '12px',
                    color: 'gray',
                    lineHeight: '35px',
                  },
                }}
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                displayEmpty
              >
                <MenuItem value="+20" sx={{ fontSize: '12px', color: 'gray' }}>
                  <img src="/images/Egypt.PNG" alt="Egypt Flag" width="20" height="15" style={{ marginRight: '5px' }} />
                  +20
                </MenuItem>
                <MenuItem value="+1" sx={{ fontSize: '12px', color: 'gray' }}>
                  <img src="/images/USA.png" alt="USA Flag" width="20" height="15" style={{ marginRight: '5px' }} />
                  +1
                </MenuItem>
                <MenuItem value="+39" sx={{ fontSize: '12px', color: 'gray' }}>
                  <img src="/images/Italy.jpeg" alt="Italy" width="20" height="15" style={{ marginRight: '5px' }} />
                  +39
                </MenuItem>
                <MenuItem value="+33" sx={{ fontSize: '12px', color: 'gray' }}>
                  <img src="/images/France.jpeg" alt="France" width="20" height="15" style={{ marginRight: '5px' }} />
                  +33
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              sx={{
                width: '70%',
                '& .MuiInputBase-input': {
                  height: '35px',
                  padding: '0px 14px',
                  fontSize: '12px',
                  color: 'gray',
                  lineHeight: '35px',
                },
              }}
              placeholder="100 123 4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Box>
        </Box>

        <Box
          sx={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="body2" sx={{ width: '17%', textAlign: 'center' }} color="#424242" fontSize="12px">
            {t('pin')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <TextField
              sx={{
                width: '90%',
                '& .MuiInputBase-input': {
                  height: '35px',
                  padding: '0px 14px',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: 'gray',
                },
              }}
              fullWidth
              placeholder={t('enterPin')}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </Box>
        </Box>

        {/* <Box
          sx={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="body2" sx={{ width: '20%', textAlign: 'center' }} color="#424242" fontSize="12px">
            {t('orders')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <TextField
              sx={{
                width: '90%',
                '& .MuiInputBase-input': {
                  height: '35px',
                  padding: '0px 14px',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: 'gray',
                },
              }}
              fullWidth
              type="number"
              placeholder={t('enterOrders')}
              value={orders}
              onChange={(e) => setOrders(e.target.value)}
            />
          </Box>
        </Box> */}

        <Box
          sx={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="body2" sx={{ width: '20%', textAlign: 'center' }} color="#424242" fontSize="12px">
            {t('status')}
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
                    color: 'gray',
                    lineHeight: '35px',
                  },
                }}
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Available" sx={{ fontSize: '12px', color: 'gray' }}>
                  {t('Available')}
                </MenuItem>
                <MenuItem value="Busy" sx={{ fontSize: '12px', color: 'gray' }}>
                  {t('Busy')}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="warning"
            sx={{
              mt: 4,
              borderRadius: '20px',
              height: '30px',
              width: '50%',
              textTransform: 'capitalize',
            }}
          >
            <DoneIcon sx={{ fontSize: '20px', mr: 1 }} /> {t(editData ? 'update' : 'save')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddRider;