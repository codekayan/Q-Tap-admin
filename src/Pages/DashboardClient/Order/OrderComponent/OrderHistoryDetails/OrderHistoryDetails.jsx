import React, { useRef } from 'react';
import { Paper } from '@mui/material';
import MainContent from './MainContent';
import Header from './Header ';
import FooterDetails from './FooterDetails';
import { Box } from '@mui/system';

const OrderHistoryDetails = ({ order, onClose }) => {
    const printRef = useRef();
   
    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); 
    };
    if (!order) return null;
    return (
        
        <Paper sx={{ width: "75%", backgroundColor: "white", 
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',borderRadius: '8px' }}>
            <Box sx={{padding: '20px', }}> 
            <Header order={order} onClick={onClose}  onPrint={handlePrint} /> 
            <MainContent order={order} ref={printRef} />
            </Box>
            <FooterDetails order={order}/>
        </Paper>
    );
};

export default OrderHistoryDetails;


