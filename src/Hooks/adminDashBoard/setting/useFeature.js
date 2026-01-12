import { useQuery } from "@tanstack/react-query";
import { getFeature } from "../../../api/admin/setting/getFeature";

export const useFeature = () => {
    return useQuery({
        queryKey: ['website-feature'],
        queryFn: getFeature,
    });
};