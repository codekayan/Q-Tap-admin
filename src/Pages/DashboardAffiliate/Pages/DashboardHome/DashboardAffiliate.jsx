import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { Row1 } from './Row1'
import { Row2 } from './Row2'
import { Row3 } from './Row3'
import axios from 'axios'
import { BASE_URL } from "../../../../utils/constants";

export const DashboardAffiliate = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [userData , setUserData] = useState(null)

  const handleAffiliateData = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(

        `${BASE_URL}get_myinfo`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('affiliateToken')}`
          },

        }
      );

      setUserData(response.data.affiliate)
    } catch (error) {

      console.log(error)

    } finally {
      setIsLoading(false)
    }
  }
useEffect(()=>{
  handleAffiliateData()
},[])

  return (
    <Box sx={{ padding: "0px 20px" }}>
      <Row1 />
      <Row2 />
      <Row3 code={userData?.code} />

    </Box>
  )
}
