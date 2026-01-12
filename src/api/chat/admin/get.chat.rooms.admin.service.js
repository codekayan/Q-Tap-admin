import adminApi from "../../api/adminApi";

const getChatRoomsAdminApi = async (status) => {
    try {

        const url = `chat_support/index`;

        const response = await adminApi.get(url,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                params: status ? { status } : undefined,
            });

        return response?.data

    } catch (error) {
        throw error
    }
}
export default getChatRoomsAdminApi