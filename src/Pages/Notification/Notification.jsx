import { Box, Divider, IconButton, Paper, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { AddNotification } from './AddNotification';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {BASE_URL,BASE_URL_IMG} from  "../../utils/constants";

export const Notification = () => {
  const [open, setOpen] = useState(false);
  const [notificationsData, setNotificationsData] = useState([]);
  const { t } = useTranslation();
  const theme = useTheme();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch notifications when component mounts
  useEffect(() => {
    getNotifications();
  }, []);

  // Function to fetch notifications
  const getNotifications = () => {

    fetch(`${BASE_URL}note`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.notes) {
          setNotificationsData(data.notes);
        }
      })
      .catch(error => console.error('Error fetching notifications:', error));
  };

  const handleDelete = (id) => {
    fetch(`${BASE_URL}note/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          // toast.success('Notification deleted successfully!');
          getNotifications();
        } else {
          toast.error(t("faildDeleteNotification"));
        }
      })
      .catch(error => console.error('Error deleting notification:', error));
  };

  return (
    <Box sx={{ padding: "0px 20px" }}>
      <Paper sx={{ borderRadius: "20px", padding: "30px", height: "80vh" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ color: theme.palette.text.gray, fontSize: "15px" }}>{t("history")}</Typography>
          <IconButton onClick={handleOpen}>
            <AddIcon sx={{ fontSize: "35px", fontWeight: "bolder", color: theme.palette.orangePrimary.main, cursor: "pointer" }} />
          </IconButton>
        </Box>
        <AddNotification
          open={open}
          handleClose={() => {
            handleClose();
            getNotifications(); // Refresh notifications after adding new one
          }}
        />

        <Divider />

        <Box sx={{ marginTop: "20px", height: "65vh", overflowY: "auto" }}>
          {notificationsData && notificationsData.map((notification) => (
            <Box key={notification.id} display="flex" justifyContent="center" alignItems="center" sx={{ marginBottom: '8px' }}>
              <Paper
                sx={{
                  width: "100%",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: "30px",
                  paddingLeft: "15px",
                  borderRadius: '20px',
                  backgroundColor: theme.palette.bodyColor.secandaryInput,
                  color: theme.palette.text.gray,
                  boxShadow: "none",
                  overflow: 'hidden',
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NotificationsNoneOutlinedIcon sx={{ marginRight: '20px', color: "gray", fontSize: "20px" }} />
                  <Typography variant="body2" sx={{ color: "#AAAAAA", marginRight: '10px', fontSize: "12px", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '30%' }}>
                    {notification.title}
                  </Typography>
                  <Divider orientation="vertical" flexItem sx={{ marginRight: '10px' }} />
                  <Typography variant="body2" sx={{ color: "#AAAAAA", marginRight: '10px', fontSize: "12px", width: "80%", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '20vw' }}>
                    {notification.content}
                  </Typography>
                  {/* <Divider orientation="vertical" flexItem sx={{ marginRight: '10px' }} />
                  <Typography variant="body2" sx={{ color: "#AAAAAA", fontSize: "12px" }}>
                    {new Date(notification.created_at).toLocaleDateString()}
                  </Typography> */}
                </Box>
              </Paper>
              <IconButton onClick={() => handleDelete(notification.id)}>
                <span className="icon-delete" style={{ fontSize: "23px", color: '#F44336' }}></span>
              </IconButton>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};
