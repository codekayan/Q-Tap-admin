
import React, { useEffect, useState } from 'react';
import { Box, Menu, MenuItem, Divider, useTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { useTranslation } from 'react-i18next';


export const Language = () => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const open = Boolean(anchorEl);
    const { i18n } = useTranslation()

    useEffect(() => {
        setSelectedLanguage(i18n.language)
        if (i18n.language === 'en')
            document.documentElement.dir = 'ltr';
        else
            document.documentElement.dir = 'rtl';
    }, [i18n.language])
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);

    };

    const handleClose = (language) => {
        if (language) {
            i18n.changeLanguage(language)
            setSelectedLanguage(language);
            document.documentElement.lang = language;
            if (language === 'en')
                document.documentElement.dir = 'ltr';
            else
                document.documentElement.dir = 'rtl';
        }
        setAnchorEl(null);
    };


    const getLanguageIcon = () => {
        if (selectedLanguage === 'ar') {
            return <span className="icon-translation" style={{ width: "22px", color: theme.palette.orangePrimary.main, height: "22px", }}></span>

        } else if (selectedLanguage === 'en') {
            return <LanguageOutlinedIcon sx={{ width: "22px", color: theme.palette.orangePrimary.main, height: "22px", }} />
        }
        return <LanguageOutlinedIcon sx={{ fontSize: "22px", color: theme.palette.orangePrimary.main, marginRight: '1px' }} />;
    };

    return (
        <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center", marginInlineEnd: "20px" }} >
            <Box onClick={handleClick} sx={{ display: "flex", alignItems: "center" }}>
                {getLanguageIcon()}
                <KeyboardArrowDownIcon sx={{ fontSize: "15px", color: theme.palette.text.gray }} />
            </Box>

            <Menu disableScrollLock
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose(null)}
                sx={{ padding: "2px" }}

            >
                <MenuItem onClick={() => handleClose('en')} >
                    <LanguageOutlinedIcon sx={{ width: "25px", height: "25px", marginRight: '8px', color: "#ff9800" }} />

                    <span style={{ fontSize: "12px", color: theme.palette.text.gray }}>English</span>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleClose('ar')}>
                    <span className="icon-translation" style={{ width: "23px", height: "23px", marginRight: '8px', color: "#ff9800" }}></span>

                    <span style={{ fontSize: "12px", color: theme.palette.text.gray }}>Arabic</span>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Language;
