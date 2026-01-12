// components/FeedbackDetailsModal.js
import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Modal, Typography, Divider, useTheme } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import {BASE_URL,BASE_URL_IMG} from  "../../utils/constants";

const FeedbackDetailsModal = ({ open, handleClose, pageId }) => {
    const theme = useTheme();

    const [feedbackData, setFeedbackData] = useState([]);

    const handlePrint = () => {
        window.print();
    }
    // get data from backend to display in the table
    const getFeedbackData = async () => {
        try {

            const response = await axios.get(`${BASE_URL}feedback_client`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (response.data) {
                setFeedbackData(response.data);
            }
        } catch (error) {
            console.error('Error fetching feedback data:', error);
        }
    };
    useEffect(() => {
        getFeedbackData();
        

    }, []);



    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 350,
                bgcolor: 'background.paper',
                boxShadow: 5,
                p: 2,
                borderRadius: 2
            }}>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ color: theme.palette.text.gray, fontSize: "13px" }}>
                        Details
                    </Typography>
                    <Box>
                        <IconButton onClick={handlePrint}>
                            <span className="icon-printer" style={{ fontSize: "18px" }}></span>
                        </IconButton>
                        <IconButton onClick={handleClose} >
                            <span class="icon-close-1" style={{ fontSize: "15px" }}></span>
                        </IconButton>
                    </Box>
                </Box>
                <Divider sx={{ backgroundColor: theme.palette.orangePrimary.main, marginBottom: "10px" }} />

                <Typography variant="body1" sx={{ color: theme.palette.text.gray, fontSize: "12px" }}>
                    How much you satisfied with the product?
                </Typography>

                <Box sx={{ display: 'flex', marginTop: "0px", p: 0 }}>
                    {[1, 2, 3, 4, 5].map((index) => (
                        <IconButton key={index}>
                            {index <= feedbackData[pageId]?.star ? <StarIcon sx={{ color: theme.palette.orangePrimary.main, fontSize: "20px" }} />
                                : <StarBorderIcon sx={{ color: '#AAAAAA', fontSize: "20px" }} />}
                        </IconButton>
                    ))}
                </Box>

                <Typography variant="body1" sx={{ mt: 1, color: theme.palette.text.gray, fontSize: "12px" }}>
                    How happy are you with the product?
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, marginTop: "6px" }}>
                    {/* Sad Icon */}
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center" }}>
                        <SentimentVeryDissatisfiedIcon
                            sx={{
                                fontSize: 35,
                                color: feedbackData[pageId]?.emoji === 'said' ? 'red' : '#AAAAAA'
                            }}
                        />
                        <Typography style={{ fontSize: 9, color: '#AAAAAA' }}>Sad</Typography>
                    </Box>

                    {/* Neutral Icon */}
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center" }}>
                        <SentimentNeutralIcon
                            sx={{
                                fontSize: 35,
                                color: feedbackData[pageId]?.emoji === 'happy' ? '#FFC107' : '#AAAAAA'
                            }}
                        />
                        <Typography style={{ fontSize: 9, color: '#AAAAAA' }}>happy</Typography>
                    </Box>

                    {/* Very Happy Icon */}
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center" }}>
                        <SentimentSatisfiedAltIcon
                            sx={{
                                fontSize: 35,
                                color: feedbackData[pageId]?.emoji === 'very happy' ? '#73CB3C' : '#AAAAAA'
                            }}
                        />
                        <Typography style={{ fontSize: 9, color: '#AAAAAA' }}>Very Happy</Typography>
                    </Box>
                </Box>

                <Typography variant="body1" sx={{ mt: 1, color: theme.palette.text.gray, fontSize: "12px" }}>
                    Does the product help you achieve your goals?
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, marginTop: "6px" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center" }}>
                        <CheckCircleIcon sx={{ fontSize: 35, color: feedbackData[pageId]?.your_goals === 'yes' ? 'green' : '#AAAAAA' }} />
                        <Typography style={{ fontSize: 9, color: '#AAAAAA' }}>yes</Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center" }}>
                        <CancelIcon sx={{ fontSize: 35, color: feedbackData[pageId]?.your_goals === 'no' ? 'red' : '#AAAAAA' }} />
                        <Typography style={{ fontSize: 9, color: '#AAAAAA' }}>no</Typography>
                    </Box>
                </Box>
                <Box>
                    <Typography variant="body1" sx={{ mt: 1, color: theme.palette.text.gray, fontSize: "12px" }}>
                        What are the things missing in Q-tap Menus?
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: 'gray', fontSize: "10px" }}>
                        {/* { feedbackData.find((feed) => feed.id == pageId).missing_Q-tap_Menus} */}
                        {feedbackData[pageId]?.comment}

                    </Typography>
                </Box>
                <Box>

                    <Typography variant="body1" sx={{ mt: 1, color: theme.palette.text.gray, fontSize: "12px" }}>
                        Comment
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: 'gray', fontSize: "10px" }}>
                        {feedbackData[pageId]?.comment}
                    </Typography>
                </Box>
                <Box sx={{ justifyContent: "center", textAlign: "center", }}>
                    <Button
                        variant="contained"
                        sx={{
                            margin: "30px 0px", backgroundColor: theme.palette.orangePrimary.main, width: "30%", height: "28px", fontSize: "12px",
                            color: "white", borderRadius: 20,
                            '&:hover': {
                                backgroundColor: theme.palette.orangePrimary.main,
                            }
                        }}
                        onClick={handleClose}
                    >
                        OK
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default FeedbackDetailsModal;
