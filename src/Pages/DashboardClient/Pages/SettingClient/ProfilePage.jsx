import React, { useContext, useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  Divider,
  FormControl,
  OutlinedInput,
  InputAdornment,
  MenuItem,
  Select,
  Paper,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import TableBarIcon from '@mui/icons-material/TableBar';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BASE_URL,BASE_URL_IMG } from "../../../../utils/constants";
import { Country, Governorates } from './../../../../utils/city';
import MapWithPin from '../../../../utils/MapWithPin';
import { useDispatch, useSelector } from 'react-redux';
import { selectGetInfoData, selectSelectedBranch, updateInfoOnly, updateSelectedBranch } from '../../../../store/client/clientAdmin';
import { BusinessLang, BusinessTypes, printFormData } from '../../../../utils/utils';

const ProfilePage = () => {
  const theme = useTheme();
  // Personal Info State
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { t } = useTranslation();

  // Business Info State
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessCountry, setBusinessCountry] = useState('');
  const [businessCity, setBusinessCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [businessFormat, setBusinessFormat] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [lang, setLang] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentTime, setPaymentTime] = useState('');
  const [callWaiter, setCallWaiter] = useState('');
  // Context and localStorage Data

  const allClientData = localStorage.getItem('UserData');
  // const selectedBranch = localStorage.getItem('selectedBranch');
  const parsedClientData = allClientData ? JSON.parse(allClientData) : null;
  const user = parsedClientData?.user;
  const data = useSelector(selectGetInfoData)
  const qtap_clients = data?.qtap_clients;


  const branchID = useSelector(selectSelectedBranch)
  const [imageFile, setImageFile] = useState(null);

  const dispatch = useDispatch()
  // useEffect(() => {
  //   const handleStorageChange = (event) => {
  //     if (event.key === 'selectedBranch') {
  //       const newBranch = event.newValue || '';
  //       dispatch(updateSelectedBranch(newBranch))
  //     }
  //   };

  //   window.addEventListener('storage', handleStorageChange);

  //   // Optional: Poll localStorage for same-tab changes
  //   const interval = setInterval(() => {
  //     const currentBranch = localStorage.getItem('selectedBranch') || '';
  //     if (currentBranch !== selectedBranch) {
  //       dispatch(updateSelectedBranch(newBranch)
  //     }
  //   }, 1000); // Check every 1 second

  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //     clearInterval(interval); // Clean up interval
  //   };
  // }, [selectedBranch]);
  // Populate state when clientData or selectedBranch changes
  useEffect(() => {

    if (!qtap_clients) {
      return;
    }
    const [birthYear, birthMonth, birthDay] = qtap_clients.birth_date?.split('-') || [];

    // Populate Personal Info
    setFullName(qtap_clients.name || '');
    setPhone(qtap_clients.mobile || '');
    setEmail(user?.email || '');
    setMonth(birthMonth || '');
    setDay(birthDay || '');
    setYear(birthYear || '');
    setCountry(qtap_clients.country || '');
    setPassword(user?.password || '');
    setConfirmPassword(user?.confirmPassword || '');

    // Populate Business Info based on selectedBranch
    if (branchID) {
      const branch = qtap_clients?.brunchs?.find((b) => b.id === parseInt(branchID));
      if (branch) {
        setBusinessName(branch.business_name || '');
        setBusinessPhone(branch.contact_info?.[0]?.business_phone?.split(',')[0] || '');
        setBusinessEmail(branch.contact_info?.[0]?.business_email?.split(',')[0] || '');
        setBusinessCountry(branch.business_country || '');
        setBusinessCity(branch.business_city || '');
        setLatitude(branch.latitude || '');
        setLongitude(branch.longitude || '');
        setBusinessFormat(branch.business_format || '');
        setBusinessType(branch.business_types || 'restaurant');
        setLang(branch.default_lang || 'english');
        setTableNumber(branch.tables_number || '1');
        setPaymentTime(branch.payment_time || '');
        setCallWaiter(branch.call_waiter || '');
        setWebsite(branch.contact_info?.[0]?.website?.split(',')[0] || '');
      }
    }
  }, [qtap_clients, branchID]); // Depend on qtap_clients directly

  // 
  /* 
  ***
  **  Handle Save Button Click
  *****************************
  */
  const handleSave = async () => {

    if (!password || !confirmPassword) {
      toast.error(t("please enter password and confirm password"));
      return; // Stop further execution
    }
    if ((password && confirmPassword) && (password !== confirmPassword)) {
      toast.error(t("password not match"));
      return; // Stop further execution
    }
    setIsLoading(true)
    const formData = new FormData();

    // Basic fields
    formData.append('brunch_id', branchID);
    formData.append('name', fullName);
    formData.append('mobile', phone);
    formData.append('email', email);
    formData.append('birth_date', `${year.padStart(2, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    formData.append('country', country);
    formData.append('password', password);
    formData.append('business_name', businessName);
    formData.append('business_country', businessCountry);
    formData.append('business_city', businessCity);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    formData.append('currency_id', '1');
    formData.append('business_format', businessFormat);
    formData.append('tables_number', tableNumber.toString());
    formData.append('business_types', businessType.toString());
    formData.append('default_lang', lang.toString());

    const contactFields = {
      'business_phone': [businessPhone],
      'business_email': [businessEmail],
      'facebook': [''],
      'twitter': [''],
      'instagram': [''],
      'address': [''],
      'website': [website]
    };

    Object.entries(contactFields).forEach(([key, values]) => {
      values.forEach((value) => {
        // Always append, even if value is empty
        formData.append(`contact_info[${key}][]`, value || '-');
      });
    });


    if (imageFile) {
      formData.append('img', imageFile);
    }

    printFormData(formData)

    try {
      if (!qtap_clients.id) return;

      const response = await fetch(`${BASE_URL}clients_update_profile/${qtap_clients.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('Token')}`,
        },
        body: formData,
      });
      console.log(">>>>",response) // debug log
      const data = await response.json()
      console.log(">>>>",data) // debug log

      if (data.status === "success") {
        toast.success(t("updateSucc"));
        dispatch(updateInfoOnly(data)) // TODO:UPDATE REDUX
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error(t("occuredErr"));
    } finally {
      setIsLoading(false)
    }
  };


  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file)
    }
  };


  const [isMapOpen, setIsMapOpen] = useState(false)
  const updateBranchPosition = (data) => {
    // data :LatLng {lat: 30.029309166465175, lng: 31.474840247805297}
    setLatitude(data.lat)
    setLongitude(data.lng)
  }


  return (
    <Paper elevation={3} style={{ padding: '20px 30px', borderRadius: '10px', marginTop: '16px' }}>
      <Box elevation={3} sx={{ paddingTop: '15px' }}>
        <Grid container spacing={{ xl: "-100px", lg: "-10px", sm: "-50px" }} justifyContent="space-between">
          {/* <Box display="flex" justifyContent="space-around" paddingTop="20px"> */}
          {/* Profile Image Column */}
          <Grid item xs={12} sm={12} md={4} lg={2} container justifyContent="center" alignItems="flex-start">
            <Box textAlign="center" position="relative">
              <Box
                sx={{
                  width: { xs: "100%", md: "150px" },
                  height: { xs: "100%", md: "150px" },
                  borderRadius: '50%',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >

                <img src={imageFile
                  ? imageFile instanceof File
                    ? URL.createObjectURL(imageFile)
                    : imageFile // assume it's a string URL
                  : `${BASE_URL_IMG}${qtap_clients?.img}` || '/images/User.jpg'} alt="user" width="110%" />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: '18%',
                    backgroundColor: '#4b4a4a',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: 'white',
                    fontSize: '8px',
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload">
                    <EditOutlinedIcon sx={{ color: 'white', fontSize: '20px' }} />
                  </label>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ fontSize: '14px', color: '#3b3a3a', marginTop: '8px', width: "80%" }}>
                {fullName}
              </Typography>
            </Box>
          </Grid>

          {/* Personal Info Column */}
          <Grid item xs={12} sm={12} md={8} lg={3} justifyContent="center" alignItems="center">
            <Typography variant="body2" sx={{ fontSize: '13px' }} color={theme.palette.text.gray_white} gutterBottom>
              {t("personalInfo")}
            </Typography>
            <Divider
              sx={{ width: '28%', borderRadius: '30px', borderBottom: '3px solid #ef7d00', marginBottom: '18px' }}
            />

            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                id="outlined-fullname"
                startAdornment={
                  <InputAdornment position="start">
                    <PersonOutlinedIcon sx={{ fontSize: '18px' }} />
                  </InputAdornment>
                }
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("fullName")}
                sx={{ borderRadius: '6px', marginBottom: '18px', height: '33px', fontSize: '10px' }}
              />
            </FormControl>

            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                id="outlined-phone"
                startAdornment={
                  <InputAdornment position="start">
                    <PhoneOutlinedIcon sx={{ fontSize: '18px' }} />
                  </InputAdornment>
                }
                placeholder={t("mobileNumber")}
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={{ borderRadius: '6px', marginBottom: '18px', height: '33px', fontSize: '10px' }}
              />
            </FormControl>

            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                id="outlined-email"
                type="email"
                startAdornment={
                  <InputAdornment position="start">
                    <MailOutlinedIcon sx={{ fontSize: '18px' }} />
                  </InputAdornment>
                }
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email")}
                sx={{ borderRadius: '6px', marginBottom: '18px', height: '33px', fontSize: '10px' }}
              />
            </FormControl>

            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                placeholder={t("website")}
                startAdornment={
                  <InputAdornment position="start">
                    <LanguageOutlinedIcon sx={{ fontSize: '18px' }} />
                  </InputAdornment>
                }
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                sx={{
                  borderRadius: '10px',
                  height: '35px',
                  fontSize: '10px',
                  marginBottom: '18px',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    outline: 'none',
                  },
                }}
              />
            </FormControl>

            <Grid container alignItems="center" sx={{ marginBottom: '18px' }}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid container alignItems="center" sx={{ color: 'grey', marginTop: '5px' }}>
                  <CalendarMonthOutlinedIcon sx={{ marginRight: 1, fontSize: '15px' }} />
                  <Typography variant="body1" sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
                    {t("dateOfBirth")}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <Select
                    id="outlined-month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    displayEmpty
                    sx={{
                      borderRadius: '6px',
                      height: '33px',
                      fontSize: '10px',
                      color: 'gray',
                      marginRight: '5px',
                    }}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '12px', color: 'gray' }}>
                      {t("month")}
                    </MenuItem>
                    {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
                      <MenuItem key={m} value={m} sx={{ fontSize: '12px', color: 'gray' }}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <Select
                    id="outlined-day"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    displayEmpty
                    sx={{
                      borderRadius: '6px',
                      height: '33px',
                      fontSize: '10px',
                      color: 'gray',
                      marginRight: '5px',
                    }}
                  >
                    <MenuItem value="" disabled>
                      {t("day")}
                    </MenuItem>
                    {[...Array(31).keys()].map((i) => (
                      <MenuItem
                        key={i + 1}
                        value={String(i + 1).padStart(2, '0')}
                        sx={{ fontSize: '12px', color: 'gray' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <Select
                    id="outlined-year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: 'gray' }}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '12px', color: 'gray' }}>
                      {t("year")}
                    </MenuItem>
                    {Array.from({ length: 2025 - 1900 + 1 }, (_, i) => 1900 + i).map((y) => (
                      <MenuItem key={y} value={y} sx={{ fontSize: '12px', color: 'gray' }}>
                        {y}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <FormControl variant="outlined" fullWidth>
              <Select
                id="outlined-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                displayEmpty
                sx={{
                  marginBottom: '18px',
                  borderRadius: '6px',
                  height: '33px',
                  fontSize: '10px',
                  color: 'gray',
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <img src="/assets/location.svg" alt="location icon" style={{ width: '18px', height: '16px' }} />
                  </InputAdornment>
                }
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="" disabled sx={{ fontSize: '12px', color: 'gray' }}>
                  {t("country")}{country}
                </MenuItem>
                <MenuItem value={Country.EGYPT} sx={{ fontSize: '12px', color: 'gray' }}>
                  EGYPT
                </MenuItem>
                <MenuItem value={Country.USA} sx={{ fontSize: '12px', color: 'gray' }}>
                  United States
                </MenuItem>
                <MenuItem value={Country.CANADA} sx={{ fontSize: '12px', color: 'gray' }}>
                  Canada
                </MenuItem>
                <MenuItem value={Country.UK} sx={{ fontSize: '12px', color: 'gray' }}>
                  United Kingdom
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                id="outlined-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <span className="icon-padlock" style={{ fontSize: '16px' }}></span>
                  </InputAdornment>
                }
                placeholder={t("password")}
                sx={{ borderRadius: '6px', marginBottom: '18px', height: '33px', fontSize: '10px' }}
              />
            </FormControl>

            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                id="outlined-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <span className="icon-padlock" style={{ fontSize: '16px' }}></span>
                  </InputAdornment>
                }
                placeholder={t("confirmPass")}
                sx={{ marginBottom: '18px', borderRadius: '10px', height: '33px', fontSize: '12px' }}
              />
            </FormControl>
          </Grid>

          <Box item xs={1} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Divider orientation="vertical" sx={{ backgroundColor: '#f4f6fc', width: '2px', height: '100%' }} />
          </Box>

          {/* Business Info Column */}
          <Grid item xs={12} sm={12} md={12} lg={3} justifyContent="center" alignItems="center">
            <Typography variant="body2" sx={{ fontSize: '13px' }} color={theme.palette.text.gray_white} gutterBottom>
              {t("busnessInfo")}
            </Typography>
            <Divider
              sx={{ width: '28%', borderRadius: '30px', borderBottom: '3px solid #ef7d00', marginBottom: '18px' }}
            />

            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                id="outlined-business-name"
                startAdornment={
                  <InputAdornment position="start">
                    <StorefrontOutlinedIcon sx={{ fontSize: '18px' }} />
                  </InputAdornment>
                }
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={t("businessName")}
                sx={{ borderRadius: '6px', marginBottom: '10px !important', height: '33px', fontSize: '10px' }}
              />
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px', position: "relative" }}>
              <FormControl variant="outlined" fullWidth>
                <OutlinedInput
                  id="outlined-business-phone"
                  startAdornment={
                    <InputAdornment position="start">
                      <PhoneOutlinedIcon sx={{ fontSize: '20px' }} />
                    </InputAdornment>
                  }
                  required
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  placeholder={t("businessPhone")}
                  sx={{ borderRadius: '6px', height: '33px', fontSize: '10px' }}
                />
              </FormControl>
              <AddIcon
                sx={{
                  position: 'absolute',
                  top: '3px',
                  left: '100%',
                  color: theme.palette.orangePrimary.main,
                  fontSize: '24px',
                  "& path": { stroke: theme.palette.orangePrimary.main, strokeWidth: 2 }
                }}
              />
            </Box>

            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                id="outlined-business-email"
                startAdornment={
                  <InputAdornment position="start">
                    <MailOutlinedIcon sx={{ fontSize: '18px' }} />
                  </InputAdornment>
                }
                required
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder={t("businessEmailNotOptional")}
                type="email"
                sx={{ borderRadius: '6px', marginBottom: '10px', height: '33px', fontSize: '10px' }}
              />
            </FormControl>

            <Box display="flex" justifyContent="space-between" width="100%" marginBottom="10px">
              <FormControl variant="outlined" sx={{ width: '48%' }}>
                <Select
                  id="outlined-business-country"
                  value={businessCountry}
                  onChange={(e) => setBusinessCountry(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: theme.palette.text.gray_white }}
                  startAdornment={
                    <InputAdornment position="start">
                      <img src="/assets/location.svg" alt="location icon" style={{ width: '18px', height: '16px' }} />
                    </InputAdornment>
                  }
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
                    {t("country")}
                  </MenuItem>
                  <MenuItem value={Country.USA} sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
                    United States
                  </MenuItem>
                  <MenuItem value={Country.EGYPT} sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
                    EGYPT
                  </MenuItem>
                  <MenuItem value={Country.CANADA} sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
                    Canada
                  </MenuItem>
                  <MenuItem value={Country.UK} sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
                    United Kingdom
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" sx={{ width: '48%' }}>
                <Select
                  id="outlined-business-city"
                  value={businessCity}
                  onChange={(e) => setBusinessCity(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: theme.palette.text.gray_white }}
                  startAdornment={
                    <InputAdornment position="start">
                      <img src="/assets/location.svg" alt="location icon" style={{ width: '18px', height: '16px' }} />
                    </InputAdornment>
                  }
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
                    {t("city")}
                  </MenuItem>
                  {Governorates[Country.EGYPT].map((city) => (
                    <MenuItem value={city} sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
                      {city}
                    </MenuItem>
                  ))}
                  <MenuItem value="NY" sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
                    New York
                  </MenuItem>
                  <MenuItem value="LA" sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
                    Los Angeles
                  </MenuItem>
                  <MenuItem value="CHI" sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
                    Chicago
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box display="flex" alignItems="center" marginBottom="10px">
              {/* <Button
                variant="contained"
                fullWidth
                sx={{
                  textTransform: 'capitalize',
                  backgroundColor: theme.palette.secondaryColor.main,
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '9px',
                  height: '35px',
                  '&:hover': { backgroundColor: '#322240' },
                }}
              >
                <span className="icon-map-1" style={{ fontSize: '20px', marginRight: '10px' }}></span>
                {t("pinYourLocation")}
              </Button> */}
              <MapWithPin setPos={updateBranchPosition} currentPos={{ latitude, longitude }} isMapOpen={isMapOpen} setIsMapOpen={setIsMapOpen} />
            </Box>

            <FormControl variant="outlined" sx={{ width: '100%', marginBottom: '10px' }}>
              <Select
                id="outlined-currency"
                value={businessFormat}
                onChange={(e) => setBusinessFormat(e.target.value)}
                displayEmpty
                sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: 'gray' }}
                startAdornment={
                  <InputAdornment position="start">
                    <img src="/assets/revenue.svg" alt="icon" style={{ width: '16px', height: '16px' }} />
                  </InputAdornment>
                }
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="" disabled>
                  {t("currency")}
                </MenuItem>
                <MenuItem value="UL" sx={{ fontSize: '12px', color: 'gray' }}>
                  United States
                </MenuItem>
                <MenuItem value="UK" sx={{ fontSize: '12px', color: 'gray' }}>
                  United Kingdom
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ width: '100%', marginBottom: '10px' }}>
              <Select
                id="outlined-business-type"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                displayEmpty
                sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: 'gray' }}
                startAdornment={
                  <InputAdornment position="start">
                    <span className="icon-briefcase" style={{ fontSize: '16px' }} />
                  </InputAdornment>
                }
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="" disabled>
                  {t("businessType")}
                </MenuItem>
                <MenuItem value={BusinessTypes.RESTAURANT} sx={{ fontSize: '12px', color: 'gray' }}>
                  {t("restaurant")}
                </MenuItem>
                <MenuItem value={BusinessTypes.CAFE} sx={{ fontSize: '12px', color: 'gray' }}>
                  {t("cafe")}
                </MenuItem>
                <MenuItem value={BusinessTypes.CLOUD} sx={{ fontSize: '12px', color: 'gray' }}>
                  {t("cloudKitchens")}
                </MenuItem>
                <MenuItem value={BusinessTypes.FAST_FOOD} sx={{ fontSize: '12px', color: 'gray' }}>
                  {t("fastFood")}
                </MenuItem>
                <MenuItem value={BusinessTypes.TRUCK} sx={{ fontSize: '12px', color: 'gray' }}>
                  {t("foodTruch")}
                </MenuItem>
                <MenuItem value={BusinessTypes.BAKERY} sx={{ fontSize: '12px', color: 'gray' }}>
                  {t("bakeryStore")}
                </MenuItem>
                <MenuItem value={BusinessTypes.PASTRY} sx={{ fontSize: '12px', color: 'gray' }}>
                  {t("pastryStore")}
                </MenuItem>
                <MenuItem value={BusinessTypes.FRUITS} sx={{ fontSize: '12px', color: 'gray' }}>
                  {t("fruitsStore")}
                </MenuItem>
                <MenuItem value={BusinessTypes.RETAIL} sx={{ fontSize: '12px', color: 'gray' }}>
                  {t("retailStore")}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ width: '100%', marginBottom: '10px' }}>
              <Select
                id="outlined-menu-language"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                displayEmpty
                sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: 'gray' }}
                startAdornment={
                  <InputAdornment position="start">
                    <LanguageOutlinedIcon sx={{ fontSize: '18px' }} />
                  </InputAdornment>
                }
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="" disabled>
                  {t("menuDefLang")}
                </MenuItem>
                <MenuItem value={BusinessLang.EN} sx={{ fontSize: '12px', color: 'gray' }}>
                  English
                </MenuItem>
                <MenuItem value={BusinessLang.AR} sx={{ fontSize: '12px', color: 'gray' }}>
                  Arabic
                </MenuItem>
                {/* <MenuItem value="3" sx={{ fontSize: '12px', color: 'gray' }}>
                  France
                </MenuItem> */}
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ width: '100%', marginBottom: '10px' }}>
              <Select
                id="outlined-tables"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                displayEmpty
                sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: 'gray' }}
                startAdornment={
                  <InputAdornment position="start">
                    <TableBarIcon sx={{ fontSize: '18px' }} />
                  </InputAdornment>
                }
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="" disabled sx={{ fontSize: '12px', color: 'gray' }}>
                  {t("HowManyTablesDoYouHave")}
                </MenuItem>
                {[...Array(12).keys()].map((i) => (
                  <MenuItem key={i + 1} value={i + 1} sx={{ fontSize: '12px', color: 'gray' }}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ width: '100%', borderBottom: '1px solid #9d9d9c', marginBottom: '18px' }} />

            <Typography variant="body2" sx={{ fontSize: '10px', color: theme.palette.text.gray_white, display: 'flex' }}>
              <span className="icon-price-tag" style={{ fontSize: '17px', marginRight: '6px' }} /> {t("bundle")}
            </Typography>

            <Box display="flex" alignItems="center" justifyContent="flex-start" mb={2}>
              <Button
                variant="outlined"
                sx={{
                  border: '1px solid gray',
                  textTransform: 'capitalize',
                  color: theme.palette.text.gray_white,
                  padding: '1px 20px',
                  borderRadius: '6px',
                  fontSize: '11px',
                }}
              >
                <CheckOutlinedIcon sx={{ fontSize: '18px', marginRight: '6px', color: ' #ef7d00' }} />
                {t("pro")}
              </Button>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.secondaryColor.main,
                  textTransform: 'capitalize',
                  color: 'white',
                  padding: '3px 20px',
                  borderRadius: '8px',
                  marginLeft: '10px',
                  fontSize: '11px',
                  '&:hover': { backgroundColor: '#322240' },
                }}
              >
                {t("changeBundle")}
              </Button>
            </Box>
          </Grid>
          {/* </Box> */}

          {/* Save Button */}
          <Grid item xs={12} container justifyContent="center">
            <Button
              variant="contained"
              sx={{
                textTransform: 'capitalize',
                color: 'white',
                padding: '3px 55px',
                borderRadius: '20px',
                marginLeft: '15%',
                marginBottom: '20px',
                backgroundColor: theme.palette.orangePrimary.main,
                '&:hover': { backgroundColor: theme.palette.orangePrimary.main },
              }}
              size="large"
              onClick={handleSave}
              disabled={isLoading}
            >
              <CheckOutlinedIcon sx={{ fontSize: '18px', marginRight: '6px', color: 'white' }} />
              {t("save")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ProfilePage;




// import React, { useContext, useEffect, useState } from 'react';
// import {
//   Grid,
//   Typography,
//   Button,
//   Box,
//   Divider,
//   FormControl,
//   OutlinedInput,
//   InputAdornment,
//   MenuItem,
//   Select,
//   Paper,
//   useTheme,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
// import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
// import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
// import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
// import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
// import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
// import TableBarIcon from '@mui/icons-material/TableBar';
// import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
// import { useTranslation } from 'react-i18next';
// import {  '../../../../utils/helperFunction';
// import { toast } from 'react-toastify';

// const ProfilePage = () => {
//   const theme = useTheme();
//   const { t } = useTranslation();

//   // Personal Info State
//   const [fullName, setFullName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [website, setWebsite] = useState('');
//   const [month, setMonth] = useState('');
//   const [day, setDay] = useState('');
//   const [year, setYear] = useState('');
//   const [country, setCountry] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   // Business Info State
//   const [businessName, setBusinessName] = useState('');
//   const [businessPhones, setBusinessPhones] = useState(['']); // Array for multiple phone numbers
//   const [businessEmail, setBusinessEmail] = useState('');
//   const [businessCountry, setBusinessCountry] = useState('');
//   const [businessCity, setBusinessCity] = useState('');
//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');
//   const [businessFormat, setBusinessFormat] = useState('');
//   const [businessType, setBusinessType] = useState('');
//   const [lang, setLang] = useState('');
//   const [tableNumber, setTableNumber] = useState('');
//   const [paymentTime, setPaymentTime] = useState('');
//   const [callWaiter, setCallWaiter] = useState('');

//   // Image State
//   const [logoImage, setLogoImage] = useState(null);
//   const [logoFile, setLogoFile] = useState(null);

//   // Context and localStorage Data
//   const UserData = localStorage.getItem('UserData');
//   const parsedClientData = UserData ? JSON.parse(UserData) : null;
//   const user = parsedClientData?.user;
//   const qtap_clients = clientData?.qtap_clients;
//   const [selectedBranch, setSelectedBranch] = useState(localStorage.getItem('selectedBranch') || '');

//   useEffect(() => {
//     const handleStorageChange = (event) => {
//       if (event.key === 'selectedBranch') {
//         const newBranch = event.newValue || '';
//         setSelectedBranch(newBranch);
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     const interval = setInterval(() => {
//       const currentBranch = localStorage.getItem('selectedBranch') || '';
//       if (currentBranch !== selectedBranch) {
//         setSelectedBranch(currentBranch);
//       }
//     }, 1000);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//       clearInterval(interval);
//     };
//   }, [selectedBranch]);

//   useEffect(() => {
//     if (!qtap_clients) return;

//     const [birthYear, birthMonth, birthDay] = qtap_clients.birth_date?.split('-') || [];

//     // Populate Personal Info
//     setFullName(qtap_clients.name || '');
//     setPhone(qtap_clients.mobile || '');
//     setEmail(user?.email || '');
//     setMonth(birthMonth || '');
//     setDay(birthDay || '');
//     setYear(birthYear || '');
//     setCountry(qtap_clients.country || '');
//     setPassword(user?.password || '');
//     setConfirmPassword(user?.confirmPassword || '');
//     setLogoImage(qtap_clients?.img ? `${BASE_URL_IMG}${qtap_clients.img}` : null);

//     // Populate Business Info based on selectedBranch
//     if (selectedBranch) {
//       const branch = qtap_clients?.brunchs?.find((b) => b.id === parseInt(selectedBranch));
//       if (branch) {
//         setBusinessName(branch.business_name || '');
//         setBusinessPhones(
//           branch.contact_info?.[0]?.business_phone?.split(',') || [''] // Initialize with existing phones or empty
//         );
//         setBusinessEmail(branch.contact_info?.[0]?.business_email?.split(',')[0] || '');
//         setBusinessCountry(branch.business_country || '');
//         setBusinessCity(branch.business_city || '');
//         setLatitude(branch.latitude || '555.668848');
//         setLongitude(branch.longitude || '222.4684684');
//         setBusinessFormat(branch.business_format || '');
//         setBusinessType(branch.business_type || 'restaurant');
//         setLang(branch.language || 'english');
//         setTableNumber(branch.serving_ways[0]?.tables_number || '1');
//         setPaymentTime(branch.payment_time || '');
//         setCallWaiter(branch.call_waiter || '');
//         setWebsite(branch.contact_info?.[0]?.website?.split(',')[0] || '');
//       }
//     }
//   }, [qtap_clients, selectedBranch]);

//   // Handle Logo Upload
//   const handleLogoUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setLogoFile(file);
//       const imageUrl = URL.createObjectURL(file);
//       setLogoImage(imageUrl);
//     }
//   };

//   // Handle Adding New Phone Input
//   const handleAddPhone = () => {
//     setBusinessPhones([...businessPhones, '']);
//   };

//   // Handle Phone Input Change
//   const handlePhoneChange = (index, value) => {
//     const updatedPhones = [...businessPhones];
//     updatedPhones[index] = value;
//     setBusinessPhones(updatedPhones);
//   };

//   // Handle Save Button Click
//   const handleSave = async () => {

//     // Validation checks
//     if (!password || !confirmPassword) {
//       toast.error(t('please enter password and confirm password'));
//       return;
//     }
//     if (password !== confirmPassword) {
//       toast.error(t('password not match'));
//       return;
//     }
//     if (!qtap_clients?.id) {
//       toast.error(t('error: client data not found'));
//       return;
//     }

//     // Prepare form data
//     const formData = new FormData();
//     formData.append('brunch_id', selectedBranch);
//     formData.append('name', fullName);
//     formData.append('mobile', phone);
//     formData.append('email', email);
//     formData.append('birth_date', `${year}-${month}-${day}`);
//     formData.append('country', country);
//     formData.append('password', password);
//     if (logoFile) {
//       formData.append('img', logoFile);
//     }
//     formData.append('business_name', businessName);
//     formData.append('business_country', businessCountry);
//     formData.append('business_city', businessCity);
//     formData.append('latitude', '555.668848');
//     formData.append('longitude', '222.4684684');
//     formData.append('currency_id', '1');
//     formData.append('business_format', businessFormat);
//     formData.append('tables_number', tableNumber);

//     // Prepare contact_info as an array of one object
//     const contactInfo =
//     {
//       business_phone: businessPhones.filter((phone) => phone), // Filter out empty strings
//       business_email: [businessEmail],
//       facebook: [''], // Placeholder; adjust as needed
//       twitter: [''],
//       instagram: [''],
//       address: [''],
//       website: [website],
//     };

//     formData.append('contact_info', JSON.stringify(contactInfo));


//     // Log the request payload
//    ('Request payload:', {
//       brunch_id: selectedBranch,
//       name: fullName,
//       mobile: phone,
//       email,
//       birth_date: `${year}-${month}-${day}`,
//       country,
//       password,
//       business_name: businessName,
//       business_country: businessCountry,
//       business_city: businessCity,
//       latitude: '555.668848',
//       longitude: '222.4684684',
//       currency_id: '1',
//       business_format: businessFormat,
//       tables_number: tableNumber,
//       contact_info: contactInfo,
//     });

//     try {
//       const response = await fetch(`${BASE_URL}clients_update_profile/${qtap_clients.id}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('Token')}`,
//         },
//         body: formData,
//       });

//       const responseData = await response.json();

//       if (response.ok) {
//         toast.success(t('updateSucc'));
//         getClientData();
//       } else {
//         toast.error(t('updateErr') + ': ' + (responseData.message || 'Unknown error'));
//       }
//     } catch (error) {
//       console.error('Error in handleSave:', error);
//       toast.error(t('occuredErr'));
//     }
//   };

//   useEffect(() => {
//     getClientData();
//   }, []);

//   if (!qtap_clients) {
//     return <Typography>{t('loading')}</Typography>;
//   }

//   return (
//     <Paper elevation={3} style={{ padding: '20px 30px', borderRadius: '10px', marginTop: '16px' }}>
//       <Box elevation={3} sx={{ paddingTop: '15px' }}>
//         <Grid container spacing={{ xl: '-100px', lg: '-10px', sm: '-50px' }} justifyContent="space-between">
//           {/* Profile Image Column */}
//           <Grid item xs={12} sm={12} md={3} lg={2} container justifyContent="center" alignItems="flex-start">
//             <Box textAlign="center" position="relative">
//               <Box
//                 sx={{
//                   width: { xs: '100%', md: '150px' },
//                   height: { xs: '100%', md: '150px' },
//                   borderRadius: '50%',
//                   position: 'relative',
//                   overflow: 'hidden',
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   textAlign: 'center',
//                 }}
//               >
//                 <img
//                   src={logoImage || '/images/User.jpg'}
//                   alt="user"
//                   width="110%"
//                   onError={(e) => (e.target.src = '/images/User.jpg')}
//                 />
//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     bottom: 0,
//                     width: '100%',
//                     height: '18%',
//                     backgroundColor: '#4b4a4a',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     textAlign: 'center',
//                     color: 'white',
//                     fontSize: '8px',
//                   }}
//                 >
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleLogoUpload}
//                     style={{ display: 'none' }}
//                     id="logo-upload"
//                   />
//                   <label htmlFor="logo-upload">
//                     <EditOutlinedIcon sx={{ color: 'white', fontSize: '20px', cursor: 'pointer' }} />
//                   </label>
//                 </Box>
//               </Box>
//               <Typography variant="body2" sx={{ fontSize: '14px', color: '#3b3a3a', marginTop: '8px', width: '80%' }}>
//                 {fullName}
//               </Typography>
//             </Box>
//           </Grid>

//           {/* Personal Info Column */}
//           <Grid item xs={12} sm={12} md={3} lg={3} justifyContent="center" alignItems="center">
//             <Typography variant="body2" sx={{ fontSize: '13px' }} color={theme.palette.text.gray_white} gutterBottom>
//               {t('personalInfo')}
//             </Typography>
//             <Divider
//               sx={{ width: '28%', borderRadius: '30px', borderBottom: '3px solid #ef7d00', marginBottom: '18px' }}
//             />
//             <FormControl variant="outlined" fullWidth>
//               <OutlinedInput
//                 id="outlined-fullname"
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <PersonOutlinedIcon sx={{ fontSize: '18px' }} />
//                   </InputAdornment>
//                 }
//                 required
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 placeholder={t('fullName')}
//                 sx={{ borderRadius: '6px', marginBottom: '18px', height: '33px', fontSize: '10px' }}
//               />
//             </FormControl>
//             <FormControl variant="outlined" fullWidth>
//               <OutlinedInput
//                 id="outlined-phone"
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <PhoneOutlinedIcon sx={{ fontSize: '18px' }} />
//                   </InputAdornment>
//                 }
//                 placeholder={t('mobileNumber')}
//                 required
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 sx={{ borderRadius: '6px', marginBottom: '18px', height: '33px', fontSize: '10px' }}
//               />
//             </FormControl>
//             <FormControl variant="outlined" fullWidth>
//               <OutlinedInput
//                 id="outlined-email"
//                 type="email"
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <MailOutlinedIcon sx={{ fontSize: '18px' }} />
//                   </InputAdornment>
//                 }
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder={t('email')}
//                 sx={{ borderRadius: '6px', marginBottom: '18px', height: '33px', fontSize: '10px' }}
//               />
//             </FormControl>
//             <FormControl variant="outlined" fullWidth>
//               <OutlinedInput
//                 placeholder={t('website')}
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <LanguageOutlinedIcon sx={{ fontSize: '18px' }} />
//                   </InputAdornment>
//                 }
//                 required
//                 value={website}
//                 onChange={(e) => setWebsite(e.target.value)}
//                 sx={{
//                   borderRadius: '10px',
//                   height: '35px',
//                   fontSize: '10px',
//                   marginBottom: '18px',
//                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                     outline: 'none',
//                   },
//                 }}
//               />
//             </FormControl>
//             <Grid container alignItems="center" sx={{ marginBottom: '18px' }}>
//               <Grid item xs={12} sm={12} md={12} lg={12}>
//                 <Grid container alignItems="center" sx={{ color: 'grey', marginTop: '5px' }}>
//                   <CalendarMonthOutlinedIcon sx={{ marginRight: 1, fontSize: '15px' }} />
//                   <Typography variant="body1" sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
//                     {t('dateOfBirth')}
//                   </Typography>
//                 </Grid>
//               </Grid>
//               <Grid item xs={4}>
//                 <FormControl fullWidth>
//                   <Select
//                     id="outlined-month"
//                     value={month}
//                     onChange={(e) => setMonth(e.target.value)}
//                     displayEmpty
//                     sx={{
//                       borderRadius: '6px',
//                       height: '33px',
//                       fontSize: '10px',
//                       color: 'gray',
//                       marginRight: '5px',
//                     }}
//                   >
//                     <MenuItem value="" disabled sx={{ fontSize: '12px', color: 'gray' }}>
//                       {t('month')}
//                     </MenuItem>
//                     {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
//                       <MenuItem key={m} value={m} sx={{ fontSize: '12px', color: 'gray' }}>
//                         {m}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={4}>
//                 <FormControl fullWidth>
//                   <Select
//                     id="outlined-day"
//                     value={day}
//                     onChange={(e) => setDay(e.target.value)}
//                     displayEmpty
//                     sx={{
//                       borderRadius: '6px',
//                       height: '33px',
//                       fontSize: '10px',
//                       color: 'gray',
//                       marginRight: '5px',
//                     }}
//                   >
//                     <MenuItem value="" disabled>
//                       {t('day')}
//                     </MenuItem>
//                     {[...Array(31).keys()].map((i) => (
//                       <MenuItem
//                         key={i + 1}
//                         value={String(i + 1).padStart(2, '0')}
//                         sx={{ fontSize: '12px', color: 'gray' }}
//                       >
//                         {String(i + 1).padStart(2, '0')}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={4}>
//                 <FormControl fullWidth>
//                   <Select
//                     id="outlined-year"
//                     value={year}
//                     onChange={(e) => setYear(e.target.value)}
//                     displayEmpty
//                     sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: 'gray' }}
//                   >
//                     <MenuItem value="" disabled sx={{ fontSize: '12px', color: 'gray' }}>
//                       {t('year')}
//                     </MenuItem>
//                     {Array.from({ length: 2025 - 1900 + 1 }, (_, i) => 1900 + i).map((y) => (
//                       <MenuItem key={y} value={y} sx={{ fontSize: '12px', color: 'gray' }}>
//                         {y}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>
//             <FormControl variant="outlined" fullWidth>
//               <Select
//                 id="country"
//                 value={country}
//                 onChange={(e) => setCountry(e.target.value)}
//                 displayEmpty
//                 sx={{
//                   marginBottom: '18px',
//                   borderRadius: '6px',
//                   height: '33px',
//                   fontSize: '10px',
//                   color: 'gray',
//                 }}
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <img src="/assets/location.svg" alt="location icon" style={{ width: '18px', height: '16px' }} />
//                   </InputAdornment>
//                 }
//                 MenuProps={{ disableScrollLock: true }}
//               >
//                 <MenuItem value="" disabled sx={{ fontSize: '12px', color: 'gray' }}>
//                   {t('country')}
//                 </MenuItem>
//                 <MenuItem value="US" sx={{ fontSize: '12px', color: 'gray' }}>
//                   United States
//                 </MenuItem>
//                 <MenuItem value="CA" sx={{ fontSize: '12px', color: 'gray' }}>
//                   Canada
//                 </MenuItem>
//                 <MenuItem value="UK" sx={{ fontSize: '12px', color: 'gray' }}>
//                   United Kingdom
//                 </MenuItem>
//                 <MenuItem value="egypt" sx={{ fontSize: '12px', color: 'gray' }}>
//                   Egypt
//                 </MenuItem>
//               </Select>
//             </FormControl>
//             <FormControl variant="outlined" fullWidth>
//               <OutlinedInput
//                 id="outlined-password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <span className="icon-padlock" style={{ fontSize: '16px' }}></span>
//                   </InputAdornment>
//                 }
//                 placeholder={t('password')}
//                 sx={{ borderRadius: '6px', marginBottom: '18px', height: '33px', fontSize: '10px' }}
//               />
//             </FormControl>
//             <FormControl variant="outlined" fullWidth>
//               <OutlinedInput
//                 id="outlined-confirm-password"
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <span className="icon-padlock" style={{ fontSize: '16px' }}></span>
//                   </InputAdornment>
//                 }
//                 placeholder={t('confirmPass')}
//                 sx={{ marginBottom: '18px', borderRadius: '10px', height: '33px', fontSize: '12px' }}
//               />
//             </FormControl>
//           </Grid>
//           <Box item xs={1} sx={{ display: { xs: 'none', sm: 'block' } }}>
//             <Divider orientation="vertical" sx={{ backgroundColor: '#f4f6fc', width: '2px', height: '100%' }} />
//           </Box>
//           {/* Business Info Column */}
//           <Grid item xs={12} sm={12} md={3} lg={3} justifyContent="center" alignItems="center">
//             <Typography variant="body2" sx={{ fontSize: '13px' }} color={theme.palette.text.gray_white} gutterBottom>
//               {t('busnessInfo')}
//             </Typography>
//             <Divider
//               sx={{ width: '28%', borderRadius: '30px', borderBottom: '3px solid #ef7d00', marginBottom: '18px' }}
//             />
//             <FormControl variant="outlined" fullWidth>
//               <OutlinedInput
//                 id="outlined-business-name"
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <StorefrontOutlinedIcon sx={{ fontSize: '18px' }} />
//                   </InputAdornment>
//                 }
//                 required
//                 value={businessName}
//                 onChange={(e) => setBusinessName(e.target.value)}
//                 placeholder={t('businessName')}
//                 sx={{ borderRadius: '6px', marginBottom: '10px !important', height: '33px', fontSize: '10px' }}
//               />
//             </FormControl>
//             <Box sx={{ marginBottom: '10px', position: 'relative' }}>
//               {businessPhones.map((phone, index) => (
//                 <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//                   <FormControl variant="outlined" fullWidth>
//                     <OutlinedInput
//                       id={`outlined-business-phone-${index}`}
//                       startAdornment={
//                         <InputAdornment position="start">
//                           <PhoneOutlinedIcon sx={{ fontSize: '20px' }} />
//                         </InputAdornment>
//                       }
//                       required
//                       value={phone}
//                       onChange={(e) => handlePhoneChange(index, e.target.value)}
//                       placeholder={t('businessPhone')}
//                       sx={{ borderRadius: '6px', height: '33px', fontSize: '10px' }}
//                     />
//                   </FormControl>
//                   {index === businessPhones.length - 1 && (
//                     <AddIcon
//                       onClick={handleAddPhone}
//                       sx={{
//                         position: 'absolute',
//                         top: '3px',
//                         left: '100%',
//                         color: theme.palette.orangePrimary.main,
//                         fontSize: '24px',
//                         cursor: 'pointer',
//                         '& path': { stroke: theme.palette.orangePrimary.main, strokeWidth: 2 },
//                       }}
//                     />
//                   )}
//                 </Box>
//               ))}
//             </Box>
//             <FormControl variant="outlined" fullWidth>
//               <OutlinedInput
//                 id="outlined-business-email"
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <MailOutlinedIcon sx={{ fontSize: '18px' }} />
//                   </InputAdornment>
//                 }
//                 required
//                 value={businessEmail}
//                 onChange={(e) => setBusinessEmail(e.target.value)}
//                 placeholder={t('businessEmailNotOptional')}
//                 type="email"
//                 sx={{ borderRadius: '6px', marginBottom: '10px', height: '33px', fontSize: '10px' }}
//               />
//             </FormControl>
//             <Box display="flex" justifyContent="space-between" width="100%" marginBottom="10px">
//               <FormControl variant="outlined" sx={{ width: '48%' }}>
//                 <Select
//                   id="outlined-business-country"
//                   value={businessCountry}
//                   onChange={(e) => setBusinessCountry(e.target.value)}
//                   displayEmpty
//                   sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: theme.palette.text.gray_white }}
//                   startAdornment={
//                     <InputAdornment position="start">
//                       <img src="/assets/location.svg" alt="location icon" style={{ width: '18px', height: '16px' }} />
//                     </InputAdornment>
//                   }
//                   MenuProps={{ disableScrollLock: true }}
//                 >
//                   <MenuItem value="" disabled sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
//                     {t('country')}
//                   </MenuItem>
//                   <MenuItem value="US" sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
//                     United States
//                   </MenuItem>
//                   <MenuItem value="CA" sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
//                     Canada
//                   </MenuItem>
//                   <MenuItem value="UK" sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
//                     United Kingdom
//                   </MenuItem>
//                   <MenuItem value="egypt" sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
//                     Egypt
//                   </MenuItem>
//                 </Select>
//               </FormControl>
//               <FormControl variant="outlined" sx={{ width: '48%' }}>
//                 <Select
//                   id="outlined-business-city"
//                   value={businessCity}
//                   onChange={(e) => setBusinessCity(e.target.value)}
//                   displayEmpty
//                   sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: theme.palette.text.gray_white }}
//                   startAdornment={
//                     <InputAdornment position="start">
//                       <img src="/assets/location.svg" alt="location icon" style={{ width: '18px', height: '16px' }} />
//                     </InputAdornment>
//                   }
//                   MenuProps={{ disableScrollLock: true }}
//                 >
//                   <MenuItem value="" disabled sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
//                     {t('city')}
//                   </MenuItem>
//                   <MenuItem value="NY" sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
//                     New York
//                   </MenuItem>
//                   <MenuItem value="LA" sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
//                     Los Angeles
//                   </MenuItem>
//                   <MenuItem value="CHI" sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
//                     Chicago
//                   </MenuItem>
//                   <MenuItem value="cairo" sx={{ fontSize: '12px', color: theme.palette.text.gray_white }}>
//                     Cairo
//                   </MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
//             <Box display="flex" alignItems="center" marginBottom="10px">
//               <Button
//                 variant="contained"
//                 fullWidth
//                 sx={{
//                   textTransform: 'capitalize',
//                   backgroundColor: theme.palette.secondaryColor.main,
//                   color: 'white',
//                   borderRadius: '6px',
//                   fontSize: '9px',
//                   height: '35px',
//                   '&:hover': { backgroundColor: '#322240' },
//                 }}
//               >
//                 <span className="icon-map-1" style={{ fontSize: '20px', marginRight: '10px' }}></span>
//                 {t('pinYourLocation')}
//               </Button>
//             </Box>
//             <FormControl variant="outlined" sx={{ width: '100%', marginBottom: '10px' }}>
//               <Select
//                 id="outlined-currency"
//                 value={businessFormat}
//                 onChange={(e) => setBusinessFormat(e.target.value)}
//                 displayEmpty
//                 sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: 'gray' }}
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <img src="/assets/revenue.svg" alt="icon" style={{ width: '16px', height: '16px' }} />
//                   </InputAdornment>
//                 }
//                 MenuProps={{ disableScrollLock: true }}
//               >
//                 <MenuItem value="" disabled>
//                   {t('currency')}
//                 </MenuItem>
//                 <MenuItem value="US" sx={{ fontSize: '12px', color: 'gray' }}>
//                   United States
//                 </MenuItem>
//                 <MenuItem value="CA" sx={{ fontSize: '12px', color: 'gray' }}>
//                   Canada
//                 </MenuItem>
//                 <MenuItem value="UK" sx={{ fontSize: '12px', color: 'gray' }}>
//                   United Kingdom
//                 </MenuItem>
//               </Select>
//             </FormControl>
//             <FormControl variant="outlined" sx={{ width: '100%', marginBottom: '10px' }}>
//               <Select
//                 id="outlined-business-type"
//                 value={businessType}
//                 onChange={(e) => setBusinessType(e.target.value)}
//                 displayEmpty
//                 sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: 'gray' }}
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <span className="icon-briefcase" style={{ fontSize: '16px' }} />
//                   </InputAdornment>
//                 }
//                 MenuProps={{ disableScrollLock: true }}
//               >
//                 <MenuItem value="" disabled>
//                   {t('businessType')}
//                 </MenuItem>
//                 <MenuItem value="restaurant" sx={{ fontSize: '12px', color: 'gray' }}>
//                   {t('restaurant')}
//                 </MenuItem>
//                 <MenuItem value="cafe" sx={{ fontSize: '12px', color: 'gray' }}>
//                   {t('cafe')}
//                 </MenuItem>
//                 <MenuItem value="cloud" sx={{ fontSize: '12px', color: 'gray' }}>
//                   {t('cloudKitchens')}
//                 </MenuItem>
//                 <MenuItem value="fast" sx={{ fontSize: '12px', color: 'gray' }}>
//                   {t('fastFood')}
//                 </MenuItem>
//                 <MenuItem value="truck" sx={{ fontSize: '12px', color: 'gray' }}>
//                   {t('foodTruch')}
//                 </MenuItem>
//                 <MenuItem value="Bakery" sx={{ fontSize: '12px', color: 'gray' }}>
//                   {t('bakeryStore')}
//                 </MenuItem>
//                 <MenuItem value="Pastry" sx={{ fontSize: '12px', color: 'gray' }}>
//                   {t('pastryStore')}
//                 </MenuItem>
//                 <MenuItem value="Fruits" sx={{ fontSize: '12px', color: 'gray' }}>
//                   {t('fruitsStore')}
//                 </MenuItem>
//                 <MenuItem value="Retail" sx={{ fontSize: '12px', color: 'gray' }}>
//                   {t('retailStore')}
//                 </MenuItem>
//               </Select>
//             </FormControl>
//             <FormControl variant="outlined" sx={{ width: '100%', marginBottom: '10px' }}>
//               <Select
//                 id="outlined-menu-language"
//                 value={lang}
//                 onChange={(e) => setLang(e.target.value)}
//                 displayEmpty
//                 sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: 'gray' }}
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <LanguageOutlinedIcon sx={{ fontSize: '18px' }} />
//                   </InputAdornment>
//                 }
//                 MenuProps={{ disableScrollLock: true }}
//               >
//                 <MenuItem value="" disabled>
//                   {t('menuDefLang')}
//                 </MenuItem>
//                 <MenuItem value="english" sx={{ fontSize: '12px', color: 'gray' }}>
//                   English
//                 </MenuItem>
//                 <MenuItem value="arabic" sx={{ fontSize: '12px', color: 'gray' }}>
//                   Arabic
//                 </MenuItem>
//               </Select>
//             </FormControl>
//             <FormControl variant="outlined" sx={{ width: '100%', marginBottom: '10px' }}>
//               <Select
//                 id="outlined-tables"
//                 value={tableNumber}
//                 onChange={(e) => setTableNumber(e.target.value)}
//                 displayEmpty
//                 sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: 'gray' }}
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <TableBarIcon sx={{ fontSize: '18px' }} />
//                   </InputAdornment>
//                 }
//                 MenuProps={{ disableScrollLock: true }}
//               >
//                 <MenuItem value="" disabled sx={{ fontSize: '12px', color: 'gray' }}>
//                   {t('HowManyTablesDoYouHave')}
//                 </MenuItem>
//                 {[...Array(12).keys()].map((i) => (
//                   <MenuItem key={i + 1} value={i + 1} sx={{ fontSize: '12px', color: 'gray' }}>
//                     {i + 1}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <Divider sx={{ width: '100%', borderBottom: '1px solid #9d9d9c', marginBottom: '18px' }} />
//             <Typography variant="body2" sx={{ fontSize: '10px', color: theme.palette.text.gray_white, display: 'flex' }}>
//               <span className="icon-price-tag" style={{ fontSize: '17px', marginRight: '6px' }} /> {t('bundle')}
//             </Typography>
//             <Box display="flex" alignItems="center" justifyContent="flex-start" mb={2}>
//               <Button
//                 variant="outlined"
//                 sx={{
//                   border: '1px solid gray',
//                   textTransform: 'capitalize',
//                   color: theme.palette.text.gray_white,
//                   padding: '1px 20px',
//                   borderRadius: '6px',
//                   fontSize: '11px',
//                 }}
//               >
//                 <CheckOutlinedIcon sx={{ fontSize: '18px', marginRight: '6px', color: '#ef7d00' }} />
//                 {t('pro')}
//               </Button>
//               <Button
//                 variant="contained"
//                 sx={{
//                   backgroundColor: theme.palette.secondaryColor.main,
//                   textTransform: 'capitalize',
//                   color: 'white',
//                   padding: '3px 20px',
//                   borderRadius: '8px',
//                   marginLeft: '10px',
//                   fontSize: '11px',
//                   '&:hover': { backgroundColor: '#322240' },
//                 }}
//               >
//                 {t('changeBundle')}
//               </Button>
//             </Box>
//           </Grid>
//           {/* Save Button */}
//           <Grid item xs={12} container justifyContent="center">
//             <Button
//               variant="contained"
//               sx={{
//                 textTransform: 'capitalize',
//                 color: 'white',
//                 padding: '3px 55px',
//                 borderRadius: '20px',
//                 marginLeft: '15%',
//                 marginBottom: '20px',
//                 backgroundColor: theme.palette.orangePrimary.main,
//                 '&:hover': { backgroundColor: theme.palette.orangePrimary.main },
//               }}
//               size="large"
//               onClick={() => {

//                 handleSave()
//               }

//               }
//             >
//               <CheckOutlinedIcon sx={{ fontSize: '18px', marginRight: '6px', color: 'white' }} />
//               {t('save')}
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>
//     </Paper>
//   );
// };

// export default ProfilePage;