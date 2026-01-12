
import axios from "axios"
import { BASE_URL } from "../../../utils/constants"

export const getClientPlanRequests = async ({ token }) => {
    try {
        const response = await axios.get(`${BASE_URL}client/subscribtion/chang_request/get_all_my_request`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        })
        return response
    } catch (error) {
        throw error
    }
}