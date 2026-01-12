import axios from "axios";
import { BASE_URL } from "../../utils/constants";

export const getTableByBranchIdApi = async (branch_id) => {
  try {
    const res = await axios.get(`${BASE_URL}tables/${branch_id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};
