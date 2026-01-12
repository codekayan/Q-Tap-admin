import axios from "axios"
import { BASE_URL } from "../../../utils/constants";

export const getFAQ= async () => {
    const adminToken = localStorage.getItem('adminToken');
    try {
        const response = await axios.get(`${BASE_URL}settings/faq`, {
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