import { useQuery } from "@tanstack/react-query";
import { getFAQ } from "../../../api/admin/setting/getFAQ";

export const useFAQ = () => {
    return useQuery({
        queryKey: ['website-FAQ'],
        queryFn: getFAQ,
    });
};