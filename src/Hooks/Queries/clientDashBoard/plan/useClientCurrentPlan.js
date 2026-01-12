import { useQuery } from "@tanstack/react-query";
import { getClientCurrentPlan } from "../../../../api/Client/plan/getClientCurrentPlan";

export const useClientCurrentPlan = ({ token }) => {
    return useQuery({
        queryKey: ['client-current-plan'],
        queryFn: () => getClientCurrentPlan({ token }),
        enabled: !!token,
    });
};