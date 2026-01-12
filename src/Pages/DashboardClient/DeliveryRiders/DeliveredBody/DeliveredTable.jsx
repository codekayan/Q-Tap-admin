import React, { useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, TextField, Typography, useTheme } from '@mui/material';
import * as XLSX from 'xlsx';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectPreparedOrders } from '../../../../store/client/deliveryOrderSlic';

export const DeliveredTable = ({  setSelectedOrder, setIsOrderDetailsOpen }) => {
  const theme = useTheme();
  const orders = useSelector(selectPreparedOrders)
  const handleExport = () => {
    const data = [
      {
        id: '3218', date: 'Sunday, August 4, 2024 3:59 PM', method: 'Delivery', address: '21 Algaish St, Mansoura, Dakahlia, EG',
        name: 'Mohamed Ahmed', phone: '+20 100 123 4567', paymentColor: "#ED1C24",
        paymentMethod: 'Cash', total: '200.00', status: 'Canceled', payment: 'Unpaid'
      },

    ];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");
  };
  const handleOpen = (order) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
  }
  const { t } = useTranslation();
  return (
    <>
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          textAlign: 'left',
          position: 'relative',
          padding: '8px 0',
          cursor: 'pointer',
          alignItems: "Left",
          display: "felx",
          justifyContent: "space-between",
          marginTop: "-25px", zIndex: "5",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="0px 30px"

        >
          <Typography variant="body1" sx={{ fontSize: "15px", color: "#575756" }}>
            {t("done")}
          </Typography>

          <Box>
            <span class="icon-magnifier" style={{ cursor: "pointer", color: "#575756", marginRight: "15px", fontSize: "13px" }}></span>

            <TextField
              variant="outlined"
              type='number'
              size="small"
              placeholder={t("from")}
              style={{ padding: "2px 0px", marginRight: '5px', width: "85px" }}
              InputProps={{
                startAdornment: <CalendarMonthOutlinedIcon sx={{ color: "gray", fontSize: "12px", marginRight: "10px" }} />,
                endAdornment: <ArrowDropDownIcon sx={{ color: "gray", fontSize: "18px", }} />,
                style: { fontSize: '8px', color: "gray", borderRadius: "6px", padding: "0px 5px", height: "25px" },
              }}
              InputLabelProps={{
                style: { fontSize: '10px' },
              }}
            />

            <TextField
              variant="outlined"
              type='number'
              size="small"
              placeholder={t("to")}
              style={{ padding: "2px 0px", marginRight: '5px', width: "85px" }}
              InputProps={{
                startAdornment: <CalendarMonthOutlinedIcon sx={{ color: "gray", fontSize: "12px", marginRight: "10px" }} />,
                endAdornment: <ArrowDropDownIcon sx={{ color: "gray", fontSize: "18px", }} />,
                style: { fontSize: '8px', color: "gray", borderRadius: "6px", padding: "0px 5px", height: "25px" },
              }}
              InputLabelProps={{
                style: { fontSize: '10px' },
              }}
            />
            <Button
              onClick={handleExport}
              variant="text"
              style={{ fontSize: "12px", color: theme.palette.orangePrimary.main, textTransform: "capitalize" }}>
              {t("export")}
              <ArrowForwardIosIcon sx={{ fontSize: "10px", color: "black" }} />
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            height: '5px',
            width: '100%',
            position: 'absolute',
            bottom: 0,
            borderRadius: '0 0 8px 8px',
            background: `linear-gradient(to right, ${theme.palette.gradient.yellow}, ${theme.palette.gradient.deepOrange})`,
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ height: "68vh", whiteSpace: 'nowrap' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderBottom: "none", backgroundColor: "#F1F2F2", height: "30px", padding: "5px 0px", color: "#343431", fontSize: "12px", textAlign: "center" }}>ID</TableCell>
              <TableCell sx={{ borderBottom: "none", backgroundColor: "#F1F2F2", height: "30px", padding: "5px 0px", color: "#343431", fontSize: "12px", textAlign: "center" }}>{t("created")}</TableCell>
              <TableCell sx={{ borderBottom: "none", backgroundColor: "#F1F2F2", height: "30px", padding: "5px 0px", color: "#343431", fontSize: "12px", textAlign: "center" }}>{t("dineMethod")}</TableCell>
              <TableCell sx={{ borderBottom: "none", backgroundColor: "#F1F2F2", height: "30px", padding: "5px 0px", color: "#343431", fontSize: "12px", textAlign: "center" }}>{t("payment")}</TableCell>
              <TableCell sx={{ borderBottom: "none", backgroundColor: "#F1F2F2", height: "30px", padding: "5px 0px", color: "#343431", fontSize: "12px", textAlign: "center" }}>{t("status")}</TableCell>
              <TableCell sx={{ borderBottom: "none", backgroundColor: "#F1F2F2", height: "30px", padding: "5px 0px", color: "#343431", fontSize: "12px", textAlign: "center" }}>{t("details")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell sx={{ borderBottom: "none", textAlign: "center" }}>
                  <span style={{ backgroundColor: "#50A778", color: "#343431", padding: "4px 20px", borderRadius: "20px" }}>ID #{order.id}</span></TableCell>
                <TableCell sx={{ borderBottom: "none", fontSize: "12px", textAlign: "center", color: "gray" }}>{order.date}</TableCell>
                <TableCell sx={{ borderBottom: "none", fontSize: "12px", textAlign: "center", color: "gray" }}>{t(order.method)}</TableCell>

                <TableCell sx={{ borderBottom: "none", fontSize: "12px", textAlign: "center", color: order.paymentColor }}>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <img src="/assets/balance.svg" alt="icon" style={{ width: "16px", height: "16px", marginRight: "5px" }} />
                    <span>{t(order.payment)}</span>
                  </Box>
                </TableCell>



                <TableCell sx={{ display: "flex", borderBottom: "none", fontSize: "12px", textAlign: "center", color: theme.palette.secondaryColor.main }}>
                  <span>{order.icon}</span>
                  {t(order.status)}</TableCell>

                <TableCell sx={{ borderBottom: "none", textAlign: "center", cursor: "pointer" }}>
                  <Typography display={"flex"} onClick={() => handleOpen(order)}>
                    <span class="icon-file" style={{ fontSize: "17px", color: theme.palette.orangePrimary.main }}></span>
                    <Typography color="textSecondary" fontSize="11px">
                      <span style={{ borderBottom: "1px solid gray" }}>{t("view")}</span>
                    </Typography>

                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </>
  )
}
