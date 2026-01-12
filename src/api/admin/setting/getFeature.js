import axios from "axios"
import { BASE_URL } from "../../../utils/constants";

export const getFeature = async () => {
    const adminToken = localStorage.getItem('adminToken');
    try {
        const response = await axios.get(`${BASE_URL}settings/features`, {
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