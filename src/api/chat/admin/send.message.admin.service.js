import adminApi from "../../api/adminApi";

const sendMessageAdminApi = async (message, chat_id) => {


    try {

        const url = `chat_support/replay`;

        const response = await adminApi.post(url,
            { message, chat_id },
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

export default sendMessageAdminApi