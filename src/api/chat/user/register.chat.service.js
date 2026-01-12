import userApi from "../../api/userApi";


/**
 * @typedef {Object} ChatUserPayload
 * @property {string} name
 * @property {string} email
 * @property {string} message
 */

/**
 * Register chat user
 * @param {ChatUserPayload} payload
 * @returns {Promise<any>}
 */

const  registerChatUserApi = async (payload) => {


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

export default registerChatUserApi