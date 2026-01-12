import React, { useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Box } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SouthIcon from '@mui/icons-material/South';
import CategoryForm from './AddCategory';
import { DiscountModel } from './DiscountModel';
import { OffersModel } from './OffersModel';
import { useTranslation } from 'react-i18next';
import { Add } from '@mui/icons-material';




export const AddButton = styled(Button)(({ theme })=>({
    background: `linear-gradient(45deg, ${theme.palette.gradient.yellow},${theme.palette.gradient.deepOrange})`,
    borderRadius: '25px',
    color: 'white',
    textTransform: 'none',
    padding: '5px 15px',
    marginLeft: '10px',
    fontSize: "12px",
    '&:hover': {
        background: `linear-gradient(45deg, ${theme.palette.gradient.yellow},${theme.palette.gradient.deepOrange})`

    },
}));

const ExportText = styled(Box)({
    color: 'white',
    marginLeft: '15px',
    cursor: 'pointer',
    fontSize: "12px",
});

const Header = () => {
    const theme = useTheme();
    const StyledAppBar = styled(AppBar)({
        background: `linear-gradient(to right, #b4650f, ${theme.palette.secondaryColor.main})`,
        padding: '8px 0px',
        overflowX:'auto',
        whiteSpace:'nowrap'
    });
    const StyledButton = styled(Button)({
        borderRadius: '25px',
        borderColor: 'white',
        color: 'white',
        marginLeft: '10px',
        textTransform: 'none',
        fontSize: "12px",
        '&:hover': {
            borderColor: theme.palette.orangePrimary.main,
        },
    });
    const [openCategory, setOpenCategory] = useState(false);
    const [openDiscount, setOpenDiscount] = useState(false);
    const [openOffers, setOpenOffers] = useState(false);


    const handleCategoryOpen = () => {
        setOpenCategory(true);
        setOpenDiscount(false);
        setOpenOffers(false);
    };

    const handleDiscountOpen = () => {
        setOpenDiscount(true);
        setOpenCategory(false);
        setOpenOffers(false);
    };

    const handleOffersOpen = () => {
        setOpenOffers(true);
        setOpenCategory(false);
        setOpenDiscount(false);
    };

    const handleClose = () => {
        setOpenCategory(false);
        setOpenDiscount(false);
        setOpenOffers(false);
    };
    const {t} = useTranslation();
    return (
        <StyledAppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton >
                    <span class="icon-eye" style={{ color: "white", fontSize: "25x", marginLeft: "30px" }} />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                    <StyledButton
                        variant="outlined"
                        sx={{ fontSize: "11px" }}
                        startIcon={<span class="icon-offer" style={{ color: theme.palette.orangePrimary.main, fontSize: "15px" }}></span>}
                        onClick={handleOffersOpen}
                    >
                        {t("specialOffers")}
                    </StyledButton>
                    <OffersModel open={openOffers} handleClose={handleClose} />

                    {/* زرار خصومات */}
                    <StyledButton
                        onClick={handleDiscountOpen}
                        variant="outlined"
                        sx={{ fontSize: "10px" }}
                        startIcon={<Add style={{ fontSize:"18px", fontWeight:"bold" , color :"white"}} />}
                    >
                        {t("discountCodes")}
                    </StyledButton>
                    <DiscountModel open={openDiscount} handleClose={handleClose} />

                    {/* زرار إضافةCategory*/}
                    <AddButton
                        onClick={handleCategoryOpen}
                        variant="contained"
                        sx={{ fontSize: "10px" }}
                        startIcon={<img src="/assets/add.svg" alt="add icon" style={{ width: "12px", height: "12px" }} />}
                    >
                        {t("addCategory")}
                    </AddButton>
                    
                    <CategoryForm open={openCategory} handleClose={handleClose} />

                    {/* زر تصدير واستيراد */}
                    <ExportText display={"flex"} alignItems={"center"} sx={{ fontSize: "11px" }}>
                        {t("export")} <KeyboardArrowRightIcon sx={{ fontSize: "18px", color: "#b4650f" }} />
                    </ExportText>
                    <ExportText display={"flex"} alignItems={"center"} sx={{ fontSize: "11px" }}>
                        {t("import")}<SouthIcon sx={{ fontSize: "14px", color: "#b4650f" }} />
                    </ExportText>
                </Box>
            </Toolbar>
        </StyledAppBar>
    );
};

export default Header;
