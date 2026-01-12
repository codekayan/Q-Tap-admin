
import { Typography } from '@mui/material'
import { Box, useTheme, } from '@mui/system'
import Lottie from 'lottie-react'
import React from 'react'

import waiter from '../../../../animation/waiter.json';
import { useTranslation } from 'react-i18next';

export const Alarm = () => {
    const {t} = useTranslation()
    const theme = useTheme();
    return (
        <>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "150px",
                    backgroundImage: `url('/images/alarm.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "150px",
                    }}
                >
                    {/* الصندوق الأول */}
                    <Box
                        sx={{
                            width: "33%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} textAlign={"center"}>
                            <div style={{ width: "90px", height: "90px" }}>
                                <Lottie animationData={waiter} loop={true} />
                            </div>
                        </Box>
                    </Box>

                    {/* الخط الرأسي */}
                    <Box
                        sx={{
                            width: "2px",
                            backgroundColor: "white",
                            height: "42%",  
                        }}
                    />

                    {/* الصندوق الثاني */}
                    <Box
                        sx={{
                            width: "33%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="body2" sx={{ color: "white", textAlign: "center" }}>
                            <span style={{ fontSize: "15px" }}>
                                T.<strong style={{ fontSize: "45px", marginLeft: "6px" }}>02</strong>
                            </span>
                            <Typography sx={{ fontSize: "8px", color: theme.palette.orangePrimary.main }}>{t("waiterNeeded")}</Typography>
                        </Typography>
                    </Box>
                </Box>

            </Box>
        </>

    )
}
