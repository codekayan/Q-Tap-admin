import axios from "axios";
import { BASE_URL } from "../../../../utils/constants";

/* 
    | body
    | --------------
    | code
    | discount
    | status
*/
export const createPlanDiscountCouponApi = async (data) => {

    const adminToken = localStorage.getItem('adminToken');

    try {
        const response = await axios.post(`${BASE_URL}coupons_plan/store`,
            data,
            {

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