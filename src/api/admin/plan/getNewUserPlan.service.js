import axios from "axios"
import { BASE_URL } from "../../../utils/constants";

export const getNewUserPlan = async (page, status) => {
    const params = new URLSearchParams();
    params.append('page', page);
    if (status) params.append('status', status);

    const url = `admin/subscribtion/get_all/?${params.toString()}`;

    const adminToken = localStorage.getItem('adminToken');
    
    try {
        const response = await axios.get(`${BASE_URL}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`
            }
        })
        return response
    } catch (error) {
        throw error
    }
}