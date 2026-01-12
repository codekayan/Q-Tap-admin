import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, IconButton, Divider, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { FormControl, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL,BASE_URL_IMG } from "../../../../../utils/constants";
import { Country, CountryName, Governorates } from '../../../../../utils/city';

const AddArea = ({ open, onClose, getDeliveryArea, editData }) => {
  const { t } = useTranslation();
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+20');
  const [cost, setCost] = useState('');
  const selectedBranch = localStorage.getItem("selectedBranch")

  // Populate form with edit data when editData changes
  useEffect(() => {
    if (editData) {
      setCountry(editData.country || '');
      setState(editData.state || '');
      setCity(editData.city || '');
      setPhoneNumber(editData.phone?.replace(/^\+\d+/, '') || ''); // Remove country code from phone
      setCountryCode(editData.phone?.match(/^\+\d+/)?.[0] || '+20'); // Extract country code
      setCost(editData.cost || '');
    } else {
      // Reset form for adding new
      setCountry('');
      setState('');
      setCity('');
      setPhoneNumber('');
      setCountryCode('+20');
      setCost('');
    }
  }, [editData]);

  const handleSubmit = async () => {
    try {
      if (!country || !city || !phoneNumber || !cost) {
        toast.error(t('plFillAllField'));
        return;
      }

      const formData = {
        brunch_id: selectedBranch,
        country,
        city,
        phone: `${countryCode}${phoneNumber}`,
        cost,
      };

      const token = localStorage.getItem('Token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      let response;
      if (editData) {
        // Update existing delivery area
        response = await axios({
          method: 'PUT',

          url: `${BASE_URL}delivery_area/${editData.id}`,
          data: formData,
          headers,
        });
      } else {
        // Add new delivery area
        response = await axios({
          method: 'POST',

          url: `${BASE_URL}delivery_area`,
          data: formData,
          headers,
        });
      }

      if (response.data) {
        toast.success(t(editData ? 'delivery updated successfully' : 'delivery added successfully'));
        onClose();
        getDeliveryArea();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t(editData ? 'updating delivery failed' : 'adding delivery failed'));
    }
  };

  return (
    <Modal
      disableScrollLock
      open={open}
      onClose={onClose}
      aria-labelledby="add-area-modal"
      aria-describedby="add-area-description"
    >
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
          <Typography variant="body1" sx={{ fontSize: '13px', color: '#424242' }}>
            {t(editData ? 'editDeliveryArea' : 'addDeliveryArea')}
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
          <Typography variant="body2" sx={{ width: '25%', textAlign: 'center' }} color="#424242" fontSize="12px">
            {t('country')}
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
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={t('selectCountry')}
              >

                <MenuItem value="" disabled sx={{ fontSize: '12px', color: 'gray' }}>
                  {t('selectCountry')}
                </MenuItem>
                {Object.values(Country).map(item => (<MenuItem value={item} sx={{ fontSize: '12px', color: 'gray' }}>
                  {CountryName[item]}
                </MenuItem>))}

              </Select>
            </FormControl>
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
          <Typography variant="body2" sx={{ width: '25%', textAlign: 'center' }} color="#424242" fontSize="12px">
            {t('state')}
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
                    lineHeight: '35px',
                    color: 'gray',
                  },
                }}
                fullWidth
                displayEmpty
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder={t('selectState')}
              >
                <MenuItem value="" disabled sx={{ fontSize: '12px', color: 'gray' }}>
                  {t('selectState')}
                </MenuItem>
                <MenuItem value="available" sx={{ fontSize: '12px', color: 'gray' }}>
                  Available
                </MenuItem>
                <MenuItem value="busy" sx={{ fontSize: '12px', color: 'gray' }}>
                  Busy
                </MenuItem>
              </Select>
            </FormControl>
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
          <Typography variant="body2" sx={{ width: '25%', textAlign: 'center' }} color="#424242" fontSize="12px">
            {t('city')}
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Select City"
              >
                <MenuItem value="" disabled sx={{ fontSize: '12px', color: 'gray' }}>
                  {t('selectCity')}
                </MenuItem>
                {country &&
                  Governorates[country].map(item => (
                    <MenuItem value="cairo" sx={{ fontSize: '12px', color: 'gray' }}>
                      {item}
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
          <Typography variant="body2" sx={{ width: '22%', textAlign: 'center' }} color="#424242" fontSize="12px">
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
            alignItems: 'left',
          }}
        >
          <Typography variant="body2" sx={{ width: '25%', textAlign: 'center' }} color="#424242" fontSize="12px">
            {t('cost')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <TextField
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              type="number"
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
              placeholder="0.00 EGP"
            />
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

export default AddArea;