import { useQuery } from "@tanstack/react-query";
import { getContent } from "../../../api/admin/setting/getContent";

export const useFeature = () => {
    return useQuery({
        queryKey: ['website-content'],
        queryFn: getContent,
    });
};