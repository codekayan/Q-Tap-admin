import { Box } from '@mui/system'
import React from 'react'
import { Row1 } from './Row1/Row1.jsx';
import { Row2 } from './Row2/Row2';
import { Row3 } from './Row3/Row3.jsx';

const Wallet = () => {
  return (
    <Box padding={"0px 20px"}>
      <Row1 /> 
      <Row2 />
      <Row3 />  

    </Box>
  )
}
export default Wallet ;