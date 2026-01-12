import React from 'react';

import { Grid } from '@mui/material';
import { DeliveredCard } from './DeliveredCard';
import { DeliveredTable } from './DeliveredTable';
import CheckIcon from '@mui/icons-material/Check';
import { OrderProvider } from './DeliveredContext';
export const orders = [
  {
    id: '3217', date: 'Sunday, August 4, 2024 3:59 PM', method: 'Delivery', address: '21 Algaish St, Mansoura, Dakahlia, EG',
    name: 'Mohamed Ahmed', phone: '+20 100 123 4567', paymentColor: "#ED1C24",
    paymentMethod: 'Cash', payIcon: <img src='/assets/cash.svg' alt='cash icon' style={{ width: "15px", height: "15px", marginRight: "6px" }} />,
    total: '200.00', status: 'Canceled', payment: 'UnPaid',
    icon: <span class="icon-close" style={{ marginRight: "5px", fontSize: "13px" }}></span>,
    items: [
      { name: 'Negrosco', size: 'M', variants: 'Extra', quantity: 2, price: '100.00' },
      { name: 'Tea', size: 'M', variants: 'Extra', quantity: 2, price: '10.00' },
      { name: 'chocalate', size: 'M', variants: 'Extra', quantity: 2, price: '50.00' },
    ]
  },

  {
    id: '3218', date: 'Sunday, August 4, 2024 3:59 PM', method: 'Delivery', address: '21 Algaish St, Mansoura, Dakahlia, EG',
    name: 'Ahmed Hany', phone: '+20 100 123 4567', paymentColor: "#73CB3C",
    paymentMethod: 'Digit wallet',
    payIcon: <span class="icon-wallet" style={{ fontSize: "20px", mr: 1 }}><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span></span>,
    total: '100.00', status: 'Delived', payment: 'paid',
    icon: <CheckIcon sx={{ fontSize: "22px", marginRight: "5px", color: "green" }} />,
    items: [
      { name: 'Pasta', size: 'L', variants: 'Extra Cheese', quantity: 1, price: '86.00' },
    ]
  },

];
export const DeliveredBody = ({  setSelectedOrder, setIsOrderDetailsOpen }) => {
  return (
    <OrderProvider>
      <Grid container justifyContent="space-around" sx={{ padding: "0px 30px", marginBottom: "15px" }}>
        <Grid item xs={12} md={4} lg={3}>
          <DeliveredCard  setSelectedOrder={setSelectedOrder} setIsOrderDetailsOpen={setIsOrderDetailsOpen} />
        </Grid>


        <Grid item xs={12} md={8} lg={8}>
          <DeliveredTable  setSelectedOrder={setSelectedOrder} setIsOrderDetailsOpen={setIsOrderDetailsOpen} />
        </Grid>
      </Grid>

    </OrderProvider>
  )
}
