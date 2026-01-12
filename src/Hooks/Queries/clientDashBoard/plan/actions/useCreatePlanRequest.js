import { useMutation } from "@tanstack/react-query";
import { createPlanRequestApi } from "../../../../../api/Client/plan/actions/create.Plan.Request.service";

export const useCreatePlanRequest = () => {
  return useMutation({
    mutationFn: createPlanRequestApi,
  });
};