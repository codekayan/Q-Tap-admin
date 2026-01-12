import CheckIcon from '@mui/icons-material/Check';
import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Divider, Grid, TextField, Button, useTheme } from '@mui/material';
import StraightOutlinedIcon from '@mui/icons-material/StraightOutlined';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectDiscounts } from '../../../../store/client/DiscountMenuSlice';
import { BASE_URL_IMG } from "../../../../utils/constants"

export const ItemDetails = ({ categoryId, itemId, updateItemData, initialData }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const discountContent = useSelector(selectDiscounts)

    const [name, setName] = useState(initialData.name || '');
    const [brief, setBrief] = useState(initialData.brief || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [ingredients, setIngredients] = useState(initialData.ingredients || '');
    const [calories, setCalories] = useState(initialData.calories || '');
    const [time, setTime] = useState(initialData.time || '');
    const [tax, setTax] = useState(initialData.tax || '');
    const [priceSmall, setPriceSmall] = useState(initialData.priceSmall || '');
    const [priceMedium, setPriceMedium] = useState(initialData.priceMedium || '');
    const [priceLarge, setPriceLarge] = useState(initialData.priceLarge || '');
    const [price, setPrice] = useState(initialData.price || '');
    const [discount, setDiscount] = useState(initialData.discount || ''); // سيحتوي على id الخصم
    const [discountCode, setDiscountCode] = useState(''); // لتخزين الرمز النصي مؤقتًا
    const [image, setImage] = useState(initialData.image || null);

    // تحديث الحالة عند تغيير initialData (عند التعديل)
    // useEffect(() => {
    //     setName(initialData.name || '');
    //     setBrief(initialData.brief || '');
    //     setDescription(initialData.description || '');
    //     setIngredients(initialData.ingredients || '');
    //     setCalories(initialData.calories || '');
    //     setTime(initialData.time || '');
    //     setTax(initialData.tax || '');
    //     setPriceSmall(initialData.priceSmall || '');
    //     setPriceMedium(initialData.priceMedium || '');
    //     setPriceLarge(initialData.priceLarge || '');
    //     setPrice(initialData.price || '');
    //     setDiscount(initialData.discount || '');
    //     setImage(initialData.image || null);

    //     // إذا كان هناك discount (id)، ابحث عن الرمز المقابل له في discountContent
    //     if (initialData.discount && discountContent) {
    //         const foundDiscount = discountContent.find(
    //             (item) => item.id === parseInt(initialData.discount)
    //         );
    //         if (foundDiscount) {
    //             setDiscountCode(foundDiscount.code || '');
    //         }
    //     }
    //     console.log("useEffect ItemDetails discountContent") // debug log
    // }, [discountContent]);

    // تحديث المكون الأب عند تغيير أي حقل
    useEffect(() => {
        updateItemData({
            name,
            brief,
            description,
            ingredients,
            calories,
            time,
            tax,
            priceSmall,
            priceMedium,
            priceLarge,
            price,
            discount, // إرسال id الخصم
            image,
        });
        console.log("useEffect ItemDetails lot") // debug log
        //     }, [name, brief, description, ingredients, calories, time, tax, priceSmall, priceMedium, priceLarge, price, discount, image, updateItemData]);

    }, [name, brief, description, ingredients, calories, time, tax, priceSmall, priceMedium, priceLarge, price, discount, image]); // dont put  updateItemData here wrong !!!!

    // التعامل مع إدخال رمز الخصم
    const handleDiscountChange = (e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 100) {
            setDiscount(value);
        }else {
            toast.error("dicount must be between 0 to 100")
            console.log("error  cant add discount") // debug log
        }
        // setDiscountCode(code);

        // // البحث عن الرمز في discountContent
        // if (code && discountContent) {
        //     const foundDiscount = discountContent.find(
        //         (item) => item.code.toLowerCase() === code.toLowerCase()
        //     );
        //     if (foundDiscount) {
        //         setDiscount(foundDiscount.id); // حفظ id الخصم
        //         // toast.success(t("discount valid")); // رسالة نجاح
        //     } else {
        //         setDiscount(''); // إعادة تعيين id الخصم إذا لم يكن الرمز صحيحًا
        //         // toast.error(t("discount invalid")); // رسالة خطأ
        //     }
        // } else {
        //     setDiscount(''); // إعادة تعيين id الخصم إذا كان الحقل فارغًا
        // }
    };

    const handleImageUpload = (e) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            if (!e.target || !e.target.files || e.target.files.length === 0) {
                toast.error(t("noFileSelected"));
                return;
            }
            const file = e.target.files[0];
            if (file) {
                setImage(file);
            }
        };
        fileInput.click();
    };

    return (
        <Paper sx={{ marginTop: "-20px", marginBottom: "30px", borderRadius: "10px", padding: "20px 50px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" fontSize={"15px"} color={theme.palette.text.gray_white}>{t("item.details")}</Typography>
            </Box>
            <Divider sx={{ backgroundColor: theme.palette.orangePrimary.main }} />
            <Box>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={7} marginTop={"15px"}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("item.name")}</Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{ sx: { height: '35px', fontSize: "10px" } }}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("brief")}</Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{ sx: { height: '35px', fontSize: "10px" } }}
                                    value={brief}
                                    onChange={(e) => setBrief(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("discription")}</Typography>
                                <TextField
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                    fullWidth
                                    InputProps={{ sx: { fontSize: "10px" } }}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("ingredients")}</Typography>
                                <TextField
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                    fullWidth
                                    InputProps={{ sx: { fontSize: "10px" } }}
                                    value={ingredients}
                                    onChange={(e) => setIngredients(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("calories")}</Typography>
                                <TextField
                                    value={calories}
                                    onChange={(e) => setCalories(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        sx: { height: '35px', fontSize: "10px" },
                                        endAdornment: <Typography sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("kcal")}</Typography>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("time")}</Typography>
                                <TextField
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        sx: { height: '35px', fontSize: "10px" },
                                        endAdornment: <Typography sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("min")}</Typography>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("tax")}</Typography>
                                <TextField
                                    value={tax}
                                    onChange={(e) => setTax(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        sx: { height: '35px', fontSize: "10px" },
                                        endAdornment: <Typography sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>%</Typography>,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={5} marginTop={"25px"}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            sx={{ width: "160px", height: "90px", backgroundColor: "#f4f6fc", borderRadius: '8px', overflow: 'hidden' }}
                        >
                            {image ? (
                                typeof image === 'string' ? (
                                    <img
                                        src={`${BASE_URL_IMG}${image}`}
                                        alt="Uploaded item"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Uploaded item"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                )
                            ) : (
                                <Box display="flex" justifyContent="center" alignItems="center" width={"80%"}>
                                    <span className="icon-image-gallery" style={{ fontSize: "40px", color: "gray" }}></span>
                                </Box>
                            )}
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography variant="body2" sx={{ fontSize: "8px", color: theme.palette.text.gray_white, margin: "5px" }}>{t("item.image")}</Typography>
                            <Button
                                onClick={handleImageUpload}
                                variant="contained"
                                startIcon={<StraightOutlinedIcon sx={{ fontSize: '10px', color: theme.palette.orangePrimary.main }} />}
                                sx={{
                                    minWidth: 'auto', backgroundColor: theme.palette.secondaryColor.main, fontSize: "10px", padding: "2px 20px", color: '#fff', textTransform: 'none', borderRadius: "20px",
                                    "&:hover": { backgroundColor: '#222242' },
                                }}
                            >
                                {t("upload")}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12} alignItems="center" marginTop={"30px"}>
                    <Grid display="flex" alignItems="center">
                        <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("size.many")}</Typography>
                        <Grid container spacing={1} alignItems="center">
                            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Box
                                    sx={{
                                        borderRadius: "50%",
                                        width: "25px",
                                        height: "25px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: "5px",
                                        marginTop: "10px",
                                        backgroundColor: theme.palette.orangePrimary.main,
                                        color: "white",
                                        fontSize: "10px",
                                    }}
                                >
                                    S
                                </Box>
                                <Grid item xs={3}>
                                    <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("price.one")}</Typography>
                                    <TextField
                                        value={priceSmall}
                                        onChange={(e) => setPriceSmall(e.target.value)}
                                        placeholder='0.00'
                                        variant="outlined"
                                        fullWidth
                                        type="number"
                                        InputProps={{
                                            sx: { height: '30px', fontSize: "10px", width: "100px" },
                                            endAdornment: <Typography sx={{ fontSize: "9px", color: theme.palette.text.gray_white }}>EGP</Typography>,
                                        }}
                                    />
                                </Grid>
                            </Box>
                            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} margin={"0px 12px"}>
                                <Box
                                    sx={{
                                        borderRadius: "50%",
                                        width: "25px",
                                        height: "25px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: theme.palette.orangePrimary.main,
                                        color: "white",
                                        fontSize: "10px", marginRight: "5px",
                                        marginTop: "10px",
                                    }}
                                >
                                    M
                                </Box>
                                <Grid item xs={3} alignItems="center">
                                    <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("price.one")}</Typography>
                                    <TextField
                                        value={priceMedium}
                                        onChange={(e) => setPriceMedium(e.target.value)}
                                        placeholder='0.00'
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            sx: { height: '30px', fontSize: "10px", width: "100px" },
                                            endAdornment: <Typography sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>EGP</Typography>,
                                        }}
                                    />
                                </Grid>
                            </Box>
                            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Box
                                    sx={{
                                        borderRadius: "50%",
                                        width: "25px",
                                        height: "25px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        backgroundColor: "#9d9d9c",
                                        color: "white",
                                        fontSize: "10px",
                                        marginRight: "5px",
                                        marginTop: "10px",
                                    }}
                                >
                                    L
                                </Box>
                                <Grid item xs={3} alignItems="center">
                                    <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("price.one")}</Typography>
                                    <TextField
                                        value={priceLarge}
                                        onChange={(e) => setPriceLarge(e.target.value)}
                                        placeholder='0.00'
                                        variant="outlined"
                                        fullWidth
                                        type="number"
                                        InputProps={{
                                            sx: { height: '30px', fontSize: "10px", width: "100px" },
                                            endAdornment: <Typography sx={{ fontSize: "9px", color: theme.palette.text.gray_white }}>EGP</Typography>,
                                        }}
                                    />
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} marginTop={"20px"} marginBottom={"20px"}>
                        <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("price.one")}</Typography>
                        <TextField
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            variant="outlined"
                            fullWidth
                            type="number"
                            InputProps={{
                                sx: { height: '35px', fontSize: "10px" },
                                endAdornment: <Typography sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>EGP</Typography>,
                            }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant='body2' sx={{ fontSize: "10px", color: theme.palette.text.gray_white }}>{t("discount.one")}</Typography>
                        <TextField
                            value={discount} // عرض الرمز النصي
                            onChange={handleDiscountChange} // التحقق من الرمز
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                sx: { height: '35px', fontSize: "10px" },
                                // endAdornment: <Typography sx={{ fontSize: "12px", color: "gray" }}>%</Typography>,
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};