import React, { useEffect, useRef, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import SideBar from './SideBar';
import Content from './Content';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenuData, selectMenuData, selectMenuDataStatus } from '../../../store/client/menuSlice';
import { useQuery } from '@tanstack/react-query';
const MenuClient = () => {
    const [selectedCategory, setSelectedCategory] = useState('Popular');

    const dispatch = useDispatch()
    // const data = useSelector(selectMenuData)
    // const status = useSelector(selectMenuDataStatus)
    // const allMenuData = data?.data
    // const hasFetched = useRef(false);

    // useEffect(() => {
    //     if (!hasFetched.current && status !== 'success') {
    //         const branch = localStorage.getItem('selectedBranch');
    //         dispatch(fetchMenuData(branch));
    //         hasFetched.current = true;
    //     }
    // }, [dispatch, status]);
    const branch = localStorage.getItem('selectedBranch');
    const query = useQuery({
        queryKey: ['menu', branch],
        queryFn: async () => {
            const action = await dispatch(fetchMenuData(branch));
            if (fetchMenuData.fulfilled.match(action)) {
                return action.payload;
            } else {
                throw new Error(action.error.message || 'Failed to fetch menu');
            }
        },
        staleTime: 1000 * 60 * 5, // optional: cache for 5 minutes
    });

    const theme = useTheme()
    const allMenuData = query?.data?.data
    console.log('allMenuData', allMenuData , selectedCategory);

    
    return (
        <Box sx={{ display: 'flex', background: theme.palette.bodyColor.whiteGray_lightBlack, padding: "20px 0px", minHeight: "100vh" }}>
            <SideBar
                setSelectedCategory={setSelectedCategory}
                allMenuData={allMenuData}
                selectedCategory={selectedCategory}
            />
            <Box sx={{ flex: 1, maxWidth: { xs: "100vw", sm: 'calc(100vw - 100px)' }, marginX: { xs: '0px', sm: '100px' } }}>
                <Content
                    allMenuData={allMenuData}
                    selectedCategory={selectedCategory}
                />
            </Box>
        </Box>
    );
};

export default MenuClient;