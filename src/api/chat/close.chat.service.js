
import userApi from "../api/userApi";

const closeChatApi = async (email, chat_id) => {


    try {

        const url = `chat_support/closed`;

        const response = await userApi.post(url,
            { email, chat_id },
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

export default closeChatApi