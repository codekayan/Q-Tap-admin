import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton, AppBar, Toolbar, CardMedia, Divider, useTheme } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Cart from './Cart';
import { useTranslation } from 'react-i18next';
import { customWidth } from '../utils';
import Language from '../../../../Component/dashboard/TopBar/Language';
import { toast } from 'react-toastify';
import { BASE_URL_IMG } from "../../../../utils/constants"
import { haveSameExtrasAndOptions, itemCalculation } from '../utils/cartUtils';

const ProductDetails = ({
    item,
    activeItemId,
    handleOptionClick,
    selectedItemOptions,
    selectedSize,
    handleSizeClick,
    isCartOpen,
    toggleCart,
    selectedItemExtra,
    handleExtraClick,
    onClose,
    cartCount,
    setCartCount
}) => {
    console.log("item of meal", item)
    const { t } = useTranslation();
    const theme = useTheme();
    const sizes = [
        { label: 'S', price: item.price_small },
        { label: 'M', price: item.price_medium },
        { label: 'L', price: item.price_large }
    ];

    const [cartItems, setCartItems] = useState([]);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        const localcart = localStorage.getItem('cartItems');
        let storedCartItems = []
        if (localcart) {
            storedCartItems = JSON.parse(localcart);
        }
        setCartItems(storedCartItems);
        setCartCount(storedCartItems.length)
    }, []);
    /* helper function */
    const updateCart = (itemId, action) => {
        // actions => ( increase , decrease , remove )
        const updatedCartItems = cartItems.map(cartItem => {
            if (cartItem.id === itemId) {
                if (action === 'increase') {
                    return { ...cartItem, quantity: cartItem.quantity + 1 };
                } else if (action === 'decrease' && cartItem.quantity > 1) {
                    return { ...cartItem, quantity: cartItem.quantity - 1 };
                }//TODO: what happen when item quantity is 1 and user decrease
            }
            return cartItem;
        }).filter(cartItem => !(action === 'remove' && cartItem.id === itemId));

        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };
    /* 
    *   cartItems :
    *   1- check size selected & quantity not equal zero
    *   2- cart doesnt have the  meal
    *   3- Cart has the meal 
    *       - meal identical (size , options , extras) --> update the meal
    *       - meal not identical --> create new meal with this specification
    */

    /* this call by the button  */
    const addItemToCart = (newItem) => {
        if (quantity === 0) {
            toast.error('select quantity')
            return;
        }

        if (!newItem.selectedSize && !newItem?.special) {
            toast.error('select size')
            return;
        }

        const existingItem = cartItems?.find(cartItem => (cartItem.id === newItem.id && cartItem.selectedSize === newItem.selectedSize && haveSameExtrasAndOptions(cartItem, newItem)));
        if (existingItem) {
            setCartItems(prev => {
                const updatedCart = prev.map(item => {
                    if (item.id === newItem.id && item.selectedSize === newItem.selectedSize && haveSameExtrasAndOptions(item, newItem)) {
                        return {
                            ...item,
                            quantity: item.quantity + quantity
                        };
                    }
                    return item;
                });
                // Update localStorage with the new cart
                localStorage.setItem('cartItems', JSON.stringify(updatedCart));
                return updatedCart;
            });
        } else {
            newItem.quantity = quantity;
            const updatedCart = [...cartItems, newItem];
            setCartItems(updatedCart)
            localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        }
        setQuantity(0)

    };
    //TODO: delete this section get item quantity from property in the  cartItems
    const [itemCount, setItemCount] = useState([]); // TODO: what this do 

    const handleAddItem = (itemId) => {
        setItemCount((prevItems) => {
            const existingItem = prevItems.find(i => i.id === itemId);
            if (existingItem) {
                return prevItems.map(i =>
                    i.id === itemId ? { ...i, count: i.count + 1 } : i
                );
            } else {
                return [...prevItems, { id: itemId, count: 1 }];
            }
        });
    };

    const handleMinusItem = (itemId) => {
        setItemCount((prevItems) => {
            const existingItem = prevItems.find(i => i.id === itemId);
            if (existingItem && existingItem.count > 1) {
                return prevItems.map(i =>
                    i.id === itemId ? { ...i, count: i.count - 1 } : i
                );
            } else {
                return prevItems.filter(i => i.id !== itemId);
            }
        });
    };

    const getItemCount = (itemId) => {
        const countItem = itemCount.find(i => i.id === itemId);
        return countItem ? countItem.count : 0;
    };
    /// TODO: replace this part by our totalCalculator
    // حساب السعر الإجمالي
    const getTotalPrice = () => {
        // السعر الأساسي بناءً على الحجم المختار

        const { itemSubTotal, itemDiscount, itemTax } = itemCalculation({
            price_large: item.price_large,
            price_medium: item.price_medium,
            price_small: item.price_small,
            selectedSize: selectedSize[item.id],
            selectedExtra: selectedItemExtra[item.id],
            selectedOptions: selectedItemOptions[item.id],
            special: item?.special,
            Tax: item.Tax,
            discountPer: item.discount
        })
        // console.log(">>>>>>>>>>> item <<<<<<<<<<<<<", item)
        // let basePrice = item.price;
        // const selectedSizeLabel = selectedSize[item.id];
        // if (selectedSizeLabel) {
        //     const selectedSizeObj = sizes.find(size => size.label === selectedSizeLabel);
        //     basePrice = selectedSizeObj ? selectedSizeObj.price : item.price;
        // }

        // // أسعار المتغيرات المختارة
        // const optionsPrice = selectedItemOptions[item.id]?.reduce((total, option) => {
        //     return total + (parseFloat(option.price) || 0);
        // }, 0) || 0;

        // // أسعار الإضافات المختارة
        // const extrasPrice = selectedItemExtra[item.id]?.reduce((total, extra) => {
        //     return total + (parseFloat(extra.price) || 0);
        // }, 0) || 0;

        // // السعر الإجمالي

        return ((itemSubTotal + itemTax - itemDiscount) * quantity).toFixed(2);
    };

    return (
        <>
            <Box sx={{ overflowY: "auto", width: customWidth.itemSectionWidth, boxShadow: 3, bgcolor: theme.palette.bodyColor.white_333, position: 'fixed', right: 0, top: 0, height: '100vh' }}>
                <Box sx={{ position: "fixed", top: 0, width: customWidth.itemSectionWidth, zIndex: 1201 }}>
                    <AppBar position="static" color="inherit"
                        sx={{ boxShadow: "none", bgcolor: theme.palette.bodyColor.white_333, backgroundImage: 'none' }}
                        className='hers'>
                        <Toolbar>
                            <IconButton onClick={toggleCart} edge="start" color="inherit" aria-label="cart">
                                <ShoppingCartOutlinedIcon sx={{ color: theme.palette.orangePrimary.main, fontSize: "25px" }} />
                                <Typography sx={{
                                    position: "relative", top: "-10px", left: "-10px", fontSize: "8px", padding: "0px 3px", borderRadius: "50%",
                                    backgroundColor: theme.palette.orangePrimary.main, color: "white"
                                }}>{cartItems?.length}</Typography>
                            </IconButton>
                            <Box sx={{ flexGrow: 1 }} />
                            <IconButton onClick={onClose} sx={{ color: theme.palette.orangePrimary.main }}>
                                <CloseIcon />
                            </IconButton>
                            <Language />
                            <Box sx={{ display: "flex", textAlign: "center", alignItems: "center", cursor: "pointer" }}>
                                <PersonOutlineOutlinedIcon
                                    sx={{ color: "white", fontSize: "18px", borderRadius: "10px", padding: "5px", backgroundColor: theme.palette.orangePrimary.main }} />
                                <Typography variant='body2' sx={{ color: "#575756", fontSize: "10px", padding: "0px 5px" }}>Admin</Typography>
                                <KeyboardArrowDownOutlinedIcon sx={{ color: "#575756", fontSize: "13px" }} />
                            </Box>
                        </Toolbar>
                        <Box>
                            <CardMedia
                                component="img"
                                height="300"
                                src={`${BASE_URL_IMG}${item.img}`}
                                alt={item.name}
                                style={{ width: '100%', height: '270px', objectFit: 'cover' }}
                            />
                            <Box sx={{ position: 'relative', top: '-40px', marginRight: "50px", float: "right" }}>
                                {activeItemId === item.id && (
                                    <Box sx={{
                                        background: theme.palette.bodyColor.white_333, width: "40px", color: theme.palette.text.gray_white, borderRadius: "10px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                        justifyContent: "center", textAlign: "center", alignItems: "center", padding: "5px 2px",
                                    }}>
                                        <AddCircleOutlinedIcon
                                            onClick={() => setQuantity(quantity + 1)}
                                            sx={{ fontSize: "18px", color: theme.palette.orangePrimary.main, cursor: "pointer" }}
                                        />
                                        <Typography sx={{ fontSize: "11px", padding: "4px 0px", color: theme.palette.text.gray27_white }}>
                                            {quantity}
                                        </Typography>
                                        <RemoveCircleOutlinedIcon
                                            onClick={() => { if (quantity !== 0) setQuantity(quantity - 1) }}
                                            sx={{ fontSize: "18px", color: theme.palette.orangePrimary.main, cursor: "pointer" }}
                                        />
                                    </Box>
                                )}
                            </Box>
                            <Box sx={{ zIndex: "5000", padding: "15px 20px" }}>
                                <Typography variant="h6" sx={{ fontSize: "18px", fontWeight: 'bold', color: theme.palette.text.gray_white }}>{item.name}</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "11px" }}>{item.Description}</Typography>
                                <Box width={"100%"}>
                                    <Divider sx={{ width: "100%", height: "1px", color: "gray" }} />
                                    <Box sx={{ display: "flex", alignItems: "center", textAlign: "center", padding: "5px 0px", justifyContent: "space-around" }}>
                                        <Box display="flex" alignItems="center">
                                            <span className="icon-star" style={{ color: theme.palette.orangePrimary.main, fontSize: "15px" }}></span>
                                            <Typography variant="body2" color="black" sx={{ fontSize: '11px', marginLeft: "3px" }}>
                                                {item.rating || '4.5'}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <span className="icon-calories-1"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span></span>
                                            <Typography variant="body2" color="black" sx={{ fontSize: '11px', marginLeft: "3px" }}>
                                                {item.Calories} <span style={{ fontSize: '10px', color: theme.palette.orangePrimary.main }}>Kcal</span>
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <span className="icon-chronometer"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span><span className="path11"></span><span className="path12"></span></span>
                                            <Typography variant="body2" color="black" sx={{ fontSize: '11px', marginLeft: "3px" }}>
                                                {item.Time} <span style={{ fontSize: '10px', color: theme.palette.orangePrimary.main }}>Min</span>
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ width: "100%", height: "1px", color: "gray" }} />
                                </Box>
                            </Box>
                        </Box>
                    </AppBar>
                </Box>
                {/* size sections */}
                <Box sx={{ position: "relative", top: "430px", padding: "15px 20px", bgcolor: theme.palette.bodyColor.white_333 }}>
                    <Box display="flex" alignItems="center" gap={2} sx={{ padding: "20px 0px" }}>
                        <Typography variant="h6" sx={{ fontSize: '11px', fontWeight: "bold", color: theme.palette.text.gray_white }}>
                            {t("size.one")}
                        </Typography>
                        {(item?.special === null || item?.special === undefined) && sizes.map((size) => (
                            <Box key={size.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button
                                    onClick={() => handleSizeClick(item.id, size.label)}
                                    sx={{
                                        width: "20px",
                                        height: "20px",
                                        fontSize: "8px",
                                        borderRadius: "50%",
                                        minWidth: "20px",
                                        backgroundColor: selectedSize[item.id] === size.label ? theme.palette.orangePrimary.main : "#E0E0E0",
                                        color: selectedSize[item.id] === size.label ? "white" : "black",
                                        "&:hover": {
                                            backgroundColor: selectedSize[item.id] === size.label ? "#D47A1C" : "#D0D0D0",
                                        },
                                    }}
                                >
                                    {size.label}
                                </Button>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: '10px',
                                        color: selectedSize[item.id] === size.label ? theme.palette.orangePrimary.main : theme.palette.text.gray_white,
                                    }}
                                >
                                    {size.price} EGP
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box>
                        <Typography variant="h6" sx={{ fontSize: "10px", fontWeight: 'bold', color: theme.palette.text.gray_white }}>
                            {t("discount.one")}:{item.discount}
                        </Typography>
                        <Typography variant="h6" sx={{ fontSize: "10px", fontWeight: 'bold', color: theme.palette.text.gray_white }}>
                            {t("yourOptions")} <span style={{ fontSize: "8px", fontWeight: '300', color: theme.palette.text.black_white }}>({t("required")})</span>
                        </Typography>
                        {activeItemId === item.id && (
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {item.variants?.map((option, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => handleOptionClick(item.id, option)}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "47%",
                                            height: "20px",
                                            backgroundColor: selectedItemOptions[item.id]?.includes(option) ? "#F28C1F" : "#FFFFFF",
                                            color: selectedItemOptions[item.id]?.includes(option) ? "white" : "#575756",
                                            border: selectedItemOptions[item.id]?.includes(option) ? "none" : "1px solid #E0E0E0",
                                            borderRadius: "8px",
                                            padding: "0 10px",
                                            "&:hover": {
                                                backgroundColor: selectedItemOptions[item.id]?.includes(option) ? "#D47A1C" : "#F5F5F5",
                                            },
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontSize: "10px", textTransform: "capitalize" }}>
                                            {option.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ marginLeft: "auto", fontSize: "8px", textTransform: "capitalize", fontWeight: "bold" }}>
                                            {option.price === 0 ? <span style={{ fontWeight: 400 }}>{t("free")}</span> : `+${option.price} EGP`}
                                        </Typography>
                                    </Button>
                                ))}
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ marginTop: "15px" }}>
                        <Typography variant="h6" sx={{ fontSize: "10px", fontWeight: 'bold', color: theme.palette.text.gray_white }}>
                            {t("extra.one")}
                        </Typography>
                        {activeItemId === item.id && (
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {item.extras?.map((extra, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => handleExtraClick(item.id, extra)}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "47%",
                                            height: "20px",
                                            backgroundColor: selectedItemExtra[item.id]?.includes(extra) ? theme.palette.secondaryColor.main : "#FFFFFF",
                                            color: selectedItemExtra[item.id]?.includes(extra) ? "white" : "#575756",
                                            border: selectedItemExtra[item.id]?.includes(extra) ? "none" : "1px solid #E0E0E0",
                                            borderRadius: "8px",
                                            padding: "0 10px",
                                            "&:hover": {
                                                backgroundColor: selectedItemExtra[item.id]?.includes(extra) ? theme.palette.secondaryColor.main : "#F5F5F5",
                                            },
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontSize: "10px", textTransform: "capitalize" }}>
                                            {extra.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ marginLeft: "auto", fontSize: "8px", textTransform: "capitalize", fontWeight: "bold" }}>
                                            {extra.price === 0 ? <span style={{ fontWeight: 400 }}>{t("free")}</span> : `+${extra.price} EGP`}
                                        </Typography>
                                    </Button>
                                ))}
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ marginTop: "15px" }}>
                        <Typography variant="h6" sx={{ fontSize: "10px", fontWeight: 'bold', color: theme.palette.text.gray_white }}>
                            {t("ingrediants")}
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {item.Ingredients?.split(',').map((ingredient, index) => (
                                <Button
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "22%",
                                        height: "20px",
                                        backgroundColor: "#E0E6E6",
                                        color: theme.palette.text.fixedBlack,
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "0 10px",
                                        "&:hover": {
                                            backgroundColor: "#E0E6E6",
                                        },
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontSize: "7px", textTransform: "capitalize" }}>
                                        {ingredient.trim()}
                                    </Typography>
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{ marginTop: "15px", marginBottom: "70px" }}>
                        <Typography variant="h6" sx={{ fontSize: "10px", fontWeight: 'bold', color: theme.palette.text.gray_white }}>
                            {t("discription")}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "8px", color: theme.palette.text.gray_white, width: "70%" }}>
                            {item.Description}
                        </Typography>
                    </Box>
                </Box>
                {/* price section */}
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        backgroundColor: theme.palette.bodyColor.whiteGray_lightBlack,
                        height: "80px",
                        width: customWidth.buttonSectionWidth,
                        padding: "20px",
                        boxShadow: 3,
                        borderRadius: "30px 30px 0px 0px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        <Typography variant="h6" sx={{ fontSize: '11px', fontWeight: "bold", color: theme.palette.text.black_white }}>
                            {t("price.one")}
                        </Typography>
                        <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: "bold", color: theme.palette.orangePrimary.main }}>
                            {getTotalPrice()} <span style={{ fontSize: "10px", fontWeight: "400", color: theme.palette.text.gray_white }}>EGP</span>
                        </Typography>
                    </Box>
                    <Button
                        onClick={() => addItemToCart({
                            ...item,
                            // price: getTotalPrice(),
                            selectedSize: selectedSize[item.id],
                            selectedOptions: selectedItemOptions[item.id],
                            selectedExtras: selectedItemExtra[item.id]
                        })}
                        sx={{
                            backgroundColor: theme.palette.orangePrimary.main,
                            color: "white",
                            textTransform: "capitalize",
                            fontSize: "10px",
                            float: "right",
                            borderRadius: "20px",
                            width: "55%",
                            height: "30px",
                            "&:hover": {
                                backgroundColor: "#ef7d10",
                            }
                        }}
                    >
                        {t("addToCart")}
                    </Button>
                </Box>
            </Box>

            {isCartOpen && (
                <Cart
                    itemCount={itemCount}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    updateCart={updateCart}
                    getItemCount={getItemCount}
                    handleMinusItem={handleMinusItem}
                    handleAddItem={handleAddItem}
                    selectedSize={selectedSize}
                    selectedItemOptions={selectedItemOptions}
                    selectedItemExtra={selectedItemExtra}
                />
            )}
        </>
    );
};

export default ProductDetails;