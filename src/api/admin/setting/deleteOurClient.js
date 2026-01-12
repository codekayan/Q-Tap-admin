import axios from "axios"
import { BASE_URL } from "../../../utils/constants";

export const deleteOurClient = async (id) => {
    const adminToken = localStorage.getItem('adminToken');
    try {
        const response = await axios.delete(`${BASE_URL}settings/our-clients/${id}`, {
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