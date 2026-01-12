
import userApi from "../api/userApi";

const verifyPhoneOtpApi = async (phone_number, otp_code) => {


    try {

        const url = `verify_phone_otp`;

        const response = await userApi.post(url,
            { phone_number, otp_code },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            });

        return response

    } catch (error) {
        throw error
    }
}

export default verifyPhoneOtpApi