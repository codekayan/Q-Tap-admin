import axios from "axios"
import { BASE_URL } from "../../../utils/constants";

export const getClientChangeRequest = async (page) => {

    const adminToken = localStorage.getItem('adminToken');
    try {
        const response = await axios.get(`${BASE_URL}admin/subscribtion/change_request/?page=${page}&status=pending`, {
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