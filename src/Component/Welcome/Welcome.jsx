import React from 'react'
import { Box, Button, IconButton, Typography } from "@mui/material";
import { styled, useTheme } from '@mui/system';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebookF, faXTwitter, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from 'react-i18next';
import Language from '../dashboard/TopBar/Language';
import ModeCommentIcon from '@mui/icons-material/ModeComment';

export const Welcome = () => {
  const theme = useTheme();
  const Divider2 = styled(Box)({
    width: '20%',
    height: '5px',
    backgroundColor: theme.palette.orangePrimary.main,
    borderRadius: "20px",
    display: "flex",
    margin: "0 auto",
  });
  const { t } = useTranslation()


  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(to right, ${theme.palette.orangePrimary.main}, ${theme.palette.secondaryColor.main}), url(/images/Qtop1.jpg)`,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center 38%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      />
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ position: "absolute", left: "50px", top: "40px", }}>
          <IconButton onClick={() => navigate('/')}>
            <span class=" icon-home-icon-silhouette" style={{ color: "white", fontSize: "20px" }}></span>
          </IconButton>
        </Box>

        <Box sx={{
          position: "absolute", right: "50px", top: "40px", cursor: "pointer", display: "flex", alignItems: "center"
        }}>
          <ModeCommentIcon sx={{ fontSize: "22px", color: "#E57C00" , marginRight:"25px" }} />

          <Language />
        </Box>

      </Box>

      <Box
        sx={{
          position: "relative",
          color: "white",
          textAlign: "center",
          zIndex: 1,
        }}
      >

        <img src="/assets/qtapwhite.svg" alt="qtap" style={{ width: "200px", height: "60px", marginBottom: "40px" }} />

        {!sessionStorage.getItem("paymentUrl") ? <Typography variant="body2" sx={{ fontSize: "16px", maxWidth: "400px", lineHeight: 2, mb: 8 }}>
          {t("welcomeP1")}
        </Typography> : (<>
          <Typography variant="body2" sx={{ fontSize: "16px", width: "400px", lineHeight: 2, mb: 2 }}>
            {t("welcomeP3")}
          </Typography>
          <Button
            variant="contained"
            target='_blank'
            onClick={() => {
              const paymentUrl = sessionStorage.getItem("paymentUrl");
              if (paymentUrl) {
                window.open(paymentUrl, '_blank');
              } else {
                console.error("Invalid payment URL");
              }
            }}
            sx={{
              width: { lg: "300px", md: "200px", xs: "150px" },
              padding: "5px 20px",
              borderRadius: "50px",
              backgroundColor: theme.palette.orangePrimary.main,
              animation: "bounce 2s infinite",
              "@keyframes bounce": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-10px)" },
              },
              "&:hover": {
                backgroundColor: "#FF8C00",
              },
              margin: "20px 0 20px 0"
            }}>
            {t("welcomeBtn")}
          </Button>
        </>)


        }
        <Divider2 my={10} />

        <Typography variant="body2" sx={{ fontSize: "12px", mt: 2, mb: 2 }}>
          {t("welcomeP2")}
        </Typography>


        <Typography variant="body2" sx={{ fontSize: "13px", mb: 3, overflowWrap: 'anywhere' }}>
          <a href="mailto:your-email@example.com" style={{ color: theme.palette.text.fixedDarkOrange }}>
            sales@qtap.com</a>

          <a href="tel:+201234567890" style={{ color: theme.palette.text.fixedDarkOrange , padding: "0px 20px" }}>
            +201050727984</a>

          <a href="tel:+201234567890" style={{ color: theme.palette.text.fixedDarkOrange  }}>
            +201063879878</a>
        </Typography>

        <Box sx={{ display: "flex", textAlign: "center", justifyContent: "center", gap: "6px" }}>
          <IconButton sx={{ color: "#FFFFFF", fontSize: "16px", "&:hover": { color: theme.palette.text.fixedDarkOrange }, }}>
            <FontAwesomeIcon icon={faInstagram} />
          </IconButton>

          <IconButton sx={{ color: "#FFFFFF", fontSize: "16px", "&:hover": { color: theme.palette.text.fixedDarkOrange  }, }}>
            <FontAwesomeIcon icon={faFacebookF} />
          </IconButton>
          <IconButton sx={{ color: "#FFFFFF", fontSize: "16px", "&:hover": { color: theme.palette.text.fixedDarkOrange  }, }}>
            <FontAwesomeIcon icon={faXTwitter} />
          </IconButton>
          <IconButton sx={{ color: "#FFFFFF", fontSize: "16px", "&:hover": { color: theme.palette.text.fixedDarkOrange  }, }}>
            <FontAwesomeIcon icon={faTiktok} />
          </IconButton>

        </Box>

      </Box>
    </Box >
  );
}
