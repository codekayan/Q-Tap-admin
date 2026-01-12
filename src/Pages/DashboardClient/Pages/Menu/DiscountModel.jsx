import { Divider, IconButton, InputAdornment, Modal, Typography, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import DoneIcon from '@mui/icons-material/Done';
import { Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from "../../../../utils/constants"
import { useDispatch, useSelector } from 'react-redux';
import { addDiscounts, deleteDiscounts, selectDiscounts, updataDiscounts } from '../../../../store/client/DiscountMenuSlice';


export const DiscountModel = ({ open, handleClose }) => {
  // form status
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [updataDis, setUpdataDis] = useState('');
  //panal show 
  const [edit, setEdit] = useState(false)
  //
  const selectedBranch = localStorage.getItem("selectedBranch")
  const { t } = useTranslation();
  const theme = useTheme();
  const dipatch = useDispatch()
  // TODO: UPDATA
  const handleAdd = async () => {
    try {
      if (!code || !discount) {
        toast.error(t("plFillAllField"));
        return;
      }

      const formData = {
        code: code,
        discount: discount,
        brunch_id: selectedBranch,
        status: 'active'
      };

      const response = await axios({
        method: 'POST',

        url: `${BASE_URL}meals_discount`,
        data: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('Token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        toast.success(t("discount.addSucc"))
        dipatch(addDiscounts(response.data.data))
        setCode('');
        setDiscount('');
      }
    } catch (error) {
      console.error('Error adding discount:', error);
      const errorMessage = error.response?.data?.message || t("discount.addErr");
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (index, discountId) => {
    try {
      const response = await axios({
        method: 'DELETE',

        url: `${BASE_URL}meals_discount/${discountId}`,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('Token')}`,
        }
      });

      if (response.data) {
        toast.success(t("discount.deleteSucc"));
        dipatch(deleteDiscounts(discountId))
      }
    } catch (error) {
      console.error('Error deleting discount:', error);
      toast.error(t("discount.deleteErr"));
    }
  };
  const discounts = useSelector(selectDiscounts)

  const handleEditToggle = (id) => {
    const dis = discounts?.find(
      (discount) => discount.id === id
    )
    setUpdataDis(dis)
    setEdit(!edit)
  };
  const handleUpdateDiscountStatus = (status) => {
    setUpdataDis(prev => { return { ...prev, status } })
  }
  const handleUpdateDiscountDiscount = (discount) => {
    setUpdataDis(prev => { return { ...prev, discount } })
  }
  const handleUpdateDiscountCode = (code) => {
    setUpdataDis(prev => { return { ...prev, code } })
  }


  const handleUpdate = async () => {

    try {
      const response = await axios.put(

        `${BASE_URL}meals_discount/${updataDis.id}`,
        {
          code: updataDis.code,
          discount: updataDis.discount,
          brunch_id: selectedBranch,
          status: updataDis.status
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`,
          }
        }
      );

      if (response.data) {
        toast.success(t("discount.updateSucc"));
        dipatch(updataDiscounts(response.data.data))
      }
    } catch (error) {
      console.error('Error updating discount:', error);
      toast.error(t("discount.updateErr"));
    } finally {
      setEdit(false)
    }
  };



  return (
    <Modal open={open} onClose={handleClose} disableScrollLock>
      <Box sx={{
        width: 400,
        height: "400px",
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        mx: 'auto',
        mt: '20vh',
        position: 'relative'
      }}>
        <Box sx={{ padding: "20px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body1" sx={{ fontSize: "12px", color: theme.palette.text.gray_white }}>
              {t("discount.codes")}
            </Typography>
            <IconButton onClick={handleClose}>
              <span className="icon-close-1" style={{ fontSize: "12px" }}></span>
            </IconButton>
          </Box>
          <Divider sx={{ backgroundColor: '#F58125', height: '1px' }} />

          <Box sx={{ marginTop: "10px" }}>
            <Grid container spacing={2} sx={{ mb: 2, marginTop: "12px" }}>
              <Grid item xs={6}>
                <Typography variant='body2' sx={{ fontSize: "11px", color: theme.palette.text.gray_white }}>{t("code")}</Typography>
                <TextField
                  fullWidth

                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t("plEnterOnlyDigits")}
                  InputProps={{
                    sx: { height: 33, lineHeight: "25px", borderRadius: "6px", fontSize: "10px" }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='body2' sx={{ fontSize: "11px", color: theme.palette.text.gray_white }}>{t("discount.one")}</Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder={t("plEnterOnlyDigits")}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    sx: { height: 33, lineHeight: "25px", borderRadius: "6px", fontSize: "10px" }
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Button
                onClick={handleAdd}
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.orangePrimary.main,
                  borderRadius: '25px',
                  color: 'white',
                  width: "30%",
                  textTransform: 'none',
                  fontSize: "12px",
                  padding: '2px 10px',
                  '&:hover': {
                    backgroundColor: theme.palette.orangePrimary.main,
                  },
                }}
              >
                <AddIcon sx={{ margin: "0 2px 2px 0", fontSize: "11px", color: "white", "& path": { stroke: "white", strokeWidth: 3 } }} /> {t("add")}
              </Button>
            </Box>
          </Box>
        </Box>

        <Table sx={{ p: 0, mt: 2, mb: 5, width: '100%', tableLayout: 'fixed', overflowY: "auto", backgroundColor: "white", borderRadius: "10px" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#EBEDF3" }}>
              <TableCell sx={{ fontSize: "10px", padding: '0px', borderBottom: "none", textAlign: "center", color: "#575756" }}>{t("code")}</TableCell>
              <TableCell sx={{ fontSize: "10px", padding: '0px', borderBottom: "none", textAlign: "center", color: "#575756" }}>{t("discount.one")}</TableCell>
              <TableCell sx={{ fontSize: "10px", padding: '0px', borderBottom: "none", textAlign: "center", color: "#575756" }}>{t("date")}</TableCell>
              <TableCell sx={{ fontSize: "10px", padding: '0px', borderBottom: "none", textAlign: "center", color: "#575756" }}>{t("status")}</TableCell>
              <TableCell sx={{ fontSize: "10px", padding: '0px', borderBottom: "none", textAlign: "center", color: "#575756" }}>{t("action")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="bg-green-500">
            {discounts.map((discount, index) => (
              <TableRow key={index} sx={{ height: '36px' }}>
                <TableCell sx={{ textAlign: "center", fontSize: "10px", color: "gray", padding: '0px', borderBottom: "none" }}>
                  {edit && updataDis.id === discount.id ? (
                    <TextField
                      value={updataDis?.code}
                      onChange={(e) => handleUpdateDiscountCode(e.target.value)}
                      size="small"
                      sx={{ width: "70px", height: "30px", "& .MuiInputBase-root": { height: "30px", fontSize: "10px" } }}

                    />
                  ) : (
                    discount.code
                  )}
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontSize: "10px", color: "gray", padding: '0px', borderBottom: "none" }}>
                  {edit && updataDis.id === discount.id ? (
                    <TextField
                      value={updataDis?.discount}
                      onChange={(e) => handleUpdateDiscountDiscount(e.target.value)}
                      size="small"
                      sx={{ width: "70px", height: "30px", "& .MuiInputBase-root": { height: "30px", fontSize: "10px" } }}
                      type="number"

                    />
                  ) : (
                    discount.discount
                  )}
                </TableCell>

                <TableCell sx={{ textAlign: "center", fontSize: "10px", color: "gray", padding: '0px', borderBottom: "none" }}>
                  {discount.created_at ? discount.created_at.split('T')[0] : discount.date}
                </TableCell>

                <TableCell sx={{ textAlign: "center", fontSize: "10px", color: "gray", padding: '0px', borderBottom: "none" }}>
                  {edit && updataDis.id === discount.id ? (
                    <Select
                      value={updataDis?.status}
                      onChange={(e) => handleUpdateDiscountStatus(e.target.value)}
                      size="small"
                      sx={{ fontSize: "10px", width: "80px" }}
                    >
                      <MenuItem sx={{ fontSize: "10px" }} value="active">Active</MenuItem>
                      <MenuItem sx={{ fontSize: "10px" }} value="inactive">Inactive</MenuItem>
                    </Select>
                  ) : (
                    <Box sx={{
                      color: "white",
                      backgroundColor: discount.status === 'active' ? "#479947" : "#f05e5e",
                      width: "55px", padding: "0px",
                      borderRadius: '12px',
                      display: 'inline-block',
                    }}>
                      {discount.status}
                    </Box>
                  )}
                </TableCell>

                <TableCell sx={{ fontSize: "10px", textAlign: "center", padding: '0px', borderBottom: "none" }}>
                  {edit && updataDis.id === discount.id ? (
                    <IconButton size="small" onClick={() => handleUpdate()} color="success">
                      <DoneIcon sx={{ fontSize: "18px" }} />
                    </IconButton>
                  ) : (
                    <IconButton size="small" onClick={() => handleEditToggle(discount.id)} color="success">
                      <span className="icon-edit" sx={{ fontSize: "10px", color: "black" }}></span>
                    </IconButton>
                  )}

                  <IconButton size="small" onClick={() => handleDelete(index, discount.id)} color="error">
                    <span className="icon-delete" sx={{ fontSize: "10px" }}></span>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Modal>
  );
};
