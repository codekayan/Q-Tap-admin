
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Switch, Button, useTheme, } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


import { useNavigate } from 'react-router-dom';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import { TextField, InputAdornment } from '@mui/material';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { DeliveredFooter } from './DeliveredFooter'
import { useTranslation } from 'react-i18next';
import Language from '../../../Component/dashboard/TopBar/Language';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from "../../../utils/constants"





export const DeliveryLogin = () => {
  const theme = useTheme();
  const styles = {
    outerContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      backgroundColor: '#f0f0f0',
    },
    container: {
      width: '300px',
      height: "350px",
      padding: '30px',
      borderRadius: '20px 0px 20px 20px',
      backgroundColor: '#fff',
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
      margin: '30px 0px',
      textAlign: 'center',
      justifyContent: 'center',
    },
    title: {
      textAlign: 'left',
      marginBottom: '20px',
      fontSize: "14px",
      borderBottom: `2px solid ${theme.palette.orangePrimary.main}`,
      display: 'inline-block',
      width: '100%',
      color: "#575756"
    },

    loginButton: {
      margin: '10px 0',
      padding: '10px',
      borderRadius: '25px',
      background: `linear-gradient(to right, #f7931e, #f15a24)`,
      color: '#fff',
      fontSize: '16px',
      width: "60%",
      textTransform: "capitalize", height: "40px"
    },
  };
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };
  //login proccessing variable
  const [pin, setPin] = useState()
  const [mobileNumber, setMobileNumber] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const handleDeliveryLogin = async () => {
    try {

      const data = {
        email: localStorage.getItem('clientEmail'),
        pin,
        role: "delivery_rider",
        phone: mobileNumber,
        brunch_id: localStorage.getItem('selectedBranch'),
        user_type: 'qtap_clients',
        password: localStorage.getItem('clientPassword'),
      }

      setIsLoading(true);

      const response = await axios.post(

        `${BASE_URL}login`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      localStorage.setItem('Token', response.data.token);
      localStorage.setItem('UserData', JSON.stringify(response.data));
      localStorage.setItem("clientName", response.data.user.name);
      localStorage.setItem("clientEmail", response.data.user.email);


      navigate('/delivered')

    } catch (error) {

      console.log(error)
      toast.error(t('loginFaild'))
      navigate('/')

    } finally {
      setIsLoading(false)
    }
  }

  const { t } = useTranslation();
  return (
    <Box sx={{ backgroundColor: "#EBEDF3", height: "100vh" }}>

      <AppBar position="static" style={{
        padding: "20px", backgroundColor: theme.palette.secondaryColor.main, zIndex: 3,
        boxShadow: 'none', borderRadius: "0px 0px 30px 30px", position: 'relative', height: "150px", overflow: 'hidden',
      }}>
        <Box
          sx={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '300px',
            color: theme.palette.orangePrimary.main,
            opacity: 0.2,
            zIndex: 1,
          }}
        >
          <span class="icon-fast-shipping" ></span>
        </Box>


        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton onClick={() => { navigate('/Logo-cient') }}
            style={{ position: "absolute", zIndex: "3", top: "20px", left: "50px" }}>
            <ArrowBackIosNewIcon sx={{ color: "white", fontSize: "20px", alignItems: 'center' }} />
          </IconButton>

          <Box style={{ display: 'flex', alignItems: 'center', position: "absolute", zIndex: "3", top: "20px", right: "40px" }}>

            <Box display="flex" alignItems="center" marginRight={"20px"} >
              <LightModeOutlinedIcon sx={{ color: "#FFFFFF", fontSize: "18px" }} />

              <Switch defaultChecked
                checked={checked}
                onChange={handleChange}
                sx={{

                  '& .MuiSwitch-thumb': {
                    height: 16,
                    width: 16,
                    boxShadow: 'none',
                    color: theme.palette.orangePrimary.main,
                  },
                  '& .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: '#D3D3D3',
                    height: "12px"
                  },
                  '& .MuiSwitch-switchBase': {

                    '&.Mui-checked': {
                      transform: 'translateX(22px)',
                      color: '#fff',
                      '& + .MuiSwitch-track': {
                        opacity: 1,
                        backgroundColor: '#E0E0E0',
                      },
                    },
                  },
                }}
              />

              <BedtimeOutlinedIcon sx={{ color: "#FFFFFF", fontSize: "18px" }} />
            </Box>

            <Language />

          </Box>
        </Toolbar>

        <Typography variant="body2" style={{ flexGrow: 1, fontSize: "22px", textAlign: 'center', color: 'white' }}>
          <span class="icon-fast-shipping" style={{ fontSize: "32px", color: theme.palette.orangePrimary.main, marginRight: "6px" }}></span>
          {t("deliveryRiders")}
        </Typography>
      </AppBar>   {/*  top Bar  */}



      <div style={styles.outerContainer}>
        <div style={styles.container}>
          <Typography style={styles.title}>{t("logIn")}</Typography>

          <TextField
            variant="outlined"
            placeholder={t("mobileNumber")}
            onChange={(e) => setMobileNumber(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneAndroidOutlinedIcon sx={{ fontSize: "22px", color: "#575756" }} />
                </InputAdornment>
              ),
              style: {
                borderRadius: '35px',
                height: '40px',
                fontSize: '12px',
              },
              inputProps: {
                style: {
                  textAlign: 'center',
                },
              },
            }}
            style={{ width: '80%', margin: '15px 0' }}
          />


          <TextField
            variant="outlined"
            onChange={(e) => setPin(e.target.value)}
            placeholder={t("password")}
            fullWidth
            type="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ fontSize: "22px", color: "#575756" }} />
                </InputAdornment>
              ),
              style: {
                borderRadius: '35px',
                height: '40px',
                fontSize: '12px',
              },
              inputProps: {
                style: {
                  textAlign: 'center',
                },
              },
            }}
            style={{ width: '80%', margin: '15px 0' }}
          />

          <Button
            onClick={() => { handleDeliveryLogin() }}
            variant="contained"
            fullWidth
            style={styles.loginButton}
          >
            {t("logIn")}
          </Button>

          <Box display={"flex"} justifyContent={"center"} textAlign={"center"} sx={{ marginTop: "20px" }}>
            <Switch defaultChecked
              checked={checked}
              onChange={handleChange}
              sx={{

                '& .MuiSwitch-thumb': {
                  height: 16,
                  width: 16,
                  boxShadow: 'none',
                  color: theme.palette.orangePrimary.main,
                },
                '& .MuiSwitch-track': {
                  opacity: 1,
                  backgroundColor: '#D3D3D3',
                  height: "12px"
                },
                '& .MuiSwitch-switchBase': {

                  '&.Mui-checked': {
                    transform: 'translateX(22px)',
                    color: '#fff',
                    '& + .MuiSwitch-track': {
                      opacity: 1,
                      backgroundColor: '#E0E0E0',
                    },
                  },
                },
              }}
            />
            <Typography variant='body1' sx={{ color: "gray", fontSize: "12px", marginTop: "8px" }}>{t("stayLogIn")}</Typography>
          </Box>
        </div>
      </div>


      <DeliveredFooter />

    </Box>
  )
}
