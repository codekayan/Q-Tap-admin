import { useMutation } from "@tanstack/react-query";
import { activePlanFirstTime } from "../../../../../api/admin/plan/actions/activePlanFirstTime.service";

export const useActivePlanFirstTime = () => {
    return useMutation({
        mutationFn: ({request_id}) => activePlanFirstTime(request_id),
    });
};