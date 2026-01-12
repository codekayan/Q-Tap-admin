import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import Header from './Header'
import { Content } from './Content'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDiscounts } from '../../../../store/client/DiscountMenuSlice'
import { selectSelectedBranch } from '../../../../store/client/clientAdmin'



export const Menu = () => {
  const dispatch = useDispatch()

  const branchId = useSelector(selectSelectedBranch)
  useEffect(() => {
    dispatch(fetchDiscounts(branchId))
  }, [dispatch, branchId])


  return (
    <Box >
      <Header />
      <Content />
    </Box>
  )
}
