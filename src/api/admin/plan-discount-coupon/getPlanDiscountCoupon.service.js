import axios from "axios";
import { BASE_URL } from "../../../utils/constants";


export const getPlanDiscoutnCouponApi = async () => {

    const url = `coupons_plan/index`;

    const adminToken = localStorage.getItem('adminToken');

    try {
        const response = await axios.get(`${BASE_URL}${url}`, {
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