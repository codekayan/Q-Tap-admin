import { Typography, Box, useTheme, Grid, styled } from "@mui/material";
import { SetupPage } from "../../Component/Business-info/SetupPage";
import Language from "../../Component/dashboard/TopBar/Language";
import { useTranslation } from "react-i18next";
import SupportChat from "../../Component/chat/SupportChat";

const EditBusinessInfoLayout = ({ children }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const Divider = styled(Box)({
    width: "5%",
    height: "3px",
    backgroundColor: theme.palette.orangePrimary.main,
    borderRadius: "20px",
    marginBottom: "20px",
  });
  return (
    <Grid
      container
      sx={{
        backgroundSize: "100% 100%",
        width: "100%",
        minHeight: "100vh",
        backgroundImage:
          theme.palette.mode === "light"
            ? "url(/images/Rectangle.png)"
            : undefined,
        backgroundColor:
          theme.palette.mode === "light"
            ? undefined
            : theme.palette.background.default,
      }}
    >
      <SetupPage />

      <Grid item xs={12} md={8}>
        <Box
          sx={{
            position: "absolute",
            top: "calc(1rem + 7px)",
            insetInlineEnd: "1rem",
            zIndex: "",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <SupportChat />
          <Language />
        </Box>
        <Box
          marginTop={"50px"}
          sx={{
            paddingBlockStart: "20px", // top padding
            paddingInlineStart: "40px", // left in LTR, right in RTL
          }}
          style={{}}
        >
          <Typography variant="body1" sx={{ fontSize: "18px" }}>
            {t("busnessInfo")}
          </Typography>
          <Divider />
          {children}
        </Box>
      </Grid>
    </Grid>
  );
};

export default EditBusinessInfoLayout;
