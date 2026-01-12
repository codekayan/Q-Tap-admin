import axios from "axios";

export const registerUser = async ({ method, url, data }) => {
    try {
        const response = await axios({
            method,
            url,
            data,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response
    } catch (error) {
        throw error
    }
}

