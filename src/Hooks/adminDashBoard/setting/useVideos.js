import { useQuery } from "@tanstack/react-query";
import { getVideos } from "../../../api/admin/setting/getVideos";

export const useVideos = () => {
    return useQuery({
        queryKey: ['website-videos'],
        queryFn: getVideos,
    });
};