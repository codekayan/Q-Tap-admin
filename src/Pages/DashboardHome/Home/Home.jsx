import React, { useState } from "react";
import SideBar from "../../../Component/dashboard/SideBar/SideBar";
import { Box, CssBaseline, useTheme } from "@mui/material";
import Content from "../../../Component/DashboardContent/Content";
import TopBar from "../../../Component/dashboard/TopBar/TopBar";
import { OpenSideBarButton } from "../../../Component/MobileSideBarButton/SidebarButton";


export default function Home() {
    const [openSidebar, setOpenSidebar] = useState(false);
    const theme = useTheme()
    const handleToggleSideBar = () => {
        setOpenSidebar(!openSidebar)
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: theme.palette.bodyColor.main,
                color: theme.palette.text.white,
                minHeight: "100vh",
                width: "100%",
                overflow: "hidden",
                transition: "all 0.3s ease-in-out",
            }}>
            {/* sidebar open close button for xs screen */}
            {/* <SidebarButton handleToggleSideBar={handleToggleSideBar} openSidebar={openSidebar}/> */}
            <OpenSideBarButton customSX={{ top: '47px' , padding:''}} handleToggleSideBar={handleToggleSideBar} />
            <CssBaseline />
            <SideBar isOpen={openSidebar} handleToggleSideBar={handleToggleSideBar} />
            <Box
                sx={{
                    flexGrow: 1,
                    width: {
                        sm: "100%",
                        md: 'calc(100% - 200px)'
                    },
                    marginInlineStart: {
                        sm: "0",
                        md: '200px'
                    },
                    minHeight: "100vh",
                    padding: "20px",
                    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",

                }}
            >
                <TopBar />
                <Content />
            </Box>
        </Box>
    );
}
