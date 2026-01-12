import { useQuery } from "@tanstack/react-query";
import { getClientChangeRequest } from "../../../../api/admin/plan/getClientChangeRequest.service";

export const useGetClientPlanRequest = (page = 1) => {
    return useQuery({
        queryKey: ['admin-client-plan-request',page],
        queryFn: () => getClientChangeRequest(page),

    });
};