import React, { useEffect } from 'react'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useColorMode } from '../context/ThemeModeProvider'
import { Box, useTheme } from '@mui/system';
import { Switch } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectBranchById, selectSelectedBranch } from '../store/client/clientAdmin';
const DarkModeSwitch = () => {
    const { toggleColorMode, mode } = useColorMode();
    const theme = useTheme();
    const selectedBranchID = useSelector(selectSelectedBranch)
    const selectedBranch = useSelector(selectBranchById(selectedBranchID))
  

    useEffect(() => {
        document.body.classList.toggle('dark', mode === 'dark');
        document.body.classList.toggle('light', mode === 'light');
    }, [mode]);

    useEffect(() => {
        // "dark" or "white" api
        // mode lib "dark"  or "light" 
        const defaultModeOfBranch = selectedBranch?.default_mode
        if (defaultModeOfBranch === "white" && mode === "dark") {
            toggleColorMode()
        } if (defaultModeOfBranch === "dark" && mode === "light") {
            toggleColorMode()
        }
    }, [selectedBranch?.default_mode])
    return (
        <Box sx={{ display: "flex", justifyContent: "center", textAlign: "center", alignItems: "center" }}>
            <LightModeOutlinedIcon onClick={toggleColorMode}
                sx={{ fontSize: "20px", fill: mode === 'light' ? '#ff9800' : theme.palette.text.gray }} />

            <Switch
                checked={mode === 'dark'}
                onChange={toggleColorMode}
                sx={{
                    margin: "0px 0px !important",
                    padding: "0px",
                    // width: "100%",
                    // display: "flex",

                    alignItems: "center",
                    transform: 'scale(0.8)', // تصغير الحجم العام
                    '& .MuiSwitch-switchBase': {
                        padding: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        transition: 'transform 300ms ease',
                        '&.Mui-checked': {
                            transform: 'translate( 40px, -50%)', // adjust based on thumb size + track width
                            color: theme.palette.orangePrimary.main,
                        },
                    },
                    '& .MuiSwitch-thumb': {
                        width: "20px", // تصغير النقطة
                        height: "20px",
                        color: theme.palette.orangePrimary.main,
                    },
                    '& .MuiSwitch-track': {
                        borderRadius: 12,
                        height: 15,
                        width: "100%", // تصغير المسار
                    },
                    '& .MuiSwitch-switchBase.Mui-checked': {
                        color: theme.palette.orangePrimary.main,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: "#D8E0E0",
                    },
                }}
            />

            <DarkModeOutlinedIcon onClick={toggleColorMode}
                sx={{ fontSize: "20px", fill: mode === 'dark' ? '#ff9800' : '#575756' }} />
        </Box>
    )
}

export default DarkModeSwitch