import React, { useState } from 'react';
import { Box, Typography, IconButton, Divider, useTheme } from '@mui/material';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AddBundle from './AddBundle';
import { DiscountModelAdmin } from './DiscountModelAdmin';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from "../../utils/constants";
import { Settings } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const Pricing = () => {
  const [open, setOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [openDiscount, setOpenDiscount] = useState(false);
  const { t } = useTranslation()
  const theme = useTheme();
  const handleOpen = () => {
    setSelectedBundle(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBundle(null);
  };

  const handleSettingsClick = (bundle) => {
    setSelectedBundle(bundle);
    setOpen(true);
  };

  const handleDiscountOpen = () => {
    setOpenDiscount(true);
  };

  const handleDiscountClose = () => {
    setOpenDiscount(false);
  };
  /// card pricing structure 
  const PricingCard = ({ title, priceMonthly, priceYearly, description, features, id, refetch }) => {
    // delete pricing data from api
    const handleDelete = () => {

      fetch(`${BASE_URL}pricing/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
        .then(response => {
          if (response.status === 204) {
            return { success: true };
          }
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text().then(text => {
            return text ? JSON.parse(text) : { success: true };
          });
        })
        .then(data => {
          console.log('Delete successful:', data);
          toast.success("Delete successful")
          refetch();
        })
        .catch(error => {
          console.error('Error deleting pricing data:', error);
          alert('Failed to delete pricing data. Please try again.');
        });
    };

    return (
      <Box sx={{
        borderRadius: '50px 50px 50px 0px',
        padding: '20px 35px',
        width: '28%',
        backgroundColor: theme.palette.bodyColor.secandary,
        margin: '20px',
        marginTop: "70px",
        minWidth: "200px",
      }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', position: "relative", top: "-40px", }}>
          <Box
            sx={{
              backgroundColor: theme.palette.orangePrimary.main,
              textAlign: 'center',
              padding: '5px 20px',
              width: "170px",
              borderRadius: "40px",
              color: '#fff',
            }}
          >
            <Typography variant="h6">{t(title)}</Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', marginTop: "-20px" }}>
          <Typography variant="h4" color="textPrimary">
            <sup style={{ color: theme.palette.orangePrimary.main, fontSize: "12px", marginRight: "10px" }}>EGP</sup>{priceMonthly}
            <Typography component="span" variant="body2" color="textSecondary">
              /{t("month")}
            </Typography>
          </Typography>

          <Typography variant="h6" color="textPrimary" sx={{ marginTop: "10px" }}>
            <sup style={{ color: theme.palette.orangePrimary.main, fontSize: "12px", marginRight: "10px" }}>EGP</sup>{priceYearly}
            <Typography component="span" variant="body2" color="textSecondary">
              /{t("year")}
            </Typography>
          </Typography>
          <Divider sx={{ my: 2, backgroundColor: theme.palette.orangePrimary.main, width: "100%" }} />
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '40px', fontSize: "11px" }}>
          {description}
        </Typography>

        <Box>
          {features.map((feature, index) => (
            <Typography key={index} variant="body2" color="textSecondary" display="flex"
              sx={{ fontSize: "10px", paddingTop: "8px", wordSpacing: "2px" }} >
              <DoneOutlinedIcon sx={{ color: '#f57c00', marginRight: '5px', fontSize: "15px", fontWeight: "bold" }} />
              {feature}
            </Typography>
          ))}
        </Box>

        <Box display="flex" justifyContent="center" mt={3}>
          <IconButton onClick={handleDelete}>
            <span className="icon-delete" style={{ color: theme.palette.text.gray, fontSize: "25px" }} />
          </IconButton>
          <IconButton onClick={() => handleSettingsClick({ id, name: title, monthly_price: priceMonthly, yearly_price: priceYearly, description, feature: JSON.stringify(features) })}>
            <Settings src="/assets/setting.svg" alt="icon" style={{ color: theme.palette.text.gray, fontSize: "25px" }} />
          </IconButton>
        </Box>
      </Box>
    );
  };


  const getPrice = async () => {
    try {
      const response = await fetch(`${BASE_URL}pricing`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || []; // أو result.pricing حسب استجابة السيرفر

    } catch (error) {
      console.error(error.message || "Failed to fetch pricing data");
      return [];
    }
  };

  const token = localStorage.getItem('adminToken');

  const { data: pricing = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['price'],
    queryFn: getPrice,
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  });

  return (
    <Box sx={{ padding: "0px 20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "center", }}>
        <Typography sx={{ fontSize: "14px", color: theme.palette.text.gray }}>{t("bundle")}</Typography>

        <Box sx={{ display: "flex" }}>
          <Typography onClick={handleDiscountOpen}
            sx={{
              color: theme.palette.text.gray, cursor: "pointer", border: "1px solid gray",
              padding: "3px 15px", borderRadius: "30px", fontSize: "12px"
            }}>
            <span style={{ color: theme.palette.orangePrimary.main, fontSize: "17px", marginRight: "5px" }}>%</span>
            {t("disCode")}
          </Typography>
          <DiscountModelAdmin open={openDiscount} handleClose={handleDiscountClose} />

          <AddOutlinedIcon
            onClick={handleOpen}
            sx={{
              color: theme.palette.orangePrimary.main,
              border: "3px solid #ef7d00", borderRadius: "50%",
              fontSize: '32px', marginLeft: "15px", cursor: "pointer",
            }}
          />
          <AddBundle
            open={open}
            onClose={handleClose}
            editData={selectedBundle}
            refetch={refetch}
          />
        </Box>
      </Box>

      <Divider sx={{
        width: "100%", borderRadius: "20px", borderBottom: "none", marginTop: "10px",
        background: 'linear-gradient(90deg, #FDB913 0%, #F2672E 100%)', height: "3px"
      }} />

      <Box display="flex" justifyContent="center" flexWrap="wrap" >
        {Array.isArray(pricing) ? pricing?.map((item) => (
          <PricingCard
            key={item.id}
            title={item.name}
            priceMonthly={item.monthly_price}
            priceYearly={item.yearly_price}
            description={item.description}
            features={JSON.parse(item.feature)}
            id={item.id}
            refetch={refetch}
          />
        )) : null}
      </Box>
    </Box>
  );
};
