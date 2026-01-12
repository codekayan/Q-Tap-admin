import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  TextField,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import { toast } from "react-toastify";
import styles from './campaignsCard.module.css';
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../../utils/constants";
  
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Campaigns = () => {
  const [openForm, setOpenForm] = useState(false);
  const theme = useTheme();
  const [name, setName] = useState("");
  const [commission, setCommission] = useState("");
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const toggleForm = () => {
    setOpenForm(!openForm);
    if (editingCampaign) {
      setEditingCampaign(null);
      setName("");
      setCommission("");
      setLimit("");
    }
  };

  // Fetch campaigns from API
  const getCampaigns = async () => {
    const response = await axios.get(`${BASE_URL}campaigns`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return response.data || [];
  };

  // UseQuery for fetching campaigns
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: getCampaigns,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    onError: (error) => {
      console.error("Error fetching campaigns:", error);
    },
  });

  const handleDeleteCampaign = async (campaignId) => {
    try {
      await axios.delete(`${BASE_URL}campaigns/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      toast.success(t("campaignDeleted"));
      // Update cached data
      queryClient.setQueryData(['campaigns'], (oldData) =>
        oldData.filter(campaign => campaign.id !== campaignId)
      );
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error(t("errorDeleteCampaign"));
    }
  };

  const handleAddCampaign = async () => {
    try {
      setLoading(true);
      if (!name || !commission || !limit) {
        toast.error(t("plFillAllField"));
        return;
      }

      const dataCampaign = {
        name: name.trim(),
        commission: parseFloat(commission),
        limit: parseInt(limit),
      };

      const response = await axios.post(
        `${BASE_URL}campaigns`,
        dataCampaign,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        toast.success(t("campaignAddedSucc"));
        // Update cached data
        queryClient.setQueryData(['campaigns'], (oldData) => [
          response.data,
          ...(oldData || []),
        ]);
        setName("");
        setCommission("");
        setLimit("");
        setOpenForm(false);
      }
    } catch (error) {
      console.error("Error adding campaign:", error);
      const errorMessage =
        error.response?.data?.message || t("errorAddingCampign");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCampaign = async (campaignId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}campaigns/${campaignId}`,
        {
          name: name.trim(),
          commission: parseFloat(commission),
          limit: parseInt(limit),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      toast.success(t("campaignUpdateSucc"));
      // Update cached data
      queryClient.setQueryData(['campaigns'], (oldData) =>
        oldData.map(campaign =>
          campaign.id === campaignId
            ? { ...campaign, name: name.trim(), commission: parseFloat(commission), limit: parseInt(limit) }
            : campaign
        )
      );
      setEditingCampaign(null);
      setName("");
      setCommission("");
      setLimit("");
      setOpenForm(false);
    } catch (error) {
      console.error("Error editing campaign:", error);
      const errorMessage =
        error.response?.data?.message || t("errorUpdateCampaign");
      toast.error(errorMessage);
    }
  };

  const openEditForm = (campaign) => {
    setEditingCampaign(campaign.id);
    setName(campaign.name);
    setCommission(campaign.commission);
    setLimit(campaign.limit);
    setOpenForm(true);
  };

  return (
    <Paper sx={{ borderRadius: "20px", padding: "10px 20px", height: "250px", overflow: 'auto' }}>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontSize: "14px", color: theme.palette.text.gray }}
          >
            {t("campaigns")}
          </Typography>
          <Box>
            <IconButton
              onClick={toggleForm}
              sx={{
                color: theme.palette.orangePrimary.main,
                "&:hover": { color: "darkorange" },
              }}
            >
              <AddCircleOutlineIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>

        {openForm && (
          <Paper
            elevation={3}
            sx={{
              position: "relative",
              float: "right",
              zIndex: 3,
              width: "160px",
              padding: "10px 20px",
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              sx={{ color: theme.palette.text.gray, fontSize: "11px", marginBottom: "10px" }}
            >
              {editingCampaign ? t("editCampaign") : t("newCampaign")}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "9px", color: theme.palette.text.gray }}>
              {t("name")}
            </Typography>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{
                sx: {
                  height: "20px",
                  borderRadius: "5px",
                  fontSize: "10px",
                  color: "gray",
                },
              }}
            />
            <Typography variant="body2" sx={{ fontSize: "9px", color: theme.palette.text.gray }}>
              {t("commission")}
            </Typography>
            <TextField
              value={commission}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setCommission(value);
                }
              }}
              type="number"
              fullWidth
              variant="outlined"
              InputProps={{
                sx: {
                  height: "20px",
                  borderRadius: "5px",
                  fontSize: "10px",
                  color: "gray",
                },
              }}
            />
            <Typography variant="body2" sx={{ fontSize: "9px", color: theme.palette.text.gray }}>
              {t("limit")}
            </Typography>
            <TextField
              value={limit}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d+$/.test(value)) {
                  setLimit(value);
                }
              }}
              type="number"
              fullWidth
              variant="outlined"
              InputProps={{
                sx: {
                  height: "20px",
                  borderRadius: "5px",
                  fontSize: "10px",
                  color: "gray",
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                onClick={
                  editingCampaign
                    ? () => handleEditCampaign(editingCampaign)
                    : handleAddCampaign
                }
                disabled={loading}
                variant="contained"
                sx={{
                  marginTop: "5px",
                  textAlign: "center",
                  borderRadius: "20px",
                  padding: "1px 30px",
                  fontSize: "11px",
                  backgroundColor: theme.palette.orangePrimary.main,
                  textTransform: "capitalize",
                  "&:hover": { backgroundColor: "#ef7d10" },
                }}
              >
                {loading ? t("saving") : t("save")}
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "150px" }}>
            <Typography>{t("loading")}</Typography>
          </Box>
        ) : campaigns.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "150px" }}>
            <Typography>{t("noCampaigns")}</Typography>
          </Box>
        ) : (
          campaigns.map((campaign) => (
            <Card
              className={styles.card}
              key={campaign.id}
              sx={{
                width: "160px",
                height: "175px",
                background: "linear-gradient(to top right,rgba(34, 34, 64, 0.86) 10%, #222240)",
                borderRadius: "20px",
                padding: "12px 15px",
                color: "white",
                position: "relative",
                margin: { xs: 'auto', sm: '0px' },
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: "8px", color: "white" }}
              >
                {t("name")}
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginBottom: "8px", fontSize: "18px", color: theme.palette.orangePrimary.main }}
              >
                {campaign.name}
              </Typography>

              <Typography
                variant="body2"
                sx={{ fontSize: "8px", color: "white" }}
              >
                {t("commission")}
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginBottom: "8px", fontSize: "18px", color: theme.palette.orangePrimary.main }}
              >
                {campaign.commission}%
              </Typography>

              <Typography
                variant="body2"
                sx={{ fontSize: "8px", color: "white" }}
              >
                {t("affiliateNo")}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "18px", color: theme.palette.orangePrimary.main }}
              >
                {campaign.limit}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <IconButton sx={{ color: "white" }}>
                  <span
                    className="icon-delete"
                    style={{ fontSize: "15px", color: "white" }}
                    onClick={() => handleDeleteCampaign(campaign.id)}
                  ></span>
                </IconButton>
                <IconButton sx={{ color: "white" }}>
                  <img
                    src="/assets/setting.svg"
                    alt="icon"
                    style={{ color: "white", width: "16px", height: "16px" }}
                    onClick={() => openEditForm(campaign)}
                  />
                </IconButton>
              </Box>
            </Card>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default Campaigns;