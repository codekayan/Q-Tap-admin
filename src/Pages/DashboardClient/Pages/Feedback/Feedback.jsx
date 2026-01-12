

import { Button, Divider, Grid, Paper, RadioGroup, TextField, Typography, IconButton } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import React, { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from "../../../../utils/constants"

export const Feedback = () => {
    const theme = useTheme();
    const [star, setStar] = useState(0);
    const [emoji, setEmoji] = useState("");
    const [yourGoals, setYourGoals] = useState("");
    const [missingQtapMenus, setMissingQtapMenus] = useState("");
    const [comment, setComment] = useState("");
    const { t } = useTranslation();
    const handleStarClick = (index) => {
        setStar(index + 1);
    };

    const handleEmojiClick = (selectedEmoji) => {
        setEmoji(emoji === selectedEmoji ? "" : selectedEmoji);
    };

    const handleYourGoals = (goal) => {
        setYourGoals(goal);
    };

    const handleMissingQtapMenus = (event) => {
        setMissingQtapMenus(event.target.value);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSaveFeedback = async () => {
        try {
            if (star === 0 || !emoji || !yourGoals || !missingQtapMenus || !comment) {
                toast.error(t("plFillAllField"));
                return;
            }
            const dataFormat = {
                client_id: "1",
                star: star.toString(),
                emoji: emoji,
                your_goals: yourGoals,
                "missing_Q-tap_Menus": missingQtapMenus,
                comment: comment
            };



            await axios.post(`${BASE_URL}feedback_client`, dataFormat, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`
                }
            });

            toast.success(t("feedbacks.sendSucc"));

            // Clear all inputs on success
            setStar(0);
            setEmoji("");
            setYourGoals("");
            setMissingQtapMenus("");
            setComment("");
        } catch (error) {
            toast.error(t("feedbacks.sendErr"));
            console.log("data error feedback ", error);

        }
    };

    return (
        <Paper sx={{ padding: "15px 30px 50px 30px", borderRadius: "20px" }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                padding="10px 0"
            >
                <Box sx={{ display: "flex" , alignItems: "center" }}>
                    <StarIcon sx={{ fontSize: "25px", color: "rgb(214, 213, 213)", marginRight: "5px" }} />
                    <Typography variant='body1' sx={{ fontSize: "15px", color: theme.palette.text.gray }}>
                        {t("tellUsAboutYourExperiment")}
                    </Typography>
                </Box>
            </Box>
            <Divider
                sx={{
                    backgroundImage: `linear-gradient(to right , #FDB913, ${theme.palette.orangePrimary.main} )`,
                    height: '2px',
                    width: "100%", border: "none",
                }}
            />

            <Grid container spacing={4} padding={"25px 40px"}>
                {/* Left Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="body1" gutterBottom sx={{ fontSize: "12px" }}>
                        {t("howMuchYouSatisfied")}
                    </Typography>

                    <Box sx={{ margin: "20px 0px", display: 'flex' }}>
                        {[...Array(5)].map((_, index) => (
                            <IconButton key={index} onClick={() => handleStarClick(index)} sx={{ padding: 0 }}>
                                {index < star ? (
                                    <StarIcon sx={{ color: theme.palette.orangePrimary.main, marginLeft: index !== 0 ? "8px" : 0 }} />
                                ) : (
                                    <StarBorderIcon sx={{ color: theme.palette.orangePrimary.main, marginLeft: index !== 0 ? "8px" : 0 }} />
                                )}
                            </IconButton>
                        ))}
                    </Box>

                    <Typography variant="body1" gutterBottom sx={{ fontSize: "12px" }}>
                        {t("howHappyAreYou")}
                    </Typography>

                    <Box>
                        <RadioGroup row sx={{ margin: "20px 0px" }}>
                            <Box onClick={() => handleEmojiClick("said")}>
                                <SentimentVeryDissatisfiedIcon sx={{ fontSize: "35px", color: emoji === "said" ? "red" : "gray" }} />
                                <Typography variant="body2" gutterBottom sx={{ fontSize: "10px", color: "gray" }}>{t("sad")}</Typography>
                            </Box>
                            <Box sx={{ marginLeft: "15px" }} onClick={() => handleEmojiClick("happy")}>
                                <SentimentSatisfiedAltIcon sx={{ fontSize: "35px", color: emoji === "happy" ? theme.palette.orangePrimary.main : "gray" }} />
                                <Typography variant="body2" gutterBottom sx={{ fontSize: "10px", color: "gray" }}>{t("happy")}</Typography>
                            </Box>
                            <Box sx={{ marginLeft: "15px" }} onClick={() => handleEmojiClick("very happy")}>
                                <SentimentVerySatisfiedIcon sx={{ fontSize: "35px", color: emoji === "very happy" ? "green" : "gray" }} />
                                <Typography variant="body2" gutterBottom sx={{ fontSize: "10px", color: "gray" }}>{t("veryHappy")}</Typography>
                            </Box>
                        </RadioGroup>
                    </Box>

                    <Typography variant="body1" gutterBottom sx={{ fontSize: "12px" }}>
                        {t("doesProductHelpYou")}
                    </Typography>
                    <Box sx={{ margin: "20px 0px" }}>
                        <RadioGroup row>
                            <Box onClick={() => handleYourGoals("yes")}>
                                <CheckIcon sx={{ padding: "5px", fontSize: "30px", backgroundColor: yourGoals === "yes" ? "green" : "gray", borderRadius: "50%", color: "white" }} />
                                <Typography variant="body2" gutterBottom sx={{ fontSize: "10px", color: "gray" }}>{t("yes")}</Typography>
                            </Box>
                            <Box sx={{ marginLeft: "15px" }} onClick={() => handleYourGoals("no")}>
                                <ClearIcon sx={{ padding: "5px", fontSize: "30px", border: "1px solid ", borderRadius: "50%", color: yourGoals === "no" ? "red" : "gray" }} />
                                <Typography variant="body2" gutterBottom sx={{ fontSize: "10px", color: "gray" }}>{t("no")}</Typography>
                            </Box>
                        </RadioGroup>
                    </Box>

                    <Typography variant="body1" gutterBottom sx={{ fontSize: "12px" }}>
                        {t("whatAreThingMissing")}
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        sx={{ width: '70%' }}
                        inputProps={{
                            style: { fontSize: '10px' }
                        }}
                        rows={2}
                        placeholder={t("plGiveYourOpinion")}
                        value={missingQtapMenus}
                        onChange={handleMissingQtapMenus}
                    />
                </Grid>

                {/* Right Section */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'center' }}>
                        <img
                            src="/images/feedback.jpg"
                            alt="Experiment illustration"
                            width={"425px"}
                            style={{ maxWidth: '100%', margin: "10px 0px" }}
                        />
                    </Box>

                    <Typography variant="body1" gutterBottom sx={{ fontSize: "12px" }}>
                        {t("comment")}
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        sx={{ width: '100%' }}
                        inputProps={{
                            style: { fontSize: '12px' }
                        }}
                        rows={4}
                        placeholder={t("plWriteBriefAboutExper")}
                        value={comment}
                        onChange={handleCommentChange}
                    />
                </Grid>
            </Grid>
            <Box sx={{ textAlign: 'center', marginTop: '30px', justifyContent: "center" }}>
                <Button
                    onClick={handleSaveFeedback}
                    sx={{
                        textTransform: "capitalize", color: "white", padding: "3px 30px",
                        backgroundImage: `linear-gradient(to right, #FDB913, ${theme.palette.orangePrimary.main})`,
                        fontSize: "12px", borderRadius: "20px",
                        '&:hover': {
                            backgroundImage: `linear-gradient(to right , #FDB913, ${theme.palette.orangePrimary.main} )`
                        }
                    }}>
                    <CheckIcon sx={{ marginRight: "6px", fontSize: "15px", strokeWidth: 1, stroke: "white" }} /> {t("submit")}
                </Button>
            </Box>
        </Paper>
    );
};