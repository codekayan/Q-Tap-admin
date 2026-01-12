import React, { useContext, useEffect, useState } from 'react';
import { Button, Grid, Card, CardContent, IconButton, Paper, Typography, TextField, Dialog, DialogContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AddButton } from './Header';
import { Box, useTheme } from '@mui/system';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { BASE_URL, BASE_URL_IMG } from "../../../../utils/constants"
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, fetchMenuData, selectMenuData, updataCategory } from '../../../../store/client/menuSlice';


export const Content = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const selectedBranch = localStorage.getItem("selectedBranch")


    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [editName, setEditName] = useState('');
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const data = useSelector(selectMenuData)
    const menuData = data?.data;

    useEffect(() => {
        dispatch(fetchMenuData(selectedBranch))
    }, [dispatch, selectedBranch])



    // Slider settings
    const sliderSettings = {
        infinite: true,
        speed: 500,
        arrows: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const handleEditOpen = (category) => {
        setEditCategory(category);
        setEditName(category.name);
        setOpenEditDialog(true);
    };

    const handleEditClose = () => {
        setOpenEditDialog(false);
        setEditName('');
    };


    const handleEditSave = async () => {


        try {
            // Wait for the dispatch to complete
            await dispatch(updataCategory(
                { id: editCategory.id, newName: editName, branch: selectedBranch }
            )).unwrap();
            handleEditClose()
            // Only show success if promise resolves
            toast.success(t("CategoryUpdatedSuccessfully"));
        } catch (error) {
            // Handle different error types
            const errorMessage = error.payload?.message ||
                error.message ||
                t("deleteFailedGeneric");
            toast.error(errorMessage);
        }
    };

    const handleDelete = async (categoryId) => {
        try {
            // Wait for the dispatch to complete
            await dispatch(deleteCategory(categoryId)).unwrap();

            // Only show success if promise resolves
            toast.success(t("categoryDeletedSucc"));
        } catch (error) {
            // Handle different error types
            const errorMessage = error.payload?.message ||
                error.message ||
                t("deleteFailedGeneric");
            toast.error(errorMessage);
        }
    };

    return (
        <>
            {menuData && menuData.map((category, index) => (
                <Paper key={index} style={{ padding: '10px 0px', borderRadius: "20px", marginTop: "40px", whiteSpace: "nowrap" }}>
                    <Grid container width={"100%"}>
                        <Grid container xs={12} sx={{
                            backgroundColor: '#20253c',
                            width: "100%",
                            borderRadius: "20px 20px 0px 0px",
                            height: "35px",
                            justifyContent: "space-between",
                            position: "relative",
                            top: "-20px",
                            padding: "0px 20px",
                            flexWrap: 'nowrap'
                        }}>
                            <Box>
                                <AddButton variant="contained" sx={{ marginTop: "-20px", fontSize: "11px", padding: '5px 35px', }} >
                                    {category.name}
                                </AddButton>
                            </Box>
                            <Box>
                                <IconButton sx={{ padding: "5px", margin: "0px" }} >
                                    <AddIcon sx={{ color: "white", fontSize: "18px" }} />
                                </IconButton>

                                <IconButton onClick={() => handleEditOpen(category)} sx={{ padding: "5px", margin: "0px" }} >
                                    <span className="icon-edit" style={{ color: "white", fontSize: "16px" }}></span>
                                </IconButton>

                                <IconButton onClick={() => handleDelete(category.id)} sx={{ padding: "5px", margin: "0px" }} >
                                    <span className="icon-delete" style={{ color: "white", fontSize: "16px" }} />
                                </IconButton>

                                <IconButton sx={{ padding: "5px", margin: "0px" }}  >
                                    <span className="icon-move" style={{ color: "#AAAAAA", fontSize: "15px", marginLeft: "25px" }} />
                                </IconButton>
                            </Box>
                        </Grid>

                        <Grid item xs={12} padding="10px" sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center" }}>
                            {/* Slider for item cards */}
                            {/* <Box sx={{ width: '88%' }}>
                                <Slider {...sliderSettings}> */}
                            {/* 
                            ****  SHOW MEALS INSIDE THE CATEGORY
                            */}
                            {category?.meals && category?.meals.map((item, index) => (
                                <Card key={index} sx={{
                                    width: "150px !important", height: "150px", boxShadow: "none",
                                    borderRadius: "20px", border: "1px solidrgb(45, 163, 163)", marginLeft: "10px",
                                }}>
                                    <Box sx={{
                                        width: "100%", backgroundColor: "#F1F2F2", borderRadius: "30px", height: "45%",
                                        display: "flex", justifyContent: "center", textAlign: "center", alignItems: "center"
                                    }}>
                                        <img src={`${BASE_URL_IMG}${item.img}`} alt="item" style={{ width: "100%", height: "100%" }} />
                                    </Box>
                                    <CardContent
                                        sx={{ padding: "5px" }}
                                        onClick={() => { navigate(`/add-item?categoryId=${category.id}&itemId=${item.id}`); }}
                                    >
                                        <Typography variant='body1' sx={{ fontSize: "10px", color: theme.palette.orangePrimary.main }}>{item.name}</Typography>
                                        <Typography variant='body2' sx={{ fontSize: "9px", color: "gray" }}>{item.Description}</Typography>
                                        <Button
                                            sx={{ backgroundColor: "#46B479", color: "white", padding: "1px 0px", fontSize: "8px", borderRadius: "20px" }} >
                                            {item.price}
                                        </Button>
                                        <Typography variant='body2' sx={{ fontSize: "7px", marginTop: "5px", color: theme.palette.secondaryColor.main, textAlign: "center", alignItems: "center" }}>
                                            {item.icon} {item.status}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                            {/* </Slider>
                            </Box> */}

                            {/* Fixed add-icon card */}
                            <Card
                                sx={{
                                    backgroundColor: "#F1F2F2",
                                    border: "1px solid #CACCCC",
                                    marginLeft: "20px",
                                    borderRadius: "20px",
                                    width: "10%", height: "150px", boxShadow: "none",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    minWidth: '100px'
                                }}
                            >
                                <CardContent
                                    onClick={() => { navigate(`/add-item?categoryId=${category.id}`); }}
                                >
                                    <IconButton>
                                        <AddCircleOutlineOutlinedIcon sx={{ color: theme.palette.orangePrimary.main, fontSize: "26px" }} />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            ))}

            <Dialog open={openEditDialog} onClose={handleEditClose}>
                <DialogContent>
                    <Typography variant="h6">{t("category.edit")}</Typography>
                    <TextField
                        label={t("name")}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        onClick={handleEditSave}
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.orangePrimary.main,
                            ':hover': {
                                backgroundColor: '#e17d33'
                            }
                        }}
                    >{t("save")}</Button>
                </DialogContent>
            </Dialog>
        </>
    );
};