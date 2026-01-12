import axios from "axios";
import { BASE_URL } from "../../../../utils/constants";

/* 
    | body
    | --------------
    | code
    | discount
    | status
*/
export const updatePlanDiscountCouponApi = async (coupon_id, data) => {

    const adminToken = localStorage.getItem('adminToken');

    try {
        const response = await axios.put(`${BASE_URL}coupons_plan/update/${coupon_id}`,
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