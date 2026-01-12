import { useQuery } from "@tanstack/react-query";
import { getNewUserPlan } from "../../../../api/admin/plan/getNewUserPlan.service";

export const useGetNewUserActivePlanRequest = (page = 1, status) => {
    return useQuery({
        queryKey: ['admin-new-client-plan-active', page , status],
        queryFn: () => getNewUserPlan(page, status),

    });
};