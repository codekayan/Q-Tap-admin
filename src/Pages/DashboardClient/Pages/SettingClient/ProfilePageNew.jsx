import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import { BASE_URL, BASE_URL_IMG } from "../../../../utils/constants"
import { Country, Governorates } from '../../../../utils/city';
import MapWithPin from '../../../../utils/MapWithPin';
import { useDispatch, useSelector } from 'react-redux';
import { selectGetInfoData, selectSelectedBranch, updateInfoOnly, updateSelectedBranch } from '../../../../store/client/clientAdmin';
import { BusinessLang, BusinessTypes, printFormData } from '../../../../utils/utils';

const ProfilePageNew = () => {
  const theme = useTheme();
  // Personal Info State
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const allClientData = localStorage.getItem('UserData');
  // const selectedBranch = localStorage.getItem('selectedBranch');
  const parsedClientData = allClientData ? JSON.parse(allClientData) : null;
  const user = parsedClientData?.user;
  const data = useSelector(selectGetInfoData)
  const qtap_clients = data?.qtap_clients;

  const MENU_STYLE = { fontSize: '12px', color: 'gray' }
  const branchID = useSelector(selectSelectedBranch)
  const [imageFile, setImageFile] = useState(null);

  const dispatch = useDispatch()

  const [userData, setUserData] = useState({
    fullName: '',
    phone: '',
    email: '',
    website: '',
    month: '',
    day: '',
    year: '',
    country: '',
    password: '',
    confirmPassword: '',

    businessName: '',
    businessPhone: '',
    businessEmail: '',
    businessCountry: '',
    businessCity: '',

    latitude: 0,
    longitude: 0,

    businessFormat: '',
    businessType: 'restaurant',
    lang: 'english',
    tableNumber: '1',
    paymentTime: '',
    callWaiter: '',
  });


  useEffect(() => {
    if (!qtap_clients) return;

    const [birthYear, birthMonth, birthDay] = qtap_clients.birth_date?.split('-') || [];

    const newFormData = {
      fullName: qtap_clients.name || '',
      phone: qtap_clients.mobile || '',
      email: user?.email || '',
      month: birthMonth || '',
      day: birthDay || '',
      year: birthYear || '',
      country: qtap_clients.country || '',
      password: user?.password || '',
      confirmPassword: user?.confirmPassword || '',
    };

    if (branchID) {
      const branch = qtap_clients?.brunchs?.find((b) => b.id === parseInt(branchID));
      if (branch) {
        Object.assign(newFormData, {
          businessName: branch.business_name || '',
          businessPhone: branch.contact_info?.[0]?.business_phone?.split(',')[0] || '',
          businessEmail: branch.contact_info?.[0]?.business_email?.split(',')[0] || '',
          businessCountry: branch.business_country || '',
          businessCity: branch.business_city || '',
          latitude: branch.latitude || '',
          longitude: branch.longitude || '',
          businessFormat: branch.business_format || '',
          businessType: branch.business_types || 'restaurant',
          lang: branch.default_lang || 'english',
          tableNumber: branch.tables_number || '1',
          paymentTime: branch.payment_time || '',
          callWaiter: branch.call_waiter || '',
          website: branch.contact_info?.[0]?.website?.split(',')[0] || '',
        });
      }
    }

    setUserData(newFormData);
  }, [qtap_clients, branchID]);

  const handleChange = useCallback((e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };


  // 
  /* 
  ***
  **  Handle Save Button Click
  *****************************
  */
  const handleSave = async () => {

    if (!userData.password || !userData.confirmPassword) {
      toast.error(t("please enter password and confirm password"));
      return; // Stop further execution
    }
    if ((userData.password && userData.confirmPassword) && (userData.password !== userData.confirmPassword)) {
      toast.error(t("password not match"));
      return; // Stop further execution
    }
    setIsLoading(true)
    const formData = new FormData();

    // Basic fields
    formData.append('brunch_id', branchID);
    formData.append('name', userData.fullName);
    formData.append('mobile', userData.phone);
    formData.append('email', userData.email);
    formData.append('birth_date', `${userData.year.padStart(2, '0')}-${userData.month.padStart(2, '0')}-${userData.day.padStart(2, '0')}`);
    formData.append('country', userData.country);
    formData.append('password', userData.password);
    formData.append('business_name', userData.businessName);
    formData.append('business_country', userData.businessCountry);
    formData.append('business_city', userData.businessCity);
    formData.append('latitude', userData.latitude.toString());
    formData.append('longitude', userData.longitude.toString());
    formData.append('currency_id', '1');
    formData.append('business_format', userData.businessFormat);
    formData.append('tables_number', userData.tableNumber.toString());
    formData.append('business_types', userData.businessType.toString());
    formData.append('default_lang', userData.lang.toString());

    const contactFields = {
      'business_phone': [userData.businessPhone],
      'business_email': [userData.businessEmail],
      'facebook': [''],
      'twitter': [''],
      'instagram': [''],
      'address': [''],
      'website': [userData.website]
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
      console.log(">>>>", response) // debug log
      const data = await response.json()
      console.log(">>>>", data) // debug log

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

    setUserData((prev) => ({
      ...prev,
      latitude: data.lat,
      longitude: data.lng
    }));
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
                {userData.fullName}
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
                value={userData.fullName}
                name="fullName"
                onChange={handleChange}
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
                value={userData.phone}
                name="phone"
                onChange={handleChange}
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
                value={userData.email}
                name="email"
                onChange={handleChange}
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
                value={userData.website}
                name="website"
                onChange={handleChange}
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
                    value={userData.month}
                    name="month"
                    onChange={handleChange}
                    displayEmpty
                    sx={{
                      borderRadius: '6px',
                      height: '33px',
                      fontSize: '10px',
                      color: 'gray',
                      marginRight: '5px',
                    }}
                  >
                    <MenuItem value="" disabled sx={MENU_STYLE}>
                      {t("month")}
                    </MenuItem>
                    {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
                      <MenuItem key={m} value={m} sx={MENU_STYLE}>
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
                    value={userData.day}
                    name="day"
                    onChange={handleChange}
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
                        sx={MENU_STYLE}
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
                    value={userData.year}
                    name="year"
                    onChange={handleChange}
                    displayEmpty
                    sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: 'gray' }}
                  >
                    <MenuItem value="" disabled sx={MENU_STYLE}>
                      {t("year")}
                    </MenuItem>
                    {Array.from({ length: 2025 - 1900 + 1 }, (_, i) => 1900 + i).map((y) => (
                      <MenuItem key={y} value={y} sx={MENU_STYLE}>
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
                value={userData.country}
                name="country"
                onChange={handleChange}
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
                <MenuItem value="" disabled sx={MENU_STYLE}>
                  {t("country")}{userData.country}
                </MenuItem>
                <MenuItem value={Country.EGYPT} sx={MENU_STYLE}>
                  EGYPT
                </MenuItem>
                <MenuItem value={Country.USA} sx={MENU_STYLE}>
                  United States
                </MenuItem>
                <MenuItem value={Country.CANADA} sx={MENU_STYLE}>
                  Canada
                </MenuItem>
                <MenuItem value={Country.UK} sx={MENU_STYLE}>
                  United Kingdom
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                id="outlined-password"
                type="password"
                value={userData.password}
                name="password"
                onChange={handleChange}
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
                value={userData.confirmPassword}
                name="confirmPassword"
                onChange={handleChange}
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
                value={userData.businessName}
                name="businessName"
                onChange={handleChange}
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
                  value={userData.businessPhone}
                  name="businessPhone"
                  onChange={handleChange}
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
                value={userData.businessEmail}
                name="businessEmail"
                onChange={handleChange}
                placeholder={t("businessEmailNotOptional")}
                type="email"
                sx={{ borderRadius: '6px', marginBottom: '10px', height: '33px', fontSize: '10px' }}
              />
            </FormControl>

            <Box display="flex" justifyContent="space-between" width="100%" marginBottom="10px">
              <FormControl variant="outlined" sx={{ width: '48%' }}>
                <Select
                  id="outlined-business-country"
                  value={userData.businessCountry}
                  name="businessCountry"
                  onChange={handleChange}
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
                  value={userData.businessCity}
                  name="businessCity"
                  onChange={handleChange}
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
              <MapWithPin setPos={updateBranchPosition} currentPos={{ latitude: userData.latitude, longitude: userData.longitude }} isMapOpen={isMapOpen} setIsMapOpen={setIsMapOpen} />
            </Box>

            <FormControl variant="outlined" sx={{ width: '100%', marginBottom: '10px' }}>
              <Select
                id="outlined-currency"
                value={userData.businessFormat}
                name="businessFormat"
                onChange={handleChange}
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
                <MenuItem value="UL" sx={MENU_STYLE}>
                  United States
                </MenuItem>
                <MenuItem value="UK" sx={MENU_STYLE}>
                  United Kingdom
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ width: '100%', marginBottom: '10px' }}>
              <Select
                id="outlined-business-type"
                value={userData.businessType}
                name="businessType"
                onChange={handleChange}
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
                <MenuItem value={BusinessTypes.RESTAURANT} sx={MENU_STYLE}>
                  {t("restaurant")}
                </MenuItem>
                <MenuItem value={BusinessTypes.CAFE} sx={MENU_STYLE}>
                  {t("cafe")}
                </MenuItem>
                <MenuItem value={BusinessTypes.CLOUD} sx={MENU_STYLE}>
                  {t("cloudKitchens")}
                </MenuItem>
                <MenuItem value={BusinessTypes.FAST_FOOD} sx={MENU_STYLE}>
                  {t("fastFood")}
                </MenuItem>
                <MenuItem value={BusinessTypes.TRUCK} sx={MENU_STYLE}>
                  {t("foodTruch")}
                </MenuItem>
                <MenuItem value={BusinessTypes.BAKERY} sx={MENU_STYLE}>
                  {t("bakeryStore")}
                </MenuItem>
                <MenuItem value={BusinessTypes.PASTRY} sx={MENU_STYLE}>
                  {t("pastryStore")}
                </MenuItem>
                <MenuItem value={BusinessTypes.FRUITS} sx={MENU_STYLE}>
                  {t("fruitsStore")}
                </MenuItem>
                <MenuItem value={BusinessTypes.RETAIL} sx={MENU_STYLE}>
                  {t("retailStore")}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ width: '100%', marginBottom: '10px' }}>
              <Select
                id="outlined-menu-language"
                value={userData.lang}
                name="lang"
                onChange={handleChange}
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
                <MenuItem value={BusinessLang.EN} sx={MENU_STYLE}>
                  English
                </MenuItem>
                <MenuItem value={BusinessLang.AR} sx={MENU_STYLE}>
                  Arabic
                </MenuItem>
                {/* <MenuItem value="3" sx={MENU_STYLE}>
                  France
                </MenuItem> */}
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ width: '100%', marginBottom: '10px' }}>
              <Select
                id="outlined-tables"
                value={userData.tableNumber}
                name="tableNumber"
                onChange={handleChange}
                displayEmpty
                sx={{ borderRadius: '6px', height: '33px', fontSize: '10px', color: 'gray' }}
                startAdornment={
                  <InputAdornment position="start">
                    <TableBarIcon sx={{ fontSize: '18px' }} />
                  </InputAdornment>
                }
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="" disabled sx={MENU_STYLE}>
                  {t("HowManyTablesDoYouHave")}
                </MenuItem>
                {[...Array(12).keys()].map((i) => (
                  <MenuItem key={i + 1} value={i + 1} sx={MENU_STYLE}>
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

export default ProfilePageNew;



