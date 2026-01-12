import userApi from "../../api/userApi";

const getMessagesUserApi = async (email) => {
    try {

        const url = `chat_support/get_last`;

        const response = await userApi.post(url, null,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                params: { email }
            });
        return response?.data

    } catch (error) {
        throw error
    }
}
export default getMessagesUserApi