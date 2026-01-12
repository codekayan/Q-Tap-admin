

import ListIcon from '@mui/icons-material/List';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

import GridViewIcon from '@mui/icons-material/GridView';

import NightlightIcon from '@mui/icons-material/Nightlight';
import { useTheme } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { Box, FormControl, FormHelperText, Grid, styled, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';

const ModeAndDesignBox = ({ control, errors }) => {

    const theme = useTheme()
    const { t } = useTranslation()
    const Divider = styled (Box)({
        width: '5%',
        height: '3px',
        backgroundColor: theme.palette.orangePrimary.main,
        borderRadius: "20px",
        marginBottom: "20px"
    });
    return (
        <Box sx={{ marginTop: "6px", display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
            <Grid container direction="column" spacing={1} sx={{ marginLeft: "2px" }}>
                <Typography
                    variant="body2"
                    sx={{ fontSize: "14px", fontWeight: "500", color: "#AAAAAA", textAlign: "start", marginBottom: "4px" }}
                >
                    {t("defaultMode")}
                </Typography>

                <FormControl error={!!errors.mode}>
                    <Controller
                        name="mode"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <ToggleButtonGroup
                                value={field.value}
                                exclusive
                                onChange={(e, newValue) => {
                                    if (newValue !== null) field.onChange(newValue);
                                }}
                                sx={{ display: "flex", justifyContent: "space-between" }}
                            >
                                <ToggleButton
                                    value="white"
                                    sx={{
                                        padding: "12px",
                                        backgroundColor: field.value === "white" ? theme.palette.orangePrimary.main : "transparent",
                                        border: `1px solid ${field.value === "white" ? theme.palette.orangePrimary.main : "#AAAAAA"} !important`,
                                        borderRadius: "8px !important",
                                        marginRight: "8px",
                                    }}
                                >
                                    <WbSunnyIcon
                                        sx={{ fontSize: "35px", color: field.value === "white" ? theme.palette.orangePrimary.main : "#AAAAAA" }}
                                    />
                                </ToggleButton>
                                <ToggleButton
                                    value="dark"
                                    sx={{
                                        padding: "12px",
                                        backgroundColor: field.value === "dark" ? theme.palette.orangePrimary.main : "transparent",
                                        border: `1px solid ${field.value === "dark" ? theme.palette.orangePrimary.main : "#AAAAAA"} !important`,
                                        borderRadius: "8px !important",
                                    }}
                                >
                                    <NightlightIcon
                                        sx={{ fontSize: "35px", color: field.value === "dark" ? theme.palette.orangePrimary.main : "#AAAAAA" }}
                                    />
                                </ToggleButton>
                            </ToggleButtonGroup>)}
                    />
                    <FormHelperText>{errors.mode?.message}</FormHelperText>
                </FormControl>
            </Grid>
            <Divider
                orientation="vertical"
                flexItem
                sx={{
                    height: "40px",
                    width: "2px",
                    backgroundColor: theme.palette.orangePrimary.main,
                    margin: "auto 20px",
                }}
            />
            <Grid container direction="column" spacing={1}>
                <Typography
                    variant="body2"
                    sx={{ fontSize: "14px", fontWeight: "500", color: "#AAAAAA", textAlign: "start", marginBottom: "4px" }}
                >
                    {t("menus.design")}
                </Typography>

                <FormControl error={!!errors.design}>
                    <Controller
                        name="design"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <ToggleButtonGroup
                                value={field.value}
                                exclusive
                                onChange={(e, newValue) => {
                                    if (newValue !== null) field.onChange(newValue);
                                }}
                                sx={{ display: "flex", justifyContent: "space-between" }}
                            >
                                <ToggleButton
                                    value="grid"
                                    sx={{
                                        padding: "12px",
                                        backgroundColor: field.value === "grid" ? theme.palette.orangePrimary.main : "transparent",
                                        border: `1px solid ${field.value === "grid" ? theme.palette.orangePrimary.main : "#AAAAAA"} !important`,
                                        borderRadius: "8px !important",
                                        marginLeft: "8px",
                                    }}
                                >
                                    <GridViewIcon
                                        sx={{ fontSize: "35px", color: field.value === "grid" ? theme.palette.orangePrimary.main : "#AAAAAA" }}
                                    />
                                </ToggleButton>
                                <ToggleButton
                                    value="list"
                                    sx={{
                                        padding: "12px",
                                        backgroundColor: field.value === "list" ? theme.palette.orangePrimary.main : "transparent",
                                        border: `1px solid ${field.value === "list" ? theme.palette.orangePrimary.main : "#AAAAAA"} !important`,
                                        borderRadius: "8px !important",
                                    }}
                                >
                                    <ListIcon
                                        sx={{ fontSize: "35px", color: field.value === "list" ? theme.palette.orangePrimary.main : "#AAAAAA" }}
                                    />
                                </ToggleButton>
                            </ToggleButtonGroup>)}
                    />
                    <FormHelperText>{errors.design?.message}</FormHelperText>
                </FormControl>
            </Grid>
        </Box>
    )
}

export default ModeAndDesignBox;