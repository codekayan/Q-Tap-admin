import userApi from "../../api/userApi";

/**
 * @typedef {Object} ChatUserPayload
 * @property {string} chat_id
 * @property {string} message
 */

/**
 * Register chat user
 * @param {ChatUserPayload} payload
 * @returns {Promise<any>}
 */

const sendMessageUserApi = async (payload) => {


    try {

        const url = `chat_support`;

        const response = await userApi.post(url,
            payload,
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

export default sendMessageUserApi