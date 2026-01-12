import React, { useState } from 'react';
import { IconButton, Modal, Typography, Divider, Grid, TextField, Button, MenuItem, Select, Box, useTheme } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BASE_URL,BASE_URL_IMG } from "../../../../utils/constants";

export const AddFeedback = ({ open, handleCloseModel, onAddFeedback }) => {
    const [clientId, setClientId] = useState(""); // Assuming this is the customer ID
    const [star, setStar] = useState(0);
    const [emoji, setEmoji] = useState("");
    const [yourGoals, setYourGoals] = useState("");
    const [missingQTapMenus, setMissingQTapMenus] = useState("");
    const [comment, setComment] = useState("");
    const [phone, setPhone] = useState("");
    const { t } = useTranslation();
    const theme = useTheme();

    const handleStarClick = (newRate) => {
        setStar(newRate);
    };

    const handleSave = async () => {
        if (star === 0 || !emoji || !yourGoals || !missingQTapMenus || !comment || !phone) {
            toast.error(t("plFillAllField"));
            return;
        }

        const data = {
            brunch_id: localStorage.getItem("selectedBranch"),
            star: star.toString(),
            emoji: emoji === "sad" ? "said" : emoji, // Map "sad" to "said" as per API example
            your_goals: yourGoals,
            "missing_Q-tap_Menus": missingQTapMenus,
            comment: comment,
            phone: phone
        };

        try {
            const response = await axios.post(

                `${BASE_URL}feedback_restaurant`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                    },
                }
            );

            if (response.data) {
                onAddFeedback(response.data); // Pass the API response to parent
                toast.success(t("feedbacks.addSucc"));
                setClientId("");
                setStar(0);
                setEmoji("");
                setYourGoals("");
                setMissingQTapMenus("");
                setComment("");
                setPhone("");
                handleCloseModel();
            }
        } catch (error) {
            console.error('Error adding feedback:', error);
            toast.error(error.response?.data?.message || t("feedbacks.addErr"));
        }
    };

    return (
        <Modal disableScrollLock open={open} onClose={handleCloseModel}>
            <Box
                sx={{
                    width: 500,
                    height: "auto",
                    bgcolor: 'background.paper',
                    p: '25px 50px 25px 20px',
                    borderRadius: 3,
                    boxShadow: 24,
                    mx: 'auto',
                    mt: '10vh',
                    position: 'relative',
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body1" sx={{ fontSize: "13px", color: theme.palette.text.gray }}>
                        {t("addFeedback")}
                    </Typography>
                    <IconButton onClick={handleCloseModel}>
                        <span className="icon-close-1" style={{ fontSize: "12px", color: "#AAAAAA" }} />
                    </IconButton>
                </Box>
                <Divider sx={{ backgroundColor: '#FF6600', height: '1px' }} />

                <Grid container spacing={2} sx={{ margin: "20px 0px" }}>

                    <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontSize: "10px", color: theme.palette.text.gray, marginBottom: "3px" }}>
                            {t("rate")}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <IconButton
                                    key={index}
                                    onClick={() => handleStarClick(index + 1)}
                                    sx={{ padding: '3px' }}
                                >
                                    {index < star ? (
                                        <StarIcon sx={{ fontSize: '20px', color: theme.palette.orangePrimary.main }} />
                                    ) : (
                                        <StarOutlineIcon sx={{ fontSize: '20px', color: theme.palette.orangePrimary.main }} />
                                    )}
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontSize: "10px", color: theme.palette.text.gray, marginBottom: "3px" }}>
                            {t("phone")}
                        </Typography>
                        <TextField
                            type='number'
                            variant="outlined"
                            fullWidth
                            placeholder={t("phone")}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            InputProps={{ sx: { height: '30px', fontSize: "10px" } }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontSize: "10px", color: theme.palette.text.gray, marginBottom: "3px" }}>
                            {t("yourGoals")}
                        </Typography>
                        <Select
                            value={yourGoals}
                            onChange={(e) => setYourGoals(e.target.value)}
                            fullWidth
                            sx={{ height: '30px', fontSize: "10px" }}
                        >
                            <MenuItem value="yes">
                                {t("yes")}
                            </MenuItem>
                            <MenuItem value="no">
                                {t("no")}
                            </MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontSize: "10px", color: theme.palette.text.gray, marginBottom: "3px" }}>
                            {t("status")}
                        </Typography>
                        <Select
                            value={emoji}
                            onChange={(e) => setEmoji(e.target.value)}
                            fullWidth
                            sx={{ height: '30px', fontSize: "10px" }}
                        >
                            <MenuItem value="said">
                                {t("sad")}
                            </MenuItem>
                            <MenuItem value="happy">
                                {t("happy")}
                            </MenuItem>
                            <MenuItem value="very happy">
                                {t("veryHappy")}
                            </MenuItem>
                        </Select>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontSize: "10px", color: theme.palette.text.gray, marginBottom: "3px" }}>
                            {t("missingQTapMenus")}
                        </Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            placeholder={t("typeHere")}
                            value={missingQTapMenus}
                            onChange={(e) => setMissingQTapMenus(e.target.value)}
                            InputProps={{ sx: { height: '30px', fontSize: "10px" } }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontSize: "10px", color: theme.palette.text.gray, marginBottom: "3px" }}>
                            {t("comment")}
                        </Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            placeholder={t("typeHere")}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            multiline
                            rows={3}
                            InputProps={{ sx: { fontSize: "10px" } }}
                        />
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.orangePrimary.main,
                            borderRadius: '25px',
                            color: 'white',
                            textTransform: 'none',
                            padding: '2px 50px',
                            '&:hover': { backgroundColor: '#f18101' },
                        }}
                    >
                        <CheckOutlinedIcon /> {t("save")}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};