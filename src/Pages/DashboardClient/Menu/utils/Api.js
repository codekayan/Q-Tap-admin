import axios from "axios";
import { BASE_URL } from "../../../../utils/constants"

export const getSpecialOffers = async (branchId) => {
    if (!branchId) {
        throw new Error("Branch ID is required to fetch special offers.");
    }

    try {
        const response = await axios.get(`${BASE_URL}meals_special_offers`, {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                brunch_id: branchId,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching special offers:", error);
        throw new Error("Unable to fetch special offers. Please try again later.");
    }
};