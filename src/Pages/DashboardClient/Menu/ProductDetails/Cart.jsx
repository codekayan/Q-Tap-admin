import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Button,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import OrderTypeForm from "./OrderTypeForm";
import { useTranslation } from "react-i18next";
import { customWidth } from "../utils";
import Language from "../../../../Component/dashboard/TopBar/Language";
import {
  calculateSingleItemTotalPrice,
  calculateTotalPrice,
  haveSameExtrasAndOptions,
} from "../utils/cartUtils";

const Cart = ({
  selectedItemOptions,
  selectedItemExtra,
  cartItems,
  setCartItems,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // حالة القائمة المنسدلة لتسجيل الخروج
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutMenuOpen, setLogoutMenuOpen] = useState(false);

  const toggleTypeForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(calculateTotalPrice(cartItems));
  }, [cartItems]);

  const handleCartItemQuantityChange = (
    meal,
    event /* 1 for increase , -1 for decrease */,
  ) => {
    let cartStorage = localStorage.getItem("cartItems")
      ? localStorage.getItem("cartItems")
      : "[]";
    cartStorage = JSON.parse(cartStorage);

    const newCart = cartStorage?.map((item) => {
      if (
        item.id === meal.id &&
        meal.selectedSize === item.selectedSize &&
        haveSameExtrasAndOptions(item, meal)
      ) {
        item.quantity += event;
      }
      return item;
    });

    const filterCart = newCart.filter((item) => item.quantity > 0);
    setCartItems(filterCart);

    const newCartString = JSON.stringify(filterCart);
    localStorage.setItem("cartItems", newCartString);
  };

  // دالة فتح/إغلاق قائمة تسجيل الخروج
  const handleLogoutMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setLogoutMenuOpen(true);
  };

  const handleLogoutMenuClose = () => {
    setAnchorEl(null);
    setLogoutMenuOpen(false);
  };

  // دالة تسجيل الخروج
  const handleLogout = () => {
    handleLogoutMenuClose();

    if (
      window.confirm(
        t("logoutConfirmation") || "Are you sure you want to logout?",
      )
    ) {
      // مسح جميع بيانات المستخدم
      localStorage.removeItem("Token");
      localStorage.removeItem("selectedBranchID");
      localStorage.removeItem("selectedShopID");
      localStorage.removeItem("selectedBranch");
      localStorage.removeItem("selectedShop");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("formData");

      // مسح sessionStorage أيضاً
      sessionStorage.clear();

      // إعادة التوجيه إلى الصفحة الرئيسية أو صفحة تسجيل الدخول
      window.location.href = "/"; // أو '/login'
    }
  };



  return (
    <>
      <Box
        sx={{
          overflowY: "auto",
          width: customWidth.itemSectionWidth,
          boxShadow: 3,
          bgcolor: theme.palette.bodyColor.white_333,
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            width: customWidth.itemSectionWidth,
            zIndex: 1201,
          }}
        >
          <AppBar position="static" color="inherit">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="cart">
                <ShoppingCartOutlinedIcon
                  sx={{
                    color: theme.palette.orangePrimary.main,
                    fontSize: "25px",
                  }}
                />
                <Typography
                  sx={{
                    position: "relative",
                    top: "-10px",
                    left: "-10px",
                    fontSize: "8px",
                    padding: "0px 3px",
                    borderRadius: "50%",
                    backgroundColor: theme.palette.orangePrimary.main,
                    color: "white",
                  }}
                >
                  {cartItems?.length}
                </Typography>
              </IconButton>

              <Box sx={{ flexGrow: 1 }} />
              <Language />

              {/* زر تسجيل الخروج مع قائمة منسدلة */}
              <Box
                sx={{
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 1, // تأكد من أن z-index منخفض
                }}
              >
                <Box
                  onClick={handleLogoutMenuOpen}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <PersonOutlineOutlinedIcon
                    sx={{
                      color: "white",
                      fontSize: "18px",
                      borderRadius: "10px",
                      padding: "5px",
                      backgroundColor: theme.palette.orangePrimary.main,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#575756",
                      fontSize: "10px",
                      padding: "0px 5px",
                    }}
                  >
                    Admin
                  </Typography>
                  <KeyboardArrowDownOutlinedIcon
                    sx={{
                      color: "#575756",
                      fontSize: "13px",
                    }}
                  />
                </Box>
              </Box>
            </Toolbar>
          </AppBar>

          {/* قائمة تسجيل الخروط المنسدلة */}
          <Menu
            anchorEl={anchorEl}
            open={logoutMenuOpen}
            onClose={handleLogoutMenuClose}
            PaperProps={{
              style: {
                zIndex: 9999, // z-index عالي جداً
                marginTop: "5px",
              },
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
    
            <MenuItem
              onClick={handleLogout}
              sx={{
                fontSize: "12px",
                color: theme.palette.error.main,
                minWidth: "150px",
              }}
            >
              🚪 {t("logout") || "Logout"}
            </MenuItem>
          </Menu>

          <Box
            sx={{
              overflow: "auto",
              maxHeight: "90vh",
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ padding: 2, marginBottom: "40px", height: "auto" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "10px",
                    display: "flex",
                    letterSpacing: 1,
                  }}
                >
                  <ShoppingCartOutlinedIcon
                    sx={{
                      color: theme.palette.orangePrimary.main,
                      marginRight: "5px",
                      fontSize: "17px",
                    }}
                  />
                  {t("yourCart")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "9px",
                    color: "gray",
                    letterSpacing: 1,
                  }}
                >
                  {cartItems?.length} {t("item.many")}
                </Typography>
              </Box>

              {cartItems?.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginY: 2,
                    borderBottom: "1px solid #e0e0e0",
                    paddingBottom: "5px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "10px",
                        marginRight: "10px",
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h1"
                        sx={{
                          fontSize: "11px",
                          fontWeight: "900",
                          color: theme.palette.text.gray_white,
                        }}
                      >
                        {item.name}
                        <span
                          style={{
                            color: theme.palette.orangePrimary.main,
                          }}
                        >
                          {item.selectedSize}
                        </span>
                      </Typography>

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          fontSize: "9px",
                          marginTop: "3px",
                        }}
                      >
                        {item.description}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          marginTop: "2px",
                          fontSize: "9px",
                          color: theme.palette.text.gray_white,
                        }}
                      >
                        <span
                          style={{
                            color: theme.palette.orangePrimary.main,
                          }}
                        >
                          {t("option")} |
                        </span>
                        {(item.selectedOptions ?? [])
                          .map((extra) => extra.name)
                          .join(", ")}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          marginTop: "2px",
                          fontSize: "9px",
                          color: theme.palette.text.gray_white,
                        }}
                      >
                        <span
                          style={{
                            color: theme.palette.orangePrimary.main,
                          }}
                        >
                          {t("extra.one")} |
                        </span>
                        {(item.selectedExtras ?? [])
                          .map((extra) => extra.name)
                          .join(", ")}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <AddCircleOutlinedIcon
                        onClick={() => {
                          handleCartItemQuantityChange(item, 1);
                        }}
                        sx={{
                          fontSize: "18px",
                          color: "black",
                          cursor: "pointer",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "11px",
                          padding: "0px 8px",
                          color: theme.palette.text.Gray27_white,
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <RemoveCircleOutlinedIcon
                        onClick={() => {
                          handleCartItemQuantityChange(item, -1);
                        }}
                        sx={{
                          fontSize: "18px",
                          color: "black",
                          cursor: "pointer",
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          marginTop: "5px",
                          fontSize: "15px",
                          fontWeight: "bold",
                          color: theme.palette.orangePrimary.main,
                        }}
                      >
                        {calculateSingleItemTotalPrice(item)}
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: "400",
                            color: "#575756",
                          }}
                        >
                          EGP
                        </span>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                backgroundColor: theme.palette.bodyColor.white_lightBlack,
                height: "fit-content",
                width: customWidth.buttonSectionWidth,
                padding: "20px",
                boxShadow: 3,
                borderRadius: "30px 30px 0px 0px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: theme.palette.text.dGray27_white,
                  }}
                >
                  {t("totalPrice")}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: theme.palette.orangePrimary.main,
                  }}
                >
                  {total}
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "400",
                      color: "#575756",
                    }}
                  >
                    EGP
                  </span>
                </Typography>
              </Box>
              <Button
                onClick={toggleTypeForm}
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
                  },
                }}
              >
                {t("checkout")}
                <TrendingFlatIcon sx={{ fontSize: "18px", mr: 1 }} />
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {isFormOpen && (
        <OrderTypeForm
          cartItems={cartItems}
          totalCart={total}
          selectedItemOptions={selectedItemOptions}
          selectedItemExtra={selectedItemExtra}
          setCartItems={setCartItems}
        />
      )}
    </>
  );
};

export default Cart;
