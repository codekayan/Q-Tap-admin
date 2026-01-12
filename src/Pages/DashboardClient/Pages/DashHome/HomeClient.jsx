import { useEffect, useState } from "react";
import { Box, CssBaseline, useTheme } from "@mui/material";

import SideBar from "../../ComponentDashClient/SideBar/SideBar";
import TopBar from "../../ComponentDashClient/TopBar/TopBar";
import Content from "../../ComponentDashClient/Content/Content";
import SidebarButton from "../../../../Component/MobileSideBarButton/SidebarButton";
import { fetchGetInfoData, selectBranchById, selectSelectedBranch } from "../../../../store/client/clientAdmin";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../../../../store/client/clientDashBoardSlice";
import { useQuery } from "@tanstack/react-query";


export default function HomeClient() {
    const theme = useTheme()


    const [isSideBarOpen, setisSideBarOpen] = useState(false);
    const dispatch = useDispatch()

    const handleOpenSideBar = () => {
        setisSideBarOpen(!isSideBarOpen)
    }

    // const selectedBranch = localStorage.getItem("selectedBranch");
    const selectedBranchId = useSelector(selectSelectedBranch)
    const branch = useSelector(selectBranchById(selectedBranchId))
    
    // console.log("selectedBranch homeClient change ::",branch.default_mode) //debug log
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['dashboard', selectedBranchId],
        queryFn: async () => {
            const action = await dispatch(fetchDashboardData(selectedBranchId));
            if (fetchDashboardData.fulfilled.match(action)) {
                return action.payload;
            } else {
                throw new Error(action.error?.message || 'Failed to fetch dashboard data');
            }
        },
        staleTime: 5 * 60 * 1000, // optional
    });

    useEffect(() => {
        dispatch(fetchGetInfoData())
    }, [dispatch])

    useEffect(() => {
        if(branch){
        localStorage.setItem("themeMode", branch.default_mode)
    }
    }, [selectedBranchId])
    

    // if (!user || !allowedRoles.includes(user.role)) {
    //     return <Navigate to="/unauthorized" />; // or redirect to login
    // }
    return (
        <Box
            sx={{
                display: "flex", flexDirection: "row",
                backgroundColor: theme.palette.bodyColor.main,
                color: '#000',
                width: "100%", minHeight: "100vh",
                paddingRight: "0px !important",

            }}
        >
            <CssBaseline />
            <SidebarButton top={'30px'} openSidebar={isSideBarOpen} handleToggleSideBar={handleOpenSideBar} />
            <SideBar isOpen={isSideBarOpen} />
            <Box sx={{ flexGrow: 1, width: "100%", padding: "0px 30px ", marginInlineStart: { sm: "0px", md: '200px' }, overflow: "hidden" }}>
                <TopBar />
                <Content />
            </Box>
        </Box>
    );
}