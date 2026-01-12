import { Box, Button, Radio, styled, Typography, useTheme } from "@mui/material";
import { FormControlLabel, RadioGroup } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { useTranslation } from "react-i18next";

export function PricingCard({ title, pricePerMonth, pricePerYear, orders, buttonText, isSelected, onSelect, onPricingWayChange, pricingWay }) {
  const { t } = useTranslation();
  const theme = useTheme();

  const Divider = styled(Box)({
    width: '60%',
    height: '1px',
    backgroundColor: theme.palette.orangePrimary.main,
    borderRadius: "20px",
    marginBottom: "10px",
    marginLeft: "25px",
  });

  const handleClick = () => {
    onSelect();
  };

  const handlePricingWayChange = (event) => {
    const newPricingWay = event.target.value;
    onPricingWayChange(newPricingWay); // Pass pricingWay to parent
  };

  // عرض السعر بناءً على pricingWay
  const displayPrice = pricingWay === 'yearly' ? pricePerYear : pricePerMonth;
  const priceLabel = pricingWay === 'yearly' ? t("year") : t("month");

  return (
    <Box sx={{ minWidth: "130px", minHeight: "200px" }}>
      <Box sx={{ width: "90px", borderRadius: "20px", textAlign: "center", color: "#fff", position: "relative", top: "15px",  mx: "auto",  }}>
        <Typography variant="body1" sx={{ backgroundColor: theme.palette.orangePrimary.main, borderRadius: "20px", padding: "5px 6px", fontSize: "12px" }}>
          {title}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: "90%", height: "100%", borderRadius: "20px", backgroundColor: theme.palette.secondaryColor.main, textAlign: "center", color: "#fff" }}>
          <Box sx={{ padding: "10px 0px" }}>
            <Typography variant="body1" sx={{ margin: "15px 0", fontSize: "10px" }}>
              <sup style={{ color: theme.palette.orangePrimary.main, fontSize: "8px", margin: "0px 5px 0px 0px" }}>EGP</sup>
              <span style={{ fontSize: "18px" }}>{pricePerMonth}</span>/{t("month")}
            </Typography>

            <Divider />

            <Typography variant="body1" sx={{ margin: "15px 0", fontSize: "10px" }}>
              <sup style={{ color: theme.palette.orangePrimary.main, fontSize: "8px", margin: "0px 5px 0px 0px" }}>EGP</sup>
              <span style={{ fontSize: "18px" }}>{pricePerYear}</span>/{t("year")}
            </Typography>
          </Box>
          <Box sx={{ backgroundColor: theme.palette.orangePrimary.main, height: "50px", justifyContent: "center", display: "flex", alignItems: "center", borderRadius: "0px 0px 20px 20px" }}>
            <Typography variant="body2" sx={{ color: "white", fontSize: "12px" }}>
              <span style={{ color: theme.palette.secondaryColor.main, fontSize: "1.5rem" ,fontWeight:'bold' }}>{orders}</span>
              {t("order")}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={handleClick}
          sx={{
            width: { lg: "60%", md: "30%", xs: "30%" },
            marginTop: "10px",
            padding: "1px",
            marginLeft: { lg: "10px", md: "0" },
            borderRadius: "50px",
            color:theme.palette.text.fixedWhite, 
            backgroundColor: isSelected ? theme.palette.orangePrimary.main : theme.palette.secondaryColor.main,
            textTransform: "capitalize",
            fontSize: "11px",
            '&:hover': { backgroundColor: isSelected ? theme.palette.orangePrimary.main : theme.palette.secondaryColor.main },
          }}
        >
          {buttonText}
        </Button>

        <RadioGroup
          row
          sx={{ width: "200px", marginTop: "5px", display: 'flex', justifyContent: 'center' }}
          value={pricingWay}
          onChange={handlePricingWayChange}
          disabled={!isSelected} // تعطيل إلا إذا تم اختيار الباقة
        >
          <Box>
            <FormControlLabel
              value="monthly"
              control={
                <Radio
                  icon={<CircleOutlinedIcon style={{ color: "#AAAAAA", fontSize: "15px" }} />}
                  checkedIcon={<CircleIcon style={{ color: theme.palette.orangePrimary.main, fontSize: "15px" }} />}
                  disabled={!isSelected}
                />
              }
              label={<Typography sx={{ color: "#AAAAAA", fontSize: "11px" }}>{t("monthly")}</Typography>}
            />
          </Box>
          <Box>
            <FormControlLabel
              value="yearly"
              control={
                <Radio
                  icon={<CircleOutlinedIcon style={{ color: "#AAAAAA", fontSize: "15px" }} />}
                  checkedIcon={<CircleIcon style={{ color: theme.palette.orangePrimary.main, fontSize: "15px" }} />}
                  disabled={!isSelected}
                />
              }
              label={<Typography sx={{ color: "#AAAAAA", fontSize: "11px" }}>{t("yearly")}</Typography>}
            />
          </Box>
        </RadioGroup>
      </Box>
    </Box>
  );
}