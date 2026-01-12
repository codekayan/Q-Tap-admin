import axios from "axios"
import { BASE_URL } from "../../../utils/constants";

export const deleteVideo = async (id) => {
    const adminToken = localStorage.getItem('adminToken');
    try {
        const response = await axios.delete(`${BASE_URL}settings/videos/${id}`, {
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