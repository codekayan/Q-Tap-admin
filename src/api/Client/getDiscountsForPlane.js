import axios from "axios"
import { BASE_URL } from "../../utils/constants"

export const getPlanDiscount = async () => {
    try {
        const response = await axios.get(`${BASE_URL}discount`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return response
    } catch (error) {
        throw error
    }
}
