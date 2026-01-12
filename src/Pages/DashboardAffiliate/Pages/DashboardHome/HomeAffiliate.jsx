import React, { useState } from "react";
import SideBar from "../../Component/SideBar/SideBar";
import TopBar from "../../Component/TopBar/TopBar";
import Content from "../../Component/Content/Content";
import SidebarButton from "../../../../Component/MobileSideBarButton/SidebarButton";
import { Box, useTheme } from "@mui/system";
import { CssBaseline } from "@mui/material";

export default function HomeAffiliate() {
    const [mode, setMode] = useState('light'); 
    const [isSidebarOpen,setSidebarOpen] = useState(false)
    const handleToggleSideBar = ()=>{
        setSidebarOpen(!isSidebarOpen)
    }
    const theme = useTheme()
    return (
        <Box
            
            sx={{
                display: "flex",flexDirection:"row",
                backgroundColor: mode === 'dark' ? '#181616' : theme.palette.bodyColor.main,
                color: mode === 'dark' ? '#181616' : '#000',
                width:"100%" , minHeight:"105vh",
                paddingRight:"0px !important",
            
            }}
            >
            <CssBaseline />
            <SidebarButton handleToggleSideBar={handleToggleSideBar} openSidebar={isSidebarOpen} top={'30px'}/>
            <SideBar isOpen={isSidebarOpen} />
            <Box sx={{ flexGrow: 1,width:"100%",marginInlineStart: {xs:'0px',md:'200px'}, overflow: "hidden" }}>
                <TopBar mode={mode} setMode={setMode} />  
                <Content />
            </Box>
        </Box>
    );
}
