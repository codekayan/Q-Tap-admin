
import userApi from "../api/userApi";

const resendPhoneOtpApi = async (phone_number) => {


    try {

        const url = `resend_phone_otp`;

        const response = await userApi.post(url,
            { phone_number },
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

export default resendPhoneOtpApi