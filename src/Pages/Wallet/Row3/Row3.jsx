import {
  Button,
  Grid,
  IconButton,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import React from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MinimizeOutlinedIcon from '@mui/icons-material/MinimizeOutlined';
import { useTranslation } from 'react-i18next';
import { getDeposits } from '../../../store/adminSlice';
import { useDispatch, useSelector } from 'react-redux';

// Add the formatDateTime function
const formatDateTime = (updatedAt) => {
  if (!updatedAt) return { time: '', date: '' };

  const date = new Date(updatedAt);
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getFullYear()}`;

  return { time, date: formattedDate };
};

export const Row3 = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  // State for withdrawals
  const [withdrawalSearchQuery, setWithdrawalSearchQuery] = React.useState('');
  const [showWithdrawalSearch, setShowWithdrawalSearch] = React.useState(false);
  const [withdrawFromDate, setWithdrawFromDate] = React.useState('2024-03-20');
  const [withdrawToDate, setWithdrawToDate] = React.useState('2025-06-28');
  // State for deposits
  const [deposits, setDeposits] = React.useState([]);
  const [depositSearchQuery, setDepositSearchQuery] = React.useState('');
  const [showDepositSearch, setShowDepositSearch] = React.useState(false);
  const [depositFromDate, setDepositFromDate] = React.useState('2024-03-20');
  const [depositToDate, setDepositToDate] = React.useState('2025-06-28');

  const depositsData = useSelector((state) => state.admins?.depositsData);
  const dispatch = useDispatch();
 

  // Fetch deposits data
  React.useEffect(() => {
    dispatch(getDeposits(`${depositFromDate}/${depositToDate}`));
  }, [depositFromDate, depositToDate]);

  React.useEffect(() => {
    if (depositsData?.Deposits?.length === 0) {
      setDeposits([]);
    } else {
      setDeposits(depositsData?.Deposits || []);
    }
  }, [depositFromDate, depositToDate, depositsData]);

  // // Handle search toggle for withdrawals
  // const handleWithdrawalSearchClick = () => {
  //   setShowWithdrawalSearch((prev) => !prev);
  //   if (showWithdrawalSearch) setWithdrawalSearchQuery(''); // Clear search when hiding
  // };

  // Handle search toggle for deposits
  const handleDepositSearchClick = () => {
    setShowDepositSearch((prev) => !prev);
    if (showDepositSearch) setDepositSearchQuery(''); // Clear search when hiding
  };

  // // Filter withdrawals by order_id
  // const filteredWithdrawals = withdrawals.filter((transaction) =>
  //   transaction.order_id.toString().includes(withdrawalSearchQuery)
  // );

  // Filter deposits by order_id
  const filteredDeposits = deposits.filter((transaction) =>
    transaction.order_id?.toString().includes(depositSearchQuery)
  );

  return (
    <Grid container spacing={2} sx={{ marginTop: '5px' }}>
      <Grid item xs={12} md={6} lg={6}>
        <Card sx={{ borderRadius: 4, height: '100%', overflow: 'auto' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" marginBottom="7px">
              <Box variant="body2" sx={{ fontSize: '13px', display: 'flex', color: theme.palette.text.gray }}>
                <span className="icon-transfer" style={{ fontSize: '22px', color: '#D8E0E0', marginRight: "5px", marginRight: "5px" }}></span>
                {t('withdrawals')}
              </Box>
              <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center' }} gap={1}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  {showWithdrawalSearch && (
                    <Box sx={{ width: showWithdrawalSearch ? '60%' : '20%' }}>
                      <input
                        type="text"
                        value={withdrawalSearchQuery}
                        onChange={(e) => setWithdrawalSearchQuery(e.target.value)}
                        placeholder={t('searchByOrderId')}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(0, 0, 0, 0.23)',
                          fontSize: '12px',
                          outline: 'none',
                          backgroundColor: '#fff',
                        }}
                      />
                    </Box>
                  )}
                  <IconButton>
                    <span className="icon-magnifier" style={{ fontSize: '15px', color: theme.palette.text.gray }} />
                  </IconButton>
                </Box>
                <TextField
                  type="date"
                  value={withdrawFromDate}
                  onChange={(e) => setWithdrawFromDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ style: { fontSize: '12px', padding: '2px 8px', color: theme.palette.text.gray } }}
                  sx={{ width: '120px', height: '25px', fontSize: '12px', borderRadius: '5px', color: theme.palette.text.gray }}
                />
                <TextField
                  type="date"
                  value={withdrawToDate}
                  onChange={(e) => setWithdrawToDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ style: { fontSize: '12px', padding: '2px 8px', color: theme.palette.text.gray } }}
                  sx={{ width: '120px', height: '25px', fontSize: '12px', borderRadius: '5px', color: theme.palette.text.gray }}
                />
                <Button
                  sx={{ color: theme.palette.orangePrimary.main, fontSize: '11px', textTransform: 'capitalize' }}
                >
                  {t('export')} <KeyboardArrowRightIcon sx={{ color: theme.palette.text.gray, fontSize: '12px' }} />
                </Button>
              </Box>
            </Box>

            <Table>
              <TableHead sx={{ height: '20px', borderBottom: '1px solid #e7e3e3' }}>
                <TableRow>
                  <TableCell sx={{ color: theme.palette.text.gray, borderBottom: 'none', fontSize: '10px', textAlign: 'left', padding: '0px 30px' }}>
                    {t('id')}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.gray, borderBottom: 'none', fontSize: '10px', textAlign: 'center', padding: '0px' }}>
                    {t('date')}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.gray, borderBottom: 'none', fontSize: '10px', textAlign: 'center', padding: '0px' }}>
                    {t('time')}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.gray, borderBottom: 'none', fontSize: '10px', textAlign: 'center', padding: '0px' }}>
                    {t('amount')}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.gray, borderBottom: 'none', fontSize: '10px', textAlign: 'center', padding: '0px' }}>
                    {t('status')}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {[].length > 0 ? (
                  [].map((transaction, index) => {
                    const { time, date } = formatDateTime(transaction.updated_at);
                    return (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'center',
                            justifyContent: 'left',
                            fontSize: '10px',
                            color: theme.palette.text.gray,
                            borderBottom: 'none',
                            height: '35px',
                            width: '25%',
                          }}
                        >
                          <MinimizeOutlinedIcon sx={{ color: theme.palette.orangePrimary.main, fontSize: '14px' }} />
                          <span style={{ borderBottom: '1px solid #9d9d9c' }}>{`#${transaction.order_id}`}</span>
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            fontSize: '10px',
                            color: theme.palette.text.gray,
                            borderBottom: 'none',
                            height: '35px',
                            padding: '10px 0px 0px 10px',
                            width: '25%',
                          }}
                        >
                          {date}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            fontSize: '10px',
                            color: theme.palette.text.gray,
                            borderBottom: 'none',
                            height: '35px',
                            padding: '10px 0px 0px 10px',
                            width: '25%',
                          }}
                        >
                          {time}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            fontSize: '10px',
                            color: theme.palette.text.gray,
                            borderBottom: 'none',
                            height: '35px',
                            padding: '10px 0px 0px 10px',
                            width: '25%',
                          }}
                        >
                          {transaction.value}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            fontSize: '10px',
                            color: '#2e2c2c',
                            borderBottom: 'none',
                            height: '35px',
                            padding: '10px 0px 0px 10px',
                            width: '25%',
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: transaction.client?.status === 'active' ? '#58DC95' : '#EB8084',
                              padding: '3px 15px',
                              borderRadius: '20px',
                            }}
                          >
                            {t(transaction.client?.status || 'unknown')}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', border: 'none', padding: '20px' }}>
                      <Typography sx={{ fontSize: '11px', color: theme.palette.text.default }}>
                        {t('noDataAvailable')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>

      {/* Deposits Section */}
      <Grid item xs={12} md={6} lg={6}>
        <Card sx={{ borderRadius: 4, height: '100%', overflow: 'auto' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" marginBottom="7px">
              <Box variant="body2" sx={{ fontSize: '13px', display: 'flex', color: theme.palette.text.gray }}>
                <span className="icon-transfer" style={{ fontSize: '22px', color: '#D8E0E0', marginRight: "5px" }}></span>
                {t('deposits')}
              </Box>
              <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center' }} gap={1}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  {showDepositSearch && (
                    <Box sx={{ width: showDepositSearch ? '60%' : '20%' }}>
                      <input
                        type="text"
                        value={depositSearchQuery}
                        onChange={(e) => setDepositSearchQuery(e.target.value)}
                        placeholder={t('searchByOrderId')}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(0, 0, 0, 0.23)',
                          fontSize: '12px',
                          outline: 'none',
                          backgroundColor: '#fff',
                        }}
                      />
                    </Box>
                  )}
                  <IconButton onClick={handleDepositSearchClick}>
                    <span className="icon-magnifier" style={{ fontSize: '15px', color: theme.palette.text.gray }} />
                  </IconButton>
                </Box>
                <TextField
                  type="date"
                  value={depositFromDate}
                  onChange={(e) => setDepositFromDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ style: { fontSize: '12px', padding: '2px 8px', color: theme.palette.text.gray } }}
                  sx={{ width: '120px', height: '25px', fontSize: '12px', borderRadius: '5px', color: theme.palette.text.gray }}
                />
                <TextField
                  type="date"
                  value={depositToDate}
                  onChange={(e) => setDepositToDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ style: { fontSize: '12px', padding: '2px 8px', color: theme.palette.text.gray } }}
                  sx={{ width: '120px', height: '25px', fontSize: '12px', borderRadius: '5px', color: theme.palette.text.gray }}
                />

                <Button
                  sx={{ color: theme.palette.orangePrimary.main, fontSize: '11px', textTransform: 'capitalize' }}
                >
                  {t('export')} <KeyboardArrowRightIcon sx={{ color: theme.palette.text.gray, fontSize: '12px' }} />
                </Button>
              </Box>
            </Box>

            <Table>
              <TableHead sx={{ height: '20px', borderBottom: '1px solid #e7e3e3' }}>
                <TableRow>
                  <TableCell sx={{ color: theme.palette.text.gray, borderBottom: 'none', fontSize: '10px', textAlign: 'left', padding: '0px 30px' }}>
                    {t('id')}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.gray, borderBottom: 'none', fontSize: '10px', textAlign: 'center', padding: '0px' }}>
                    {t('date')}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.gray, borderBottom: 'none', fontSize: '10px', textAlign: 'center', padding: '0px' }}>
                    {t('time')}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.gray, borderBottom: 'none', fontSize: '10px', textAlign: 'center', padding: '0px' }}>
                    {t('amount')}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.gray, borderBottom: 'none', fontSize: '10px', textAlign: 'center', padding: '0px' }}>
                    {t('status')}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredDeposits.length > 0 ? (
                  filteredDeposits.map((transaction, index) => {
                    const { time, date } = formatDateTime(transaction.updated_at);
                    return (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'center',
                            justifyContent: 'left',
                            fontSize: '10px',
                            color: theme.palette.text.gray,
                            borderBottom: 'none',
                            height: '35px',
                            width: '25%',
                          }}
                        >
                          <MinimizeOutlinedIcon sx={{ color: theme.palette.orangePrimary.main, fontSize: '14px' }} />
                          <span style={{ borderBottom: '1px solid #9d9d9c' }}>{`#${transaction.order_id}`}</span>
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            fontSize: '10px',
                            color: theme.palette.text.gray,
                            borderBottom: 'none',
                            height: '35px',
                            padding: '10px 0px 0px 10px',
                            width: '25%',
                          }}
                        >
                          {date}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            fontSize: '10px',
                            color: theme.palette.text.gray,
                            borderBottom: 'none',
                            height: '35px',
                            padding: '10px 0px 0px 10px',
                            width: '25%',
                          }}
                        >
                          {time}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            fontSize: '10px',
                            color: theme.palette.text.gray,
                            borderBottom: 'none',
                            height: '35px',
                            padding: '10px 0px 0px 10px',
                            width: '25%',
                          }}
                        >
                          {transaction.value}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            fontSize: '10px',
                            color: '#2e2c2c',
                            borderBottom: 'none',
                            height: '35px',
                            padding: '10px 0px 0px 10px',
                            width: '25%',
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: transaction.client?.status === 'active' ? '#58DC95' : '#EB8084',
                              padding: '3px 15px',
                              borderRadius: '20px',
                            }}
                          >
                            {t(transaction.client?.status || 'unknown')}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', border: 'none', padding: '20px' }}>
                      <Typography sx={{ fontSize: '11px', color: theme.palette.text.default }}>
                        {t('noDataAvailable')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};