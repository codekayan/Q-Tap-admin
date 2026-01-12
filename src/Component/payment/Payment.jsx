import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { PricingCard } from "./PricingCard";
import { useNavigate } from "react-router";
import DoneIcon from "@mui/icons-material/Done";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/constants";

import {
  updateBusinessData,
  addBranch,
  selectBranch,
  clearBusinessData,
  setBranches,
} from "../../store/register/businessSlice";
import { updatePersonalData } from "../../store/register/personalSlice";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as Wallet } from "../../assets/cardColor.svg";
import { ReactComponent as Cash } from "../../assets/cash.svg";
import { Stack } from "@mui/system";
import useBranchStore from "../../store/zustand-store/register-client-branch-store";
import { useCheckDiscountCoupon } from "../../Hooks/Queries/plan/useCheckPlanCopone";
import { usePlanPricing } from "../../Hooks/Queries/clientDashBoard/plan/usePlanPricing";
import { SendHorizontal } from "lucide-react";

const Divider2 = styled(Box)(({ theme }) => ({
  width: "35%",
  height: "2px",
  backgroundColor: theme.palette.orangePrimary.main,
  borderRadius: "20px",
  display: "flex",
  margin: "0 auto",
}));
const Divider = styled(Box)(({ theme }) => ({
  width: "5%",
  height: "3px",
  backgroundColor: theme.palette.orangePrimary.main,
  borderRadius: "20px",
  marginBottom: "20px",
}));

export const Payment = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = useState("cash");
  // const [pricing, setPricing] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null); // { plan, pricingWay }
  const [discountCode, setDiscountCode] = useState("");
  const dispatch = useDispatch();
  const personalData = useSelector(
    (state) => state.registerPersonalDataStore.personalData
  );
  // const { businessData, branches, selectedBranch } = useSelector((state) => state.registerBranchStore);
  const branches = useBranchStore((state) => state.branches);

  const { mutate, isPending } = useCheckDiscountCoupon();

  const [couponStatus, setCouponStatus] = useState("check"); // "check" | "correct" | "wrong"
  const [validDiscountCode, setValidDiscountCode] = useState(null); // "check" | "correct" | "wrong"

  const { data, error, isPending: isLoading } = usePlanPricing();
  const pricing = data?.data?.data;

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    dispatch(updatePersonalData({ payment_method: event.target.value }));
  };

  const handleCheckCoupon = () => {
    mutate(
      { data: { code: discountCode } },
      {
        onSuccess: (res) => {
          console.log(res.data.discount);
          if (res.data.discount) {
            setCouponStatus("correct");
            setValidDiscountCode(res.data.discount);
          } else {
            setCouponStatus("wrong");
          }
        },
        onError: (err) => {
          console.log(err);
          setCouponStatus("wrong");
        },
      }
    );
  };

  const handleDiscountChange = (event) => {
    setDiscountCode(event.target.value);
    // التحقق من كود الخصم سيتم في handleNext

    if (couponStatus !== "check") {
      setCouponStatus("check");
      setValidDiscountCode(null);
    }
  };

  const handlePlanSelect = (plan) => {
    if (selectedPlan && selectedPlan.plan.id === plan.id) {
      // إلغاء اختيار الباقة إذا تم النقر عليها مرة أخرى
      setSelectedPlan(null);
      dispatch(updatePersonalData({ pricing_id: "", pricing_way: "" }));
    } else {
      // اختيار باقة واحدة فقط
      setSelectedPlan({ plan, pricingWay: "" });
      dispatch(updatePersonalData({ pricing_id: plan.id, pricing_way: "" }));
    }
  };

  const handlePricingWayChange = (planId, pricingWay) => {
    if (selectedPlan && selectedPlan.plan.id === planId) {
      setSelectedPlan({ ...selectedPlan, pricingWay });
      dispatch(updatePersonalData({ pricing_way: pricingWay }));
    }
  };

  const calculateTotals = () => {
    if (!selectedPlan || !selectedPlan.pricingWay) {
      return { subTotal: 0, addOns: 0, tax: 0, discounts: 0, total: 0 };
    }

    const { plan, pricingWay } = selectedPlan;
    const price =
      pricingWay === "monthly"
        ? parseFloat(plan.monthly_price)
        : parseFloat(plan.yearly_price);
    const subTotal = price || 0;

    // حساب addOns بناءً على عدد الفروع
    let addOns = 0;
    if (branches.length > 1) {
      addOns = (subTotal / 2) * (branches.length - 1); // إضافة نصف سعر الباقة إذا كان هناك أكثر من فرع
    }

    const tax = 0; // يمكن تعديله حسب الحاجة
    // التحقق الآمن من discounts
    const discountValue = validDiscountCode
      ? ((subTotal + addOns) * validDiscountCode.discount) / 100
      : 0;
    const total = subTotal + addOns + tax - discountValue;

    return { subTotal, addOns, tax, discounts: discountValue, total };
  };

  const totals = calculateTotals();
  const totalPrice = totals.total; // تخزين إجمالي السعر في متغير totalPrice

  const handleNext = () => {
    if (!selectedPlan) {
      toast.error(t("pleaseSelectPlan"));
      return;
    }
    if (!selectedPlan.pricingWay) {
      toast.error(t("pleaseSelectPricingWay"));
      return;
    }

    // التحقق من كود الخصم
    if (couponStatus === "correct") {
      dispatch(updatePersonalData({ discount_id: validDiscountCode }));
    } else {
      dispatch(updatePersonalData({ discount_id: null }));
    }

    navigate("/save");
  };

  // عرض حالة التحميل أثناء جلب البيانات
  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "50px" }}>
        <Typography variant="h6">{t("loading")}</Typography>
      </Box>
    );
  }

  return (
    <Box
      marginTop={"50px"}
      flexGrow={1}
      sx={{
        minHeight: "calc(100vh - 50px )", // full viewport height
        display: "flex",
        flexDirection: "column",
        flex: 1, // 👈 fills remaining width
      }}
    >
      <Typography
        variant="body1"
        sx={{ marginInlineStart: "50px", fontSize: "18px" }}
      >
        {t("payment")}
      </Typography>
      <Divider marginInlineStart={"50px"} />

      <Box
        className="here the div"
        marginInlineStart={"50px"}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1, // 👈 fills remaining width
          minHeight: "100%",
        }}
      >
        <Grid
          container
          spacing={1}
          sx={{ width: "100%", minHeight: "300px", justifyContent: "start" }}
        >
          {Array.isArray(pricing) &&
            pricing.map((plan) => (
              <Grid item xs={12} sm={6} md={2} key={plan.id}>
                <PricingCard
                  title={plan.name}
                  pricePerMonth={plan.monthly_price}
                  pricePerYear={plan.yearly_price}
                  orders={plan.orders_limit}
                  buttonText={t("select")}
                  isSelected={selectedPlan && selectedPlan.plan.id === plan.id}
                  onSelect={() => handlePlanSelect(plan)}
                  onPricingWayChange={(pricingWay) =>
                    handlePricingWayChange(plan.id, pricingWay)
                  }
                  pricingWay={
                    selectedPlan && selectedPlan.plan.id === plan.id
                      ? selectedPlan.pricingWay
                      : ""
                  }
                />
              </Grid>
            ))}
        </Grid>
        <Box sx={{ height: "15px" }}></Box>
        {/* section2 calc & discount */}
        <Box
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          <CalculationCard totals={totals} totalPrice={totalPrice} />

          <DiscountSection
            discountCode={discountCode}
            handleDiscountChange={handleDiscountChange}
            handleChange={handleChange}
            selectedValue={selectedValue}
            handleCheckCoupon={handleCheckCoupon}
            couponStatus={couponStatus}
          />
        </Box>
        {/* section 3 pay button */}
        <Grid container className="mt-auto">
          <Button
            variant="contained"
            sx={{
              width: "40%",
              fontSize: "13px",
              borderRadius: "50px",
              backgroundColor: theme.palette.orangePrimary.main,
              textTransform: "none",
              padding: "6px 0",
              marginX: "auto",
              marginY: "2rem",
              "&:hover": { backgroundColor: theme.palette.orangePrimary.main },
              color: "#fff",
            }}
            onClick={handleNext}
          >
            {t("pay")}
          </Button>
        </Grid>
      </Box>
    </Box>
  );
};

const CalculationCard = ({ totals, totalPrice }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const items = [
    [t("subTotal"), totals.subTotal.toFixed(2)],
    [t("addOns"), totals.addOns.toFixed(2)],
    [t("tax"), totals.tax.toFixed(2)],
    [t("discounts"), totals.discounts.toFixed(2)],
    [t("total"), totalPrice.toFixed(2)],
  ];

  const longestLabelLength = Math.max(...items.map(([label]) => label.length));
  const longestValueLength = Math.max(
    ...items.map(([, value]) => value.length)
  );

  const labelWidth = `${longestLabelLength + 2}ch`; // add buffer
  const valueWidth = `${longestValueLength + 5}ch`;

  return (
    <Box
      sx={{
        width: "fit-content",
        fontFamily: "monospace",
      }}
    >
      {items.map(([label, value], index) => (
        <Box key={label}>
          {index === items.length - 1 && (
            <Box
              sx={{
                width: `calc(${labelWidth} + ${valueWidth})`,
                height: "2px",
                backgroundColor: (theme) => theme.palette.orangePrimary.main,
                borderRadius: "20px",
                mb: 1,
                ml: 0, // aligned with label start
              }}
            />
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `${labelWidth} ${valueWidth}`,
              alignItems: "center",
              mb: 0.5,
            }}
          >
            <Typography
              sx={{
                textAlign: "right",
                pr: 1,
                color: theme.palette.text.fixedGray,
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{
                textAlign: "left",
                color:
                  index === items.length - 1
                    ? theme.palette.text.fixedDarkOrange
                    : theme.palette.mode === "light"
                    ? theme.palette.text.fixedDarkBlue
                    : theme.palette.text.fixedWhite,
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  fontWeight: "bold",
                }}
              >
                {value}
                <Box
                  component="span"
                  sx={{
                    fontSize: "0.6rem",
                    ml: 0.5,
                  }}
                >
                  EGP
                </Box>
              </Box>
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const DiscountSection = ({
  discountCode,
  handleDiscountChange,
  handleChange,
  selectedValue,
  handleCheckCoupon,
  couponStatus,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const UncheckedIcon = styled("span")(({ theme }) => ({
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: "2px solid gray",
    display: "inline-block",
  }));

  const CheckedIcon = styled("span")(({ theme }) => ({
    width: 16,
    height: 16,
    borderRadius: "50%",
    backgroundColor: theme.palette.orangePrimary.main,
    display: "inline-block",
  }));

  return (
    <Box sx={{ marginTop: "30px" }}>
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: { lg: "220px", md: "100%", xs: "100%" } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "end",
              gap: ".5rem",
            }}
          >
            <Box>
              <Typography sx={{ fontSize: "9px", textAlign: "start" }}>
                {t("disCode")}
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                value={discountCode}
                onChange={handleDiscountChange}
                sx={{
                  width: "70px",
                  "& .MuiOutlinedInput-root": { height: "26px" },
                }}
              />
            </Box>
            <Box position={"relative"} sx={{ display: "flex", gap: 1 }}>
              {couponStatus === "correct" && (
                <IconButton
                  sx={{
                    margin: "0px",
                    padding: "0px",
                    position: "relative",
                    bottom: "0px",
                    fontWeight: "bold",
                  }}
                >
                  <DoneIcon
                    sx={{
                      width: "21px",
                      height: "21px",
                      color: theme.palette.orangePrimary.main,
                    }}
                  />
                </IconButton>
              )}
              {couponStatus === "wrong" && (
                <IconButton
                  onClick={() =>
                    handleDiscountChange({ target: { value: "" } })
                  }
                  sx={{
                    margin: "0px",
                    padding: "0px",
                    position: "relative",
                    bottom: "0px",
                  }}
                >
                  <span
                    className="icon-close-1"
                    style={{
                      width: "15px",
                      height: "15px",
                      fontSize: "15px",
                      color: "red",
                    }}
                  ></span>
                </IconButton>
              )}

              {couponStatus === "check" && (
                <IconButton
                  onClick={handleCheckCoupon}
                  sx={{
                    margin: "0px",
                    padding: "0px",
                    position: "relative",
                    bottom: "0px",
                  }}
                >
                  <SendHorizontal />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>

        <RadioGroup
          defaultValue="cash"
          className="problem here"
          sx={{
            width: "100%",
            mt: 1,
            flexDirection: "column",
            gap: 2,
            alignItems: "start",
          }}
          onChange={handleChange}
        >
          <FormControlLabel
            sx={{ color: "gray", fontSize: "11px" }}
            value="cash"
            control={
              <Radio
                size="small"
                icon={<UncheckedIcon />}
                checkedIcon={<CheckedIcon />}
                sx={{
                  color:
                    selectedValue === "cash"
                      ? theme.palette.orangePrimary.main
                      : "gray",
                  "&.Mui-checked": { color: theme.palette.orangePrimary.main },
                }}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Cash sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: "12px", color: "gray" }}>
                  {t("cashOrCard")}
                </Typography>
              </Stack>
            }
          />
          <FormControlLabel
            sx={{ color: "gray", fontSize: "11px", mt: "-8px" }}
            value="wallet"
            control={
              <Radio
                size="small"
                icon={<UncheckedIcon />}
                checkedIcon={<CheckedIcon />}
                sx={{
                  color:
                    selectedValue === "wallet"
                      ? theme.palette.orangePrimary.main
                      : "gray",
                  "&.Mui-checked": { color: theme.palette.orangePrimary.main },
                }}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Wallet sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: "12px", color: "gray" }}>
                  {t("onlinePayment")}
                </Typography>
              </Stack>
            }
          />
        </RadioGroup>
      </Box>
    </Box>
  );
};
