import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import {
  Avatar,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
  Box,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  CheckOutlined,
  HelpOutlineOutlined,
  KeyboardArrowDown,
  PersonOutlineOutlined,
} from '@mui/icons-material';
import { PersonalInfo } from '../../Pages/Client/Row2/AddClient/PersonalInfo';
import { BusinessInfo } from '../../Pages/Client/Row2/AddClient/BusinessInfo';
import { useTranslation } from 'react-i18next';
import Language from '../dashboard/TopBar/Language';
import { updatePersonalData } from "../../store/register/personalSlice";
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../../utils/constants';

import { appendBrunchData, appendUserData } from '../../utils/register-client/createBranchFormData';
import { registerUser } from '../../api/Client/registerUser';
import { getValidationError } from '../../utils/register-validation/registerValidation';
import { printFormData } from '../../utils/utils';
import SaveRegisterUserDataPage from '../../Pages/Client/Row2/AddClient/save-page/save-register-user-page';
export const Save = () => {

  const personalData = useSelector((state) => state.registerPersonalDataStore.personalData);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const [anchorElUser, setAnchorElUser] = useState(null);

  // const openLanguage = Boolean(anchorElLanguage);
  const openUserPopover = Boolean(anchorElUser);

  // Handle Personal Info Changes






  const handleUserClick = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserClose = () => {
    setAnchorElUser(null);
  };


  return (
    <Box sx={{
      backgroundImage: theme.palette.mode === 'light' ? "url(/images/Rectangle.png)" : undefined,
      backgroundColor: theme.palette.mode === 'light' ? undefined : theme.palette.background.default,
      minHeight: '100vh', paddingBottom: "1rem",overflow:'hidden'
    }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0px 60px',
          justifyContent: 'space-between',
          width: '90%',
          height: '70px',
        }}
      >
        <Box>
          <img src="/images/qtap.PNG" alt="logo" width="140px" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Language />

          <Box
            aria-describedby={openUserPopover ? 'simple-popover' : undefined}
            onClick={handleUserClick}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
          >
            <IconButton
              color="inherit"
              sx={{
                backgroundColor: theme.palette.orangePrimary.main,
                borderRadius: '30%',
                padding: '5px',
                '&:hover': { backgroundColor: theme.palette.orangePrimary.main },
              }}
            >
              <PersonOutlineOutlined sx={{ fontSize: '20px', color: 'white' }} />
            </IconButton>
            <Typography variant="body1" sx={{ fontSize: '13px', color: '#575756' }}>
              {personalData.fullName || 'User01'}
            </Typography>
            <KeyboardArrowDown sx={{ fontSize: '18px', color: '#575756' }} />
          </Box>
          <Popover
            id={openUserPopover ? 'simple-popover' : undefined}
            open={openUserPopover}
            anchorEl={anchorElUser}
            onClose={handleUserClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Box sx={{ width: 200, padding: '10px' }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', marginBottom: '20px', gap: '10px' }}
              >
                <Avatar sx={{ bgcolor: theme.palette.orangePrimary.main, width: 40, height: 40 }}>
                  <PersonOutlineOutlined sx={{ fontSize: '22px' }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '14px' }}>
                    {personalData.fullName || 'User01'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '12px' }} color="textSecondary">
                    {personalData.email || 'Mail@mail.com'}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <List>
                <Box
                  onClick={() => navigate('/')}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: theme.palette.secondaryColor.main,
                    color: 'white',
                    marginBottom: '10px',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'center',
                    width: '80%',
                    padding: '5px 0px',
                    margin: '0 auto',
                  }}
                >
                  <span className="icon-home-icon-silhouette" style={{ color: theme.palette.orangePrimary.main, marginRight: '5px', fontSize: '15px' }} />
                  <span style={{ color: 'white', fontSize: '12px', textTransform: 'capitalize' }}>{t("home")}</span>
                </Box>
                <ListItem sx={{ cursor: 'pointer' }} onClick={handleUserClose}>
                  <ListItemIcon>
                    <img src="/assets/setting.svg" alt="icon" style={{ width: '16px', height: '16px' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Edit Profile"
                    primaryTypographyProps={{ sx: { color: '#5D5D5C', fontSize: '12px', marginLeft: '-30px' } }}
                  />
                </ListItem>
                <ListItem sx={{ cursor: 'pointer' }} onClick={handleUserClose}>
                  <ListItemIcon>
                    <span className="icon-price-tag" style={{ fontSize: '20px' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="My Subscription"
                    primaryTypographyProps={{ sx: { color: '#5D5D5C', fontSize: '12px', marginLeft: '-30px' } }}
                  />
                </ListItem>
                <ListItem sx={{ cursor: 'pointer' }} onClick={handleUserClose}>
                  <ListItemIcon>
                    <HelpOutlineOutlined sx={{ fontSize: '20px' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="FAQ"
                    primaryTypographyProps={{ sx: { color: '#5D5D5C', fontSize: '12px', marginLeft: '-30px' } }}
                  />
                </ListItem>
                <ListItem sx={{ cursor: 'pointer' }} onClick={handleUserClose}>
                  <ListItemIcon>
                    <img src="/assets/logout.svg" alt="icon" style={{ width: '16px', height: '16px' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{ sx: { color: '#5D5D5C', fontSize: '12px', marginLeft: '-30px' } }}
                  />
                </ListItem>
              </List>
            </Box>
          </Popover>
        </Box>
      </Box>

      <Divider sx={{ backgroundColor: theme.palette.orangePrimary.main, borderBottom: 'none', width: '100%', height: '3px' }} />
      <SaveRegisterUserDataPage />
    </Box>
  );
};

export default Save;
