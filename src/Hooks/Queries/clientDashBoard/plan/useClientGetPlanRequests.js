import { useQuery } from "@tanstack/react-query";
import { getClientPlanRequests } from "../../../../api/Client/plan/getClientPlanRequests";

export const useClientGetPlanRequests = ({ token }) => {
    return useQuery({
        queryKey: ['client-current-plan-request'],
        queryFn: () => getClientPlanRequests({ token }),
        enabled: !!token,
    });
};