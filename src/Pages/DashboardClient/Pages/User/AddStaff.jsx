import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton, Divider, MenuItem, FormControl, Select, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL,BASE_URL_IMG } from "../../../../utils/constants";
import { useTheme } from '@mui/system';

export const AddStaff = ({ open, onClose, onSave, userStaff }) => {
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState(''); // Changed from name to userId for clarity
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const [rolesData, setRolesData] = useState([]);
    const selectedBranch = localStorage.getItem("selectedBranch");
    const theme = useTheme();

    const getRoles = async () => {
        try {
            const response = await axios.get(`${BASE_URL}roles`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("Token")}`
                },
                params: {
                    brunch_id: selectedBranch
                }
            });

            if (response.data?.roles) {
                setRolesData(response.data.roles);
            } else {
                console.warn("No roles found in response:", response.data);
                setRolesData([]);
            }
        } catch (e) {
            console.error("Error fetching roles:", e);
            toast.error(t("errorFetchingRoles"));
        }
    };

    useEffect(() => {
        if (open) {
            getRoles();
        }
    }, [selectedBranch, open]); // Removed rolesData, added open for conditional fetch

    const handleSave = async () => {
        setIsLoading(true);

        try {
            if (!userId || !role) {
                toast.error(t("pleaseSelectUserAndRole"));
                setIsLoading(false);
                return;
            }


            const response = await axios.put(`${BASE_URL}link_user_role/${userId}`, {
                role_id: role,
                brunch_id: selectedBranch
            }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("Token")}`
                }
            });

            if (response.status === 200) {
                onSave?.(); // Call onSave if provided
                onClose(); // Close the modal
                toast.success(t("userStaffAdded"));
            } else {
                throw new Error("Unexpected response status");
            }
        } catch (e) {
            console.error("Error linking user role:", e);
            const errorMessage = e.response?.data?.message || t("errorLinkingUserRole");
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="add-staff-modal">
            <Box
                sx={{
                    width: 400,
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 24,
                    mx: 'auto',
                    mt: '20vh',
                    position: 'relative'
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography id="add-staff-modal" variant="body1" sx={{ fontSize: "13px", color: theme.palette.text.gray }}>
                        {t("userStaff.add")}
                    </Typography>
                    <IconButton onClick={onClose} disabled={isLoading} aria-label="close">
                        <CloseIcon sx={{ fontSize: "20px", color: theme.palette.text.gray }} />
                    </IconButton>
                </Box>
                <Divider
                    sx={{
                        backgroundColor: '#FF6600',
                        height: '1px',
                    }}
                />

                <Box sx={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    alignItems: "flex-start",
                }}>
                    <Typography variant='body2' sx={{ width: "25%", textAlign: "center" }} color={theme.palette.text.gray_light} fontSize={"12px"}>
                        {t("userName")}
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}>
                        <FormControl sx={{ width: "90%" }}>
                            <Select
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                displayEmpty
                                disabled={isLoading}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        height: "35px",
                                        padding: "1px 14px",
                                        textAlign: "left",
                                        fontSize: "12px",
                                        color: "gray",
                                        lineHeight: "35px"
                                    }
                                }}
                                aria-label={t("selectUser")}
                            >
                                <MenuItem value="" disabled sx={{ fontSize: "12px", color: "gray" }}>
                                    {t("selectUser")}
                                </MenuItem>
                                {userStaff?.map((user) => (
                                    <MenuItem key={user.id} value={user.id} sx={{ fontSize: "12px", color: theme.palette.text.gray_light }}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Box sx={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    alignItems: "flex-start",
                }}>
                    <Typography variant='body2' sx={{ width: "25%", textAlign: "center" }} color={theme.palette.text.gray_light} fontSize={"12px"}>
                        {t("role")}
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}>
                        <FormControl sx={{ width: "90%" }}>
                            <Select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                displayEmpty
                                disabled={isLoading}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        height: "35px",
                                        padding: "1px 14px",
                                        textAlign: "left",
                                        fontSize: "12px",
                                        color: "gray",
                                        lineHeight: "35px"
                                    }
                                }}
                                aria-label={t("selectRole")}
                            >
                                <MenuItem value="" disabled sx={{ fontSize: "12px", color: "gray" }}>
                                    {t("selectRole")}
                                </MenuItem>
                                {rolesData?.map((role) => (
                                    <MenuItem key={role.id} value={role.id} sx={{ fontSize: "12px", color: theme.palette.text.gray_light }}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="warning"
                        sx={{
                            mt: 4,
                            borderRadius: '20px',
                            height: "30px",
                            width: "50%",
                            textTransform: "capitalize",
                        }}
                        disabled={isLoading}
                        aria-label={t("save")}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <>
                                <CheckOutlinedIcon />
                                {t("save")}
                            </>
                        )}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};