import { Box, Card, CardContent, Paper, Typography, IconButton, useTheme } from '@mui/material';
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import AddMenuModal from './AddMenuModal';
import {BASE_URL,BASE_URL_IMG} from  "../../utils/constants";
import RoomServiceOutlinedIcon from '@mui/icons-material/RoomServiceOutlined';

import { useQuery } from '@tanstack/react-query';

const fetchMenus = async () => {
  const response = await axios.get(`${BASE_URL}products`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
  return response.data.products || [];
};

const Product = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const theme = useTheme();

  const {
    data: menus = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['menus'],
    queryFn: fetchMenus,
    staleTime: 1000 * 60 * 5, // 5 دقائق كاش
  });

  const handleDeleteMenu = async (menuId) => {
    try {
      await axios.delete(`${BASE_URL}products/${menuId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      refetch(); // تحديث البيانات بعد الحذف
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  const handleAddClick = () => {
    setOpenAddModal(true);
  };

  const handleCloseModal = () => {
    setOpenAddModal(false);
  };

  const handleMenuAdded = () => {
    refetch(); // تحديث البيانات بعد الإضافة
  };

  if (isLoading) return <Typography>جارٍ التحميل...</Typography>;
  if (isError) return <Typography>حدث خطأ أثناء تحميل البيانات</Typography>;

  return (
    <Box sx={{ display: "flex", padding: "0px 20px", flexWrap: "wrap", gap: "20px" }}>
      {menus.map((menu) => (
        <Card
          key={menu.id}
          sx={{
            borderRadius: '20px',
            width: "17%",
            height: "39vh",
            minWidth: "200px",
            background: `linear-gradient(to Bottom,${theme.palette.secondaryColor.main},#3B2D37,#694328 ,#DA7703)`,
            color: 'white',
            position: 'relative',
          }}>
          {/* <IconButton
            onClick={() => handleDeleteMenu(menu.id)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
              }
            }}
          >
            <DeleteIcon />
          </IconButton> */}
          <CardContent sx={{ padding: "20px" }}>
            <Box>
              
                <RoomServiceOutlinedIcon
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px"
                  }}
                />
              
              
                <RoomServiceOutlinedIcon
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    position: "absolute",
                    bottom: "-10%",
                    right: "-40%",
                    opacity: '.2'
                  }}
                />
              
              <Typography variant="body2" sx={{ letterSpacing: "2px", fontSize: "18px" }}>
                {menu.name}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* <Paper
        onClick={handleAddClick}
        sx={{
          borderRadius: '20px',
          width: "17%",
          height: "39vh",
          display: "flex",
          minWidth: "200px",
          justifyContent: "center",
          textAlign: "center",
          alignItems: "center",
          cursor: 'pointer',
        }}>
        <AddIcon sx={{ fontSize: "50px", color: "#464444" }} />
      </Paper> */}

      <AddMenuModal
        open={openAddModal}
        handleClose={handleCloseModal}
        onSuccess={handleMenuAdded}
      />
    </Box>
  );
};

export default Product;
