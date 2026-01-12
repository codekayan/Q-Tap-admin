import axios from "axios";
import { BASE_URL } from "../../../utils/constants";

const getEgyptGovernoralesApi = async () => {


    try {

        const url = `${BASE_URL}governorates`;

        const response = await axios.get(url,
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


export default getEgyptGovernoralesApi