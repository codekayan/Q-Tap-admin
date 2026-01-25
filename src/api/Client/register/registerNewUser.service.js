import axios from "axios";
import { BASE_URL } from "../../../utils/constants";


export const registerNewUserApi = async ({ data }) => {
    try {
        console.log("registerNewUserApi received data:", data);
        console.log("registerNewUserApi data type:", data.constructor.name);
        
        // Log FormData contents
        if (data instanceof FormData) {
            console.log("FormData contents:");
            for (let [key, value] of data.entries()) {
                console.log(`  ${key}:`, value);
            }
        }
        
        const res = await axios.post(`${BASE_URL}qtap_clients`, data,
            {
                headers: { "Content-Type": "multipart/form-data" }
            }
        );

        console.log("register success:", res);
        return res
    } catch (error) {
        console.error('Register failed:', error);
        throw error;
    }
};
