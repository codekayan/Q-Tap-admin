import { Box } from '@mui/system'
import { useState } from 'react'
import UserTable from './UserTable'
import StaffTable from './StaffTable'
import axios from 'axios'
import { BASE_URL,BASE_URL_IMG } from "../../../../utils/constants"

export const User = () => {
    const [userStaff, setUserStaff] = useState([]);
    // Fetch user staff data
    const getUserStaff = async (branchID) => {
        const fetchWithRetry = async (retries, delay) => {
            try {
                const response = await axios.get(`${BASE_URL}resturant_users/${branchID}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem('Token')}`
                    }
                });

                if (response.data) {
                    setUserStaff(response.data.resturant_users || []);
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

    return (
        <Box>
            <UserTable getUserStaff={getUserStaff} userStaff={userStaff} />
            <StaffTable getUserStaff={getUserStaff} userStaff={userStaff} />
        </Box>
    )
}
