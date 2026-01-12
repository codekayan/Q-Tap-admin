import axios from "axios"
import { BASE_URL } from "../../utils/constants"

export const getUserDataFromCookies = async () => {
    
    try {
        const res = await axios.get(`${BASE_URL}checkCookies`, {
            // withCredentials: true
        })
        return res
    } catch (error) {
        throw new Error(error.message)
    }
}
