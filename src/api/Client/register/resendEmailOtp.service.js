import axios from "axios";
import { BASE_URL } from "../../../utils/constants";

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function validateResendEmailOtpApiData(data) {
    const allowedTypes = ["qtap_affiliate", "qtap_clients"];

    if (typeof data.email !== "string") {
        throw new Error("❌ Email must be a string");
    }

    // check if email contains at least 6 numbers
   
    if (!isValidEmail(data.email)) {
        throw new Error("❌ Email must be vaild email");
    }

    if (!allowedTypes.includes(data.user_type)) {
        throw new Error(`❌ user_type must be one of: ${allowedTypes.join(", ")}`);
    }

    return true; // ✅ valid
}

export const resendEmailOtpApi = async ({ data }) => {
    try {

        validateResendEmailOtpApiData(data)

        const res = await axios.post(`${BASE_URL}resendOTP`,
            data,
            {
                headers: {
                    // "Content-Type": "multipart/form-data"
                    'Content-Type': 'application/json'
                }
            }
        );
        return res
    } catch (error) {
        console.error('resend email otp failed:', error);
        throw error;
    }
};