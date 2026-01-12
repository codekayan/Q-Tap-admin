/**
 *  |------------------------------------------------------------
    | body
    |------------------------------------------------------------
    |  "code": "test"
    |-------------------------------------------------------------
 */

import axios from "axios"
import { BASE_URL } from "../../../../utils/constants"


export const checkPlanDiscountCouponApi = async ({ data }) => {
    try {
        const response = await axios.post(`${BASE_URL}checkPlanStatus`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )

        return response
    } catch (error) {
        throw error
    }
}
