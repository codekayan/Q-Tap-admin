import { useQuery } from "@tanstack/react-query";
import { getOurClient } from "../../../api/admin/setting/getOurClient";

export const useOurClient = () => {
    return useQuery({
        queryKey: ['website-our-client'],
        queryFn: getOurClient,
    });
};