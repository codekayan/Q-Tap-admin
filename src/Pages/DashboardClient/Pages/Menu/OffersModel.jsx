import { Button, Divider, FormControl, IconButton, MenuItem, Modal, Select, TextField, Typography, useTheme } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from "../../../../utils/constants"
import { useSelector } from 'react-redux';
import { selectMenuData } from '../../../../store/client/menuSlice';

// New Add Offer Modal Component (unchanged)
const AddOfferModal = ({ open, handleClose, selectedBranch, contentForMenu, onAddSuccess }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [isLoading, selectIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        discount: "",
        before_discount: "",
        after_discount: "",
        meals_id: "",
        brunch_id: selectedBranch,
        img: null,
        name: "",
        description: ""
    });

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, img: e.target.files[0] });
    };

    const handleSubmit = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append("discount", formData.discount);
        formDataToSend.append("before_discount", formData.before_discount);
        formDataToSend.append("after_discount", formData.after_discount);
        formDataToSend.append("meals_id", formData.meals_id);
        formDataToSend.append("brunch_id", formData.brunch_id);
        if (formData.img) {
            formDataToSend.append("img", formData.img);
        }
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);

        try {
            selectIsLoading(true)
            const response = await axios.post(`${BASE_URL}meals_special_offers`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data) {
                toast.success(t("offer.addSucc"));
                onAddSuccess();
                handleClose();
            }
        } catch (error) {
            console.error('Error adding offer:', error);
            toast.error(t("offer.addErr"));
        }finally{
            selectIsLoading(false)
        }
    };

    return (
        <Modal open={open} onClose={handleClose} disableScrollLock>
            <Box
                sx={{
                    width: 500,
                    height: "auto",
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 24,
                    mx: 'auto',
                    mt: '20vh',
                    position: 'relative'
                }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body1" sx={{ fontSize: "13px", color: theme.palette.text.gray_white }}>
                        {t("addNewOffer")}
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <span class="icon-close-1" style={{ fontSize: "12px", color: theme.palette.text.gray_white }} />
                    </IconButton>
                </Box>

                <Divider
                    sx={{
                        backgroundColor: '#FF6600',
                        height: '1px',
                    }}
                />

                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        type='number'
                        label={t("discount.one")}
                        value={formData.discount}
                        onChange={(e) => handleInputChange('discount', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ "& .MuiInputBase-root": { height: "40px", fontSize: "12px" } }}
                    />
                    <TextField
                        label={t("price.before")}
                        value={formData.before_discount}
                        onChange={(e) => handleInputChange('before_discount', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ "& .MuiInputBase-root": { height: "40px", fontSize: "12px" } }}
                    />
                    <TextField
                        label={t("price.after")}
                        value={formData.after_discount}
                        onChange={(e) => handleInputChange('after_discount', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ "& .MuiInputBase-root": { height: "40px", fontSize: "12px" } }}
                    />
                    <FormControl size="small" sx={{ "& .MuiInputBase-root": { height: "40px", fontSize: "12px" } }}>
                        <Select
                            value={formData.meals_id}
                            onChange={(e) => handleInputChange('meals_id', e.target.value)}
                            displayEmpty
                        >
                            {contentForMenu.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label={t("name")}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ "& .MuiInputBase-root": { height: "40px", fontSize: "12px" } }}
                    />
                    <TextField
                        label={t("description")}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ "& .MuiInputBase-root": { height: "40px", fontSize: "12px" } }}
                    />
                    <Box>
                        <Typography variant="body2" sx={{ fontSize: "12px", color: "#575756" }}>
                            {t("image")}
                        </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ marginTop: '8px' }}
                        />
                    </Box>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.orangePrimary.main,
                            borderRadius: '25px',
                            color: 'white',
                            textTransform: 'none',
                            padding: '3px 12px',
                            fontSize: "12px",
                            mt: 2,
                            '&:hover': {
                                backgroundColor: '#f18101',
                            },
                        }}
                        disabled={isLoading}
                    >
                        {t("submit")}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export const OffersModel = ({ open, handleClose }) => {
    const selectedBranch = localStorage.getItem("selectedBranch")
    const theme = useTheme();
    const [contentForMenu, setContentForMenu] = useState([]);

    const { t } = useTranslation();
    const [openAddModal, setOpenAddModal] = useState(false);
    const [offers, setOffers] = useState([]);

    const handleOpenAddModal = () => setOpenAddModal(true);
    const handleCloseAddModal = () => setOpenAddModal(false);

    const getOffers = async () => {
        try {

            const response = await axios.get(`${BASE_URL}meals_special_offers`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                },
                params: {
                    brunch_id: selectedBranch
                }
            });

            if (response.data) {
                const formattedOffers = response.data.map(offer => ({
                    id: offer.id,
                    item: offer.meals_id,
                    discount: offer.discount,
                    priceBefore: offer.before_discount,
                    priceAfter: offer.after_discount,
                    name: offer.name || '', // Ensure name is included
                    description: offer.description || '', // Ensure description is included
                    isEditing: false
                }));
                setOffers(formattedOffers);
            }
        } catch (error) {
            console.error('Error fetching discounts:', error);
        }
    };

    const handleEditToggle = async (index) => {
        const updatedOffers = [...offers];
        const offer = updatedOffers[index];

        if (offer.isEditing) {
            // Validate required fields
            if (!offer.name || !offer.description) {
                toast.error(t("offer.nameAndDescriptionRequired"));
                return;
            }

            try {
                const response = await axios.put(

                    `${BASE_URL}meals_special_offers/${offer.id}`,
                    {
                        discount: offer.discount,
                        before_discount: offer.priceBefore,
                        after_discount: offer.priceAfter,
                        meals_id: offer.item,
                        brunch_id: selectedBranch,
                        name: offer.name,
                        description: offer.description
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                        }
                    }
                );

                if (response.data) {
                    toast.success(t("offer.updateSucc"));
                    getOffers();
                }
            } catch (error) {
                console.error('Error updating offer:', error);
                toast.error(t("offer.updateErr"));
            }
        }

        offer.isEditing = !offer.isEditing;
        setOffers(updatedOffers);
    };

    const handleInputChange = (index, field, value) => {
        const updatedOffers = [...offers];
        updatedOffers[index][field] = value;
        setOffers(updatedOffers);
    };

    const handleDelete = async (id) => {
        try {

            await axios.delete(`${BASE_URL}meals_special_offers/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                }
            });
            toast.success(t("offer.deleteSucc"));
            getOffers();
        } catch (error) {
            console.error('Error deleting offer:', error);
            toast.error(t("offer.deleteErr"));
        }
    };
    const data = useSelector(selectMenuData)
    useEffect(() => {
        let AllMeals = []
        if (data.data) {
            data.data.map(cat => {
                if (cat.meals)
                    cat.meals.map(meal => AllMeals.push(meal))
                return cat;
            })
        }
        setContentForMenu(AllMeals)
    }, [data]);
    useEffect(() => {
        getOffers();
    }, [selectedBranch]);

    return (
        <>
            <Modal open={open} onClose={handleClose} disableScrollLock>
                <Box
                    sx={{
                        width: 600, // Increased width to accommodate new fields
                        height: "auto",
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: 3,
                        boxShadow: 24,
                        mx: 'auto',
                        mt: '20vh',
                        position: 'relative'
                    }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body1" sx={{ fontSize: "13px", color: theme.palette.text.gray_white }}>
                            {t("specialOffers")}
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <span class="icon-close-1" style={{ fontSize: "12px", color: theme.palette.text.gray_white }} />
                        </IconButton>
                    </Box>

                    <Divider
                        sx={{
                            backgroundColor: '#FF6600',
                            height: '1px',
                        }}
                    />

                    <Table sx={{ mt: 3, mb: 5, width: '100%', tableLayout: 'fixed' }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontSize: '10px', padding: '3px 0px', borderBottom: 'none', textAlign: 'center', color: '#575756' }}>{t("item.one")}</TableCell>
                                <TableCell sx={{ fontSize: '10px', padding: '3px 0px', borderBottom: 'none', textAlign: 'center', color: '#575756' }}>{t("name")}</TableCell>
                                <TableCell sx={{ fontSize: '10px', padding: '3px 0px', borderBottom: 'none', textAlign: 'center', color: '#575756' }}>{t("description")}</TableCell>
                                <TableCell sx={{ fontSize: '10px', padding: '3px 0px', borderBottom: 'none', textAlign: 'center', color: '#575756' }}>{t("discount.one")}</TableCell>
                                <TableCell sx={{ fontSize: '10px', padding: '3px 0px', borderBottom: 'none', textAlign: 'center', color: '#575756' }}>{t("price.before")}</TableCell>
                                <TableCell sx={{ fontSize: '10px', padding: '3px 0px', borderBottom: 'none', textAlign: 'center', color: '#575756' }}>{t("price.after")}</TableCell>
                                <TableCell sx={{ fontSize: '10px', padding: '3px 0px', borderBottom: 'none', textAlign: 'center', color: '#575756' }}>{t("action")}</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {offers.map((offer, index) => (
                                <TableRow key={index} sx={{ height: '36px' }}>
                                    <TableCell sx={{ textAlign: 'center', fontSize: '12px', color: 'gray', padding: '3px 0px', borderBottom: 'none' }}>
                                        {offer.isEditing ? (
                                            <FormControl
                                                size="small"
                                                sx={{ width: "70px", height: "30px", "& .MuiInputBase-root": { height: "30px", fontSize: "10px" } }}>
                                                <Select
                                                    value={offer.item}
                                                    onChange={(e) => handleInputChange(index, 'item', e.target.value)}
                                                    displayEmpty
                                                >
                                                    {contentForMenu.map((item) => (
                                                        <MenuItem key={item.id} value={item.id}>
                                                            {item.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            <span style={{ fontSize: '10px', color: 'gray' }}>
                                                {contentForMenu.find(item => item.id === offer.item)?.name || offer.item}
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell sx={{ textAlign: 'center', fontSize: '12px', color: 'gray', padding: '3px 0px', borderBottom: 'none' }}>
                                        {offer.isEditing ? (
                                            <TextField
                                                value={offer.name}
                                                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                                variant="outlined"
                                                size="small"
                                                sx={{ width: "70px", height: "30px", "& .MuiInputBase-root": { height: "30px", fontSize: "10px" } }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '10px', color: 'gray' }}>{offer.name}</span>
                                        )}
                                    </TableCell>

                                    <TableCell sx={{ textAlign: 'center', fontSize: '12px', color: 'gray', padding: '3px 0px', borderBottom: 'none' }}>
                                        {offer.isEditing ? (
                                            <TextField
                                                value={offer.description}
                                                onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                                                variant="outlined"
                                                size="small"
                                                sx={{ width: "70px", height: "30px", "& .MuiInputBase-root": { height: "30px", fontSize: "10px" } }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '10px', color: 'gray' }}>{offer.description}</span>
                                        )}
                                    </TableCell>

                                    <TableCell sx={{ textAlign: 'center', fontSize: '12px', color: 'gray', padding: '3px 0px', borderBottom: 'none' }}>
                                        {offer.isEditing ? (
                                            <TextField
                                                type='number'
                                                value={offer.discount}
                                                onChange={(e) => handleInputChange(index, 'discount', e.target.value)}
                                                variant="outlined"
                                                size="small"
                                                sx={{ width: "70px", height: "30px", "& .MuiInputBase-root": { height: "30px", fontSize: "10px" } }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '10px', color: 'gray' }}>{offer.discount}%</span>
                                        )}
                                    </TableCell>

                                    <TableCell sx={{ textAlign: 'center', fontSize: '12px', color: 'gray', padding: '3px 0px', borderBottom: 'none' }}>
                                        {offer.isEditing ? (
                                            <TextField
                                                value={offer.priceBefore}
                                                onChange={(e) => handleInputChange(index, 'priceBefore', e.target.value)}
                                                variant="outlined"
                                                size="small"
                                                sx={{ width: "70px", height: "30px", "& .MuiInputBase-root": { height: "30px", fontSize: "10px" } }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '10px', color: 'gray' }}>{offer.priceBefore}</span>
                                        )}
                                    </TableCell>

                                    <TableCell sx={{ textAlign: 'center', fontSize: '12px', color: 'gray', padding: '3px 0px', borderBottom: 'none' }}>
                                        {offer.isEditing ? (
                                            <TextField
                                                value={offer.priceAfter}
                                                onChange={(e) => handleInputChange(index, 'priceAfter', e.target.value)}
                                                variant="outlined"
                                                size="small"
                                                sx={{ width: "70px", height: "30px", "& .MuiInputBase-root": { height: "30px", fontSize: "10px" } }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '10px', color: 'gray' }}>{offer.priceAfter}</span>
                                        )}
                                    </TableCell>

                                    <TableCell sx={{ fontSize: "10px", textAlign: "center", padding: '3px 0px', borderBottom: "none" }}>
                                        {offer.isEditing ? (
                                            <IconButton size="small" onClick={() => handleEditToggle(index)} color="primary">
                                                <img src="/assets/true.svg" alt="save icon" />
                                            </IconButton>
                                        ) : (
                                            <>
                                                <IconButton size="small" onClick={() => handleEditToggle(index)}>
                                                    <span class="icon-edit" sx={{ fontSize: "10px", color: "black" }}></span>
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleDelete(offer.id)} color="error">
                                                    <span class="icon-delete" sx={{ fontSize: "10px" }}></span>
                                                </IconButton>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Box sx={{ display: "flex", textAlign: "center", justifyContent: "center", alignItems: "center" }}>
                        <Button
                            onClick={handleOpenAddModal}
                            variant="contained"
                            sx={{
                                backgroundColor: theme.palette.orangePrimary.main,
                                borderRadius: '25px',
                                color: 'white',
                                width: "30%",
                                textTransform: 'none',
                                padding: '3px 12px',
                                fontSize: "12px",
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: "center",
                                '&:hover': {
                                    backgroundColor: '#f18101',
                                },
                            }}
                        >
                            <AddIcon sx={{ margin: "0 2px 2px 0", fontSize: "11px", color: "white", "& path": { stroke: "white", strokeWidth: 3 } }} /> {t("add")}
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <AddOfferModal
                open={openAddModal}
                handleClose={handleCloseAddModal}
                selectedBranch={selectedBranch}
                contentForMenu={contentForMenu}
                onAddSuccess={getOffers}
            />
        </>
    );
};