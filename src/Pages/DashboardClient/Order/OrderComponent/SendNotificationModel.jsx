import { Button, Divider, Modal, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import React from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
export const SendNotificationModel = ({ open, handleClose }) => {
  const {t} = useTranslation()
  return (
    <Modal open={open} onClose={handleClose}>

      <Box style={{ width: 350, margin: 'auto', marginTop: 200, padding: 20, backgroundColor: 'white', borderRadius: "20px 0px 20px 20px" }}>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontSize={"15px"} color={"black"}>{t("sendNoti")}</Typography>
          <Box
            sx={{ fontSize: "12px", cursor: "pointer" }}
            onClick={handleClose}
          >
            <span class="icon-close-1"></span>
          </Box>
        </Box>
        <Divider sx={{ marginY: 1, background: 'linear-gradient(to right, #feb47b , #ff7e5f)', 
          height: 2,border:"none" ,borderRadius:"30px"}} />


        <TextField
          fullWidth
          label={t("titleEn")}
          variant="outlined"
          sx={{
            marginBottom: 2,
            marginTop: 2,
          }}
          InputProps={{
            sx: {
              height: '40px',
              margin: "auto",
              borderRadius: "10px",
            },

          }}
          InputLabelProps={{
            sx: {
              fontSize: "13px",
              top: "50%",
              transform: "translateY(-50%)",
              padding: "0px 10px"
            },

          }} />


        <TextField
          fullWidth
          multiline
          rows={6}
          placeholder={t("aa")}
          variant="outlined"
          sx={{ borderRadius: "20px" }}
          InputProps={{
            sx: {
              borderRadius: "10px",
            },
          }}
        />

        <Box display="flex" justifyContent="center" marginTop={2}>
          <Button
            variant="contained"
            sx={{
              width: "50%",
              backgroundColor: '#1a1a40',
              color: '#fff', borderRadius: 20,
              textTransform: "capitalize",
              paddingX: 4 , 
              '&:hover': {
                backgroundColor: '#2a2a60', 
            }
            }}
            endIcon={<ArrowForwardIcon sx={{ color: "orange" }} />}
          >
            {t("send")}
          </Button>
        </Box>
      </Box>
    </Modal>

  );
}
