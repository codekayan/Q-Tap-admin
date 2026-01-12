import { Box } from '@mui/system'
import React from 'react'
import UserOptions from './UserOptions'
import Language from './dashboard/TopBar/Language'
import DarkModeSwitch from './DarkModeSwitch'
import { Grid } from '@mui/material'



const SidebarExtraMobileSection = ({ customSX = {} }) => {
    return (
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, ...customSX }}>
            <Grid container>
                <Grid item xs={12} justifyContent={'space-between'} display={'flex'} alignItems={'center'} padding={"10px 0px"}>
                    <DarkModeSwitch />
                    <Language />
                </Grid>
                    <UserOptions customSX={{ justifyContent: 'center' }} />
                    
            </Grid>

        </Box>
    )
}

export default SidebarExtraMobileSection