
import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';

import NewUserTable from './component/NewUsersTable';
import UserPlanRequests from './component/UserPlanRequests';



const TabPanel = ({ children, value, index }) => {
  return value === index ? (
    <Box sx={{ p: 2 }}>
      <Typography>{children}</Typography>
    </Box>
  ) : null;
};


const ClientsPlanTables = () => {

  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="New User" />
        <Tab label="ٌRequests" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <NewUserTable />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <UserPlanRequests />
      </TabPanel>
    </Box>
  )
}

export default ClientsPlanTables






