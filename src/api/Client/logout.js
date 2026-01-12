import axios from "axios";
import { BASE_URL } from "../../utils/constants";


export const logout = async () => {
    try {
        const token = localStorage.getItem('Token'); // or get from Zustand, context, etc.

        const res = await axios.post(`${BASE_URL}logout`, null, {
            // withCredentials: true, // ✅ send cookies
            headers: {
                Authorization: `Bearer ${token}`, // ✅ add Bearer token
            }
        });

        console.log("Logout success:", res.data);
    } catch (error) {
        console.error('Logout failed:', error.response?.data || error.message);
    }
};
