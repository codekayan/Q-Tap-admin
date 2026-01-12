import React from 'react';
import { Grid, Typography, Chip, Box, IconButton, Divider, useTheme } from '@mui/material';
import { formateDate } from '../../../../../utils/formateDateFn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';

const Header = ({ order, onClick }) => {
  const theme = useTheme();

  if (!order) {
    return <Typography variant="body1" color="error">Order data is missing</Typography>;
  }
  const { dayName, time, formattedDate } = formateDate(order.created_at);
  return (
    <>

      <Box sx={{ display:'flex' , flexWrap:'nowrap',}}>
        <Grid container alignItems="center" justifyContent="space-between" flexWrap='wrap' style={{ padding: '5px', }}>

          <Grid item>
            <Box display="flex" alignItems="center" flexWrap='wrap' >
              <Chip
                label={`ID ${order.id}`}
                style={{ backgroundColor: '#78c2a4', color: 'black', fontSize: "12px", padding: "0px 8px" }}
              />

              <img src="/assets/balance.svg" alt="icon" style={{ width: "18px", margin: "0px 6px", height: "18px" }} />
              <Typography variant="body1" style={{ fontSize: "12px", color: order.payment_status === 'unpaid' ? "red" : "green", }}>
                {order.payment_status}
              </Typography>

              <Typography variant="body2" style={{ fontSize: "11px", marginLeft: '25px', color: '#888' }}>
                {dayName + " " + time + " " + formattedDate}
              </Typography>
            </Box>
          </Grid>

          <Grid item>
            <Box display="flex" alignItems="center">

              <Box style={{ marginRight: '15px' }}>
                <Typography variant="body2" style={{ display: "flex", alignItems: "center", marginLeft: '5px', fontSize: "12px" }}>
                  {order.status === 'pending' && (<AccessTimeIcon />)}
                  {order.status === 'confirmed' && (<span class="icon-double-check" style={{ fontSize: "20px", marginRight: "5px" }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>)}
                  {order.status === 'delivered' && (<LocalShippingIcon />)}
                  {order.status === 'rejected' && (<span class="icon-close" style={{ fontSize: "14px", marginRight: "5px" }}></span>)}
                  {order.status === 'cancelled' && (<CancelIcon />)}
                  {order.status}
                </Typography>
              </Box>


              <IconButton  >
                <span class="icon-printer" style={{ fontSize: "20px" }} />
              </IconButton>

            </Box>
          </Grid>
        </Grid>

        <IconButton onClick={onClick} sx={{ marginLeft: "16px" }} >
          <span class="icon-close-1" style={{ fontSize: "13px" }}></span>
        </IconButton>
      </Box>

      {/* Divider Line */}
      <Divider style={{ backgroundColor: theme.palette.orangePrimary.main, borderBottom: "none", height: '2px', marginBottom: "20px" }} />
    </>

  );
};

export default Header;
