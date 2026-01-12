
import { Paper } from '@mui/material';
import { Table1 } from './Table1';
import { Table2 } from './Table2';
import { Box } from '@mui/system';


export const Delivery = () => {
  return (
    <Box sx={{padding:"0px !important"}}>
    <Paper sx={{borderRadius:"20px",padding: '20px 30px',marginTop:"15px" ,whiteSpace:'nowrap',overflowX:'auto'}}><Table1/> </Paper>
    <Paper sx={{borderRadius:"20px",padding: '20px 30px',marginTop:"15px",whiteSpace:'nowrap',overflowX:'auto'}}><Table2/></Paper>


</Box>
  )
}
