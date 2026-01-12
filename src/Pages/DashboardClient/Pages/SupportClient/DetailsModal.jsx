import React from 'react';
import { Modal, Box, Typography, Divider, IconButton, useTheme } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { useTranslation } from 'react-i18next';

const DetailsModal = ({ open, onClose, rowData }) => {
    const {t} = useTranslation()
    const theme = useTheme();
    if (!rowData) return null;
    
    
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: 400,
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
                    <Typography variant="body1" sx={{ fontSize: "13px", color: "#575756" }}>
                        {t("feedbackDetails")}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <span className="icon-close-1" style={{ fontSize: "12px", color: "#AAAAAA" }} />
                    </IconButton>
                </Box>
                <Divider
                    sx={{
                        backgroundColor: '#FF6600',
                        height: '1px',
                    }}
                />

                <Typography variant="body1" sx={{
                    color: "#575756", fontSize: "12px", marginTop: "10px",
                    marginBottom: "15px"
                }}>
                    {t("orderId")} :<span style={{ color: theme.palette.orangePrimary.main, marginLeft: "20px", }}> #{rowData.id}</span>
                </Typography>

                <Typography variant="body1" sx={{ color: "#575756", fontSize: "12px", marginBottom: "15px" }}>
                    {t("name")} :<span style={{ color: "#949493", marginLeft: "20px", }}>{rowData.brunch.business_name}</span>
                </Typography>

                <Typography variant="body1" sx={{ color: "#575756", fontSize: "12px", marginBottom: "15px" }}>
                    {t("mobileNumber")} :<span style={{ color: "#949493", marginLeft: "20px", }}>{rowData.brunch.business_name}</span>
                </Typography>


                <Box sx={{ marginBottom: "15px" }}>
                    <Typography variant="body1" sx={{ color: "#575756", fontSize: "12px", }}>
                        {t("rate")}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <IconButton key={index} disableRipple sx={{ padding:"0px"}}>
                                {index < rowData.star ? (
                                    <StarIcon sx={{ fontSize: "22px", color: theme.palette.orangePrimary.main }} />
                                ) : (
                                    <StarOutlineIcon sx={{ fontSize: "22px", color: theme.palette.orangePrimary.main }} />
                                )}
                            </IconButton>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ marginBottom: "15px" }}>
                    <Typography variant="body1" sx={{ color: "#575756", fontSize: "12px", }}>
                        {t("productSatisfiedQ")}
                    </Typography>
                    <Box sx={{ display: 'flex', }}>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <IconButton key={index} disableRipple  sx={{ padding:"3px"}}>
                                {index < rowData.star ? (
                                    <Box sx={{
                                        width: "22px", height: "22px", borderRadius: "50%", justifyContent: "center",
                                        alignItems: "center", backgroundColor: "#575756",
                                        color: "white", fontSize: "11px", position: "relative",display: "flex",
                                    }} >{index + 1}</Box>
                                ) : (
                                    <Box sx={{
                                        width: "22px", height: "22px", borderRadius: "50%", display: "flex", justifyContent: "center",
                                        alignItems: "center", backgroundColor: "white", border: "1px solid #575756",
                                        color: "#575756", fontSize: "11px",
                                        position: "relative",

                                    }}>{index + 1}</Box>
                                )}
                            </IconButton>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Modal >
    );
};

export default DetailsModal;
