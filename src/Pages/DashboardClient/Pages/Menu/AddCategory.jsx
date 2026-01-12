import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, DialogContent, Dialog, TextField, Button, IconButton, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import StraightIcon from '@mui/icons-material/Straight';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from "../../../../utils/constants"
import { useDispatch } from 'react-redux';
import { addNewCat } from '../../../../store/client/menuSlice';

const CategoryForm = ({ open, handleClose }) => {
  const [name, setName] = useState('');
  const theme = useTheme();
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [cover, setCover] = useState(null);
  const [categories, setCategories] = useState([]);
  const selectedBranch = localStorage.getItem("selectedBranch")
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file);
    }
  };
  const dispatch = useDispatch()
  const handleAdd = async () => {
    try {
      setIsLoading(true);
      if (!name || !description) {
        toast.error(t("plFillAllField"));
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', image);
      formData.append('cover', cover);
      formData.append('brunch_id', selectedBranch);

      const response = await axios({
        method: 'POST',

        url: `${BASE_URL}meals_categories`,
        data: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('Token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        toast.success(t("category.addSucc"));
        dispatch(addNewCat(response.data))
        // reload page to get new category whic added now
        const today = new Date().toLocaleDateString();
        const newCategory = {
          name,
          description,
          image: URL.createObjectURL(image),
          date: today,
          status: 'Active'
        };
        setCategories([...categories, newCategory]);
        setName('');
        setDescription('');
        setImage(null);
        setCover(null);
        handleClose()
        // window.location.reload();

      }
    } catch (error) {
      console.error('Error adding category:', error);
      const errorMessage = error.response?.data?.message || t("category.addErr");
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach(err => {
          toast.error(err.join(', '));
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} disableScrollLock>
      <DialogContent sx={{ width: "400px", backgroundColor: theme.palette.bodyColor.white_lightBlack, borderRadius: "20px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" fontSize={"13px"} color={theme.palette.text.gray_white}>{t("category.add")}</Typography>
          <IconButton onClick={handleClose}>
            <span className="icon-close-1" style={{ fontSize: "11px" }}></span>
          </IconButton>
        </Box>
        <Divider sx={{ background: 'linear-gradient(to left, #ff7e5f, #feb47b)', marginBottom: "10px", height: 1 }} />
        <Box display="flex" flexDirection="column" gap={2} sx={{ marginBottom: 2 }}>
          <Box display="flex" justifyContent="space-between" gap={2}>
            <Box flex={1}>
              <Typography variant="body2" align="left" sx={{ marginBottom: '4px', color: theme.palette.text.gray_white, fontSize: "10px" }}>{t("name")}</Typography>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{ height: '40px', '& .MuiInputBase-root': { height: '35px' }, color: theme.palette.text.gray_white }}
              />
            </Box>
            <Box flex={1}>
              <Typography variant="body2" align="left" sx={{ marginBottom: '4px', color: theme.palette.text.gray_white, fontSize: "10px" }}>{t("discription")}</Typography>
              <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                sx={{ height: '40px', '& .MuiInputBase-root': { height: '35px' }, color: theme.palette.text.gray_white }}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ marginY: 3, display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
          <Box sx={{ marginBottom: 2 }}>
            <Box sx={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#f5f5f5',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Category" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (<>
                <span className="icon-image-gallery" style={{ fontSize: "30px", color: "gray" }}></span>
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  height: '25%',
                  backgroundColor: theme.palette.secondaryColor.main,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '8px',
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                    <StraightIcon sx={{ color: theme.palette.orangePrimary.main, fontSize: '10px', marginRight: '4px' }} />
                    {t("upload")}
                  </label>
                </Box>
              </>)}
            </Box>
            <Typography variant="body2" sx={{ fontSize: "8px", color: "#9d9d9c", marginTop: '4px', textAlign: 'center' }}>
              {t("category.iconSize")}
            </Typography>
          </Box>
          <Box sx={{ marginBottom: 1 }}>
            <Box sx={{
              width: '250px',
              height: '100px',
              borderRadius: "20px",
              backgroundColor: '#f5f5f5',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="cover-upload"
                onChange={handleCoverChange}
              />
              <label htmlFor="cover-upload" style={{ cursor: 'pointer' }}>
                {cover ? (
                  <img src={URL.createObjectURL(cover)} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (<>
                  <span className="icon-image-gallery" style={{ fontSize: "35px", color: "gray" }}></span>
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    width: '100%',
                    height: '20%',
                    backgroundColor: theme.palette.secondaryColor.main,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: 'white',
                    fontSize: '8px',
                  }}>
                    <StraightIcon sx={{ color: theme.palette.orangePrimary.main, fontSize: '10px', marginRight: '4px' }} />
                    {t("upload")}
                  </Box>
                </>)}
              </label>
            </Box>
            <Typography variant="body2" sx={{ fontSize: "8px", color: "#9d9d9c", marginTop: '4px', textAlign: 'center' }}>
              {t("category.iconSize")}
            </Typography>
          </Box>
          <Button
            onClick={handleAdd}
            disabled={isLoading}
            variant="contained" color="warning" fullWidth
            sx={{ width: "40%", fontSize: "11px", borderRadius: "20px", marginTop: 2, textTransform: "capitalize" }}>
            {/* <CheckIcon sx={{ fontSize: "16px", marginRight: "5px" }} /> */}
            {isLoading ? t("loading") : t("add")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
