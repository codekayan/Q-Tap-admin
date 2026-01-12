
import { Button, Divider, Paper, TextField, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import React, { useState } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { logData } from './CustomersData';
import { useTranslation } from 'react-i18next';
//redux
import { fetchCustomerLog, selectCustomerLog } from '../../../../store/client/clientDashBoardSlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedBranch } from '../../../../store/client/clientAdmin';

export const Customers = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch()

  const [fromDate, setFromDate] = useState('2025-01-01')
  const [toDate, setToDate] = useState('2025-04-28')

  const customerLog = useSelector(selectCustomerLog)

  const theme = useTheme();
  const handleExport = () => {
    const headers = ["Dine Method", "Name", "Phone", "Note", "Visit Time"];
    const csvRows = [
      headers.join(','),
      ...logData.map(row =>
        [row.dineMethod, row.name, row.phone, row.note, row.visitTime].join(',')
      )
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'logData.csv';
    link.click();
    URL.revokeObjectURL(url);
  };


  const branchID = useSelector(selectSelectedBranch)
  React.useEffect(() => {
    if ([fromDate, fromDate, branchID].every(Boolean)) {
      dispatch(fetchCustomerLog({ branchId: branchID, dateFormate: `${fromDate}/${toDate}` }))
    }
  }, [dispatch, fromDate, toDate, branchID]);


  return (
    <Paper sx={{ padding: "15px 30px 50px 30px", borderRadius: "20px", whiteSpace: 'nowrap', overflowX: 'auto' }} >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        padding="10px 0"
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <span class="icon-show" style={{ fontSize: "30px", color: "#D8E0E0", marginRight: "6px" }} ></span>
          <Typography variant='body1' sx={{ fontSize: "14px", color: theme.palette.text.gray }}>{t("log")}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>

          <TextField
            type='date'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            variant="outlined"
            size="small"
            placeholder={t("from")}
            style={{ marginRight: '8px', width: "120px" }}
            InputProps={{

              style: { fontSize: '10px', padding: '1px 6px', height: "20px", borderRadius: "6px" },
            }}
            InputLabelProps={{
              style: { fontSize: '10px' },
            }}
          />
          <TextField
            type='date'
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            variant="outlined"
            size="small"
            placeholder={t("to")}
            style={{ marginRight: '8px', width: "120px" }}
            InputProps={{

              style: { fontSize: '10px', padding: '1px 6px', height: "20px", borderRadius: "6px" },
            }}
          />
          <Button
            variant="text"
            style={{ color: theme.palette.orangePrimary.main, fontSize: "11px", textTransform: "capitalize" }}
            onClick={handleExport}
          >
            {t("export")}
            <ArrowForwardIosIcon sx={{ fontSize: "11px", color: theme.palette.text.gray, marginLeft: "1px" }} />
          </Button>
        </Box>

      </Box> {/* header */}


      <Divider
        sx={{
          backgroundColor: "orange",
          height: '1px',
        }}
      />

      <TableContainer>
        <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 5px' }}>
          <TableHead>
            <TableRow sx={{ height: "25px", borderBottom: "2px solid #f0f0f0" }}>
              {[t("dineMethod"), t("name"), t("mobileNumber"), t("note"), t("visitTime")].map((header) => (
                <TableCell
                  key={header}
                  sx={{ fontSize: "11px", padding: "4px", width: `${100 / 6}%`, textAlign: "left", paddingTop: "10px" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {customerLog?.users_logs?.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? theme.palette.bodyColor.secandaryInput : '',
                  height: "30px",
                  borderRadius: '20px',
                  '&:nth-of-type(odd)': {
                    borderRadius: '20px',
                  },
                  '&:nth-of-type(even)': {
                    borderRadius: '20px',
                  },
                  '& td:first-of-type': {
                    borderTopLeftRadius: '20px',
                    borderBottomLeftRadius: '20px',
                  },
                  '& td:last-of-type': {
                    borderTopRightRadius: '20px',
                    borderBottomRightRadius: '20px',
                  },
                }}
              >
                <TableCell sx={{ fontSize: '10px', padding: "3px 20px", width: `${100 / 7}%`, textAlign: "left", borderBottom: "none", color: theme.palette.text.gray_light }}>{t(row?.type)}</TableCell>
                <TableCell sx={{ fontSize: '10px', padding: "3px", width: `${100 / 7}%`, textAlign: "left", borderBottom: "none", color: theme.palette.text.gray_light }}>{row?.name}</TableCell>
                {/* <TableCell sx={{ fontSize: '10px', padding: "3px", width: `${100 / 7}%`, textAlign: "left", borderBottom: "none" , color:theme.palette.text.gray_light }}>{row?.email}</TableCell> */}
                <TableCell sx={{ fontSize: '10px', padding: "3px", width: `${100 / 7}%`, textAlign: "left", borderBottom: "none", color: theme.palette.text.gray_light }}>
                  {row?.phone == null ? "N/P" : row?.phone}
                </TableCell>
                <TableCell sx={{ fontSize: '10px', padding: "3px", width: `${100 / 7}%`, textAlign: "left", borderBottom: "none", color: theme.palette.text.gray_light, display: 'flex', alignItems: "center", justifyContent: "start" }}>
                  <RemoveRedEyeOutlinedIcon sx={{ fontSize: "16px", color: "#d3cfcf", marginRight: "5px" }} />
                  {row?.comments}
                </TableCell>
                <TableCell sx={{ fontSize: '10px', padding: "3px 20px 0px 0px", width: `${100 / 7}%`, textAlign: "left", borderBottom: "none", color: theme.palette.text.gray_light }}>
                  {new Date(row?.updated_at).toLocaleString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })}
                </TableCell>


              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Paper>
  )
}
