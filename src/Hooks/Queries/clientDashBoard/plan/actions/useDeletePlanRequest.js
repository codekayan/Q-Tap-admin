import { useMutation } from "@tanstack/react-query";
import { deletePlanRequestApi } from "../../../../../api/Client/plan/actions/delete.Plan.Request.service";

export const useDeletePlanRequest = () => {
    return useMutation({
        mutationFn: deletePlanRequestApi,
    });
};