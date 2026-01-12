import axios from "axios"
import { BASE_URL } from "../../../utils/constants"

export const getPlanPricingApi = async () => {
    try {
        const response = await axios.get(`${BASE_URL}pricing`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return response
    } catch (error) {
        throw error
    }
}