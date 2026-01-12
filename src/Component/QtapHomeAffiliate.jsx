import React, { useState } from 'react'
import { Box, Typography, useTheme, } from '@mui/material';
import { LoginAdmin } from './login/LoginAdmin';
import { useTranslation } from 'react-i18next';
import { LoginAffiliate } from './login/LoginAffiliate';

const QtapHomeAffiliate = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    return (
        <Box>


            <Box display="flex" justifyContent="center" >
                <img src="/assets/qtap.svg" alt="logo Qtap" style={{ width: "250px", height: "40px" }} />
            </Box>

            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                sx={{ margin:  "60px 0px 50px 0px"  }}

            >
                <Box
                    component="div"
                    sx={{
                        width: "30%",
                        textDecoration: 'none',
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            borderBottom: `3px solid ${theme.palette.orangePrimary.main}` ,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "11px",
                            color: theme.palette.text.blue,
                            paddingBottom: "10px",
                            cursor: "pointer",
                        }}
                    >
                        {t("logIn")}
                    </Typography>
                </Box>

                
            </Box>

            <Box >

                 <LoginAffiliate />

            </Box>

        </Box>
    );
};



export default QtapHomeAffiliate; 