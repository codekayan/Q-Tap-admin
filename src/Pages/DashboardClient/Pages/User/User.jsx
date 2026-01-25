import { Box } from '@mui/system'
import { useState, useEffect } from 'react'
import UserTable from './UserTable'
import StaffTable from './StaffTable'
import axios from 'axios'
import { BASE_URL,BASE_URL_IMG } from "../../../../utils/constants"
import { useSelector } from 'react-redux'
import { selectSelectedBranch } from '../../../../store/client/clientAdmin'

export const User = () => {
    const [userStaff, setUserStaff] = useState([]);
    const branchID = useSelector(selectSelectedBranch);

    // Fetch user staff data
    const getUserStaff = async (branchID) => {
        if (!branchID) return;
        
        const fetchWithRetry = async (retries, delay) => {
            try {
                const response = await axios.get(`${BASE_URL}restaurant_user_staff/${branchID}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem('Token')}`
                    }
                });

                if (response.data) {
                    const data = response.data.restaurant_user_staff || [];
                    setUserStaff(data);
                    console.log("User staff data loaded:", data);
                }
            } catch (error) {
                if (error.response?.status === 429 && retries > 0) {
                    setTimeout(() => fetchWithRetry(retries - 1, delay * 2), delay);
                } else {
                    console.log("error userStaff data ", error);
                }
            }
        };

        fetchWithRetry(3, 1000); // Retry up to 3 times with an initial delay of 1 second
    };

    // Fetch data when branchID changes
    useEffect(() => {
        let isMounted = true;
        if (isMounted && branchID) {
            getUserStaff(branchID);
        }
        return () => {
            isMounted = false;
        };
    }, [branchID]);

    return (
        <Box>
            <UserTable getUserStaff={getUserStaff} userStaff={userStaff} setUserStaff={setUserStaff} />
            <StaffTable userStaff={userStaff} />
        </Box>
    )
}
