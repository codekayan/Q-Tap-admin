import { Box, Grid, useTheme } from "@mui/material";
import { ServingWays } from './ServingWays'
import { SetupPage } from '../Business-info/SetupPage';
import Language from '../dashboard/TopBar/Language';
import SupportChat from "../chat/SupportChat";


export const ServingWaysPage = () => {
    const theme = useTheme()
    let isDarkMode = theme.palette.mode === "dark"
    return (
        <Grid container
            sx={{
                backgroundColor: theme.palette.bodyColor.white_333,
                backgroundImage: isDarkMode ? 'none' : 'url(/images/Rectangle.png)',
                backgroundSize: "100% 100%",
                width: "100%",
                minHeight: "100vh"
            }}
        >
            <SetupPage />

            <Grid item xs={12} md={8}  display={'flex'}>
                <Box sx={{
                    position: "absolute", top: "30px", insetInlineEnd: "80px",
                    cursor: "pointer", display: "flex", alignItems: "center"
                }}>
                    <SupportChat />

                    <Language />
                </Box>

                <ServingWays />
            </Grid>


        </Grid>

    )
}
