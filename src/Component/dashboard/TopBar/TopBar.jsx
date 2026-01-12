import React from "react";
import { Box } from '@mui/system';
import { useLocation } from "react-router";
import Language from "./Language";
import { useTranslation } from "react-i18next";
import DarkModeSwitch from "../../DarkModeSwitch";
import { useTheme } from "@mui/system";
import { Typography } from "@mui/material";
import UserOptions from "../../UserOptions";

export default function TopBar() {
    const { t } = useTranslation();
    const theme = useTheme();
    const pageTitles = {
        '/dashboard-home': t("dashboard"),
        '/client': t("client"),
        '/wallet': t("wallet"),
        '/product-admin': t("product"),
        "/support": t("support"),
        '/pricing': t("pricing"),
        '/affiliate': t("affiliateMarketing"),
        "/setting": t("setting"),
        "/notification": t("notification"),
        "/feedback-admin": t("feedback"),
    };







    const location = useLocation();
    return (
        <Box sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "30px 60px 0px 60px ",
        }}>
            <Typography variant="body1" sx={{ fontSize: "20px", color: theme.palette.text.gray}}>
                {pageTitles[location.pathname] || 'Dashboard'}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                {/* light dark mode */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    <DarkModeSwitch />
                    <Language />
                </Box>

                {/* user option */}
                <UserOptions customSX={{ display: { xs: 'none', sm: "flex" } }} />

            </Box>
        </Box>
    );
}
