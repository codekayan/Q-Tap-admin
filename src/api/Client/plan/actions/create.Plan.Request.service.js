/**
 *  |------------------------------------------------------------
    | body
    |------------------------------------------------------------
    | action_type
    | pricing_way
    | payment_method
    | new_pricing_id "optional with action_type  upgrade"
    |-------------------------------------------------------------
 */

import axios from "axios"
import { BASE_URL } from "../../../../utils/constants"

export const createPlanRequestApi = async ({ token, user_id, payload }) => {
    try {
        const response = await axios.post(`${BASE_URL}client/subscribtion/chang_request/${user_id}`,
            payload,
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
