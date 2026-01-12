import adminApi from "../../api/adminApi";

const getMessagesAdminApi = async (chat_id) => {
    try {

        const url = `chat_support/show/${chat_id}`;

        const response = await adminApi.get(url,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        return response?.data

    } catch (error) {
        throw error
    }
}
export default getMessagesAdminApi