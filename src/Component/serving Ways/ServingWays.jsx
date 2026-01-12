import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import TableBarOutlinedIcon from "@mui/icons-material/TableBarOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import styles from "../../Pages/DashboardClient/Pages/SupportClient/supportCard.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  updateBusinessData,
  addBranch,
  selectBranch,
  clearBusinessData,
  setBranches,
} from "../../store/register/businessSlice";
import useBranchStore from "../../store/zustand-store/register-client-branch-store";
import { useSearchParams } from "react-router-dom";

export const ServingWays = () => {
  const theme = useTheme();
  const Divider = styled(Box)({
    width: "5%",
    height: "3px",
    backgroundColor: theme.palette.orangePrimary.main,
    borderRadius: "20px",
    marginBottom: "20px",
  });

  const Divider2 = styled(Box)({
    width: "60%",
    height: "1px",
    backgroundColor: theme.palette.orangePrimary.main,
    borderRadius: "20px",
    marginBottom: "20px",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const branchesStore = useBranchStore((state) => state.branches);
  const updateBranch = useBranchStore((state) => state.updateBranch);
  const [searchParams] = useSearchParams();
  const index = searchParams.get("index");

  console.log(branchesStore);
  const currentBranchIndex = index === "-1" ? branchesStore?.length - 1 : index;
  const currentBranch = branchesStore?.[currentBranchIndex];

  const { t } = useTranslation();

  // Initialize serviceOptions with selected state based on businessData.servingWays
  const [serviceOptions, setServiceOptions] = useState([
    {
      name: "Dine In",
      value: "dine_in",
      icon: <span className="icon-chair" style={{ fontSize: "80px" }}></span>,
      selected: currentBranch?.servingWays?.includes("dine_in") || false,
    },
    {
      name: "Takeaway",
      value: "take_away",
      icon: (
        <span className="icon-takeaway" style={{ fontSize: "80px" }}></span>
      ),
      selected: currentBranch?.servingWays?.includes("take_away") || false,
    },
    {
      name: "Delivery",
      value: "delivery",
      icon: (
        <span
          className="icon-fast-shipping"
          style={{ fontSize: "80px" }}
        ></span>
      ),
      selected: currentBranch?.servingWays?.includes("delivery") || false,
    },
  ]);

  const handleBoxClick = (servingIndex) => {
    // Toggle the selected state of the clicked service
    const newOptions = serviceOptions.map((option, i) => ({
      ...option,
      selected: i === servingIndex ? !option.selected : option.selected,
    }));
    const serviceValue = serviceOptions[servingIndex].value;

    const updatedBranch = {
      ...currentBranch,
      servingWays: currentBranch?.servingWays
        ? currentBranch.servingWays.includes(serviceValue)
          ? currentBranch.servingWays.filter((item) => item !== serviceValue) // remove if exists
          : [...currentBranch.servingWays, serviceValue] // add if not exists
        : [serviceValue], // initialize if empty
    };
    if (!updatedBranch?.servingWays?.includes("dine_in")) {
      updatedBranch.numberOfTable = null;
    }
    // Call updater
    updateBranch(currentBranchIndex, updatedBranch);
    setServiceOptions(newOptions);
  };

  const handleTableCountChange = (value) => {
    const updatedBranch = {
      ...currentBranch,
      numberOfTable: value,
    };
    updateBranch(currentBranchIndex, updatedBranch);
  };

  const handleNextClick = () => {
    if (
      currentBranch?.servingWays?.includes("dine_in") &&
      (currentBranch?.numberOfTable === "" || !currentBranch?.numberOfTable)
    ) {
      toast.error("must select number of table");
    } else {
      navigate("/branches");
    }
  };

  return (
    <Box
      marginTop={"50px"}
      padding={"10px 40px"}
      display={"flex"}
      flexDirection={"column"}
      flexGrow={1}
    >
      <Typography
        variant="body1"
        sx={{ fontSize: "18px", color: theme.palette.text.black_white }}
      >
        {t("busnessInfo")}
      </Typography>
      <Divider />

      <Box
        sx={{
          marginTop: "70px",
          marginInlineStart: "50px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
          <span
            className="icon-waiter"
            style={{ color: "grey", marginRight: "6px" }}
          ></span>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "12px", md: "12px" }, color: "gray" }}
          >
            {t("servingWay")}
          </Typography>
        </Box>

        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="flex-start"
          gap={2}
          sx={{ marginBottom: 4 }}
        >
          {serviceOptions.map((option, index) => (
            <Box
              className={styles.card4}
              key={index}
              onClick={() => handleBoxClick(index)}
              sx={{
                width: { xs: "115px", sm: "115px" },
                marginInlineEnd: "20px",
                height: "160px",
                borderRadius: "20px",
                backgroundColor: theme.palette.secondaryColor.main,
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: "13px",
                  color: theme.palette.orangePrimary.main,
                  paddingBlock: "20px 2px", // top + bottom
                  paddingInline: "4px", // left + right (auto flips in rtl)
                  textAlign: "center", // centers text
                  wordBreak: "break-word", // breaks long words if needed
                  whiteSpace: "normal", // allows wrapping
                }}
              >
                {t(option.name)}
              </Typography>
              <Divider2 />
              <Box
                sx={{
                  color: "gray",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "end",
                  marginInlineEnd: "-5%", // flips correctly in LTR/RTL
                }}
              >
                {React.cloneElement(option.icon)}
              </Box>
              {option.selected && (
                <CheckOutlinedIcon
                  sx={{
                    position: "absolute",
                    bottom: "20px",
                    insetInlineStart: "10%",
                    fontSize: "23px",
                    color: "#FF7F3F",
                  }}
                />
              )}
            </Box>
          ))}
        </Box>

        {currentBranch?.servingWays?.includes("dine_in") && (
          <FormControl
            variant="outlined"
            fullWidth
            sx={{ marginTop: 4, maxWidth: { xs: "100%", sm: 330 } }}
          >
            <Select
              value={currentBranch?.numberOfTable || ""}
              onChange={(e) => handleTableCountChange(e.target.value)}
              displayEmpty
              sx={{
                border: "1px solid gray",
                height: "35px",
                fontSize: "11px",
                borderRadius: "10px",
                "& fieldset": { border: "none" },
              }}
              startAdornment={
                <InputAdornment position="start">
                  <TableBarOutlinedIcon sx={{ fontSize: "19px" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="" disabled>
                {t("HowManyTablesDoYouHave") + t("optional")}
              </MenuItem>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((number) => (
                <MenuItem key={number} value={number.toString()}>
                  {number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Grid
          item
          xs={12}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"end"}
          className="hereProblem"
        >
          <Button
            variant="contained"
            sx={{
              width: { xs: "50%", md: "20%" },
              fontSize: "13px",
              borderRadius: "50px",
              backgroundColor: theme.palette.orangePrimary.main,
              textTransform: "none",
              padding: "6px 15px",
              // position: "fixed",
              // bottom: "30px",
              // left: { xs: '25%', md: '54%' },
              "&:hover": { backgroundColor: theme.palette.orangePrimary.main },
              color: "#fff",
            }}
            onClick={handleNextClick}
          >
            {t("next")}
            <TrendingFlatIcon sx={{ marginLeft: "8px", fontSize: "18px" }} />
          </Button>
        </Grid>
      </Box>
    </Box>
  );
};
