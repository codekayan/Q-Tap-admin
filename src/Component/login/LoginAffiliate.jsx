import React, { useState } from 'react';
import {
  Button,
  Box,
  InputAdornment,
  FormControl,
  OutlinedInput,
  IconButton,
  FormControlLabel,
  Checkbox,
  Typography,
  useTheme,
  CircularProgress,
} from '@mui/material';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { BASE_URL} from '../../utils/constants'

export const LoginAffiliate = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiSuccess, setApiSuccess] = useState('');
  const { t } = useTranslation();
  const handleSubmit = async () => {
    // Reset API states
    setApiError('');
    setApiSuccess('');

    // Validate inputs
    if (!email || !password) {
      setApiError(t("fieldAreRequired"));
      return;
    }

    // Prepare data for API
    const data = {
      email,
      password,
      user_type: 'qtap_affiliates',
    };

    // Send data to API
    // change of api 2.2
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${BASE_URL}login`,
          data,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );


        if (response?.data?.user) {
          setApiSuccess(t("logInSuccess"));
          const loginUserType = response.data.user?.user_type;

          if (loginUserType === 'qtap_admins') {
            // localStorage.setItem('adminToken', response.data.token);
            // localStorage.setItem("userName", response.data.user.name);
            // localStorage.setItem("userEmail", response.data.user.email);
            // localStorage.setItem("adminId", response.data.user.id);
            // navigate('/dashboard-home');
            toast.error(t("someThingGoWrong"))
          } else if (loginUserType === 'qtap_affiliates') {
            localStorage.setItem('affiliateToken', response.data.token);
            localStorage.setItem('userName', response.data.user.name);
            localStorage.setItem('userEmail', response.data.user.email);
            localStorage.setItem('affiliateId', response.data.user.id);

            navigate('/dashboard-affiliate');
          }
          /* this part modified since the logic of client login change*/
          // else if (loginUserType === 'qtap_clients') {
          //   localStorage.setItem('Token', response.data.token);
          //   localStorage.setItem('UserData', JSON.stringify(response.data));
          //   localStorage.setItem("clientName", response.data.user.name);
          //   localStorage.setItem("clientEmail", response.data.user.email);

          //   // Store branches in both context and localStorage
          //   if (response?.data?.brunches && response.data.brunches.length > 0) {
          //     setBranches(response.data.brunches);
          //     localStorage.setItem('branches', JSON.stringify(response.data.brunches));
          //     // Set and store the first branch as default
          //     setSelectedBranch(response.data.brunches[0].id);
          //     localStorage.setItem('selectedBranch', response.data.brunches[0].id);
          //   }
          //   navigate('/logo-cient');
          // } 
          else {
            navigate('/');
          }
        } else {
          setApiError(response?.data?.message || t("invEmailOrPassword"));
        }
      } catch (error) {
        console.error('Login Error:', error); // Debug log
        setApiError(error.response?.data?.message || t("loginFaild"));
      } finally {
        setIsLoading(false);
      }
    
  };

  return (
    <Box>
      <FormControl variant="outlined" fullWidth margin="normal">
        <OutlinedInput
          placeholder={t("email")}
          onChange={(e) => setEmail(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <MailOutlinedIcon sx={{ fontSize: '18px' }} />
            </InputAdornment>
          }
          required
          sx={{
            borderRadius: '50px',
            height: '35px',
            fontSize: '11px',
            color: theme.palette.text.fixedGray,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              outline: 'none',
            },
          }}
        />
      </FormControl>

      <FormControl variant="outlined" fullWidth margin="normal">
        <OutlinedInput
          id="outlined-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <span className="icon-padlock" style={{ fontSize: '18px' }} />
            </InputAdornment>
          }
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? (
                  <VisibilityOffOutlinedIcon sx={{ fontSize: '18px' }} />
                ) : (
                  <span className="icon-show" style={{ fontSize: '16px' }} />
                )}
              </IconButton>
            </InputAdornment>
          }
          placeholder={t("password")}
          sx={{
            borderRadius: '50px',
            height: '35px',
            fontSize: '11px',
            color: theme.palette.text.fixedGray,
          }}
        />
      </FormControl>


      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.blue,
          fontSize: '10px',
          cursor: 'pointer',
          margin: '5px 0px',
        }}
        onClick={() => navigate('/reset-affiliate')}
      >
        <span style={{ borderBottom: `1px solid ${theme.palette.text.blue}` }}>{t("resetPassword")}</span>
      </Typography>

      {apiError && (
        <Typography sx={{ color: theme.palette.text.red, fontSize: '12px' }}>{apiError}</Typography>
      )}
      {apiSuccess && (
        <Typography sx={{ color: theme.palette.text.green, fontSize: '12px' }}>{apiSuccess}</Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        style={{ marginTop: 16 }}
        sx={{
          fontSize: '11px',
          bgcolor: theme.palette.bluePrimary.main,
          borderRadius: '50px',
          textTransform: 'capitalize',
          '&:hover': {
            backgroundColor: theme.palette.secondaryColor.main,
          },
        }}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : t("logIn")}
      </Button>

      <FormControlLabel
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
        control={
          <Checkbox
            sx={{
              color: theme.palette.text.fixedGray,
              transform: 'scale(0.7)',
            }}
          />
        }
        label={<Typography sx={{ fontSize: '10px', color: theme.palette.text.fixedGray }}>{t("stayLogIn")}</Typography>}
      />
    </Box>
  );
};