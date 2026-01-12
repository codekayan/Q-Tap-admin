
import axios from "axios"
import { BASE_URL } from "../../../utils/constants"

export const getClientCurrentPlan = async ({ token }) => {
    try {
        const response = await axios.get(`${BASE_URL}client/subscribtion/get_all`, {
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