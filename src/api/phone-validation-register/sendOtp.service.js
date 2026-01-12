
import userApi from "../api/userApi";

const sendPhoneOtpApi = async (phone_number) => {


    try {

        const url = `send_phone_otp`;

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

export default sendPhoneOtpApi