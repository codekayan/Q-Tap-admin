import axios from "axios";
import { BASE_URL } from "../../../utils/constants";


export const registerNewUserApi = async ({ data }) => {
    try {
        console.log("registerNewUserApi", data)
        const res = await axios.post(`${BASE_URL}qtap_clients`, data,
            {
                headers: { "Content-Type": "multipart/form-data" }
            }
        );

        console.log("register success:", res);
        return res
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};
