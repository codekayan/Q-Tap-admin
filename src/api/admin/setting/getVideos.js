import axios from "axios"
import { BASE_URL } from "../../../utils/constants";

export const getVideos = async () => {
    const adminToken = localStorage.getItem('adminToken');
    try {
        const response = await axios.get(`${BASE_URL}settings/videos`, {
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