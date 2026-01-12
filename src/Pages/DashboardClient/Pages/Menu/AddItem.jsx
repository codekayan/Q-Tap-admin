import React, { useState, useEffect } from "react";
import {
    Avatar,
    Box,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Popover,
    Typography,
    useTheme,
    Button,
    CircularProgress, // Added for loading spinner
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate, useLocation } from "react-router";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { AppBar, Toolbar } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ItemDetails } from "./ItemDetails";
import { VariantsTable } from "./VariantsTable";
import { ExtrasTable } from "./ExtrasTable";
import { DeliveredFooter } from "../../DeliveryRiders/DeliveredFooter";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../../utils/constants"

export const AddItem = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const itemId = searchParams.get("itemId");
    const selectedBranch = localStorage.getItem("selectedBranch");



    // State for data
    const [itemData, setItemData] = useState({
        name: "",
        brief: "",
        description: "",
        ingredients: "",
        calories: "",
        time: "",
        tax: "",
        priceSmall: "",
        priceMedium: "",
        priceLarge: "",
        price: "",
        discount: "",
        image: null,
    });
    const [variants, setVariants] = useState([]);
    const [extras, setExtras] = useState([]);
    const [limitVariants, setLimitVariants] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(!itemId); // If no itemId, no need to fetch, so dataLoaded is true

    const [anchorElUser, setAnchorElUser] = useState(null);
    const openUserPopover = Boolean(anchorElUser);

    const handleUserClick = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleUserClose = () => {
        setAnchorElUser(null);
    };

    // Fetch item data when editing
    useEffect(() => {
        if (itemId) {
            const fetchItem = async () => {
                try {
                    setLoading(true); // Set loading to true while fetching
                    const response = await axios.get(
                        `${BASE_URL}meals`,
                        {
                            params: { brunch_id: selectedBranch },
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("Token")}`,
                            },
                        }
                    );
                    const meal = response.data;
                    const item = meal.find((item) => item.id === parseInt(itemId));
                    if (!item) {
                        toast.error(t("itemNotFound"));
                        setDataLoaded(true); // Allow rendering even if item not found
                        return;
                    }

                    setItemData({
                        name: item.name || "",
                        brief: item.Brief || "",
                        description: item.Description || "",
                        ingredients: item.Ingredients || "",
                        calories: item.Calories || "",
                        time: item.Time || "",
                        tax: item.Tax || "",
                        priceSmall: item.price_small || "",
                        priceMedium: item.price_medium || "",
                        priceLarge: item.price_large || "",
                        price: item.price || "",
                        discount: item.discount || "",
                        image: item.img || null,
                    });
                    setVariants(item.variants || []);
                    setExtras(item.extras || []);
                    setLimitVariants(item.limit_variants || "");
                    setIsEditing(true);
                    setDataLoaded(true); // Data is fully loaded
                } catch (error) {
                    toast.error(t("errorOccurred"));
                    console.error("Error fetching item:", error);
                    setDataLoaded(true); // Allow rendering to show error state
                } finally {
                    setLoading(false); // Stop loading
                }
            };
            fetchItem();
        }
        console.log("useEffect rerender")
    }, [itemId, selectedBranch]);

    // Update item data from ItemDetails
    const updateItemData = (data) => {
        setItemData(data);
    };

    // Update variants from VariantsTable
    const updateVariants = (variantsData) => {
        setVariants(variantsData);
    };

    // Update extras from ExtrasTable
    const updateExtras = (extrasData) => {
        setExtras(extrasData);
    };

    // Submit data to API
    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Validate required fields
            const requiredFields = [
                'name',
                'brief',
                'description',
                'ingredients',
                'calories',
                'time',
                'tax',
                'price',
                'priceSmall',
                'priceMedium',
                'priceLarge',
                'discount',
                // 'image',       // Uncomment if needed
                // 'limitVariants' // If it's part of itemData
            ];
            const missingFields = requiredFields.filter(field => !itemData[field]);
            const isMissingField = requiredFields.some(field => !itemData[field]);
            if (isMissingField) {
                console.log("missingFields",missingFields)
                toast.error(t("plFillAllField"));
                console.log("Validation failed: missing required fields.");
                return;
            }

            // Prepare data for submission
            const data = {
                name: itemData.name,
                Brief: itemData.brief,
                Description: itemData.description,
                Ingredients: itemData.ingredients,
                Calories: itemData.calories,
                Time: itemData.time,
                Tax: itemData.tax,
                price_small: itemData.priceSmall,
                price_medium: itemData.priceMedium,
                price_large: itemData.priceLarge,
                price: itemData.price,
                discount_id: itemData.discount,
                categories_id: categoryId,
                brunch_id: selectedBranch,
                limit_variants: limitVariants,
                variants: variants.map((variant) => ({
                    name: variant.name,
                    price: variant.price,
                })),
                extra: extras.map((extra) => ({
                    name: extra.name,
                    price: extra.price,
                    variants_id: extra.variants_id || "",
                })),
            };

            let response;
            if (itemData.image && typeof itemData.image !== "string") {
                const formData = new FormData();
                formData.append("name", data.name);
                formData.append("Brief", data.Brief);
                formData.append("Description", data.Description);
                formData.append("Ingredients", data.Ingredients);
                formData.append("Calories", data.Calories);
                formData.append("Time", data.Time);
                formData.append("Tax", data.Tax);
                formData.append("price_small", data.price_small);
                formData.append("price_medium", data.price_medium);
                formData.append("price_large", data.price_large);
                formData.append("price", data.price);
                formData.append("discount_id", data.discount_id);
                formData.append("categories_id", data.categories_id);
                formData.append("brunch_id", data.brunch_id);
                formData.append("limit_variants", data.limit_variants);
                formData.append("img", itemData.image);

                data.variants.forEach((variant, index) => {
                    formData.append(`variants[${index}][name]`, variant.name);
                    formData.append(`variants[${index}][price]`, variant.price);
                });
                data.extra.forEach((extra, index) => {
                    formData.append(`extra[${index}][name]`, extra.name);
                    formData.append(`extra[${index}][price]`, extra.price);
                    if (extra.variants_id) {
                        formData.append(`extra[${index}][variants_id]`, extra.variants_id);
                    }
                });

                const url = isEditing

                    ? `${BASE_URL}meals/${itemId}`
                    : `${BASE_URL}meals`;
                const method = isEditing ? "post" : "post"; // Note: Consider using PUT for updates

                response = await axios({
                    method,
                    url,
                    data: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("Token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            } else {
                const url = isEditing

                    ? `${BASE_URL}meals/${itemId}`
                    : `${BASE_URL}meals`;
                const method = isEditing ? "put" : "post";

                response = await axios({
                    method,
                    url,
                    data,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("Token")}`,
                        "Content-Type": "application/json",
                    },
                });
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(isEditing ? t("item updated success") : t("item added Success"));
                navigate("/menu");
            }
        } catch (error) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach((err) => {
                    toast.error(err.join(", "));
                });
            } else {
                toast.error(error.response?.data?.message || t("errorOccurred"));
            }
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Render loading spinner if data is not yet loaded
    if (!dataLoaded) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    backgroundColor: "#f4f6fc",
                }}
            >
                <CircularProgress sx={{ color: theme.palette.orangePrimary.main }} />
            </Box>
        );
    }

    // Main content
    return (
        <Box sx={{ backgroundColor: theme.palette.bodyColor.white_333, marginBottom: "-33px" }}>  {/* TODO: fix white space here */}
            <AppBar
                position="static"
                style={{
                    padding: "20px 20px",
                    backgroundColor: theme.palette.secondaryColor.main,
                    zIndex: 3,
                    boxShadow: "none",
                }}
            >
                <Toolbar
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <IconButton
                        onClick={() => {
                            navigate("/menu");
                        }}
                        edge="start"
                        color="inherit"
                        aria-label="back"
                    >
                        <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                    <Box
                        aria-describedby={openUserPopover ? "simple-popover" : undefined}
                        onClick={handleUserClick}
                        sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                        }}
                    >
                        <IconButton
                            color="inherit"
                            sx={{
                                backgroundColor: theme.palette.orangePrimary.main,
                                borderRadius: "30%",
                                padding: "5px",
                                "&:hover": { backgroundColor: theme.palette.orangePrimary.main },
                            }}
                        >
                            <PersonOutlineOutlinedIcon
                                sx={{ fontSize: "20px", color: "white" }}
                            />
                        </IconButton>
                        <Typography
                            variant="body1"
                            sx={{ fontSize: "13px", color: "ef7d00" }}
                        >
                            {localStorage.getItem("clientName")}
                        </Typography>
                        <KeyboardArrowDownIcon sx={{ fontSize: "18px", color: "ef7d00" }} />
                    </Box>
                    <Popover
                        disableScrollLock
                        id={openUserPopover ? "simple-popover" : undefined}
                        open={openUserPopover}
                        anchorEl={anchorElUser}
                        onClose={handleUserClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    >
                        <Box sx={{ width: 200, padding: "10px" }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    marginBottom: "20px",
                                    gap: "10px",
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.orangePrimary.main,
                                        width: 40,
                                        height: 40,
                                    }}
                                >
                                    <PersonOutlineOutlinedIcon sx={{ fontSize: "22px" }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontSize: "14px" }}>
                                        {localStorage.getItem("clientName")}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontSize: "12px" }}
                                        color="textSecondary"
                                    >
                                        {localStorage.getItem("clientEmail")}
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider />
                            <List>
                                <Box
                                    onClick={() => navigate("/")}
                                    sx={{
                                        cursor: "pointer",
                                        backgroundColor: theme.palette.secondaryColor.main,
                                        color: "white",
                                        marginBottom: "10px",
                                        borderRadius: "30px",
                                        display: "flex",
                                        alignItems: "center",
                                        textAlign: "center",
                                        justifyContent: "center",
                                        width: "80%",
                                        padding: "5px 0px",
                                        margin: "0 auto",
                                    }}
                                >
                                    <span
                                        className="icon-home-icon-silhouette"
                                        style={{
                                            color: theme.palette.orangePrimary.main,
                                            marginRight: "5px",
                                            fontSize: "15px",
                                        }}
                                    ></span>
                                    <Typography
                                        style={{
                                            color: "white",
                                            fontSize: "11px",
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        Home
                                    </Typography>
                                </Box>
                                <ListItem sx={{ cursor: "pointer" }} onClick={handleUserClose}>
                                    <ListItemIcon>
                                        <img
                                            src="/assets/setting.svg"
                                            alt="icon"
                                            style={{ width: "16px", height: "16px" }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Edit Profile"
                                        primaryTypographyProps={{
                                            sx: { color: "#5D5D5C", fontSize: "12px", marginLeft: "-30px" },
                                        }}
                                    />
                                </ListItem>
                                <ListItem sx={{ cursor: "pointer" }} onClick={handleUserClose}>
                                    <ListItemIcon>
                                        <span className="icon-price-tag" style={{ fontSize: "20px" }}></span>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="My Subscription"
                                        primaryTypographyProps={{
                                            sx: { color: "#5D5D5C", fontSize: "12px", marginLeft: "-30px" },
                                        }}
                                    />
                                </ListItem>
                                <ListItem sx={{ cursor: "pointer" }} onClick={handleUserClose}>
                                    <ListItemIcon>
                                        <HelpOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="FAQ"
                                        primaryTypographyProps={{
                                            sx: { color: "#5D5D5C", fontSize: "12px", marginLeft: "-30px" },
                                        }}
                                    />
                                </ListItem>
                                <ListItem sx={{ cursor: "pointer" }} onClick={handleUserClose}>
                                    <ListItemIcon>
                                        <img
                                            src="/assets/logout.svg"
                                            alt="icon"
                                            style={{ width: "16px", height: "16px" }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Logout"
                                        primaryTypographyProps={{
                                            sx: { color: "#5D5D5C", fontSize: "12px", marginLeft: "-30px" },
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    </Popover>
                </Toolbar>
                <Typography
                    variant="h6"
                    style={{
                        flexGrow: 1,
                        fontSize: "20px",
                        textAlign: "left",
                        color: "white",
                        marginLeft: "100px",
                    }}
                >
                    {isEditing ? t("update") : t("add")}
                </Typography>
            </AppBar>

            <Box sx={{ padding: { xs: "", md: "0px 70px" } }}>
                <Grid container spacing={6} justifyContent={"space-around"}>
                    <Grid item xs={12} md={6}>
                        <ItemDetails
                            categoryId={categoryId}
                            itemId={itemId}
                            updateItemData={updateItemData}
                            initialData={itemData}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <VariantsTable
                            updateVariants={updateVariants}
                            initialVariants={variants}
                            limitVariants={limitVariants}
                            setLimitVariants={setLimitVariants}
                        />
                        <ExtrasTable
                            updateExtras={updateExtras}
                            initialExtras={extras}
                            variants={variants}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 0, mb: 6 }}>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            width: "33%",
                            backgroundColor: theme.palette.orangePrimary.main,
                            padding: "8px",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            "&:hover": { backgroundColor: theme.palette.orangePrimary.main },
                            margin: '5px'
                        }}
                        disabled={loading}
                    >
                        {loading ? t("loading") : isEditing ? t("update") : t("save")}
                    </Button>
                </Box>
            </Box>
            <DeliveredFooter />
        </Box>
    );
};