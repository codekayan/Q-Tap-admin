
import { Divider, MenuItem, TextField, Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import React from 'react';
import { useTranslation } from 'react-i18next';
export const PaymentInfo = ({
  selectedOption,
  setSelectedOption,
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  accountName,
  setAccountName,
  errors,
  setAddressBank,
  addressBank
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const handleSelect = (option) => {
    setSelectedOption(option);
    

  };

  const options = [
    { label: "Bank", icon: <img src='/assets/bank.svg' alt='bank icon' style={{ width: "25px", height: "25px" }} /> },
    { label: "D.Wallet", icon: <span className="icon-wallet1" style={{ fontSize: "22px" }}></span> },
    { label: "Card", icon: <img src='/assets/card.svg' alt='card icon' style={{ width: "25px", height: "25px" }} /> },
  ];

  const renderFields = () => {
    switch (selectedOption) {
      case "Bank":
        return (
          <>
            <Typography variant='body2' sx={{ fontSize: "8px", color: theme.palette.text.gray }}>{t("name")}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: "5px", height: "30px", fontSize: "12px", color: theme.palette.text.gray, width: "85%" } }}
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              error={!!errors.bankName}
            />

            <Typography variant='body2' sx={{ fontSize: "8px", color: theme.palette.text.gray }}>{t("iban")}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: "5px", height: "30px", fontSize: "12px", color: theme.palette.text.gray, width: "85%" } }}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              error={!!errors.accountNumber}
            />

            <Typography variant='body2' sx={{ fontSize: "8px", color: theme.palette.text.gray }}>{t("Bank")}</Typography>
            <TextField
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              select
              fullWidth
              InputProps={{ sx: { borderRadius: "5px", fontSize: "12px", color: theme.palette.text.gray, height: "30px", width: "85%" } }}
            >
              <MenuItem value="nbe" sx={{ fontSize: "11px", color: theme.palette.text.gray, padding: "0px 20px" }}>NBE</MenuItem>
              <Divider sx={{ width: "90%", marginLeft: "10px" }} />
              <MenuItem value="cib" sx={{ fontSize: "11px", color: theme.palette.text.gray, padding: "0px 20px" }}>CIB</MenuItem>
              <Divider sx={{ width: "90%", marginLeft: "10px" }} />
              <MenuItem value="fab" sx={{ fontSize: "11px", color: theme.palette.text.gray, padding: "0px 20px" }}>FAB</MenuItem>
            </TextField>

            <Typography variant='body2' sx={{ fontSize: "8px", color: theme.palette.text.gray, marginTop: "8px" }}>{t("address")}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: "5px", height: "30px", fontSize: "12px", color: theme.palette.text.gray, width: "85%" } }}
              value={addressBank}
              onChange={(e) => setAddressBank(e.target.value)}
              error={!!errors.addressBank}
            />
          </>
        );
      case "D.Wallet":
        return (
          <>
            <Typography variant='body2' sx={{ fontSize: "8px", color: theme.palette.text.gray }}>{t("name")}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: "5px", height: "30px", fontSize: "12px", color: theme.palette.text.gray, width: "85%" } }}
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              error={!!errors.bankName}
            />
            <Typography variant='body2' sx={{ fontSize: "8px", color: theme.palette.text.gray }}>{t("walletNo")}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: "5px", height: "30px", fontSize: "12px", color: theme.palette.text.gray, width: "85%" } }}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              error={!!errors.accountNumber}
            />
            <Typography variant='body2' sx={{ fontSize: "8px", color: theme.palette.text.gray }}>{t("courier")}</Typography>
            <TextField
              select
              fullWidth
              InputProps={{ sx: { borderRadius: "5px", fontSize: "12px", color: theme.palette.text.gray, height: "30px", width: "85%" } }}
            >
              <MenuItem value="afaf" sx={{ fontSize: "11px", color: theme.palette.text.gray, padding: "0px 20px" }}>Afaf</MenuItem>
              <Divider sx={{ width: "90%", marginLeft: "10px" }} />
              <MenuItem value="ahmed" sx={{ fontSize: "11px", color: theme.palette.text.gray, padding: "0px 20px" }}>Ahmed</MenuItem>
              <Divider sx={{ width: "90%", marginLeft: "10px" }} />
              <MenuItem value="shimaa" sx={{ fontSize: "11px", color: theme.palette.text.gray, padding: "0px 20px" }}>Shimaa</MenuItem>
            </TextField>
          </>
        );
      case "Card":
        return (
          <>
            <Typography variant='body2' sx={{ fontSize: "8px", color: theme.palette.text.gray }}>{t("name")}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: "5px", height: "30px", fontSize: "12px", color: theme.palette.text.gray, width: "85%" } }}
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              error={!!errors.bankName}
            />
            <Typography variant='body2' sx={{ fontSize: "8px", color: theme.palette.text.gray }}>{t("cardNo")}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: "5px", height: "30px", fontSize: "12px", color: theme.palette.text.gray, width: "85%" } }}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              error={!!errors.accountNumber}
            />
            <Typography variant='body2' sx={{ fontSize: "8px", color: theme.palette.text.gray }}>{t("Bank")}</Typography>
            <TextField
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              select
              fullWidth
              InputProps={{ sx: { borderRadius: "5px", fontSize: "12px", color: theme.palette.text.gray, height: "30px", width: "85%" } }}
            >
              <MenuItem value="nbe" sx={{ fontSize: "11px", color: theme.palette.text.gray, padding: "0px 20px" }}>NBE</MenuItem>
              <Divider sx={{ width: "90%", marginLeft: "10px" }} />
              <MenuItem value="cib" sx={{ fontSize: "11px", color: theme.palette.text.gray, padding: "0px 20px" }}>CIB</MenuItem>
              <Divider sx={{ width: "90%", marginLeft: "10px" }} />
              <MenuItem value="fab" sx={{ fontSize: "11px", color: theme.palette.text.gray, padding: "0px 20px" }}>FAB</MenuItem>
            </TextField>
            <Typography variant='body2' sx={{ fontSize: "8px", color: theme.palette.text.gray, marginTop: "8px" }}>{t("address")}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: "5px", height: "30px", fontSize: "12px", color: theme.palette.text.gray, width: "85%" } }}
              value={addressBank}
              onChange={(e) => setAddressBank(e.target.value)}
              error={!!errors.addressBank}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box padding={"0px 50px"}>
      <Typography variant="body2" sx={{ fontSize: "12px" }} color={theme.palette.text.gray} gutterBottom>
        {t("paymentInfo")}
      </Typography>
      <Divider sx={{ borderRadius: "30px", width: "18%", borderBottom: "4px solid #ef7d00", marginBottom: "18px" }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "50%", marginTop: "30px" }}>
        {options.map((option) => (
          <Box key={option.label} sx={{ textAlign: "center" }}>
            <Box
              onClick={() => handleSelect(option.label)}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "45px",
                height: "45px",
                borderRadius: "8px",
                border: "1px solid #c9c6c6fa",
                cursor: "pointer",
                borderColor: selectedOption === option.label ? theme.palette.orangePrimary.main : "#D3D3D3",
                '&:hover': { borderColor: theme.palette.orangePrimary.main }
              }}
            >
              <Box sx={{ color: selectedOption === option.label ? theme.palette.orangePrimary.main : "grey" }}>
                {option.icon}
              </Box>
            </Box>
            <Typography
              sx={{
                marginTop: "5px",
                fontSize: "10px", color: theme.palette.text.gray
              }}
            >
              {t(option.label)}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ flex: 1, width: "65%", marginTop: "30px" }}>
        {renderFields()}
      </Box>
    </Box>
  );
};