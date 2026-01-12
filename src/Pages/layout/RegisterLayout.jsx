import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router'
import { reset } from '../../store/register/businessSlice';
import useBranchStore from '../../store/zustand-store/register-client-branch-store';

const RegisterLayout = () => {
    const dispatch = useDispatch();
    const resetBranches = useBranchStore(state => state.reset)

    useEffect(() => {

        return () => {
            console.log("reset RegisterLayout")
            dispatch(reset())
            resetBranches()
        }
    }, [])
    return (
        <Outlet />
    )
}

export default RegisterLayout