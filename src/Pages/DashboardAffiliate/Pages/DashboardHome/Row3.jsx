import React from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, useTheme } from '@mui/system';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DASHBOARD_SERVER_URL } from '../../../../utils/constants';

export const Row3 = ({code}) => {
    const  dashBoardServerUrl = DASHBOARD_SERVER_URL
    const invitationLink = `${dashBoardServerUrl}/?affiliate_code=${code}`;
    const theme = useTheme();
    const {t} = useTranslation();
    const copyToClipboard = () => {
        navigator.clipboard.writeText(invitationLink)
            .then(() => {
                alert(t("doneCopyInvetationLink"));
            })
            .catch((err) => {
                console.error('An error occurred while copying the link', err);
                alert(t("errorCopyInvetationLink"));
            });
    };
    return (
        <Box item xs={12} sx={{ flexGrow: 1, padding: '0px 20px 20px 20px' }}>
            <Box sx={{ display: "flex", marginBottom: "10px", color: "#555" }}>
                <span className="icon-link" style={{ marginRight: "6px", fontSize: "15px" }}></span>
                <Typography variant='body2' sx={{ fontSize: "13px", color:theme.palette.text.gray }}>{t("invitationLink")}</Typography>
            </Box>

            <Box display={"flex"}>
                <input
                    type="text"
                    value={invitationLink}
                    readOnly
                    style={{
                        flexGrow: 1,
                        padding: "15px",
                        borderRadius: "10px",
                        border: "none",
                        fontSize: "12px",
                        color: theme.palette.text.gray_light,
                        backgroundColor: theme.palette.bodyColor.secandary,
                        outline: "none",
                        marginRight: "10px",
                    }}
                />
                <Box
                    sx={{ color: "gray", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}
                    onClick={copyToClipboard}
                >
                    <ContentCopyIcon sx={{ fontSize: "26px" }} />
                </Box>
            </Box>
        </Box>
    );
};
