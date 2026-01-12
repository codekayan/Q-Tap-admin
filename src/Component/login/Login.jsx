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
} from '@mui/material';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const { t } = useTranslation();

  React.useEffect(() => {
    const storedRedirectBack = sessionStorage.getItem('redirectBack');
    if (!storedRedirectBack) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectBack = urlParams.get('redirectBack');
      if (redirectBack) {
        sessionStorage.setItem('redirectBack', redirectBack);
        console.log('redirectBack stored:', redirectBack);
      } else {
        console.log('No redirectBack found in URL');
      }
    } else {
      console.log('Using existing redirectBack:', storedRedirectBack);
    }
  }, []);
  const handleSubmit = async () => {
    // Reset API states
    setApiError('');
    setApiSuccess('');

    // Validate inputs
    if (!email || !password) {
      setApiError(t("fieldAreRequired"));
      return;
    }
    localStorage.setItem("clientEmail", email);
    localStorage.setItem("clientPassword", password);
    navigate('/logo-cient');
  };

  return (
    <Box >
      <FormControl variant="outlined" fullWidth margin="normal">
        <OutlinedInput
          placeholder={t("email")}
          onChange={(e) => setEmail(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <MailOutlinedIcon sx={{ fontSize: '18px'}} />
            </InputAdornment>
          }
          required
          sx={{
            borderRadius: '50px',
            height: '35px',
            fontSize: '11px',
            // color: theme.palette.text.fixedGray,
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
            // color: theme.palette.text.fixedGray,
          }}
        />
      </FormControl>



      <Typography
        variant="body2"
        sx={{
          // color: theme.palette.text.fixedBlack,
          fontSize: '10px',
          cursor: 'pointer',
          margin: '5px 0px',
        }}
        onClick={() => navigate('/reset')}
      >
        <span style={{ borderBottom: `1px solid ${theme.palette.text.fixedBlack}` }}>{t("resetPassword")}</span>
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
      >
        {/* {isLoading ? <CircularProgress size={24} /> : t("logIn")} */}
        <Typography
          variant='body1'
          style={{ color: theme.palette.text.fixedWhite }}>
          {t("logIn")}
        </Typography>
      </Button>

      <FormControlLabel
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
        control={
          <Checkbox
            sx={{
              // color: theme.palette.text.fixedGray,
              transform: 'scale(0.7)',
            }}
          />
        }
        label={<Typography sx={{ fontSize: '10px' }}>{t("stayLogIn")}</Typography>}
      />
    </Box>
  );
};