import axios from "axios"
import { BASE_URL } from "../../../../utils/constants"

export const deletePlanRequestApi = async ({ token, request_id }) => {
    try {
        const response = await axios.delete(`${BASE_URL}client/subscribtion/chang_request/delete/${request_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            }
        )
        
        return response
    } catch (error) {
        throw error
    }
}
