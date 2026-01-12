import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import UsageCard from './taps/UsageCard';
import PlanRequests from './taps/plan-request';
import PlanList from './change-plane-component/plan-list';
import ConfirmNewPlan from './change-plane-component/confirm-new-plan';
import ChangePlan from './taps/change-plane-page';


const TabPanel = ({ children, value, index }) => {
    return value === index ? (
        <Box sx={{ p: 2 }}>
            <Typography>{children}</Typography>
        </Box>
    ) : null;
};

export default function PlanTapLayout() {
    const [value, setValue] = useState(0);

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange}>
                <Tab label="Overview" />
                <Tab label="ٌRequests" />
                <Tab label="Change Plan" />
            </Tabs>

            <TabPanel value={value} index={0}>
                <UsageCard />
            </TabPanel>

            <TabPanel value={value} index={1}>
                <PlanRequests />
            </TabPanel>

            <TabPanel value={value} index={2}>
                <ChangePlan />
            </TabPanel>
            
        </Box>
    );
}