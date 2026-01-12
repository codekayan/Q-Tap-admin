import axios from "axios"
import { BASE_URL } from "../../../utils/constants";

export const deleteFeature = async (id) => {
    const adminToken = localStorage.getItem('adminToken');
    try {
        const response = await axios.delete(`${BASE_URL}settings/features/${id}`, {
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