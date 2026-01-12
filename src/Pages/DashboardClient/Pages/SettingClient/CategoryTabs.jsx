import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import ProfilePage from './ProfilePage';
import { Box, useTheme } from '@mui/system';
import Payment from './Payment';
import { Share } from './Share';
import Menu from './Menu';
import { Tables } from './Tables';
import { Delivery } from './delivery/Delivery';
import RoomServiceOutlinedIcon from '@mui/icons-material/RoomServiceOutlined';
import { useTranslation } from 'react-i18next';
import ProfilePageNew from './ProfilePageNew';
//TODO: navigate button styling
const CategoryTabs = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [buttons, setButtons] = useState([
        {
            name: 'profile', label: 'Profile',
            icon: <PersonOutlineOutlinedIcon />,
            // content: <ProfilePage />, 
            content: <ProfilePageNew />, 
            selected: true
        },

        {
            name: 'menu', label: 'Menu',
            icon: <RoomServiceOutlinedIcon sx={{ fontSize: "26px" }} />,
            content: <Menu />, selected: false
        },

        {
            name: 'payment', label: 'payment',
            // icon: <span class="icon-chair" style={{fontSize:"20px"}}></span>,
            icon: <CreditCardOutlinedIcon sx={{ fontSize: "23px" }} />,
            content: <Payment />, selected: false
        },

        {
            name: 'tables', label: 'tables',
            icon: <span class="icon-chair" style={{ fontSize: "20px" }}></span>,
            content: <Tables />, selected: false
        },

        {
            name: 'Delivery', label: 'Delivery',
            icon: <span class="icon-scooter-1"></span>,
            content: <Delivery />, selected: false
        },

        {
            name: 'share', label: 'share',
            icon: <span class="icon-send-1" ></span>,
            content: <Share />, selected: false
        },

    ]);

    const handleButtonClick = (clickedButtonName) => {
        const updatedButtons = buttons.map((button) => ({
            ...button,
            selected: button.name === clickedButtonName,
        }));
        setButtons(updatedButtons);
    };

    const activeContent = buttons.find(button => button.selected)?.content;

    return (
        <Box>
            <Box display="flex" flexDirection="column" alignItems="Start">
                <Box
                    display='grid'
                    gridTemplateColumns='repeat(auto-fit, minmax(80px, 1fr))'
                    gap={1}
                    width={{ xs: "100%", sm: "75%" }} // Adjust width for small screens
                >
                    {buttons.map((button) => (
                        <Button
                            key={button.name}
                            onClick={() => handleButtonClick(button.name)}
                            style={{
                                backgroundColor: button.selected ? theme.palette.orangePrimary.main : 'transparent',
                                color: button.selected ? 'white' : '#575756',
                                marginRight: '8px',
                                textTransform: "capitalize",
                                border: button.selected ? "none" : "1px solid #AAAAAA",
                                borderRadius: "6px",
                                padding: "3px 20px",
                            }}
                        >
                            {React.cloneElement(button.icon, {
                                style: { color: button.selected ? 'white' : '#AAAAAA', fontSize: "18px", marginRight: '5px' }
                            })}
                            <Typography sx={{ fontSize: "12px", }}>{t(button.label)} </Typography>
                        </Button>
                    ))}
                </Box>
            </Box>
            <Box>
                {activeContent}
            </Box>
        </Box>
    );
};

export default CategoryTabs;
