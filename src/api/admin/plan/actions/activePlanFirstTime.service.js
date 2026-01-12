import axios from "axios";
import { BASE_URL } from "../../../../utils/constants";

export const activePlanFirstTime = async (request_id) => {

    const adminToken = localStorage.getItem('adminToken');

    try {
        const response = await axios.post(`${BASE_URL}admin/subscribtion/active/${request_id}`,
            {},
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