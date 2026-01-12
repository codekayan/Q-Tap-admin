import axios from "axios";
import { BASE_URL } from "../../../../utils/constants";

export const handleChangeRequest = async (request_id, payload) => {

    const adminToken = localStorage.getItem('adminToken');
    //status" : "approved"  //rejected
    try {
        const response = await axios.post(`${BASE_URL}admin/subscribtion/update_change_request/${request_id}`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminToken}`
                }
            }
        )

        return response

    } catch (error) {
        console.log(error)
        throw error

    }
}