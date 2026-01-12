import React, { useState } from 'react';
import { IconButton, Modal, Typography, Divider, Grid, TextField, Button } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL,BASE_URL_IMG } from "../../../../utils/constants";

export const AddQuestion = ({ open, handleCloseModel, getQuestionData }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const theme = useTheme();
    const { t } = useTranslation();

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleAnswerChange = (e) => {
        setAnswer(e.target.value);
    };

    const handleSave = async () => {
        if (!question || !answer) {
            toast.error(t("plFillAllField"));
            return;
        }

        const data = {
            question: question,
            answer: answer,
        };

        try {
            const response = await axios.post(
                `${BASE_URL}faq_qtap`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                    },
                }
            );

            if (response.data) {
                // Pass only the question string (or adjust based on what addQuestion expects)
                toast.success(t("question add success"));
                setQuestion("");
                setAnswer("");
                getQuestionData()
                handleCloseModel()

            }
        } catch (error) {
            console.error('Error adding question:', error);
            toast.error(error.response?.data?.message || t("question added error"));
        }
    };
    return (
        <Modal disableScrollLock open={open} onClose={handleCloseModel}>
            <Box
                sx={{
                    width: 400,
                    height: "auto",
                    bgcolor: 'background.paper',
                    p: 3,
                    borderRadius: 3,
                    boxShadow: 24,
                    mx: 'auto',
                    mt: '20vh',
                    position: 'relative',
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body1" sx={{ fontSize: "13px", color: theme.palette.text.gray }}>
                        {t("addQuestion")}
                    </Typography>
                    <IconButton onClick={handleCloseModel}>
                        <span className="icon-close-1" style={{ fontSize: "12px", color: "#AAAAAA" }} />
                    </IconButton>
                </Box>
                <Divider
                    sx={{
                        backgroundColor: '#FF6600',
                        height: '1px',
                    }}
                />
                <Grid item xs={10} sx={{ margin: "20px 0px" }}>
                    <Typography variant="body2" sx={{ fontSize: "10px", color: theme.palette.text.gray, marginBottom: "3px" }}>
                        {t("question")}
                    </Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder={t("typeHere")}
                        value={question}
                        onChange={handleQuestionChange}
                        InputProps={{ sx: { height: '30px', fontSize: "10px" } }}
                    />
                </Grid>

                <Grid item xs={10} sx={{ margin: "20px 0px" }}>
                    <Typography variant="body2" sx={{ fontSize: "10px", color: theme.palette.text.gray, marginBottom: "3px" }}>
                        {t("answer")}
                    </Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder={t("typeHere")}
                        value={answer}
                        onChange={handleAnswerChange}
                        InputProps={{ sx: { height: '30px', fontSize: "10px" } }}
                    />
                </Grid>

                <Box
                    sx={{
                        marginTop: "50px",
                        display: "flex",
                        textAlign: "center",
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
                            '&:hover': {
                                backgroundColor: '#f18101',
                            },
                        }}
                    >
                        <CheckOutlinedIcon /> {t("save")}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};