import axios from "axios";
import { BASE_URL } from "../../../utils/constants";

const getEgyptCityByGovernIdApi = async ({ govern_id }) => {


    try {

        const url = `${BASE_URL}governorates/cities/${govern_id}`;

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


export default getEgyptCityByGovernIdApi