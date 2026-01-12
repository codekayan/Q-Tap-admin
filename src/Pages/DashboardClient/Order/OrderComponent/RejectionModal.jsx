import { Modal, Box, Typography, TextField, Button, Chip, useTheme } from '@mui/material';
import axios from 'axios';
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { BASE_URL } from "../../../../utils/constants"
import { toast } from 'react-toastify';

const RejectionModal = ({ open, onClose ,selectedOrder,removeOrder}) => {
    const [textFieldValue, setTextFieldValue] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmition = async () => {
        if(!textFieldValue) {
            toast.error(t('allFieldRequred'))
            return;
        }
        setIsLoading(true)
        
        const data = {
            "order_id": selectedOrder.id,
            "status": "rejected",
            "note": textFieldValue
        }

        try {
            setIsLoading(true)
            const res = await axios.post(`${BASE_URL}accept_order`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`
                    },

                }
            )
            if(res.data.success===false){toast.error(t("error"));return;}
            toast.done(t("success"))
            removeOrder(selectedOrder.id)
            onClose()
        } catch (error) {
            console.log('accept error', error)
            toast.done(t("notfoundTitle"))
        } finally {
            setIsLoading(false)
        }
    }
    const theme = useTheme();
    const handleChipClick = (value) => {
        setTextFieldValue(value);
    };
    const { t } = useTranslation()
    return (
        <Modal open={open} onClose={onClose}>
            <Box style={{ width: 350, margin: 'auto', marginTop: 100, padding: 20, backgroundColor: theme.palette.bodyColor.gray_lightBlack40, borderRadius: 8 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ color: theme.palette.text.black_white, fontSize: "12px" }}>{t("Rejection Reason")}</Typography>
                    <span className="icon-close-1" style={{ fontSize: "12px", cursor: "pointer", color: "gray" }} onClick={onClose}></span>
                </Box>
                <hr style={{ width: "100%" }} />

                <div>
                    <TextField
                        fullWidth
                        rows={2}
                        placeholder="Type here..."
                        variant="outlined"
                        multiline
                        value={textFieldValue}
                        onChange={(e) => setTextFieldValue(e.target.value)}
                        sx={{
                            color: theme.palette.text.gray_white,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "16px",
                                fontSize: "12px", color: theme.palette.text.gray_white,
                            }, "&::placeholder": {
                                color: theme.palette.text.gray_white,
                                opacity: 1
                            },
                            "& .MuiInputBase-input": {
                                fontSize: "12px", color: theme.palette.text.gray_white,
                            },
                        }}
                    />

                    <Box style={{ marginTop: 10 }}>
                        <Chip label="Item out of stock"
                            onClick={() => handleChipClick("Item out of stock")}
                            style={{ margin: 5, height: "25px", fontSize: "9px", color: "white", backgroundColor: "#9d9d9c" }} />
                        <Chip label="We have technical issue"
                            onClick={() => handleChipClick("We have technical issue")}
                            style={{ margin: 5, height: "25px", fontSize: "9px", color: "white", backgroundColor: "#9d9d9c" }} />
                        <Chip label="Crowded time"
                            onClick={() => handleChipClick("Crowded time")}
                            style={{ margin: 5, height: "25px", fontSize: "9px", color: "white", backgroundColor: "#9d9d9c" }} />
                        <Chip label="Out of working hours"
                            onClick={() => handleChipClick("Out of working hours")}
                            style={{ margin: 5, height: "25px", fontSize: "9px", color: "white", backgroundColor: "#9d9d9c" }} />
                    </Box>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        sx={{
                            marginTop: 1,
                            borderRadius: '20px',
                            textAlign: 'center',
                            backgroundColor: theme.palette.secondaryColor.main,
                            color: 'white',
                            fontSize: "11px",
                            textTransform: "capitalize",
                            '&:hover': {
                                backgroundColor: theme.palette.secondaryColor.main,
                            }
                        }}
                        onClick={handleSubmition}
                        disabled={isLoading}
                    >
                        {t("submit")}
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default RejectionModal;
